import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home'; 
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import VerifyEmail from './pages/VerifyEmail';
import EmailLogin from './pages/EmailLogin';
import * as GuestPages from './pages/guests';

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/email-login" element={<EmailLogin />} />
          <Route path="/guests/events" element={<GuestPages.Events />} />
          <Route path="/guests/events/:eventId" element={<GuestPages.EventDetails />} />

          {/* Protected routes */}
          <Route path="/guests/match/:userId" element={<ProtectedRoute component={GuestPages.Match} />} />
          <Route path="/guests/conditionalbooking" element={<ProtectedRoute component={GuestPages.ConditionalBooking} />} />
          <Route path="/guests/connections" element={<ProtectedRoute component={GuestPages.Connections} />} />
          <Route path="/guests/connections/:userId" element={<ProtectedRoute component={GuestPages.Connection} />} />
          <Route path="/guests/profile" element={<ProtectedRoute component={GuestPages.Profile} />} />

          {/* 404 - Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;