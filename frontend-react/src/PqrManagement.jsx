import React, { useState, useEffect } from 'react';
import { FileText, Plus, Edit, Trash2, Search, AlertCircle, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || `http://${location.hostname}:8081/api`;

export default function PqrManagement({ user }) {
  const [pqrs, setPqrs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPqr, setEditingPqr] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('TODOS');
  const [formData, setFormData] = useState({
    type: 'PETICION',
    title: '',
    description: '',
    requester: '',
    email: '',
    phone: '',
    status: 'PENDIENTE',
    priority: 'MEDIA',
    response: ''
  });

  const isCopropietario = user?.role === 'COPIROPIETARIO';

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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingPqr 
        ? `${API_URL}/pqrs/${editingPqr.id}`
        : `${API_URL}/pqrs`;
      const method = editingPqr ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchPqrs();
        setShowModal(false);
        setEditingPqr(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving pqr:', error);
    }
  };

  const handleEdit = (pqr) => {
    setEditingPqr(pqr);
    setFormData({
      type: pqr.type,
      title: pqr.title,
      description: pqr.description,
      requester: pqr.requester,
      email: pqr.email || '',
      phone: pqr.phone || '',
      status: pqr.status,
      priority: pqr.priority || 'MEDIA',
      response: pqr.response || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Â¿EstÃ¡s seguro de eliminar esta PQR?')) {
      try {
        const response = await fetch(`${API_URL}/pqrs/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchPqrs();
        }
      } catch (error) {
        console.error('Error deleting pqr:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'PETICION',
      title: '',
      description: '',
      requester: isCopropietario ? (user?.fullName || user?.username || '') : '',
      email: isCopropietario ? (user?.email || '') : '',
      phone: isCopropietario ? (user?.phone || '') : '',
      status: 'PENDIENTE',
      priority: 'MEDIA',
      response: ''
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'RESUELTA': return <CheckCircle size={16} />;
      case 'EN PROCESO': return <Clock size={16} />;
      case 'PENDIENTE': return <AlertCircle size={16} />;
      default: return <AlertTriangle size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'RESUELTA': return '#10b981';
      case 'EN PROCESO': return '#f59e0b';
      case 'PENDIENTE': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'ALTA': return '#ef4444';
      case 'MEDIA': return '#f59e0b';
      case 'BAJA': return '#10b981';
      default: return '#6b7280';
    }
  };

  const filteredPqrs = pqrs.filter(pqr => {
    const matchesSearch = 
      pqr.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pqr.requester?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pqr.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'TODOS' || pqr.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="pqr-management">
      <div className="pqr-header">
        <div className="header-title">
          <FileText size={32} />
          <h1>GestiÃ³n de PQR</h1>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setEditingPqr(null); setShowModal(true); }}>
          <Plus size={20} />
          <span>Nueva PQR</span>
        </button>
      </div>

      <div className="pqr-filters">
        <div className="search-bar">
          <Search size={20} />
          <input
            placeholder="Buscar PQR..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="TODOS">Todos los estados</option>
          <option value="PENDIENTE">Pendientes</option>
          <option value="EN PROCESO">En proceso</option>
          <option value="RESUELTA">Resueltas</option>
        </select>
      </div>

      <div className="pqr-grid">
        {filteredPqrs.map(pqr => (
          <div key={pqr.id} className="pqr-card">
            <div className="pqr-card-header">
              <span className="pqr-type">{pqr.type}</span>
              <span className="pqr-priority" style={{ color: getPriorityColor(pqr.priority) }}>
                {pqr.priority}
              </span>
            </div>
            <h3>{pqr.title}</h3>
            <p className="pqr-description">{pqr.description}</p>
            <div className="pqr-meta">
              <span className="pqr-requester">Solicitante: {pqr.requester}</span>
              <span className="pqr-date">
                {new Date(pqr.createdAt).toLocaleDateString('es-ES')}
              </span>
            </div>
            <div className="pqr-status" style={{ color: getStatusColor(pqr.status) }}>
              {getStatusIcon(pqr.status)}
              <span>{pqr.status}</span>
            </div>
            <div className="pqr-actions">
              <button className="btn-edit" onClick={() => handleEdit(pqr)}>
                <Edit size={16} />
              </button>
              <button className="btn-delete" onClick={() => handleDelete(pqr.id)}>
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
              <h2>{editingPqr ? 'Editar PQR' : 'Nueva PQR'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <AlertCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Tipo</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="PETICION">PeticiÃ³n</option>
                    <option value="QUEJA">Queja</option>
                    <option value="RECLAMO">Reclamo</option>
                    <option value="SUGERENCIA">Sugerencia</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Prioridad</label>
                  <select
                    value={formData.priority}
                    onChange={e => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="ALTA">Alta</option>
                    <option value="MEDIA">Media</option>
                    <option value="BAJA">Baja</option>
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>TÃ­tulo</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>DescripciÃ³n</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    required
                    rows={4}
                  />
                </div>
                <div className="form-group">
                  <label>Solicitante</label>
                  <input
                    type="text"
                    value={formData.requester}
                    onChange={e => setFormData({...formData, requester: e.target.value})}
                    required
                    readOnly={isCopropietario}
                    style={isCopropietario ? { background: '#f0f0f0', color: '#666' } : {}}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    readOnly={isCopropietario}
                    style={isCopropietario ? { background: '#f0f0f0', color: '#666' } : {}}
                  />
                </div>
                <div className="form-group">
                  <label>TelÃ©fono</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    readOnly={isCopropietario}
                    style={isCopropietario ? { background: '#f0f0f0', color: '#666' } : {}}
                  />
                </div>
                {!isCopropietario && (
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="EN PROCESO">En proceso</option>
                    <option value="RESUELTA">Resuelta</option>
                  </select>
                </div>
                )}
                {!isCopropietario && (
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Respuesta</label>
                  <textarea
                    value={formData.response}
                    onChange={e => setFormData({...formData, response: e.target.value})}
                    rows={3}
                    placeholder="Respuesta de la administraciÃ³n..."
                  />
                </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingPqr ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
