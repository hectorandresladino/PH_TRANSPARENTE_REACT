import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Search, CheckCircle, XCircle, Clock, Mail, Phone } from 'lucide-react';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || `http://${location.hostname}:8081/api`;

export default function CouncilsManagement() {
  const [councils, setCouncils] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCouncil, setEditingCouncil] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('TODOS');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    role: 'PRESIDENTE',
    memberId: '',
    memberName: '',
    startDate: '',
    endDate: '',
    status: 'ACTIVO',
    contactEmail: '',
    contactPhone: ''
  });

  const councilRoles = ['PRESIDENTE', 'VICEPRESIDENTE', 'TESORERO', 'SECRETARIO', 'VOCAL'];
  const councilStatuses = ['ACTIVO', 'INACTIVO', 'SUSPENDIDO'];

  useEffect(() => {
    fetchCouncils();
  }, []);

  const fetchCouncils = async () => {
    try {
      const response = await fetch(`${API_URL}/councils`);
      if (response.ok) {
        const data = await response.json();
        setCouncils(data);
      }
    } catch (error) {
      console.error('Error fetching councils:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingCouncil 
        ? `${API_URL}/councils/${editingCouncil.id}`
        : `${API_URL}/councils`;
      const method = editingCouncil ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchCouncils();
        setShowModal(false);
        setEditingCouncil(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving council:', error);
    }
  };

  const handleEdit = (council) => {
    setEditingCouncil(council);
    setFormData({
      name: council.name,
      description: council.description || '',
      role: council.role,
      memberId: council.memberId || '',
      memberName: council.memberName || '',
      startDate: council.startDate || '',
      endDate: council.endDate || '',
      status: council.status,
      contactEmail: council.contactEmail || '',
      contactPhone: council.contactPhone || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Â¿EstÃ¡s seguro de eliminar este miembro del consejo?')) {
      try {
        const response = await fetch(`${API_URL}/councils/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchCouncils();
        }
      } catch (error) {
        console.error('Error deleting council:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      role: 'PRESIDENTE',
      memberId: '',
      memberName: '',
      startDate: '',
      endDate: '',
      status: 'ACTIVO',
      contactEmail: '',
      contactPhone: ''
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVO': return <CheckCircle size={16} />;
      case 'INACTIVO': return <XCircle size={16} />;
      case 'SUSPENDIDO': return <Clock size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVO': return '#10b981';
      case 'INACTIVO': return '#6b7280';
      case 'SUSPENDIDO': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const filteredCouncils = councils.filter(council => {
    const matchesSearch = 
      council.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      council.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      council.memberName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'TODOS' || council.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="councils-management">
      <div className="councils-header">
        <div className="header-title">
          <Users size={32} />
          <h1>GestiÃ³n del Consejo</h1>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setEditingCouncil(null); setShowModal(true); }}>
          <Plus size={20} />
          <span>Nuevo Miembro</span>
        </button>
      </div>

      <div className="councils-filters">
        <div className="search-bar">
          <Search size={20} />
          <input
            placeholder="Buscar miembros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="TODOS">Todos los estados</option>
          {councilStatuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="councils-grid">
        {filteredCouncils.map(council => (
          <div key={council.id} className="council-card">
            <div className="council-header">
              <span className="council-name">{council.name}</span>
              <span className="status-badge" style={{ color: getStatusColor(council.status) }}>
                {getStatusIcon(council.status)}
                {council.status}
              </span>
            </div>
            <div className="council-info">
              <div className="council-role">{council.role}</div>
              {council.description && (
                <p className="council-description">{council.description}</p>
              )}
            </div>
            <div className="council-details">
              <div className="detail-row">
                <span>Miembro: {council.memberName || council.memberId || '-'}</span>
              </div>
              {council.startDate && (
                <div className="detail-row">
                  <Clock size={16} />
                  <span>Inicio: {new Date(council.startDate).toLocaleDateString('es-ES')}</span>
                </div>
              )}
              {council.endDate && (
                <div className="detail-row">
                  <Clock size={16} />
                  <span>Fin: {new Date(council.endDate).toLocaleDateString('es-ES')}</span>
                </div>
              )}
              {council.contactEmail && (
                <div className="detail-row">
                  <Mail size={16} />
                  <span>{council.contactEmail}</span>
                </div>
              )}
              {council.contactPhone && (
                <div className="detail-row">
                  <Phone size={16} />
                  <span>{council.contactPhone}</span>
                </div>
              )}
            </div>
            <div className="council-actions">
              <button className="btn-edit" onClick={() => handleEdit(council)}>
                <Edit size={16} />
              </button>
              <button className="btn-delete" onClick={() => handleDelete(council.id)}>
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
              <h2>{editingCouncil ? 'Editar Miembro' : 'Nuevo Miembro'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Nombre del Cargo</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Rol</label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                  >
                    {councilRoles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    {councilStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>ID Miembro</label>
                  <input
                    type="text"
                    value={formData.memberId}
                    onChange={e => setFormData({...formData, memberId: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Nombre Miembro</label>
                  <input
                    type="text"
                    value={formData.memberName}
                    onChange={e => setFormData({...formData, memberName: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Fecha Inicio</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Fecha Fin</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={e => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={e => setFormData({...formData, contactEmail: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>TelÃ©fono</label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={e => setFormData({...formData, contactPhone: e.target.value})}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>DescripciÃ³n</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingCouncil ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
