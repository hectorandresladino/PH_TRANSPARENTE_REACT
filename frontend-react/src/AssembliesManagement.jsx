import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Search, CheckCircle, XCircle, Clock, Calendar, MapPin } from 'lucide-react';
import './styles.css';

import { API_URL } from './api.js';

export default function AssembliesManagement() {
  const [assemblies, setAssemblies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAssembly, setEditingAssembly] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('TODOS');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'ORDINARIA',
    scheduledDate: '',
    scheduledTime: '',
    location: '',
    status: 'PROGRAMADA',
    agenda: '',
    minutes: '',
    quorumRequired: '',
    quorumAttended: '',
    createdBy: ''
  });

  const assemblyTypes = ['ORDINARIA', 'EXTRAORDINARIA', 'JUNTA DIRECTIVA'];
  const assemblyStatuses = ['PROGRAMADA', 'REALIZADA', 'CANCELADA', 'POSTERGADA'];

  useEffect(() => {
    fetchAssemblies();
  }, []);

  const fetchAssemblies = async () => {
    try {
      const response = await fetch(`${API_URL}/assemblies`);
      if (response.ok) {
        const data = await response.json();
        setAssemblies(data);
      }
    } catch (error) {
      console.error('Error fetching assemblies:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingAssembly 
        ? `${API_URL}/assemblies/${editingAssembly.id}`
        : `${API_URL}/assemblies`;
      const method = editingAssembly ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quorumRequired: formData.quorumRequired ? parseInt(formData.quorumRequired) : null,
          quorumAttended: formData.quorumAttended ? parseInt(formData.quorumAttended) : null
        })
      });

      if (response.ok) {
        fetchAssemblies();
        setShowModal(false);
        setEditingAssembly(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving assembly:', error);
    }
  };

  const handleEdit = (assembly) => {
    setEditingAssembly(assembly);
    setFormData({
      title: assembly.title,
      description: assembly.description || '',
      type: assembly.type,
      scheduledDate: assembly.scheduledDate || '',
      scheduledTime: assembly.scheduledTime || '',
      location: assembly.location || '',
      status: assembly.status,
      agenda: assembly.agenda || '',
      minutes: assembly.minutes || '',
      quorumRequired: assembly.quorumRequired || '',
      quorumAttended: assembly.quorumAttended || '',
      createdBy: assembly.createdBy || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta asamblea?')) {
      try {
        const response = await fetch(`${API_URL}/assemblies/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchAssemblies();
        }
      } catch (error) {
        console.error('Error deleting assembly:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'ORDINARIA',
      scheduledDate: '',
      scheduledTime: '',
      location: '',
      status: 'PROGRAMADA',
      agenda: '',
      minutes: '',
      quorumRequired: '',
      quorumAttended: '',
      createdBy: ''
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'REALIZADA': return <CheckCircle size={16} />;
      case 'PROGRAMADA': return <Clock size={16} />;
      case 'CANCELADA': return <XCircle size={16} />;
      case 'POSTERGADA': return <Clock size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'REALIZADA': return '#10b981';
      case 'PROGRAMADA': return '#3b82f6';
      case 'CANCELADA': return '#ef4444';
      case 'POSTERGADA': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const filteredAssemblies = assemblies.filter(assembly => {
    const matchesSearch = 
      assembly.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assembly.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assembly.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'TODOS' || assembly.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="assemblies-management">
      <div className="assemblies-header">
        <div className="header-title">
          <Users size={32} />
          <h1>Gestión de Asambleas</h1>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setEditingAssembly(null); setShowModal(true); }}>
          <Plus size={20} />
          <span>Nueva Asamblea</span>
        </button>
      </div>

      <div className="assemblies-filters">
        <div className="search-bar">
          <Search size={20} />
          <input
            placeholder="Buscar asambleas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="TODOS">Todos los estados</option>
          {assemblyStatuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="assemblies-grid">
        {filteredAssemblies.map(assembly => (
          <div key={assembly.id} className="assembly-card">
            <div className="assembly-header">
              <span className="assembly-title">{assembly.title}</span>
              <span className="status-badge" style={{ color: getStatusColor(assembly.status) }}>
                {getStatusIcon(assembly.status)}
                {assembly.status}
              </span>
            </div>
            <div className="assembly-info">
              <div className="assembly-type">{assembly.type}</div>
              {assembly.description && (
                <p className="assembly-description">{assembly.description}</p>
              )}
            </div>
            <div className="assembly-details">
              {assembly.scheduledDate && (
                <div className="detail-row">
                  <Calendar size={16} />
                  <span>Fecha: {new Date(assembly.scheduledDate).toLocaleDateString('es-ES')}</span>
                </div>
              )}
              {assembly.scheduledTime && (
                <div className="detail-row">
                  <Clock size={16} />
                  <span>Hora: {assembly.scheduledTime}</span>
                </div>
              )}
              {assembly.location && (
                <div className="detail-row">
                  <MapPin size={16} />
                  <span>Ubicación: {assembly.location}</span>
                </div>
              )}
              {assembly.quorumRequired && (
                <div className="detail-row">
                  <span>Quórum: {assembly.quorumAttended || 0}/{assembly.quorumRequired}</span>
                </div>
              )}
            </div>
            <div className="assembly-actions">
              <button className="btn-edit" onClick={() => handleEdit(assembly)}>
                <Edit size={16} />
              </button>
              <button className="btn-delete" onClick={() => handleDelete(assembly.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingAssembly ? 'Editar Asamblea' : 'Nueva Asamblea'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Título</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tipo</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    {assemblyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    {assemblyStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Fecha Programada</label>
                  <input
                    type="date"
                    value={formData.scheduledDate}
                    onChange={e => setFormData({...formData, scheduledDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Hora</label>
                  <input
                    type="time"
                    value={formData.scheduledTime}
                    onChange={e => setFormData({...formData, scheduledTime: e.target.value})}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Ubicación</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Quórum Requerido</label>
                  <input
                    type="number"
                    value={formData.quorumRequired}
                    onChange={e => setFormData({...formData, quorumRequired: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Quórum Asistió</label>
                  <input
                    type="number"
                    value={formData.quorumAttended}
                    onChange={e => setFormData({...formData, quorumAttended: e.target.value})}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Creado por (ID)</label>
                  <input
                    type="text"
                    value={formData.createdBy}
                    onChange={e => setFormData({...formData, createdBy: e.target.value})}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Descripción</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    rows={2}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Agenda</label>
                  <textarea
                    value={formData.agenda}
                    onChange={e => setFormData({...formData, agenda: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Actas</label>
                  <textarea
                    value={formData.minutes}
                    onChange={e => setFormData({...formData, minutes: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingAssembly ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
