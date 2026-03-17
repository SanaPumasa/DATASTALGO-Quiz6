import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../redux/actions/authActions';
import '../styles/Navigation.css';

function Navigation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/signin');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <h1 onClick={() => navigate('/')}>Auto Repair Services</h1>
        </div>
        
        <ul className="nav-menu">
          <li className="nav-item">
            <button onClick={() => navigate('/')} className="nav-link">
              Home
            </button>
          </li>
          
          {user?.role === 'seller' && (
            <li className="nav-item">
              <button onClick={() => navigate('/seller-dashboard')} className="nav-link">
                Dashboard
              </button>
            </li>
          )}
          
          {user?.role === 'user' && (
            <li className="nav-item">
              <button onClick={() => navigate('/apply-seller')} className="nav-link">
                Be a Seller
              </button>
            </li>
          )}
          
          <li className="nav-item">
            <button onClick={() => navigate('/chatbot')} className="nav-link">
              Chatbot
            </button>
          </li>
          
          <li className="nav-item">
            <button onClick={() => navigate('/subscription')} className="nav-link">
              Subscription
            </button>
          </li>
          
          {user?.role === 'admin' && (
            <>
              <li className="nav-item">
                <button onClick={() => navigate('/admin-panel')} className="nav-link">
                  Admin Panel
                </button>
              </li>
              <li className="nav-item">
                <button onClick={() => navigate('/subscription-list')} className="nav-link">
                  Subscriptions
                </button>
              </li>
            </>
          )}
          
          <li className="nav-item">
            <button onClick={() => navigate('/profile')} className="nav-link">
              Profile
            </button>
          </li>
          
          <li className="nav-item">
            <button onClick={handleLogout} className="nav-link logout-btn">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
