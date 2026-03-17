import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navigation.css';

function SimpleHeader() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <h1 style={{cursor: 'pointer'}} onClick={() => navigate('/')}>Auto Repair Services</h1>
        </div>
      </div>
    </nav>
  );
}

export default SimpleHeader;
