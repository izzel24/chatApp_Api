import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Chat from '../pages/Chat';
import Login from '../pages/Login';
import { AuthProvider } from '../contexts/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Home from '../pages/Home';

export default function AppRoute() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Home />} path='/'/>
            <Route element={<Chat />} path='/chat' />
          </Route>
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
