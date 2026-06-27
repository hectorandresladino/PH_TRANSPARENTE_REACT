import React, { useState, useEffect } from 'react';
import { BarChart3, FileText, Clock, CheckCircle, AlertCircle, TrendingUp, Calendar, MessageSquare } from 'lucide-react';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || `http://${location.hostname}:8081/api`;

export default function PqrStatistics({ user }) {
  const [pqrs, setPqrs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPqrs();
  }, []);

  const fetchPqrs = async () => {
    try {
      const response = await fetch(`${API_URL}/pqrs`);
      if (response.ok) {
        const data = await response.json();
        setPqrs(data);
      }
    } catch (error) {
      console.error('Error fetching pqrs:', error);
    } finally {
      setLoading(false);
    }
  };

  const isCopropietario = user?.role === 'COPIROPIETARIO';

  const myPqrs = isCopropietario
    ? pqrs.filter(p => p.requester === (user?.fullName || user?.username || ''))
    : pqrs;

  const total = myPqrs.length;
  const pendientes = myPqrs.filter(p => p.status === 'PENDIENTE').length;
  const enProceso = myPqrs.filter(p => p.status === 'EN PROCESO').length;
  const resueltas = myPqrs.filter(p => p.status === 'RESUELTA').length;
  const conRespuesta = myPqrs.filter(p => p.response && p.response.trim().length > 0).length;
  const sinRespuesta = total - conRespuesta;

  const byType = {
    PETICION: myPqrs.filter(p => p.type === 'PETICION').length,
    QUEJA: myPqrs.filter(p => p.type === 'QUEJA').length,
    RECLAMO: myPqrs.filter(p => p.type === 'RECLAMO').length,
    SUGERENCIA: myPqrs.filter(p => p.type === 'SUGERENCIA').length,
  };

  const byMonth = {};
  myPqrs.forEach(p => {
    if (p.createdAt) {
      const d = new Date(p.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      byMonth[key] = (byMonth[key] || 0) + 1;
    }
  });
  const monthLabels = {
    '01': 'Ene', '02': 'Feb', '03': 'Mar', '04': 'Abr',
    '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Ago',
    '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dic'
  };
  const monthEntries = Object.entries(byMonth).sort().slice(-6);
  const maxMonth = Math.max(...monthEntries.map(([, v]) => v), 1);

  const byDay = {};
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    byDay[key] = 0;
  }
  myPqrs.forEach(p => {
    if (p.createdAt) {
      const key = p.createdAt.split('T')[0];
      if (key in byDay) {
        byDay[key]++;
      }
    }
  });
  const dayEntries = Object.entries(byDay);
  const dayLabels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const maxDay = Math.max(...dayEntries.map(([, v]) => v), 1);

  const byWeek = { 'Sem 1': 0, 'Sem 2': 0, 'Sem 3': 0, 'Sem 4': 0 };
  myPqrs.forEach(p => {
    if (p.createdAt) {
      const d = new Date(p.createdAt);
      const weekNum = Math.ceil(d.getDate() / 7);
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      if (d >= monthAgo) {
        const key = `Sem ${weekNum}`;
        if (key in byWeek) byWeek[key]++;
      }
    }
  });
  const weekEntries = Object.entries(byWeek);
  const maxWeek = Math.max(...weekEntries.map(([, v]) => v), 1);

  if (loading) {
    return (
      <div className="pqr-management">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <BarChart3 size={48} />
          <p style={{ marginTop: '16px' }}>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  const statCardStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    minWidth: '140px',
  };

  const barContainerStyle = {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '12px',
    height: '160px',
    padding: '0 8px',
  };

  const barStyle = (value, max) => ({
    width: '40px',
    height: `${(value / max) * 100}%`,
    minHeight: '4px',
    borderRadius: '6px 6px 0 0',
    background: 'linear-gradient(180deg, #123b62 0%, #2563eb 100%)',
    transition: 'height 0.5s ease',
    position: 'relative',
  });

  const sectionStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  };

  return (
    <div className="pqr-management">
      <div className="pqr-header">
        <div className="header-title">
          <BarChart3 size={32} />
          <h1>Estadísticas de PQR {isCopropietario ? '- Mis Solicitudes' : ''}</h1>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <div style={statCardStyle}>
          <FileText size={28} color="#123b62" />
          <span style={{ fontSize: '2rem', fontWeight: '700', color: '#123b62' }}>{total}</span>
          <span style={{ fontSize: '0.85rem', color: '#666' }}>Total PQR</span>
        </div>
        <div style={{ ...statCardStyle, borderTop: '4px solid #ef4444' }}>
          <AlertCircle size={28} color="#ef4444" />
          <span style={{ fontSize: '2rem', fontWeight: '700', color: '#ef4444' }}>{pendientes}</span>
          <span style={{ fontSize: '0.85rem', color: '#666' }}>Pendientes</span>
        </div>
        <div style={{ ...statCardStyle, borderTop: '4px solid #f59e0b' }}>
          <Clock size={28} color="#f59e0b" />
          <span style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b' }}>{enProceso}</span>
          <span style={{ fontSize: '0.85rem', color: '#666' }}>En Proceso</span>
        </div>
        <div style={{ ...statCardStyle, borderTop: '4px solid #10b981' }}>
          <CheckCircle size={28} color="#10b981" />
          <span style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>{resueltas}</span>
          <span style={{ fontSize: '0.85rem', color: '#666' }}>Resueltas</span>
        </div>
        <div style={{ ...statCardStyle, borderTop: '4px solid #8b5cf6' }}>
          <MessageSquare size={28} color="#8b5cf6" />
          <span style={{ fontSize: '2rem', fontWeight: '700', color: '#8b5cf6' }}>{conRespuesta}</span>
          <span style={{ fontSize: '0.85rem', color: '#666' }}>Con Respuesta</span>
        </div>
        <div style={{ ...statCardStyle, borderTop: '4px solid #f97316' }}>
          <TrendingUp size={28} color="#f97316" />
          <span style={{ fontSize: '2rem', fontWeight: '700', color: '#f97316' }}>{sinRespuesta}</span>
          <span style={{ fontSize: '0.85rem', color: '#666' }}>Sin Respuesta</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div style={sectionStyle}>
          <h3 style={{ marginBottom: '16px', color: '#123b62', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} />
            PQR por Día (últimos 7 días)
          </h3>
          <div style={barContainerStyle}>
            {dayEntries.map(([date, count]) => {
              const d = new Date(date);
              return (
                <div key={date} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#123b62' }}>{count}</span>
                  <div style={barStyle(count, maxDay)}></div>
                  <span style={{ fontSize: '0.7rem', color: '#666' }}>{dayLabels[d.getDay()]}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={sectionStyle}>
          <h3 style={{ marginBottom: '16px', color: '#123b62', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} />
            PQR por Semana (último mes)
          </h3>
          <div style={barContainerStyle}>
            {weekEntries.map(([week, count]) => (
              <div key={week} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#123b62' }}>{count}</span>
                <div style={barStyle(count, maxWeek)}></div>
                <span style={{ fontSize: '0.7rem', color: '#666' }}>{week}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div style={sectionStyle}>
          <h3 style={{ marginBottom: '16px', color: '#123b62', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} />
            PQR por Mes (últimos 6 meses)
          </h3>
          <div style={barContainerStyle}>
            {monthEntries.map(([month, count]) => {
              const [, m] = month.split('-');
              return (
                <div key={month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#123b62' }}>{count}</span>
                  <div style={barStyle(count, maxMonth)}></div>
                  <span style={{ fontSize: '0.7rem', color: '#666' }}>{monthLabels[m] || m}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={sectionStyle}>
          <h3 style={{ marginBottom: '16px', color: '#123b62', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} />
            PQR por Tipo
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(byType).map(([type, count]) => {
              const labels = { PETICION: 'Peticiones', QUEJA: 'Quejas', RECLAMO: 'Reclamos', SUGERENCIA: 'Sugerencias' };
              const colors = { PETICION: '#3b82f6', QUEJA: '#ef4444', RECLAMO: '#f59e0b', SUGERENCIA: '#10b981' };
              const pct = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={type}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#333' }}>{labels[type]}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: colors[type] }}>{count}</span>
                  </div>
                  <div style={{ background: '#f0f0f0', borderRadius: '6px', height: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: colors[type], borderRadius: '6px', transition: 'width 0.5s ease' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h3 style={{ marginBottom: '16px', color: '#123b62', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={20} />
          Estado de Respuestas
        </h3>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.85rem', color: '#333' }}>Respondidas por administración</span>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#8b5cf6' }}>{conRespuesta} / {total}</span>
            </div>
            <div style={{ background: '#f0f0f0', borderRadius: '6px', height: '12px', overflow: 'hidden' }}>
              <div style={{ width: `${total > 0 ? (conRespuesta / total) * 100 : 0}%`, height: '100%', background: '#8b5cf6', borderRadius: '6px', transition: 'width 0.5s ease' }}></div>
            </div>
          </div>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.85rem', color: '#333' }}>Sin responder</span>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#f97316' }}>{sinRespuesta} / {total}</span>
            </div>
            <div style={{ background: '#f0f0f0', borderRadius: '6px', height: '12px', overflow: 'hidden' }}>
              <div style={{ width: `${total > 0 ? (sinRespuesta / total) * 100 : 0}%`, height: '100%', background: '#f97316', borderRadius: '6px', transition: 'width 0.5s ease' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
