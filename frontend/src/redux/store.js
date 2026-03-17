import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import serviceReducer from './reducers/serviceReducer';
import orderReducer from './reducers/orderReducer';
import subscriptionReducer from './reducers/subscriptionReducer';
import sellerReducer from './reducers/sellerReducer';
import adminReducer from './reducers/adminReducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
    services: serviceReducer,
    orders: orderReducer,
    subscriptions: subscriptionReducer,
    seller: sellerReducer,
    admin: adminReducer,
  },
});

export default store;
