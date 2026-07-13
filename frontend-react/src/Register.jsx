import React, { useState } from 'react';
import { Lock, User, Mail, ArrowLeft } from 'lucide-react';
import './styles.css';

import { API_URL, setToken } from './api.js';

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
      setError('Las contraseñas no coinciden');
      return;
    }

    const passwordErrors = [];
    if (password.length < 8) passwordErrors.push('mínimo 8 caracteres');
    if (!/[A-Z]/.test(password)) passwordErrors.push('una mayúscula');
    if (!/[a-z]/.test(password)) passwordErrors.push('una minúscula');
    if (!/\d/.test(password)) passwordErrors.push('un número');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) passwordErrors.push('un carácter especial');
    if (passwordErrors.length > 0) {
      setError('La contraseña debe cumplir ISO 27001: ' + passwordErrors.join(', '));
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
        if (data.token) {
          setToken(data.token);
        }
        setSuccess('¡Registro exitoso! Redirigiendo al login...');
        setTimeout(() => {
          onRegister(data);
        }, 1500);
      } else {
        const errorMessage = await response.text();
        setError(errorMessage || 'Error al registrar usuario');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
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
        <p>Regístrate en PH Transparente</p>
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
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="login-form-group">
            <Lock size={20} />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="login-form-group">
            <Lock size={20} />
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <button type="submit" disabled={success}>Registrarse</button>
        </form>
        <p className="hint">ISO 27001: mínimo 8 caracteres, mayúscula, minúscula, número y especial.</p>
      </div>
    </div>
  );
}
