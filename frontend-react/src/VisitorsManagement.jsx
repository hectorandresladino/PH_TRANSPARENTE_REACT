import React, { useState, useEffect } from 'react';
import { Shield, Plus, Edit, Trash2, Search, LogOut, LogIn, Clock, User as UserIcon, Car } from 'lucide-react';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || `http://${location.hostname}:8081/api`;

export default function VisitorsManagement() {
  const [visitors, setVisitors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('TODOS');
  const [formData, setFormData] = useState({
    name: '',
    documentNumber: '',
    documentType: 'CC',
    phone: '',
    hostUserId: '',
    hostName: '',
    hostUnit: '',
    visitType: 'VISITA',
    purpose: '',
    status: 'ACTIVO',
    vehiclePlate: '',
    notes: ''
  });

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const response = await fetch(`${API_URL}/visitors`);
      if (response.ok) {
        const data = await response.json();
        setVisitors(data);
      }
    } catch (error) {
      console.error('Error fetching visitors:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingVisitor 
        ? `${API_URL}/visitors/${editingVisitor.id}`
        : `${API_URL}/visitors`;
      const method = editingVisitor ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchVisitors();
        setShowModal(false);
        setEditingVisitor(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving visitor:', error);
    }
  };

  const handleEdit = (visitor) => {
    setEditingVisitor(visitor);
    setFormData({
      name: visitor.name,
      documentNumber: visitor.documentNumber || '',
      documentType: visitor.documentType || 'CC',
      phone: visitor.phone || '',
      hostUserId: visitor.hostUserId || '',
      hostName: visitor.hostName || '',
      hostUnit: visitor.hostUnit || '',
      visitType: visitor.visitType,
      purpose: visitor.purpose || '',
      status: visitor.status,
      vehiclePlate: visitor.vehiclePlate || '',
      notes: visitor.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Â¿EstÃ¡s seguro de eliminar este visitante?')) {
      try {
        const response = await fetch(`${API_URL}/visitors/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchVisitors();
        }
      } catch (error) {
        console.error('Error deleting visitor:', error);
      }
    }
  };

  const handleExit = async (visitor) => {
    try {
      const response = await fetch(`${API_URL}/visitors/${visitor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...visitor, status: 'SALIDA' })
      });
      if (response.ok) {
        fetchVisitors();
      }
    } catch (error) {
      console.error('Error registering exit:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      documentNumber: '',
      documentType: 'CC',
      phone: '',
      hostUserId: '',
      hostName: '',
      hostUnit: '',
      visitType: 'VISITA',
      purpose: '',
      status: 'ACTIVO',
      vehiclePlate: '',
      notes: ''
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVO': return <LogIn size={16} />;
      case 'SALIDA': return <LogOut size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVO': return '#10b981';
      case 'SALIDA': return '#6b7280';
      default: return '#f59e0b';
    }
  };

  const filteredVisitors = visitors.filter(visitor => {
    const matchesSearch = 
      visitor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.documentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.hostName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'TODOS' || visitor.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDateTime = (dateTime) => {
    if (!dateTime) return '-';
    const date = new Date(dateTime);
    return date.toLocaleString('es-ES', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  };

  return (
    <div className="visitors-management">
      <div className="visitors-header">
        <div className="header-title">
          <Shield size={32} />
          <h1>Vigilancia y Visitantes</h1>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setEditingVisitor(null); setShowModal(true); }}>
          <Plus size={20} />
          <span>Nuevo Visitante</span>
        </button>
      </div>

      <div className="visitors-filters">
        <div className="search-bar">
          <Search size={20} />
          <input
            placeholder="Buscar visitantes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="TODOS">Todos los estados</option>
          <option value="ACTIVO">Activos en el edificio</option>
          <option value="SALIDA">Ya salieron</option>
        </select>
      </div>

      <div className="visitors-grid">
        {filteredVisitors.map(visitor => (
          <div key={visitor.id} className="visitor-card">
            <div className="visitor-header">
              <div className="visitor-info">
                <UserIcon size={20} />
                <span className="visitor-name">{visitor.name}</span>
              </div>
              <span className="status-badge" style={{ color: getStatusColor(visitor.status) }}>
                {getStatusIcon(visitor.status)}
                {visitor.status}
              </span>
            </div>
            <div className="visitor-details">
              <div className="detail-row">
                <span className="detail-label">Documento:</span>
                <span>{visitor.documentNumber || '-'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">AnfitriÃ³n:</span>
                <span>{visitor.hostName || '-'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Unidad:</span>
                <span>{visitor.hostUnit || '-'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Tipo:</span>
                <span>{visitor.visitType}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Entrada:</span>
                <span>{formatDateTime(visitor.entryTime)}</span>
              </div>
              {visitor.exitTime && (
                <div className="detail-row">
                  <span className="detail-label">Salida:</span>
                  <span>{formatDateTime(visitor.exitTime)}</span>
                </div>
              )}
              {visitor.vehiclePlate && (
                <div className="detail-row">
                  <Car size={14} />
                  <span>{visitor.vehiclePlate}</span>
                </div>
              )}
            </div>
            <div className="visitor-actions">
              {visitor.status === 'ACTIVO' && (
                <button className="btn-exit" onClick={() => handleExit(visitor)}>
                  <LogOut size={16} />
                  <span>Registrar Salida</span>
                </button>
              )}
              <button className="btn-edit" onClick={() => handleEdit(visitor)}>
                <Edit size={16} />
              </button>
              <button className="btn-delete" onClick={() => handleDelete(visitor.id)}>
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
              <h2>{editingVisitor ? 'Editar Visitante' : 'Nuevo Visitante'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <Clock size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nombre Completo</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tipo Documento</label>
                  <select
                    value={formData.documentType}
                    onChange={e => setFormData({...formData, documentType: e.target.value})}
                  >
                    <option value="CC">CÃ©dula</option>
                    <option value="CE">CÃ©dula ExtranjerÃ­a</option>
                    <option value="TI">Tarjeta Identidad</option>
                    <option value="PP">Pasaporte</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>NÃºmero Documento</label>
                  <input
                    type="text"
                    value={formData.documentNumber}
                    onChange={e => setFormData({...formData, documentNumber: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>TelÃ©fono</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Tipo Visita</label>
                  <select
                    value={formData.visitType}
                    onChange={e => setFormData({...formData, visitType: e.target.value})}
                  >
                    <option value="VISITA">Visita</option>
                    <option value="DOMICILIO">Domicilio</option>
                    <option value="MANTENIMIENTO">Mantenimiento</option>
                    <option value="PROVEEDOR">Proveedor</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="ACTIVO">Activo</option>
                    <option value="SALIDA">Salida</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Nombre AnfitriÃ³n</label>
                  <input
                    type="text"
                    value={formData.hostName}
                    onChange={e => setFormData({...formData, hostName: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Unidad</label>
                  <input
                    type="text"
                    value={formData.hostUnit}
                    onChange={e => setFormData({...formData, hostUnit: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Placa VehÃ­culo</label>
                  <input
                    type="text"
                    value={formData.vehiclePlate}
                    onChange={e => setFormData({...formData, vehiclePlate: e.target.value})}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>PropÃ³sito</label>
                  <textarea
                    value={formData.purpose}
                    onChange={e => setFormData({...formData, purpose: e.target.value})}
                    rows={2}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Notas</label>
                  <textarea
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    rows={2}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingVisitor ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
