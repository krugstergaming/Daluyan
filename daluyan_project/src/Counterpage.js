import React from 'react';

function Counterpage({ count }) {
  return (
    <div>
      <h1>Operation Stats</h1>
      <p>Total numbers sent to the vault (Success or Failure):</p>
      <h2>{count}</h2>
    </div>
  );
}

export default Counterpage;