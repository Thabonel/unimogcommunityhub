import React from 'react';

function MinimalApp() {
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#4a5f4e',
      color: 'white',
      minHeight: '100vh'
    }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>
        🚙 UnimogCommunityHub is Loading!
      </h1>
      <p style={{ fontSize: '18px', marginBottom: '10px' }}>
        ✅ React is working
      </p>
      <p style={{ fontSize: '18px', marginBottom: '10px' }}>
        ✅ The server is running on port 8080
      </p>
      <p style={{ fontSize: '18px', marginBottom: '20px' }}>
        ⏰ Current time: {new Date().toLocaleTimeString()}
      </p>
      <button 
        onClick={() => {
          alert('Button works! React is functioning properly.');
          window.location.href = '/trips';
        }}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: '#7c8471',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Go to Trips Page
      </button>
      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
        <h2>Debug Info:</h2>
        <p>Window location: {window.location.href}</p>
        <p>User Agent: {navigator.userAgent.substring(0, 50)}...</p>
      </div>
    </div>
  );
}

export default MinimalApp;