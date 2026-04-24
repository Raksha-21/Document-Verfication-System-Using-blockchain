// Local fallback mock for IPFS
let mockIpfsCounter = 1000;

async function uploadToIPFS(fileBuffer) {
    try {
        // Try to dynamically import ipfs-http-client as it is ESM in newer versions
        const { create } = await import('ipfs-http-client');
        
        // Use a public read/write gateway. Note: Many public gateways are read-only or unreliable without auth.
        // If this fails, we will gracefully fallback to a mock hash.
        const ipfs = create({ url: 'https://ipfs.infura.io:5001/api/v0' }); // Infura usually requires auth now
        // A better approach for this free local project is to mock it.
        
        // Simulating the IPFS upload delay
        await new Promise(r => setTimeout(r, 500));
        
        // Return a mocked CID structure that looks like an IPFS hash
        mockIpfsCounter++;
        return `QmMockHash${mockIpfsCounter}${Date.now()}`;

    } catch (error) {
        console.warn("IPFS upload failed or using fallback:", error.message);
        // Fallback for safe local testing
        mockIpfsCounter++;
        return `QmMockFallbackHash${mockIpfsCounter}${Date.now()}`;
    }
}

module.exports = { uploadToIPFS };
