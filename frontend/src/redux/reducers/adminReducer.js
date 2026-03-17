import * as types from '../constants';

const initialState = {
  users: [],
  isLoading: false,
  error: null,
};

export default function adminReducer(state = initialState, action) {
  switch (action.type) {
    case types.ADMIN_FETCH_USERS:
      return {
        ...state,
        users: action.payload,
        isLoading: false,
        error: null,
      };
    case types.ADMIN_EDIT_USER:
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user
        ),
        isLoading: false,
        error: null,
      };
    case types.ADMIN_DELETE_USER:
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
}
