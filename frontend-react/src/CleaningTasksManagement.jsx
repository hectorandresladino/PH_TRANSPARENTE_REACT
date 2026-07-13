import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Plus, Search, Filter, Calendar, Clock, 
  CheckCircle, Eye, Edit, Trash2, X, Save,
  MapPin, ChevronLeft, Activity, AlertCircle, User,
  Phone, Heart, Building, BadgeCheck, Stethoscope, Users
} from 'lucide-react';

export default function CleaningTasksManagement({ userRole = 'aseo', onBack }) {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks'); // tasks, schedule, stats, personnel

  const canCreate = ['admin', 'Administrador', 'aseo', 'Empresa de Aseo'].includes(userRole);

  const [formData, setFormData] = useState({
    title: '',
    area: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '10:00',
    assignedTo: '',
    description: '',
    materials: '',
    frequency: 'daily',
    status: 'pending',
    observations: ''
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    setTasks([
      {
        id: 1,
        title: 'Limpieza de Lobby Principal',
        area: 'Lobby Torre A',
        date: '2026-06-26',
        startTime: '06:00',
        endTime: '08:00',
        assignedTo: 'María López',
        description: 'Limpieza completa del lobby: pisos, vidrios, mobiliario',
        materials: 'Trapeador, desinfectante, limpiavidrios',
        frequency: 'daily',
        status: 'completed',
        timeSpent: 115,
        observations: 'Se realizó limpieza profunda de alfombras'
      },
      {
        id: 2,
        title: 'Aseo de Parqueadero',
        area: 'Parqueadero Sótano 1',
        date: '2026-06-26',
        startTime: '08:00',
        endTime: '11:00',
        assignedTo: 'Carlos Ruiz',
        description: 'Barrido y lavado de parqueadero',
        materials: 'Escoba industrial, hidrolavadora',
        frequency: 'weekly',
        status: 'in_progress',
        timeSpent: 90,
        observations: ''
      },
      {
        id: 3,
        title: 'Limpieza de Áreas Comunes Torre B',
        area: 'Pasillos Torre B',
        date: '2026-06-26',
        startTime: '09:00',
        endTime: '12:00',
        assignedTo: 'Ana García',
        description: 'Limpieza de pasillos pisos 1-10',
        materials: 'Aspiradora, trapeador, desinfectante',
        frequency: 'daily',
        status: 'pending',
        timeSpent: 0,
        observations: ''
      },
      {
        id: 4,
        title: 'Mantenimiento Zona BBQ',
        area: 'Terraza Zona Social',
        date: '2026-06-27',
        startTime: '14:00',
        endTime: '17:00',
        assignedTo: 'María López',
        description: 'Limpieza profunda de zona BBQ y mobiliario exterior',
        materials: 'Desengrasante, cepillos, hidrolavadora',
        frequency: 'weekly',
        status: 'scheduled',
        timeSpent: 0,
        observations: 'Programado después de evento del fin de semana'
      },
      {
        id: 5,
        title: 'Limpieza de Gimnasio',
        area: 'Gimnasio',
        date: '2026-06-26',
        startTime: '05:00',
        endTime: '06:30',
        assignedTo: 'Carlos Ruiz',
        description: 'Desinfección de equipos y limpieza de pisos',
        materials: 'Desinfectante, paños microfibra, trapeador',
        frequency: 'daily',
        status: 'completed',
        timeSpent: 85,
        observations: 'Se reportó daño en espejo lateral'
      }
    ]);
  };

  // Cronograma semanal
  const schedule = [
    { day: 'Lunes', tasks: [
      { time: '06:00 - 08:00', task: 'Lobby y recepción', assignee: 'María López' },
      { time: '08:00 - 12:00', task: 'Pasillos Torre A', assignee: 'Carlos Ruiz' },
      { time: '14:00 - 17:00', task: 'Áreas comunes', assignee: 'Ana García' }
    ]},
    { day: 'Martes', tasks: [
      { time: '06:00 - 08:00', task: 'Lobby y recepción', assignee: 'Carlos Ruiz' },
      { time: '08:00 - 12:00', task: 'Pasillos Torre B', assignee: 'Ana García' },
      { time: '14:00 - 17:00', task: 'Parqueadero', assignee: 'María López' }
    ]},
    { day: 'Miércoles', tasks: [
      { time: '06:00 - 08:00', task: 'Lobby y recepción', assignee: 'Ana García' },
      { time: '08:00 - 12:00', task: 'Gimnasio y piscina', assignee: 'María López' },
      { time: '14:00 - 17:00', task: 'Zonas verdes', assignee: 'Carlos Ruiz' }
    ]},
    { day: 'Jueves', tasks: [
      { time: '06:00 - 08:00', task: 'Lobby y recepción', assignee: 'María López' },
      { time: '08:00 - 12:00', task: 'Pasillos Torre A', assignee: 'Carlos Ruiz' },
      { time: '14:00 - 17:00', task: 'Salón comunal', assignee: 'Ana García' }
    ]},
    { day: 'Viernes', tasks: [
      { time: '06:00 - 08:00', task: 'Lobby y recepción', assignee: 'Carlos Ruiz' },
      { time: '08:00 - 12:00', task: 'Pasillos Torre B', assignee: 'Ana García' },
      { time: '14:00 - 17:00', task: 'Limpieza profunda oficinas', assignee: 'María López' }
    ]},
    { day: 'Sábado', tasks: [
      { time: '06:00 - 10:00', task: 'Áreas comunes generales', assignee: 'María López' },
      { time: '10:00 - 14:00', task: 'Zona BBQ y terraza', assignee: 'Carlos Ruiz' }
    ]},
    { day: 'Domingo', tasks: [
      { time: '07:00 - 11:00', task: 'Mantenimiento básico', assignee: 'Ana García' }
    ]}
  ];

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedTask) {
      setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, ...formData } : t));
    } else {
      setTasks(prev => [{ id: Date.now(), ...formData, timeSpent: 0 }, ...prev]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      area: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '08:00',
      endTime: '10:00',
      assignedTo: '',
      description: '',
      materials: '',
      frequency: 'daily',
      status: 'pending',
      observations: ''
    });
    setSelectedTask(null);
    setShowModal(false);
    setViewMode(false);
  };

  const handleView = (task) => {
    setSelectedTask(task);
    setFormData({ ...task });
    setViewMode(true);
    setShowModal(true);
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setFormData({ ...task });
    setViewMode(false);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('¿Eliminar esta tarea?')) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const timeSpent = newStatus === 'completed' ? 
          Math.floor(Math.random() * 60) + 60 : t.timeSpent;
        return { ...t, status: newStatus, timeSpent };
      }
      return t;
    }));
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const statuses = {
      pending: { label: 'Pendiente', color: '#f59e0b', bg: '#fef3c7' },
      in_progress: { label: 'En Progreso', color: '#2563eb', bg: '#dbeafe' },
      completed: { label: 'Completada', color: '#059669', bg: '#d1fae5' },
      scheduled: { label: 'Programada', color: '#7c3aed', bg: '#ede9fe' }
    };
    const s = statuses[status] || statuses.pending;
    return <span style={{ background: s.bg, color: s.color, padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700' }}>{s.label}</span>;
  };

  const getFrequencyBadge = (frequency) => {
    const frequencies = {
      daily: { label: 'Diaria', color: '#2563eb' },
      weekly: { label: 'Semanal', color: '#7c3aed' },
      monthly: { label: 'Mensual', color: '#059669' },
      once: { label: 'Única', color: '#f59e0b' }
    };
    const f = frequencies[frequency] || frequencies.daily;
    return <span style={{ color: f.color, fontWeight: '600', fontSize: '0.8rem' }}>● {f.label}</span>;
  };

  // Estadísticas
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    totalTime: tasks.reduce((sum, t) => sum + (t.timeSpent || 0), 0),
    avgTime: Math.round(tasks.filter(t => t.timeSpent > 0).reduce((sum, t) => sum + t.timeSpent, 0) / 
             (tasks.filter(t => t.timeSpent > 0).length || 1))
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
          <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={24} color="white" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#102033' }}>Control de Aseo</h1>
            <p style={{ margin: 0, color: '#65758a', fontSize: '0.9rem' }}>Tareas, Cronograma y Estadísticas</p>
          </div>
        </div>
        {canCreate && (
          <button onClick={() => { resetForm(); setShowModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#06b6d4', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}>
            <Plus size={20} /> Nueva Tarea
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
        {[
          { id: 'tasks', label: 'Tareas', icon: <CheckCircle size={18} /> },
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
              background: activeTab === tab.id ? '#06b6d4' : 'transparent',
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

      {/* Tab: Tareas */}
      {activeTab === 'tasks' && (
        <>
          {/* Filters */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #d8e4ec', borderRadius: '12px', padding: '0 16px', flex: '1', minWidth: '200px' }}>
              <Search size={20} color="#65758a" />
              <input type="text" placeholder="Buscar tareas..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ border: 'none', padding: '12px 0', flex: '1', outline: 'none', background: 'transparent' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #d8e4ec', borderRadius: '12px', padding: '0 16px' }}>
              <Filter size={20} color="#65758a" />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ border: 'none', padding: '12px 0', outline: 'none', background: 'transparent', cursor: 'pointer' }}>
                <option value="all">Todos</option>
                <option value="pending">Pendientes</option>
                <option value="in_progress">En Progreso</option>
                <option value="completed">Completadas</option>
                <option value="scheduled">Programadas</option>
              </select>
            </div>
          </div>

          {/* Tasks List */}
          <div style={{ display: 'grid', gap: '16px' }}>
            {filteredTasks.map(task => (
              <div key={task.id} style={{ background: 'white', border: '1px solid #d8e4ec', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(16,32,51,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      {getStatusBadge(task.status)}
                      {getFrequencyBadge(task.frequency)}
                    </div>
                    <h3 style={{ margin: '0 0 8px', color: '#102033', fontSize: '1.1rem' }}>{task.title}</h3>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.85rem', color: '#65758a' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {task.area}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {task.date}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {task.startTime} - {task.endTime}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={14} /> {task.assignedTo}</span>
                    </div>
                  </div>
                  {task.timeSpent > 0 && (
                    <div style={{ background: '#f0fdf4', padding: '8px 12px', borderRadius: '10px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#059669' }}>Tiempo</span>
                      <p style={{ margin: '2px 0 0', fontWeight: '700', color: '#059669' }}>{formatTime(task.timeSpent)}</p>
                    </div>
                  )}
                </div>
                
                <p style={{ margin: '0 0 12px', color: '#536477', fontSize: '0.9rem' }}>{task.description}</p>
                
                {task.materials && (
                  <p style={{ margin: '0 0 16px', color: '#65758a', fontSize: '0.85rem' }}>
                    <strong>Materiales:</strong> {task.materials}
                  </p>
                )}

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center' }}>
                  {/* Quick status change */}
                  {canCreate && task.status !== 'completed' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {task.status === 'pending' && (
                        <button onClick={() => handleStatusChange(task.id, 'in_progress')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#dbeafe', color: '#2563eb', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>
                          Iniciar
                        </button>
                      )}
                      {task.status === 'in_progress' && (
                        <button onClick={() => handleStatusChange(task.id, 'completed')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#d1fae5', color: '#059669', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>
                          <CheckCircle size={16} /> Completar
                        </button>
                      )}
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                    <button onClick={() => handleView(task)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#dbeafe', color: '#2563eb', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}><Eye size={16} /> Ver</button>
                    {canCreate && (
                      <>
                        <button onClick={() => handleEdit(task)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fef3c7', color: '#d97706', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}><Edit size={16} /> Editar</button>
                        <button onClick={() => handleDelete(task.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fee2e2', color: '#dc2626', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}><Trash2 size={16} /></button>
                      </>
                    )}
                  </div>
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
            <h3 style={{ margin: 0, color: '#102033' }}>Cronograma Semanal de Limpieza</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead>
                <tr style={{ background: '#f6f9fb' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#102033', borderBottom: '1px solid #e2e8f0' }}>Día</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#102033', borderBottom: '1px solid #e2e8f0' }}>Horario</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#102033', borderBottom: '1px solid #e2e8f0' }}>Tarea</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#102033', borderBottom: '1px solid #e2e8f0' }}>Asignado</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((day, dayIdx) => (
                  day.tasks.map((task, taskIdx) => (
                    <tr key={`${dayIdx}-${taskIdx}`} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      {taskIdx === 0 && (
                        <td rowSpan={day.tasks.length} style={{ padding: '16px', fontWeight: '600', color: '#102033', background: '#f6f9fb', verticalAlign: 'top' }}>
                          {day.day}
                        </td>
                      )}
                      <td style={{ padding: '16px', color: '#475569' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Clock size={16} color="#65758a" /> {task.time}
                        </span>
                      </td>
                      <td style={{ padding: '16px', color: '#102033', fontWeight: '500' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Sparkles size={16} color="#06b6d4" /> {task.task}
                        </span>
                      </td>
                      <td style={{ padding: '16px', color: '#475569' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <User size={16} color="#65758a" /> {task.assignee}
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
          <div style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', padding: '24px', borderRadius: '16px', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building size={32} color="white" />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Limpieza Total S.A.S</h2>
                <p style={{ margin: '4px 0 0', opacity: 0.8 }}>NIT: 900.987.654-3</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <span style={{ opacity: 0.7, fontSize: '0.85rem' }}>Dirección</span>
                <p style={{ margin: '4px 0 0', fontWeight: '500' }}>Calle 100 #15-20, Bogotá</p>
              </div>
              <div>
                <span style={{ opacity: 0.7, fontSize: '0.85rem' }}>Teléfono Central</span>
                <p style={{ margin: '4px 0 0', fontWeight: '500' }}>+57 601 666 7890</p>
              </div>
              <div>
                <span style={{ opacity: 0.7, fontSize: '0.85rem' }}>WhatsApp Coordinación</span>
                <p style={{ margin: '4px 0 0', fontWeight: '500', color: '#a5f3fc' }}>+57 320 666 8888</p>
              </div>
            </div>
          </div>

          {/* Supervisores */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #d8e4ec' }}>
            <h3 style={{ margin: '0 0 20px', color: '#102033', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BadgeCheck size={24} color="#06b6d4" /> Supervisores de Aseo
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {[
                { name: 'Laura Rodríguez', role: 'Coordinadora General', phone: '+57 318 777 1111', shift: 'Lunes a Viernes (06:00 - 14:00)', photo: '👩‍💼' },
                { name: 'Miguel Ángel Torres', role: 'Supervisor de Turno', phone: '+57 319 777 2222', shift: 'Lunes a Sábado (14:00 - 22:00)', photo: '👨‍💼' }
              ].map((sup, idx) => (
                <div key={idx} style={{ background: '#f6f9fb', padding: '16px', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '50px', height: '50px', background: '#06b6d4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    {sup.photo}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 4px', color: '#102033' }}>{sup.name}</h4>
                    <p style={{ margin: '0 0 4px', color: '#65758a', fontSize: '0.85rem' }}>{sup.role}</p>
                    <p style={{ margin: '0 0 4px', color: '#0891b2', fontSize: '0.85rem', fontWeight: '600' }}>{sup.shift}</p>
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
                  name: 'María Elena López', 
                  cedula: '52.345.678', 
                  cargo: 'Auxiliar de Aseo',
                  turno: '06:00 - 14:00',
                  area: 'Torre A - Pisos 1-5',
                  telefono: '+57 311 888 1111',
                  contactoEmergencia: 'José López (Esposo) - +57 312 888 2222',
                  eps: 'Famisanar EPS',
                  arl: 'Positiva ARL',
                  tipoSangre: 'A+',
                  alergias: 'Ninguna conocida',
                  condiciones: 'Ninguna',
                  estado: 'activo'
                },
                { 
                  name: 'Carmen Rosa Díaz', 
                  cedula: '51.234.567', 
                  cargo: 'Auxiliar de Aseo',
                  turno: '06:00 - 14:00',
                  area: 'Torre B - Pisos 1-5',
                  telefono: '+57 311 888 3333',
                  contactoEmergencia: 'Luis Díaz (Hijo) - +57 312 888 4444',
                  eps: 'Salud Total EPS',
                  arl: 'Sura ARL',
                  tipoSangre: 'O+',
                  alergias: 'Cloro concentrado',
                  condiciones: 'Diabetes controlada',
                  estado: 'activo'
                },
                { 
                  name: 'Pedro Antonio Ruiz', 
                  cedula: '79.876.543', 
                  cargo: 'Auxiliar de Aseo',
                  turno: '06:00 - 14:00',
                  area: 'Áreas Comunes y Parqueadero',
                  telefono: '+57 311 888 5555',
                  contactoEmergencia: 'Rosa Ruiz (Madre) - +57 312 888 6666',
                  eps: 'Compensar EPS',
                  arl: 'Colmena ARL',
                  tipoSangre: 'B-',
                  alergias: 'Ninguna conocida',
                  condiciones: 'Ninguna',
                  estado: 'activo'
                },
                { 
                  name: 'Sandra Milena Gómez', 
                  cedula: '52.987.654', 
                  cargo: 'Auxiliar de Aseo',
                  turno: '14:00 - 22:00',
                  area: 'Torre A - Pisos 6-10',
                  telefono: '+57 311 888 7777',
                  contactoEmergencia: 'Carlos Gómez (Hermano) - +57 312 888 8888',
                  eps: 'Nueva EPS',
                  arl: 'Positiva ARL',
                  tipoSangre: 'AB+',
                  alergias: 'Ninguna conocida',
                  condiciones: 'Ninguna',
                  estado: 'proximo'
                }
              ].map((person, idx) => (
                <div key={idx} style={{ 
                  background: person.estado === 'activo' ? '#ecfeff' : '#f6f9fb', 
                  border: person.estado === 'activo' ? '2px solid #67e8f9' : '1px solid #d8e4ec',
                  padding: '20px', 
                  borderRadius: '16px' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '50px', height: '50px', background: person.estado === 'activo' ? '#06b6d4' : '#94a3b8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={24} color="white" />
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 4px', color: '#102033' }}>{person.name}</h4>
                        <p style={{ margin: 0, color: '#65758a', fontSize: '0.85rem' }}>CC: {person.cedula}</p>
                      </div>
                    </div>
                    <span style={{ 
                      background: person.estado === 'activo' ? '#06b6d4' : '#64748b', 
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
                      <h5 style={{ margin: '0 0 12px', color: '#0891b2', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <BadgeCheck size={16} /> Datos Generales
                      </h5>
                      <div style={{ display: 'grid', gap: '8px', fontSize: '0.85rem' }}>
                        <div><span style={{ color: '#65758a' }}>Cargo:</span> <strong>{person.cargo}</strong></div>
                        <div><span style={{ color: '#65758a' }}>Turno:</span> <strong>{person.turno}</strong></div>
                        <div><span style={{ color: '#65758a' }}>Área:</span> <strong>{person.area}</strong></div>
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
              <AlertCircle size={24} /> Números de Emergencia
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              {[
                { name: 'Ambulancia', number: '125', icon: '🚑' },
                { name: 'Bomberos', number: '119', icon: '🚒' },
                { name: 'Línea de Intoxicaciones', number: '018000 916012', icon: '☠️' },
                { name: 'Coordinadora', number: '+57 318 777 1111', icon: '👩‍💼' },
                { name: 'Supervisor', number: '+57 319 777 2222', icon: '👨‍💼' },
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
              <CheckCircle size={24} color="#059669" style={{ marginBottom: '8px' }} />
              <p style={{ margin: '0 0 4px', fontSize: '2rem', fontWeight: '700', color: '#102033' }}>{stats.completed}</p>
              <span style={{ color: '#65758a', fontSize: '0.85rem' }}>Completadas</span>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #d8e4ec', textAlign: 'center' }}>
              <AlertCircle size={24} color="#f59e0b" style={{ marginBottom: '8px' }} />
              <p style={{ margin: '0 0 4px', fontSize: '2rem', fontWeight: '700', color: '#102033' }}>{stats.pending}</p>
              <span style={{ color: '#65758a', fontSize: '0.85rem' }}>Pendientes</span>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #d8e4ec', textAlign: 'center' }}>
              <Activity size={24} color="#2563eb" style={{ marginBottom: '8px' }} />
              <p style={{ margin: '0 0 4px', fontSize: '2rem', fontWeight: '700', color: '#102033' }}>{stats.inProgress}</p>
              <span style={{ color: '#65758a', fontSize: '0.85rem' }}>En Progreso</span>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #d8e4ec', textAlign: 'center' }}>
              <Clock size={24} color="#7c3aed" style={{ marginBottom: '8px' }} />
              <p style={{ margin: '0 0 4px', fontSize: '2rem', fontWeight: '700', color: '#102033' }}>{formatTime(stats.totalTime)}</p>
              <span style={{ color: '#65758a', fontSize: '0.85rem' }}>Tiempo Total</span>
            </div>
          </div>

          {/* Gráfica */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #d8e4ec' }}>
            <h3 style={{ margin: '0 0 20px', color: '#102033' }}>Distribución de Tareas</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', height: '200px' }}>
              {[
                { label: 'Completadas', value: stats.completed, color: '#059669' },
                { label: 'Pendientes', value: stats.pending, color: '#f59e0b' },
                { label: 'En Progreso', value: stats.inProgress, color: '#2563eb' }
              ].map((item, idx) => (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '100%', 
                    maxWidth: '80px',
                    height: `${(item.value / stats.total) * 150 + 30}px`,
                    background: `linear-gradient(180deg, ${item.color} 0%, ${item.color}99 100%)`,
                    borderRadius: '12px 12px 0 0',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    paddingTop: '12px'
                  }}>
                    <span style={{ color: 'white', fontWeight: '700', fontSize: '1.3rem' }}>{item.value}</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#65758a', fontWeight: '600' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tiempo promedio */}
          <div style={{ background: '#ecfeff', padding: '24px', borderRadius: '16px', border: '1px solid #a5f3fc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '60px', height: '60px', background: '#06b6d4', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={28} color="white" />
              </div>
              <div>
                <p style={{ margin: '0 0 4px', color: '#0e7490', fontSize: '0.9rem' }}>Tiempo Promedio por Tarea</p>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: '#0e7490' }}>{formatTime(stats.avgTime)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, color: '#102033' }}>{viewMode ? 'Ver Tarea' : (selectedTask ? 'Editar Tarea' : 'Nueva Tarea')}</h2>
              <button onClick={resetForm} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px' }}><X size={24} color="#65758a" /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Título *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} disabled={viewMode} required style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Área *</label>
                    <input type="text" value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})} disabled={viewMode} required style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Asignado a *</label>
                    <input type="text" value={formData.assignedTo} onChange={(e) => setFormData({...formData, assignedTo: e.target.value})} disabled={viewMode} required style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Fecha *</label>
                    <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} disabled={viewMode} required style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Hora Inicio</label>
                    <input type="time" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} disabled={viewMode} style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Hora Fin</label>
                    <input type="time" value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} disabled={viewMode} style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Frecuencia</label>
                    <select value={formData.frequency} onChange={(e) => setFormData({...formData, frequency: e.target.value})} disabled={viewMode} style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', boxSizing: 'border-box' }}>
                      <option value="daily">Diaria</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensual</option>
                      <option value="once">Única</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Estado</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} disabled={viewMode} style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', boxSizing: 'border-box' }}>
                      <option value="pending">Pendiente</option>
                      <option value="in_progress">En Progreso</option>
                      <option value="completed">Completada</option>
                      <option value="scheduled">Programada</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Descripción</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} disabled={viewMode} rows={3} style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Materiales Necesarios</label>
                  <input type="text" value={formData.materials} onChange={(e) => setFormData({...formData, materials: e.target.value})} disabled={viewMode} style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#102033' }}>Observaciones</label>
                  <textarea value={formData.observations} onChange={(e) => setFormData({...formData, observations: e.target.value})} disabled={viewMode} rows={2} style={{ width: '100%', padding: '12px', border: '1px solid #d8e4ec', borderRadius: '12px', fontSize: '0.95rem', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
              </div>

              {!viewMode && (
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                  <button type="button" onClick={resetForm} style={{ padding: '12px 24px', border: '1px solid #d8e4ec', borderRadius: '12px', background: 'white', cursor: 'pointer', fontWeight: '600' }}>Cancelar</button>
                  <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', border: 'none', borderRadius: '12px', background: '#06b6d4', color: 'white', cursor: 'pointer', fontWeight: '600' }}>
                    <Save size={18} /> {selectedTask ? 'Guardar' : 'Crear'}
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
