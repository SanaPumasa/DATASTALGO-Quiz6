import * as types from '../constants';

const initialState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  accessToken: localStorage.getItem('access_token') || null,
  refreshToken: localStorage.getItem('refresh_token') || null,
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('access_token'),
};

export default function authReducer(state = initialState, action) {
  console.log('Auth reducer action:', action.type, 'Current user:', state.user?.email, 'isAuthenticated:', state.isAuthenticated);
  
  switch (action.type) {
    case types.AUTH_LOGIN:
      console.log('AUTH_LOGIN updating state with user:', action.payload.email, 'role:', action.payload.role);
      return {
        ...state,
        user: action.payload,
        accessToken: action.payload.access,
        refreshToken: action.payload.refresh,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case types.AUTH_LOGOUT:
      console.log('AUTH_LOGOUT clearing state');
      return {
        ...initialState,
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
      };
    case types.AUTH_REGISTER:
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case types.AUTH_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case types.AUTH_ERROR:
      console.log('AUTH_ERROR:', action.payload);
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case types.USER_FETCH_PROFILE:
      return {
        ...state,
        user: action.payload,
      };
    case types.USER_UPDATE_PROFILE:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}
