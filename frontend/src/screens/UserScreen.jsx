import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAdminUsers, fetchAdminSellers, deleteAdminUser } from '../redux/actions/adminActions';
import { fetchSellerApplications, approveApplication, declineApplication } from '../redux/actions/sellerActions';
import '../styles/UserScreen.css';

function UserScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const users = useSelector((state) => state.admin.users);
  const sellers = useSelector((state) => state.admin.sellers);
  const applications = useSelector((state) => state.seller.applications);
  const [activeTab, setActiveTab] = useState('users');
  const [isLoading, setIsLoading] = useState(true);
  const [declineModal, setDeclineModal] = useState(null);
  const [approveModal, setApproveModal] = useState(null);
  const [declineReason, setDeclineReason] = useState('');
  const [merchantId, setMerchantId] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      setIsLoading(true);
      Promise.all([
        dispatch(fetchAdminUsers()),
        dispatch(fetchAdminSellers()),
        dispatch(fetchSellerApplications()),
      ]).finally(() => setIsLoading(false));
    }
  }, [dispatch, user]);

  if (user?.role !== 'admin') {
    navigate('/');
    return null;
  }

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      try {
        await dispatch(deleteAdminUser(userId));
        dispatch(fetchAdminUsers());
      } catch (error) {
        alert('Error deleting user');
      }
    }
  };

  const handleApproveClick = (application) => {
    setApproveModal(application);
    setMerchantId('');
  };

  const handleApproveSubmit = async () => {
    try {
      await dispatch(approveApplication(approveModal.id, merchantId || 'AUTO_GEN_' + approveModal.id));
      dispatch(fetchSellerApplications());
      setApproveModal(null);
    } catch (error) {
      alert('Error approving application');
    }
  };

  const handleDeclineClick = (application) => {
    setDeclineModal(application);
    setDeclineReason('');
  };

  const handleDeclineSubmit = async () => {
    try {
      await dispatch(declineApplication(declineModal.id, declineReason));
      dispatch(fetchSellerApplications());
      setDeclineModal(null);
    } catch (error) {
      alert('Error declining application');
    }
  };

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="user-screen-container">
      <h1>Admin Dashboard</h1>
      
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`tab-btn ${activeTab === 'sellers' ? 'active' : ''}`}
          onClick={() => setActiveTab('sellers')}
        >
          Sellers
        </button>
        <button
          className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          Seller Applications
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="tab-content">
          <h2>All Users</h2>
          {users && users.length > 0 ? (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Location</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.phone_number || 'N/A'}</td>
                    <td>{u.location || 'N/A'}</td>
                    <td>{new Date(u.date_joined).toLocaleDateString()}</td>
                    <td>
                      <button className="btn-edit">Edit</button>
                      <button
                        onClick={() => handleDeleteUser(u.id, u.username)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No users found.</p>
          )}
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="tab-content">
          <h2>Pending Seller Applications</h2>
          {applications && applications.length > 0 ? (
            <table className="applications-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.user_username}</td>
                    <td>{app.user_email}</td>
                    <td>{new Date(app.created_at).toLocaleDateString()}</td>
                    <td>{app.status}</td>
                    <td>
                      <button
                        onClick={() => handleApproveClick(app)}
                        className="btn-approve"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDeclineClick(app)}
                        className="btn-decline"
                      >
                        Decline
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No pending applications.</p>
          )}
        </div>
      )}

      {activeTab === 'sellers' && (
        <div className="tab-content">
          <h2>All Sellers</h2>
          {sellers && sellers.length > 0 ? (
            <table className="sellers-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Location</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((seller) => (
                  <tr key={seller.id}>
                    <td>{seller.username}</td>
                    <td>{seller.email}</td>
                    <td>{seller.phone_number || 'N/A'}</td>
                    <td>{seller.location || 'N/A'}</td>
                    <td>{new Date(seller.date_joined).toLocaleDateString()}</td>
                    <td>
                      <button className="btn-edit">Edit</button>
                      <button className="btn-delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No sellers found.</p>
          )}
        </div>
      )}

      {approveModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Assign Merchant ID</h3>
            <p>Applicant: {approveModal.user_username}</p>
            <input
              type="text"
              placeholder="Enter Merchant ID (auto-generated if left blank)"
              value={merchantId}
              onChange={(e) => setMerchantId(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={handleApproveSubmit} className="btn-confirm">
                Approve
              </button>
              <button onClick={() => setApproveModal(null)} className="btn-cancel">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {declineModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Decline Application</h3>
            <p>Applicant: {declineModal.user_username}</p>
            <textarea
              placeholder="Enter reason for declining"
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={handleDeclineSubmit} className="btn-confirm">
                Decline
              </button>
              <button onClick={() => setDeclineModal(null)} className="btn-cancel">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserScreen;
