import React, { useState, useEffect } from 'react';
import { CreditCard, Search, Plus, Edit, Trash2, Filter, DollarSign, Building2, Calendar } from 'lucide-react';

import { API_URL } from './api.js';

export default function BankAccountsManagement() {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [formData, setFormData] = useState({
    accountNumber: '',
    bankName: '',
    accountType: 'AHORROS',
    accountName: '',
    currentBalance: '',
    accountPurpose: '',
    isOperational: false,
    isReserveFund: false,
    openingDate: '',
    closingDate: '',
    status: 'ACTIVO',
    authorizedSignatories: '',
    accountManager: '',
    managerPhone: '',
    managerEmail: '',
    branchOffice: '',
    swiftCode: '',
    accountCurrency: 'COP',
    minimumBalance: '',
    overdraftLimit: '',
    interestRate: '',
    monthlyFee: '',
    lastStatementDate: '',
    nextStatementDate: '',
    observations: ''
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch(`${API_URL}/bank-accounts`);
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingAccount 
        ? `${API_URL}/bank-accounts/${editingAccount.id}`
        : `${API_URL}/bank-accounts`;
      
      const method = editingAccount ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchAccounts();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving account:', error);
    }
  };

  const handleEdit = (account) => {
    setEditingAccount(account);
    setFormData({
      accountNumber: account.accountNumber || '',
      bankName: account.bankName || '',
      accountType: account.accountType || 'AHORROS',
      accountName: account.accountName || '',
      currentBalance: account.currentBalance || '',
      accountPurpose: account.accountPurpose || '',
      isOperational: account.isOperational || false,
      isReserveFund: account.isReserveFund || false,
      openingDate: account.openingDate || '',
      closingDate: account.closingDate || '',
      status: account.status || 'ACTIVO',
      authorizedSignatories: account.authorizedSignatories || '',
      accountManager: account.accountManager || '',
      managerPhone: account.managerPhone || '',
      managerEmail: account.managerEmail || '',
      branchOffice: account.branchOffice || '',
      swiftCode: account.swiftCode || '',
      accountCurrency: account.accountCurrency || 'COP',
      minimumBalance: account.minimumBalance || '',
      overdraftLimit: account.overdraftLimit || '',
      interestRate: account.interestRate || '',
      monthlyFee: account.monthlyFee || '',
      lastStatementDate: account.lastStatementDate || '',
      nextStatementDate: account.nextStatementDate || '',
      observations: account.observations || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta cuenta?')) {
      try {
        const response = await fetch(`${API_URL}/bank-accounts/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchAccounts();
        }
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      accountNumber: '',
      bankName: '',
      accountType: 'AHORROS',
      accountName: '',
      currentBalance: '',
      accountPurpose: '',
      isOperational: false,
      isReserveFund: false,
      openingDate: '',
      closingDate: '',
      status: 'ACTIVO',
      authorizedSignatories: '',
      accountManager: '',
      managerPhone: '',
      managerEmail: '',
      branchOffice: '',
      swiftCode: '',
      accountCurrency: 'COP',
      minimumBalance: '',
      overdraftLimit: '',
      interestRate: '',
      monthlyFee: '',
      lastStatementDate: '',
      nextStatementDate: '',
      observations: ''
    });
    setEditingAccount(null);
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = 
      account.accountNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.bankName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || account.status === filterStatus;
    const matchesType = filterType === 'all' || account.accountType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="property-units-management">
      <div className="contractors-header">
        <div className="header-title">
          <CreditCard size={32} />
          <h1>Cuentas Bancarias</h1>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus size={20} />
          Nueva Cuenta
        </button>
      </div>

      <div className="contractors-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por número o banco..."
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
            <option value="CERRADA">Cerrada</option>
          </select>
        </div>
        <div className="filter-group">
          <Building2 size={18} />
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">Todos los tipos</option>
            <option value="AHORROS">Ahorros</option>
            <option value="CORRIENTE">Corriente</option>
            <option value="CDT">CDT</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Banco</th>
              <th>Tipo</th>
              <th>Saldo</th>
              <th>Propósito</th>
              <th>Operacional</th>
              <th>Fondo Reserva</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map(account => (
              <tr key={account.id}>
                <td>
                  <div className="unit-info">
                    <CreditCard size={16} />
                    <strong>{account.accountNumber}</strong>
                  </div>
                </td>
                <td>{account.bankName}</td>
                <td>{account.accountType}</td>
                <td>
                  <div className="value-info">
                    <DollarSign size={14} />
                    <span>{account.currentBalance}</span>
                  </div>
                </td>
                <td>{account.accountPurpose}</td>
                <td>
                  <span className={`status-badge ${account.isOperational ? 'activo' : 'inactivo'}`}>
                    {account.isOperational ? 'Sí' : 'No'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${account.isReserveFund ? 'activo' : 'inactivo'}`}>
                    {account.isReserveFund ? 'Sí' : 'No'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${account.status?.toLowerCase()}`}>
                    {account.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => handleEdit(account)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(account.id)}>
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
              <h2>{editingAccount ? 'Editar Cuenta' : 'Nueva Cuenta'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>í—</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Número de Cuenta *</label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nombre del Banco *</label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tipo de Cuenta</label>
                  <select
                    value={formData.accountType}
                    onChange={(e) => setFormData({...formData, accountType: e.target.value})}
                  >
                    <option value="AHORROS">Ahorros</option>
                    <option value="CORRIENTE">Corriente</option>
                    <option value="CDT">CDT</option>
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
                  <label>Propósito</label>
                  <input
                    type="text"
                    value={formData.accountPurpose}
                    onChange={(e) => setFormData({...formData, accountPurpose: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Cuenta Operacional</label>
                  <select
                    value={formData.isOperational}
                    onChange={(e) => setFormData({...formData, isOperational: e.target.value === 'true'})}
                  >
                    <option value="false">No</option>
                    <option value="true">Sí</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Fondo de Reserva</label>
                  <select
                    value={formData.isReserveFund}
                    onChange={(e) => setFormData({...formData, isReserveFund: e.target.value === 'true'})}
                  >
                    <option value="false">No</option>
                    <option value="true">Sí</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="ACTIVO">Activo</option>
                    <option value="INACTIVO">Inactivo</option>
                    <option value="CERRADA">Cerrada</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingAccount ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
