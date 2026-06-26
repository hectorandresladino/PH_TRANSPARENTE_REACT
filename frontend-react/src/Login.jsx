import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || `http://${location.hostname}:8081/api`;

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
        console.log('Login exitoso:', data);
        // Guardar los modulos permitidos en localStorage
        if (data.modules) {
          localStorage.setItem('allowedModules', data.modules);
        }
        onLogin(data);
      } else {
        console.error('Error en login:', response.status);
        setError('Credenciales invalidas');
      }
    } catch (err) {
      console.error('Error de conexion:', err);
      setError('Error de conexion con el servidor');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>PH Transparente</h1>
        <p>Iniciar sesion</p>
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
              placeholder="Contrasena"
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
            Olvidaste tu contrasena?
          </button>
          <button className="link-button" onClick={onShowRegister}>
            No tienes cuenta? Registrate
          </button>
        </div>
        <p className="hint">Credenciales por rol:</p>
        <p className="hint">- admin/admin123 (Administrador)</p>
        <p className="hint">- contador/contador123 (Contador)</p>
        <p className="hint">- revisor/revisor123 (Revisor Fiscal)</p>
        <p className="hint">- consejero/consejero123 (Consejero)</p>
        <p className="hint">- copropietario/copropietario123 (Copropietario)</p>
        <p className="hint">- vigilancia/vigilancia123 (Vigilancia)</p>
      </div>
    </div>
  );
}
