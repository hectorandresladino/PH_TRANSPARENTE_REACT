import React, { useState, useEffect } from 'react';
import { Calendar, Search, Plus, Edit, Trash2, Filter, DollarSign, TrendingUp, BarChart3, MessageSquare, Vote, ThumbsUp, ThumbsDown, Minus, CheckCircle, XCircle, Clock, Trophy, Users, UserX, X, Send, FileText } from 'lucide-react';
import './styles.css';

import { API_URL } from './api.js';

export default function AnnualBudgetsManagement() {
  const [activeTab, setActiveTab] = useState('budgets');
  const [budgets, setBudgets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [budgetItems, setBudgetItems] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [stats, setStats] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [proposalStats, setProposalStats] = useState(null);
  const [myProposalVotes, setMyProposalVotes] = useState({});
  const [toast, setToast] = useState('');
  const [formData, setFormData] = useState({
    budgetYear: new Date().getFullYear(),
    budgetName: '',
    description: '',
    totalBudgetedAmount: '',
    totalExecutedAmount: '',
    totalRemainingAmount: '',
    executionPercentage: 0,
    approvalDate: '',
    approvedBy: '',
    assemblyResolution: '',
    status: 'BORRADOR',
    budgetType: 'OPERATIVO'
  });
  const [itemForm, setItemForm] = useState({ category: '', subCategory: '', budgetedAmount: '', executedAmount: '', remainingAmount: '', description: '' });
  const [proposalForm, setProposalForm] = useState({ title: '', description: '', estimatedCost: '' });
  const [inquiryForm, setInquiryForm] = useState({ question: '' });
  const [answerText, setAnswerText] = useState({});
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchBudgets();
    fetchStats();
  }, []);

  useEffect(() => {
    if (selectedBudget) {
      fetchItems(selectedBudget.id);
      fetchInquiries(selectedBudget.id);
      fetchProposals(selectedBudget.id);
    }
  }, [selectedBudget]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchBudgets = async () => {
    try {
      const res = await fetch(`${API_URL}/annual-budgets`);
      if (res.ok) setBudgets(await res.json());
    } catch (e) { console.error('Error fetching budgets:', e); }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/annual-budgets/stats/summary`);
      if (res.ok) setStats(await res.json());
    } catch (e) { console.error('Error fetching stats:', e); }
  };

  const fetchItems = async (budgetId) => {
    try {
      const res = await fetch(`${API_URL}/annual-budgets/${budgetId}/items`);
      if (res.ok) setBudgetItems(await res.json());
    } catch (e) { console.error('Error fetching items:', e); }
  };

  const fetchInquiries = async (budgetId) => {
    try {
      const res = await fetch(`${API_URL}/annual-budgets/${budgetId}/inquiries`);
      if (res.ok) setInquiries(await res.json());
    } catch (e) { console.error('Error fetching inquiries:', e); }
  };

  const fetchProposals = async (budgetId) => {
    try {
      const res = await fetch(`${API_URL}/annual-budgets/${budgetId}/proposals`);
      if (res.ok) {
        const data = await res.json();
        setProposals(data);
        data.forEach(p => checkMyProposalVote(p.id));
      }
    } catch (e) { console.error('Error fetching proposals:', e); }
  };

  const checkMyProposalVote = async (proposalId) => {
    try {
      const res = await fetch(`${API_URL}/votes/${proposalId}/my-vote`);
      if (res.ok) {
        const data = await res.json();
        if (data.choice) setMyProposalVotes(prev => ({ ...prev, [proposalId]: data.choice }));
      }
    } catch (e) { console.error('Error checking vote:', e); }
  };

  // Budget CRUD
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingBudget ? `${API_URL}/annual-budgets/${editingBudget.id}` : `${API_URL}/annual-budgets`;
    const method = editingBudget ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      if (res.ok) { fetchBudgets(); fetchStats(); setShowModal(false); resetForm(); }
    } catch (e) { console.error('Error saving budget:', e); }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      budgetYear: budget.budgetYear || new Date().getFullYear(),
      budgetName: budget.budgetName || '',
      description: budget.description || '',
      totalBudgetedAmount: budget.totalBudgetedAmount || '',
      totalExecutedAmount: budget.totalExecutedAmount || '',
      totalRemainingAmount: budget.totalRemainingAmount || '',
      executionPercentage: budget.executionPercentage || 0,
      approvalDate: budget.approvalDate || '',
      approvedBy: budget.approvedBy || '',
      assemblyResolution: budget.assemblyResolution || '',
      status: budget.status || 'BORRADOR',
      budgetType: budget.budgetType || 'OPERATIVO'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este presupuesto y todos sus rubros, consultas y propuestas?')) {
      try {
        const res = await fetch(`${API_URL}/annual-budgets/${id}`, { method: 'DELETE' });
        if (res.ok) { fetchBudgets(); fetchStats(); }
      } catch (e) { console.error('Error deleting budget:', e); }
    }
  };

  const resetForm = () => {
    setFormData({ budgetYear: new Date().getFullYear(), budgetName: '', description: '', totalBudgetedAmount: '', totalExecutedAmount: '', totalRemainingAmount: '', executionPercentage: 0, approvalDate: '', approvedBy: '', assemblyResolution: '', status: 'BORRADOR', budgetType: 'OPERATIVO' });
    setEditingBudget(null);
  };

  // Items
  const handleItemSubmit = async (e) => {
    e.preventDefault();
    const url = editingItem ? `${API_URL}/annual-budgets/${selectedBudget.id}/items/${editingItem.id}` : `${API_URL}/annual-budgets/${selectedBudget.id}/items`;
    const method = editingItem ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(itemForm) });
      if (res.ok) { fetchItems(selectedBudget.id); setShowItemModal(false); setEditingItem(null); setItemForm({ category: '', subCategory: '', budgetedAmount: '', executedAmount: '', remainingAmount: '', description: '' }); }
    } catch (e) { console.error('Error saving item:', e); }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('¿Eliminar este rubro?')) {
      try {
        await fetch(`${API_URL}/annual-budgets/${selectedBudget.id}/items/${itemId}`, { method: 'DELETE' });
        fetchItems(selectedBudget.id);
      } catch (e) { console.error('Error deleting item:', e); }
    }
  };

  // Inquiries
  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/annual-budgets/${selectedBudget.id}/inquiries`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(inquiryForm) });
      if (res.ok) { fetchInquiries(selectedBudget.id); fetchStats(); setShowInquiryModal(false); setInquiryForm({ question: '' }); showToast('Consulta enviada'); }
    } catch (e) { console.error('Error creating inquiry:', e); }
  };

  const handleAnswerInquiry = async (inquiryId) => {
    const answer = answerText[inquiryId];
    if (!answer) return;
    try {
      const res = await fetch(`${API_URL}/annual-budgets/${selectedBudget.id}/inquiries/${inquiryId}/answer`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answer }) });
      if (res.ok) { fetchInquiries(selectedBudget.id); fetchStats(); setAnswerText(prev => ({ ...prev, [inquiryId]: '' })); showToast('Respuesta enviada'); }
    } catch (e) { console.error('Error answering inquiry:', e); }
  };

  // Proposals
  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/annual-budgets/${selectedBudget.id}/proposals`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(proposalForm) });
      if (res.ok) { fetchProposals(selectedBudget.id); fetchStats(); setShowProposalModal(false); setProposalForm({ title: '', description: '', estimatedCost: '' }); showToast('Propuesta creada'); }
    } catch (e) { console.error('Error creating proposal:', e); }
  };

  const handleCastProposalVote = async (proposalId, choice) => {
    try {
      const res = await fetch(`${API_URL}/annual-budgets/${selectedBudget.id}/proposals/${proposalId}/cast`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ choice }) });
      const data = await res.text();
      if (res.ok) { setMyProposalVotes(prev => ({ ...prev, [proposalId]: choice })); showToast(`Voto: ${choice}`); fetchProposals(selectedBudget.id); }
      else { showToast(data); }
    } catch (e) { showToast('Error al votar'); }
  };

  const handleCloseProposal = async (proposalId) => {
    if (window.confirm('¿Cerrar esta propuesta?')) {
      try {
        await fetch(`${API_URL}/annual-budgets/${selectedBudget.id}/proposals/${proposalId}/close`, { method: 'POST' });
        fetchProposals(selectedBudget.id);
      } catch (e) { console.error('Error closing proposal:', e); }
    }
  };

  const handleShowProposalStats = async (proposalId) => {
    try {
      const res = await fetch(`${API_URL}/annual-budgets/${selectedBudget.id}/proposals/${proposalId}/stats`);
      if (res.ok) { setProposalStats(await res.json()); setShowStatsModal(true); }
    } catch (e) { console.error('Error fetching proposal stats:', e); }
  };

  const filteredBudgets = budgets.filter(b => {
    const ms = b.budgetName?.toLowerCase().includes(searchTerm.toLowerCase()) || b.budgetYear?.toString().includes(searchTerm);
    const mst = filterStatus === 'all' || b.status === filterStatus;
    return ms && mst;
  });

  const choiceLabel = (c) => c === 'FAVOR' ? 'A Favor' : c === 'CONTRA' ? 'En Contra' : 'Abstencion';
  const choiceColor = (c) => c === 'FAVOR' ? '#10b981' : c === 'CONTRA' ? '#ef4444' : '#6b7280';

  const tabs = [
    { id: 'budgets', label: 'Presupuestos', icon: Calendar },
    { id: 'items', label: 'Rubros', icon: DollarSign },
    { id: 'inquiries', label: 'Consultas', icon: MessageSquare },
    { id: 'proposals', label: 'Propuestas', icon: Vote },
    { id: 'stats', label: 'Estadisticas', icon: BarChart3 }
  ];

  return (
    <div className="budget-module">
      {toast && <div className="vote-toast">{toast}</div>}

      <div className="budget-tabs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} className={`budget-tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ==================== TAB: BUDGETS ==================== */}
      {activeTab === 'budgets' && (
        <div className="property-units-management">
          <div className="contractors-header">
            <div className="header-title">
              <Calendar size={32} />
              <h1>Presupuesto Anual</h1>
            </div>
            <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
              <Plus size={20} /> Nuevo Presupuesto
            </button>
          </div>

          <div className="contractors-filters">
            <div className="search-box">
              <Search size={18} />
              <input type="text" placeholder="Buscar por nombre o año..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="filter-group">
              <Filter size={18} />
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="all">Todos los estados</option>
                <option value="BORRADOR">Borrador</option>
                <option value="APROBADO">Aprobado</option>
                <option value="EJECUCION">En Ejecucion</option>
                <option value="CERRADO">Cerrado</option>
              </select>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Año</th><th>Nombre</th><th>Tipo</th><th>Presupuestado</th><th>Ejecutado</th><th>Restante</th><th>% Ejec.</th><th>Estado</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredBudgets.map(b => (
                  <tr key={b.id}>
                    <td><strong>{b.budgetYear}</strong></td>
                    <td>{b.budgetName}</td>
                    <td>{b.budgetType}</td>
                    <td>{b.totalBudgetedAmount}</td>
                    <td>{b.totalExecutedAmount}</td>
                    <td>{b.totalRemainingAmount}</td>
                    <td>{b.executionPercentage}%</td>
                    <td><span className={`status-badge ${b.status?.toLowerCase()}`}>{b.status}</span></td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon" title="Ver detalle" onClick={() => { setSelectedBudget(b); setActiveTab('items'); }}>
                          <FileText size={16} />
                        </button>
                        <button className="btn-edit" onClick={() => handleEdit(b)}><Edit size={16} /></button>
                        <button className="btn-delete" onClick={() => handleDelete(b.id)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== TAB: ITEMS ==================== */}
      {activeTab === 'items' && (
        <div className="property-units-management">
          <div className="contractors-header">
            <div className="header-title">
              <DollarSign size={32} />
              <h1>Rubros del Presupuesto {selectedBudget ? `- ${selectedBudget.budgetYear}` : ''}</h1>
            </div>
            {selectedBudget && (
              <button className="btn-primary" onClick={() => { setEditingItem(null); setItemForm({ category: '', subCategory: '', budgetedAmount: '', executedAmount: '', remainingAmount: '', description: '' }); setShowItemModal(true); }}>
                <Plus size={20} /> Nuevo Rubro
              </button>
            )}
          </div>

          {!selectedBudget ? (
            <div className="empty-state"><DollarSign size={48} /><p>Seleccione un presupuesto en la pestana "Presupuestos" para ver sus rubros</p></div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr><th>Categoria</th><th>Subcategoria</th><th>Presupuestado</th><th>Ejecutado</th><th>Restante</th><th>Descripcion</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                  {budgetItems.map(item => (
                    <tr key={item.id}>
                      <td><strong>{item.category}</strong></td>
                      <td>{item.subCategory || '-'}</td>
                      <td>{item.budgetedAmount}</td>
                      <td>{item.executedAmount}</td>
                      <td>{item.remainingAmount}</td>
                      <td>{item.description || '-'}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-edit" onClick={() => { setEditingItem(item); setItemForm({ category: item.category, subCategory: item.subCategory || '', budgetedAmount: item.budgetedAmount || '', executedAmount: item.executedAmount || '', remainingAmount: item.remainingAmount || '', description: item.description || '' }); setShowItemModal(true); }}><Edit size={16} /></button>
                          <button className="btn-delete" onClick={() => handleDeleteItem(item.id)}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {budgetItems.length === 0 && <tr><td colSpan="7" style={{ textAlign: 'center', color: '#94a3b8' }}>No hay rubros registrados</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB: INQUIRIES ==================== */}
      {activeTab === 'inquiries' && (
        <div className="property-units-management">
          <div className="contractors-header">
            <div className="header-title">
              <MessageSquare size={32} />
              <h1>Consultas {selectedBudget ? `- ${selectedBudget.budgetYear}` : ''}</h1>
            </div>
            {selectedBudget && (
              <button className="btn-primary" onClick={() => setShowInquiryModal(true)}>
                <Plus size={20} /> Nueva Consulta
              </button>
            )}
          </div>

          {!selectedBudget ? (
            <div className="empty-state"><MessageSquare size={48} /><p>Seleccione un presupuesto para ver las consultas</p></div>
          ) : (
            <div className="inquiries-list">
              {inquiries.length === 0 && <div className="empty-state"><MessageSquare size={48} /><p>No hay consultas</p></div>}
              {inquiries.map(inq => (
                <div key={inq.id} className="inquiry-card">
                  <div className="inquiry-header">
                    <span className="inquiry-author">{inq.askedBy} <span className="inquiry-role">({inq.askedByRole})</span></span>
                    <span className={`inquiry-status ${inq.status?.toLowerCase()}`}>{inq.status}</span>
                  </div>
                  <div className="inquiry-question">
                    <MessageSquare size={16} />
                    <p>{inq.question}</p>
                  </div>
                  <span className="inquiry-time">{inq.askedAt ? new Date(inq.askedAt).toLocaleString('es-CO') : ''}</span>

                  {inq.answer ? (
                    <div className="inquiry-answer">
                      <CheckCircle size={16} />
                      <div>
                        <p>{inq.answer}</p>
                        <span className="inquiry-answer-meta">Respondido por {inq.answeredBy} - {inq.answeredAt ? new Date(inq.answeredAt).toLocaleString('es-CO') : ''}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="inquiry-answer-form">
                      <textarea placeholder="Escribir respuesta..." value={answerText[inq.id] || ''} onChange={e => setAnswerText(prev => ({ ...prev, [inq.id]: e.target.value }))} rows={2} />
                      <button className="btn-primary" onClick={() => handleAnswerInquiry(inq.id)}>
                        <Send size={16} /> Responder
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB: PROPOSALS ==================== */}
      {activeTab === 'proposals' && (
        <div className="property-units-management">
          <div className="contractors-header">
            <div className="header-title">
              <Vote size={32} />
              <h1>Propuestas {selectedBudget ? `- ${selectedBudget.budgetYear}` : ''}</h1>
            </div>
            {selectedBudget && (
              <button className="btn-primary" onClick={() => setShowProposalModal(true)}>
                <Plus size={20} /> Nueva Propuesta
              </button>
            )}
          </div>

          {!selectedBudget ? (
            <div className="empty-state"><Vote size={48} /><p>Seleccione un presupuesto para ver las propuestas</p></div>
          ) : (
            <div className="votes-grid">
              {proposals.length === 0 && <div className="empty-state"><Vote size={48} /><p>No hay propuestas</p></div>}
              {proposals.map(p => (
                <div key={p.id} className="vote-card">
                  <div className="vote-header">
                    <span className="vote-title">{p.title}</span>
                    <span className="status-badge" style={{ color: p.status === 'ABIERTA' ? '#3b82f6' : '#10b981' }}>
                      {p.status === 'ABIERTA' ? <Clock size={16} /> : <CheckCircle size={16} />}
                      {p.status}
                    </span>
                  </div>
                  {p.description && <p className="vote-description">{p.description}</p>}
                  {p.estimatedCost && <div className="proposal-cost"><DollarSign size={16} /> Costo estimado: {p.estimatedCost}</div>}
                  <div className="proposal-meta">Propuesta por: {p.proposedBy}</div>
                  <div className="vote-results">
                    <div className="result-row" style={{ color: '#10b981' }}><ThumbsUp size={16} /><span>A favor: {p.votesFor || 0}</span></div>
                    <div className="result-row" style={{ color: '#ef4444' }}><ThumbsDown size={16} /><span>En contra: {p.votesAgainst || 0}</span></div>
                    <div className="result-row" style={{ color: '#6b7280' }}><Minus size={16} /><span>Abstenciones: {p.votesAbstain || 0}</span></div>
                  </div>

                  {p.status === 'CERRADA' && (
                    <span className={`result-badge ${(p.votesFor || 0) > (p.votesAgainst || 0) ? 'approved' : (p.votesAgainst || 0) > (p.votesFor || 0) ? 'rejected' : 'tie'}`}>
                      <Trophy size={14} />
                      {(p.votesFor || 0) > (p.votesAgainst || 0) ? 'APROBADA' : (p.votesAgainst || 0) > (p.votesFor || 0) ? 'RECHAZADA' : 'EMPATE'}
                    </span>
                  )}

                  {p.status === 'ABIERTA' && (
                    <div className="vote-cast-section">
                      {myProposalVotes[p.id] ? (
                        <div className="already-voted" style={{ color: choiceColor(myProposalVotes[p.id]) }}>
                          <CheckCircle size={18} /><span>Ya votaste: {choiceLabel(myProposalVotes[p.id])}</span>
                        </div>
                      ) : (
                        <div className="vote-buttons">
                          <button className="vote-btn favor" onClick={() => handleCastProposalVote(p.id, 'FAVOR')}><ThumbsUp size={16} /> A Favor</button>
                          <button className="vote-btn contra" onClick={() => handleCastProposalVote(p.id, 'CONTRA')}><ThumbsDown size={16} /> En Contra</button>
                          <button className="vote-btn abstencion" onClick={() => handleCastProposalVote(p.id, 'ABSTENCION')}><Minus size={16} /> Abstencion</button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="vote-actions">
                    <button className="btn-icon" title="Estadisticas" onClick={() => handleShowProposalStats(p.id)}><BarChart3 size={16} /></button>
                    {p.status === 'ABIERTA' && <button className="btn-icon" title="Cerrar" onClick={() => handleCloseProposal(p.id)}><CheckCircle size={16} /></button>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB: STATS ==================== */}
      {activeTab === 'stats' && stats && (
        <div className="property-units-management">
          <div className="contractors-header">
            <div className="header-title">
              <BarChart3 size={32} />
              <h1>Estadisticas Generales</h1>
            </div>
          </div>

          <div className="stats-summary-grid">
            <div className="stat-item" style={{ borderLeft: '4px solid #123b62' }}>
              <Calendar size={20} /><div><strong>{stats.totalBudgets}</strong><span>Total Presupuestos</span></div>
            </div>
            <div className="stat-item" style={{ borderLeft: '4px solid #f59e0b' }}>
              <Clock size={20} /><div><strong>{stats.borrador}</strong><span>Borradores</span></div>
            </div>
            <div className="stat-item" style={{ borderLeft: '4px solid #10b981' }}>
              <CheckCircle size={20} /><div><strong>{stats.aprobado}</strong><span>Aprobados</span></div>
            </div>
            <div className="stat-item" style={{ borderLeft: '4px solid #3b82f6' }}>
              <TrendingUp size={20} /><div><strong>{stats.ejecucion}</strong><span>En Ejecucion</span></div>
            </div>
            <div className="stat-item" style={{ borderLeft: '4px solid #6b7280' }}>
              <XCircle size={20} /><div><strong>{stats.cerrado}</strong><span>Cerrados</span></div>
            </div>
            <div className="stat-item" style={{ borderLeft: '4px solid #8b5cf6' }}>
              <MessageSquare size={20} /><div><strong>{stats.totalInquiries}</strong><span>Total Consultas</span></div>
            </div>
            <div className="stat-item" style={{ borderLeft: '4px solid #f59e0b' }}>
              <Clock size={20} /><div><strong>{stats.pendingInquiries}</strong><span>Consultas Pendientes</span></div>
            </div>
            <div className="stat-item" style={{ borderLeft: '4px solid #10b981' }}>
              <CheckCircle size={20} /><div><strong>{stats.answeredInquiries}</strong><span>Consultas Respondidas</span></div>
            </div>
            <div className="stat-item" style={{ borderLeft: '4px solid #ec4899' }}>
              <Vote size={20} /><div><strong>{stats.totalProposals}</strong><span>Total Propuestas</span></div>
            </div>
            <div className="stat-item" style={{ borderLeft: '4px solid #3b82f6' }}>
              <Clock size={20} /><div><strong>{stats.openProposals}</strong><span>Propuestas Abiertas</span></div>
            </div>
          </div>

          {stats.budgetsByYear && stats.budgetsByYear.length > 0 && (
            <div className="stats-section">
              <h4><Calendar size={18} /> Presupuestos por Año</h4>
              <div className="budget-year-bars">
                {stats.budgetsByYear.map(y => (
                  <div key={y.year} className="year-bar-item">
                    <span className="year-label">{y.year}</span>
                    <div className="year-bar-bg">
                      <div className="year-bar-fill" style={{ width: `${Math.min(y.count * 50, 100)}%` }}></div>
                    </div>
                    <span className="year-count">{y.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== MODAL: BUDGET ==================== */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingBudget ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group"><label>Año *</label><input type="number" value={formData.budgetYear} onChange={e => setFormData({ ...formData, budgetYear: parseInt(e.target.value) })} required /></div>
                <div className="form-group"><label>Nombre *</label><input type="text" value={formData.budgetName} onChange={e => setFormData({ ...formData, budgetName: e.target.value })} required /></div>
                <div className="form-group"><label>Tipo</label><select value={formData.budgetType} onChange={e => setFormData({ ...formData, budgetType: e.target.value })}><option value="OPERATIVO">Operativo</option><option value="INVERSION">Inversion</option><option value="MANTENIMIENTO">Mantenimiento</option></select></div>
                <div className="form-group"><label>Estado</label><select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}><option value="BORRADOR">Borrador</option><option value="APROBADO">Aprobado</option><option value="EJECUCION">En Ejecucion</option><option value="CERRADO">Cerrado</option></select></div>
                <div className="form-group"><label>Monto Presupuestado</label><input type="text" value={formData.totalBudgetedAmount} onChange={e => setFormData({ ...formData, totalBudgetedAmount: e.target.value })} /></div>
                <div className="form-group"><label>Monto Ejecutado</label><input type="text" value={formData.totalExecutedAmount} onChange={e => setFormData({ ...formData, totalExecutedAmount: e.target.value })} /></div>
                <div className="form-group"><label>Monto Restante</label><input type="text" value={formData.totalRemainingAmount} onChange={e => setFormData({ ...formData, totalRemainingAmount: e.target.value })} /></div>
                <div className="form-group"><label>% Ejecucion</label><input type="number" step="0.01" value={formData.executionPercentage} onChange={e => setFormData({ ...formData, executionPercentage: parseFloat(e.target.value) })} /></div>
                <div className="form-group"><label>Fecha Aprobacion</label><input type="date" value={formData.approvalDate} onChange={e => setFormData({ ...formData, approvalDate: e.target.value })} /></div>
                <div className="form-group"><label>Aprobado por</label><input type="text" value={formData.approvedBy} onChange={e => setFormData({ ...formData, approvedBy: e.target.value })} /></div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}><label>Resolucion de Asamblea</label><input type="text" value={formData.assemblyResolution} onChange={e => setFormData({ ...formData, assemblyResolution: e.target.value })} /></div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}><label>Descripcion</label><textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">{editingBudget ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: ITEM ==================== */}
      {showItemModal && selectedBudget && (
        <div className="modal-overlay" onClick={() => setShowItemModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingItem ? 'Editar Rubro' : 'Nuevo Rubro'}</h2>
              <button className="btn-close" onClick={() => setShowItemModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleItemSubmit}>
              <div className="form-grid">
                <div className="form-group"><label>Categoria *</label><input type="text" value={itemForm.category} onChange={e => setItemForm({ ...itemForm, category: e.target.value })} required placeholder="Ej: Administracion, Seguridad, Mantenimiento" /></div>
                <div className="form-group"><label>Subcategoria</label><input type="text" value={itemForm.subCategory} onChange={e => setItemForm({ ...itemForm, subCategory: e.target.value })} /></div>
                <div className="form-group"><label>Presupuestado</label><input type="text" value={itemForm.budgetedAmount} onChange={e => setItemForm({ ...itemForm, budgetedAmount: e.target.value })} /></div>
                <div className="form-group"><label>Ejecutado</label><input type="text" value={itemForm.executedAmount} onChange={e => setItemForm({ ...itemForm, executedAmount: e.target.value })} /></div>
                <div className="form-group"><label>Restante</label><input type="text" value={itemForm.remainingAmount} onChange={e => setItemForm({ ...itemForm, remainingAmount: e.target.value })} /></div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}><label>Descripcion</label><textarea value={itemForm.description} onChange={e => setItemForm({ ...itemForm, description: e.target.value })} rows={2} /></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowItemModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">{editingItem ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: INQUIRY ==================== */}
      {showInquiryModal && selectedBudget && (
        <div className="modal-overlay" onClick={() => setShowInquiryModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nueva Consulta</h2>
              <button className="btn-close" onClick={() => setShowInquiryModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleInquirySubmit}>
              <div className="form-group">
                <label>Pregunta / Solicitud de informacion *</label>
                <textarea value={inquiryForm.question} onChange={e => setInquiryForm({ ...inquiryForm, question: e.target.value })} rows={4} required placeholder="Escriba su consulta sobre el presupuesto..." />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowInquiryModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary"><Send size={16} /> Enviar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: PROPOSAL ==================== */}
      {showProposalModal && selectedBudget && (
        <div className="modal-overlay" onClick={() => setShowProposalModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nueva Propuesta</h2>
              <button className="btn-close" onClick={() => setShowProposalModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleProposalSubmit}>
              <div className="form-grid">
                <div className="form-group" style={{ gridColumn: 'span 2' }}><label>Titulo *</label><input type="text" value={proposalForm.title} onChange={e => setProposalForm({ ...proposalForm, title: e.target.value })} required /></div>
                <div className="form-group"><label>Costo Estimado</label><input type="text" value={proposalForm.estimatedCost} onChange={e => setProposalForm({ ...proposalForm, estimatedCost: e.target.value })} /></div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}><label>Descripcion</label><textarea value={proposalForm.description} onChange={e => setProposalForm({ ...proposalForm, description: e.target.value })} rows={3} /></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowProposalModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Crear Propuesta</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: PROPOSAL STATS ==================== */}
      {showStatsModal && proposalStats && (
        <div className="modal-overlay" onClick={() => setShowStatsModal(false)}>
          <div className="modal-content vote-stats-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Estadisticas de la Propuesta</h2>
              <button className="btn-close" onClick={() => setShowStatsModal(false)}><X size={20} /></button>
            </div>
            <div className="stats-content">
              <h3 className="stats-title">{proposalStats.title}</h3>
              <div className="stats-result-banner" style={{ background: proposalStats.result === 'APROBADA' ? '#dcfce7' : proposalStats.result === 'RECHAZADA' ? '#fee2e2' : '#f3f4f6', color: proposalStats.result === 'APROBADA' ? '#16a34a' : proposalStats.result === 'RECHAZADA' ? '#dc2626' : '#6b7280' }}>
                <Trophy size={28} /><span className="result-text">{proposalStats.result}</span>
              </div>
              <div className="stats-summary-grid">
                <div className="stat-item favor"><ThumbsUp size={20} /><div><strong>{proposalStats.favor}</strong><span>A Favor</span></div></div>
                <div className="stat-item contra"><ThumbsDown size={20} /><div><strong>{proposalStats.contra}</strong><span>En Contra</span></div></div>
                <div className="stat-item abstencion"><Minus size={20} /><div><strong>{proposalStats.abstencion}</strong><span>Abstencion</span></div></div>
                <div className="stat-item participation"><BarChart3 size={20} /><div><strong>{proposalStats.participation}%</strong><span>Participacion</span></div></div>
              </div>
              <div className="stats-counts">
                <div className="count-row"><Users size={18} /><span>Total votaron: <strong>{proposalStats.totalVoted}</strong> de <strong>{proposalStats.totalEligible}</strong></span></div>
                <div className="count-row pending"><UserX size={18} /><span>Pendientes: <strong>{proposalStats.pending}</strong></span></div>
              </div>
              <div className="stats-section">
                <h4><Users size={18} /> Quienes votaron</h4>
                {proposalStats.votedList && proposalStats.votedList.length > 0 ? (
                  <div className="voted-list">
                    {proposalStats.votedList.map((v, i) => (
                      <div key={i} className="voted-item">
                        <span className="voted-name">{v.username}</span>
                        <span className="voted-choice" style={{ color: choiceColor(v.choice), fontWeight: 600 }}>{choiceLabel(v.choice)}</span>
                        <span className="voted-time">{v.votedAt ? new Date(v.votedAt).toLocaleString('es-CO') : ''}</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="empty-list">Nadie ha votado aun</p>}
              </div>
              <div className="stats-section">
                <h4><UserX size={18} /> Quienes faltan por votar</h4>
                {proposalStats.notVotedList && proposalStats.notVotedList.length > 0 ? (
                  <div className="not-voted-list">
                    {proposalStats.notVotedList.map((u, i) => (
                      <div key={i} className="not-voted-item">
                        <span className="not-voted-name">{u.username}</span>
                        {u.fullName && <span className="not-voted-fullname">{u.fullName}</span>}
                        {u.houseUnit && <span className="not-voted-house">Unidad: {u.houseUnit}</span>}
                      </div>
                    ))}
                  </div>
                ) : <p className="empty-list">Todos han votado!</p>}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setShowStatsModal(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
