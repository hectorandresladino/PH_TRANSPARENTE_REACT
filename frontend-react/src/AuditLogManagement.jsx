import React, { useState, useEffect } from 'react';
import { Shield, Search, Clock, User, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { fetchWithAuth, API_URL } from './api.js';
import './styles.css';

export default function AuditLogManagement() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`${API_URL}/audit-logs`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log =>
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (log.description && log.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getResultIcon = (result) => {
    switch (result) {
      case 'SUCCESS': return <CheckCircle size={18} className="result-success" />;
      case 'FAIL': return <XCircle size={18} className="result-fail" />;
      case 'BLOCKED': return <AlertTriangle size={18} className="result-blocked" />;
      default: return <Clock size={18} />;
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleString('es-CO');
  };

  return (
    <div className="audit-log-container">
      <div className="section-header">
        <div className="header-title">
          <Shield size={32} />
          <div>
            <h1>Auditoría del Sistema</h1>
            <p>Registro de actividades para cumplimiento ISO 27001</p>
          </div>
        </div>
      </div>

      <div className="filters">
        <div className="search">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar por acción, usuario o descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Cargando auditoría...</div>
      ) : (
        <div className="audit-log-table">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Acción</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Descripción</th>
                <th>IP</th>
                <th>Resultado</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td>{formatDate(log.timestamp)}</td>
                  <td><strong>{log.action}</strong></td>
                  <td><User size={16} /> {log.username}</td>
                  <td>{log.role}</td>
                  <td>{log.description}</td>
                  <td>{log.ipAddress || '-'}</td>
                  <td className={`result-${log.result?.toLowerCase()}`}>
                    {getResultIcon(log.result)} {log.result}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && filteredLogs.length === 0 && (
        <div className="no-results">
          <Clock size={48} />
          <h3>No hay registros de auditoría</h3>
        </div>
      )}
    </div>
  );
}
