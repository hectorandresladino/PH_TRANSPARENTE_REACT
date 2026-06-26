import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, Edit, Trash2, Search, CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || `http://${location.hostname}:8081/api`;

export default function PaymentsManagement() {
  const [payments, setPayments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('TODOS');
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    concept: '',
    amount: '',
    status: 'PENDIENTE',
    paymentMethod: 'EFECTIVO',
    referenceNumber: '',
    dueDate: '',
    description: '',
    userId: ''
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch(`${API_URL}/payments`);
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingPayment 
        ? `${API_URL}/payments/${editingPayment.id}`
        : `${API_URL}/payments`;
      const method = editingPayment ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount)
        })
      });

      if (response.ok) {
        fetchPayments();
        setShowModal(false);
        setEditingPayment(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving payment:', error);
    }
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setFormData({
      invoiceNumber: payment.invoiceNumber,
      concept: payment.concept,
      amount: payment.amount,
      status: payment.status,
      paymentMethod: payment.paymentMethod || 'EFECTIVO',
      referenceNumber: payment.referenceNumber || '',
      dueDate: payment.dueDate || '',
      description: payment.description || '',
      userId: payment.userId || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Â¿EstÃ¡s seguro de eliminar este pago?')) {
      try {
        const response = await fetch(`${API_URL}/payments/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchPayments();
        }
      } catch (error) {
        console.error('Error deleting payment:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      invoiceNumber: '',
      concept: '',
      amount: '',
      status: 'PENDIENTE',
      paymentMethod: 'EFECTIVO',
      referenceNumber: '',
      dueDate: '',
      description: '',
      userId: ''
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PAGADO': return <CheckCircle size={16} />;
      case 'PENDIENTE': return <Clock size={16} />;
      case 'VENCIDO': return <AlertCircle size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAGADO': return '#10b981';
      case 'PENDIENTE': return '#f59e0b';
      case 'VENCIDO': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.concept?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'TODOS' || payment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  return (
    <div className="payments-management">
      <div className="payments-header">
        <div className="header-title">
          <DollarSign size={32} />
          <h1>Pagos y Cartera</h1>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setEditingPayment(null); setShowModal(true); }}>
          <Plus size={20} />
          <span>Nuevo Pago</span>
        </button>
      </div>

      <div className="payments-filters">
        <div className="search-bar">
          <Search size={20} />
          <input
            placeholder="Buscar pagos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="TODOS">Todos los estados</option>
          <option value="PENDIENTE">Pendientes</option>
          <option value="PAGADO">Pagados</option>
          <option value="VENCIDO">Vencidos</option>
        </select>
      </div>

      <div className="payments-table-container">
        <table className="payments-table">
          <thead>
            <tr>
              <th>Factura</th>
              <th>Concepto</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>MÃ©todo</th>
              <th>Vencimiento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map(payment => (
              <tr key={payment.id}>
                <td>
                  <span className="invoice-number">{payment.invoiceNumber}</span>
                </td>
                <td>
                  <div>
                    <div className="payment-concept">{payment.concept}</div>
                    {payment.description && (
                      <div className="payment-description">{payment.description}</div>
                    )}
                  </div>
                </td>
                <td>
                  <span className="payment-amount">{formatCurrency(payment.amount)}</span>
                </td>
                <td>
                  <span className="status-badge" style={{ color: getStatusColor(payment.status) }}>
                    {getStatusIcon(payment.status)}
                    {payment.status}
                  </span>
                </td>
                <td>{payment.paymentMethod || '-'}</td>
                <td>
                  {payment.dueDate ? (
                    <span className="payment-date">
                      <Calendar size={14} />
                      {new Date(payment.dueDate).toLocaleDateString('es-ES')}
                    </span>
                  ) : '-'}
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => handleEdit(payment)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(payment.id)}>
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
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingPayment ? 'Editar Pago' : 'Nuevo Pago'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <AlertCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>NÃºmero de Factura</label>
                  <input
                    type="text"
                    value={formData.invoiceNumber}
                    onChange={e => setFormData({...formData, invoiceNumber: e.target.value})}
                    required
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
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Concepto</label>
                  <input
                    type="text"
                    value={formData.concept}
                    onChange={e => setFormData({...formData, concept: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>MÃ©todo de Pago</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                  >
                    <option value="EFECTIVO">Efectivo</option>
                    <option value="TRANSFERENCIA">Transferencia</option>
                    <option value="TARJETA">Tarjeta</option>
                    <option value="NEQUI">Nequi</option>
                    <option value="PSE">PSE</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="PAGADO">Pagado</option>
                    <option value="VENCIDO">Vencido</option>
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
                <div className="form-group">
                  <label>Referencia</label>
                  <input
                    type="text"
                    value={formData.referenceNumber}
                    onChange={e => setFormData({...formData, referenceNumber: e.target.value})}
                  />
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
                  <label>ID Usuario</label>
                  <input
                    type="text"
                    value={formData.userId}
                    onChange={e => setFormData({...formData, userId: e.target.value})}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingPayment ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
