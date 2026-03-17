import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserOrders } from '../redux/actions/orderActions';
import { fetchUserProfile } from '../redux/actions/authActions';
import '../styles/UserProfile.css';

function UserProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const orders = useSelector((state) => state.orders.orders);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      Promise.all([
        dispatch(fetchUserProfile()),
        dispatch(fetchUserOrders()),
      ]).finally(() => setIsLoading(false));
    }
  }, [dispatch, user]);

  if (!user) {
    navigate('/signin');
    return null;
  }

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="user-profile-container">
      <h1>My Profile</h1>
      <div className="profile-info">
        <div className="info-card">
          <h2>Personal Information</h2>
          <div className="info-row">
            <strong>Name:</strong>
            <span>{user.first_name} {user.last_name}</span>
          </div>
          <div className="info-row">
            <strong>Email:</strong>
            <span>{user.email}</span>
          </div>
          <div className="info-row">
            <strong>Phone:</strong>
            <span>{user.phone_number || 'N/A'}</span>
          </div>
          <div className="info-row">
            <strong>Location:</strong>
            <span>{user.location || 'N/A'}</span>
          </div>
          <div className="info-row">
            <strong>Gender:</strong>
            <span>{user.gender || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="orders-section">
        <h2>Order History</h2>
        {orders && orders.length > 0 ? (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Price Paid</th>
                <th>Date</th>
                <th>Transaction ID</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.service_name}</td>
                  <td>${order.price_paid}</td>
                  <td>{new Date(order.date_purchased).toLocaleDateString()}</td>
                  <td>{order.paypal_transaction_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No orders yet.</p>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
