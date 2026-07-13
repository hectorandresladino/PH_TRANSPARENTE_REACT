import React, { useState, useEffect } from 'react';
import { Vote as VoteIcon, Plus, Edit, Trash2, Search, CheckCircle, XCircle, Clock, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import './styles.css';

import { API_URL } from './api.js';

export default function VotesManagement() {
  const [votes, setVotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingVote, setEditingVote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('TODOS');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'ORDINARIA',
    assemblyId: '',
    startDate: '',
    endDate: '',
    status: 'ABIERTA',
    votesFor: '0',
    votesAgainst: '0',
    votesAbstain: '0',
    quorumRequired: '',
    createdBy: ''
  });

  const voteTypes = ['ORDINARIA', 'EXTRAORDINARIA', 'PRESUPUESTAL', 'ESTATUTARIA'];
  const voteStatuses = ['ABIERTA', 'CERRADA', 'CANCELADA', 'PENDIENTE'];

  useEffect(() => {
    fetchVotes();
  }, []);

  const fetchVotes = async () => {
    try {
      const response = await fetch(`${API_URL}/votes`);
      if (response.ok) {
        const data = await response.json();
        setVotes(data);
      }
    } catch (error) {
      console.error('Error fetching votes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingVote 
        ? `${API_URL}/votes/${editingVote.id}`
        : `${API_URL}/votes`;
      const method = editingVote ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          assemblyId: formData.assemblyId ? parseInt(formData.assemblyId) : null,
          votesFor: formData.votesFor ? parseInt(formData.votesFor) : 0,
          votesAgainst: formData.votesAgainst ? parseInt(formData.votesAgainst) : 0,
          votesAbstain: formData.votesAbstain ? parseInt(formData.votesAbstain) : 0,
          quorumRequired: formData.quorumRequired ? parseInt(formData.quorumRequired) : null
        })
      });

      if (response.ok) {
        fetchVotes();
        setShowModal(false);
        setEditingVote(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving vote:', error);
    }
  };

  const handleEdit = (vote) => {
    setEditingVote(vote);
    setFormData({
      title: vote.title,
      description: vote.description || '',
      type: vote.type,
      assemblyId: vote.assemblyId || '',
      startDate: vote.startDate || '',
      endDate: vote.endDate || '',
      status: vote.status,
      votesFor: vote.votesFor || '0',
      votesAgainst: vote.votesAgainst || '0',
      votesAbstain: vote.votesAbstain || '0',
      quorumRequired: vote.quorumRequired || '',
      createdBy: vote.createdBy || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta votación?')) {
      try {
        const response = await fetch(`${API_URL}/votes/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchVotes();
        }
      } catch (error) {
        console.error('Error deleting vote:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'ORDINARIA',
      assemblyId: '',
      startDate: '',
      endDate: '',
      status: 'ABIERTA',
      votesFor: '0',
      votesAgainst: '0',
      votesAbstain: '0',
      quorumRequired: '',
      createdBy: ''
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CERRADA': return <CheckCircle size={16} />;
      case 'ABIERTA': return <Clock size={16} />;
      case 'CANCELADA': return <XCircle size={16} />;
      case 'PENDIENTE': return <Clock size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CERRADA': return '#10b981';
      case 'ABIERTA': return '#3b82f6';
      case 'CANCELADA': return '#ef4444';
      case 'PENDIENTE': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const filteredVotes = votes.filter(vote => {
    const matchesSearch = 
      vote.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vote.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'TODOS' || vote.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="votes-management">
      <div className="votes-header">
        <div className="header-title">
          <VoteIcon size={32} />
          <h1>Gestión de Votaciones</h1>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setEditingVote(null); setShowModal(true); }}>
          <Plus size={20} />
          <span>Nueva Votación</span>
        </button>
      </div>

      <div className="votes-filters">
        <div className="search-bar">
          <Search size={20} />
          <input
            placeholder="Buscar votaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="TODOS">Todos los estados</option>
          {voteStatuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="votes-grid">
        {filteredVotes.map(vote => (
          <div key={vote.id} className="vote-card">
            <div className="vote-header">
              <span className="vote-title">{vote.title}</span>
              <span className="status-badge" style={{ color: getStatusColor(vote.status) }}>
                {getStatusIcon(vote.status)}
                {vote.status}
              </span>
            </div>
            <div className="vote-info">
              <div className="vote-type">{vote.type}</div>
              {vote.description && (
                <p className="vote-description">{vote.description}</p>
              )}
            </div>
            <div className="vote-results">
              <div className="result-row" style={{ color: '#10b981' }}>
                <ThumbsUp size={16} />
                <span>A favor: {vote.votesFor || 0}</span>
              </div>
              <div className="result-row" style={{ color: '#ef4444' }}>
                <ThumbsDown size={16} />
                <span>En contra: {vote.votesAgainst || 0}</span>
              </div>
              <div className="result-row" style={{ color: '#6b7280' }}>
                <Minus size={16} />
                <span>Abstenciones: {vote.votesAbstain || 0}</span>
              </div>
            </div>
            <div className="vote-actions">
              <button className="btn-edit" onClick={() => handleEdit(vote)}>
                <Edit size={16} />
              </button>
              <button className="btn-delete" onClick={() => handleDelete(vote.id)}>
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
              <h2>{editingVote ? 'Editar Votación' : 'Nueva Votación'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Título</label>
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
                    {voteTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    {voteStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>ID Asamblea</label>
                  <input
                    type="number"
                    value={formData.assemblyId}
                    onChange={e => setFormData({...formData, assemblyId: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Quórum Requerido</label>
                  <input
                    type="number"
                    value={formData.quorumRequired}
                    onChange={e => setFormData({...formData, quorumRequired: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Fecha Inicio</label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Fecha Fin</label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={e => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Votos a Favor</label>
                  <input
                    type="number"
                    value={formData.votesFor}
                    onChange={e => setFormData({...formData, votesFor: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Votos en Contra</label>
                  <input
                    type="number"
                    value={formData.votesAgainst}
                    onChange={e => setFormData({...formData, votesAgainst: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Abstenciones</label>
                  <input
                    type="number"
                    value={formData.votesAbstain}
                    onChange={e => setFormData({...formData, votesAbstain: e.target.value})}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Creado por (ID)</label>
                  <input
                    type="text"
                    value={formData.createdBy}
                    onChange={e => setFormData({...formData, createdBy: e.target.value})}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Descripción</label>
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
                  {editingVote ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
