import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Trash2, Search, Clock, CheckCircle, XCircle, Users as UsersIcon } from 'lucide-react';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || `http://${location.hostname}:8081/api`;

export default function ReservationsManagement() {
  const [reservations, setReservations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFacility, setFilterFacility] = useState('TODAS');
  const [formData, setFormData] = useState({
    facility: 'SALON SOCIAL',
    userId: '',
    userName: '',
    startTime: '',
    endTime: '',
    attendees: 10,
    status: 'CONFIRMADA',
    notes: ''
  });

  const facilities = ['SALON SOCIAL', 'PISCINA', 'BBQ', 'CANCHA TENNIS', 'CANCHA FUTBOL', 'GIMNASIO', 'ZONA INFANTIL'];

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch(`${API_URL}/reservations`);
      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingReservation 
        ? `${API_URL}/reservations/${editingReservation.id}`
        : `${API_URL}/reservations`;
      const method = editingReservation ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          startTime: new Date(formData.startTime).toISOString(),
          endTime: new Date(formData.endTime).toISOString()
        })
      });

      if (response.ok) {
        fetchReservations();
        setShowModal(false);
        setEditingReservation(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving reservation:', error);
    }
  };

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setFormData({
      facility: reservation.facility,
      userId: reservation.userId || '',
      userName: reservation.userName || '',
      startTime: reservation.startTime ? reservation.startTime.slice(0, 16) : '',
      endTime: reservation.endTime ? reservation.endTime.slice(0, 16) : '',
      attendees: reservation.attendees || 10,
      status: reservation.status,
      notes: reservation.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Â¿EstÃ¡s seguro de eliminar esta reserva?')) {
      try {
        const response = await fetch(`${API_URL}/reservations/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchReservations();
        }
      } catch (error) {
        console.error('Error deleting reservation:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      facility: 'SALON SOCIAL',
      userId: '',
      userName: '',
      startTime: '',
      endTime: '',
      attendees: 10,
      status: 'CONFIRMADA',
      notes: ''
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMADA': return <CheckCircle size={16} />;
      case 'CANCELADA': return <XCircle size={16} />;
      case 'COMPLETADA': return <CheckCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMADA': return '#10b981';
      case 'CANCELADA': return '#ef4444';
      case 'COMPLETADA': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = 
      reservation.facility?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.userName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFacility = filterFacility === 'TODAS' || reservation.facility === filterFacility;
    return matchesSearch && matchesFacility;
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
    <div className="reservations-management">
      <div className="reservations-header">
        <div className="header-title">
          <Calendar size={32} />
          <h1>GestiÃ³n de Reservas</h1>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setEditingReservation(null); setShowModal(true); }}>
          <Plus size={20} />
          <span>Nueva Reserva</span>
        </button>
      </div>

      <div className="reservations-filters">
        <div className="search-bar">
          <Search size={20} />
          <input
            placeholder="Buscar reservas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={filterFacility} onChange={(e) => setFilterFacility(e.target.value)}>
          <option value="TODAS">Todas las instalaciones</option>
          {facilities.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      <div className="reservations-grid">
        {filteredReservations.map(reservation => (
          <div key={reservation.id} className="reservation-card">
            <div className="reservation-header">
              <span className="facility-badge">{reservation.facility}</span>
              <span className="status-badge" style={{ color: getStatusColor(reservation.status) }}>
                {getStatusIcon(reservation.status)}
                {reservation.status}
              </span>
            </div>
            <div className="reservation-info">
              <div className="info-row">
                <UsersIcon size={16} />
                <span>{reservation.userName || 'Sin asignar'}</span>
              </div>
              <div className="info-row">
                <Clock size={16} />
                <span>{formatDateTime(reservation.startTime)}</span>
              </div>
              <div className="info-row">
                <Clock size={16} />
                <span>Fin: {formatDateTime(reservation.endTime)}</span>
              </div>
              {reservation.attendees && (
                <div className="info-row">
                  <UsersIcon size={16} />
                  <span>{reservation.attendees} personas</span>
                </div>
              )}
            </div>
            {reservation.notes && (
              <p className="reservation-notes">{reservation.notes}</p>
            )}
            <div className="reservation-actions">
              <button className="btn-edit" onClick={() => handleEdit(reservation)}>
                <Edit size={16} />
              </button>
              <button className="btn-delete" onClick={() => handleDelete(reservation.id)}>
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
              <h2>{editingReservation ? 'Editar Reserva' : 'Nueva Reserva'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>InstalaciÃ³n</label>
                  <select
                    value={formData.facility}
                    onChange={e => setFormData({...formData, facility: e.target.value})}
                  >
                    {facilities.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="CONFIRMADA">Confirmada</option>
                    <option value="CANCELADA">Cancelada</option>
                    <option value="COMPLETADA">Completada</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Usuario ID</label>
                  <input
                    type="text"
                    value={formData.userId}
                    onChange={e => setFormData({...formData, userId: e.target.value})}
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
                  <label>Fecha y Hora Inicio</label>
                  <input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={e => setFormData({...formData, startTime: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Fecha y Hora Fin</label>
                  <input
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={e => setFormData({...formData, endTime: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>NÃºmero de Personas</label>
                  <input
                    type="number"
                    value={formData.attendees}
                    onChange={e => setFormData({...formData, attendees: parseInt(e.target.value)})}
                    min="1"
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Notas</label>
                  <textarea
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingReservation ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
