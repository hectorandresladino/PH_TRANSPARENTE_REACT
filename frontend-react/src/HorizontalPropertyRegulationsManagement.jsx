import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Plus, Edit, Trash2, Filter, Calendar, FileText, Building, Scale } from 'lucide-react';

import { API_URL } from './api.js';

export default function HorizontalPropertyRegulationsManagement() {
  const [regulations, setRegulations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingRegulation, setEditingRegulation] = useState(null);
  const [formData, setFormData] = useState({
    regulationNumber: '',
    regulationName: '',
    description: '',
    approvalDate: '',
    approvedBy: '',
    assemblyResolution: '',
    registrationDate: '',
    registrationNumber: '',
    notaryOffice: '',
    notaryCity: '',
    status: 'BORRADOR',
    regulationVersion: '1.0',
    effectiveDate: '',
    expiryDate: '',
    totalUnits: 0,
    commonAreasDescription: '',
    privateAreasDescription: '',
    useRestrictions: '',
    maintenanceObligations: '',
    paymentObligations: '',
    coownershipCoefficients: '',
    meetingRules: '',
    votingRules: '',
    sanctions: '',
    disputeResolution: '',
    amendmentProcedure: '',
    regulationDocument: '',
    attachments: '',
    observations: ''
  });

  useEffect(() => {
    fetchRegulations();
  }, []);

  const fetchRegulations = async () => {
    try {
      const response = await fetch(`${API_URL}/horizontal-property-regulations`);
      if (response.ok) {
        const data = await response.json();
        setRegulations(data);
      }
    } catch (error) {
      console.error('Error fetching regulations:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingRegulation 
        ? `${API_URL}/horizontal-property-regulations/${editingRegulation.id}`
        : `${API_URL}/horizontal-property-regulations`;
      
      const method = editingRegulation ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchRegulations();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving regulation:', error);
    }
  };

  const handleEdit = (regulation) => {
    setEditingRegulation(regulation);
    setFormData({
      regulationNumber: regulation.regulationNumber || '',
      regulationName: regulation.regulationName || '',
      description: regulation.description || '',
      approvalDate: regulation.approvalDate || '',
      approvedBy: regulation.approvedBy || '',
      assemblyResolution: regulation.assemblyResolution || '',
      registrationDate: regulation.registrationDate || '',
      registrationNumber: regulation.registrationNumber || '',
      notaryOffice: regulation.notaryOffice || '',
      notaryCity: regulation.notaryCity || '',
      status: regulation.status || 'BORRADOR',
      regulationVersion: regulation.regulationVersion || '1.0',
      effectiveDate: regulation.effectiveDate || '',
      expiryDate: regulation.expiryDate || '',
      totalUnits: regulation.totalUnits || 0,
      commonAreasDescription: regulation.commonAreasDescription || '',
      privateAreasDescription: regulation.privateAreasDescription || '',
      useRestrictions: regulation.useRestrictions || '',
      maintenanceObligations: regulation.maintenanceObligations || '',
      paymentObligations: regulation.paymentObligations || '',
      coownershipCoefficients: regulation.coownershipCoefficients || '',
      meetingRules: regulation.meetingRules || '',
      votingRules: regulation.votingRules || '',
      sanctions: regulation.sanctions || '',
      disputeResolution: regulation.disputeResolution || '',
      amendmentProcedure: regulation.amendmentProcedure || '',
      regulationDocument: regulation.regulationDocument || '',
      attachments: regulation.attachments || '',
      observations: regulation.observations || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este reglamento?')) {
      try {
        const response = await fetch(`${API_URL}/horizontal-property-regulations/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchRegulations();
        }
      } catch (error) {
        console.error('Error deleting regulation:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      regulationNumber: '',
      regulationName: '',
      description: '',
      approvalDate: '',
      approvedBy: '',
      assemblyResolution: '',
      registrationDate: '',
      registrationNumber: '',
      notaryOffice: '',
      notaryCity: '',
      status: 'BORRADOR',
      regulationVersion: '1.0',
      effectiveDate: '',
      expiryDate: '',
      totalUnits: 0,
      commonAreasDescription: '',
      privateAreasDescription: '',
      useRestrictions: '',
      maintenanceObligations: '',
      paymentObligations: '',
      coownershipCoefficients: '',
      meetingRules: '',
      votingRules: '',
      sanctions: '',
      disputeResolution: '',
      amendmentProcedure: '',
      regulationDocument: '',
      attachments: '',
      observations: ''
    });
    setEditingRegulation(null);
  };

  const filteredRegulations = regulations.filter(regulation => {
    const matchesSearch = 
      regulation.regulationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      regulation.regulationName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || regulation.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="property-units-management">
      <div className="contractors-header">
        <div className="header-title">
          <BookOpen size={32} />
          <h1>Reglamento de Propiedad Horizontal</h1>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus size={20} />
          Nuevo Reglamento
        </button>
      </div>

      <div className="contractors-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por número o nombre..."
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
            <option value="VIGENTE">Vigente</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Nombre</th>
              <th>Versión</th>
              <th>Unidades</th>
              <th>Vigencia</th>
              <th>Notaría</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegulations.map(regulation => (
              <tr key={regulation.id}>
                <td>
                  <div className="unit-info">
                    <Scale size={16} />
                    <strong>{regulation.regulationNumber}</strong>
                  </div>
                </td>
                <td>{regulation.regulationName}</td>
                <td>{regulation.regulationVersion}</td>
                <td>{regulation.totalUnits}</td>
                <td>
                  <div className="date-info">
                    <Calendar size={14} />
                    <span>{regulation.effectiveDate} - {regulation.expiryDate}</span>
                  </div>
                </td>
                <td>{regulation.notaryOffice}</td>
                <td>
                  <span className={`status-badge ${regulation.status?.toLowerCase()}`}>
                    {regulation.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => handleEdit(regulation)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(regulation.id)}>
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
              <h2>{editingRegulation ? 'Editar Reglamento' : 'Nuevo Reglamento'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>í—</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Número de Reglamento *</label>
                  <input
                    type="text"
                    value={formData.regulationNumber}
                    onChange={(e) => setFormData({...formData, regulationNumber: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nombre del Reglamento *</label>
                  <input
                    type="text"
                    value={formData.regulationName}
                    onChange={(e) => setFormData({...formData, regulationName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Versión</label>
                  <input
                    type="text"
                    value={formData.regulationVersion}
                    onChange={(e) => setFormData({...formData, regulationVersion: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Total de Unidades</label>
                  <input
                    type="number"
                    value={formData.totalUnits}
                    onChange={(e) => setFormData({...formData, totalUnits: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Fecha Aprobación</label>
                  <input
                    type="date"
                    value={formData.approvalDate}
                    onChange={(e) => setFormData({...formData, approvalDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Aprobado Por</label>
                  <input
                    type="text"
                    value={formData.approvedBy}
                    onChange={(e) => setFormData({...formData, approvedBy: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Resolución de Asamblea</label>
                  <input
                    type="text"
                    value={formData.assemblyResolution}
                    onChange={(e) => setFormData({...formData, assemblyResolution: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Notaría</label>
                  <input
                    type="text"
                    value={formData.notaryOffice}
                    onChange={(e) => setFormData({...formData, notaryOffice: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Ciudad Notaría</label>
                  <input
                    type="text"
                    value={formData.notaryCity}
                    onChange={(e) => setFormData({...formData, notaryCity: e.target.value})}
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
                    <option value="VIGENTE">Vigente</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingRegulation ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
