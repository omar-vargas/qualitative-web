// components/LoginForm.jsx
import React, { useState } from 'react';

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8000/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      const data = await response.json();
      onLogin(data); // { session_id, username }
    } else {
      alert("❌ Usuario o contraseña incorrectos.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>🔐 Iniciar sesión</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Usuario" />
      <input value={password} type="password" onChange={e => setPassword(e.target.value)} placeholder="Contraseña" />
      <button type="submit">Iniciar sesión</button>
    </form>
  );
}

export default LoginForm;
