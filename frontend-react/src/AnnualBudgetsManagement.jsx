import React, { useState, useEffect } from 'react';
import { Calendar, Search, Plus, Edit, Trash2, Filter, DollarSign, TrendingUp, PieChart } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || `http://${location.hostname}:8081/api`;

export default function AnnualBudgetsManagement() {
  const [budgets, setBudgets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({
    budgetYear: new Date().getFullYear(),
    budgetName: '',
    description: '',
    totalBudgetedAmount: '',
    totalExecutedAmount: '',
    totalRemainingAmount: '',
    executionPercentage: 0,
    approvalDate: '',
    approvedBy: '',
    assemblyResolution: '',
    status: 'BORRADOR',
    budgetType: 'OPERATIVO'
  });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await fetch(`${API_URL}/annual-budgets`);
      if (response.ok) {
        const data = await response.json();
        setBudgets(data);
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingBudget 
        ? `${API_URL}/annual-budgets/${editingBudget.id}`
        : `${API_URL}/annual-budgets`;
      
      const method = editingBudget ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchBudgets();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      budgetYear: budget.budgetYear || new Date().getFullYear(),
      budgetName: budget.budgetName || '',
      description: budget.description || '',
      totalBudgetedAmount: budget.totalBudgetedAmount || '',
      totalExecutedAmount: budget.totalExecutedAmount || '',
      totalRemainingAmount: budget.totalRemainingAmount || '',
      executionPercentage: budget.executionPercentage || 0,
      approvalDate: budget.approvalDate || '',
      approvedBy: budget.approvedBy || '',
      assemblyResolution: budget.assemblyResolution || '',
      status: budget.status || 'BORRADOR',
      budgetType: budget.budgetType || 'OPERATIVO'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Â¿EstÃ¡ seguro de eliminar este presupuesto?')) {
      try {
        const response = await fetch(`${API_URL}/annual-budgets/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchBudgets();
        }
      } catch (error) {
        console.error('Error deleting budget:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      budgetYear: new Date().getFullYear(),
      budgetName: '',
      description: '',
      totalBudgetedAmount: '',
      totalExecutedAmount: '',
      totalRemainingAmount: '',
      executionPercentage: 0,
      approvalDate: '',
      approvedBy: '',
      assemblyResolution: '',
      status: 'BORRADOR',
      budgetType: 'OPERATIVO'
    });
    setEditingBudget(null);
  };

  const filteredBudgets = budgets.filter(budget => {
    const matchesSearch = 
      budget.budgetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      budget.budgetYear?.toString().includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || budget.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="property-units-management">
      <div className="contractors-header">
        <div className="header-title">
          <Calendar size={32} />
          <h1>Presupuesto Anual</h1>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus size={20} />
          Nuevo Presupuesto
        </button>
      </div>

      <div className="contractors-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o aÃ±o..."
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
            <option value="EJECUCION">En EjecuciÃ³n</option>
            <option value="CERRADO">Cerrado</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>AÃ±o</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Presupuestado</th>
              <th>Ejecutado</th>
              <th>Restante</th>
              <th>% EjecuciÃ³n</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredBudgets.map(budget => (
              <tr key={budget.id}>
                <td>
                  <div className="unit-info">
                    <Calendar size={16} />
                    <strong>{budget.budgetYear}</strong>
                  </div>
                </td>
                <td>{budget.budgetName}</td>
                <td>{budget.budgetType}</td>
                <td>
                  <div className="value-info">
                    <DollarSign size={14} />
                    <span>{budget.totalBudgetedAmount}</span>
                  </div>
                </td>
                <td>{budget.totalExecutedAmount}</td>
                <td>{budget.totalRemainingAmount}</td>
                <td>
                  <div className="execution-info">
                    <TrendingUp size={14} />
                    <span>{budget.executionPercentage}%</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${budget.status?.toLowerCase()}`}>
                    {budget.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => handleEdit(budget)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(budget.id)}>
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
              <h2>{editingBudget ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>Ã—</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>AÃ±o *</label>
                  <input
                    type="number"
                    value={formData.budgetYear}
                    onChange={(e) => setFormData({...formData, budgetYear: parseInt(e.target.value)})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nombre del Presupuesto *</label>
                  <input
                    type="text"
                    value={formData.budgetName}
                    onChange={(e) => setFormData({...formData, budgetName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tipo de Presupuesto</label>
                  <select
                    value={formData.budgetType}
                    onChange={(e) => setFormData({...formData, budgetType: e.target.value})}
                  >
                    <option value="OPERATIVO">Operativo</option>
                    <option value="INVERSION">InversiÃ³n</option>
                    <option value="MANTENIMIENTO">Mantenimiento</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Monto Presupuestado</label>
                  <input
                    type="text"
                    value={formData.totalBudgetedAmount}
                    onChange={(e) => setFormData({...formData, totalBudgetedAmount: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Monto Ejecutado</label>
                  <input
                    type="text"
                    value={formData.totalExecutedAmount}
                    onChange={(e) => setFormData({...formData, totalExecutedAmount: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>% EjecuciÃ³n</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.executionPercentage}
                    onChange={(e) => setFormData({...formData, executionPercentage: parseFloat(e.target.value)})}
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
                    <option value="EJECUCION">En EjecuciÃ³n</option>
                    <option value="CERRADO">Cerrado</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>ResoluciÃ³n de Asamblea</label>
                  <input
                    type="text"
                    value={formData.assemblyResolution}
                    onChange={(e) => setFormData({...formData, assemblyResolution: e.target.value})}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingBudget ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
