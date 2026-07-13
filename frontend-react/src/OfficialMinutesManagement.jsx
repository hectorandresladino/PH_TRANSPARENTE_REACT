import React, { useState, useEffect } from 'react';
import { FileText, Search, Plus, Edit, Trash2, Filter, Calendar, Users, CheckCircle, XCircle } from 'lucide-react';

import { API_URL } from './api.js';

export default function OfficialMinutesManagement() {
  const [minutes, setMinutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingMinute, setEditingMinute] = useState(null);
  const [formData, setFormData] = useState({
    minuteNumber: '',
    assemblyType: 'ORDINARIA',
    meetingDate: '',
    meetingTime: '',
    meetingLocation: '',
    callMethod: 'CONVOCATORIA',
    quorumPresent: '',
    quorumPercentage: 0,
    totalUnits: 0,
    unitsPresent: 0,
    unitsRepresented: 0,
    agendaItems: '',
    decisionsMade: '',
    votesFor: 0,
    votesAgainst: 0,
    votesAbstained: 0,
    presidentName: '',
    secretaryName: '',
    presidentSignature: '',
    secretarySignature: '',
    approvalDate: '',
    approvedBy: '',
    status: 'BORRADOR',
    minuteDocument: '',
    attachments: '',
    observations: ''
  });

  useEffect(() => {
    fetchMinutes();
  }, []);

  const fetchMinutes = async () => {
    try {
      const response = await fetch(`${API_URL}/official-minutes`);
      if (response.ok) {
        const data = await response.json();
        setMinutes(data);
      }
    } catch (error) {
      console.error('Error fetching minutes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingMinute 
        ? `${API_URL}/official-minutes/${editingMinute.id}`
        : `${API_URL}/official-minutes`;
      
      const method = editingMinute ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchMinutes();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving minute:', error);
    }
  };

  const handleEdit = (minute) => {
    setEditingMinute(minute);
    setFormData({
      minuteNumber: minute.minuteNumber || '',
      assemblyType: minute.assemblyType || 'ORDINARIA',
      meetingDate: minute.meetingDate || '',
      meetingTime: minute.meetingTime || '',
      meetingLocation: minute.meetingLocation || '',
      callMethod: minute.callMethod || 'CONVOCATORIA',
      quorumPresent: minute.quorumPresent || '',
      quorumPercentage: minute.quorumPercentage || 0,
      totalUnits: minute.totalUnits || 0,
      unitsPresent: minute.unitsPresent || 0,
      unitsRepresented: minute.unitsRepresented || 0,
      agendaItems: minute.agendaItems || '',
      decisionsMade: minute.decisionsMade || '',
      votesFor: minute.votesFor || 0,
      votesAgainst: minute.votesAgainst || 0,
      votesAbstained: minute.votesAbstained || 0,
      presidentName: minute.presidentName || '',
      secretaryName: minute.secretaryName || '',
      presidentSignature: minute.presidentSignature || '',
      secretarySignature: minute.secretarySignature || '',
      approvalDate: minute.approvalDate || '',
      approvedBy: minute.approvedBy || '',
      status: minute.status || 'BORRADOR',
      minuteDocument: minute.minuteDocument || '',
      attachments: minute.attachments || '',
      observations: minute.observations || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta acta?')) {
      try {
        const response = await fetch(`${API_URL}/official-minutes/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchMinutes();
        }
      } catch (error) {
        console.error('Error deleting minute:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      minuteNumber: '',
      assemblyType: 'ORDINARIA',
      meetingDate: '',
      meetingTime: '',
      meetingLocation: '',
      callMethod: 'CONVOCATORIA',
      quorumPresent: '',
      quorumPercentage: 0,
      totalUnits: 0,
      unitsPresent: 0,
      unitsRepresented: 0,
      agendaItems: '',
      decisionsMade: '',
      votesFor: 0,
      votesAgainst: 0,
      votesAbstained: 0,
      presidentName: '',
      secretaryName: '',
      presidentSignature: '',
      secretarySignature: '',
      approvalDate: '',
      approvedBy: '',
      status: 'BORRADOR',
      minuteDocument: '',
      attachments: '',
      observations: ''
    });
    setEditingMinute(null);
  };

  const filteredMinutes = minutes.filter(minute => {
    const matchesSearch = 
      minute.minuteNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      minute.presidentName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || minute.status === filterStatus;
    const matchesType = filterType === 'all' || minute.assemblyType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="property-units-management">
      <div className="contractors-header">
        <div className="header-title">
          <FileText size={32} />
          <h1>Libro de Actas Oficial</h1>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus size={20} />
          Nueva Acta
        </button>
      </div>

      <div className="contractors-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por número o presidente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter size={18} />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Todos los estados</option>
            <option value="BORRADOR">Borrador</option>
            <option value="APROBADO">Aprobado</option>
            <option value="FIRMADO">Firmado</option>
          </select>
        </div>
        <div className="filter-group">
          <Users size={18} />
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">Todos los tipos</option>
            <option value="ORDINARIA">Ordinaria</option>
            <option value="EXTRAORDINARIA">Extraordinaria</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Tipo</th>
              <th>Fecha</th>
              <th>Quórum</th>
              <th>Votos</th>
              <th>Presidente</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredMinutes.map(minute => (
              <tr key={minute.id}>
                <td>
                  <div className="unit-info">
                    <FileText size={16} />
                    <strong>{minute.minuteNumber}</strong>
                  </div>
                </td>
                <td>{minute.assemblyType}</td>
                <td>
                  <div className="date-info">
                    <Calendar size={14} />
                    <span>{minute.meetingDate}</span>
                  </div>
                </td>
                <td>{minute.quorumPercentage}%</td>
                <td>
                  <div className="votes-info">
                    <CheckCircle size={14} />
                    <span>{minute.votesFor}</span>
                    <XCircle size={14} />
                    <span>{minute.votesAgainst}</span>
                  </div>
                </td>
                <td>{minute.presidentName}</td>
                <td>
                  <span className={`status-badge ${minute.status?.toLowerCase()}`}>
                    {minute.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => handleEdit(minute)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(minute.id)}>
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
              <h2>{editingMinute ? 'Editar Acta' : 'Nueva Acta'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>í—</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Número de Acta *</label>
                  <input
                    type="text"
                    value={formData.minuteNumber}
                    onChange={(e) => setFormData({...formData, minuteNumber: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tipo de Asamblea</label>
                  <select
                    value={formData.assemblyType}
                    onChange={(e) => setFormData({...formData, assemblyType: e.target.value})}
                  >
                    <option value="ORDINARIA">Ordinaria</option>
                    <option value="EXTRAORDINARIA">Extraordinaria</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Fecha de Reunión *</label>
                  <input
                    type="date"
                    value={formData.meetingDate}
                    onChange={(e) => setFormData({...formData, meetingDate: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Hora</label>
                  <input
                    type="time"
                    value={formData.meetingTime}
                    onChange={(e) => setFormData({...formData, meetingTime: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Ubicación</label>
                  <input
                    type="text"
                    value={formData.meetingLocation}
                    onChange={(e) => setFormData({...formData, meetingLocation: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>% Quórum</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.quorumPercentage}
                    onChange={(e) => setFormData({...formData, quorumPercentage: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Presidente</label>
                  <input
                    type="text"
                    value={formData.presidentName}
                    onChange={(e) => setFormData({...formData, presidentName: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Secretario</label>
                  <input
                    type="text"
                    value={formData.secretaryName}
                    onChange={(e) => setFormData({...formData, secretaryName: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Votos a Favor</label>
                  <input
                    type="number"
                    value={formData.votesFor}
                    onChange={(e) => setFormData({...formData, votesFor: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Votos en Contra</label>
                  <input
                    type="number"
                    value={formData.votesAgainst}
                    onChange={(e) => setFormData({...formData, votesAgainst: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="BORRADOR">Borrador</option>
                    <option value="APROBADO">Aprobado</option>
                    <option value="FIRMADO">Firmado</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingMinute ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
