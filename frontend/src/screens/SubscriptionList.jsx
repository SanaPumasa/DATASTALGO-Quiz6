import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchSubscriptionsList } from '../redux/actions/subscriptionActions';
import '../styles/SubscriptionList.css';

function SubscriptionList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const subscriptions = useSelector((state) => state.subscriptions.subscriptions);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      setIsLoading(true);
      dispatch(fetchSubscriptionsList()).finally(() => setIsLoading(false));
    }
  }, [dispatch, user]);

  if (user?.role !== 'admin') {
    navigate('/');
    return null;
  }

  if (isLoading) return <div className="loading">Loading subscriptions...</div>;

  return (
    <div className="subscription-list-container">
      <h1>Active Subscriptions</h1>
      
      {subscriptions && subscriptions.length > 0 ? (
        <table className="subscriptions-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Tier</th>
              <th>Subscription Date</th>
              <th>Usage Left</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((subscription) => (
              <tr key={subscription.id}>
                <td>{subscription.user_email}</td>
                <td>{subscription.tier_name}</td>
                <td>{new Date(subscription.subscribed_at).toLocaleDateString()}</td>
                <td>{subscription.usage_left}</td>
                <td>
                  <span className={`status ${subscription.is_active ? 'active' : 'inactive'}`}>
                    {subscription.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No active subscriptions.</p>
      )}
    </div>
  );
}

export default SubscriptionList;
