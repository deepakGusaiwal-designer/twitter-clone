import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function PrivateRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
}

export default PrivateRoute;