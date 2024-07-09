import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Account from './pages/Account';
import Profile from './pages/Profile';
import Quiz from './pages/Quiz';
import Connections from './pages/Connections';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import FeedbackForm from './pages/FeedbackForm';
import UserNavFooter from './components/UserNavFooter';

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/feedback" element={<FeedbackForm />} />
            <Route path="/user" element={<ProtectedRoute />}>
              <Route path="account" element={<Account />} />
              <Route path="profile" element={<Profile />} />
              <Route path="quiz" element={<Quiz />} />
              <Route path="connections" element={<Connections />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <UserNavFooter /> {/* Adding the UserNavFooter component */}
        </Layout>
      </BrowserRouter>
    </>
  );
}

export default App;
