
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getMe } from '../redux/slices/authSlice';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const dispatch = useDispatch();
    const { user, token, isAuthenticated, loading } = useSelector((state) => state.auth);
    console.log("useruseruseruseruseruseruseruser", useSelector((state) => state.auth));

    useEffect(() => {
        
        if (token && !user) {
            dispatch(getMe());
        }
    }, [token, user, dispatch]);

    if (!token && !user) {

        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <p>Please Wait...</p>
            </div>
        );
    }

    
    if (!isAuthenticated || !token) {
        return <Navigate to="/login" replace />;
    }

    
    if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
        // Redirect to unauthorized page or dashboard
        return <Navigate to="/unauthorized" replace />;
    }

    
    return children;
};

export default ProtectedRoute;