import React, { useState } from 'react';
import axios from 'axios';

const VerifyForm = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setVerificationResult(null); // reset on new file
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    
    const formData = new FormData();
    formData.append('document', file);

    try {
      const response = await axios.post('http://localhost:5000/api/verifyDocument', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setVerificationResult(response.data);
    } catch (error) {
      console.error(error);
      setVerificationResult({ success: false, error: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Verify Document</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', marginTop: '0.5rem' }}>
        Check if a document is authentic and unmodified.
      </p>
      
      <form onSubmit={handleVerify}>
        <div className="form-group">
          <label className="form-label">Select Document to Verify</label>
          <input type="file" className="form-input" onChange={handleFileChange} required />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isLoading || !file} style={{ width: '100%' }}>
          {isLoading ? "Verifying..." : "Check Authenticity"}
        </button>
      </form>

      {verificationResult && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          {verificationResult.isValid ? (
            <div className="result-badge result-valid">
              ✔ Verified Document (Authentic)
            </div>
          ) : (
            <div className="result-badge result-invalid">
              ❌ Document Tampered / Not Found
            </div>
          )}
          
          {verificationResult.hash && (
             <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
                <strong>Calculated Hash:</strong> {verificationResult.hash}
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VerifyForm;
