import React, { useState, useEffect } from 'react';
import { AlertTriangle, Search, Plus, Edit, Trash2, Filter, Calendar, CheckCircle, XCircle, Bell, Eye, EyeOff } from 'lucide-react';

import { API_URL } from './api.js';

export default function AlertsManagement() {
  const [alerts, setAlerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [formData, setFormData] = useState({
    alertType: 'LEGAL',
    severity: 'MEDIA',
    title: '',
    description: '',
    relatedModule: '',
    referenceId: null,
    alertDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    status: 'ACTIVO',
    assignedTo: '',
    isPublic: true,
    targetAudience: 'TODOS',
    observations: ''
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch(`${API_URL}/alerts`);
      if (response.ok) {
        const data = await response.json();
        setAlerts(data);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingAlert 
        ? `${API_URL}/alerts/${editingAlert.id}`
        : `${API_URL}/alerts`;
      
      const method = editingAlert ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchAlerts();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving alert:', error);
    }
  };

  const handleEdit = (alert) => {
    setEditingAlert(alert);
    setFormData({
      alertType: alert.alertType || 'LEGAL',
      severity: alert.severity || 'MEDIA',
      title: alert.title || '',
      description: alert.description || '',
      relatedModule: alert.relatedModule || '',
      referenceId: alert.referenceId || null,
      alertDate: alert.alertDate || new Date().toISOString().split('T')[0],
      expiryDate: alert.expiryDate || '',
      status: alert.status || 'ACTIVO',
      assignedTo: alert.assignedTo || '',
      isPublic: alert.isPublic !== false,
      targetAudience: alert.targetAudience || 'TODOS',
      observations: alert.observations || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta alerta?')) {
      try {
        const response = await fetch(`${API_URL}/alerts/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchAlerts();
        }
      } catch (error) {
        console.error('Error deleting alert:', error);
      }
    }
  };

  const handleResolve = async (alert) => {
    const resolutionNotes = prompt('Notas de resolución:');
    if (resolutionNotes) {
      try {
        const response = await fetch(`${API_URL}/alerts/${alert.id}/resolve`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resolvedBy: 'Usuario actual',
            resolutionNotes: resolutionNotes
          })
        });
        if (response.ok) {
          fetchAlerts();
        }
      } catch (error) {
        console.error('Error resolving alert:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      alertType: 'LEGAL',
      severity: 'MEDIA',
      title: '',
      description: '',
      relatedModule: '',
      referenceId: null,
      alertDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      status: 'ACTIVO',
      assignedTo: '',
      isPublic: true,
      targetAudience: 'TODOS',
      observations: ''
    });
    setEditingAlert(null);
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = 
      alert.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const getSeverityColor = (severity) => {
    switch(severity?.toLowerCase()) {
      case 'alta': return 'severity-alta';
      case 'media': return 'severity-media';
      case 'baja': return 'severity-baja';
      default: return 'severity-media';
    }
  };

  return (
    <div className="property-units-management">
      <div className="contractors-header">
        <div className="header-title">
          <Bell size={32} />
          <h1>Alertas y Alarmas</h1>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus size={20} />
          Nueva Alerta
        </button>
      </div>

      <div className="contractors-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por título o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter size={18} />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Todos los estados</option>
            <option value="ACTIVO">Activo</option>
            <option value="RESUELTO">Resuelto</option>
            <option value="VENCIDO">Vencido</option>
          </select>
        </div>
        <div className="filter-group">
          <AlertTriangle size={18} />
          <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}>
            <option value="all">Todas las severidades</option>
            <option value="ALTA">Alta</option>
            <option value="MEDIA">Media</option>
            <option value="BAJA">Baja</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Severidad</th>
              <th>Título</th>
              <th>Módulo</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Público</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlerts.map(alert => (
              <tr key={alert.id}>
                <td>{alert.alertType}</td>
                <td>
                  <span className={`severity-badge ${getSeverityColor(alert.severity)}`}>
                    {alert.severity}
                  </span>
                </td>
                <td>
                  <div className="alert-title">
                    <AlertTriangle size={16} />
                    <strong>{alert.title}</strong>
                  </div>
                </td>
                <td>{alert.relatedModule}</td>
                <td>
                  <div className="date-info">
                    <Calendar size={14} />
                    <span>{alert.alertDate}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${alert.status?.toLowerCase()}`}>
                    {alert.status}
                  </span>
                </td>
                <td>
                  {alert.isPublic ? <Eye size={16} /> : <EyeOff size={16} />}
                </td>
                <td>
                  <div className="action-buttons">
                    {alert.status === 'ACTIVO' && (
                      <button className="btn-resolve" onClick={() => handleResolve(alert)}>
                        <CheckCircle size={16} />
                      </button>
                    )}
                    <button className="btn-edit" onClick={() => handleEdit(alert)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(alert.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingAlert ? 'Editar Alerta' : 'Nueva Alerta'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>í—</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Tipo de Alerta</label>
                  <select
                    value={formData.alertType}
                    onChange={(e) => setFormData({...formData, alertType: e.target.value})}
                  >
                    <option value="LEGAL">Legal</option>
                    <option value="FINANCIERO">Financiero</option>
                    <option value="MANTENIMIENTO">Mantenimiento</option>
                    <option value="SEGURIDAD">Seguridad</option>
                    <option value="ADMINISTRATIVO">Administrativo</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Severidad</label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({...formData, severity: e.target.value})}
                  >
                    <option value="ALTA">Alta</option>
                    <option value="MEDIA">Media</option>
                    <option value="BAJA">Baja</option>
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Título *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Descripción</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label>Módulo Relacionado</label>
                  <select
                    value={formData.relatedModule}
                    onChange={(e) => setFormData({...formData, relatedModule: e.target.value})}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="RESERVE_FUND">Fondo de Reserva</option>
                    <option value="ANNUAL_BUDGET">Presupuesto Anual</option>
                    <option value="INSURANCE">Seguros</option>
                    <option value="BANK_ACCOUNT">Cuentas Bancarias</option>
                    <option value="OFFICIAL_MINUTES">Actas</option>
                    <option value="REGULATION">Reglamento</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Audiencia Objetivo</label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                  >
                    <option value="TODOS">Todos</option>
                    <option value="COPROPIETARIOS">Copropietarios</option>
                    <option value="CONSEJO">Consejo</option>
                    <option value="ADMINISTRADOR">Administrador</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Fecha de Alerta</label>
                  <input
                    type="date"
                    value={formData.alertDate}
                    onChange={(e) => setFormData({...formData, alertDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Fecha de Vencimiento</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Asignado a</label>
                  <input
                    type="text"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="ACTIVO">Activo</option>
                    <option value="RESUELTO">Resuelto</option>
                    <option value="VENCIDO">Vencido</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Público</label>
                  <select
                    value={formData.isPublic}
                    onChange={(e) => setFormData({...formData, isPublic: e.target.value === 'true'})}
                  >
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingAlert ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
