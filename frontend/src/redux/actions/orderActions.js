import api from '../../config/api';
import * as types from '../constants';

export const createOrder = (orderData) => (dispatch) => {
  return api.post('/orders/create/', orderData)
    .then((response) => {
      dispatch({ type: types.ORDERS_CREATE, payload: response.data });
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const fetchUserOrders = () => (dispatch) => {
  return api.get('/orders/history/')
    .then((response) => {
      dispatch({ type: types.ORDERS_FETCH, payload: response.data });
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};
