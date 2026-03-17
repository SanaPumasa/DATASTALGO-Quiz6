import api from '../../config/api';
import * as types from '../constants';

export const fetchSubscriptionTiers = () => (dispatch) => {
  return api.get('/subscriptions/tiers/')
    .then((response) => {
      dispatch({ type: types.SUBSCRIPTIONS_FETCH_TIERS, payload: response.data });
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const createSubscription = (subscriptionData) => (dispatch) => {
  return api.post('/subscriptions/create/', subscriptionData)
    .then((response) => {
      dispatch({ type: types.SUBSCRIPTIONS_CREATE, payload: response.data });
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const fetchMySubscription = () => (dispatch) => {
  return api.get('/subscriptions/my/')
    .then((response) => {
      dispatch({ type: types.SUBSCRIPTIONS_FETCH_MY, payload: response.data });
      return response.data;
    })
    .catch((error) => {
      console.error('Error fetching subscription:', error);
    });
};

export const fetchSubscriptionsList = () => (dispatch) => {
  return api.get('/subscriptions/list/')
    .then((response) => {
      dispatch({ type: types.SUBSCRIPTIONS_FETCH_LIST, payload: response.data });
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};
