import React, { useState, useEffect } from 'react';
import { Vote as VoteIcon, Plus, Edit, Trash2, Search, CheckCircle, XCircle, Clock, ThumbsUp, ThumbsDown, Minus, BarChart3, Users, UserX, Trophy, X } from 'lucide-react';
import './styles.css';
import { API_URL } from './api.js';

export default function ProposalVotesManagement() {
  const [votes, setVotes] = useState([]);
  const [users, setUsers] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [editingVote, setEditingVote] = useState(null);
  const [selectedVote, setSelectedVote] = useState(null);
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
    quorumRequired: '',
    createdBy: ''
  });

  const voteTypes = ['ORDINARIA', 'EXTRAORDINARIA', 'PRESUPUESTAL', 'ESTATUTARIA'];
  const voteStatuses = ['ABIERTA', 'CERRADA', 'CANCELADA', 'PENDIENTE'];
  const voteOptions = [
    { key: 'A_FAVOR', label: 'A favor', icon: ThumbsUp, color: '#10b981' },
    { key: 'EN_CONTRA', label: 'En contra', icon: ThumbsDown, color: '#ef4444' },
    { key: 'ABSTENCION', label: 'Abstención', icon: Minus, color: '#6b7280' }
  ];

  useEffect(() => { fetchVotes(); fetchUsers(); }, []);

  const fetchVotes = async () => {
    try {
      const response = await fetch(`${API_URL}/votes`);
      if (response.ok) {
        const data = await response.json();
        setVotes(data);
      }
    } catch (error) { console.error('Error fetching votes:', error); }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) { console.error('Error fetching users:', error); }
  };

  const fetchStatistics = async (voteId) => {
    try {
      const response = await fetch(`${API_URL}/votes/${voteId}/statistics`);
      if (response.ok) {
        const data = await response.json();
        setStatistics(data);
        setShowStats(true);
      }
    } catch (error) { console.error('Error fetching statistics:', error); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingVote ? `${API_URL}/votes/${editingVote.id}` : `${API_URL}/votes`;
      const method = editingVote ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          assemblyId: formData.assemblyId ? parseInt(formData.assemblyId) : null,
          quorumRequired: formData.quorumRequired ? parseInt(formData.quorumRequired) : null,
          votesFor: 0,
          votesAgainst: 0,
          votesAbstain: 0
        })
      });

      if (response.ok) {
        fetchVotes();
        setShowModal(false);
        setEditingVote(null);
        resetForm();
      }
    } catch (error) { console.error('Error saving vote:', error); }
  };

  const handleCastVote = async (option) => {
    if (!selectedVote) return;
    try {
      const response = await fetch(`${API_URL}/votes/${selectedVote.id}/cast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ option })
      });

      if (response.ok) {
        fetchVotes();
        fetchStatistics(selectedVote.id);
        setShowVoteModal(false);
      } else {
        const err = await response.text();
        alert(err);
      }
    } catch (error) { console.error('Error casting vote:', error); }
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
      quorumRequired: vote.quorumRequired || '',
      createdBy: vote.createdBy || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta votación?')) {
      try {
        const response = await fetch(`${API_URL}/votes/${id}`, { method: 'DELETE' });
        if (response.ok) fetchVotes();
      } catch (error) { console.error('Error deleting vote:', error); }
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
      quorumRequired: '',
      createdBy: ''
    });
  };

  const openVoteModal = (vote) => {
    setSelectedVote(vote);
    setShowVoteModal(true);
  };

  const openStatistics = (vote) => {
    setSelectedVote(vote);
    fetchStatistics(vote.id);
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
          <h1>Votaciones de Propuestas</h1>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setEditingVote(null); setShowModal(true); }}>
          <Plus size={20} />
          <span>Nueva Propuesta</span>
        </button>
      </div>

      <div className="votes-filters">
        <div className="search-bar">
          <Search size={20} />
          <input
            placeholder="Buscar propuestas..."
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
              {vote.description && <p className="vote-description">{vote.description}</p>}
            </div>
            <div className="vote-results">
              <div className="result-row" style={{ color: '#10b981' }}><ThumbsUp size={16} /><span>A favor: {vote.votesFor || 0}</span></div>
              <div className="result-row" style={{ color: '#ef4444' }}><ThumbsDown size={16} /><span>En contra: {vote.votesAgainst || 0}</span></div>
              <div className="result-row" style={{ color: '#6b7280' }}><Minus size={16} /><span>Abstenciones: {vote.votesAbstain || 0}</span></div>
            </div>
            <div className="vote-actions" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button className="btn-edit" onClick={() => handleEdit(vote)} title="Editar"><Edit size={16} /></button>
              <button className="btn-primary" onClick={() => openVoteModal(vote)} style={{ background: '#3b82f6' }} title="Votar"><VoteIcon size={16} /></button>
              <button className="btn-primary" onClick={() => openStatistics(vote)} style={{ background: '#10b981' }} title="Estadísticas"><BarChart3 size={16} /></button>
              <button className="btn-delete" onClick={() => handleDelete(vote.id)} title="Eliminar"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingVote ? 'Editar Propuesta' : 'Nueva Propuesta'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}><XCircle size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Título</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Tipo</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    {voteTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    {voteStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>ID Asamblea</label>
                  <input type="number" value={formData.assemblyId} onChange={e => setFormData({...formData, assemblyId: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Quórum Requerido</label>
                  <input type="number" value={formData.quorumRequired} onChange={e => setFormData({...formData, quorumRequired: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Fecha Inicio</label>
                  <input type="datetime-local" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Fecha Fin</label>
                  <input type="datetime-local" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Descripción</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">{editingVote ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showVoteModal && selectedVote && (
        <div className="modal-overlay" onClick={() => setShowVoteModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Votar: {selectedVote.title}</h2>
              <button className="btn-close" onClick={() => setShowVoteModal(false)}><XCircle size={20} /></button>
            </div>
            <div className="form-grid">
              {voteOptions.map(opt => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    className="btn-primary"
                    style={{ background: opt.color, flexDirection: 'row', gap: '0.5rem', justifyContent: 'center' }}
                    onClick={() => handleCastVote(opt.key)}
                  >
                    <Icon size={20} />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showStats && statistics && (
        <div className="modal-overlay" onClick={() => setShowStats(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h2><BarChart3 size={24} /> Estadísticas: {statistics.title}</h2>
              <button className="btn-close" onClick={() => setShowStats(false)}><X size={20} /></button>
            </div>
            <div className="stats-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="stat-box" style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>{statistics.totalVotes}</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Votos emitidos</div>
              </div>
              <div className="stat-box" style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>{statistics.votesFor}</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>A favor</div>
              </div>
              <div className="stat-box" style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>{statistics.votesAgainst}</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>En contra</div>
              </div>
              <div className="stat-box" style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6b7280' }}>{statistics.votesAbstain}</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Abstenciones</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, padding: '1rem', background: statistics.won ? '#d1fae5' : '#fee2e2', borderRadius: '0.5rem', textAlign: 'center' }}>
                <Trophy size={24} color={statistics.won ? '#10b981' : '#ef4444'} />
                <div style={{ fontWeight: 'bold', color: statistics.won ? '#10b981' : '#ef4444' }}>
                  {statistics.won ? 'PROPUESTA APROBADA' : 'PROPUESTA NO APROBADA'}
                </div>
              </div>
              <div style={{ flex: 1, padding: '1rem', background: statistics.quorumMet ? '#d1fae5' : '#fee2e2', borderRadius: '0.5rem', textAlign: 'center' }}>
                <Users size={24} color={statistics.quorumMet ? '#10b981' : '#ef4444'} />
                <div style={{ fontWeight: 'bold', color: statistics.quorumMet ? '#10b981' : '#ef4444' }}>
                  Quórum {statistics.quorumMet ? 'ALCANZADO' : 'NO ALCANZADO'}
                </div>
                <div style={{ fontSize: '0.8rem' }}>{statistics.totalVotes} de {statistics.eligibleVoters} votantes</div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}><Users size={16} /> Quienes votaron ({statistics.voted.length})</h3>
              <div style={{ maxHeight: '150px', overflow: 'auto', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '0.5rem' }}>
                {statistics.voted.length === 0 && <p style={{ color: '#6b7280' }}>Nadie ha votado aún</p>}
                {statistics.voted.map((voter, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid #f3f4f6' }}>
                    <span>{voter.username}</span>
                    <span style={{ fontWeight: 'bold', color: voter.option === 'A_FAVOR' ? '#10b981' : voter.option === 'EN_CONTRA' ? '#ef4444' : '#6b7280' }}>
                      {voter.option === 'A_FAVOR' ? 'A favor' : voter.option === 'EN_CONTRA' ? 'En contra' : 'Abstención'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}><UserX size={16} /> Quienes faltan por votar ({statistics.missing.length})</h3>
              <div style={{ maxHeight: '150px', overflow: 'auto', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '0.5rem' }}>
                {statistics.missing.length === 0 && <p style={{ color: '#6b7280' }}>Todos votaron</p>}
                {statistics.missing.map((voter, idx) => (
                  <div key={idx} style={{ padding: '0.25rem 0', borderBottom: '1px solid #f3f4f6' }}>{voter.username}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
