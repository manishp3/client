import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import PublicRoutes from './routes/PublicRoutes';
import React, { useEffect } from 'react';
import ProtectedRoute from './routes/ProtectedRoutes';
import Dashboard from './pages/common/Dashaboard';
import { ToastContainer } from 'react-toastify';
import ClientDashboard from './pages/common/ClientDashboard';
import { useDispatch } from 'react-redux';
import { setAuthFromStorage } from './redux/slices/authSlice';
const Login = React.lazy(() => import('./pages/auth/Login'))
const Register = React.lazy(() => import('./pages/auth/Register'))

function App() {
   const dispatch = useDispatch();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("authUser"));
    const token = localStorage.getItem("token");

    if (user && token) {
      dispatch(setAuthFromStorage({ user }));
    }
  }, [dispatch]);
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoutes>
              <Login />
            </PublicRoutes>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoutes>
              <Login />
            </PublicRoutes>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoutes>
              <Register />
            </PublicRoutes>
          }
        />
        <Route
          path="*"
          element={
            <PublicRoutes>
              <Login />
            </PublicRoutes>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-products"
          element={
            <ProtectedRoute>
              <ClientDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
       <ToastContainer />
    </>
  );
}

export default App;
