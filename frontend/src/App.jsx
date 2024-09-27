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

          <Route path="/guests/match/:userId" element={<ProtectedRoute />}>
            <Route index element={<GuestPages.Match />} />
          </Route>

          <Route path="/guests/conditionalbooking" element={<ProtectedRoute />}>
            <Route index element={<GuestPages.ConditionalBooking />} />
          </Route>

          <Route path="/guests/connections" element={<ProtectedRoute />}>
            <Route index element={<GuestPages.Connections />} />
          </Route>

          <Route path="/guests/connections/:userId" element={<ProtectedRoute />}>
            <Route index element={<GuestPages.Connection />} />
          </Route>

          <Route path="/guests/profile" element={<ProtectedRoute />}>
            <Route index element={<GuestPages.Profile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;