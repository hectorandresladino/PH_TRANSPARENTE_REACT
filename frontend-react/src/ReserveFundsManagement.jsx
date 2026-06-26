import React, { useState, useEffect } from 'react';
import { PiggyBank, Search, Plus, Edit, Trash2, Filter, DollarSign, Calendar, TrendingUp } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || `http://${location.hostname}:8081/api`;

export default function ReserveFundsManagement() {
  const [funds, setFunds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingFund, setEditingFund] = useState(null);
  const [formData, setFormData] = useState({
    fundName: '',
    description: '',
    totalAmount: '',
    currentBalance: '',
    requiredPercentage: 10,
    requiredAmount: '',
    accumulatedAmount: '',
    lastContributionDate: '',
    nextContributionDate: '',
    contributionFrequency: 'MENSUAL',
    status: 'ACTIVO',
    fundType: 'RESERVA',
    approvalDate: '',
    approvedBy: '',
    assemblyResolution: '',
    bankAccount: '',
    investmentType: '',
    investmentReturn: '',
    lastAuditDate: '',
    nextAuditDate: '',
    observations: ''
  });

  useEffect(() => {
    fetchFunds();
  }, []);

  const fetchFunds = async () => {
    try {
      const response = await fetch(`${API_URL}/reserve-funds`);
      if (response.ok) {
        const data = await response.json();
        setFunds(data);
      }
    } catch (error) {
      console.error('Error fetching funds:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingFund 
        ? `${API_URL}/reserve-funds/${editingFund.id}`
        : `${API_URL}/reserve-funds`;
      
      const method = editingFund ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchFunds();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving fund:', error);
    }
  };

  const handleEdit = (fund) => {
    setEditingFund(fund);
    setFormData({
      fundName: fund.fundName || '',
      description: fund.description || '',
      totalAmount: fund.totalAmount || '',
      currentBalance: fund.currentBalance || '',
      requiredPercentage: fund.requiredPercentage || 10,
      requiredAmount: fund.requiredAmount || '',
      accumulatedAmount: fund.accumulatedAmount || '',
      lastContributionDate: fund.lastContributionDate || '',
      nextContributionDate: fund.nextContributionDate || '',
      contributionFrequency: fund.contributionFrequency || 'MENSUAL',
      status: fund.status || 'ACTIVO',
      fundType: fund.fundType || 'RESERVA',
      approvalDate: fund.approvalDate || '',
      approvedBy: fund.approvedBy || '',
      assemblyResolution: fund.assemblyResolution || '',
      bankAccount: fund.bankAccount || '',
      investmentType: fund.investmentType || '',
      investmentReturn: fund.investmentReturn || '',
      lastAuditDate: fund.lastAuditDate || '',
      nextAuditDate: fund.nextAuditDate || '',
      observations: fund.observations || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Â¿EstÃ¡ seguro de eliminar este fondo?')) {
      try {
        const response = await fetch(`${API_URL}/reserve-funds/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchFunds();
        }
      } catch (error) {
        console.error('Error deleting fund:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      fundName: '',
      description: '',
      totalAmount: '',
      currentBalance: '',
      requiredPercentage: 10,
      requiredAmount: '',
      accumulatedAmount: '',
      lastContributionDate: '',
      nextContributionDate: '',
      contributionFrequency: 'MENSUAL',
      status: 'ACTIVO',
      fundType: 'RESERVA',
      approvalDate: '',
      approvedBy: '',
      assemblyResolution: '',
      bankAccount: '',
      investmentType: '',
      investmentReturn: '',
      lastAuditDate: '',
      nextAuditDate: '',
      observations: ''
    });
    setEditingFund(null);
  };

  const filteredFunds = funds.filter(fund => {
    const matchesSearch = 
      fund.fundName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fund.bankAccount?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || fund.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="property-units-management">
      <div className="contractors-header">
        <div className="header-title">
          <PiggyBank size={32} />
          <h1>Fondo de Reserva</h1>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus size={20} />
          Nuevo Fondo
        </button>
      </div>

      <div className="contractors-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o cuenta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter size={18} />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Todos los estados</option>
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Fondo</th>
              <th>Tipo</th>
              <th>Saldo Actual</th>
              <th>Requerido</th>
              <th>Acumulado</th>
              <th>% Requerido</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredFunds.map(fund => (
              <tr key={fund.id}>
                <td>
                  <div className="unit-info">
                    <PiggyBank size={16} />
                    <strong>{fund.fundName}</strong>
                  </div>
                </td>
                <td>{fund.fundType}</td>
                <td>
                  <div className="value-info">
                    <DollarSign size={14} />
                    <span>{fund.currentBalance}</span>
                  </div>
                </td>
                <td>{fund.requiredAmount}</td>
                <td>{fund.accumulatedAmount}</td>
                <td>{fund.requiredPercentage}%</td>
                <td>
                  <span className={`status-badge ${fund.status?.toLowerCase()}`}>
                    {fund.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => handleEdit(fund)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(fund.id)}>
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
              <h2>{editingFund ? 'Editar Fondo' : 'Nuevo Fondo'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>Ã—</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Nombre del Fondo *</label>
                  <input
                    type="text"
                    value={formData.fundName}
                    onChange={(e) => setFormData({...formData, fundName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tipo de Fondo</label>
                  <select
                    value={formData.fundType}
                    onChange={(e) => setFormData({...formData, fundType: e.target.value})}
                  >
                    <option value="RESERVA">Reserva</option>
                    <option value="MANTENIMIENTO">Mantenimiento</option>
                    <option value="CONTINGENCIA">Contingencia</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Saldo Actual</label>
                  <input
                    type="text"
                    value={formData.currentBalance}
                    onChange={(e) => setFormData({...formData, currentBalance: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>% Requerido (10% mÃ­nimo)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.requiredPercentage}
                    onChange={(e) => setFormData({...formData, requiredPercentage: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Monto Requerido</label>
                  <input
                    type="text"
                    value={formData.requiredAmount}
                    onChange={(e) => setFormData({...formData, requiredAmount: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Monto Acumulado</label>
                  <input
                    type="text"
                    value={formData.accumulatedAmount}
                    onChange={(e) => setFormData({...formData, accumulatedAmount: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Cuenta Bancaria</label>
                  <input
                    type="text"
                    value={formData.bankAccount}
                    onChange={(e) => setFormData({...formData, bankAccount: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="ACTIVO">Activo</option>
                    <option value="INACTIVO">Inactivo</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingFund ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
