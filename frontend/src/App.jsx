import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout';
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import ProtectedRoute from './components/ProtectedRoute'
import Account from './pages/Account'
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import FeedbackForm from './pages/FeedbackForm';

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
            <Route path="/" element = {<Home />}/>
            <Route path="/account" element = {<ProtectedRoute><Account /></ProtectedRoute>}/>
            <Route path="/login" element = {<Login />}/>
            <Route path="/logout" element = {<Logout />}/>
            <Route path="/register" element = {<Register />}/>
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/feedback" element={<FeedbackForm />} />
            <Route path="*" element = {<NotFound />}/>
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  )
}

export default App
