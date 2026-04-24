// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DocumentVerification {
    struct Document {
        string hash;
        string ipfsHash;
        address uploader;
        uint timestamp;
    }

    mapping(string => Document) public documents;
    
    event DocumentAdded(string hash, string ipfsHash, address uploader, uint timestamp);

    function addDocument(string memory hash, string memory ipfsHash) public {
        require(documents[hash].timestamp == 0, "Document already exists!");
        
        documents[hash] = Document({
            hash: hash,
            ipfsHash: ipfsHash,
            uploader: msg.sender,
            timestamp: block.timestamp
        });
        
        emit DocumentAdded(hash, ipfsHash, msg.sender, block.timestamp);
    }

    function verifyDocument(string memory hash) public view returns (bool) {
        return documents[hash].timestamp != 0;
    }

    function getDocument(string memory hash) public view returns (string memory, string memory, address, uint) {
        require(documents[hash].timestamp != 0, "Document does not exist!");
        Document memory doc = documents[hash];
        return (doc.hash, doc.ipfsHash, doc.uploader, doc.timestamp);
    }
}
