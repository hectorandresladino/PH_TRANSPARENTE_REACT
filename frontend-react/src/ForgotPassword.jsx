import React, { useState } from 'react';
import { Lock, User, ArrowLeft, CheckCircle } from 'lucide-react';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || `http://${location.hostname}:8081/api`;

export default function ForgotPassword({ onBackToLogin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setCurrentPassword('');
    setShowPassword(false);

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(data.message);
        setCurrentPassword(data.currentPassword);
        setShowPassword(true);
      } else {
        const errorMessage = await response.text();
        setError(errorMessage || 'Error al procesar la solicitud');
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
        <h1>Recuperar ContraseÃ±a</h1>
        <p>Ingresa tu usuario para recuperar tu contraseÃ±a</p>
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
          {error && <p className="error">{error}</p>}
          {success && !showPassword && (
            <p className="success">
              <CheckCircle size={16} />
              {success}
            </p>
          )}
          {showPassword && (
            <div className="password-reveal">
              <p className="success">
                <CheckCircle size={16} />
                Tu contraseÃ±a actual es:
              </p>
              <div className="current-password">
                <Lock size={20} />
                <strong>{currentPassword}</strong>
              </div>
              <p className="hint">En un sistema real, recibirÃ­as un email con un enlace seguro para restablecer tu contraseÃ±a.</p>
            </div>
          )}
          <button type="submit" disabled={showPassword}>Recuperar ContraseÃ±a</button>
        </form>
      </div>
    </div>
  );
}
