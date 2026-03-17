import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchSubscriptionTiers, createSubscription, fetchMySubscription } from '../redux/actions/subscriptionActions';
import PayPalButton from '../components/PayPalButton';
import '../styles/Subscription.css';

function SubscriptionScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const tiers = useSelector((state) => state.subscriptions.tiers);
  const mySubscription = useSelector((state) => state.subscriptions.mySubscription);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState(null);
  const [paypalError, setPaypalError] = useState('');

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
    setPaypalError('');
  };

  const handlePayPalSuccess = async (subscription) => {
    await dispatch(fetchMySubscription());
    alert(`Successfully upgraded to ${subscription.tier_name} plan!`);
    setSelectedTier(null);
  };

  const handlePayPalError = (error) => {
    setPaypalError(error);
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

  if (!tiers || tiers.length === 0) {
    return (
      <div className="subscription-container">
        <h1>Choose Your Plan</h1>
        <p className="error-message">No subscription plans available at the moment. Please try again later.</p>
      </div>
    );
  }

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
              <>
                {selectedTier === tier.id ? (
                  <div className="paypal-button-container">
                    {paypalError && <p className="error-message">{paypalError}</p>}
                    <PayPalButton 
                      tier={tier}
                      onSuccess={handlePayPalSuccess}
                      onError={handlePayPalError}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => handleSubscribe(tier)}
                    disabled={selectedTier !== null}
                    className="btn-subscribe"
                  >
                    Upgrade
                  </button>
                )}
              </>
            )}
          </div>
        );
        })}
      </div>
      {paypalError && <div className="error-banner">{paypalError}</div>}
    </div>
  );
}

export default SubscriptionScreen;
