import api from '../../config/api';
import * as types from '../constants';

export const sendChatMessage = (message) => (dispatch) => {
  return api.post('/chat/ask/', { message })
    .then((response) => {
      dispatch({ type: types.CHAT_SEND, payload: response.data });
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const fetchAdminUsers = () => (dispatch) => {
  return api.get('/users/admin/users/')
    .then((response) => {
      dispatch({ type: types.ADMIN_FETCH_USERS, payload: response.data });
      return response.data;
    })
    .catch((error) => {
      console.error('Error fetching admin users:', error.response?.data || error.message);
      throw error;
    });
};

export const fetchAdminSellers = () => (dispatch) => {
  return api.get('/users/admin/sellers/')
    .then((response) => {
      console.log('Sellers API response:', response.data);
      dispatch({ type: types.ADMIN_FETCH_SELLERS, payload: response.data });
      return response.data;
    })
    .catch((error) => {
      console.error('Error fetching sellers:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error message:', error.message);
      dispatch({ type: types.ADMIN_FETCH_SELLERS, payload: [] });
      return [];
    });
};

export const editAdminUser = (userId, userData) => (dispatch) => {
  return api.put(`/users/admin/users/${userId}/`, userData)
    .then((response) => {
      dispatch({ type: types.ADMIN_EDIT_USER, payload: response.data });
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const deleteAdminUser = (userId) => (dispatch) => {
  return api.delete(`/users/admin/users/${userId}/`)
    .then(() => {
      dispatch({ type: types.ADMIN_DELETE_USER, payload: userId });
    })
    .catch((error) => {
      throw error;
    });
};
