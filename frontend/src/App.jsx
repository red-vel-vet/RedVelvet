import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home'; 
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Connections from './pages/Connections';
import VerifyEmail from './pages/VerifyEmail';
import FeedbackForm from './pages/FeedbackForm';
import UserLayout from './components/UserLayout';
import EmailLogin from './pages/EmailLogin';
import User from './pages/User';
import EventsManagement from './pages/EventsManagement'; 
import HostProfile from './pages/HostProfile';

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
              <Route path="" element={<User />} /> 
              <Route path="connections" element={<Connections />} />
            </Route>
          </Route>
          <Route path="/events-management/*" element={<ProtectedRoute />}>
            <Route path="" element={<EventsManagement />} /> 
            <Route path="hosts/:id" element={<HostProfile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;