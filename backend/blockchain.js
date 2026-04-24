const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// RPC provider (Hardhat local node)
const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');

// For local testing, Hardhat provides 20 accounts. We'll use the first one's private key.
const ADMIN_PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const wallet = new ethers.Wallet(ADMIN_PRIVATE_KEY, provider);

// Load Contract ABI and Address
let contract;

function getContract() {
    if (contract) return contract;

    try {
        const addressPath = path.join(__dirname, '..', 'contract-address.json');
        if (!fs.existsSync(addressPath)) {
            throw new Error("Contract address file not found. Please deploy the contract first.");
        }
        const { address } = JSON.parse(fs.readFileSync(addressPath, 'utf8'));

        const artifactPath = path.join(__dirname, '..', 'artifacts', 'contracts', 'DocumentVerification.sol', 'DocumentVerification.json');
        if (!fs.existsSync(artifactPath)) {
            throw new Error("Contract artifact not found. Please compile the contract.");
        }
        const { abi } = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

        contract = new ethers.Contract(address, abi, wallet);
        return contract;
    } catch (e) {
        console.error("Failed to initialize contract:", e);
        throw e;
    }
}

async function addDocumentToBlockchain(hash, ipfsHash) {
    const docContract = getContract();
    
    // Call the smart contract function
    const tx = await docContract.addDocument(hash, ipfsHash);
    
    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    return receipt;
}

async function verifyDocumentOnBlockchain(hash) {
    const docContract = getContract();
    
    // Call the view function
    const isValid = await docContract.verifyDocument(hash);
    return isValid;
}

async function getAllDocuments() {
    const docContract = getContract();
    
    // Since mapping can't be iterated, we query the DocumentAdded events
    // to build a list of all documents.
    const filter = docContract.filters.DocumentAdded();
    const events = await docContract.queryFilter(filter);
    
    const documents = events.map(event => {
        return {
            hash: event.args[0], // hash
            ipfsHash: event.args[1], // ipfsHash
            uploader: event.args[2], // uploader
            timestamp: Number(event.args[3]) // timestamp
        };
    });
    
    return documents.reverse(); // newest first
}

module.exports = {
    addDocumentToBlockchain,
    verifyDocumentOnBlockchain,
    getAllDocuments
};
