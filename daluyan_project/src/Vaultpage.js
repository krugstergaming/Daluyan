import React from 'react';

function Vaultpage({ onButtonClick, message }) {
  return (
    <div>
      <h1>Number Vault</h1>
      <p>Click the button to generate and save a random number (0-999).</p>
      <button onClick={onButtonClick}>
        Generate and Save Number
      </button>
      <p className="status-message">{message}</p>
    </div>
  );
}

export default Vaultpage;