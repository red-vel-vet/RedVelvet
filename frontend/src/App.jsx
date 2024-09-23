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
          <Route path="/" element={<Home />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/email-login" element={<EmailLogin />} />
          <Route path="/guests/events" element={<GuestPages.Events />} />
          <Route path="/guests/events/:eventId" element={<GuestPages.EventDetails />} />
          <Route path="/guests/match/:userId" element={<ProtectedRoute><GuestPages.Match /></ProtectedRoute>} />
          <Route path="/guests/conditionalbooking" element={<ProtectedRoute><GuestPages.ConditionalBooking /></ProtectedRoute>} />
          <Route path="/guests/connections" element={<ProtectedRoute><GuestPages.Connections /></ProtectedRoute>} />
          <Route path="/guests/connections/:userId" element={<ProtectedRoute><GuestPages.Connection /></ProtectedRoute>} />
          <Route path="/guests/account" element={<ProtectedRoute><GuestPages.AccountInfo /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;