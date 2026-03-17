import * as types from '../constants';

const initialState = {
  orders: [],
  isLoading: false,
  error: null,
};

export default function orderReducer(state = initialState, action) {
  switch (action.type) {
    case types.ORDERS_FETCH:
      return {
        ...state,
        orders: action.payload,
        isLoading: false,
        error: null,
      };
    case types.ORDERS_CREATE:
      return {
        ...state,
        orders: [...state.orders, action.payload],
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
}
