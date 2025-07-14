import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedUserTypes?: Array<'student' | 'counselor'>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,
  allowedUserTypes 
}) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        navigate('/login');
        return;
      }

      if (allowedUserTypes && profile && !allowedUserTypes.includes(profile.user_type as 'student' | 'counselor')) {
        navigate('/');
        return;
      }
    }
  }, [user, profile, loading, requireAuth, allowedUserTypes, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return null;
  }

  if (allowedUserTypes && profile && !allowedUserTypes.includes(profile.user_type as 'student' | 'counselor')) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;