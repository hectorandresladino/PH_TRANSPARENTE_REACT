import React, { useState, useEffect } from 'react';
import { FileText, Plus, Edit, Trash2, Search, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || `http://${location.hostname}:8081/api`;

export default function ContractsManagement() {
  const [contracts, setContracts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('TODOS');
  const [formData, setFormData] = useState({
    contractNumber: '',
    type: 'SERVICIO',
    providerName: '',
    providerDocument: '',
    description: '',
    amount: '',
    currency: 'COP',
    startDate: '',
    endDate: '',
    status: 'ACTIVO',
    terms: ''
  });

  const contractTypes = ['SERVICIO', 'MANTENIMIENTO', 'SUMINISTRO', 'ALQUILER', 'SEGURO', 'CONSTRUCCION'];

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const response = await fetch(`${API_URL}/contracts`);
      if (response.ok) {
        const data = await response.json();
        setContracts(data);
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingContract 
        ? `${API_URL}/contracts/${editingContract.id}`
        : `${API_URL}/contracts`;
      const method = editingContract ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount)
        })
      });

      if (response.ok) {
        fetchContracts();
        setShowModal(false);
        setEditingContract(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving contract:', error);
    }
  };

  const handleEdit = (contract) => {
    setEditingContract(contract);
    setFormData({
      contractNumber: contract.contractNumber,
      type: contract.type,
      providerName: contract.providerName,
      providerDocument: contract.providerDocument || '',
      description: contract.description || '',
      amount: contract.amount,
      currency: contract.currency || 'COP',
      startDate: contract.startDate || '',
      endDate: contract.endDate || '',
      status: contract.status,
      terms: contract.terms || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Â¿EstÃ¡s seguro de eliminar este contrato?')) {
      try {
        const response = await fetch(`${API_URL}/contracts/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchContracts();
        }
      } catch (error) {
        console.error('Error deleting contract:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      contractNumber: '',
      type: 'SERVICIO',
      providerName: '',
      providerDocument: '',
      description: '',
      amount: '',
      currency: 'COP',
      startDate: '',
      endDate: '',
      status: 'ACTIVO',
      terms: ''
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVO': return <CheckCircle size={16} />;
      case 'VENCIDO': return <XCircle size={16} />;
      case 'PENDIENTE': return <Clock size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVO': return '#10b981';
      case 'VENCIDO': return '#ef4444';
      case 'PENDIENTE': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = 
      contract.contractNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.providerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'TODOS' || contract.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency || 'COP'
    }).format(amount);
  };

  return (
    <div className="contracts-management">
      <div className="contracts-header">
        <div className="header-title">
          <FileText size={32} />
          <h1>GestiÃ³n de Contratos</h1>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setEditingContract(null); setShowModal(true); }}>
          <Plus size={20} />
          <span>Nuevo Contrato</span>
        </button>
      </div>

      <div className="contracts-filters">
        <div className="search-bar">
          <Search size={20} />
          <input
            placeholder="Buscar contratos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="TODOS">Todos los estados</option>
          <option value="ACTIVO">Activos</option>
          <option value="VENCIDO">Vencidos</option>
          <option value="PENDIENTE">Pendientes</option>
        </select>
      </div>

      <div className="contracts-grid">
        {filteredContracts.map(contract => (
          <div key={contract.id} className="contract-card">
            <div className="contract-header">
              <span className="contract-number">{contract.contractNumber}</span>
              <span className="status-badge" style={{ color: getStatusColor(contract.status) }}>
                {getStatusIcon(contract.status)}
                {contract.status}
              </span>
            </div>
            <div className="contract-info">
              <div className="contract-provider">{contract.providerName}</div>
              <div className="contract-type">{contract.type}</div>
              {contract.description && (
                <p className="contract-description">{contract.description}</p>
              )}
            </div>
            <div className="contract-details">
              <div className="detail-row">
                <DollarSign size={16} />
                <span className="contract-amount">{formatCurrency(contract.amount, contract.currency)}</span>
              </div>
              {contract.startDate && (
                <div className="detail-row">
                  <Clock size={16} />
                  <span>Inicio: {new Date(contract.startDate).toLocaleDateString('es-ES')}</span>
                </div>
              )}
              {contract.endDate && (
                <div className="detail-row">
                  <Clock size={16} />
                  <span>Fin: {new Date(contract.endDate).toLocaleDateString('es-ES')}</span>
                </div>
              )}
            </div>
            <div className="contract-actions">
              <button className="btn-edit" onClick={() => handleEdit(contract)}>
                <Edit size={16} />
              </button>
              <button className="btn-delete" onClick={() => handleDelete(contract.id)}>
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
              <h2>{editingContract ? 'Editar Contrato' : 'Nuevo Contrato'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>NÃºmero de Contrato</label>
                  <input
                    type="text"
                    value={formData.contractNumber}
                    onChange={e => setFormData({...formData, contractNumber: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tipo de Contrato</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    {contractTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Nombre Proveedor</label>
                  <input
                    type="text"
                    value={formData.providerName}
                    onChange={e => setFormData({...formData, providerName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Documento Proveedor</label>
                  <input
                    type="text"
                    value={formData.providerDocument}
                    onChange={e => setFormData({...formData, providerDocument: e.target.value})}
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
                    <option value="EUR">EUR</option>
                  </select>
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
                  <label>Estado</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="ACTIVO">Activo</option>
                    <option value="VENCIDO">Vencido</option>
                    <option value="PENDIENTE">Pendiente</option>
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>DescripciÃ³n</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    rows={2}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>TÃ©rminos y Condiciones</label>
                  <textarea
                    value={formData.terms}
                    onChange={e => setFormData({...formData, terms: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingContract ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
