import React from 'react';

function SimpleApp() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1>Simple App - React is Working!</h1>
      <p>Current time: {new Date().toLocaleTimeString()}</p>
      <button onClick={() => alert('Clicked!')}>Test Button</button>
    </div>
  );
}

export default SimpleApp;