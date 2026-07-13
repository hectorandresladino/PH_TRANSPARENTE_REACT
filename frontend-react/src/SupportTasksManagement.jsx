import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, CheckCircle, Clock, AlertCircle, Calendar, User, Building, FileText, Trash2, Edit2 } from 'lucide-react';
import './styles.css';

import { API_URL } from './api.js';

export default function SupportTasksManagement() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [categoryFilter, setCategoryFilter] = useState('TODOS');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'MANTENIMIENTO',
    priority: 'MEDIA',
    status: 'PENDIENTE',
    assignedTo: '',
    dueDate: '',
    propertyUnit: '',
    notes: ''
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchQuery, statusFilter, categoryFilter]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/support-tasks`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const filterTasks = () => {
    let filtered = tasks;

    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'TODOS') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (categoryFilter !== 'TODOS') {
      filtered = filtered.filter(task => task.category === categoryFilter);
    }

    setFilteredTasks(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingTask 
        ? `${API_URL}/support-tasks/${editingTask.id}`
        : `${API_URL}/support-tasks`;
      
      const method = editingTask ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          createdBy: editingTask ? editingTask.createdBy : 'admin',
          createdAt: editingTask ? editingTask.createdAt : null
        })
      });

      if (response.ok) {
        fetchTasks();
        setShowModal(false);
        setEditingTask(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      category: task.category,
      priority: task.priority,
      status: task.status,
      assignedTo: task.assignedTo,
      dueDate: task.dueDate,
      propertyUnit: task.propertyUnit || '',
      notes: task.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta tarea?')) {
      try {
        const response = await fetch(`${API_URL}/support-tasks/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchTasks();
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'MANTENIMIENTO',
      priority: 'MEDIA',
      status: 'PENDIENTE',
      assignedTo: '',
      dueDate: '',
      propertyUnit: '',
      notes: ''
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETADA': return <CheckCircle size={20} className="status-completed" />;
      case 'EN_PROGRESO': return <Clock size={20} className="status-in-progress" />;
      case 'PENDIENTE': return <AlertCircle size={20} className="status-pending" />;
      default: return <AlertCircle size={20} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'ALTA': return '#dc2626';
      case 'MEDIA': return '#f59e0b';
      case 'BAJA': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="support-tasks-container">
      <div className="support-tasks-header">
        <h1>Soporte y Tareas</h1>
        <p>Gestión de tareas de mantenimiento y soporte administrativo</p>
      </div>

      <div className="support-tasks-filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar tareas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <Filter size={20} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="TODOS">Todos los estados</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="EN_PROGRESO">En Progreso</option>
            <option value="COMPLETADA">Completadas</option>
          </select>
        </div>

        <div className="filter-group">
          <Filter size={20} />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="TODOS">Todas las categorías</option>
            <option value="MANTENIMIENTO">Mantenimiento</option>
            <option value="SEGURIDAD">Seguridad</option>
            <option value="LIMPIEZA">Limpieza</option>
            <option value="ADMINISTRACION">Administración</option>
            <option value="OTRO">Otro</option>
          </select>
        </div>

        <button className="add-task-btn" onClick={() => { resetForm(); setEditingTask(null); setShowModal(true); }}>
          <Plus size={20} />
          <span>Nueva Tarea</span>
        </button>
      </div>

      <div className="tasks-grid">
        {filteredTasks.map(task => (
          <div key={task.id} className="task-card">
            <div className="task-header">
              <div className="task-status">
                {getStatusIcon(task.status)}
                <span>{task.status.replace('_', ' ')}</span>
              </div>
              <div className="task-priority" style={{ color: getPriorityColor(task.priority) }}>
                {task.priority}
              </div>
            </div>

            <h3>{task.title}</h3>
            <p className="task-description">{task.description}</p>

            <div className="task-details">
              <div className="task-detail">
                <User size={16} />
                <span>Asignado a: {task.assignedTo}</span>
              </div>
              {task.propertyUnit && (
                <div className="task-detail">
                  <Building size={16} />
                  <span>Unidad: {task.propertyUnit}</span>
                </div>
              )}
              <div className="task-detail">
                <Calendar size={16} />
                <span>Vence: {task.dueDate}</span>
              </div>
            </div>

            <div className="task-actions">
              <button className="task-action-btn edit" onClick={() => handleEdit(task)}>
                <Edit2 size={16} />
              </button>
              <button className="task-action-btn delete" onClick={() => handleDelete(task.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingTask ? 'Editar Tarea' : 'Nueva Tarea'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>í—</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Título</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="MANTENIMIENTO">Mantenimiento</option>
                    <option value="SEGURIDAD">Seguridad</option>
                    <option value="LIMPIEZA">Limpieza</option>
                    <option value="ADMINISTRACION">Administración</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Prioridad</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="ALTA">Alta</option>
                    <option value="MEDIA">Media</option>
                    <option value="BAJA">Baja</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="EN_PROGRESO">En Progreso</option>
                    <option value="COMPLETADA">Completada</option>
                    <option value="CANCELADA">Cancelada</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Asignado a</label>
                  <input
                    type="text"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha de vencimiento</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Unidad de propiedad</label>
                  <input
                    type="text"
                    value={formData.propertyUnit}
                    onChange={(e) => setFormData({...formData, propertyUnit: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notas</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={2}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="submit-btn">
                  {editingTask ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
