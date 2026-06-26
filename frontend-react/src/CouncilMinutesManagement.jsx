import React, { useState, useEffect } from 'react';
import { 
  FileText, Upload, Download, Eye, Calendar, Users, 
  Search, Filter, Plus, Trash2, Edit, Clock, CheckCircle,
  AlertCircle, X, Save
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || `http://${location.hostname}:8081/api`;

export default function CouncilMinutesManagement({ userRole = 'admin' }) {
  const [minutes, setMinutes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedMinute, setSelectedMinute] = useState(null);
  const [viewMode, setViewMode] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    attendees: '',
    topics: '',
    decisions: '',
    nextMeeting: '',
    attachments: '',
    status: 'draft'
  });

  // Roles que pueden CREAR actas
  const canCreate = ['admin', 'Administrador', 'consejero', 'Consejeros'].includes(userRole);
  
  // Roles que pueden VER actas
  const canView = ['admin', 'Administrador', 'consejero', 'Consejeros', 'copropietario', 'Copropietarios', 
                   'contador', 'Contador', 'revisor', 'Revisor Fiscal'].includes(userRole);

  useEffect(() => {
    loadMinutes();
  }, []);

  const loadMinutes = async () => {
    // Datos de ejemplo - en producción vendría del backend
    setMinutes([
      {
        id: 1,
        title: 'Acta Reunión Ordinaria #001',
        date: '2026-06-20',
        attendees: 'Juan Pérez, María García, Carlos López, Ana Martínez',
        topics: 'Revisión presupuesto Q2, Mantenimiento ascensores, Seguridad',
        decisions: '1. Aprobar presupuesto Q2\n2. Contratar mantenimiento ascensores\n3. Reforzar vigilancia nocturna',
        nextMeeting: '2026-07-15',
        status: 'approved',
        createdBy: 'Juan Pérez',
        createdAt: '2026-06-20T10:30:00'
      },
      {
        id: 2,
        title: 'Acta Reunión Extraordinaria #002',
        date: '2026-06-15',
        attendees: 'Juan Pérez, María García, Pedro Sánchez',
        topics: 'Emergencia filtración agua torre B',
        decisions: '1. Contratar reparación urgente\n2. Notificar a afectados\n3. Revisar póliza de seguros',
        nextMeeting: '2026-06-20',
        status: 'approved',
        createdBy: 'María García',
        createdAt: '2026-06-15T15:00:00'
      },
      {
        id: 3,
        title: 'Acta Reunión Ordinaria #003',
        date: '2026-06-25',
        attendees: 'Juan Pérez, María García, Carlos López',
        topics: 'Seguimiento reparaciones, Eventos comunitarios',
        decisions: 'Pendiente de aprobación',
        nextMeeting: '2026-07-10',
        status: 'draft',
        createdBy: 'Carlos López',
        createdAt: '2026-06-25T09:00:00'
      }
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedMinute) {
      setMinutes(prev => prev.map(m => 
        m.id === selectedMinute.id ? { ...m, ...formData, updatedAt: new Date().toISOString() } : m
      ));
    } else {
      const newMinute = {
        id: Date.now(),
        ...formData,
        createdBy: 'Usuario Actual',
        createdAt: new Date().toISOString()
      };
      setMinutes(prev => [newMinute, ...prev]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      attendees: '',
      topics: '',
      decisions: '',
      nextMeeting: '',
      attachments: '',
      status: 'draft'
    });
    setSelectedMinute(null);
    setShowModal(false);
    setViewMode(false);
  };

  const handleEdit = (minute) => {
    setSelectedMinute(minute);
    setFormData({
      title: minute.title,
      date: minute.date,
      attendees: minute.attendees,
      topics: minute.topics,
      decisions: minute.decisions,
      nextMeeting: minute.nextMeeting || '',
      attachments: minute.attachments || '',
      status: minute.status
    });
    setViewMode(false);
    setShowModal(true);
  };

  const handleView = (minute) => {
    setSelectedMinute(minute);
    setFormData({
      title: minute.title,
      date: minute.date,
      attendees: minute.attendees,
      topics: minute.topics,
      decisions: minute.decisions,
      nextMeeting: minute.nextMeeting || '',
      attachments: minute.attachments || '',
      status: minute.status
    });
    setViewMode(true);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('¿Está seguro de eliminar esta acta?')) {
      setMinutes(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleApprove = (id) => {
    setMinutes(prev => prev.map(m => 
      m.id === id ? { ...m, status: 'approved', approvedAt: new Date().toISOString() } : m
    ));
  };

  const filteredMinutes = minutes.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.topics.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || m.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const styles = {
      draft: { bg: '#fef3c7', color: '#d97706', label: 'Borrador' },
      approved: { bg: '#d1fae5', color: '#059669', label: 'Aprobada' },
      pending: { bg: '#dbeafe', color: '#2563eb', label: 'Pendiente' }
    };
    const style = styles[status] || styles.draft;
    return (
      <span style={{ 
        background: style.bg, 
        color: style.color, 
        padding: '4px 12px', 
        borderRadius: '999px', 
        fontSize: '0.8rem', 
        fontWeight: '700' 
      }}>
        {style.label}
      </span>
    );
  };

  return (
    <div className="council-minutes-management" style={{ padding: '0' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <FileText size={24} color="white" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#102033' }}>Actas del Consejo</h1>
            <p style={{ margin: 0, color: '#65758a', fontSize: '0.9rem' }}>
              {canCreate ? 'Gestión de actas de reuniones' : 'Consulta de actas de reuniones'}
            </p>
          </div>
        </div>
        {canCreate && (
          <button 
            onClick={() => { resetForm(); setShowModal(true); }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: '#10b981', 
              color: 'white', 
              border: 'none', 
              padding: '12px 20px', 
              borderRadius: '12px', 
              cursor: 'pointer', 
              fontWeight: '600' 
            }}
          >
            <Plus size={20} /> Nueva Acta
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '24px', 
        flexWrap: 'wrap' 
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          background: 'white', 
          border: '1px solid #d8e4ec', 
          borderRadius: '12px', 
          padding: '0 16px', 
          flex: '1', 
          minWidth: '200px' 
        }}>
          <Search size={20} color="#65758a" />
          <input 
            type="text" 
            placeholder="Buscar actas..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              border: 'none', 
              padding: '12px 0', 
              flex: '1', 
              outline: 'none',
              background: 'transparent'
            }} 
          />
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          background: 'white', 
          border: '1px solid #d8e4ec', 
          borderRadius: '12px', 
          padding: '0 16px' 
        }}>
          <Filter size={20} color="#65758a" />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ 
              border: 'none', 
              padding: '12px 0', 
              outline: 'none',
              background: 'transparent',
              cursor: 'pointer'
            }}
          >
            <option value="all">Todos los estados</option>
            <option value="draft">Borrador</option>
            <option value="approved">Aprobadas</option>
            <option value="pending">Pendientes</option>
          </select>
        </div>
      </div>

      {/* Minutes List */}
      <div style={{ display: 'grid', gap: '16px' }}>
        {filteredMinutes.map(minute => (
          <div 
            key={minute.id} 
            style={{ 
              background: 'white', 
              border: '1px solid #d8e4ec', 
              borderRadius: '16px', 
              padding: '20px',
              boxShadow: '0 2px 8px rgba(16,32,51,0.06)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ margin: '0 0 8px', color: '#102033', fontSize: '1.1rem' }}>{minute.title}</h3>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.85rem', color: '#65758a' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} /> {minute.date}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={14} /> {minute.attendees.split(',').length} asistentes
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} /> {minute.createdBy}
                  </span>
                </div>
              </div>
              {getStatusBadge(minute.status)}
            </div>

            <p style={{ margin: '0 0 16px', color: '#536477', fontSize: '0.9rem', lineHeight: '1.5' }}>
              <strong>Temas:</strong> {minute.topics}
            </p>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button 
                onClick={() => handleView(minute)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  background: '#dbeafe', 
                  color: '#2563eb', 
                  border: 'none', 
                  padding: '8px 14px', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}
              >
                <Eye size={16} /> Ver
              </button>
              {canCreate && (
                <>
                  <button 
                    onClick={() => handleEdit(minute)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      background: '#fef3c7', 
                      color: '#d97706', 
                      border: 'none', 
                      padding: '8px 14px', 
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}
                  >
                    <Edit size={16} /> Editar
                  </button>
                  {minute.status === 'draft' && (
                    <button 
                      onClick={() => handleApprove(minute.id)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        background: '#d1fae5', 
                        color: '#059669', 
                        border: 'none', 
                        padding: '8px 14px', 
                        borderRadius: '8px', 
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}
                    >
                      <CheckCircle size={16} /> Aprobar
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(minute.id)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      background: '#fee2e2', 
                      color: '#dc2626', 
                      border: 'none', 
                      padding: '8px 14px', 
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {filteredMinutes.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px', 
            background: 'white', 
            borderRadius: '16px',
            border: '1px solid #d8e4ec'
          }}>
            <FileText size={48} color="#d8e4ec" style={{ marginBottom: '16px' }} />
            <h3 style={{ margin: '0 0 8px', color: '#65758a' }}>No hay actas</h3>
            <p style={{ margin: 0, color: '#a0aec0' }}>
              {canCreate ? 'Crea la primera acta de reunión' : 'No hay actas disponibles para consultar'}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '20px', 
            padding: '24px', 
            width: '100%', 
            maxWidth: '600px', 
            maxHeight: '90vh', 
            overflowY: 'auto' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, color: '#102033' }}>
                {viewMode ? 'Ver Acta' : (selectedMinute ? 'Editar Acta' : 'Nueva Acta')}
              </h2>
              <button 
                onClick={resetForm}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px' }}
              >
                <X size={24} color="#65758a" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>
                    Título del Acta *
                  </label>
                  <input 
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    disabled={viewMode}
                    required
                    placeholder="Ej: Acta Reunión Ordinaria #001"
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      border: '1px solid #d8e4ec', 
                      borderRadius: '12px',
                      fontSize: '0.95rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>
                      Fecha de Reunión *
                    </label>
                    <input 
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      disabled={viewMode}
                      required
                      style={{ 
                        width: '100%', 
                        padding: '12px', 
                        border: '1px solid #d8e4ec', 
                        borderRadius: '12px',
                        fontSize: '0.95rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>
                      Próxima Reunión
                    </label>
                    <input 
                      type="date"
                      value={formData.nextMeeting}
                      onChange={(e) => setFormData({...formData, nextMeeting: e.target.value})}
                      disabled={viewMode}
                      style={{ 
                        width: '100%', 
                        padding: '12px', 
                        border: '1px solid #d8e4ec', 
                        borderRadius: '12px',
                        fontSize: '0.95rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>
                    Asistentes *
                  </label>
                  <input 
                    type="text"
                    value={formData.attendees}
                    onChange={(e) => setFormData({...formData, attendees: e.target.value})}
                    disabled={viewMode}
                    required
                    placeholder="Nombres separados por coma"
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      border: '1px solid #d8e4ec', 
                      borderRadius: '12px',
                      fontSize: '0.95rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>
                    Temas Tratados *
                  </label>
                  <textarea 
                    value={formData.topics}
                    onChange={(e) => setFormData({...formData, topics: e.target.value})}
                    disabled={viewMode}
                    required
                    rows={3}
                    placeholder="Describa los temas discutidos en la reunión"
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      border: '1px solid #d8e4ec', 
                      borderRadius: '12px',
                      fontSize: '0.95rem',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>
                    Decisiones y Acuerdos *
                  </label>
                  <textarea 
                    value={formData.decisions}
                    onChange={(e) => setFormData({...formData, decisions: e.target.value})}
                    disabled={viewMode}
                    required
                    rows={4}
                    placeholder="Liste las decisiones tomadas"
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      border: '1px solid #d8e4ec', 
                      borderRadius: '12px',
                      fontSize: '0.95rem',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {!viewMode && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>
                      Estado
                    </label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      style={{ 
                        width: '100%', 
                        padding: '12px', 
                        border: '1px solid #d8e4ec', 
                        borderRadius: '12px',
                        fontSize: '0.95rem',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="draft">Borrador</option>
                      <option value="pending">Pendiente de Aprobación</option>
                      <option value="approved">Aprobada</option>
                    </select>
                  </div>
                )}
              </div>

              {!viewMode && (
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                  <button 
                    type="button"
                    onClick={resetForm}
                    style={{ 
                      padding: '12px 24px', 
                      border: '1px solid #d8e4ec', 
                      borderRadius: '12px', 
                      background: 'white',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 24px', 
                      border: 'none', 
                      borderRadius: '12px', 
                      background: '#10b981',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    <Save size={18} /> {selectedMinute ? 'Guardar Cambios' : 'Crear Acta'}
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
