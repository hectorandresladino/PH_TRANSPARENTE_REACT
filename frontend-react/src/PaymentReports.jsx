import React, { useState, useEffect } from 'react';
import {
  DollarSign, Send, CheckCircle, Clock, FileText, Search, Eye,
  Paperclip, X, TrendingUp, Calendar, User, Building, Calculator,
  ArrowRight, AlertCircle, Download, BarChart3, CreditCard
} from 'lucide-react';

import { API_URL } from './api.js';

export default function PaymentReports({ userRole = 'admin' }) {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewingReport, setViewingReport] = useState(null);

  const roleUpper = (userRole || '').toUpperCase();
  const isAdmin = ['ADMIN', 'ADMINISTRADOR'].includes(roleUpper);
  const isContador = ['CONTADOR'].includes(roleUpper);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    const mockReports = [
      {
        id: 1,
        reservationId: 2,
        facility: 'BBQ',
        userName: 'María González',
        userUnit: 'Apto 502 Torre B',
        amount: 80000,
        deposit: 50000,
        paymentMethod: 'TRANSFERENCIA',
        paymentReference: 'TRF-2026062501',
        paymentProofName: 'comprobante_maria.pdf',
        attachmentName: 'comprobante_maria.pdf',
        attachmentType: 'application/pdf',
        attachmentData: '',
        reservationDate: '2026-06-29T12:00:00',
        approvedByAdmin: true,
        approvedAt: '2026-06-25T16:00:00',
        sentToContador: true,
        sentAt: '2026-06-26T10:00:00',
        receivedByContador: true,
        receivedAt: '2026-06-26T14:00:00',
        contadorNotes: 'Ingresado al estado contable. Comprobante archivado.',
        status: 'RECIBIDO_CONTADOR'
      },
      {
        id: 2,
        reservationId: 4,
        facility: 'PISCINA',
        userName: 'Ana López',
        userUnit: 'Apto 405 Torre A',
        amount: 50000,
        deposit: 0,
        paymentMethod: 'EFECTIVO',
        paymentReference: 'REC-001234',
        paymentProofName: '',
        attachmentName: '',
        attachmentType: '',
        attachmentData: '',
        reservationDate: '2026-07-01T10:00:00',
        approvedByAdmin: true,
        approvedAt: '2026-06-25T15:00:00',
        sentToContador: true,
        sentAt: '2026-06-26T10:00:00',
        receivedByContador: false,
        receivedAt: '',
        contadorNotes: '',
        status: 'ENVIADO_CONTADOR'
      },
      {
        id: 3,
        reservationId: 5,
        facility: 'SALON SOCIAL',
        userName: 'Carlos Rodríguez',
        userUnit: 'Apto 301 Torre A',
        amount: 150000,
        deposit: 100000,
        paymentMethod: 'PSE',
        paymentReference: 'PSE-2026062701',
        paymentProofName: 'pago_carlos.jpg',
        attachmentName: 'pago_carlos.jpg',
        attachmentType: 'image/jpeg',
        attachmentData: '',
        reservationDate: '2026-07-05T16:00:00',
        approvedByAdmin: true,
        approvedAt: '2026-06-27T09:00:00',
        sentToContador: false,
        sentAt: '',
        receivedByContador: false,
        receivedAt: '',
        contadorNotes: '',
        status: 'APROBADO_ADMIN'
      }
    ];
    setReports(mockReports);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return '-';
    return new Date(dateTime).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });
  };

  const handleSendToContador = (reportId) => {
    if (window.confirm('¿Enviar este reporte de pago al contador?')) {
      setReports(prev => prev.map(r =>
        r.id === reportId ? {
          ...r,
          sentToContador: true,
          sentAt: new Date().toISOString(),
          status: 'ENVIADO_CONTADOR'
        } : r
      ));
      alert('Reporte enviado al contador correctamente.');
    }
  };

  const handleReceiveByContador = (reportId) => {
    const notes = prompt('Notas del contador (opcional):') || '';
    setReports(prev => prev.map(r =>
      r.id === reportId ? {
        ...r,
        receivedByContador: true,
        receivedAt: new Date().toISOString(),
        contadorNotes: notes,
        status: 'RECIBIDO_CONTADOR'
      } : r
    ));
    alert('Reporte marcado como recibido e ingresado al estado contable.');
  };

  const getStatusInfo = (status) => {
    const statuses = {
      'APROBADO_ADMIN': { label: 'Aprobado por Admin', color: '#10b981', bg: '#d1fae5', icon: CheckCircle },
      'ENVIADO_CONTADOR': { label: 'Enviado al Contador', color: '#3b82f6', bg: '#dbeafe', icon: Send },
      'RECIBIDO_CONTADOR': { label: 'Recibido por Contador', color: '#8b5cf6', bg: '#ede9fe', icon: Calculator },
    };
    return statuses[status] || { label: status, color: '#6b7280', bg: '#f1f5f9', icon: AlertCircle };
  };

  const filteredReports = reports.filter(r => {
    const matchesSearch =
      r.facility?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.paymentReference?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: reports.length,
    aprobados: reports.filter(r => r.status === 'APROBADO_ADMIN').length,
    enviados: reports.filter(r => r.status === 'ENVIADO_CONTADOR').length,
    recibidos: reports.filter(r => r.status === 'RECIBIDO_CONTADOR').length,
    totalAmount: reports.filter(r => r.status === 'RECIBIDO_CONTADOR').reduce((sum, r) => sum + r.amount + (r.deposit || 0), 0)
  };

  const sentReports = reports.filter(r => r.sentToContador);

  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const byDayOfWeek = dayNames.map((name, idx) => {
    const dayReports = sentReports.filter(r => {
      if (!r.sentAt) return false;
      return new Date(r.sentAt).getDay() === idx;
    });
    return {
      name,
      count: dayReports.length,
      amount: dayReports.reduce((sum, r) => sum + r.amount + (r.deposit || 0), 0)
    };
  });

  const byMonth = monthNames.map((name, idx) => {
    const monthReports = sentReports.filter(r => {
      if (!r.sentAt) return false;
      return new Date(r.sentAt).getMonth() === idx;
    });
    return {
      name: name.substring(0, 3),
      count: monthReports.length,
      amount: monthReports.reduce((sum, r) => sum + r.amount + (r.deposit || 0), 0)
    };
  }).filter(m => m.count > 0);

  const byMethod = ['TRANSFERENCIA', 'PSE', 'NEQUI', 'DAVIPLATA', 'EFECTIVO'].map(method => {
    const methodReports = sentReports.filter(r => r.paymentMethod === method);
    return {
      name: method,
      count: methodReports.length,
      amount: methodReports.reduce((sum, r) => sum + r.amount + (r.deposit || 0), 0)
    };
  }).filter(m => m.count > 0);

  const byFacility = ['SALON SOCIAL', 'PISCINA', 'BBQ', 'CANCHA DE TENIS', 'SAUNA', 'CANCHA DE FUTBOL'].map(fac => {
    const facReports = sentReports.filter(r => r.facility === fac);
    return {
      name: fac,
      count: facReports.length,
      amount: facReports.reduce((sum, r) => sum + r.amount + (r.deposit || 0), 0)
    };
  }).filter(f => f.count > 0);

  const maxDayCount = Math.max(...byDayOfWeek.map(d => d.count), 1);
  const maxMonthAmount = Math.max(...byMonth.map(m => m.amount), 1);
  const maxMethodAmount = Math.max(...byMethod.map(m => m.amount), 1);
  const maxFacilityCount = Math.max(...byFacility.map(f => f.count), 1);

  const TrailStep = ({ active, label, date, icon: Icon, color }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: active ? 1 : 0.4 }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%',
        background: active ? color : '#e2e8f0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0
      }}>
        <Icon size={16} color={active ? 'white' : '#94a3b8'} />
      </div>
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: '600', color: active ? color : '#94a3b8' }}>{label}</div>
        {date && <div style={{ fontSize: '0.7rem', color: '#65758a' }}>{formatDateTime(date)}</div>}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Calculator size={24} color="white" />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#102033' }}>
            Reportes de Pagos al Contador
          </h1>
          <p style={{ margin: 0, color: '#65758a', fontSize: '0.9rem' }}>
            {isAdmin ? 'Envía pagos aprobados al contador con soportes' : 'Recibe y procesa reportes de pagos'}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <DollarSign size={24} color="#8b5cf6" />
          <p style={{ margin: '8px 0 4px', fontSize: '1.4rem', fontWeight: '700', color: '#102033' }}>{stats.total}</p>
          <span style={{ color: '#65758a', fontSize: '0.8rem' }}>Total Reportes</span>
        </div>
        <div style={{ background: '#d1fae5', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
          <CheckCircle size={24} color="#059669" />
          <p style={{ margin: '8px 0 4px', fontSize: '1.4rem', fontWeight: '700', color: '#065f46' }}>{stats.aprobados}</p>
          <span style={{ color: '#065f46', fontSize: '0.8rem' }}>Pendientes Envío</span>
        </div>
        <div style={{ background: '#dbeafe', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
          <Send size={24} color="#2563eb" />
          <p style={{ margin: '8px 0 4px', fontSize: '1.4rem', fontWeight: '700', color: '#1e40af' }}>{stats.enviados}</p>
          <span style={{ color: '#1e40af', fontSize: '0.8rem' }}>Enviados</span>
        </div>
        <div style={{ background: '#ede9fe', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
          <Calculator size={24} color="#8b5cf6" />
          <p style={{ margin: '8px 0 4px', fontSize: '1.4rem', fontWeight: '700', color: '#5b21b6' }}>{stats.recibidos}</p>
          <span style={{ color: '#5b21b6', fontSize: '0.8rem' }}>Procesados</span>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: '16px', borderRadius: '12px', textAlign: 'center', color: 'white' }}>
          <TrendingUp size={24} color="white" />
          <p style={{ margin: '8px 0 4px', fontSize: '1.1rem', fontWeight: '700' }}>{formatCurrency(stats.totalAmount)}</p>
          <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>Total Contabilizado</span>
        </div>
      </div>

      {/* Estadisticas para el Contador */}
      {isContador && sentReports.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <BarChart3 size={24} color="#f59e0b" />
            <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#102033' }}>Estadísticas de Pagos Recibidos del Admin</h2>
          </div>

          {/* Resumen general */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '20px' }}>
            <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Send size={18} color="#3b82f6" />
                <span style={{ fontSize: '0.8rem', color: '#65758a', fontWeight: '600' }}>Recibidos del Admin</span>
              </div>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#102033' }}>{sentReports.length}</p>
            </div>
            <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <DollarSign size={18} color="#059669" />
                <span style={{ fontSize: '0.8rem', color: '#65758a', fontWeight: '600' }}>Total Recibido</span>
              </div>
              <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: '700', color: '#059669' }}>{formatCurrency(sentReports.reduce((s, r) => s + r.amount + (r.deposit || 0), 0))}</p>
            </div>
            <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <CheckCircle size={18} color="#8b5cf6" />
                <span style={{ fontSize: '0.8rem', color: '#65758a', fontWeight: '600' }}>Procesados</span>
              </div>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#8b5cf6' }}>{stats.recibidos}</p>
            </div>
            <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Clock size={18} color="#f59e0b" />
                <span style={{ fontSize: '0.8rem', color: '#65758a', fontWeight: '600' }}>Pendientes</span>
              </div>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b' }}>{stats.enviados}</p>
            </div>
          </div>

          {/* Grafico por dia de la semana */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', marginBottom: '16px' }}>
            <h3 style={{ margin: '0 0 16px', color: '#102033', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="#3b82f6" /> Pagos por Día de la Semana
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {byDayOfWeek.map(day => (
                <div key={day.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '90px', fontSize: '0.85rem', fontWeight: '600', color: '#475569', flexShrink: 0 }}>{day.name}</span>
                  <div style={{ flex: 1, background: '#f1f5f9', borderRadius: '8px', height: '28px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{
                      width: `${(day.count / maxDayCount) * 100}%`,
                      height: '100%',
                      background: day.count > 0 ? 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)' : 'transparent',
                      borderRadius: '8px',
                      transition: 'width 0.3s'
                    }}></div>
                  </div>
                  <span style={{ width: '30px', textAlign: 'right', fontSize: '0.85rem', fontWeight: '700', color: '#3b82f6', flexShrink: 0 }}>{day.count}</span>
                  <span style={{ width: '100px', textAlign: 'right', fontSize: '0.8rem', color: '#65758a', flexShrink: 0 }}>{day.count > 0 ? formatCurrency(day.amount) : '-'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grafico por mes */}
          {byMonth.length > 0 && (
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', marginBottom: '16px' }}>
              <h3 style={{ margin: '0 0 16px', color: '#102033', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} color="#059669" /> Pagos por Mes
              </h3>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', height: '180px', overflowX: 'auto', paddingBottom: '8px' }}>
                {byMonth.map(month => (
                  <div key={month.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '60px', gap: '6px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#059669' }}>{formatCurrency(month.amount).replace(/\.\d+/, '').replace('COP', '$')}</span>
                    <div style={{
                      width: '40px',
                      height: `${(month.amount / maxMonthAmount) * 120}px`,
                      background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
                      borderRadius: '8px 8px 0 0',
                      minHeight: '4px'
                    }}></div>
                    <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>{month.name}</span>
                    <span style={{ fontSize: '0.7rem', color: '#65758a' }}>{month.count} pago{month.count !== 1 ? 's' : ''}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grafico por metodo de pago e instalacion */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {/* Por metodo de pago */}
            {byMethod.length > 0 && (
              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h3 style={{ margin: '0 0 16px', color: '#102033', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={18} color="#8b5cf6" /> Por Método de Pago
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {byMethod.map(method => (
                    <div key={method.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>{method.name}</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#8b5cf6' }}>{method.count} - {formatCurrency(method.amount)}</span>
                      </div>
                      <div style={{ background: '#f1f5f9', borderRadius: '6px', height: '8px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${(method.amount / maxMethodAmount) * 100}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%)',
                          borderRadius: '6px'
                        }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Por instalacion */}
            {byFacility.length > 0 && (
              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h3 style={{ margin: '0 0 16px', color: '#102033', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building size={18} color="#f59e0b" /> Por Instalación
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {byFacility.map(fac => (
                    <div key={fac.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>{fac.name}</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f59e0b' }}>{fac.count} - {formatCurrency(fac.amount)}</span>
                      </div>
                      <div style={{ background: '#f1f5f9', borderRadius: '6px', height: '8px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${(fac.count / maxFacilityCount) * 100}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
                          borderRadius: '6px'
                        }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tabla detallada de pagos recibidos */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', marginTop: '16px' }}>
            <h3 style={{ margin: '0 0 16px', color: '#102033', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="#3b82f6" /> Detalle de Pagos Recibidos
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ textAlign: 'left', padding: '8px 12px', color: '#475569' }}>Fecha Envío</th>
                    <th style={{ textAlign: 'left', padding: '8px 12px', color: '#475569' }}>Día</th>
                    <th style={{ textAlign: 'left', padding: '8px 12px', color: '#475569' }}>Hora</th>
                    <th style={{ textAlign: 'left', padding: '8px 12px', color: '#475569' }}>Instalación</th>
                    <th style={{ textAlign: 'left', padding: '8px 12px', color: '#475569' }}>Copropietario</th>
                    <th style={{ textAlign: 'left', padding: '8px 12px', color: '#475569' }}>Método</th>
                    <th style={{ textAlign: 'right', padding: '8px 12px', color: '#475569' }}>Monto</th>
                    <th style={{ textAlign: 'center', padding: '8px 12px', color: '#475569' }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {sentReports.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt)).map(r => {
                    const sentDate = new Date(r.sentAt);
                    return (
                      <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '8px 12px', color: '#475569' }}>{sentDate.toLocaleDateString('es-CO')}</td>
                        <td style={{ padding: '8px 12px', color: '#475569' }}>{dayNames[sentDate.getDay()]}</td>
                        <td style={{ padding: '8px 12px', color: '#475569' }}>{sentDate.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</td>
                        <td style={{ padding: '8px 12px', fontWeight: '600', color: '#102033' }}>{r.facility}</td>
                        <td style={{ padding: '8px 12px', color: '#475569' }}>{r.userName}</td>
                        <td style={{ padding: '8px 12px', color: '#475569' }}>{r.paymentMethod}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: '700', color: '#059669' }}>{formatCurrency(r.amount + (r.deposit || 0))}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                          <span style={{
                            padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600',
                            background: r.status === 'RECIBIDO_CONTADOR' ? '#ede9fe' : '#dbeafe',
                            color: r.status === 'RECIBIDO_CONTADOR' ? '#8b5cf6' : '#3b82f6'
                          }}>
                            {r.status === 'RECIBIDO_CONTADOR' ? 'Procesado' : 'Pendiente'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            placeholder="Buscar por instalación, usuario, referencia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px 12px 12px 44px', border: '1px solid #e2e8f0', borderRadius: '10px' }}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px', minWidth: '180px' }}
        >
          <option value="all">Todos los estados</option>
          <option value="APROBADO_ADMIN">Aprobado - Pendiente Envío</option>
          <option value="ENVIADO_CONTADOR">Enviado al Contador</option>
          <option value="RECIBIDO_CONTADOR">Recibido por Contador</option>
        </select>
      </div>

      {/* Reports List */}
      <div style={{ display: 'grid', gap: '16px' }}>
        {filteredReports.length === 0 ? (
          <div style={{ background: '#f8fafc', padding: '40px', borderRadius: '16px', textAlign: 'center' }}>
            <Calculator size={48} color="#94a3b8" />
            <p style={{ color: '#64748b', marginTop: '16px' }}>No hay reportes de pago</p>
          </div>
        ) : (
          filteredReports.map(report => {
            const statusInfo = getStatusInfo(report.status);
            const totalAmount = report.amount + (report.deposit || 0);
            return (
              <div key={report.id} style={{
                background: 'white',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden'
              }}>
                {/* Header */}
                <div style={{
                  background: statusInfo.bg,
                  padding: '12px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ background: statusInfo.color, color: 'white', padding: '4px 12px', borderRadius: '8px', fontWeight: '600', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <statusInfo.icon size={14} />
                      {statusInfo.label}
                    </span>
                    <span style={{ background: '#8b5cf6', color: 'white', padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600' }}>
                      {report.facility}
                    </span>
                  </div>
                  <span style={{ fontWeight: '700', color: '#102033', fontSize: '1.1rem' }}>
                    {formatCurrency(totalAmount)}
                  </span>
                </div>

                {/* Content */}
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <User size={16} color="#65758a" />
                        <strong style={{ fontSize: '0.9rem' }}>{report.userName}</strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#65758a' }}>
                        <Building size={14} />
                        {report.userUnit}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#65758a', marginBottom: '4px' }}>
                        <strong>Método:</strong> {report.paymentMethod}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#65758a' }}>
                        <strong>Ref:</strong> {report.paymentReference}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#65758a', marginBottom: '4px' }}>
                        <strong>Reserva:</strong> {formatDateTime(report.reservationDate)}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#65758a' }}>
                        <strong>Aprobado:</strong> {formatDateTime(report.approvedAt)}
                      </div>
                    </div>
                  </div>

                  {/* Trail */}
                  <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '12px' }}>
                      RASTRO DEL PAGO
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <TrailStep active={true} label="Pago Recibido" date={report.approvedAt} icon={DollarSign} color="#10b981" />
                      <ArrowRight size={16} color="#94a3b8" />
                      <TrailStep active={true} label="Aprobado Admin" date={report.approvedAt} icon={CheckCircle} color="#10b981" />
                      <ArrowRight size={16} color="#94a3b8" />
                      <TrailStep active={report.sentToContador} label="Enviado Contador" date={report.sentAt} icon={Send} color="#3b82f6" />
                      <ArrowRight size={16} color="#94a3b8" />
                      <TrailStep active={report.receivedByContador} label="Recibido Contador" date={report.receivedAt} icon={Calculator} color="#8b5cf6" />
                    </div>
                    {report.contadorNotes && (
                      <div style={{ marginTop: '12px', padding: '8px 12px', background: '#ede9fe', borderRadius: '8px', fontSize: '0.85rem', color: '#5b21b6' }}>
                        <strong>Notas del contador:</strong> {report.contadorNotes}
                      </div>
                    )}
                  </div>

                  {/* Evidence */}
                  {report.attachmentName && (
                    <div style={{ marginBottom: '16px', padding: '8px 12px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Paperclip size={16} color="#0284c7" />
                      <span style={{ fontSize: '0.85rem', color: '#0284c7', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        Soporte: {report.attachmentName}
                      </span>
                      <button onClick={() => setViewingReport(report)} style={{ padding: '4px 10px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Eye size={14} /> Ver
                      </button>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                    <button
                      onClick={() => setViewingReport(report)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#dbeafe', color: '#2563eb', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                    >
                      <Eye size={16} /> Ver Detalle
                    </button>
                    {isAdmin && report.status === 'APROBADO_ADMIN' && (
                      <button
                        onClick={() => handleSendToContador(report.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#3b82f6', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                      >
                        <Send size={16} /> Enviar al Contador
                      </button>
                    )}
                    {isContador && report.status === 'ENVIADO_CONTADOR' && (
                      <button
                        onClick={() => handleReceiveByContador(report.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#8b5cf6', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                      >
                        <CheckCircle size={16} /> Marcar Recibido
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Ver Detalle */}
      {viewingReport && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setViewingReport(null)}>
          <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>Detalle del Reporte de Pago</h2>
              <button onClick={() => setViewingReport(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} color="#94a3b8" />
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#65758a', fontWeight: '600' }}>Instalación</label>
                  <p style={{ margin: '4px 0 0', fontWeight: '600' }}>{viewingReport.facility}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#65758a', fontWeight: '600' }}>Copropietario</label>
                  <p style={{ margin: '4px 0 0', fontWeight: '600' }}>{viewingReport.userName}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#65758a', fontWeight: '600' }}>Unidad</label>
                  <p style={{ margin: '4px 0 0' }}>{viewingReport.userUnit}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#65758a', fontWeight: '600' }}>Fecha Reserva</label>
                  <p style={{ margin: '4px 0 0' }}>{formatDateTime(viewingReport.reservationDate)}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#65758a', fontWeight: '600' }}>Método de Pago</label>
                  <p style={{ margin: '4px 0 0' }}>{viewingReport.paymentMethod}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#65758a', fontWeight: '600' }}>Referencia</label>
                  <p style={{ margin: '4px 0 0' }}>{viewingReport.paymentReference}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#65758a', fontWeight: '600' }}>Monto</label>
                  <p style={{ margin: '4px 0 0', fontWeight: '700', color: '#102033' }}>{formatCurrency(viewingReport.amount)}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#65758a', fontWeight: '600' }}>Depósito</label>
                  <p style={{ margin: '4px 0 0', fontWeight: '700', color: '#102033' }}>{formatCurrency(viewingReport.deposit || 0)}</p>
                </div>
              </div>

              {/* Rastro completo */}
              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 16px', color: '#475569' }}>Rastro del Pago</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <TrailStep active={true} label="1. Pago Recibido del Copropietario" date={viewingReport.approvedAt} icon={DollarSign} color="#10b981" />
                  <TrailStep active={true} label="2. Aprobado por Administración" date={viewingReport.approvedAt} icon={CheckCircle} color="#10b981" />
                  <TrailStep active={viewingReport.sentToContador} label="3. Enviado al Contador" date={viewingReport.sentAt} icon={Send} color="#3b82f6" />
                  <TrailStep active={viewingReport.receivedByContador} label="4. Recibido e Ingresado al Estado Contable" date={viewingReport.receivedAt} icon={Calculator} color="#8b5cf6" />
                </div>
                {viewingReport.contadorNotes && (
                  <div style={{ marginTop: '12px', padding: '12px', background: '#ede9fe', borderRadius: '8px' }}>
                    <strong style={{ color: '#5b21b6', fontSize: '0.85rem' }}>Notas del Contador:</strong>
                    <p style={{ margin: '4px 0 0', color: '#5b21b6', fontSize: '0.85rem' }}>{viewingReport.contadorNotes}</p>
                  </div>
                )}
              </div>

              {/* Soporte */}
              {viewingReport.attachmentName && (
                <div style={{ padding: '16px', background: '#f0f9ff', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                  <h4 style={{ margin: '0 0 8px', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Paperclip size={18} /> Soporte de Pago
                  </h4>
                  <p style={{ margin: 0, color: '#0284c7', fontSize: '0.9rem' }}>{viewingReport.attachmentName}</p>
                  {viewingReport.attachmentType?.startsWith('image/') && viewingReport.attachmentData && (
                    <img src={`data:${viewingReport.attachmentType};base64,${viewingReport.attachmentData}`} alt={viewingReport.attachmentName} style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '12px' }} />
                  )}
                  {viewingReport.attachmentType === 'application/pdf' && viewingReport.attachmentData && (
                    <iframe src={`data:${viewingReport.attachmentType};base64,${viewingReport.attachmentData}`} style={{ width: '100%', height: '300px', border: 'none', borderRadius: '8px', marginTop: '12px' }} title={viewingReport.attachmentName} />
                  )}
                  {!viewingReport.attachmentData && (
                    <p style={{ margin: '8px 0 0', color: '#65758a', fontSize: '0.85rem', fontStyle: 'italic' }}>
                      (El soporte fue adjuntado en la reserva original)
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
