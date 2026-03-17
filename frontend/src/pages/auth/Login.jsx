import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

// We use environment variables so it works safely on both Mac and Windows
// To test, we can use a placeholder, but later you will put your real Google Client ID in a .env file.
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE";

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleSuccess = (credentialResponse) => {
    console.log("Google Login Successful!", credentialResponse);
    
    // For now, we will simulate a successful login and route to a dashboard.
    // Later, we will send this token to our Node.js backend to check the database.
    alert("Login Successful! Routing to Dashboard...");
    
    // Example: routing to citizen dashboard for testing
    // navigate('/citizen-dashboard'); 
  };

  const handleGoogleError = () => {
    console.error("Google Login Failed");
    alert("Login failed. Please try again.");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Digital Welfare System</h2>
        <p style={{ marginBottom: '20px', color: '#555' }}>
          Please sign in to access your dashboard.
        </p>

        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
          />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
};

// Very basic inline CSS so it looks clean without needing extra files right now
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f9',
    fontFamily: 'sans-serif'
  },
  card: {
    padding: '40px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    textAlign: 'center',
  }
};

export default Login;