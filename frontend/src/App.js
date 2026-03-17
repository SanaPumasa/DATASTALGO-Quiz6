import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './App.css';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import ApplySeller from './screens/ApplySeller';
import SellerDashboard from './screens/SellerDashboard';
import UserProfile from './screens/UserProfile';
import SubscriptionScreen from './screens/SubscriptionScreen';
import SubscriptionList from './screens/SubscriptionList';
import UserScreen from './screens/UserScreen';
import ChatBot from './screens/ChatBot';
import Navigation from './components/Navigation';

function ProtectedRoute({ children, isAuthenticated }) {
  return isAuthenticated ? children : <Navigate to="/signin" replace />;
}

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Router>
      {isAuthenticated && <Navigation />}
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <HomeScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/service/:id"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <DetailScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/apply-seller"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ApplySeller />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller-dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SellerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscription"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SubscriptionScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscription-list"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SubscriptionList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-panel"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <UserScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ChatBot />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
