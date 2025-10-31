import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { exchangeCodeForToken } from '../services/fitbitService';

const CallbackPage = () => {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      // Get authorization code from URL
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (!code) {
        setStatus('error');
        return;
      }

      // Exchange code for token
      const success = await exchangeCodeForToken(code);

      if (success) {
        setStatus('success');
        // Redirect to main page after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setStatus('error');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        {status === 'processing' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Connecting to Fitbit...</h2>
            <p className="text-gray-600">Please wait while we complete the authorization</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Success!</h2>
            <p className="text-gray-600 mb-4">Fitbit connected successfully</p>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Connection Failed</h2>
            <p className="text-gray-600 mb-4">Unable to connect to Fitbit</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallbackPage;
