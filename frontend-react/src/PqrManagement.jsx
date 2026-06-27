import React, { useState, useEffect, useRef } from 'react';
import { FileText, Plus, Edit, Trash2, Search, AlertCircle, CheckCircle, Clock, AlertTriangle, Paperclip, Eye, X, MessageSquare } from 'lucide-react';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || `http://${location.hostname}:8081/api`;

export default function PqrManagement({ user }) {
  const [pqrs, setPqrs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPqr, setEditingPqr] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('TODOS');
  const [formData, setFormData] = useState({
    type: 'PETICION',
    title: '',
    description: '',
    requester: '',
    email: '',
    phone: '',
    status: 'PENDIENTE',
    priority: 'MEDIA',
    response: '',
    attachmentName: '',
    attachmentType: '',
    attachmentData: ''
  });
  const [viewingAttachment, setViewingAttachment] = useState(null);
  const fileInputRef = useRef(null);

  const isCopropietario = user?.role === 'COPIROPIETARIO';

  useEffect(() => {
    fetchPqrs();
  }, []);

  const fetchPqrs = async () => {
    try {
      const response = await fetch(`${API_URL}/pqrs`);
      if (response.ok) {
        const data = await response.json();
        setPqrs(data);
      }
    } catch (error) {
      console.error('Error fetching pqrs:', error);
    }
  };

  const handleFileChange = (e) => {
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

  const handleRemoveFile = () => {
    setFormData(prev => ({ ...prev, attachmentName: '', attachmentType: '', attachmentData: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleViewAttachment = (pqr) => {
    setViewingAttachment(pqr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingPqr 
        ? `${API_URL}/pqrs/${editingPqr.id}`
        : `${API_URL}/pqrs`;
      const method = editingPqr ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchPqrs();
        setShowModal(false);
        setEditingPqr(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving pqr:', error);
    }
  };

  const handleEdit = (pqr) => {
    setEditingPqr(pqr);
    setFormData({
      type: pqr.type,
      title: pqr.title,
      description: pqr.description,
      requester: pqr.requester,
      email: pqr.email || '',
      phone: pqr.phone || '',
      status: pqr.status,
      priority: pqr.priority || 'MEDIA',
      response: pqr.response || '',
      attachmentName: pqr.attachmentName || '',
      attachmentType: pqr.attachmentType || '',
      attachmentData: pqr.attachmentData || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Â¿EstÃ¡s seguro de eliminar esta PQR?')) {
      try {
        const response = await fetch(`${API_URL}/pqrs/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchPqrs();
        }
      } catch (error) {
        console.error('Error deleting pqr:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'PETICION',
      title: '',
      description: '',
      requester: isCopropietario ? (user?.fullName || user?.username || '') : '',
      email: isCopropietario ? (user?.email || '') : '',
      phone: isCopropietario ? (user?.phone || '') : '',
      status: 'PENDIENTE',
      priority: 'MEDIA',
      response: '',
      attachmentName: '',
      attachmentType: '',
      attachmentData: ''
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'RESUELTA': return <CheckCircle size={16} />;
      case 'EN PROCESO': return <Clock size={16} />;
      case 'PENDIENTE': return <AlertCircle size={16} />;
      default: return <AlertTriangle size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'RESUELTA': return '#10b981';
      case 'EN PROCESO': return '#f59e0b';
      case 'PENDIENTE': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'ALTA': return '#ef4444';
      case 'MEDIA': return '#f59e0b';
      case 'BAJA': return '#10b981';
      default: return '#6b7280';
    }
  };

  const filteredPqrs = pqrs.filter(pqr => {
    const matchesSearch = 
      pqr.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pqr.requester?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pqr.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'TODOS' || pqr.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="pqr-management">
      <div className="pqr-header">
        <div className="header-title">
          <FileText size={32} />
          <h1>GestiÃ³n de PQR</h1>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setEditingPqr(null); setShowModal(true); }}>
          <Plus size={20} />
          <span>Nueva PQR</span>
        </button>
      </div>

      <div className="pqr-filters">
        <div className="search-bar">
          <Search size={20} />
          <input
            placeholder="Buscar PQR..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="TODOS">Todos los estados</option>
          <option value="PENDIENTE">Pendientes</option>
          <option value="EN PROCESO">En proceso</option>
          <option value="RESUELTA">Resueltas</option>
        </select>
      </div>

      <div className="pqr-grid">
        {filteredPqrs.map(pqr => (
          <div key={pqr.id} className="pqr-card">
            <div className="pqr-card-header">
              <span className="pqr-type">{pqr.type}</span>
              <span className="pqr-priority" style={{ color: getPriorityColor(pqr.priority) }}>
                {pqr.priority}
              </span>
            </div>
            <h3>{pqr.title}</h3>
            <p className="pqr-description">{pqr.description}</p>
            <div className="pqr-meta">
              <span className="pqr-requester">Solicitante: {pqr.requester}</span>
              <span className="pqr-date">
                {new Date(pqr.createdAt).toLocaleDateString('es-ES')}
              </span>
            </div>
            <div className="pqr-status" style={{ color: getStatusColor(pqr.status) }}>
              {getStatusIcon(pqr.status)}
              <span>{pqr.status}</span>
            </div>
            {pqr.response && (
              <div style={{ marginTop: '8px', padding: '10px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: '600', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MessageSquare size={12} />
                  Respuesta de la administraciÃ³n:
                </div>
                <div style={{ fontSize: '0.85rem', color: '#166534' }}>
                  {pqr.response}
                </div>
              </div>
            )}
            {pqr.attachmentName && (
              <div style={{ marginTop: '8px', padding: '8px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Paperclip size={16} color="#0284c7" />
                <span style={{ fontSize: '0.8rem', color: '#0284c7', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {pqr.attachmentName}
                </span>
                <button onClick={() => handleViewAttachment(pqr)} style={{ padding: '4px 8px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Eye size={14} />
                  Ver
                </button>
              </div>
            )}
            <div className="pqr-actions" style={{ gap: '6px' }}>
              {!isCopropietario && pqr.status !== 'RESUELTA' && (
                <button 
                  onClick={() => handleEdit(pqr)} 
                  style={{ padding: '6px 12px', background: '#123b62', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}
                >
                  <MessageSquare size={14} />
                  Responder
                </button>
              )}
              <button className="btn-edit" onClick={() => handleEdit(pqr)}>
                <Edit size={16} />
              </button>
              <button className="btn-delete" onClick={() => handleDelete(pqr.id)}>
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
              <h2>{editingPqr ? 'Editar PQR' : 'Nueva PQR'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <AlertCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Tipo</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="PETICION">PeticiÃ³n</option>
                    <option value="QUEJA">Queja</option>
                    <option value="RECLAMO">Reclamo</option>
                    <option value="SUGERENCIA">Sugerencia</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Prioridad</label>
                  <select
                    value={formData.priority}
                    onChange={e => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="ALTA">Alta</option>
                    <option value="MEDIA">Media</option>
                    <option value="BAJA">Baja</option>
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>TÃ­tulo</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>DescripciÃ³n</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    required
                    rows={4}
                  />
                </div>
                <div className="form-group">
                  <label>Solicitante</label>
                  <input
                    type="text"
                    value={formData.requester}
                    onChange={e => setFormData({...formData, requester: e.target.value})}
                    required
                    readOnly={isCopropietario}
                    style={isCopropietario ? { background: '#f0f0f0', color: '#666' } : {}}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    readOnly={isCopropietario}
                    style={isCopropietario ? { background: '#f0f0f0', color: '#666' } : {}}
                  />
                </div>
                <div className="form-group">
                  <label>TelÃ©fono</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    readOnly={isCopropietario}
                    style={isCopropietario ? { background: '#f0f0f0', color: '#666' } : {}}
                  />
                </div>
                {!isCopropietario && (
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="EN PROCESO">En proceso</option>
                    <option value="RESUELTA">Resuelta</option>
                  </select>
                </div>
                )}
                {!isCopropietario && (
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Respuesta</label>
                  <textarea
                    value={formData.response}
                    onChange={e => setFormData({...formData, response: e.target.value})}
                    rows={3}
                    placeholder="Escriba la respuesta para el copropietario..."
                  />
                </div>
                )}
                {editingPqr && editingPqr.attachmentName && (
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Evidencia adjunta por el copropietario</label>
                  <div style={{ padding: '12px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Paperclip size={18} color="#0284c7" />
                    <span style={{ fontSize: '0.85rem', color: '#0284c7', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {editingPqr.attachmentName}
                    </span>
                    <button type="button" onClick={() => handleViewAttachment(editingPqr)} style={{ padding: '6px 12px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={14} />
                      Ver evidencia
                    </button>
                  </div>
                </div>
                )}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Evidencia (PDF, JPG o PNG - max 5MB)</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                      onChange={handleFileChange}
                      style={{ flex: 1 }}
                    />
                    {formData.attachmentName && (
                      <button type="button" onClick={handleRemoveFile} style={{ padding: '8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  {formData.attachmentName && (
                    <small style={{ color: '#136f43', display: 'block', marginTop: '4px', fontSize: '0.8rem' }}>
                      <Paperclip size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      {formData.attachmentName}
                    </small>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingPqr ? 'Actualizar' : 'Crear'}
                </button>
                {!isCopropietario && editingPqr && (
                  <button 
                    type="button" 
                    className="btn-primary" 
                    style={{ background: '#10b981' }}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, status: 'RESUELTA' }));
                      setTimeout(() => {
                        const form = document.querySelector('form');
                        if (form) form.requestSubmit();
                      }, 100);
                    }}
                  >
                    <CheckCircle size={16} style={{ display: 'inline', marginRight: '4px' }} />
                    Resolver y Cerrar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {viewingAttachment && (
        <div className="modal-overlay" onClick={() => setViewingAttachment(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '90vh' }}>
            <div className="modal-header">
              <h2>Evidencia: {viewingAttachment.attachmentName}</h2>
              <button className="btn-close" onClick={() => setViewingAttachment(null)}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: '16px', textAlign: 'center', maxHeight: '70vh', overflow: 'auto' }}>
              {viewingAttachment.attachmentType?.startsWith('image/') ? (
                <img 
                  src={`data:${viewingAttachment.attachmentType};base64,${viewingAttachment.attachmentData}`} 
                  alt={viewingAttachment.attachmentName}
                  style={{ maxWidth: '100%', maxHeight: '60vh', borderRadius: '8px' }}
                />
              ) : (
                <iframe 
                  src={`data:${viewingAttachment.attachmentType};base64,${viewingAttachment.attachmentData}`}
                  style={{ width: '100%', height: '60vh', border: 'none', borderRadius: '8px' }}
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
