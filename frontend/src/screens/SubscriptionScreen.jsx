import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchSubscriptionTiers, createSubscription } from '../redux/actions/subscriptionActions';
import '../styles/Subscription.css';

function SubscriptionScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const tiers = useSelector((state) => state.subscriptions.tiers);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true);
      dispatch(fetchSubscriptionTiers()).finally(() => setIsLoading(false));
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    navigate('/signin');
    return null;
  }

  const handleSubscribe = async (tier) => {
    setSelectedTier(tier.id);
    
    try {
      alert(`Redirecting to PayPal for ${tier.name} subscription ($${tier.price}/month)`);
      
      await dispatch(createSubscription({
        tier_id: tier.id,
        paypal_subscription_id: 'MOCK_PAYPAL_ID_' + tier.id,
      }));
      
      navigate('/');
    } catch (error) {
      alert('Subscription failed. Please try again.');
    } finally {
      setSelectedTier(null);
    }
  };

  if (isLoading) return <div className="loading">Loading subscription tiers...</div>;

  return (
    <div className="subscription-container">
      <h1>Choose Your Plan</h1>
      <p className="subtitle">Get unlimited access to our AI Chatbot</p>
      
      <div className="tiers-grid">
        {tiers && tiers.map((tier) => (
          <div key={tier.id} className="tier-card">
            <h2>{tier.name}</h2>
            <div className="price">
              <span className="amount">${tier.price}</span>
              <span className="period">/month</span>
            </div>
            <div className="features">
              <p>Chatbot Usage: {tier.max_usage} messages/month</p>
            </div>
            <button
              onClick={() => handleSubscribe(tier)}
              disabled={selectedTier === tier.id}
              className="btn-subscribe"
            >
              {selectedTier === tier.id ? 'Processing...' : 'Subscribe'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubscriptionScreen;
