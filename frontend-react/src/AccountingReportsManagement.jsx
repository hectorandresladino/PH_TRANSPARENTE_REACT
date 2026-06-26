import React, { useState, useEffect } from 'react';
import { 
  Calculator, Upload, Download, Eye, Calendar, 
  Search, Filter, Plus, Trash2, Edit, DollarSign, CheckCircle,
  FileSpreadsheet, X, Save, TrendingUp, TrendingDown
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || `http://${location.hostname}:8081/api`;

export default function AccountingReportsManagement({ userRole = 'admin' }) {
  const [reports, setReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewMode, setViewMode] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    type: 'monthly',
    period: '',
    income: '',
    expenses: '',
    balance: '',
    summary: '',
    observations: '',
    status: 'draft'
  });

  // Roles que pueden CREAR informes contables
  const canCreate = ['admin', 'Administrador', 'contador', 'Contador'].includes(userRole);
  
  // Roles que pueden VER informes contables
  const canView = ['admin', 'Administrador', 'contador', 'Contador', 'copropietario', 'Copropietarios', 
                   'revisor', 'Revisor Fiscal', 'consejero', 'Consejeros'].includes(userRole);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setReports([
      {
        id: 1,
        title: 'Informe Contable Mensual - Mayo 2026',
        type: 'monthly',
        period: '2026-05',
        income: 45000000,
        expenses: 38500000,
        balance: 6500000,
        summary: 'Ingresos por cuotas de administración: $42M. Ingresos extraordinarios: $3M. Gastos operativos: $25M. Gastos de mantenimiento: $10M. Servicios públicos: $3.5M.',
        observations: 'Se observa un incremento del 5% en gastos de mantenimiento debido a reparaciones en ascensores.',
        status: 'approved',
        createdBy: 'Ana Contador',
        createdAt: '2026-06-05T10:00:00'
      },
      {
        id: 2,
        title: 'Informe Contable Mensual - Junio 2026',
        type: 'monthly',
        period: '2026-06',
        income: 46500000,
        expenses: 41000000,
        balance: 5500000,
        summary: 'Ingresos por cuotas: $43M. Ingresos parqueaderos: $3.5M. Gastos operativos: $26M. Mantenimiento: $12M. Servicios: $3M.',
        observations: 'Gastos extraordinarios por reparación de filtración en torre B.',
        status: 'pending',
        createdBy: 'Ana Contador',
        createdAt: '2026-06-25T14:00:00'
      },
      {
        id: 3,
        title: 'Informe Trimestral Q2 2026',
        type: 'quarterly',
        period: '2026-Q2',
        income: 138000000,
        expenses: 115000000,
        balance: 23000000,
        summary: 'Resumen del segundo trimestre. Ingresos totales: $138M. Gastos totales: $115M. Balance positivo de $23M.',
        observations: 'El trimestre cierra con superávit. Se recomienda destinar $10M al fondo de reserva.',
        status: 'draft',
        createdBy: 'Ana Contador',
        createdAt: '2026-06-28T09:00:00'
      }
    ]);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const reportData = {
      ...formData,
      income: parseFloat(formData.income) || 0,
      expenses: parseFloat(formData.expenses) || 0,
      balance: (parseFloat(formData.income) || 0) - (parseFloat(formData.expenses) || 0)
    };

    if (selectedReport) {
      setReports(prev => prev.map(r => 
        r.id === selectedReport.id ? { ...r, ...reportData, updatedAt: new Date().toISOString() } : r
      ));
    } else {
      const newReport = {
        id: Date.now(),
        ...reportData,
        createdBy: 'Usuario Actual',
        createdAt: new Date().toISOString()
      };
      setReports(prev => [newReport, ...prev]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'monthly',
      period: '',
      income: '',
      expenses: '',
      balance: '',
      summary: '',
      observations: '',
      status: 'draft'
    });
    setSelectedReport(null);
    setShowModal(false);
    setViewMode(false);
  };

  const handleEdit = (report) => {
    setSelectedReport(report);
    setFormData({
      title: report.title,
      type: report.type,
      period: report.period,
      income: report.income.toString(),
      expenses: report.expenses.toString(),
      balance: report.balance.toString(),
      summary: report.summary,
      observations: report.observations || '',
      status: report.status
    });
    setViewMode(false);
    setShowModal(true);
  };

  const handleView = (report) => {
    setSelectedReport(report);
    setFormData({
      title: report.title,
      type: report.type,
      period: report.period,
      income: report.income.toString(),
      expenses: report.expenses.toString(),
      balance: report.balance.toString(),
      summary: report.summary,
      observations: report.observations || '',
      status: report.status
    });
    setViewMode(true);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('¿Está seguro de eliminar este informe?')) {
      setReports(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleApprove = (id) => {
    setReports(prev => prev.map(r => 
      r.id === id ? { ...r, status: 'approved', approvedAt: new Date().toISOString() } : r
    ));
  };

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || r.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const styles = {
      draft: { bg: '#fef3c7', color: '#d97706', label: 'Borrador' },
      approved: { bg: '#d1fae5', color: '#059669', label: 'Aprobado' },
      pending: { bg: '#dbeafe', color: '#2563eb', label: 'Pendiente' }
    };
    const style = styles[status] || styles.draft;
    return (
      <span style={{ background: style.bg, color: style.color, padding: '4px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '700' }}>
        {style.label}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const types = {
      monthly: { label: 'Mensual', color: '#2563eb' },
      quarterly: { label: 'Trimestral', color: '#7c3aed' },
      annual: { label: 'Anual', color: '#059669' }
    };
    const t = types[type] || types.monthly;
    return (
      <span style={{ background: `${t.color}15`, color: t.color, padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700' }}>
        {t.label}
      </span>
    );
  };

  return (
    <div className="accounting-reports-management" style={{ padding: '0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calculator size={24} color="white" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#102033' }}>Informes Contables</h1>
            <p style={{ margin: 0, color: '#65758a', fontSize: '0.9rem' }}>
              {canCreate ? 'Gestión de informes financieros' : 'Consulta de informes financieros'}
            </p>
          </div>
        </div>
        {canCreate && (
          <button onClick={() => { resetForm(); setShowModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f59e0b', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}>
            <Plus size={20} /> Nuevo Informe
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #d8e4ec', borderRadius: '12px', padding: '0 16px', flex: '1', minWidth: '200px' }}>
          <Search size={20} color="#65758a" />
          <input type="text" placeholder="Buscar informes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ border: 'none', padding: '12px 0', flex: '1', outline: 'none', background: 'transparent' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #d8e4ec', borderRadius: '12px', padding: '0 16px' }}>
          <Filter size={20} color="#65758a" />
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ border: 'none', padding: '12px 0', outline: 'none', background: 'transparent', cursor: 'pointer' }}>
            <option value="all">Todos los tipos</option>
            <option value="monthly">Mensual</option>
            <option value="quarterly">Trimestral</option>
            <option value="annual">Anual</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div style={{ display: 'grid', gap: '16px' }}>
        {filteredReports.map(report => (
          <div key={report.id} style={{ background: 'white', border: '1px solid #d8e4ec', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(16,32,51,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  {getTypeBadge(report.type)}
                  {getStatusBadge(report.status)}
                </div>
                <h3 style={{ margin: '0 0 8px', color: '#102033', fontSize: '1.1rem' }}>{report.title}</h3>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.85rem', color: '#65758a' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} /> Período: {report.period}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FileSpreadsheet size={14} /> {report.createdBy}
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <TrendingUp size={16} color="#059669" />
                  <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: '600' }}>Ingresos</span>
                </div>
                <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#059669' }}>{formatCurrency(report.income)}</span>
              </div>
              <div style={{ background: '#fef2f2', padding: '12px', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <TrendingDown size={16} color="#dc2626" />
                  <span style={{ fontSize: '0.8rem', color: '#dc2626', fontWeight: '600' }}>Gastos</span>
                </div>
                <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#dc2626' }}>{formatCurrency(report.expenses)}</span>
              </div>
              <div style={{ background: report.balance >= 0 ? '#dbeafe' : '#fef3c7', padding: '12px', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <DollarSign size={16} color={report.balance >= 0 ? '#2563eb' : '#d97706'} />
                  <span style={{ fontSize: '0.8rem', color: report.balance >= 0 ? '#2563eb' : '#d97706', fontWeight: '600' }}>Balance</span>
                </div>
                <span style={{ fontSize: '1.1rem', fontWeight: '700', color: report.balance >= 0 ? '#2563eb' : '#d97706' }}>{formatCurrency(report.balance)}</span>
              </div>
            </div>

            <p style={{ margin: '0 0 16px', color: '#536477', fontSize: '0.9rem', lineHeight: '1.5' }}>
              {report.summary.substring(0, 150)}...
            </p>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button onClick={() => handleView(report)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#dbeafe', color: '#2563eb', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>
                <Eye size={16} /> Ver
              </button>
              {canCreate && (
                <>
                  <button onClick={() => handleEdit(report)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fef3c7', color: '#d97706', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>
                    <Edit size={16} /> Editar
                  </button>
                  {report.status === 'draft' && (
                    <button onClick={() => handleApprove(report.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#d1fae5', color: '#059669', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>
                      <CheckCircle size={16} /> Aprobar
                    </button>
                  )}
                  <button onClick={() => handleDelete(report.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fee2e2', color: '#dc2626', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {filteredReports.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '16px', border: '1px solid #d8e4ec' }}>
            <Calculator size={48} color="#d8e4ec" style={{ marginBottom: '16px' }} />
            <h3 style={{ margin: '0 0 8px', color: '#65758a' }}>No hay informes</h3>
            <p style={{ margin: 0, color: '#a0aec0' }}>
              {canCreate ? 'Crea el primer informe contable' : 'No hay informes disponibles'}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, color: '#102033' }}>
                {viewMode ? 'Ver Informe' : (selectedReport ? 'Editar Informe' : 'Nuevo Informe')}
              </h2>
              <button onClick={resetForm} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px' }}>
                <X size={24} color="#65758a" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Título *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} disabled={viewMode} required placeholder="Ej: Informe Contable Mensual - Junio 2026" style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Tipo *</label>
                    <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} disabled={viewMode} style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', boxSizing: 'border-box' }}>
                      <option value="monthly">Mensual</option>
                      <option value="quarterly">Trimestral</option>
                      <option value="annual">Anual</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Período *</label>
                    <input type="text" value={formData.period} onChange={(e) => setFormData({...formData, period: e.target.value})} disabled={viewMode} required placeholder="Ej: 2026-06 o 2026-Q2" style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Ingresos (COP) *</label>
                    <input type="number" value={formData.income} onChange={(e) => setFormData({...formData, income: e.target.value})} disabled={viewMode} required placeholder="45000000" style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Gastos (COP) *</label>
                    <input type="number" value={formData.expenses} onChange={(e) => setFormData({...formData, expenses: e.target.value})} disabled={viewMode} required placeholder="38500000" style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Resumen Financiero *</label>
                  <textarea value={formData.summary} onChange={(e) => setFormData({...formData, summary: e.target.value})} disabled={viewMode} required rows={4} placeholder="Detalle de ingresos y gastos..." style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Observaciones</label>
                  <textarea value={formData.observations} onChange={(e) => setFormData({...formData, observations: e.target.value})} disabled={viewMode} rows={3} placeholder="Observaciones adicionales..." style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>

                {!viewMode && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Estado</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', boxSizing: 'border-box' }}>
                      <option value="draft">Borrador</option>
                      <option value="pending">Pendiente de Aprobación</option>
                      <option value="approved">Aprobado</option>
                    </select>
                  </div>
                )}
              </div>

              {!viewMode && (
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                  <button type="button" onClick={resetForm} style={{ padding: '12px 24px', border: '1px solid #d8e4ec', borderRadius: '12px', background: 'white', cursor: 'pointer', fontWeight: '600' }}>Cancelar</button>
                  <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', border: 'none', borderRadius: '12px', background: '#f59e0b', color: 'white', cursor: 'pointer', fontWeight: '600' }}>
                    <Save size={18} /> {selectedReport ? 'Guardar Cambios' : 'Crear Informe'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
