import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, KeyRound, Lock, User } from 'lucide-react';
import { API_URL } from './api.js';
import './styles.css';

export default function ForgotPassword({ onBackToLogin }) {
  const [username, setUsername] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const requestCode = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setSuccess(data.message);
      setCodeSent(true);
    } catch (err) {
      setError(err.message || 'No fue posible procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, code, newPassword })
      });
      if (!response.ok) throw new Error(await response.text());
      setSuccess('Contraseña actualizada. Ya puedes iniciar sesión.');
      setTimeout(onBackToLogin, 1500);
    } catch (err) {
      setError(err.message || 'No fue posible cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <button className="back-button" onClick={onBackToLogin}>
          <ArrowLeft size={20} />
          <span>Volver al login</span>
        </button>
        <h1>Recuperar contraseña</h1>
        <p>{codeSent ? 'Ingresa el código enviado a tu correo' : 'Solicita un código de recuperación'}</p>
        <form onSubmit={codeSent ? resetPassword : requestCode}>
          <div className="login-form-group">
            <User size={20} />
            <input type="text" placeholder="Usuario" value={username}
              onChange={(e) => setUsername(e.target.value)} required disabled={codeSent} />
          </div>
          {codeSent && (
            <>
              <div className="login-form-group">
                <KeyRound size={20} />
                <input type="text" inputMode="numeric" placeholder="Código de 6 dígitos"
                  value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  minLength={6} required autoComplete="one-time-code" />
              </div>
              <div className="login-form-group">
                <Lock size={20} />
                <input type="password" placeholder="Nueva contraseña" value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)} required autoComplete="new-password" />
              </div>
              <div className="login-form-group">
                <Lock size={20} />
                <input type="password" placeholder="Confirmar contraseña" value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete="new-password" />
              </div>
            </>
          )}
          {error && <p className="error">{error}</p>}
          {success && <p className="success"><CheckCircle size={16} /> {success}</p>}
          <button type="submit" disabled={loading || (codeSent && code.length !== 6)}>
            {loading ? 'Procesando…' : codeSent ? 'Cambiar contraseña' : 'Enviar código'}
          </button>
        </form>
      </div>
    </div>
  );
}
