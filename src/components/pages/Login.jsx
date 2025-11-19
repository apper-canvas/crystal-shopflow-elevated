import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/layouts/Root';
import { useSelector } from 'react-redux';

function Login() {
  const { isInitialized } = useAuth();
  const { user } = useSelector(state => state.user);
  const navigate = useNavigate();
  
  // Redirect authenticated users immediately
  useEffect(() => {
    if (isInitialized && user) {
      const searchParams = new URLSearchParams(window.location.search);
      const redirectPath = searchParams.get('redirect');
      // Redirect to checkout after login (payment flow)
      navigate(redirectPath ? redirectPath : "/checkout");
    }
  }, [isInitialized, user, navigate]);

  // Initialize login modal for unauthenticated users
  useEffect(() => {
    if (isInitialized && !user) {
      // Check if ApperSDK is available
      if (!window.ApperSDK || !window.ApperSDK.ApperUI) {
        console.error('ApperSDK not loaded. Please ensure the SDK script is included.');
        return;
      }

      // Wait for DOM to be ready
      const initializeLogin = () => {
        const loginElement = document.getElementById('login-modal');
        if (loginElement) {
          try {
            const { ApperUI } = window.ApperSDK;
            ApperUI.showLogin("#login-modal");
          } catch (error) {
            console.error('Error initializing login modal:', error);
          }
        } else {
          // Retry after a short delay if element not found
          setTimeout(initializeLogin, 100);
        }
      };

      // Start initialization
      initializeLogin();
    }
  }, [isInitialized, user]);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 dark:bg-surface-900">
      <div className="w-full max-w-md space-y-8 p-8 bg-white dark:bg-surface-800 rounded-lg shadow-md">
        <div className="flex flex-col gap-6 items-center justify-center">
          <div className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center bg-gradient-to-r from-primary to-blue-600 text-white text-2xl 2xl:text-3xl font-bold">
            S
          </div>
          <div className="flex flex-col gap-1 items-center justify-center">
            <div className="text-center text-lg xl:text-xl font-bold">
              Sign in to ShopFlow
            </div>
            <div className="text-center text-sm text-gray-500">
              Welcome back, please sign in to continue
            </div>
          </div>
        </div>
<div id="login-modal" />
        <div className="text-center mt-4">
          <p className="text-sm text-surface-600 dark:text-surface-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary hover:text-primary-dark">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;