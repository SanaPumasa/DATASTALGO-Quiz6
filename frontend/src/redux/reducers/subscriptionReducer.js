import * as types from '../constants';

const initialState = {
  tiers: [],
  mySubscription: null,
  subscriptions: [],
  isLoading: false,
  error: null,
};

export default function subscriptionReducer(state = initialState, action) {
  switch (action.type) {
    case types.SUBSCRIPTIONS_FETCH_TIERS:
      return {
        ...state,
        tiers: action.payload,
        isLoading: false,
        error: null,
      };
    case types.SUBSCRIPTIONS_FETCH_MY:
      return {
        ...state,
        mySubscription: action.payload,
        isLoading: false,
        error: null,
      };
    case types.SUBSCRIPTIONS_CREATE:
      return {
        ...state,
        mySubscription: action.payload,
        isLoading: false,
        error: null,
      };
    case types.SUBSCRIPTIONS_FETCH_LIST:
      return {
        ...state,
        subscriptions: action.payload,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
}
