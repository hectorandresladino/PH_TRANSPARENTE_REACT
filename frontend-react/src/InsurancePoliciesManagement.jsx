import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, Plus, Edit, Trash2, Filter, DollarSign, Calendar, FileText } from 'lucide-react';

import { API_URL } from './api.js';

export default function InsurancePoliciesManagement() {
  const [policies, setPolicies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [formData, setFormData] = useState({
    policyNumber: '',
    insuranceCompany: '',
    insuranceType: 'INCENDIO',
    coverageAmount: '',
    annualPremium: '',
    policyStartDate: '',
    policyEndDate: '',
    renewalDate: '',
    status: 'ACTIVO',
    deductible: '',
    coverageDetails: '',
    exclusions: '',
    insuredProperty: '',
    beneficiary: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    paymentFrequency: 'ANUAL',
    paymentMethod: '',
    lastPaymentDate: '',
    nextPaymentDate: '',
    claimHistory: '',
    policyDocument: '',
    observations: ''
  });

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response = await fetch(`${API_URL}/insurance-policies`);
      if (response.ok) {
        const data = await response.json();
        setPolicies(data);
      }
    } catch (error) {
      console.error('Error fetching policies:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingPolicy 
        ? `${API_URL}/insurance-policies/${editingPolicy.id}`
        : `${API_URL}/insurance-policies`;
      
      const method = editingPolicy ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchPolicies();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving policy:', error);
    }
  };

  const handleEdit = (policy) => {
    setEditingPolicy(policy);
    setFormData({
      policyNumber: policy.policyNumber || '',
      insuranceCompany: policy.insuranceCompany || '',
      insuranceType: policy.insuranceType || 'INCENDIO',
      coverageAmount: policy.coverageAmount || '',
      annualPremium: policy.annualPremium || '',
      policyStartDate: policy.policyStartDate || '',
      policyEndDate: policy.policyEndDate || '',
      renewalDate: policy.renewalDate || '',
      status: policy.status || 'ACTIVO',
      deductible: policy.deductible || '',
      coverageDetails: policy.coverageDetails || '',
      exclusions: policy.exclusions || '',
      insuredProperty: policy.insuredProperty || '',
      beneficiary: policy.beneficiary || '',
      contactPerson: policy.contactPerson || '',
      contactPhone: policy.contactPhone || '',
      contactEmail: policy.contactEmail || '',
      paymentFrequency: policy.paymentFrequency || 'ANUAL',
      paymentMethod: policy.paymentMethod || '',
      lastPaymentDate: policy.lastPaymentDate || '',
      nextPaymentDate: policy.nextPaymentDate || '',
      claimHistory: policy.claimHistory || '',
      policyDocument: policy.policyDocument || '',
      observations: policy.observations || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta póliza?')) {
      try {
        const response = await fetch(`${API_URL}/insurance-policies/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchPolicies();
        }
      } catch (error) {
        console.error('Error deleting policy:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      policyNumber: '',
      insuranceCompany: '',
      insuranceType: 'INCENDIO',
      coverageAmount: '',
      annualPremium: '',
      policyStartDate: '',
      policyEndDate: '',
      renewalDate: '',
      status: 'ACTIVO',
      deductible: '',
      coverageDetails: '',
      exclusions: '',
      insuredProperty: '',
      beneficiary: '',
      contactPerson: '',
      contactPhone: '',
      contactEmail: '',
      paymentFrequency: 'ANUAL',
      paymentMethod: '',
      lastPaymentDate: '',
      nextPaymentDate: '',
      claimHistory: '',
      policyDocument: '',
      observations: ''
    });
    setEditingPolicy(null);
  };

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = 
      policy.policyNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.insuranceCompany?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || policy.status === filterStatus;
    const matchesType = filterType === 'all' || policy.insuranceType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="property-units-management">
      <div className="contractors-header">
        <div className="header-title">
          <ShieldCheck size={32} />
          <h1>Pólizas de Seguro</h1>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus size={20} />
          Nueva Póliza
        </button>
      </div>

      <div className="contractors-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por póliza o compañía..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter size={18} />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Todos los estados</option>
            <option value="ACTIVO">Activo</option>
            <option value="VENCIDO">Vencido</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>
        <div className="filter-group">
          <ShieldCheck size={18} />
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">Todos los tipos</option>
            <option value="INCENDIO">Incendio</option>
            <option value="TERREMOTO">Terremoto</option>
            <option value="RESPONSABILIDAD">Responsabilidad Civil</option>
            <option value="ROBO">Robo</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Póliza</th>
              <th>Compañía</th>
              <th>Tipo</th>
              <th>Cobertura</th>
              <th>Prima Anual</th>
              <th>Vigencia</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPolicies.map(policy => (
              <tr key={policy.id}>
                <td>
                  <div className="unit-info">
                    <FileText size={16} />
                    <strong>{policy.policyNumber}</strong>
                  </div>
                </td>
                <td>{policy.insuranceCompany}</td>
                <td>{policy.insuranceType}</td>
                <td>
                  <div className="value-info">
                    <DollarSign size={14} />
                    <span>{policy.coverageAmount}</span>
                  </div>
                </td>
                <td>{policy.annualPremium}</td>
                <td>
                  <div className="date-info">
                    <Calendar size={14} />
                    <span>{policy.policyStartDate} - {policy.policyEndDate}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${policy.status?.toLowerCase()}`}>
                    {policy.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => handleEdit(policy)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(policy.id)}>
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
              <h2>{editingPolicy ? 'Editar Póliza' : 'Nueva Póliza'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>í—</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Número de Póliza *</label>
                  <input
                    type="text"
                    value={formData.policyNumber}
                    onChange={(e) => setFormData({...formData, policyNumber: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Compañía de Seguros *</label>
                  <input
                    type="text"
                    value={formData.insuranceCompany}
                    onChange={(e) => setFormData({...formData, insuranceCompany: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tipo de Seguro</label>
                  <select
                    value={formData.insuranceType}
                    onChange={(e) => setFormData({...formData, insuranceType: e.target.value})}
                  >
                    <option value="INCENDIO">Incendio</option>
                    <option value="TERREMOTO">Terremoto</option>
                    <option value="RESPONSABILIDAD">Responsabilidad Civil</option>
                    <option value="ROBO">Robo</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Monto de Cobertura</label>
                  <input
                    type="text"
                    value={formData.coverageAmount}
                    onChange={(e) => setFormData({...formData, coverageAmount: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Prima Anual</label>
                  <input
                    type="text"
                    value={formData.annualPremium}
                    onChange={(e) => setFormData({...formData, annualPremium: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Fecha Inicio</label>
                  <input
                    type="date"
                    value={formData.policyStartDate}
                    onChange={(e) => setFormData({...formData, policyStartDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Fecha Fin</label>
                  <input
                    type="date"
                    value={formData.policyEndDate}
                    onChange={(e) => setFormData({...formData, policyEndDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="ACTIVO">Activo</option>
                    <option value="VENCIDO">Vencido</option>
                    <option value="CANCELADO">Cancelado</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingPolicy ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
