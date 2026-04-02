import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 uppercase tracking-widest font-black text-slate-400 text-xs">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p>Authorizing Session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;

  return children;
};

export default ProtectedRoute;
