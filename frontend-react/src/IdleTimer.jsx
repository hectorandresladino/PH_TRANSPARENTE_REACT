import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

/**
 * Temporizador de inactividad (ISO 27001 - control de sesiones).
 * Cierra la sesión después de un tiempo sin actividad del usuario.
 */
export default function IdleTimer({ onLogout, timeoutMs = 5 * 60 * 1000 }) {
  const [warning, setWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const warningDuration = Math.min(60 * 1000, Math.max(1000, timeoutMs));
  const warningMs = Math.max(0, timeoutMs - warningDuration);
  const timerRef = useRef(null);
  const countdownRef = useRef(null);
  const lastActivityRef = useRef(0);

  const resetTimerRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    setWarning(false);

    timerRef.current = setTimeout(() => {
      setWarning(true);
      setRemainingSeconds(Math.ceil(warningDuration / 1000));

      countdownRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(countdownRef.current);
            onLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, warningMs);
  };

  resetTimerRef.current = resetTimer;

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];

    const handleActivity = () => {
      const now = Date.now();
      if (now - lastActivityRef.current < 1000) return;
      lastActivityRef.current = now;
      resetTimerRef.current();
    };

    events.forEach(event => window.addEventListener(event, handleActivity, { passive: true }));
    resetTimerRef.current();

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [timeoutMs, onLogout]);

  if (!warning) return null;

  return (
    <div className="idle-warning-overlay">
      <div className="idle-warning-modal">
        <div className="idle-warning-icon">
          <AlertTriangle size={40} />
        </div>
        <h2>Sesión por expirar</h2>
        <p>
          <Clock size={16} />
          Su sesión se cerrará en <strong>{remainingSeconds}</strong> segundos por inactividad.
        </p>
        <div className="idle-warning-actions">
          <button className="idle-warning-btn" onClick={() => resetTimer()}>
            Continuar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
