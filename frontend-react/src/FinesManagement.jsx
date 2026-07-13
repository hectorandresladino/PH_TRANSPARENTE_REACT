import React, { useState, useEffect } from 'react';
import { AlertTriangle, Plus, Edit, Trash2, Search, CheckCircle, XCircle, Clock, DollarSign, User as UserIcon } from 'lucide-react';
import './styles.css';

import { API_URL } from './api.js';

export default function FinesManagement() {
  const [fines, setFines] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingFine, setEditingFine] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('TODOS');
  const [formData, setFormData] = useState({
    fineNumber: '',
    type: 'INCUMPLIMIENTO',
    description: '',
    amount: '',
    currency: 'COP',
    userId: '',
    userName: '',
    unit: '',
    status: 'PENDIENTE',
    dueDate: ''
  });

  const fineTypes = ['INCUMPLIMIENTO', 'RUIDO', 'AREAS COMUNES', 'MASCOTAS', 'ESTACIONAMIENTO', 'VIGILANCIA'];

  useEffect(() => {
    fetchFines();
  }, []);

  const fetchFines = async () => {
    try {
      const response = await fetch(`${API_URL}/fines`);
      if (response.ok) {
        const data = await response.json();
        setFines(data);
      }
    } catch (error) {
      console.error('Error fetching fines:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingFine 
        ? `${API_URL}/fines/${editingFine.id}`
        : `${API_URL}/fines`;
      const method = editingFine ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount)
        })
      });

      if (response.ok) {
        fetchFines();
        setShowModal(false);
        setEditingFine(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving fine:', error);
    }
  };

  const handleEdit = (fine) => {
    setEditingFine(fine);
    setFormData({
      fineNumber: fine.fineNumber,
      type: fine.type,
      description: fine.description || '',
      amount: fine.amount,
      currency: fine.currency || 'COP',
      userId: fine.userId,
      userName: fine.userName || '',
      unit: fine.unit || '',
      status: fine.status,
      dueDate: fine.dueDate || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta multa?')) {
      try {
        const response = await fetch(`${API_URL}/fines/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchFines();
        }
      } catch (error) {
        console.error('Error deleting fine:', error);
      }
    }
  };

  const handlePayment = async (fine) => {
    try {
      const response = await fetch(`${API_URL}/fines/${fine.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fine, status: 'PAGADA' })
      });
      if (response.ok) {
        fetchFines();
      }
    } catch (error) {
      console.error('Error registering payment:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      fineNumber: '',
      type: 'INCUMPLIMIENTO',
      description: '',
      amount: '',
      currency: 'COP',
      userId: '',
      userName: '',
      unit: '',
      status: 'PENDIENTE',
      dueDate: ''
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PAGADA': return <CheckCircle size={16} />;
      case 'PENDIENTE': return <Clock size={16} />;
      case 'VENCIDA': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAGADA': return '#10b981';
      case 'PENDIENTE': return '#f59e0b';
      case 'VENCIDA': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const filteredFines = fines.filter(fine => {
    const matchesSearch = 
      fine.fineNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fine.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fine.unit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fine.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'TODOS' || fine.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency || 'COP'
    }).format(amount);
  };

  return (
    <div className="fines-management">
      <div className="fines-header">
        <div className="header-title">
          <AlertTriangle size={32} />
          <h1>Gestión de Multas</h1>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setEditingFine(null); setShowModal(true); }}>
          <Plus size={20} />
          <span>Nueva Multa</span>
        </button>
      </div>

      <div className="fines-filters">
        <div className="search-bar">
          <Search size={20} />
          <input
            placeholder="Buscar multas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="TODOS">Todos los estados</option>
          <option value="PENDIENTE">Pendientes</option>
          <option value="PAGADA">Pagadas</option>
          <option value="VENCIDA">Vencidas</option>
        </select>
      </div>

      <div className="fines-grid">
        {filteredFines.map(fine => (
          <div key={fine.id} className="fine-card">
            <div className="fine-header">
              <span className="fine-number">{fine.fineNumber}</span>
              <span className="status-badge" style={{ color: getStatusColor(fine.status) }}>
                {getStatusIcon(fine.status)}
                {fine.status}
              </span>
            </div>
            <div className="fine-info">
              <div className="fine-type">{fine.type}</div>
              {fine.description && (
                <p className="fine-description">{fine.description}</p>
              )}
            </div>
            <div className="fine-details">
              <div className="detail-row">
                <UserIcon size={16} />
                <span>{fine.userName || 'Sin asignar'}</span>
              </div>
              {fine.unit && (
                <div className="detail-row">
                  <span>Unidad: {fine.unit}</span>
                </div>
              )}
              <div className="detail-row">
                <DollarSign size={16} />
                <span className="fine-amount">{formatCurrency(fine.amount, fine.currency)}</span>
              </div>
              {fine.dueDate && (
                <div className="detail-row">
                  <Clock size={16} />
                  <span>Vence: {new Date(fine.dueDate).toLocaleDateString('es-ES')}</span>
                </div>
              )}
            </div>
            <div className="fine-actions">
              {fine.status === 'PENDIENTE' && (
                <button className="btn-pay" onClick={() => handlePayment(fine)}>
                  <CheckCircle size={16} />
                  <span>Registrar Pago</span>
                </button>
              )}
              <button className="btn-edit" onClick={() => handleEdit(fine)}>
                <Edit size={16} />
              </button>
              <button className="btn-delete" onClick={() => handleDelete(fine.id)}>
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
              <h2>{editingFine ? 'Editar Multa' : 'Nueva Multa'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Número de Multa</label>
                  <input
                    type="text"
                    value={formData.fineNumber}
                    onChange={e => setFormData({...formData, fineNumber: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tipo de Multa</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    {fineTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>ID Usuario</label>
                  <input
                    type="text"
                    value={formData.userId}
                    onChange={e => setFormData({...formData, userId: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nombre Usuario</label>
                  <input
                    type="text"
                    value={formData.userName}
                    onChange={e => setFormData({...formData, userName: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Unidad</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={e => setFormData({...formData, unit: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Monto</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Moneda</label>
                  <select
                    value={formData.currency}
                    onChange={e => setFormData({...formData, currency: e.target.value})}
                  >
                    <option value="COP">COP</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="PAGADA">Pagada</option>
                    <option value="VENCIDA">Vencida</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Fecha Vencimiento</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={e => setFormData({...formData, dueDate: e.target.value})}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Descripción</label>
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
                  {editingFine ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
