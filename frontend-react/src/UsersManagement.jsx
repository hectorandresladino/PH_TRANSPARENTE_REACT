import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Search, Shield, Mail, Phone, User as UserIcon, Check, X, KeyRound } from 'lucide-react';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || `http://${location.hostname}:8081/api`;

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'USER',
    email: '',
    fullName: '',
    phone: '',
    houseUnit: '',
    active: true
  });

  useEffect(() => {
    fetchUsers();
  }, []);

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
      const url = editingUser 
        ? `${API_URL}/users/${editingUser.id}`
        : `${API_URL}/users`;
      const method = editingUser ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchUsers();
        setShowModal(false);
        setEditingUser(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: '',
      role: user.role,
      email: user.email || '',
      fullName: user.fullName || '',
      phone: user.phone || '',
      houseUnit: user.houseUnit || '',
      active: user.active !== false
    });
    setShowModal(true);
  };

  const handleGeneratePassword = async () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password });
    setPasswordMessage('ContraseÃ±a generada. El admin debe entregarla al usuario.');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Â¿EstÃ¡s seguro de eliminar este usuario?')) {
      try {
        const response = await fetch(`${API_URL}/users/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchUsers();
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      role: 'USER',
      email: '',
      fullName: '',
      phone: '',
      houseUnit: '',
      active: true
    });
  };

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="users-management">
      <div className="users-header">
        <div className="header-title">
          <Users size={32} />
          <h1>GestiÃ³n de Usuarios</h1>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setEditingUser(null); setShowModal(true); }}>
          <Plus size={20} />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      <div className="users-filters">
        <div className="search-bar">
          <Search size={20} />
          <input
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Nombre Completo</th>
              <th>Email</th>
              <th>TelÃ©fono</th>
              <th>Casa/Apto</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">
                      <UserIcon size={20} />
                    </div>
                    <span>{user.username}</span>
                  </div>
                </td>
                <td>{user.fullName || '-'}</td>
                <td>{user.email || '-'}</td>
                <td>{user.phone || '-'}</td>
                <td>{user.houseUnit || '-'}</td>
                <td>
                  <span className={`role-badge ${user.role.toLowerCase()}`}>
                    <Shield size={14} />
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.active !== false ? 'active' : 'inactive'}`}>
                    {user.active !== false ? <Check size={14} /> : <X size={14} />}
                    {user.active !== false ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => handleEdit(user)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(user.id)}>
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
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Usuario</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                    required
                    disabled={!!editingUser}
                  />
                </div>
                <div className="form-group">
                  <label>ContraseÃ±a</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      required={!editingUser}
                      placeholder={editingUser ? 'Dejar vacÃ­o para mantener la actual' : 'Ingrese o genere una contraseÃ±a'}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      style={{ whiteSpace: 'nowrap', padding: '0 12px', background: '#123b62', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      <KeyRound size={16} style={{ display: 'inline', marginRight: '4px' }} />
                      Generar
                    </button>
                  </div>
                  {passwordMessage && (
                    <small style={{ color: passwordMessage.includes('Error') ? '#dc2626' : '#136f43', display: 'block', marginTop: '4px', fontSize: '0.8rem' }}>
                      {passwordMessage}
                    </small>
                  )}
                </div>
                <div className="form-group">
                  <label>Nombre Completo</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>TelÃ©fono (Obligatorio para verificación)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    required
                    placeholder="+57 300 123 4567"
                  />
                </div>
                <div className="form-group">
                  <label>Casa / Apartamento</label>
                  <input
                    type="text"
                    value={formData.houseUnit}
                    onChange={e => setFormData({...formData, houseUnit: e.target.value})}
                    placeholder="Ej: Torre 1, Apto 302"
                  />
                </div>
                <div className="form-group">
                  <label>Rol</label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="ADMIN">Administrador</option>
                    <option value="CONSEJERO">Consejero</option>
                    <option value="COPIROPIETARIO">Copropietario</option>
                    <option value="CONTADOR">Contador</option>
                    <option value="REVISOR_FISCAL">Revisor Fiscal</option>
                    <option value="VIGILANCIA">Vigilancia</option>
                    <option value="ASEO">Aseo</option>
                  </select>
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={e => setFormData({...formData, active: e.target.checked})}
                    />
                    <span>Usuario Activo</span>
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingUser ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
