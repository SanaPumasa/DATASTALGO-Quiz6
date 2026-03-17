import api from '../../config/api';
import * as types from '../constants';

export const registerUser = (userData) => (dispatch) => {
  dispatch({ type: types.AUTH_LOADING });
  return api.post('/users/register/', userData)
    .then((response) => {
      dispatch({ type: types.AUTH_REGISTER, payload: response.data });
      return response.data;
    })
    .catch((error) => {
      dispatch({ type: types.AUTH_ERROR, payload: error.response?.data });
      throw error;
    });
};

export const loginUser = (email, password) => (dispatch) => {
  console.log('loginUser action called with email:', email);
  dispatch({ type: types.AUTH_LOADING });
  return api.post('/users/login/', { email, password })
    .then((response) => {
      console.log('Login API response received:', response.data);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data));
      console.log('Tokens saved to localStorage');
      console.log('Dispatching AUTH_LOGIN with payload:', response.data);
      dispatch({ type: types.AUTH_LOGIN, payload: response.data });
      return response.data;
    })
    .catch((error) => {
      console.error('Login API error:', error);
      dispatch({ type: types.AUTH_ERROR, payload: error.response?.data });
      throw error;
    });
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  dispatch({ type: types.AUTH_LOGOUT });
};

export const fetchUserProfile = () => (dispatch) => {
  return api.get('/users/profile/')
    .then((response) => {
      dispatch({ type: types.USER_FETCH_PROFILE, payload: response.data });
      return response.data;
    })
    .catch((error) => {
      dispatch({ type: types.AUTH_ERROR, payload: error.response?.data });
      throw error;
    });
};

export const updateUserProfile = (userData) => (dispatch) => {
  return api.put('/users/profile/', userData)
    .then((response) => {
      dispatch({ type: types.USER_UPDATE_PROFILE, payload: response.data });
      return response.data;
    })
    .catch((error) => {
      dispatch({ type: types.AUTH_ERROR, payload: error.response?.data });
      throw error;
    });
};
