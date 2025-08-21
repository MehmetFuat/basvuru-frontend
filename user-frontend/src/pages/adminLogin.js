import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const navlog = () => {
    navigate('/');
  };

  const handleLogin = () => {
    const admin_username = "admin";
    const admin_password = "1234";

    if (username === admin_username && password === admin_password) {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin");
    } else {
      setError("Kullanıcı adı veya şifre hatalı.");
    }
  };

  return (
    <div className="container">
      <h1>Admin Girişi</h1>
      
      <input
        type="text"
        placeholder="Kullanıcı Adı"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      
      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      
      <button onClick={handleLogin}>Giriş Yap</button>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <button onClick={navlog}>Form</button>
    </div>
  );
}

export default AdminLogin;
