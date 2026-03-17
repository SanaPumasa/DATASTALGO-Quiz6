import * as types from '../constants';

const initialState = {
  services: [],
  selectedService: null,
  isLoading: false,
  error: null,
};

export default function serviceReducer(state = initialState, action) {
  switch (action.type) {
    case types.SERVICES_FETCH:
      return {
        ...state,
        services: action.payload,
        isLoading: false,
        error: null,
      };
    case types.SERVICES_ADD:
      return {
        ...state,
        services: [...state.services, action.payload],
        isLoading: false,
        error: null,
      };
    case types.SERVICES_UPDATE:
      return {
        ...state,
        services: state.services.map((service) =>
          service.id === action.payload.id ? action.payload : service
        ),
        isLoading: false,
        error: null,
      };
    case types.SERVICES_DELETE:
      return {
        ...state,
        services: state.services.filter((service) => service.id !== action.payload),
        isLoading: false,
        error: null,
      };
    case types.SERVICES_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    default:
      return state;
  }
}
