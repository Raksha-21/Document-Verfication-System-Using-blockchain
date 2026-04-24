const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const { uploadToIPFS } = require('./ipfs');
const { addDocumentToBlockchain, verifyDocumentOnBlockchain, getAllDocuments } = require('./blockchain');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Helper to calculate SHA256
const generateHash = (buffer) => {
    return crypto.createHash('sha256').update(buffer).digest('hex');
};

router.post('/uploadDocument', upload.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        // 1. Generate SHA256 hash
        const fileBuffer = req.file.buffer;
        const hash = generateHash(fileBuffer);

        // 2. Upload file to IPFS
        const ipfsHash = await uploadToIPFS(fileBuffer);

        // We return the hashes to the frontend so the frontend can trigger MetaMask
        res.json({
            success: true,
            message: 'Document prepared for blockchain',
            data: {
                hash,
                ipfsHash
            }
        });
    } catch (error) {
        console.error("Error uploading document:", error);
        res.status(500).json({ success: false, message: error.message || 'Error uploading document' });
    }
});

router.post('/verifyDocument', upload.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        // 1. Generate hash
        const fileBuffer = req.file.buffer;
        const hash = generateHash(fileBuffer);

        // 2. Check hash from blockchain
        const isValid = await verifyDocumentOnBlockchain(hash);

        res.json({
            success: true,
            isValid: isValid,
            hash: hash
        });
    } catch (error) {
        console.error("Error verifying document:", error);
        res.status(500).json({ success: false, message: 'Error verifying document' });
    }
});

router.get('/documents', async (req, res) => {
    // Return all stored documents
    // Note: Solidity mappings can't be fetched all at once easily without an array
    // Since we don't have an array in the contract, we can fetch events to get all documents.
    try {
        const documents = await getAllDocuments();
        res.json({
            success: true,
            documents: documents
        });
    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).json({ success: false, message: 'Error fetching documents' });
    }
});

module.exports = router;
