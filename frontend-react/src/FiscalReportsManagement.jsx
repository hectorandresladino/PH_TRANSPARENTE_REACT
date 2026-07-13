import React, { useState, useEffect } from 'react';
import { 
  Search as SearchIcon, Upload, Download, Eye, Calendar, 
  Filter, Plus, Trash2, Edit, CheckCircle, AlertTriangle,
  FileText, X, Save, ClipboardCheck, AlertCircle
} from 'lucide-react';

import { API_URL } from './api.js';

export default function FiscalReportsManagement({ userRole = 'admin' }) {
  const [reports, setReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewMode, setViewMode] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    type: 'audit',
    period: '',
    scope: '',
    findings: '',
    recommendations: '',
    conclusion: '',
    riskLevel: 'low',
    status: 'draft'
  });

  // Roles que pueden CREAR informes de revisoría
  const canCreate = ['admin', 'Administrador', 'revisor', 'Revisor Fiscal'].includes(userRole);
  
  // Roles que pueden VER informes de revisoría
  const canView = ['admin', 'Administrador', 'revisor', 'Revisor Fiscal', 'copropietario', 'Copropietarios', 
                   'contador', 'Contador', 'consejero', 'Consejeros'].includes(userRole);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setReports([
      {
        id: 1,
        title: 'Informe de Auditoría Q2 2026',
        type: 'audit',
        period: '2026-Q2',
        scope: 'Revisión de estados financieros, contratos vigentes y cumplimiento normativo del segundo trimestre 2026.',
        findings: '1. Se encontró diferencia de $2.5M entre libro auxiliar y extractos bancarios (corregido).\n2. Contrato de vigilancia vencido desde marzo (renovación en proceso).\n3. Falta de soportes en 3 gastos menores.',
        recommendations: '1. Implementar conciliación bancaria semanal.\n2. Crear alertas automáticas para vencimiento de contratos.\n3. Exigir soportes completos antes de aprobar pagos.',
        conclusion: 'La administración presenta un manejo financiero adecuado con observaciones menores que han sido atendidas oportunamente.',
        riskLevel: 'low',
        status: 'approved',
        createdBy: 'Dr. Roberto Fiscal',
        createdAt: '2026-06-20T10:00:00'
      },
      {
        id: 2,
        title: 'Revisión Especial - Contrato Ascensores',
        type: 'special',
        period: '2026-06',
        scope: 'Auditoría especial del contrato de mantenimiento de ascensores y gastos asociados.',
        findings: '1. Sobrecostos del 15% respecto al mercado.\n2. Servicios facturados no ejecutados en 2 ocasiones.\n3. Falta de actas de servicio firmadas.',
        recommendations: '1. Renegociar contrato o buscar nuevos proveedores.\n2. Solicitar devolución de servicios no prestados.\n3. Implementar control de firmas en actas de servicio.',
        conclusion: 'Se detectaron irregularidades que requieren acción inmediata de la administración.',
        riskLevel: 'high',
        status: 'approved',
        createdBy: 'Dr. Roberto Fiscal',
        createdAt: '2026-06-15T14:00:00'
      },
      {
        id: 3,
        title: 'Dictamen Estados Financieros 2025',
        type: 'opinion',
        period: '2025',
        scope: 'Dictamen sobre los estados financieros del año 2025.',
        findings: 'Los estados financieros presentan razonablemente la situación financiera de la copropiedad.',
        recommendations: 'Continuar con las buenas prácticas de control interno implementadas.',
        conclusion: 'OPINIÓN LIMPIA: Los estados financieros fueron preparados de acuerdo con las normas contables aplicables.',
        riskLevel: 'low',
        status: 'approved',
        createdBy: 'Dr. Roberto Fiscal',
        createdAt: '2026-02-28T16:00:00'
      },
      {
        id: 4,
        title: 'Informe Preliminar Junio 2026',
        type: 'audit',
        period: '2026-06',
        scope: 'Revisión mensual de operaciones financieras.',
        findings: 'En proceso de revisión...',
        recommendations: 'Pendiente',
        conclusion: 'Informe en elaboración.',
        riskLevel: 'medium',
        status: 'draft',
        createdBy: 'Dr. Roberto Fiscal',
        createdAt: '2026-06-28T09:00:00'
      }
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedReport) {
      setReports(prev => prev.map(r => 
        r.id === selectedReport.id ? { ...r, ...formData, updatedAt: new Date().toISOString() } : r
      ));
    } else {
      const newReport = {
        id: Date.now(),
        ...formData,
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
      type: 'audit',
      period: '',
      scope: '',
      findings: '',
      recommendations: '',
      conclusion: '',
      riskLevel: 'low',
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
      scope: report.scope,
      findings: report.findings,
      recommendations: report.recommendations,
      conclusion: report.conclusion,
      riskLevel: report.riskLevel,
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
      scope: report.scope,
      findings: report.findings,
      recommendations: report.recommendations,
      conclusion: report.conclusion,
      riskLevel: report.riskLevel,
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
      audit: { label: 'Auditoría', color: '#2563eb' },
      special: { label: 'Especial', color: '#7c3aed' },
      opinion: { label: 'Dictamen', color: '#059669' },
      review: { label: 'Revisión', color: '#f59e0b' }
    };
    const t = types[type] || types.audit;
    return (
      <span style={{ background: `${t.color}15`, color: t.color, padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700' }}>
        {t.label}
      </span>
    );
  };

  const getRiskBadge = (risk) => {
    const risks = {
      low: { label: 'Riesgo Bajo', color: '#059669', bg: '#d1fae5', icon: <CheckCircle size={14} /> },
      medium: { label: 'Riesgo Medio', color: '#d97706', bg: '#fef3c7', icon: <AlertCircle size={14} /> },
      high: { label: 'Riesgo Alto', color: '#dc2626', bg: '#fee2e2', icon: <AlertTriangle size={14} /> }
    };
    const r = risks[risk] || risks.low;
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: r.bg, color: r.color, padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700' }}>
        {r.icon} {r.label}
      </span>
    );
  };

  return (
    <div className="fiscal-reports-management" style={{ padding: '0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ClipboardCheck size={24} color="white" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#102033' }}>Informes de Revisoría Fiscal</h1>
            <p style={{ margin: 0, color: '#65758a', fontSize: '0.9rem' }}>
              {canCreate ? 'Gestión de informes de auditoría' : 'Consulta de informes de auditoría'}
            </p>
          </div>
        </div>
        {canCreate && (
          <button onClick={() => { resetForm(); setShowModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ef4444', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}>
            <Plus size={20} /> Nuevo Informe
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #d8e4ec', borderRadius: '12px', padding: '0 16px', flex: '1', minWidth: '200px' }}>
          <SearchIcon size={20} color="#65758a" />
          <input type="text" placeholder="Buscar informes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ border: 'none', padding: '12px 0', flex: '1', outline: 'none', background: 'transparent' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #d8e4ec', borderRadius: '12px', padding: '0 16px' }}>
          <Filter size={20} color="#65758a" />
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ border: 'none', padding: '12px 0', outline: 'none', background: 'transparent', cursor: 'pointer' }}>
            <option value="all">Todos los tipos</option>
            <option value="audit">Auditoría</option>
            <option value="special">Especial</option>
            <option value="opinion">Dictamen</option>
            <option value="review">Revisión</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div style={{ display: 'grid', gap: '16px' }}>
        {filteredReports.map(report => (
          <div key={report.id} style={{ background: 'white', border: '1px solid #d8e4ec', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(16,32,51,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  {getTypeBadge(report.type)}
                  {getRiskBadge(report.riskLevel)}
                  {getStatusBadge(report.status)}
                </div>
                <h3 style={{ margin: '0 0 8px', color: '#102033', fontSize: '1.1rem' }}>{report.title}</h3>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.85rem', color: '#65758a' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} /> Período: {report.period}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FileText size={14} /> {report.createdBy}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <p style={{ margin: '0 0 8px', color: '#102033', fontSize: '0.85rem', fontWeight: '600' }}>Alcance:</p>
              <p style={{ margin: '0', color: '#536477', fontSize: '0.9rem', lineHeight: '1.5' }}>
                {report.scope.substring(0, 150)}...
              </p>
            </div>

            <div style={{ marginBottom: '16px', padding: '12px', background: report.riskLevel === 'high' ? '#fef2f2' : '#f6f9fb', borderRadius: '10px' }}>
              <p style={{ margin: '0 0 4px', color: '#102033', fontSize: '0.85rem', fontWeight: '600' }}>Conclusión:</p>
              <p style={{ margin: '0', color: report.riskLevel === 'high' ? '#dc2626' : '#536477', fontSize: '0.9rem', lineHeight: '1.5' }}>
                {report.conclusion.substring(0, 120)}...
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button onClick={() => handleView(report)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#dbeafe', color: '#2563eb', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>
                <Eye size={16} /> Ver Completo
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
            <ClipboardCheck size={48} color="#d8e4ec" style={{ marginBottom: '16px' }} />
            <h3 style={{ margin: '0 0 8px', color: '#65758a' }}>No hay informes</h3>
            <p style={{ margin: 0, color: '#a0aec0' }}>
              {canCreate ? 'Crea el primer informe de revisoría' : 'No hay informes disponibles'}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
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
                  <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} disabled={viewMode} required placeholder="Ej: Informe de Auditoría Q2 2026" style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Tipo *</label>
                    <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} disabled={viewMode} style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', boxSizing: 'border-box' }}>
                      <option value="audit">Auditoría</option>
                      <option value="special">Especial</option>
                      <option value="opinion">Dictamen</option>
                      <option value="review">Revisión</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Período *</label>
                    <input type="text" value={formData.period} onChange={(e) => setFormData({...formData, period: e.target.value})} disabled={viewMode} required placeholder="2026-Q2" style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Nivel de Riesgo</label>
                    <select value={formData.riskLevel} onChange={(e) => setFormData({...formData, riskLevel: e.target.value})} disabled={viewMode} style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', boxSizing: 'border-box' }}>
                      <option value="low">Bajo</option>
                      <option value="medium">Medio</option>
                      <option value="high">Alto</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Alcance *</label>
                  <textarea value={formData.scope} onChange={(e) => setFormData({...formData, scope: e.target.value})} disabled={viewMode} required rows={3} placeholder="Describa el alcance de la auditoría..." style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Hallazgos *</label>
                  <textarea value={formData.findings} onChange={(e) => setFormData({...formData, findings: e.target.value})} disabled={viewMode} required rows={4} placeholder="Liste los hallazgos encontrados..." style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Recomendaciones *</label>
                  <textarea value={formData.recommendations} onChange={(e) => setFormData({...formData, recommendations: e.target.value})} disabled={viewMode} required rows={4} placeholder="Liste las recomendaciones..." style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Conclusión *</label>
                  <textarea value={formData.conclusion} onChange={(e) => setFormData({...formData, conclusion: e.target.value})} disabled={viewMode} required rows={3} placeholder="Conclusión del informe..." style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
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
                  <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', border: 'none', borderRadius: '12px', background: '#ef4444', color: 'white', cursor: 'pointer', fontWeight: '600' }}>
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
