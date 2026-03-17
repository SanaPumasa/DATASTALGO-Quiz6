import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { submitSellerApplication } from '../redux/actions/sellerActions';
import '../styles/ApplySeller.css';

function ApplySeller() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!isAuthenticated) {
    navigate('/signin');
    return null;
  }

  const handleApply = async () => {
    setIsLoading(true);
    try {
      await dispatch(submitSellerApplication());
      setMessage('Application submitted successfully. Waiting for admin approval.');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setMessage('You already have a pending application or an error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="apply-seller-container">
      <div className="apply-seller-card">
        <h1>Apply as Seller</h1>
        <p>
          Want to offer your auto repair and diagnostic services on our platform?
          Apply below to become a seller and start earning!
        </p>
        <div className="benefits-list">
          <h3>Benefits of Becoming a Seller:</h3>
          <ul>
            <li>Reach more customers</li>
            <li>Manage your own scheduled and pricing</li>
            <li>Get paid directly to your PayPal account</li>
            <li>Build your reputation</li>
          </ul>
        </div>
        {message && <div className="message">{message}</div>}
        <button
          onClick={handleApply}
          disabled={isLoading}
          className="btn-apply"
        >
          {isLoading ? 'Submitting...' : 'Apply Now'}
        </button>
      </div>
    </div>
  );
}

export default ApplySeller;
