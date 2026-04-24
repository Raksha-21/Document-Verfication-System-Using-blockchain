import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Trustless Document Verification
      </h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
        Secure, transparent, and immutable document verification using Ethereum Blockchain and IPFS.
      </p>
      
      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
        <Link to="/upload" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
          Upload Document
        </Link>
        <Link to="/verify" className="btn" style={{ padding: '1rem 2rem', fontSize: '1.1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)' }}>
          Verify Authenticity
        </Link>
      </div>
    </div>
  );
};

export default Home;
