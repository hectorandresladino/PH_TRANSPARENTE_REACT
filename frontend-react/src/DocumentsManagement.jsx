import React, { useState, useEffect } from 'react';
import { FileText, Plus, Edit, Trash2, Search, CheckCircle, XCircle, Clock, Download, Upload } from 'lucide-react';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || `http://${location.hostname}:8081/api`;

export default function DocumentsManagement() {
  const [documents, setDocuments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('TODOS');
  const [filterType, setFilterType] = useState('TODOS');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'PDF',
    category: 'GENERAL',
    fileName: '',
    filePath: '',
    fileSize: '',
    mimeType: '',
    uploadedBy: '',
    uploadedByName: '',
    status: 'ACTIVO',
    expiryDate: ''
  });

  const documentTypes = ['PDF', 'DOC', 'DOCX', 'XLS', 'XLSX', 'IMG', 'OTRO'];
  const documentCategories = ['GENERAL', 'LEGAL', 'FINANCIERO', 'MANTENIMIENTO', 'ACTAS', 'REGLAMENTO'];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${API_URL}/documents`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingDocument 
        ? `${API_URL}/documents/${editingDocument.id}`
        : `${API_URL}/documents`;
      const method = editingDocument ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          fileSize: formData.fileSize ? parseInt(formData.fileSize) : null
        })
      });

      if (response.ok) {
        fetchDocuments();
        setShowModal(false);
        setEditingDocument(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };

  const handleEdit = (document) => {
    setEditingDocument(document);
    setFormData({
      title: document.title,
      description: document.description || '',
      type: document.type,
      category: document.category || '',
      fileName: document.fileName || '',
      filePath: document.filePath || '',
      fileSize: document.fileSize || '',
      mimeType: document.mimeType || '',
      uploadedBy: document.uploadedBy,
      uploadedByName: document.uploadedByName || '',
      status: document.status,
      expiryDate: document.expiryDate || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Â¿EstÃ¡s seguro de eliminar este documento?')) {
      try {
        const response = await fetch(`${API_URL}/documents/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchDocuments();
        }
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'PDF',
      category: 'GENERAL',
      fileName: '',
      filePath: '',
      fileSize: '',
      mimeType: '',
      uploadedBy: '',
      uploadedByName: '',
      status: 'ACTIVO',
      expiryDate: ''
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVO': return <CheckCircle size={16} />;
      case 'VENCIDO': return <XCircle size={16} />;
      case 'ARCHIVADO': return <Clock size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVO': return '#10b981';
      case 'VENCIDO': return '#ef4444';
      case 'ARCHIVADO': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '-';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const filteredDocuments = documents.filter(document => {
    const matchesSearch = 
      document.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.fileName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'TODOS' || document.status === filterStatus;
    const matchesType = filterType === 'TODOS' || document.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="documents-management">
      <div className="documents-header">
        <div className="header-title">
          <FileText size={32} />
          <h1>GestiÃ³n de Documentos</h1>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setEditingDocument(null); setShowModal(true); }}>
          <Plus size={20} />
          <span>Nuevo Documento</span>
        </button>
      </div>

      <div className="documents-filters">
        <div className="search-bar">
          <Search size={20} />
          <input
            placeholder="Buscar documentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="TODOS">Todos los estados</option>
          <option value="ACTIVO">Activos</option>
          <option value="VENCIDO">Vencidos</option>
          <option value="ARCHIVADO">Archivados</option>
        </select>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="TODOS">Todos los tipos</option>
          {documentTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="documents-grid">
        {filteredDocuments.map(document => (
          <div key={document.id} className="document-card">
            <div className="document-header">
              <span className="document-title">{document.title}</span>
              <span className="status-badge" style={{ color: getStatusColor(document.status) }}>
                {getStatusIcon(document.status)}
                {document.status}
              </span>
            </div>
            <div className="document-info">
              <div className="document-type">{document.type} - {document.category}</div>
              {document.description && (
                <p className="document-description">{document.description}</p>
              )}
            </div>
            <div className="document-details">
              <div className="detail-row">
                <span>Archivo: {document.fileName || '-'}</span>
              </div>
              <div className="detail-row">
                <span>TamaÃ±o: {formatFileSize(document.fileSize)}</span>
              </div>
              <div className="detail-row">
                <Upload size={16} />
                <span>Subido por: {document.uploadedByName || document.uploadedBy}</span>
              </div>
              {document.uploadDate && (
                <div className="detail-row">
                  <Clock size={16} />
                  <span>Fecha: {new Date(document.uploadDate).toLocaleDateString('es-ES')}</span>
                </div>
              )}
              {document.expiryDate && (
                <div className="detail-row">
                  <Clock size={16} />
                  <span>Vence: {new Date(document.expiryDate).toLocaleDateString('es-ES')}</span>
                </div>
              )}
            </div>
            <div className="document-actions">
              <button className="btn-download" title="Descargar">
                <Download size={16} />
              </button>
              <button className="btn-edit" onClick={() => handleEdit(document)}>
                <Edit size={16} />
              </button>
              <button className="btn-delete" onClick={() => handleDelete(document.id)}>
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
              <h2>{editingDocument ? 'Editar Documento' : 'Nuevo Documento'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>TÃ­tulo</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tipo</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    {documentTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>CategorÃ­a</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    {documentCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>ID Usuario</label>
                  <input
                    type="text"
                    value={formData.uploadedBy}
                    onChange={e => setFormData({...formData, uploadedBy: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nombre Usuario</label>
                  <input
                    type="text"
                    value={formData.uploadedByName}
                    onChange={e => setFormData({...formData, uploadedByName: e.target.value})}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Nombre Archivo</label>
                  <input
                    type="text"
                    value={formData.fileName}
                    onChange={e => setFormData({...formData, fileName: e.target.value})}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Ruta Archivo</label>
                  <input
                    type="text"
                    value={formData.filePath}
                    onChange={e => setFormData({...formData, filePath: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>TamaÃ±o (bytes)</label>
                  <input
                    type="number"
                    value={formData.fileSize}
                    onChange={e => setFormData({...formData, fileSize: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>MIME Type</label>
                  <input
                    type="text"
                    value={formData.mimeType}
                    onChange={e => setFormData({...formData, mimeType: e.target.value})}
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
                    <option value="ARCHIVADO">Archivado</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Fecha Vencimiento</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>DescripciÃ³n</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingDocument ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
