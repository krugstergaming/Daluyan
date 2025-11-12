import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';

import VaultPage from './Vaultpage.js';
import CounterPage from './Counterpage.js';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function App() {
  const [message, setMessage] = useState('Status: Waiting for action...');
  const [count, setCount] = useState(0);


  const handleGenerateAndSave = async () => {
    setCount(currentCount => currentCount + 1);

    const randomNumber = Math.floor(Math.random() * 1000);
    setMessage(`Sending number ${randomNumber} to the vault...`);

    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/save-number`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ number: randomNumber }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Failed to connect to the engine room:', error);
      setMessage('Error: Could not contact the server.');
    }
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand href="/" className="font-nav">Number Vault Ops</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/" className="font-nav">Vault Controls</Nav.Link>
                <Nav.Link as={Link} to="/counter" className="font-nav">Stats</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <header className="App-header">
          <Routes>
            <Route 
              path="/" 
              element={<VaultPage onButtonClick={handleGenerateAndSave} message={message} />} 
            />
            <Route 
              path="/counter" 
              element={<CounterPage count={count} />} 
            />
          </Routes>
        </header>
      </div>
    </BrowserRouter>
  );
}

export default App;