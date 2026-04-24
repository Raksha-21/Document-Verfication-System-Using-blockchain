# Blockchain Based Document Verification System

A complete full-stack Web3 application for verifying the authenticity of documents using Ethereum and IPFS. 

## Features
- **Admin**: Upload documents, automatically generate SHA256 hashes, simulate storing to IPFS, and permanently record the hash on a local Ethereum blockchain.
- **User/Verifier**: Upload a document to instantly verify if it matches the blockchain record and ensure it hasn't been tampered with.
- **Metamask Integration**: Connect your wallet to the decentralized application.
- **Modern UI**: Built with React, featuring a premium Glassmorphism design system.

## Project Structure
- `/contracts`: Solidity smart contracts.
- `/scripts`: Hardhat deployment scripts.
- `/backend`: Node.js Express API to handle hashing, mock IPFS uploads, and blockchain transactions using Ethers.js.
- `/frontend`: React app (built with Vite) for the user interface.

## Prerequisites
- Node.js (v16+)
- MetaMask browser extension

## Setup & Running Instructions

You need to run 3 separate terminal processes for the Blockchain, Backend, and Frontend.

### 1. Blockchain (Hardhat Node)
Open a terminal in the root directory (`document-verification-system`) and run:
```bash
npx hardhat node
```
This will start a local Ethereum network and give you 20 test accounts. Leave this terminal running.

Open a *second* terminal in the root directory and deploy the smart contract:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

### 2. Backend Server
Open a *third* terminal in the `/backend` directory:
```bash
cd backend
npm install
node server.js
```
The server will run on `http://localhost:5000`.

### 3. Frontend App
Open a *fourth* terminal in the `/frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
Open the provided local URL (usually `http://localhost:5173`) in your browser to interact with the app.

## How Verification Works
1. **Upload**: When a document is uploaded via the Admin panel, the backend generates a unique SHA256 hash of the file contents.
2. **Storage**: The document is simulated to be uploaded to IPFS. The resulting IPFS CID and the SHA256 hash are sent to the Smart Contract.
3. **Immutability**: The Smart Contract (`DocumentVerification.sol`) permanently records the hash, the uploader's address, and the timestamp.
4. **Verification**: When a user uploads a document for verification, the system calculates its SHA256 hash again. If even a single byte of the file was changed, the hash will be completely different. The app checks if this exact hash exists on the blockchain. If it does, the document is mathematically proven to be authentic and unmodified since it was originally uploaded.
