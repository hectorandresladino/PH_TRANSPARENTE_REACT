import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, Plus, Edit, Trash2, Search, Clock, CheckCircle, XCircle, 
  Users as UsersIcon, DollarSign, Upload, Eye, AlertCircle,
  CreditCard, FileText, Building, Phone, Paperclip, X, ChevronLeft, ChevronRight, LayoutGrid
} from 'lucide-react';

import { API_URL } from './api.js';

export default function ReservationsManagement({ userRole = 'admin' }) {
  const [reservations, setReservations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFacility, setFilterFacility] = useState('TODAS');
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  
  const roleUpper = (userRole || '').toUpperCase();
  const isAdmin = ['ADMIN', 'ADMINISTRADOR'].includes(roleUpper);
  const isCopropietario = ['COPIROPIETARIO'].includes(roleUpper);
  
  const [formData, setFormData] = useState({
    facility: 'SALON SOCIAL',
    userName: '',
    userUnit: '',
    userPhone: '',
    startTime: '',
    endTime: '',
    attendees: 10,
    status: 'PENDIENTE',
    paymentStatus: 'PENDIENTE',
    amount: 0,
    paymentMethod: '',
    paymentReference: '',
    paymentProofName: '',
    notes: '',
    adminNotes: '',
    attachmentName: '',
    attachmentType: '',
    attachmentData: ''
  });
  const fileInputRef = useRef(null);
  const [viewingAttachment, setViewingAttachment] = useState(null);

  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'TRANSFERENCIA',
    paymentReference: '',
    paymentProofName: ''
  });

  const facilities = [
    { name: 'SALON SOCIAL', price: 150000, deposit: 100000 },
    { name: 'PISCINA', price: 50000, deposit: 0 },
    { name: 'BBQ', price: 80000, deposit: 50000 },
    { name: 'CANCHA TENNIS', price: 30000, deposit: 0 },
    { name: 'CANCHA FUTBOL', price: 40000, deposit: 0 },
    { name: 'GIMNASIO', price: 0, deposit: 0 },
    { name: 'ZONA INFANTIL', price: 0, deposit: 0 },
    { name: 'SALON DE JUNTAS', price: 100000, deposit: 50000 }
  ];

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = () => {
    const mockReservations = [
      {
        id: 1,
        facility: 'SALON SOCIAL',
        userName: 'Carlos Rodríguez',
        userUnit: 'Apto 301 Torre A',
        userPhone: '+57 315 123 4567',
        startTime: '2026-06-28T14:00:00',
        endTime: '2026-06-28T22:00:00',
        attendees: 50,
        status: 'PENDIENTE',
        paymentStatus: 'PENDIENTE',
        amount: 150000,
        deposit: 100000,
        paymentMethod: '',
        paymentReference: '',
        paymentProofName: '',
        notes: 'Cumpleaños de mi hijo',
        adminNotes: '',
        createdAt: '2026-06-25T10:30:00'
      },
      {
        id: 2,
        facility: 'BBQ',
        userName: 'María González',
        userUnit: 'Apto 502 Torre B',
        userPhone: '+57 316 234 5678',
        startTime: '2026-06-29T12:00:00',
        endTime: '2026-06-29T18:00:00',
        attendees: 20,
        status: 'CONFIRMADA',
        paymentStatus: 'PAGADO',
        amount: 80000,
        deposit: 50000,
        paymentMethod: 'TRANSFERENCIA',
        paymentReference: 'TRF-2026062501',
        paymentProofName: 'comprobante_maria.pdf',
        notes: 'Reunión familiar',
        adminNotes: 'Pago verificado el 25/06/2026',
        createdAt: '2026-06-24T15:00:00'
      },
      {
        id: 3,
        facility: 'SALON SOCIAL',
        userName: 'Pedro Martínez',
        userUnit: 'Apto 101 Torre C',
        userPhone: '+57 317 345 6789',
        startTime: '2026-06-30T16:00:00',
        endTime: '2026-06-30T23:00:00',
        attendees: 80,
        status: 'PENDIENTE',
        paymentStatus: 'EN_REVISION',
        amount: 150000,
        deposit: 100000,
        paymentMethod: 'PSE',
        paymentReference: 'PSE-2026062601',
        paymentProofName: 'pago_pedro.jpg',
        notes: 'Grado de mi hija',
        adminNotes: '',
        createdAt: '2026-06-26T08:00:00'
      },
      {
        id: 4,
        facility: 'PISCINA',
        userName: 'Ana López',
        userUnit: 'Apto 405 Torre A',
        userPhone: '+57 318 456 7890',
        startTime: '2026-07-01T10:00:00',
        endTime: '2026-07-01T14:00:00',
        attendees: 15,
        status: 'CONFIRMADA',
        paymentStatus: 'PAGADO',
        amount: 50000,
        deposit: 0,
        paymentMethod: 'EFECTIVO',
        paymentReference: 'REC-001234',
        paymentProofName: '',
        notes: 'Fiesta infantil',
        adminNotes: 'Pagó en efectivo en administración',
        createdAt: '2026-06-25T11:00:00'
      }
    ];
    setReservations(mockReservations);
  };

  const getFacilityPrice = (facilityName) => {
    const facility = facilities.find(f => f.name === facilityName);
    return facility ? { price: facility.price, deposit: facility.deposit } : { price: 0, deposit: 0 };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const facilityInfo = getFacilityPrice(formData.facility);
    const newReservation = {
      id: editingReservation ? editingReservation.id : Date.now(),
      ...formData,
      amount: facilityInfo.price,
      deposit: facilityInfo.deposit,
      status: isCopropietario ? 'PENDIENTE' : formData.status,
      paymentStatus: facilityInfo.price === 0 ? 'NO_APLICA' : (isCopropietario ? 'PENDIENTE' : formData.paymentStatus),
      createdAt: editingReservation ? editingReservation.createdAt : new Date().toISOString()
    };

    if (editingReservation) {
      setReservations(prev => prev.map(r => r.id === editingReservation.id ? newReservation : r));
    } else {
      setReservations(prev => [...prev, newReservation]);
    }
    
    setShowModal(false);
    setEditingReservation(null);
    resetForm();
    alert(isCopropietario ? '¡Reserva solicitada! Recuerda subir tu comprobante de pago.' : 'Reserva guardada.');
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!paymentData.paymentReference) {
      alert('Ingresa el número de referencia del pago');
      return;
    }
    
    setReservations(prev => prev.map(r => {
      if (r.id === selectedReservation.id) {
        return {
          ...r,
          paymentStatus: 'EN_REVISION',
          paymentMethod: paymentData.paymentMethod,
          paymentReference: paymentData.paymentReference,
          paymentProofName: paymentData.paymentProofName || 'comprobante_adjunto'
        };
      }
      return r;
    }));
    
    setShowPaymentModal(false);
    setSelectedReservation(null);
    setPaymentData({ paymentMethod: 'TRANSFERENCIA', paymentReference: '', paymentProofName: '' });
    alert('¡Comprobante enviado! La administración verificará tu pago.');
  };

  const handleApprovePayment = (reservation) => {
    setReservations(prev => prev.map(r => {
      if (r.id === reservation.id) {
        return {
          ...r,
          status: 'CONFIRMADA',
          paymentStatus: 'PAGADO',
          adminNotes: `Pago verificado el ${new Date().toLocaleDateString('es-CO')}`
        };
      }
      return r;
    }));
    alert('Pago aprobado y reserva confirmada.');
  };

  const handleRejectPayment = (reservation) => {
    const reason = prompt('Motivo del rechazo:');
    if (reason) {
      setReservations(prev => prev.map(r => {
        if (r.id === reservation.id) {
          return { ...r, paymentStatus: 'RECHAZADO', adminNotes: `Pago rechazado: ${reason}` };
        }
        return r;
      }));
      alert('Pago rechazado.');
    }
  };

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setFormData({
      facility: reservation.facility,
      userName: reservation.userName || '',
      userUnit: reservation.userUnit || '',
      userPhone: reservation.userPhone || '',
      startTime: reservation.startTime ? reservation.startTime.slice(0, 16) : '',
      endTime: reservation.endTime ? reservation.endTime.slice(0, 16) : '',
      attendees: reservation.attendees || 10,
      status: reservation.status,
      paymentStatus: reservation.paymentStatus || 'PENDIENTE',
      amount: reservation.amount || 0,
      paymentMethod: reservation.paymentMethod || '',
      paymentReference: reservation.paymentReference || '',
      notes: reservation.notes || '',
      adminNotes: reservation.adminNotes || '',
      attachmentName: reservation.attachmentName || '',
      attachmentType: reservation.attachmentType || '',
      attachmentData: reservation.attachmentData || ''
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar esta reserva?')) {
      setReservations(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentData(prev => ({ ...prev, paymentProofName: file.name }));
    }
  };

  const handleAttachmentChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Solo se permiten archivos PDF, JPG o PNG');
      e.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('El archivo no puede superar los 5MB');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      setFormData(prev => ({
        ...prev,
        attachmentName: file.name,
        attachmentType: file.type,
        attachmentData: base64
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAttachment = () => {
    setFormData(prev => ({ ...prev, attachmentName: '', attachmentType: '', attachmentData: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetForm = () => {
    setFormData({
      facility: 'SALON SOCIAL',
      userName: '',
      userUnit: '',
      userPhone: '',
      startTime: '',
      endTime: '',
      attendees: 10,
      status: 'PENDIENTE',
      paymentStatus: 'PENDIENTE',
      amount: 0,
      paymentMethod: '',
      paymentReference: '',
      paymentProofName: '',
      notes: '',
      adminNotes: '',
      attachmentName: '',
      attachmentType: '',
      attachmentData: ''
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMADA': return '#10b981';
      case 'CANCELADA': return '#ef4444';
      case 'COMPLETADA': return '#3b82f6';
      default: return '#f59e0b';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'PAGADO': return '#10b981';
      case 'PENDIENTE': return '#f59e0b';
      case 'EN_REVISION': return '#3b82f6';
      case 'RECHAZADO': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPaymentStatusLabel = (status) => {
    switch (status) {
      case 'PAGADO': return '✓ Pagado';
      case 'PENDIENTE': return '⏳ Pendiente';
      case 'EN_REVISION': return '🔍 En Revisión';
      case 'RECHAZADO': return '✗ Rechazado';
      case 'NO_APLICA': return 'Gratis';
      default: return status;
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = 
      reservation.facility?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.userUnit?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFacility = filterFacility === 'TODAS' || reservation.facility === filterFacility;
    
    if (activeTab === 'pending') {
      return matchesSearch && matchesFacility && ['PENDIENTE', 'EN_REVISION'].includes(reservation.paymentStatus);
    } else if (activeTab === 'paid') {
      return matchesSearch && matchesFacility && reservation.paymentStatus === 'PAGADO';
    }
    return matchesSearch && matchesFacility;
  });

  const formatDateTime = (dateTime) => {
    if (!dateTime) return '-';
    return new Date(dateTime).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount);
  };

  const stats = {
    total: reservations.length,
    pending: reservations.filter(r => r.paymentStatus === 'PENDIENTE').length,
    inReview: reservations.filter(r => r.paymentStatus === 'EN_REVISION').length,
    paid: reservations.filter(r => r.paymentStatus === 'PAGADO').length,
    totalAmount: reservations.filter(r => r.paymentStatus === 'PAGADO').reduce((sum, r) => sum + r.amount, 0)
  };

  return (
    <div style={{ padding: '0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={24} color="white" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#102033' }}>
              {isCopropietario ? 'Mis Reservas' : 'Gestión de Reservas'}
            </h1>
            <p style={{ margin: 0, color: '#65758a', fontSize: '0.9rem' }}>
              {isCopropietario ? 'Reserva espacios comunales' : 'Administra reservas y pagos'}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', borderRadius: '10px', padding: '4px' }}>
            <button
              onClick={() => setViewMode('list')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', background: viewMode === 'list' ? '#8b5cf6' : 'transparent', color: viewMode === 'list' ? 'white' : '#475569' }}
            >
              <LayoutGrid size={18} /> Lista
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', background: viewMode === 'calendar' ? '#8b5cf6' : 'transparent', color: viewMode === 'calendar' ? 'white' : '#475569' }}
            >
              <Calendar size={18} /> Cronograma
            </button>
          </div>
          <button 
            onClick={() => { resetForm(); setEditingReservation(null); setShowModal(true); }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#8b5cf6', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}
          >
            <Plus size={20} /> Nueva Reserva
          </button>
        </div>
      </div>

      {/* Estadísticas para Admin */}
      {isAdmin && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <Calendar size={24} color="#8b5cf6" />
            <p style={{ margin: '8px 0 4px', fontSize: '1.4rem', fontWeight: '700', color: '#102033' }}>{stats.total}</p>
            <span style={{ color: '#65758a', fontSize: '0.8rem' }}>Total</span>
          </div>
          <div style={{ background: '#fef3c7', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
            <AlertCircle size={24} color="#f59e0b" />
            <p style={{ margin: '8px 0 4px', fontSize: '1.4rem', fontWeight: '700', color: '#92400e' }}>{stats.pending}</p>
            <span style={{ color: '#92400e', fontSize: '0.8rem' }}>Sin Pagar</span>
          </div>
          <div style={{ background: '#dbeafe', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
            <Eye size={24} color="#2563eb" />
            <p style={{ margin: '8px 0 4px', fontSize: '1.4rem', fontWeight: '700', color: '#1e40af' }}>{stats.inReview}</p>
            <span style={{ color: '#1e40af', fontSize: '0.8rem' }}>Por Verificar</span>
          </div>
          <div style={{ background: '#d1fae5', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
            <CheckCircle size={24} color="#059669" />
            <p style={{ margin: '8px 0 4px', fontSize: '1.4rem', fontWeight: '700', color: '#065f46' }}>{stats.paid}</p>
            <span style={{ color: '#065f46', fontSize: '0.8rem' }}>Pagadas</span>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', padding: '16px', borderRadius: '12px', textAlign: 'center', color: 'white' }}>
            <DollarSign size={24} color="white" />
            <p style={{ margin: '8px 0 4px', fontSize: '1.1rem', fontWeight: '700' }}>{formatCurrency(stats.totalAmount)}</p>
            <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>Recaudado</span>
          </div>
        </div>
      )}

      {/* Tabs para Admin */}
      {isAdmin && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'Todas', count: stats.total },
            { id: 'pending', label: 'Pendientes', count: stats.pending + stats.inReview },
            { id: 'paid', label: 'Pagadas', count: stats.paid }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 16px',
                border: 'none',
                background: activeTab === tab.id ? '#8b5cf6' : '#f1f5f9',
                color: activeTab === tab.id ? 'white' : '#475569',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      )}

      {/* Vista de Lista */}
      {viewMode === 'list' && (
      <>
      {/* Filtros */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px 12px 12px 44px', border: '1px solid #e2e8f0', borderRadius: '10px' }}
          />
        </div>
        <select 
          value={filterFacility} 
          onChange={(e) => setFilterFacility(e.target.value)}
          style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px', minWidth: '180px' }}
        >
          <option value="TODAS">Todas las instalaciones</option>
          {facilities.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
        </select>
      </div>

      {/* Lista de Reservas */}
      <div style={{ display: 'grid', gap: '16px' }}>
        {filteredReservations.length === 0 ? (
          <div style={{ background: '#f8fafc', padding: '40px', borderRadius: '16px', textAlign: 'center' }}>
            <Calendar size={48} color="#94a3b8" />
            <p style={{ color: '#64748b', marginTop: '16px' }}>No hay reservas</p>
          </div>
        ) : (
          filteredReservations.map(reservation => (
            <div key={reservation.id} style={{ 
              background: 'white', 
              borderRadius: '16px', 
              border: reservation.paymentStatus === 'EN_REVISION' ? '2px solid #3b82f6' : '1px solid #e2e8f0',
              overflow: 'hidden'
            }}>
              {/* Header */}
              <div style={{ 
                background: reservation.paymentStatus === 'PAGADO' ? '#d1fae5' : 
                            reservation.paymentStatus === 'EN_REVISION' ? '#dbeafe' : 
                            reservation.paymentStatus === 'PENDIENTE' ? '#fef3c7' : '#f1f5f9',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ background: '#8b5cf6', color: 'white', padding: '6px 12px', borderRadius: '8px', fontWeight: '600', fontSize: '0.85rem' }}>
                    {reservation.facility}
                  </span>
                  <span style={{ color: getStatusColor(reservation.status), fontWeight: '600', fontSize: '0.85rem' }}>
                    {reservation.status}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ background: getPaymentStatusColor(reservation.paymentStatus), color: 'white', padding: '6px 12px', borderRadius: '8px', fontWeight: '600', fontSize: '0.85rem' }}>
                    {getPaymentStatusLabel(reservation.paymentStatus)}
                  </span>
                  {reservation.amount > 0 && (
                    <span style={{ fontWeight: '700', color: '#102033', fontSize: '1.1rem' }}>
                      {formatCurrency(reservation.amount)}
                    </span>
                  )}
                </div>
              </div>

              {/* Contenido */}
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <UsersIcon size={18} color="#8b5cf6" />
                      <strong>{reservation.userName}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#65758a', fontSize: '0.9rem' }}>
                      <Building size={16} />
                      <span>{reservation.userUnit}</span>
                    </div>
                    {reservation.userPhone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#65758a', fontSize: '0.9rem', marginTop: '4px' }}>
                        <Phone size={16} />
                        <a href={`tel:${reservation.userPhone}`} style={{ color: '#8b5cf6' }}>{reservation.userPhone}</a>
                      </div>
                    )}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Clock size={18} color="#059669" />
                      <span><strong>Inicio:</strong> {formatDateTime(reservation.startTime)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={18} color="#ef4444" />
                      <span><strong>Fin:</strong> {formatDateTime(reservation.endTime)}</span>
                    </div>
                    <div style={{ marginTop: '8px', color: '#65758a', fontSize: '0.9rem' }}>
                      <UsersIcon size={16} style={{ display: 'inline', marginRight: '6px' }} />
                      {reservation.attendees} personas
                    </div>
                  </div>
                  {reservation.paymentMethod && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <CreditCard size={18} color="#f59e0b" />
                        <span><strong>Método:</strong> {reservation.paymentMethod}</span>
                      </div>
                      {reservation.paymentReference && (
                        <div style={{ color: '#65758a', fontSize: '0.9rem' }}>
                          <FileText size={16} style={{ display: 'inline', marginRight: '6px' }} />
                          Ref: {reservation.paymentReference}
                        </div>
                      )}
                      {reservation.paymentProofName && (
                        <div style={{ marginTop: '4px', color: '#059669', fontSize: '0.85rem' }}>
                          📎 {reservation.paymentProofName}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {reservation.notes && (
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
                    <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem' }}><strong>Notas:</strong> {reservation.notes}</p>
                  </div>
                )}

                {reservation.adminNotes && (
                  <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
                    <p style={{ margin: 0, color: '#92400e', fontSize: '0.9rem' }}><strong>📋 Admin:</strong> {reservation.adminNotes}</p>
                  </div>
                )}

                {reservation.attachmentName && (
                  <div style={{ marginTop: '8px', padding: '8px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Paperclip size={16} color="#0284c7" />
                    <span style={{ fontSize: '0.8rem', color: '#0284c7', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {reservation.attachmentName}
                    </span>
                    <button onClick={() => setViewingAttachment(reservation)} style={{ padding: '4px 8px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={14} /> Ver
                    </button>
                  </div>
                )}

                {/* Acciones */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  {/* Copropietario: Subir pago */}
                  {isCopropietario && reservation.paymentStatus === 'PENDIENTE' && reservation.amount > 0 && (
                    <button
                      onClick={() => { setSelectedReservation(reservation); setShowPaymentModal(true); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#059669', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                    >
                      <Upload size={16} /> Subir Comprobante
                    </button>
                  )}

                  {/* Copropietario: Eliminar su reserva */}
                  {isCopropietario && (
                    <button
                      onClick={() => handleDelete(reservation.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fee2e2', color: '#dc2626', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                    >
                      <Trash2 size={16} /> Eliminar
                    </button>
                  )}

                  {/* Admin: Aprobar/Rechazar */}
                  {isAdmin && reservation.paymentStatus === 'EN_REVISION' && (
                    <>
                      <button
                        onClick={() => handleApprovePayment(reservation)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#059669', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                      >
                        <CheckCircle size={16} /> Aprobar
                      </button>
                      <button
                        onClick={() => handleRejectPayment(reservation)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ef4444', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                      >
                        <XCircle size={16} /> Rechazar
                      </button>
                    </>
                  )}

                  {isAdmin && (
                    <>
                      <button
                        onClick={() => handleEdit(reservation)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#3b82f6', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                      >
                        <Edit size={16} /> Editar
                      </button>
                      <button
                        onClick={() => handleDelete(reservation.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fee2e2', color: '#dc2626', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                      >
                        <Trash2 size={16} /> Eliminar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      </>
      )}

      {/* Vista de Cronograma */}
      {viewMode === 'calendar' && (
        <div>
          {/* Controles del calendario */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <button
              onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
              style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '10px', cursor: 'pointer' }}
            >
              <ChevronLeft size={20} color="#475569" />
            </button>
            <h2 style={{ margin: 0, color: '#102033', fontSize: '1.3rem' }}>
              {calendarMonth.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
              style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '10px', cursor: 'pointer' }}
            >
              <ChevronRight size={20} color="#475569" />
            </button>
          </div>

          {/* Leyenda */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#10b981' }}></div>
              <span style={{ fontSize: '0.8rem', color: '#475569' }}>Pagado</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#f59e0b' }}></div>
              <span style={{ fontSize: '0.8rem', color: '#475569' }}>Pendiente</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#3b82f6' }}></div>
              <span style={{ fontSize: '0.8rem', color: '#475569' }}>En Revisión</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#ef4444' }}></div>
              <span style={{ fontSize: '0.8rem', color: '#475569' }}>Rechazado</span>
            </div>
          </div>

          {/* Días de la semana */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '4px' }}>
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
              <div key={day} style={{ textAlign: 'center', padding: '8px', fontWeight: '700', color: '#475569', fontSize: '0.85rem' }}>
                {day}
              </div>
            ))}
          </div>

          {/* Días del calendario */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {(() => {
              const year = calendarMonth.getFullYear();
              const month = calendarMonth.getMonth();
              const firstDay = new Date(year, month, 1);
              let dayOfWeek = firstDay.getDay() - 1;
              if (dayOfWeek < 0) dayOfWeek = 6;
              const daysInMonth = new Date(year, month + 1, 0).getDate();
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const cells = [];

              for (let i = 0; i < dayOfWeek; i++) {
                cells.push(<div key={`empty-${i}`} style={{ minHeight: '80px', background: '#f8fafc', borderRadius: '8px' }}></div>);
              }

              for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                const dateStr = date.toISOString().split('T')[0];
                const dayReservations = reservations.filter(r => {
                  if (!r.startTime) return false;
                  const rDate = r.startTime.split('T')[0];
                  return rDate === dateStr;
                });
                const isToday = date.getTime() === today.getTime();

                cells.push(
                  <div key={day} style={{
                    minHeight: '80px',
                    background: dayReservations.length > 0 ? 'white' : '#fafafa',
                    border: isToday ? '2px solid #8b5cf6' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: isToday ? '#8b5cf6' : '#475569', marginBottom: '4px' }}>
                      {day}
                    </div>
                    {dayReservations.map(r => {
                      const payColor = r.paymentStatus === 'PAGADO' ? '#10b981' :
                                       r.paymentStatus === 'PENDIENTE' ? '#f59e0b' :
                                       r.paymentStatus === 'EN_REVISION' ? '#3b82f6' :
                                       r.paymentStatus === 'RECHAZADO' ? '#ef4444' : '#6b7280';
                      return (
                        <div key={r.id} style={{
                          background: payColor + '20',
                          borderLeft: `3px solid ${payColor}`,
                          borderRadius: '4px',
                          padding: '4px 6px',
                          marginBottom: '4px',
                          fontSize: '0.7rem',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleEdit(r)}
                        >
                          <div style={{ fontWeight: '600', color: payColor, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {r.facility}
                          </div>
                          <div style={{ color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {r.userName}
                          </div>
                          <div style={{ color: payColor, fontWeight: '600' }}>
                            {r.paymentStatus === 'PAGADO' ? '✓ Pagado' :
                             r.paymentStatus === 'PENDIENTE' ? '⏳ Pendiente' :
                             r.paymentStatus === 'EN_REVISION' ? '🔍 Revisión' :
                             r.paymentStatus === 'RECHAZADO' ? '✗ Rechazado' : r.paymentStatus}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              }
              return cells;
            })()}
          </div>

          {/* Reservas del mes */}
          <div style={{ marginTop: '24px' }}>
            <h3 style={{ color: '#102033', marginBottom: '12px' }}>
              Reservas de {calendarMonth.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}
            </h3>
            {reservations.filter(r => {
              if (!r.startTime) return false;
              const rDate = new Date(r.startTime);
              return rDate.getMonth() === calendarMonth.getMonth() && rDate.getFullYear() === calendarMonth.getFullYear();
            }).sort((a, b) => new Date(a.startTime) - new Date(b.startTime)).map(r => (
              <div key={r.id} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                background: 'white', padding: '12px 16px', borderRadius: '10px',
                border: '1px solid #e2e8f0', marginBottom: '8px', cursor: 'pointer'
              }}
              onClick={() => handleEdit(r)}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: r.paymentStatus === 'PAGADO' ? '#d1fae5' :
                              r.paymentStatus === 'PENDIENTE' ? '#fef3c7' :
                              r.paymentStatus === 'EN_REVISION' ? '#dbeafe' : '#f1f5f9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '700', color: r.paymentStatus === 'PAGADO' ? '#059669' :
                              r.paymentStatus === 'PENDIENTE' ? '#f59e0b' :
                              r.paymentStatus === 'EN_REVISION' ? '#3b82f6' : '#6b7280'
                }}>
                  {new Date(r.startTime).getDate()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: '#102033' }}>{r.facility}</div>
                  <div style={{ fontSize: '0.85rem', color: '#65758a' }}>
                    {r.userName} - {new Date(r.startTime).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div style={{
                  padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600',
                  background: r.paymentStatus === 'PAGADO' ? '#10b981' :
                              r.paymentStatus === 'PENDIENTE' ? '#f59e0b' :
                              r.paymentStatus === 'EN_REVISION' ? '#3b82f6' : '#ef4444',
                  color: 'white'
                }}>
                  {r.paymentStatus === 'PAGADO' ? 'Pagado' :
                   r.paymentStatus === 'PENDIENTE' ? 'Pendiente' :
                   r.paymentStatus === 'EN_REVISION' ? 'En Revisión' : 'Rechazado'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setShowModal(false)}>
          <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>{editingReservation ? 'Editar Reserva' : 'Nueva Reserva'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><XCircle size={24} color="#94a3b8" /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Instalación</label>
                  <select
                    value={formData.facility}
                    onChange={e => setFormData({...formData, facility: e.target.value})}
                    style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '10px' }}
                  >
                    {facilities.map(f => (
                      <option key={f.name} value={f.name}>{f.name} - {f.price > 0 ? formatCurrency(f.price) : 'Gratis'}</option>
                    ))}
                  </select>
                </div>

                {getFacilityPrice(formData.facility).price > 0 && (
                  <div style={{ gridColumn: 'span 2', background: '#fef3c7', padding: '12px', borderRadius: '10px' }}>
                    <p style={{ margin: 0, color: '#92400e', fontWeight: '600' }}>
                      💰 Costo: {formatCurrency(getFacilityPrice(formData.facility).price)}
                      {getFacilityPrice(formData.facility).deposit > 0 && ` + Depósito: ${formatCurrency(getFacilityPrice(formData.facility).deposit)}`}
                    </p>
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Nombre</label>
                  <input type="text" value={formData.userName} onChange={e => setFormData({...formData, userName: e.target.value})} required style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '10px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Apartamento</label>
                  <input type="text" value={formData.userUnit} onChange={e => setFormData({...formData, userUnit: e.target.value})} placeholder="Ej: Apto 301 Torre A" required style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '10px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Teléfono</label>
                  <input type="tel" value={formData.userPhone} onChange={e => setFormData({...formData, userPhone: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '10px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Personas</label>
                  <input type="number" value={formData.attendees} onChange={e => setFormData({...formData, attendees: parseInt(e.target.value)})} min="1" style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '10px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Inicio</label>
                  <input type="datetime-local" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} required style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '10px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Fin</label>
                  <input type="datetime-local" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} required style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '10px' }} />
                </div>

                {isAdmin && (
                  <>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Estado</label>
                      <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '10px' }}>
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="CONFIRMADA">Confirmada</option>
                        <option value="CANCELADA">Cancelada</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Estado Pago</label>
                      <select value={formData.paymentStatus} onChange={e => setFormData({...formData, paymentStatus: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '10px' }}>
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="EN_REVISION">En Revisión</option>
                        <option value="PAGADO">Pagado</option>
                        <option value="RECHAZADO">Rechazado</option>
                      </select>
                    </div>
                  </>
                )}

                {isCopropietario && getFacilityPrice(formData.facility).price > 0 && (
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Estado del Pago</label>
                    <select value={formData.paymentStatus} onChange={e => setFormData({...formData, paymentStatus: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '10px' }}>
                      <option value="PENDIENTE">Pendiente - Pagaré después</option>
                      <option value="EN_REVISION">Ya pagué - En revisión</option>
                    </select>
                    {formData.paymentStatus === 'EN_REVISION' && (
                      <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '0.85rem' }}>Método de Pago</label>
                          <select value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}>
                            <option value="">Seleccionar...</option>
                            <option value="TRANSFERENCIA">Transferencia</option>
                            <option value="PSE">PSE</option>
                            <option value="NEQUI">Nequi</option>
                            <option value="DAVIPLATA">Daviplata</option>
                            <option value="EFECTIVO">Efectivo</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '0.85rem' }}>N° de Referencia</label>
                          <input type="text" value={formData.paymentReference} onChange={e => setFormData({...formData, paymentReference: e.target.value})} placeholder="Ej: TRF-123456" style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Evidencia / Comprobante (PDF, JPG o PNG - max 5MB)</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                      onChange={handleAttachmentChange}
                      style={{ flex: 1 }}
                    />
                    {formData.attachmentName && (
                      <button type="button" onClick={handleRemoveAttachment} style={{ padding: '8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  {formData.attachmentName && (
                    <small style={{ color: '#059669', display: 'block', marginTop: '4px', fontSize: '0.8rem' }}>
                      <Paperclip size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      {formData.attachmentName}
                    </small>
                  )}
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Motivo</label>
                  <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={2} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '10px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '12px 24px', border: '1px solid #d1d5db', borderRadius: '10px', background: 'white', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ padding: '12px 24px', border: 'none', borderRadius: '10px', background: '#8b5cf6', color: 'white', cursor: 'pointer', fontWeight: '600' }}>{editingReservation ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Subir Comprobante */}
      {showPaymentModal && selectedReservation && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setShowPaymentModal(false)}>
          <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
              <h2 style={{ margin: '0 0 8px' }}>Subir Comprobante de Pago</h2>
              <p style={{ margin: 0, color: '#65758a' }}>{selectedReservation.facility} - {formatCurrency(selectedReservation.amount)}</p>
            </div>
            <form onSubmit={handlePaymentSubmit} style={{ padding: '24px' }}>
              <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 12px', color: '#065f46' }}>📋 Datos para el pago:</h4>
                <p style={{ margin: '0 0 6px', fontSize: '0.9rem', color: '#047857' }}><strong>Banco:</strong> Bancolombia</p>
                <p style={{ margin: '0 0 6px', fontSize: '0.9rem', color: '#047857' }}><strong>Cuenta:</strong> 123-456789-00</p>
                <p style={{ margin: '0 0 6px', fontSize: '0.9rem', color: '#047857' }}><strong>Nombre:</strong> Conjunto Torres del Parque</p>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#047857' }}><strong>NIT:</strong> 900.555.123-4</p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Método de Pago</label>
                <select value={paymentData.paymentMethod} onChange={e => setPaymentData({...paymentData, paymentMethod: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '10px' }}>
                  <option value="TRANSFERENCIA">Transferencia</option>
                  <option value="PSE">PSE</option>
                  <option value="NEQUI">Nequi</option>
                  <option value="DAVIPLATA">Daviplata</option>
                  <option value="EFECTIVO">Efectivo</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Número de Referencia</label>
                <input type="text" value={paymentData.paymentReference} onChange={e => setPaymentData({...paymentData, paymentReference: e.target.value})} placeholder="Ej: TRF-123456789" required style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '10px' }} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Adjuntar Comprobante</label>
                <div style={{ border: '2px dashed #d1d5db', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
                  <input type="file" accept="image/*,.pdf" onChange={handleFileChange} style={{ display: 'none' }} id="payment-proof" />
                  <label htmlFor="payment-proof" style={{ cursor: 'pointer' }}>
                    <Upload size={32} color="#8b5cf6" />
                    <p style={{ margin: '8px 0 0', color: '#374151', fontWeight: '600' }}>{paymentData.paymentProofName || 'Seleccionar archivo'}</p>
                    <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>JPG, PNG o PDF</p>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setShowPaymentModal(false)} style={{ flex: 1, padding: '14px', border: '1px solid #d1d5db', borderRadius: '10px', background: 'white', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ flex: 1, padding: '14px', border: 'none', borderRadius: '10px', background: '#059669', color: 'white', cursor: 'pointer', fontWeight: '600' }}>Enviar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewingAttachment && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setViewingAttachment(null)}>
          <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '90vw', maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>Evidencia: {viewingAttachment.attachmentName}</h2>
              <button onClick={() => setViewingAttachment(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color="#94a3b8" /></button>
            </div>
            <div style={{ padding: '16px', textAlign: 'center' }}>
              {viewingAttachment.attachmentType?.startsWith('image/') ? (
                <img
                  src={`data:${viewingAttachment.attachmentType};base64,${viewingAttachment.attachmentData}`}
                  alt={viewingAttachment.attachmentName}
                  style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: '8px' }}
                />
              ) : (
                <iframe
                  src={`data:${viewingAttachment.attachmentType};base64,${viewingAttachment.attachmentData}`}
                  style={{ width: '100%', height: '70vh', border: 'none', borderRadius: '8px' }}
                  title={viewingAttachment.attachmentName}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
