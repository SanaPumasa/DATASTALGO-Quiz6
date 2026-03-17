import React, { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { fetchMySubscription } from '../redux/actions/subscriptionActions';
import api from '../config/api';

function PayPalButton({ tier, onSuccess, onError }) {
  const dispatch = useDispatch();

  const initializePayPal = useCallback(() => {
    if (!tier.paypal_plan_id) {
      if (onError) onError('PayPal plan not configured for this tier');
      return;
    }

    window.paypal.Buttons({
      createSubscription: async (data, actions) => {
        try {
          return actions.subscription.create({
            plan_id: tier.paypal_plan_id
          });
        } catch (error) {
          console.error('Error creating subscription:', error);
          if (onError) onError('Failed to create subscription');
          return null;
        }
      },
      onApprove: async (data, actions) => {
        try {
          return actions.subscription.create({
            subscription_id: data.subscriptionID,
            tier_id: tier.id
          });
          
          if (response.status === 200) {
            await dispatch(fetchMySubscription());
            if (onSuccess) onSuccess(response.data);
          }
        } catch (error) {
          console.error('Error activating subscription:', error);
          if (onError) onError('Failed to activate subscription');
        }
      },
      onError: (err) => {
        console.error('PayPal error:', err);
        if (onError) onError('Payment error occurred');
      }
    }).render('#paypal-buttons-container');
  }, [tier, dispatch, onSuccess, onError]);

  useEffect(() => {
    if (window.paypal) {
      initializePayPal();
      return;
    }

    // Load PayPal SDK script for subscriptions
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.REACT_APP_PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
    script.async = true;
    script.onload = () => {
      if (window.paypal) {
        initializePayPal();
      }
    };
    script.onerror = () => {
      console.error('Failed to load PayPal SDK');
      if (onError) onError('Failed to load PayPal SDK');
    };
    document.body.appendChild(script);

    return () => {
      const paypalButtons = document.getElementById('paypal-buttons-container');
      if (paypalButtons) {
        paypalButtons.innerHTML = '';
      }
    };
  }, [initializePayPal, onError]);

  return <div id="paypal-buttons-container"></div>;
}

export default PayPalButton;
