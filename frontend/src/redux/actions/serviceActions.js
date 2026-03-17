import api from '../../config/api';
import * as types from '../constants';

export const fetchServices = () => (dispatch) => {
  dispatch({ type: types.SERVICES_LOADING });
  return api.get('/services/list/')
    .then((response) => {
      dispatch({ type: types.SERVICES_FETCH, payload: response.data });
      return response.data;
    })
    .catch((error) => {
      console.error('Error fetching services:', error);
    });
};

export const addService = (serviceData) => (dispatch) => {
  return api.post('/services/manage/', serviceData)
    .then((response) => {
      dispatch({ type: types.SERVICES_ADD, payload: response.data });
      return response.data;
    })
    .catch((error) => {
      console.error('Error adding service:', error.response?.data || error.message);
      throw error;
    });
};

export const updateService = (serviceId, serviceData) => (dispatch) => {
  return api.put(`/services/manage/${serviceId}/`, serviceData)
    .then((response) => {
      dispatch({ type: types.SERVICES_UPDATE, payload: response.data });
      return response.data;
    })
    .catch((error) => {
      console.error('Error updating service:', error.response?.data || error.message);
      throw error;
    });
};

export const deleteService = (serviceId) => (dispatch) => {
  return api.delete(`/services/manage/${serviceId}/`)
    .then(() => {
      dispatch({ type: types.SERVICES_DELETE, payload: serviceId });
    })
    .catch((error) => {
      throw error;
    });
};

export const fetchSellerServices = () => (dispatch) => {
  return api.get('/services/manage/')
    .then((response) => {
      dispatch({ type: types.SERVICES_FETCH, payload: response.data });
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};
