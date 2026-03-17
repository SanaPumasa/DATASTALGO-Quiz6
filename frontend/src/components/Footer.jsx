import React from 'react';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Auto Repair Services</h3>
          <p>Your trusted platform for auto repair and diagnostic services.</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/chatbot">Chatbot</a></li>
            <li><a href="/subscription">Subscription</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: support@autorepair.com</p>
          <p>Phone: (555) 123-4567</p>
        </div>
        
        <div className="footer-section">
          <h4>Follow Us</h4>
          <p>Facebook | Twitter | Instagram</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 Auto Repair Services. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
