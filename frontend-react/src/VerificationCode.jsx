import React, { useState } from 'react';
import { Shield, ArrowLeft, RefreshCw } from 'lucide-react';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || `http://${location.hostname}:8081/api`;

export default function VerificationCode({ username, onVerified, onBack }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, code })
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(true);
        setTimeout(() => onVerified(), 1000);
      } else {
        const errorText = await response.text();
        setError(errorText || 'Código inválido o expirado');
      }
    } catch (err) {
      console.error('Error de verificación:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setResending(true);

    try {
      const response = await fetch(`${API_URL}/auth/send-verification-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });

      if (response.ok) {
        const data = await response.json();
        setError('');
        alert('Nuevo código enviado. Revisa la consola del backend para ver el código.');
      } else {
        const errorText = await response.text();
        setError(errorText || 'Error al reenviar código');
      }
    } catch (err) {
      console.error('Error al reenviar código:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setResending(false);
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={18} />
          Volver
        </button>
        
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 16px' 
          }}>
            <Shield size={32} color="white" />
          </div>
          <h1 style={{ color: '#123b62', fontSize: '1.5rem', margin: '0 0 8px' }}>Verificación</h1>
          <p style={{ color: '#65758a', margin: '0', fontSize: '0.9rem' }}>
            Ingresa el código de 6 dígitos enviado a tu email
          </p>
        </div>

        {success ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '24px', 
            background: '#d1fae5', 
            borderRadius: '12px', 
            color: '#059669' 
          }}>
            <Shield size={48} style={{ marginBottom: '16px' }} />
            <h2 style={{ margin: '0 0 8px' }}>¡Verificado!</h2>
            <p style={{ margin: '0' }}>Redirigiendo...</p>
          </div>
        ) : (
          <form onSubmit={handleVerify}>
            <div className="login-form-group" style={{ marginBottom: '24px' }}>
              <input
                type="text"
                placeholder="000000"
                value={code}
                onChange={handleCodeChange}
                required
                maxLength={6}
                style={{ 
                  fontSize: '2rem', 
                  letterSpacing: '8px', 
                  textAlign: 'center', 
                  fontWeight: 'bold',
                  fontFamily: 'monospace'
                }}
                autoComplete="one-time-code"
              />
            </div>

            {error && (
              <p className="error" style={{ marginBottom: '16px' }}>{error}</p>
            )}

            <button 
              type="submit" 
              disabled={loading || code.length !== 6}
              style={{ 
                width: '100%', 
                background: loading ? '#9ca3af' : '#10b981', 
                color: 'white', 
                border: 0, 
                padding: '14px', 
                borderRadius: '16px', 
                fontWeight: 700, 
                cursor: loading ? 'not-allowed' : 'pointer', 
                fontSize: '1rem',
                marginBottom: '12px'
              }}
            >
              {loading ? 'Verificando...' : 'Verificar Código'}
            </button>

            <button 
              type="button"
              onClick={handleResend}
              disabled={resending}
              style={{ 
                width: '100%', 
                background: 'transparent', 
                color: '#123b62', 
                border: '1px solid #d8e4ec', 
                padding: '12px', 
                borderRadius: '16px', 
                fontWeight: 600, 
                cursor: resending ? 'not-allowed' : 'pointer', 
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <RefreshCw size={16} style={{ animation: resending ? 'spin 1s linear infinite' : 'none' }} />
              {resending ? 'Enviando...' : 'Reenviar Código'}
            </button>
          </form>
        )}

        <p className="hint" style={{ marginTop: '24px' }}>
          El código expira en 15 minutos
        </p>
      </div>
    </div>
  );
}
