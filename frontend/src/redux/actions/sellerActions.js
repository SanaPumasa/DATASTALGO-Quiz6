import api from '../../config/api';
import * as types from '../constants';

export const submitSellerApplication = () => (dispatch) => {
  return api.post('/applications/apply/')
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const fetchSellerApplications = () => (dispatch) => {
  return api.get('/applications/list/')
    .then((response) => {
      dispatch({ type: types.SELLERS_FETCH_APPLICATIONS, payload: response.data });
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const approveApplication = (applicationId, merchantId) => (dispatch) => {
  return api.post(`/applications/${applicationId}/approve/`, { merchant_id: merchantId })
    .then((response) => {
      dispatch({ type: types.SELLERS_APPROVE_APPLICATION, payload: response.data });
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const declineApplication = (applicationId, reason) => (dispatch) => {
  return api.post(`/applications/${applicationId}/decline/`, { decline_reason: reason })
    .then((response) => {
      dispatch({ type: types.SELLERS_DECLINE_APPLICATION, payload: response.data });
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};
