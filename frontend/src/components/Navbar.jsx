import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ethers } from 'ethers';

const Navbar = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const location = useLocation();

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    } else {
      alert('MetaMask is not installed. Please install it to use this feature.');
    }
  };

  const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      <div className="nav-brand">BlockVerify</div>
      <div className="nav-links">
        <Link to="/" className={isActive('/')}>Home</Link>
        <Link to="/upload" className={isActive('/upload')}>Upload</Link>
        <Link to="/verify" className={isActive('/verify')}>Verify</Link>
        <Link to="/documents" className={isActive('/documents')}>Documents</Link>
        
        <button className="btn btn-primary" onClick={connectWallet}>
          {walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}` : "Connect Wallet"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
