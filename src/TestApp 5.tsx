import React from 'react';

const TestApp = () => {
  console.log('TestApp is rendering');
  
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f0f0', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#333', fontSize: '24px' }}>
        React is Working! ✅
      </h1>
      <p style={{ color: '#666' }}>
        If you can see this, React is rendering properly.
      </p>
      <p style={{ color: '#666' }}>
        Time: {new Date().toLocaleTimeString()}
      </p>
      <button 
        onClick={() => alert('Button clicked!')}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        Test Button
      </button>
    </div>
  );
};

export default TestApp;