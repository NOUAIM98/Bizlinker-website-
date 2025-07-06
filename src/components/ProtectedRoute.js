import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
    const userRole = "user"; 

    if (role === "admin" && userRole !== "admin") {
        return <Navigate to="/" replace />; 
    }

    return children; 
};

export default ProtectedRoute;
