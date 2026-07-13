import React, { useState, useEffect } from 'react';
import { FileText, Search, Plus, Download, Filter, Calendar, Printer, FileSpreadsheet, FileImage, Trash2, Eye } from 'lucide-react';

import { API_URL } from './api.js';

const MODULES = [
  'property-units', 'reserve-funds', 'annual-budgets', 'insurance-policies', 
  'bank-accounts', 'official-minutes', 'horizontal-property-regulations', 
  'alerts', 'transparency', 'payments', 'contracts', 'documents'
];

const REPORT_TYPES = ['LEGAL', 'FINANCIERO', 'ADMINISTRATIVO', 'OPERATIVO', 'AUDITORIA'];

const FORMATS = ['PDF', 'EXCEL', 'CSV', 'HTML'];

export default function ReportsManagement() {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    reportName: '',
    reportType: 'LEGAL',
    moduleName: '',
    reportFormat: 'PDF',
    periodStart: '',
    periodEnd: '',
    reportDescription: '',
    filtersApplied: ''
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch(`${API_URL}/reports`);
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          generatedBy: 1,
          recordCount: 0
        })
      });

      if (response.ok) {
        fetchReports();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving report:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este reporte?')) {
      try {
        const response = await fetch(`${API_URL}/reports/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchReports();
        }
      } catch (error) {
        console.error('Error deleting report:', error);
      }
    }
  };

  const handleDownload = (report) => {
    // Simulación de descarga
    alert(`Descargando reporte: ${report.reportName} (${report.reportFormat})`);
  };

  const handleView = (report) => {
    // Simulación de vista
    alert(`Viendo reporte: ${report.reportName}`);
  };

  const resetForm = () => {
    setFormData({
      reportName: '',
      reportType: 'LEGAL',
      moduleName: '',
      reportFormat: 'PDF',
      periodStart: '',
      periodEnd: '',
      reportDescription: '',
      filtersApplied: ''
    });
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.reportName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.moduleName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesModule = filterModule === 'all' || report.moduleName === filterModule;
    const matchesType = filterType === 'all' || report.reportType === filterType;
    
    return matchesSearch && matchesModule && matchesType;
  });

  const getFormatIcon = (format) => {
    switch(format) {
      case 'PDF': return <FileText size={16} />;
      case 'EXCEL': return <FileSpreadsheet size={16} />;
      case 'CSV': return <FileSpreadsheet size={16} />;
      case 'HTML': return <FileImage size={16} />;
      default: return <FileText size={16} />;
    }
  };

  return (
    <div className="property-units-management">
      <div className="contractors-header">
        <div className="header-title">
          <FileText size={32} />
          <h1>Reportes y Exportaciones</h1>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus size={20} />
          Nuevo Reporte
        </button>
      </div>

      <div className="contractors-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o módulo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter size={18} />
          <select value={filterModule} onChange={(e) => setFilterModule(e.target.value)}>
            <option value="all">Todos los módulos</option>
            {MODULES.map(module => (
              <option key={module} value={module}>{module}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <FileText size={18} />
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">Todos los tipos</option>
            {REPORT_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Módulo</th>
              <th>Formato</th>
              <th>Período</th>
              <th>Registros</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map(report => (
              <tr key={report.id}>
                <td>
                  <div className="report-info">
                    <FileText size={16} />
                    <strong>{report.reportName}</strong>
                  </div>
                </td>
                <td>{report.reportType}</td>
                <td>{report.moduleName}</td>
                <td>
                  <div className="format-info">
                    {getFormatIcon(report.reportFormat)}
                    <span>{report.reportFormat}</span>
                  </div>
                </td>
                <td>
                  {report.periodStart && report.periodEnd ? (
                    <div className="date-info">
                      <Calendar size={14} />
                      <span>{report.periodStart} - {report.periodEnd}</span>
                    </div>
                  ) : (
                    <span>-</span>
                  )}
                </td>
                <td>{report.recordCount || 0}</td>
                <td>
                  <span className={`status-badge ${report.status?.toLowerCase()}`}>
                    {report.status}
                  </span>
                </td>
                <td>
                  <div className="date-info">
                    <Calendar size={14} />
                    <span>{report.generationDate}</span>
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-view" onClick={() => handleView(report)}>
                      <Eye size={16} />
                    </button>
                    <button className="btn-download" onClick={() => handleDownload(report)}>
                      <Download size={16} />
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(report.id)}>
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
              <h2>Generar Nuevo Reporte</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>í—</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Nombre del Reporte *</label>
                  <input
                    type="text"
                    value={formData.reportName}
                    onChange={(e) => setFormData({...formData, reportName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tipo de Reporte</label>
                  <select
                    value={formData.reportType}
                    onChange={(e) => setFormData({...formData, reportType: e.target.value})}
                  >
                    {REPORT_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Módulo *</label>
                  <select
                    value={formData.moduleName}
                    onChange={(e) => setFormData({...formData, moduleName: e.target.value})}
                    required
                  >
                    <option value="">Seleccionar módulo...</option>
                    {MODULES.map(module => (
                      <option key={module} value={module}>{module}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Formato</label>
                  <select
                    value={formData.reportFormat}
                    onChange={(e) => setFormData({...formData, reportFormat: e.target.value})}
                  >
                    {FORMATS.map(format => (
                      <option key={format} value={format}>{format}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Fecha Inicio</label>
                  <input
                    type="date"
                    value={formData.periodStart}
                    onChange={(e) => setFormData({...formData, periodStart: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Fecha Fin</label>
                  <input
                    type="date"
                    value={formData.periodEnd}
                    onChange={(e) => setFormData({...formData, periodEnd: e.target.value})}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Descripción</label>
                  <textarea
                    value={formData.reportDescription}
                    onChange={(e) => setFormData({...formData, reportDescription: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Filtros Aplicados</label>
                  <input
                    type="text"
                    value={formData.filtersApplied}
                    onChange={(e) => setFormData({...formData, filtersApplied: e.target.value})}
                    placeholder="Ej: estado=ACTIVO, tipo=APARTAMENTO"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Generar Reporte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
