import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';
import { API_URL, setToken } from './api.js';
import './styles.css';

const selfRegistrationEnabled = import.meta.env.VITE_SELF_REGISTRATION_ENABLED === 'true';

export default function Login({ onLogin, onShowRegister, onShowForgotPassword }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          setToken(data.token);
        }
        if (data.modules) {
          localStorage.setItem('allowedModules', data.modules);
        }
        onLogin(data);
      } else {
        const errorText = await response.text().catch(() => '');
        if (response.status === 401) {
          setError('Usuario o contraseña incorrectos');
        } else {
          setError(errorText || 'No fue posible iniciar sesión');
        }
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>PH Transparente</h1>
        <p>Iniciar sesión</p>
        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <User size={20} />
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
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
              autoComplete="current-password"
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Ingresar</button>
        </form>
        <div className="login-links">
          <button className="link-button" onClick={onShowForgotPassword}>
            ¿Olvidaste tu contraseña?
          </button>
          {selfRegistrationEnabled && (
            <button className="link-button" onClick={onShowRegister}>
              ¿No tienes cuenta? Regístrate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
