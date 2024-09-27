import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_ENDPOINT}/auth/google`;
  };

  return (
    <div className="login-container">
      <h1>CV Job Matcher</h1>
      <h2>Login</h2>
      <img src={"../../public/googleLogin.png"} onClick={handleGoogleLogin} className="google-login-button"/>
    </div>
  );
};

export default Login;