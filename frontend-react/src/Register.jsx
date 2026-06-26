import React, { useState } from 'react';
import { Lock, User, Mail, ArrowLeft } from 'lucide-react';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || `http://${location.hostname}:8081/api`;

export default function Register({ onRegister, onBackToLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Las contraseÃ±as no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseÃ±a debe tener al menos 6 caracteres');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, confirmPassword })
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess('Â¡Registro exitoso! Redirigiendo al login...');
        setTimeout(() => {
          onRegister(data);
        }, 1500);
      } else {
        const errorMessage = await response.text();
        setError(errorMessage || 'Error al registrar usuario');
      }
    } catch (err) {
      setError('Error de conexiÃ³n con el servidor');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <button className="back-button" onClick={onBackToLogin}>
          <ArrowLeft size={20} />
          <span>Volver al login</span>
        </button>
        <h1>Crear Cuenta</h1>
        <p>RegÃ­strate en PH Transparente</p>
        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <User size={20} />
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="login-form-group">
            <Mail size={20} />
            <input
              type="email"
              placeholder="Correo electrÃ³nico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="login-form-group">
            <Lock size={20} />
            <input
              type="password"
              placeholder="ContraseÃ±a"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="login-form-group">
            <Lock size={20} />
            <input
              type="password"
              placeholder="Confirmar contraseÃ±a"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <button type="submit" disabled={success}>Registrarse</button>
        </form>
        <p className="hint">La contraseÃ±a debe tener al menos 6 caracteres</p>
      </div>
    </div>
  );
}
