import React, { useState, useEffect } from 'react';
import { Vote as VoteIcon, Plus, Edit, Trash2, Search, CheckCircle, XCircle, Clock, ThumbsUp, ThumbsDown, Minus, BarChart3, Users, UserX, Trophy, X } from 'lucide-react';
import './styles.css';

import { API_URL } from './api.js';

export default function VotesManagement() {
  const [votes, setVotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [statsData, setStatsData] = useState(null);
  const [editingVote, setEditingVote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('TODOS');
  const [voteMessage, setVoteMessage] = useState('');
  const [myVotes, setMyVotes] = useState({});
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

  useEffect(() => {
    fetchVotes();
  }, []);

  const fetchVotes = async () => {
    try {
      const response = await fetch(`${API_URL}/votes`);
      if (response.ok) {
        const data = await response.json();
        setVotes(data);
        data.forEach(v => checkMyVote(v.id));
      }
    } catch (error) {
      console.error('Error fetching votes:', error);
    }
  };

  const checkMyVote = async (voteId) => {
    try {
      const response = await fetch(`${API_URL}/votes/${voteId}/my-vote`);
      if (response.ok) {
        const data = await response.json();
        if (data.choice) {
          setMyVotes(prev => ({ ...prev, [voteId]: data.choice }));
        }
      }
    } catch (error) {
      console.error('Error checking my vote:', error);
    }
  };

  const handleCastVote = async (voteId, choice) => {
    try {
      const response = await fetch(`${API_URL}/votes/${voteId}/cast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice })
      });
      const data = await response.text();
      if (response.ok) {
        setMyVotes(prev => ({ ...prev, [voteId]: choice }));
        setVoteMessage(`Voto registrado: ${choice}`);
        setTimeout(() => setVoteMessage(''), 3000);
        fetchVotes();
      } else {
        setVoteMessage(data);
        setTimeout(() => setVoteMessage(''), 3000);
      }
    } catch (error) {
      setVoteMessage('Error al registrar voto');
      setTimeout(() => setVoteMessage(''), 3000);
    }
  };

  const handleShowStats = async (voteId) => {
    try {
      const response = await fetch(`${API_URL}/votes/${voteId}/stats`);
      if (response.ok) {
        const data = await response.json();
        setStatsData(data);
        setShowStatsModal(true);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCloseVote = async (voteId) => {
    if (window.confirm('¿Cerrar esta votacion? No se aceptaran mas votos.')) {
      try {
        const response = await fetch(`${API_URL}/votes/${voteId}/close`, { method: 'POST' });
        if (response.ok) {
          fetchVotes();
        }
      } catch (error) {
        console.error('Error closing vote:', error);
      }
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
      quorumRequired: vote.quorumRequired || '',
      createdBy: vote.createdBy || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estas seguro de eliminar esta votacion?')) {
      try {
        const response = await fetch(`${API_URL}/votes/${id}`, { method: 'DELETE' });
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

  const getResultBadge = (vote) => {
    const favor = vote.votesFor || 0;
    const contra = vote.votesAgainst || 0;
    if (vote.status !== 'CERRADA') return null;
    if (favor > contra) return <span className="result-badge approved"><Trophy size={14} /> APROBADA</span>;
    if (contra > favor) return <span className="result-badge rejected"><XCircle size={14} /> RECHAZADA</span>;
    return <span className="result-badge tie"><Minus size={14} /> EMPATE</span>;
  };

  const filteredVotes = votes.filter(vote => {
    const matchesSearch =
      vote.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vote.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'TODOS' || vote.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const choiceLabel = (c) => {
    if (c === 'FAVOR') return 'A Favor';
    if (c === 'CONTRA') return 'En Contra';
    return 'Abstencion';
  };

  const choiceColor = (c) => {
    if (c === 'FAVOR') return '#10b981';
    if (c === 'CONTRA') return '#ef4444';
    return '#6b7280';
  };

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

      {voteMessage && (
        <div className="vote-toast">{voteMessage}</div>
      )}

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
        {filteredVotes.length === 0 && (
          <div className="empty-state">
            <VoteIcon size={48} />
            <p>No hay propuestas de votacion creadas</p>
          </div>
        )}
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

            {getResultBadge(vote)}

            {vote.status === 'ABIERTA' && (
              <div className="vote-cast-section">
                {myVotes[vote.id] ? (
                  <div className="already-voted" style={{ color: choiceColor(myVotes[vote.id]) }}>
                    <CheckCircle size={18} />
                    <span>Ya votaste: {choiceLabel(myVotes[vote.id])}</span>
                  </div>
                ) : (
                  <div className="vote-buttons">
                    <button className="vote-btn favor" onClick={() => handleCastVote(vote.id, 'FAVOR')}>
                      <ThumbsUp size={16} /> A Favor
                    </button>
                    <button className="vote-btn contra" onClick={() => handleCastVote(vote.id, 'CONTRA')}>
                      <ThumbsDown size={16} /> En Contra
                    </button>
                    <button className="vote-btn abstencion" onClick={() => handleCastVote(vote.id, 'ABSTENCION')}>
                      <Minus size={16} /> Abstencion
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="vote-actions">
              <button className="btn-icon" title="Ver estadisticas" onClick={() => handleShowStats(vote.id)}>
                <BarChart3 size={16} />
              </button>
              {vote.status === 'ABIERTA' && (
                <button className="btn-icon" title="Cerrar votacion" onClick={() => handleCloseVote(vote.id)}>
                  <CheckCircle size={16} />
                </button>
              )}
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

      {showStatsModal && statsData && (
        <div className="modal-overlay" onClick={() => setShowStatsModal(false)}>
          <div className="modal-content vote-stats-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Estadisticas de Votacion</h2>
              <button className="btn-close" onClick={() => setShowStatsModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="stats-content">
              <h3 className="stats-title">{statsData.title}</h3>

              <div className="stats-result-banner" style={{
                background: statsData.result === 'APROBADA' ? '#dcfce7' :
                           statsData.result === 'RECHAZADA' ? '#fee2e2' : '#f3f4f6',
                color: statsData.result === 'APROBADA' ? '#16a34a' :
                       statsData.result === 'RECHAZADA' ? '#dc2626' : '#6b7280'
              }}>
                <Trophy size={28} />
                <span className="result-text">{statsData.result}</span>
              </div>

              <div className="stats-summary-grid">
                <div className="stat-item favor">
                  <ThumbsUp size={20} />
                  <div>
                    <strong>{statsData.favor}</strong>
                    <span>A Favor</span>
                  </div>
                </div>
                <div className="stat-item contra">
                  <ThumbsDown size={20} />
                  <div>
                    <strong>{statsData.contra}</strong>
                    <span>En Contra</span>
                  </div>
                </div>
                <div className="stat-item abstencion">
                  <Minus size={20} />
                  <div>
                    <strong>{statsData.abstencion}</strong>
                    <span>Abstencion</span>
                  </div>
                </div>
                <div className="stat-item participation">
                  <BarChart3 size={20} />
                  <div>
                    <strong>{statsData.participation}%</strong>
                    <span>Participacion</span>
                  </div>
                </div>
              </div>

              <div className="stats-counts">
                <div className="count-row">
                  <Users size={18} />
                  <span>Total votaron: <strong>{statsData.totalVoted}</strong> de <strong>{statsData.totalEligible}</strong></span>
                </div>
                <div className="count-row pending">
                  <UserX size={18} />
                  <span>Pendientes por votar: <strong>{statsData.pending}</strong></span>
                </div>
              </div>

              <div className="stats-section">
                <h4><Users size={18} /> Quienes votaron</h4>
                {statsData.votedList && statsData.votedList.length > 0 ? (
                  <div className="voted-list">
                    {statsData.votedList.map((v, i) => (
                      <div key={i} className="voted-item">
                        <span className="voted-name">{v.username}</span>
                        <span className="voted-choice" style={{ color: choiceColor(v.choice), fontWeight: 600 }}>
                          {choiceLabel(v.choice)}
                        </span>
                        <span className="voted-time">{v.votedAt ? new Date(v.votedAt).toLocaleString('es-CO') : ''}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-list">Nadie ha votado aun</p>
                )}
              </div>

              <div className="stats-section">
                <h4><UserX size={18} /> Quienes faltan por votar</h4>
                {statsData.notVotedList && statsData.notVotedList.length > 0 ? (
                  <div className="not-voted-list">
                    {statsData.notVotedList.map((u, i) => (
                      <div key={i} className="not-voted-item">
                        <span className="not-voted-name">{u.username}</span>
                        {u.fullName && <span className="not-voted-fullname">{u.fullName}</span>}
                        {u.houseUnit && <span className="not-voted-house">Unidad: {u.houseUnit}</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-list">Todos han votado!</p>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setShowStatsModal(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingVote ? 'Editar Propuesta' : 'Nueva Propuesta de Votacion'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Titulo de la propuesta</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tipo</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                  >
                    {voteTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                  >
                    {voteStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>ID Asamblea</label>
                  <input
                    type="number"
                    value={formData.assemblyId}
                    onChange={e => setFormData({ ...formData, assemblyId: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Quorum Requerido</label>
                  <input
                    type="number"
                    value={formData.quorumRequired}
                    onChange={e => setFormData({ ...formData, quorumRequired: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Fecha Inicio</label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Fecha Fin</label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Creado por</label>
                  <input
                    type="text"
                    value={formData.createdBy}
                    onChange={e => setFormData({ ...formData, createdBy: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Descripcion de la propuesta</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
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
