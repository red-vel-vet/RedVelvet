import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import FeedbackForm from './pages/FeedbackForm';
import UserLayout from './components/UserLayout';
import EmailLogin from './pages/EmailLogin';

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/feedback" element={<FeedbackForm />} />
          <Route path="/email-login" element={<EmailLogin />} />
          <Route path="/user/*" element={<ProtectedRoute />}>
            <Route path="*" element={<UserLayout />}>
              <Route path="account" element={<Account />} />
              <Route path="profile" element={<Profile />} />
              <Route path="quiz" element={<Quiz />} />
              <Route path="connections" element={<Connections />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;