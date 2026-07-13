import React, { useState, useEffect } from 'react';
import { Shield, Search, Plus, Edit, Trash2, Filter, Calendar, User, Key, Lock, Unlock, CheckCircle, XCircle } from 'lucide-react';

import { API_URL } from './api.js';

const MODULES = [
  'dashboard', 'users', 'pqr', 'payments', 'reservations', 'visitors', 
  'contracts', 'fines', 'documents', 'assemblies', 'votes', 'councils', 
  'security', 'contractors', 'property-units', 'reserve-funds', 
  'annual-budgets', 'insurance-policies', 'bank-accounts', 
  'official-minutes', 'horizontal-property-regulations', 'alerts', 'transparency'
];

const PERMISSION_TYPES = ['LECTURA', 'ESCRITURA', 'ADMINISTRACION'];

export default function ModuleAuthorizationsManagement() {
  const [authorizations, setAuthorizations] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPermission, setFilterPermission] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingAuth, setEditingAuth] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    moduleName: '',
    permissionType: 'LECTURA',
    expiryDate: '',
    status: 'ACTIVO',
    authorizationReason: '',
    isPermanent: false
  });

  useEffect(() => {
    fetchAuthorizations();
    fetchUsers();
  }, []);

  const fetchAuthorizations = async () => {
    try {
      const response = await fetch(`${API_URL}/module-authorizations`);
      if (response.ok) {
        const data = await response.json();
        setAuthorizations(data);
      }
    } catch (error) {
      console.error('Error fetching authorizations:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingAuth 
        ? `${API_URL}/module-authorizations/${editingAuth.id}`
        : `${API_URL}/module-authorizations`;
      
      const method = editingAuth ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: parseInt(formData.userId),
          grantedBy: 1 // ID del usuario que autoriza (se debe obtener del contexto)
        })
      });

      if (response.ok) {
        fetchAuthorizations();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving authorization:', error);
    }
  };

  const handleEdit = (auth) => {
    setEditingAuth(auth);
    setFormData({
      userId: auth.userId?.toString() || '',
      moduleName: auth.moduleName || '',
      permissionType: auth.permissionType || 'LECTURA',
      expiryDate: auth.expiryDate || '',
      status: auth.status || 'ACTIVO',
      authorizationReason: auth.authorizationReason || '',
      isPermanent: auth.isPermanent || false
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta autorización?')) {
      try {
        const response = await fetch(`${API_URL}/module-authorizations/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchAuthorizations();
        }
      } catch (error) {
        console.error('Error deleting authorization:', error);
      }
    }
  };

  const handleRevoke = async (auth) => {
    const revocationReason = prompt('Motivo de revocación:');
    if (revocationReason) {
      try {
        const response = await fetch(`${API_URL}/module-authorizations/${auth.id}/revoke`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            revokedBy: 1,
            revocationReason: revocationReason
          })
        });
        if (response.ok) {
          fetchAuthorizations();
        }
      } catch (error) {
        console.error('Error revoking authorization:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      userId: '',
      moduleName: '',
      permissionType: 'LECTURA',
      expiryDate: '',
      status: 'ACTIVO',
      authorizationReason: '',
      isPermanent: false
    });
    setEditingAuth(null);
  };

  const filteredAuthorizations = authorizations.filter(auth => {
    const user = users.find(u => u.id === auth.userId);
    const matchesSearch = 
      user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auth.moduleName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || auth.status === filterStatus;
    const matchesPermission = filterPermission === 'all' || auth.permissionType === filterPermission;
    
    return matchesSearch && matchesStatus && matchesPermission;
  });

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user?.username || `Usuario ${userId}`;
  };

  const getPermissionIcon = (permissionType) => {
    switch(permissionType) {
      case 'LECTURA': return <Eye size={16} />;
      case 'ESCRITURA': return <Edit size={16} />;
      case 'ADMINISTRACION': return <Key size={16} />;
      default: return <Lock size={16} />;
    }
  };

  return (
    <div className="property-units-management">
      <div className="contractors-header">
        <div className="header-title">
          <Shield size={32} />
          <h1>Autorizaciones de Módulos</h1>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus size={20} />
          Nueva Autorización
        </button>
      </div>

      <div className="contractors-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por usuario o módulo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter size={18} />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Todos los estados</option>
            <option value="ACTIVO">Activo</option>
            <option value="REVOCADO">Revocado</option>
            <option value="EXPIRADO">Expirado</option>
          </select>
        </div>
        <div className="filter-group">
          <Key size={18} />
          <select value={filterPermission} onChange={(e) => setFilterPermission(e.target.value)}>
            <option value="all">Todos los permisos</option>
            <option value="LECTURA">Lectura</option>
            <option value="ESCRITURA">Escritura</option>
            <option value="ADMINISTRACION">Administración</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Módulo</th>
              <th>Permiso</th>
              <th>Estado</th>
              <th>Fecha Concesión</th>
              <th>Expiración</th>
              <th>Permanente</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredAuthorizations.map(auth => (
              <tr key={auth.id}>
                <td>
                  <div className="user-info">
                    <User size={16} />
                    <span>{getUserName(auth.userId)}</span>
                  </div>
                </td>
                <td>
                  <div className="module-info">
                    <Lock size={16} />
                    <span>{auth.moduleName}</span>
                  </div>
                </td>
                <td>
                  <div className="permission-info">
                    {getPermissionIcon(auth.permissionType)}
                    <span>{auth.permissionType}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${auth.status?.toLowerCase()}`}>
                    {auth.status}
                  </span>
                </td>
                <td>
                  <div className="date-info">
                    <Calendar size={14} />
                    <span>{auth.grantedDate}</span>
                  </div>
                </td>
                <td>
                  {auth.expiryDate ? (
                    <div className="date-info">
                      <Calendar size={14} />
                      <span>{auth.expiryDate}</span>
                    </div>
                  ) : (
                    <span className="permanent-badge">Permanente</span>
                  )}
                </td>
                <td>
                  {auth.isPermanent ? <CheckCircle size={16} /> : <XCircle size={16} />}
                </td>
                <td>
                  <div className="action-buttons">
                    {auth.status === 'ACTIVO' && (
                      <button className="btn-revoke" onClick={() => handleRevoke(auth)}>
                        <Unlock size={16} />
                      </button>
                    )}
                    <button className="btn-edit" onClick={() => handleEdit(auth)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(auth.id)}>
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
              <h2>{editingAuth ? 'Editar Autorización' : 'Nueva Autorización'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>í—</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Usuario *</label>
                  <select
                    value={formData.userId}
                    onChange={(e) => setFormData({...formData, userId: e.target.value})}
                    required
                  >
                    <option value="">Seleccionar usuario...</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.username}</option>
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
                  <label>Tipo de Permiso *</label>
                  <select
                    value={formData.permissionType}
                    onChange={(e) => setFormData({...formData, permissionType: e.target.value})}
                    required
                  >
                    {PERMISSION_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="ACTIVO">Activo</option>
                    <option value="REVOCADO">Revocado</option>
                    <option value="EXPIRADO">Expirado</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Fecha de Expiración</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Permanente</label>
                  <select
                    value={formData.isPermanent}
                    onChange={(e) => setFormData({...formData, isPermanent: e.target.value === 'true'})}
                  >
                    <option value="false">No</option>
                    <option value="true">Sí</option>
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Razón de Autorización</label>
                  <textarea
                    value={formData.authorizationReason}
                    onChange={(e) => setFormData({...formData, authorizationReason: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingAuth ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
