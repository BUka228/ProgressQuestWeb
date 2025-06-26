import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LandingPage from '@/pages/LandingPage'

export function AuthRedirector() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        navigate('/app');
      } else {
        // Stay on LandingPage if not authenticated
      }
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  return <LandingPage />;
}
