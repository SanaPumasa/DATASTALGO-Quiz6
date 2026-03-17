import * as types from '../constants';

const initialState = {
  applications: [],
  isLoading: false,
  error: null,
};

export default function sellerReducer(state = initialState, action) {
  switch (action.type) {
    case types.SELLERS_FETCH_APPLICATIONS:
      return {
        ...state,
        applications: action.payload,
        isLoading: false,
        error: null,
      };
    case types.SELLERS_APPROVE_APPLICATION:
      return {
        ...state,
        applications: state.applications.filter(
          (app) => app.id !== action.payload.id
        ),
        isLoading: false,
        error: null,
      };
    case types.SELLERS_DECLINE_APPLICATION:
      return {
        ...state,
        applications: state.applications.filter(
          (app) => app.id !== action.payload.id
        ),
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
}
