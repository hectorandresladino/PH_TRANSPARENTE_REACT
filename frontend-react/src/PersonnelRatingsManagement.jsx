import React, { useState, useEffect } from 'react';
import { Star, Search, Plus, Filter, Calendar, User, Building, Shield, Briefcase, Home, Trash2, Edit, TrendingUp } from 'lucide-react';

import { API_URL } from './api.js';

const PERSON_TYPES = ['ADMINISTRADOR', 'CONSEJERO', 'COPIROPIETARIO', 'SEGURIDAD', 'EMPRESA', 'CONTRATISTA'];
const RATING_CATEGORIES = ['SERVICIO', 'ACTITUD', 'PROFESIONALISMO', 'RESPONSABILIDAD', 'COMUNICACION'];
const RATING_PERIODS = ['MENSUAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL'];
const STATUSES = ['APROBADO', 'PENDIENTE', 'RECHAZADO'];

export default function PersonnelRatingsManagement() {
  const [ratings, setRatings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    ratedPersonName: '',
    ratedPersonRole: 'ADMINISTRADOR',
    ratedPersonType: 'INDIVIDUAL',
    raterName: '',
    raterRole: 'COPIROPIETARIO',
    propertyUnitName: '',
    overallRating: 5,
    professionalismRating: 5,
    responsivenessRating: 5,
    qualityRating: 5,
    communicationRating: 5,
    reliabilityRating: 5,
    comments: '',
    positiveAspects: '',
    improvementAreas: '',
    ratingPeriod: 'MENSUAL',
    ratingCategory: 'SERVICIO',
    isAnonymous: false
  });

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const response = await fetch(`${API_URL}/personnel-ratings`);
      if (response.ok) {
        const data = await response.json();
        setRatings(data);
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/personnel-ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ratedPersonId: 1,
          raterId: 1
        })
      });

      if (response.ok) {
        fetchRatings();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving rating:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta calificación?')) {
      try {
        const response = await fetch(`${API_URL}/personnel-ratings/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchRatings();
        }
      } catch (error) {
        console.error('Error deleting rating:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      ratedPersonName: '',
      ratedPersonRole: 'ADMINISTRADOR',
      ratedPersonType: 'INDIVIDUAL',
      raterName: '',
      raterRole: 'COPIROPIETARIO',
      propertyUnitName: '',
      overallRating: 5,
      professionalismRating: 5,
      responsivenessRating: 5,
      qualityRating: 5,
      communicationRating: 5,
      reliabilityRating: 5,
      comments: '',
      positiveAspects: '',
      improvementAreas: '',
      ratingPeriod: 'MENSUAL',
      ratingCategory: 'SERVICIO',
      isAnonymous: false
    });
  };

  const filteredRatings = ratings.filter(rating => {
    const matchesSearch = 
      rating.ratedPersonName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.raterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.propertyUnitName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || rating.ratedPersonRole === filterRole;
    const matchesType = filterType === 'all' || rating.ratedPersonType === filterType;
    const matchesPeriod = filterPeriod === 'all' || rating.ratingPeriod === filterPeriod;
    
    return matchesSearch && matchesRole && matchesType && matchesPeriod;
  });

  const getRoleIcon = (role) => {
    switch(role) {
      case 'ADMINISTRADOR': return <Briefcase size={16} />;
      case 'CONSEJERO': return <User size={16} />;
      case 'COPIROPIETARIO': return <Home size={16} />;
      case 'SEGURIDAD': return <Shield size={16} />;
      case 'EMPRESA': return <Building size={16} />;
      default: return <User size={16} />;
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={16} fill={i < rating ? '#fbbf24' : 'none'} stroke={i < rating ? '#fbbf24' : '#d1d5db'} />
    ));
  };

  const getAverageRating = () => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + (r.overallRating || 0), 0);
    return (sum / ratings.length).toFixed(1);
  };

  return (
    <div className="personnel-ratings-management">
      <div className="contractors-header">
        <div className="header-title">
          <Star size={32} />
          <h1>Calificación de Personal</h1>
        </div>
        <div className="rating-summary">
          <div className="summary-card">
            <TrendingUp size={20} />
            <div className="summary-info">
              <span className="summary-label">Promedio General</span>
              <span className="summary-value">{getAverageRating()} â­</span>
            </div>
          </div>
          <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            <Plus size={20} />
            Nueva Calificación
          </button>
        </div>
      </div>

      <div className="contractors-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre, evaluador o casa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <User size={18} />
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="all">Todos los roles</option>
            {PERSON_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <Building size={18} />
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">Todos los tipos</option>
            <option value="INDIVIDUAL">Individual</option>
            <option value="EMPRESA">Empresa</option>
            <option value="CONTRATISTA">Contratista</option>
          </select>
        </div>
        <div className="filter-group">
          <Calendar size={18} />
          <select value={filterPeriod} onChange={(e) => setFilterPeriod(e.target.value)}>
            <option value="all">Todos los períodos</option>
            {RATING_PERIODS.map(period => (
              <option key={period} value={period}>{period}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Persona Calificada</th>
              <th>Rol</th>
              <th>Calificador</th>
              <th>Casa/Unidad</th>
              <th>Calificación</th>
              <th>Categoría</th>
              <th>Período</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredRatings.map(rating => (
              <tr key={rating.id}>
                <td>
                  <div className="person-info">
                    {getRoleIcon(rating.ratedPersonRole)}
                    <strong>{rating.ratedPersonName}</strong>
                  </div>
                </td>
                <td>{rating.ratedPersonRole}</td>
                <td>{rating.raterName}</td>
                <td>{rating.propertyUnitName || '-'}</td>
                <td>
                  <div className="rating-stars">
                    {renderStars(rating.overallRating)}
                    <span className="rating-number">{rating.overallRating}/5</span>
                  </div>
                </td>
                <td>{rating.ratingCategory}</td>
                <td>{rating.ratingPeriod}</td>
                <td>
                  <div className="date-info">
                    <Calendar size={14} />
                    <span>{rating.ratingDate}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${rating.status?.toLowerCase()}`}>
                    {rating.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-delete" onClick={() => handleDelete(rating.id)}>
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
              <h2>Nueva Calificación de Personal</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>í—</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Nombre de la Persona Calificada *</label>
                  <input
                    type="text"
                    value={formData.ratedPersonName}
                    onChange={(e) => setFormData({...formData, ratedPersonName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Rol *</label>
                  <select
                    value={formData.ratedPersonRole}
                    onChange={(e) => setFormData({...formData, ratedPersonRole: e.target.value})}
                    required
                  >
                    {PERSON_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Tipo *</label>
                  <select
                    value={formData.ratedPersonType}
                    onChange={(e) => setFormData({...formData, ratedPersonType: e.target.value})}
                    required
                  >
                    <option value="INDIVIDUAL">Individual</option>
                    <option value="EMPRESA">Empresa</option>
                    <option value="CONTRATISTA">Contratista</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Nombre del Calificador *</label>
                  <input
                    type="text"
                    value={formData.raterName}
                    onChange={(e) => setFormData({...formData, raterName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Rol del Calificador *</label>
                  <select
                    value={formData.raterRole}
                    onChange={(e) => setFormData({...formData, raterRole: e.target.value})}
                    required
                  >
                    {PERSON_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Casa/Unidad</label>
                  <input
                    type="text"
                    value={formData.propertyUnitName}
                    onChange={(e) => setFormData({...formData, propertyUnitName: e.target.value})}
                    placeholder="Ej: Torre A - Apt 101"
                  />
                </div>
                <div className="form-group">
                  <label>Calificación General (1-5) *</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.overallRating}
                    onChange={(e) => setFormData({...formData, overallRating: parseInt(e.target.value)})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Profesionalismo (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.professionalismRating}
                    onChange={(e) => setFormData({...formData, professionalismRating: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Responsividad (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.responsivenessRating}
                    onChange={(e) => setFormData({...formData, responsivenessRating: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Calidad (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.qualityRating}
                    onChange={(e) => setFormData({...formData, qualityRating: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Comunicación (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.communicationRating}
                    onChange={(e) => setFormData({...formData, communicationRating: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Confiabilidad (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.reliabilityRating}
                    onChange={(e) => setFormData({...formData, reliabilityRating: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Comentarios</label>
                  <textarea
                    value={formData.comments}
                    onChange={(e) => setFormData({...formData, comments: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Aspectos Positivos</label>
                  <textarea
                    value={formData.positiveAspects}
                    onChange={(e) => setFormData({...formData, positiveAspects: e.target.value})}
                    rows={2}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>íreas de Mejora</label>
                  <textarea
                    value={formData.improvementAreas}
                    onChange={(e) => setFormData({...formData, improvementAreas: e.target.value})}
                    rows={2}
                  />
                </div>
                <div className="form-group">
                  <label>Período</label>
                  <select
                    value={formData.ratingPeriod}
                    onChange={(e) => setFormData({...formData, ratingPeriod: e.target.value})}
                  >
                    {RATING_PERIODS.map(period => (
                      <option key={period} value={period}>{period}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Categoría</label>
                  <select
                    value={formData.ratingCategory}
                    onChange={(e) => setFormData({...formData, ratingCategory: e.target.value})}
                  >
                    {RATING_CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.isAnonymous}
                      onChange={(e) => setFormData({...formData, isAnonymous: e.target.checked})}
                    />
                    Calificación Anónima
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Guardar Calificación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
