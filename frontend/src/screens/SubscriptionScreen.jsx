import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchSubscriptionTiers, createSubscription, fetchMySubscription } from '../redux/actions/subscriptionActions';
import '../styles/Subscription.css';

function SubscriptionScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const tiers = useSelector((state) => state.subscriptions.tiers);
  const mySubscription = useSelector((state) => state.subscriptions.mySubscription);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true);
      Promise.all([
        dispatch(fetchSubscriptionTiers()),
        dispatch(fetchMySubscription())
      ]).finally(() => setIsLoading(false));
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
      
      await dispatch(fetchMySubscription());
      alert(`Successfully upgraded to ${tier.name} plan!`);
      // Stay on subscription page to show update, don't navigate away
    } catch (error) {
      alert('Subscription failed. Please try again.');
    } finally {
      setSelectedTier(null);
    }
  };

  const handleRevert = async () => {
    const basicTier = tiers?.find(t => t.name === 'Basic');
    if (!basicTier) return;
    
    if (window.confirm('Are you sure you want to revert to the Basic plan?')) {
      setSelectedTier(basicTier.id);
      try {
        await dispatch(createSubscription({
          tier_id: basicTier.id,
          paypal_subscription_id: 'MOCK_PAYPAL_ID_' + basicTier.id,
        }));
        await dispatch(fetchMySubscription());
        alert('Successfully reverted to Basic plan');
      } catch (error) {
        alert('Revert failed. Please try again.');
      } finally {
        setSelectedTier(null);
      }
    }
  };

  if (isLoading) return <div className="loading">Loading subscription tiers...</div>;

  return (
    <div className="subscription-container">
      <h1>Choose Your Plan</h1>
      <p className="subtitle">Get unlimited access to our AI Chatbot</p>
      
      {mySubscription?.is_active && (
        <div className="current-plan-info">
          <p><strong>Current Plan:</strong> {mySubscription.tier_name}</p>
          <p><strong>Usage Left:</strong> {mySubscription.usage_left} messages</p>
        </div>
      )}
      
      <div className="tiers-grid">
        {tiers && tiers.map((tier) => {
          const isCurrentPlan = mySubscription?.is_active && mySubscription.tier_name === tier.name;
          const isHigherTier = mySubscription?.is_active && 
            mySubscription.tier_name !== 'Basic' && 
            tier.name === 'Basic';
          
          return (
          <div key={tier.id} className={`tier-card ${isCurrentPlan ? 'current' : ''}`}>
            <h2>{tier.name}</h2>
            <div className="price">
              <span className="amount">${tier.price}</span>
              <span className="period">/month</span>
            </div>
            <div className="features">
              <p>Chatbot Usage: {tier.max_usage} messages/month</p>
            </div>
            {isCurrentPlan ? (
              <button className="btn-subscribe current" disabled>
                Current Plan
              </button>
            ) : isHigherTier ? (
              <button
                onClick={handleRevert}
                disabled={selectedTier === tier.id}
                className="btn-revert"
              >
                {selectedTier === tier.id ? 'Processing...' : 'Revert to Basic'}
              </button>
            ) : (
              <button
                onClick={() => handleSubscribe(tier)}
                disabled={selectedTier === tier.id}
                className="btn-subscribe"
              >
                {selectedTier === tier.id ? 'Processing...' : 'Upgrade'}
              </button>
            )}
          </div>
        );
        })}
      </div>
    </div>
  );
}

export default SubscriptionScreen;
