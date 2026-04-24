import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/documents');
        if (response.data.success) {
          setDocuments(response.data.documents);
        }
      } catch (error) {
        console.error("Failed to fetch documents", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  if (isLoading) {
    return <div style={{ textAlign: 'center' }}>Loading documents from blockchain...</div>;
  }

  return (
    <div className="glass-panel">
      <h2 style={{ marginBottom: '1.5rem' }}>Blockchain Records</h2>
      <div className="table-container">
        <table className="glass-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Document Hash (SHA256)</th>
              <th>Uploader Address</th>
              <th>IPFS Link</th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                  No documents found.
                </td>
              </tr>
            ) : (
              documents.map((doc, index) => (
                <tr key={index}>
                  <td>{new Date(doc.timestamp * 1000).toLocaleString()}</td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={doc.hash}>
                    {doc.hash}
                  </td>
                  <td style={{ fontFamily: 'monospace' }}>
                    {doc.uploader.substring(0, 6)}...{doc.uploader.substring(38)}
                  </td>
                  <td>
                    {doc.ipfsHash.startsWith('Qm') ? (
                      <span style={{ color: 'var(--primary)' }}>{doc.ipfsHash}</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>{doc.ipfsHash}</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentList;
