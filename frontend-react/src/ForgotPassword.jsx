import React, { useState } from 'react';
import { User, ArrowLeft, CheckCircle } from 'lucide-react';
import './styles.css';

import { API_URL } from './api.js';

export default function ForgotPassword({ onBackToLogin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(data.message);
        setSubmitted(true);
      } else {
        const errorMessage = await response.text();
        setError(errorMessage || 'Error al procesar la solicitud');
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
        <h1>Recuperar Contraseña</h1>
        <p>Ingresa tu usuario para recuperar tu contraseña</p>
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
          {submitted && (
            <div className="password-reveal">
              <p className="success">
                <CheckCircle size={16} />
                {success}
              </p>
              <p className="hint">Revisa tu correo registrado para continuar con la recuperación de tu contraseña.</p>
            </div>
          )}
          <button type="submit" disabled={submitted}>Recuperar Contraseña</button>
        </form>
      </div>
    </div>
  );
}
