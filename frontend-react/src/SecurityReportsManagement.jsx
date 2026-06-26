import React, { useState, useEffect } from 'react';
import { 
  Shield, Plus, Search, Filter, Calendar, Clock, 
  AlertTriangle, CheckCircle, Eye, Edit, Trash2, X, Save,
  FileText, Users, MapPin, ChevronLeft, Bell, Activity,
  Phone, Heart, User, Building, BadgeCheck, Stethoscope
} from 'lucide-react';

export default function SecurityReportsManagement({ userRole = 'vigilancia', onBack }) {
  const [reports, setReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [activeTab, setActiveTab] = useState('reports'); // reports, schedule, stats, personnel

  const canCreate = ['admin', 'Administrador', 'vigilancia', 'Empresa de Vigilancia'].includes(userRole);

  const [formData, setFormData] = useState({
    type: 'minuta',
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    location: '',
    description: '',
    involvedPersons: '',
    actions: '',
    priority: 'normal',
    status: 'open'
  });

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    setReports([
      {
        id: 1,
        type: 'minuta',
        title: 'Minuta de Turno Nocturno',
        date: '2026-06-25',
        time: '22:00',
        location: 'Portería Principal',
        description: 'Turno sin novedades. Se realizaron 4 rondas de vigilancia. Todos los accesos verificados.',
        involvedPersons: 'Guardia: Juan Pérez',
        actions: 'Rondas completadas según protocolo',
        priority: 'normal',
        status: 'closed',
        createdBy: 'Juan Pérez'
      },
      {
        id: 2,
        type: 'reporte',
        title: 'Intento de Ingreso No Autorizado',
        date: '2026-06-24',
        time: '03:30',
        location: 'Puerta Parqueadero',
        description: 'Se detectó persona intentando ingresar por la puerta del parqueadero sin autorización.',
        involvedPersons: 'Persona no identificada, Guardia: Carlos López',
        actions: 'Se activó alarma, se contactó a la policía, se revisaron cámaras',
        priority: 'high',
        status: 'closed',
        createdBy: 'Carlos López'
      },
      {
        id: 3,
        type: 'caso',
        title: 'Daño en Cámara de Seguridad',
        date: '2026-06-23',
        time: '14:15',
        location: 'Torre B - Piso 3',
        description: 'Se encontró cámara de seguridad dañada. Posible vandalismo.',
        involvedPersons: 'Por determinar',
        actions: 'Se reportó a administración, se solicitó revisión de grabaciones',
        priority: 'high',
        status: 'open',
        createdBy: 'María García'
      },
      {
        id: 4,
        type: 'evento',
        title: 'Simulacro de Evacuación',
        date: '2026-06-28',
        time: '10:00',
        location: 'Todo el Conjunto',
        description: 'Simulacro programado de evacuación. Coordinar con bomberos y administración.',
        involvedPersons: 'Todo el personal de vigilancia, Bomberos, Administración',
        actions: 'Preparar rutas de evacuación, verificar extintores, coordinar con residentes',
        priority: 'normal',
        status: 'scheduled',
        createdBy: 'Administración'
      },
      {
        id: 5,
        type: 'minuta',
        title: 'Minuta de Turno Diurno',
        date: '2026-06-26',
        time: '06:00',
        location: 'Portería Principal',
        description: 'Ingreso de 15 visitantes, 8 domicilios, 3 proveedores. Sin novedades.',
        involvedPersons: 'Guardia: Ana Martínez',
        actions: 'Registro completo en bitácora',
        priority: 'normal',
        status: 'closed',
        createdBy: 'Ana Martínez'
      }
    ]);
  };

  // Cronograma semanal
  const schedule = [
    { day: 'Lunes', shifts: [
      { time: '06:00 - 14:00', guard: 'Juan Pérez', location: 'Portería' },
      { time: '14:00 - 22:00', guard: 'Carlos López', location: 'Portería' },
      { time: '22:00 - 06:00', guard: 'Ana Martínez', location: 'Rondas' }
    ]},
    { day: 'Martes', shifts: [
      { time: '06:00 - 14:00', guard: 'Carlos López', location: 'Portería' },
      { time: '14:00 - 22:00', guard: 'Ana Martínez', location: 'Portería' },
      { time: '22:00 - 06:00', guard: 'Juan Pérez', location: 'Rondas' }
    ]},
    { day: 'Miércoles', shifts: [
      { time: '06:00 - 14:00', guard: 'Ana Martínez', location: 'Portería' },
      { time: '14:00 - 22:00', guard: 'Juan Pérez', location: 'Portería' },
      { time: '22:00 - 06:00', guard: 'Carlos López', location: 'Rondas' }
    ]},
    { day: 'Jueves', shifts: [
      { time: '06:00 - 14:00', guard: 'Juan Pérez', location: 'Portería' },
      { time: '14:00 - 22:00', guard: 'Carlos López', location: 'Portería' },
      { time: '22:00 - 06:00', guard: 'Ana Martínez', location: 'Rondas' }
    ]},
    { day: 'Viernes', shifts: [
      { time: '06:00 - 14:00', guard: 'Carlos López', location: 'Portería' },
      { time: '14:00 - 22:00', guard: 'Ana Martínez', location: 'Portería' },
      { time: '22:00 - 06:00', guard: 'Juan Pérez', location: 'Rondas' }
    ]},
    { day: 'Sábado', shifts: [
      { time: '06:00 - 18:00', guard: 'Juan Pérez', location: 'Portería' },
      { time: '18:00 - 06:00', guard: 'Carlos López', location: 'Portería + Rondas' }
    ]},
    { day: 'Domingo', shifts: [
      { time: '06:00 - 18:00', guard: 'Ana Martínez', location: 'Portería' },
      { time: '18:00 - 06:00', guard: 'Juan Pérez', location: 'Portería + Rondas' }
    ]}
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedReport) {
      setReports(prev => prev.map(r => r.id === selectedReport.id ? { ...r, ...formData } : r));
    } else {
      setReports(prev => [{ id: Date.now(), ...formData, createdBy: 'Usuario Actual' }, ...prev]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      type: 'minuta',
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      location: '',
      description: '',
      involvedPersons: '',
      actions: '',
      priority: 'normal',
      status: 'open'
    });
    setSelectedReport(null);
    setShowModal(false);
    setViewMode(false);
  };

  const handleView = (report) => {
    setSelectedReport(report);
    setFormData({ ...report });
    setViewMode(true);
    setShowModal(true);
  };

  const handleEdit = (report) => {
    setSelectedReport(report);
    setFormData({ ...report });
    setViewMode(false);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('¿Eliminar este registro?')) {
      setReports(prev => prev.filter(r => r.id !== id));
    }
  };

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || r.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeBadge = (type) => {
    const types = {
      minuta: { label: 'Minuta', color: '#2563eb', bg: '#dbeafe' },
      reporte: { label: 'Reporte', color: '#7c3aed', bg: '#ede9fe' },
      caso: { label: 'Caso', color: '#dc2626', bg: '#fee2e2' },
      evento: { label: 'Evento', color: '#059669', bg: '#d1fae5' }
    };
    const t = types[type] || types.minuta;
    return <span style={{ background: t.bg, color: t.color, padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700' }}>{t.label}</span>;
  };

  const getPriorityBadge = (priority) => {
    const priorities = {
      low: { label: 'Baja', color: '#059669' },
      normal: { label: 'Normal', color: '#2563eb' },
      high: { label: 'Alta', color: '#dc2626' }
    };
    const p = priorities[priority] || priorities.normal;
    return <span style={{ color: p.color, fontWeight: '600', fontSize: '0.8rem' }}>● {p.label}</span>;
  };

  const getStatusBadge = (status) => {
    const statuses = {
      open: { label: 'Abierto', color: '#f59e0b', bg: '#fef3c7' },
      closed: { label: 'Cerrado', color: '#059669', bg: '#d1fae5' },
      scheduled: { label: 'Programado', color: '#2563eb', bg: '#dbeafe' }
    };
    const s = statuses[status] || statuses.open;
    return <span style={{ background: s.bg, color: s.color, padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700' }}>{s.label}</span>;
  };

  // Estadísticas
  const stats = {
    total: reports.length,
    minutas: reports.filter(r => r.type === 'minuta').length,
    reportes: reports.filter(r => r.type === 'reporte').length,
    casos: reports.filter(r => r.type === 'caso').length,
    eventos: reports.filter(r => r.type === 'evento').length,
    open: reports.filter(r => r.status === 'open').length,
    highPriority: reports.filter(r => r.priority === 'high').length
  };

  return (
    <div style={{ padding: '0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {onBack && (
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', border: 'none', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', color: '#475569' }}>
            <ChevronLeft size={20} /> Atrás
          </button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
          <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={24} color="white" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#102033' }}>Control de Vigilancia</h1>
            <p style={{ margin: 0, color: '#65758a', fontSize: '0.9rem' }}>Minutas, Reportes, Casos y Eventos</p>
          </div>
        </div>
        {canCreate && (
          <button onClick={() => { resetForm(); setShowModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1e3a5f', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}>
            <Plus size={20} /> Nuevo Registro
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
        {[
          { id: 'reports', label: 'Registros', icon: <FileText size={18} /> },
          { id: 'personnel', label: 'Personal', icon: <Users size={18} /> },
          { id: 'schedule', label: 'Cronograma', icon: <Calendar size={18} /> },
          { id: 'stats', label: 'Estadísticas', icon: <Activity size={18} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              border: 'none',
              background: activeTab === tab.id ? '#1e3a5f' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#475569',
              borderRadius: '10px 10px 0 0',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Registros */}
      {activeTab === 'reports' && (
        <>
          {/* Filters */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #d8e4ec', borderRadius: '12px', padding: '0 16px', flex: '1', minWidth: '200px' }}>
              <Search size={20} color="#65758a" />
              <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ border: 'none', padding: '12px 0', flex: '1', outline: 'none', background: 'transparent' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #d8e4ec', borderRadius: '12px', padding: '0 16px' }}>
              <Filter size={20} color="#65758a" />
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ border: 'none', padding: '12px 0', outline: 'none', background: 'transparent', cursor: 'pointer' }}>
                <option value="all">Todos</option>
                <option value="minuta">Minutas</option>
                <option value="reporte">Reportes</option>
                <option value="caso">Casos</option>
                <option value="evento">Eventos</option>
              </select>
            </div>
          </div>

          {/* Reports List */}
          <div style={{ display: 'grid', gap: '16px' }}>
            {filteredReports.map(report => (
              <div key={report.id} style={{ background: 'white', border: '1px solid #d8e4ec', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(16,32,51,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      {getTypeBadge(report.type)}
                      {getStatusBadge(report.status)}
                      {getPriorityBadge(report.priority)}
                    </div>
                    <h3 style={{ margin: '0 0 8px', color: '#102033', fontSize: '1.1rem' }}>{report.title}</h3>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.85rem', color: '#65758a' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {report.date}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {report.time}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {report.location}</span>
                    </div>
                  </div>
                </div>
                <p style={{ margin: '0 0 16px', color: '#536477', fontSize: '0.9rem', lineHeight: '1.5' }}>{report.description}</p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  <button onClick={() => handleView(report)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#dbeafe', color: '#2563eb', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}><Eye size={16} /> Ver</button>
                  {canCreate && (
                    <>
                      <button onClick={() => handleEdit(report)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fef3c7', color: '#d97706', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}><Edit size={16} /> Editar</button>
                      <button onClick={() => handleDelete(report.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fee2e2', color: '#dc2626', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}><Trash2 size={16} /></button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Tab: Cronograma */}
      {activeTab === 'schedule' && (
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #d8e4ec', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, color: '#102033' }}>Cronograma Semanal de Turnos</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead>
                <tr style={{ background: '#f6f9fb' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#102033', borderBottom: '1px solid #e2e8f0' }}>Día</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#102033', borderBottom: '1px solid #e2e8f0' }}>Turno</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#102033', borderBottom: '1px solid #e2e8f0' }}>Guardia</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#102033', borderBottom: '1px solid #e2e8f0' }}>Ubicación</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((day, dayIdx) => (
                  day.shifts.map((shift, shiftIdx) => (
                    <tr key={`${dayIdx}-${shiftIdx}`} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      {shiftIdx === 0 && (
                        <td rowSpan={day.shifts.length} style={{ padding: '16px', fontWeight: '600', color: '#102033', background: '#f6f9fb', verticalAlign: 'top' }}>
                          {day.day}
                        </td>
                      )}
                      <td style={{ padding: '16px', color: '#475569' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Clock size={16} color="#65758a" /> {shift.time}
                        </span>
                      </td>
                      <td style={{ padding: '16px', color: '#102033', fontWeight: '500' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Users size={16} color="#65758a" /> {shift.guard}
                        </span>
                      </td>
                      <td style={{ padding: '16px', color: '#475569' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <MapPin size={16} color="#65758a" /> {shift.location}
                        </span>
                      </td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Personal Activo */}
      {activeTab === 'personnel' && (
        <div style={{ display: 'grid', gap: '24px' }}>
          {/* Información de la Empresa */}
          <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)', padding: '24px', borderRadius: '16px', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building size={32} color="white" />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Seguridad Integral S.A.S</h2>
                <p style={{ margin: '4px 0 0', opacity: 0.8 }}>NIT: 900.123.456-7</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <span style={{ opacity: 0.7, fontSize: '0.85rem' }}>Dirección</span>
                <p style={{ margin: '4px 0 0', fontWeight: '500' }}>Cra 45 #26-85, Bogotá</p>
              </div>
              <div>
                <span style={{ opacity: 0.7, fontSize: '0.85rem' }}>Teléfono Central</span>
                <p style={{ margin: '4px 0 0', fontWeight: '500' }}>+57 601 555 1234</p>
              </div>
              <div>
                <span style={{ opacity: 0.7, fontSize: '0.85rem' }}>Línea de Emergencia 24h</span>
                <p style={{ margin: '4px 0 0', fontWeight: '500', color: '#fbbf24' }}>+57 310 555 9999</p>
              </div>
            </div>
          </div>

          {/* Supervisores */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #d8e4ec' }}>
            <h3 style={{ margin: '0 0 20px', color: '#102033', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BadgeCheck size={24} color="#1e3a5f" /> Supervisores de Turno
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {[
                { name: 'Roberto Gómez', role: 'Supervisor General', phone: '+57 315 444 1111', shift: 'Diurno (06:00 - 18:00)', photo: '👨‍✈️' },
                { name: 'Patricia Mendoza', role: 'Supervisora Nocturna', phone: '+57 316 444 2222', shift: 'Nocturno (18:00 - 06:00)', photo: '👩‍✈️' }
              ].map((sup, idx) => (
                <div key={idx} style={{ background: '#f6f9fb', padding: '16px', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '50px', height: '50px', background: '#1e3a5f', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    {sup.photo}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 4px', color: '#102033' }}>{sup.name}</h4>
                    <p style={{ margin: '0 0 4px', color: '#65758a', fontSize: '0.85rem' }}>{sup.role}</p>
                    <p style={{ margin: '0 0 4px', color: '#1e3a5f', fontSize: '0.85rem', fontWeight: '600' }}>{sup.shift}</p>
                    <a href={`tel:${sup.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '0.9rem', fontWeight: '600', textDecoration: 'none' }}>
                      <Phone size={14} /> {sup.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Activo en Turno */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #d8e4ec' }}>
            <h3 style={{ margin: '0 0 20px', color: '#102033', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User size={24} color="#059669" /> Personal Activo en Turno Actual
            </h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              {[
                { 
                  name: 'Juan Carlos Pérez', 
                  cedula: '1.023.456.789', 
                  cargo: 'Guardia de Seguridad',
                  turno: '06:00 - 14:00',
                  ubicacion: 'Portería Principal',
                  telefono: '+57 300 111 2222',
                  contactoEmergencia: 'María Pérez (Esposa) - +57 301 222 3333',
                  eps: 'Sanitas EPS',
                  arl: 'Sura ARL',
                  tipoSangre: 'O+',
                  alergias: 'Ninguna conocida',
                  condiciones: 'Ninguna',
                  estado: 'activo'
                },
                { 
                  name: 'Carlos Alberto López', 
                  cedula: '1.098.765.432', 
                  cargo: 'Guardia de Seguridad',
                  turno: '06:00 - 14:00',
                  ubicacion: 'Parqueadero',
                  telefono: '+57 300 333 4444',
                  contactoEmergencia: 'Ana López (Madre) - +57 301 444 5555',
                  eps: 'Nueva EPS',
                  arl: 'Positiva ARL',
                  tipoSangre: 'A+',
                  alergias: 'Penicilina',
                  condiciones: 'Hipertensión controlada',
                  estado: 'activo'
                },
                { 
                  name: 'Ana María García', 
                  cedula: '1.045.678.901', 
                  cargo: 'Guardia de Seguridad',
                  turno: '14:00 - 22:00',
                  ubicacion: 'Portería Principal',
                  telefono: '+57 300 555 6666',
                  contactoEmergencia: 'Pedro García (Hermano) - +57 301 666 7777',
                  eps: 'Compensar EPS',
                  arl: 'Colmena ARL',
                  tipoSangre: 'B+',
                  alergias: 'Ninguna conocida',
                  condiciones: 'Ninguna',
                  estado: 'proximo'
                }
              ].map((person, idx) => (
                <div key={idx} style={{ 
                  background: person.estado === 'activo' ? '#f0fdf4' : '#f6f9fb', 
                  border: person.estado === 'activo' ? '2px solid #86efac' : '1px solid #d8e4ec',
                  padding: '20px', 
                  borderRadius: '16px' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '50px', height: '50px', background: person.estado === 'activo' ? '#059669' : '#94a3b8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={24} color="white" />
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 4px', color: '#102033' }}>{person.name}</h4>
                        <p style={{ margin: 0, color: '#65758a', fontSize: '0.85rem' }}>CC: {person.cedula}</p>
                      </div>
                    </div>
                    <span style={{ 
                      background: person.estado === 'activo' ? '#059669' : '#64748b', 
                      color: 'white', 
                      padding: '6px 14px', 
                      borderRadius: '999px', 
                      fontSize: '0.8rem', 
                      fontWeight: '700' 
                    }}>
                      {person.estado === 'activo' ? '● EN TURNO' : '○ PRÓXIMO TURNO'}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    {/* Datos Generales */}
                    <div>
                      <h5 style={{ margin: '0 0 12px', color: '#1e3a5f', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <BadgeCheck size={16} /> Datos Generales
                      </h5>
                      <div style={{ display: 'grid', gap: '8px', fontSize: '0.85rem' }}>
                        <div><span style={{ color: '#65758a' }}>Cargo:</span> <strong>{person.cargo}</strong></div>
                        <div><span style={{ color: '#65758a' }}>Turno:</span> <strong>{person.turno}</strong></div>
                        <div><span style={{ color: '#65758a' }}>Ubicación:</span> <strong>{person.ubicacion}</strong></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Phone size={14} color="#059669" />
                          <a href={`tel:${person.telefono}`} style={{ color: '#059669', fontWeight: '600', textDecoration: 'none' }}>{person.telefono}</a>
                        </div>
                      </div>
                    </div>

                    {/* Información de Salud */}
                    <div>
                      <h5 style={{ margin: '0 0 12px', color: '#dc2626', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Stethoscope size={16} /> Información de Salud
                      </h5>
                      <div style={{ display: 'grid', gap: '8px', fontSize: '0.85rem' }}>
                        <div><span style={{ color: '#65758a' }}>EPS:</span> <strong>{person.eps}</strong></div>
                        <div><span style={{ color: '#65758a' }}>ARL:</span> <strong>{person.arl}</strong></div>
                        <div><span style={{ color: '#65758a' }}>Tipo Sangre:</span> <strong style={{ color: '#dc2626' }}>{person.tipoSangre}</strong></div>
                        <div><span style={{ color: '#65758a' }}>Alergias:</span> <strong>{person.alergias}</strong></div>
                        {person.condiciones !== 'Ninguna' && (
                          <div style={{ background: '#fef3c7', padding: '6px 10px', borderRadius: '6px', color: '#92400e' }}>
                            <strong>⚠️ {person.condiciones}</strong>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contacto de Emergencia */}
                    <div>
                      <h5 style={{ margin: '0 0 12px', color: '#f59e0b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Heart size={16} /> Contacto de Emergencia
                      </h5>
                      <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '10px' }}>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#92400e', fontWeight: '500' }}>{person.contactoEmergencia}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contactos de Emergencia Generales */}
          <div style={{ background: '#fee2e2', padding: '24px', borderRadius: '16px', border: '1px solid #fca5a5' }}>
            <h3 style={{ margin: '0 0 16px', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={24} /> Números de Emergencia
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              {[
                { name: 'Policía', number: '123', icon: '🚔' },
                { name: 'Bomberos', number: '119', icon: '🚒' },
                { name: 'Ambulancia', number: '125', icon: '🚑' },
                { name: 'Defensa Civil', number: '144', icon: '⛑️' },
                { name: 'CAI Cercano', number: '+57 601 555 0000', icon: '👮' },
                { name: 'Admin. Conjunto', number: '+57 601 555 1111', icon: '🏢' }
              ].map((emergency, idx) => (
                <a key={idx} href={`tel:${emergency.number}`} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  background: 'white', 
                  padding: '12px 16px', 
                  borderRadius: '10px', 
                  textDecoration: 'none',
                  border: '1px solid #fca5a5'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>{emergency.icon}</span>
                  <div>
                    <p style={{ margin: 0, color: '#991b1b', fontWeight: '600', fontSize: '0.9rem' }}>{emergency.name}</p>
                    <p style={{ margin: 0, color: '#dc2626', fontWeight: '700' }}>{emergency.number}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Estadísticas */}
      {activeTab === 'stats' && (
        <div style={{ display: 'grid', gap: '24px' }}>
          {/* Resumen */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #d8e4ec', textAlign: 'center' }}>
              <FileText size={24} color="#2563eb" style={{ marginBottom: '8px' }} />
              <p style={{ margin: '0 0 4px', fontSize: '2rem', fontWeight: '700', color: '#102033' }}>{stats.minutas}</p>
              <span style={{ color: '#65758a', fontSize: '0.85rem' }}>Minutas</span>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #d8e4ec', textAlign: 'center' }}>
              <Bell size={24} color="#7c3aed" style={{ marginBottom: '8px' }} />
              <p style={{ margin: '0 0 4px', fontSize: '2rem', fontWeight: '700', color: '#102033' }}>{stats.reportes}</p>
              <span style={{ color: '#65758a', fontSize: '0.85rem' }}>Reportes</span>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #d8e4ec', textAlign: 'center' }}>
              <AlertTriangle size={24} color="#dc2626" style={{ marginBottom: '8px' }} />
              <p style={{ margin: '0 0 4px', fontSize: '2rem', fontWeight: '700', color: '#102033' }}>{stats.casos}</p>
              <span style={{ color: '#65758a', fontSize: '0.85rem' }}>Casos</span>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #d8e4ec', textAlign: 'center' }}>
              <Calendar size={24} color="#059669" style={{ marginBottom: '8px' }} />
              <p style={{ margin: '0 0 4px', fontSize: '2rem', fontWeight: '700', color: '#102033' }}>{stats.eventos}</p>
              <span style={{ color: '#65758a', fontSize: '0.85rem' }}>Eventos</span>
            </div>
          </div>

          {/* Gráfica de barras */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #d8e4ec' }}>
            <h3 style={{ margin: '0 0 20px', color: '#102033' }}>Distribución por Tipo</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', height: '200px' }}>
              {[
                { label: 'Minutas', value: stats.minutas, color: '#2563eb' },
                { label: 'Reportes', value: stats.reportes, color: '#7c3aed' },
                { label: 'Casos', value: stats.casos, color: '#dc2626' },
                { label: 'Eventos', value: stats.eventos, color: '#059669' }
              ].map((item, idx) => (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '100%', 
                    maxWidth: '60px',
                    height: `${(item.value / stats.total) * 150 + 30}px`,
                    background: `linear-gradient(180deg, ${item.color} 0%, ${item.color}99 100%)`,
                    borderRadius: '10px 10px 0 0',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    paddingTop: '10px'
                  }}>
                    <span style={{ color: 'white', fontWeight: '700', fontSize: '1.2rem' }}>{item.value}</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#65758a', fontWeight: '600' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alertas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#fef3c7', padding: '20px', borderRadius: '16px', border: '1px solid #fcd34d' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <AlertTriangle size={24} color="#d97706" />
                <span style={{ fontWeight: '600', color: '#92400e' }}>Casos Abiertos</span>
              </div>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: '#92400e' }}>{stats.open}</p>
            </div>
            <div style={{ background: '#fee2e2', padding: '20px', borderRadius: '16px', border: '1px solid #fca5a5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Bell size={24} color="#dc2626" />
                <span style={{ fontWeight: '600', color: '#991b1b' }}>Alta Prioridad</span>
              </div>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: '#991b1b' }}>{stats.highPriority}</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, color: '#102033' }}>{viewMode ? 'Ver Registro' : (selectedReport ? 'Editar Registro' : 'Nuevo Registro')}</h2>
              <button onClick={resetForm} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px' }}><X size={24} color="#65758a" /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Tipo *</label>
                    <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} disabled={viewMode} style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', boxSizing: 'border-box' }}>
                      <option value="minuta">Minuta</option>
                      <option value="reporte">Reporte</option>
                      <option value="caso">Caso</option>
                      <option value="evento">Evento</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Prioridad</label>
                    <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} disabled={viewMode} style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', boxSizing: 'border-box' }}>
                      <option value="low">Baja</option>
                      <option value="normal">Normal</option>
                      <option value="high">Alta</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Título *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} disabled={viewMode} required style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Fecha *</label>
                    <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} disabled={viewMode} required style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Hora *</label>
                    <input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} disabled={viewMode} required style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Estado</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} disabled={viewMode} style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', boxSizing: 'border-box' }}>
                      <option value="open">Abierto</option>
                      <option value="closed">Cerrado</option>
                      <option value="scheduled">Programado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Ubicación *</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} disabled={viewMode} required style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Descripción *</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} disabled={viewMode} required rows={3} style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Personas Involucradas</label>
                  <input type="text" value={formData.involvedPersons} onChange={(e) => setFormData({...formData, involvedPersons: e.target.value})} disabled={viewMode} style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Acciones Tomadas</label>
                  <textarea value={formData.actions} onChange={(e) => setFormData({...formData, actions: e.target.value})} disabled={viewMode} rows={2} style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
              </div>

              {!viewMode && (
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                  <button type="button" onClick={resetForm} style={{ padding: '12px 24px', border: '1px solid #d8e4ec', borderRadius: '12px', background: 'white', cursor: 'pointer', fontWeight: '600' }}>Cancelar</button>
                  <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', border: 'none', borderRadius: '12px', background: '#1e3a5f', color: 'white', cursor: 'pointer', fontWeight: '600' }}>
                    <Save size={18} /> {selectedReport ? 'Guardar' : 'Crear'}
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
