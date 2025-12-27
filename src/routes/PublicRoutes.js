

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoutes = ({ children }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <p>Please wait...</p>
      </div>
    );
  }


  if (isAuthenticated && user) {

    return <Navigate to="/dashboard" replace />;
  }


  return children;
};

export default PublicRoutes;