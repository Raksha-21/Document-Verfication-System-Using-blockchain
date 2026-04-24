import React, { useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import contractConfig from '../contractConfig.json';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [intermediateHashes, setIntermediateHashes] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setIntermediateHashes(null);
      setStatus("");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    if (typeof window.ethereum === 'undefined') {
      alert("Please install MetaMask to upload documents!");
      return;
    }

    setIsLoading(true);
    setStatus("Preparing document and uploading to IPFS...");
    
    const formData = new FormData();
    formData.append('document', file);

    try {
      // 1. Send file to backend to get the SHA256 hash and IPFS upload
      const response = await axios.post('http://localhost:5000/api/uploadDocument', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (!response.data.success) {
        setStatus("Backend preparation failed.");
        setIsLoading(false);
        return;
      }

      const { hash, ipfsHash } = response.data.data;
      
      setIntermediateHashes({ hash, ipfsHash });
      setStatus("Please confirm the transaction in MetaMask...");

      // 2. Connect to MetaMask and get Signer
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Auto-switch to Localhost Network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x7a69' }], // 31337 in hex
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x7a69',
                  chainName: 'Localhost 8545',
                  rpcUrls: ['http://127.0.0.1:8545'],
                  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }
                },
              ],
            });
          } catch (addError) {
            console.error('Error adding network:', addError);
          }
        }
      }

      // We use BrowserProvider for ethers v6
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // 3. Create Contract Instance
      const contract = new ethers.Contract(contractConfig.address, contractConfig.abi, signer);

      // 4. Send Transaction via MetaMask
      const tx = await contract.addDocument(hash, ipfsHash);
      
      setStatus("Transaction sent! Waiting for confirmation...");
      
      // 5. Wait for transaction to be mined
      const receipt = await tx.wait();

      setStatus("Success! Document verified and stored on Blockchain.");
      setResult({
        hash: hash,
        ipfsHash: ipfsHash,
        transactionHash: tx.hash
      });

    } catch (error) {
      console.error(error);
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        setStatus("Transaction was cancelled in MetaMask.");
      } else {
        setStatus("An error occurred during blockchain upload. See console.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Upload Document (Admin)</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', marginTop: '0.5rem' }}>
        Store a document securely on the blockchain. You will need to confirm the transaction in MetaMask.
      </p>
      
      <form onSubmit={handleUpload}>
        <div className="form-group">
          <label className="form-label">Select Document</label>
          <input type="file" className="form-input" onChange={handleFileChange} required />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isLoading || !file} style={{ width: '100%' }}>
          {isLoading ? "Processing..." : "Upload & Sign Document"}
        </button>
      </form>

      {status && <p style={{ marginTop: '1.5rem', textAlign: 'center', fontWeight: 'bold' }}>{status}</p>}

      {intermediateHashes && !result && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', wordBreak: 'break-all' }}>
          <p><strong>SHA256 Hash Generated:</strong> <br/>{intermediateHashes.hash}</p>
          <p style={{ marginTop: '0.5rem' }}><strong>IPFS Link Generated:</strong> <br/>{intermediateHashes.ipfsHash}</p>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}><em>Waiting for Blockchain Transaction...</em></p>
        </div>
      )}

      {result && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', wordBreak: 'break-all' }}>
          <p><strong>SHA256 Hash:</strong> <br/>{result.hash}</p>
          <p style={{ marginTop: '0.5rem' }}><strong>IPFS Link:</strong> <br/>{result.ipfsHash}</p>
          <p style={{ marginTop: '0.5rem', color: 'var(--success)' }}><strong>Tx Hash:</strong> <br/>{result.transactionHash}</p>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
