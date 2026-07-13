import React, { useState } from 'react';
import { 
  Star, Users, ChevronLeft, Send, MessageSquare, Calendar,
  User, Award, TrendingUp, CheckCircle, Clock, Building,
  FileText, BarChart3, ThumbsUp, ThumbsDown, AlertCircle
} from 'lucide-react';

export default function StaffRatingsManagement({ userRole = 'admin', onBack }) {
  const [activeTab, setActiveTab] = useState('rate'); // rate, history, summary
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  
  const [ratingForm, setRatingForm] = useState({
    category: 'GESTION_GENERAL',
    rating: 0,
    comment: '',
    period: 'MENSUAL'
  });

  // Determinar rol actual
  const isAdmin = ['admin', 'Administrador', 'ADMIN'].includes(userRole);
  const isConsejero = ['consejero', 'Consejero', 'CONSEJERO'].includes(userRole);
  const isContador = ['contador', 'Contador', 'CONTADOR'].includes(userRole);
  const isRevisor = ['revisor_fiscal', 'Revisor Fiscal', 'REVISOR_FISCAL'].includes(userRole);

  // Definir a quién puede calificar cada rol
  const getRatingTargets = () => {
    if (isAdmin) {
      return [
        { id: 'consejeros', name: 'Consejo de Administración', role: 'CONSEJERO', icon: '👥', color: '#10b981' },
        { id: 'contador', name: 'Contador - María F. López', role: 'CONTADOR', icon: '📊', color: '#f59e0b' },
        { id: 'revisor', name: 'Revisor Fiscal - Roberto Sánchez', role: 'REVISOR_FISCAL', icon: '📋', color: '#ef4444' }
      ];
    } else if (isConsejero) {
      return [
        { id: 'admin', name: 'Administrador - Carlos Martínez', role: 'ADMIN', icon: '🏢', color: '#667eea' }
      ];
    } else if (isContador) {
      return [
        { id: 'admin', name: 'Administrador - Carlos Martínez', role: 'ADMIN', icon: '🏢', color: '#667eea' }
      ];
    } else if (isRevisor) {
      return [
        { id: 'admin', name: 'Administrador - Carlos Martínez', role: 'ADMIN', icon: '🏢', color: '#667eea' }
      ];
    }
    return [];
  };

  // Categorías de evaluación según el rol evaluado
  const getRatingCategories = (targetRole) => {
    if (targetRole === 'ADMIN') {
      return [
        { id: 'GESTION_GENERAL', name: 'Gestión General', description: 'Administración del conjunto' },
        { id: 'COMUNICACION', name: 'Comunicación', description: 'Claridad y oportunidad en la información' },
        { id: 'TRANSPARENCIA', name: 'Transparencia', description: 'Manejo transparente de recursos' },
        { id: 'CUMPLIMIENTO', name: 'Cumplimiento', description: 'Cumplimiento de compromisos y plazos' },
        { id: 'ATENCION', name: 'Atención', description: 'Atención a copropietarios y proveedores' },
        { id: 'MANTENIMIENTO', name: 'Mantenimiento', description: 'Estado de zonas comunes' }
      ];
    } else if (targetRole === 'CONSEJERO') {
      return [
        { id: 'PARTICIPACION', name: 'Participación', description: 'Asistencia y participación en reuniones' },
        { id: 'DECISIONES', name: 'Toma de Decisiones', description: 'Calidad de las decisiones tomadas' },
        { id: 'FISCALIZACION', name: 'Fiscalización', description: 'Supervisión de la administración' },
        { id: 'COMUNICACION', name: 'Comunicación', description: 'Comunicación con copropietarios' },
        { id: 'COMPROMISO', name: 'Compromiso', description: 'Compromiso con el conjunto' }
      ];
    } else if (targetRole === 'CONTADOR') {
      return [
        { id: 'INFORMES', name: 'Informes Contables', description: 'Calidad y puntualidad de informes' },
        { id: 'PRECISION', name: 'Precisión', description: 'Exactitud en los registros contables' },
        { id: 'CUMPLIMIENTO_LEGAL', name: 'Cumplimiento Legal', description: 'Cumplimiento de obligaciones tributarias' },
        { id: 'DISPONIBILIDAD', name: 'Disponibilidad', description: 'Atención a consultas y requerimientos' },
        { id: 'ASESORIA', name: 'Asesoría', description: 'Calidad de las recomendaciones financieras' }
      ];
    } else if (targetRole === 'REVISOR_FISCAL') {
      return [
        { id: 'AUDITORIA', name: 'Auditoría', description: 'Calidad de las auditorías realizadas' },
        { id: 'INFORMES', name: 'Informes', description: 'Claridad y oportunidad de informes' },
        { id: 'INDEPENDENCIA', name: 'Independencia', description: 'Objetividad e imparcialidad' },
        { id: 'RECOMENDACIONES', name: 'Recomendaciones', description: 'Utilidad de las recomendaciones' },
        { id: 'SEGUIMIENTO', name: 'Seguimiento', description: 'Seguimiento a hallazgos anteriores' }
      ];
    }
    return [];
  };

  // Historial de calificaciones (mock data)
  const [ratingsHistory] = useState([
    {
      id: 1,
      fromRole: 'CONSEJERO',
      fromName: 'Consejo de Administración',
      toRole: 'ADMIN',
      toName: 'Administrador',
      category: 'GESTION_GENERAL',
      categoryName: 'Gestión General',
      rating: 4,
      comment: 'Buena gestión en el mantenimiento de zonas comunes. Mejorar tiempos de respuesta a PQRs.',
      period: 'Mayo 2026',
      date: '2026-05-30'
    },
    {
      id: 2,
      fromRole: 'ADMIN',
      fromName: 'Administrador',
      toRole: 'CONTADOR',
      toName: 'Contador',
      category: 'INFORMES',
      categoryName: 'Informes Contables',
      rating: 5,
      comment: 'Excelente presentación de estados financieros. Muy puntual con las obligaciones tributarias.',
      period: 'Mayo 2026',
      date: '2026-05-28'
    },
    {
      id: 3,
      fromRole: 'ADMIN',
      fromName: 'Administrador',
      toRole: 'REVISOR_FISCAL',
      toName: 'Revisor Fiscal',
      category: 'AUDITORIA',
      categoryName: 'Auditoría',
      rating: 4,
      comment: 'Auditoría completa y detallada. Recomendaciones muy útiles para mejorar controles.',
      period: 'Mayo 2026',
      date: '2026-05-25'
    },
    {
      id: 4,
      fromRole: 'CONTADOR',
      fromName: 'Contador',
      toRole: 'ADMIN',
      toName: 'Administrador',
      category: 'TRANSPARENCIA',
      categoryName: 'Transparencia',
      rating: 5,
      comment: 'Documentación completa y ordenada. Facilita mucho el trabajo contable.',
      period: 'Mayo 2026',
      date: '2026-05-20'
    },
    {
      id: 5,
      fromRole: 'REVISOR_FISCAL',
      fromName: 'Revisor Fiscal',
      toRole: 'ADMIN',
      toName: 'Administrador',
      category: 'CUMPLIMIENTO',
      categoryName: 'Cumplimiento',
      rating: 4,
      comment: 'Buen cumplimiento de recomendaciones de auditoría. Pendiente implementar control de inventarios.',
      period: 'Mayo 2026',
      date: '2026-05-15'
    },
    {
      id: 6,
      fromRole: 'ADMIN',
      fromName: 'Administrador',
      toRole: 'CONSEJERO',
      toName: 'Consejo de Administración',
      category: 'PARTICIPACION',
      categoryName: 'Participación',
      rating: 3,
      comment: 'Asistencia irregular a reuniones. Se requiere mayor compromiso de algunos miembros.',
      period: 'Mayo 2026',
      date: '2026-05-10'
    }
  ]);

  // Resumen de calificaciones
  const getSummary = () => {
    const summary = {};
    ratingsHistory.forEach(r => {
      const key = r.toRole;
      if (!summary[key]) {
        summary[key] = { total: 0, count: 0, ratings: [] };
      }
      summary[key].total += r.rating;
      summary[key].count += 1;
      summary[key].ratings.push(r);
    });
    
    Object.keys(summary).forEach(key => {
      summary[key].average = (summary[key].total / summary[key].count).toFixed(1);
    });
    
    return summary;
  };

  const handleSubmitRating = () => {
    if (ratingForm.rating === 0) {
      alert('Por favor selecciona una calificación');
      return;
    }
    if (!ratingForm.comment.trim()) {
      alert('Por favor agrega un comentario');
      return;
    }
    
    alert(`Calificación enviada exitosamente!\n\nCalificación: ${ratingForm.rating} estrellas\nCategoría: ${ratingForm.category}\nComentario: ${ratingForm.comment}`);
    
    setShowRatingModal(false);
    setSelectedTarget(null);
    setRatingForm({ category: 'GESTION_GENERAL', rating: 0, comment: '', period: 'MENSUAL' });
  };

  const renderStars = (rating, interactive = false, size = 24) => {
    return (
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={size}
            fill={star <= rating ? '#f59e0b' : 'none'}
            color={star <= rating ? '#f59e0b' : '#d1d5db'}
            style={{ cursor: interactive ? 'pointer' : 'default' }}
            onClick={() => interactive && setRatingForm(prev => ({ ...prev, rating: star }))}
          />
        ))}
      </div>
    );
  };

  const getRoleLabel = () => {
    if (isAdmin) return 'Administrador';
    if (isConsejero) return 'Consejero';
    if (isContador) return 'Contador';
    if (isRevisor) return 'Revisor Fiscal';
    return 'Usuario';
  };

  const targets = getRatingTargets();
  const summary = getSummary();

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
          <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Star size={24} color="white" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#102033' }}>Evaluación de Desempeño</h1>
            <p style={{ margin: 0, color: '#65758a', fontSize: '0.9rem' }}>Calificaciones entre roles - {getRoleLabel()}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', flexWrap: 'wrap' }}>
        {[
          { id: 'rate', label: 'Calificar', icon: <Star size={18} /> },
          { id: 'history', label: 'Historial', icon: <Clock size={18} /> },
          { id: 'summary', label: 'Resumen', icon: <BarChart3 size={18} /> }
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
              background: activeTab === tab.id ? '#f59e0b' : 'transparent',
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

      {/* Tab: Calificar */}
      {activeTab === 'rate' && (
        <div>
          <div style={{ background: '#fffbeb', padding: '16px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #fcd34d' }}>
            <p style={{ margin: 0, color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={20} />
              <span>Las calificaciones son confidenciales y se utilizan para mejorar la gestión del conjunto.</span>
            </p>
          </div>

          <h3 style={{ margin: '0 0 16px', color: '#102033' }}>¿A quién deseas calificar?</h3>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            {targets.map(target => (
              <div
                key={target.id}
                onClick={() => { setSelectedTarget(target); setShowRatingModal(true); }}
                style={{
                  background: 'white',
                  padding: '24px',
                  borderRadius: '16px',
                  border: '2px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px'
                }}
                onMouseOver={e => e.currentTarget.style.borderColor = target.color}
                onMouseOut={e => e.currentTarget.style.borderColor = '#e2e8f0'}
              >
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  background: `${target.color}20`, 
                  borderRadius: '16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '2rem'
                }}>
                  {target.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 4px', color: '#102033' }}>{target.name}</h3>
                  <p style={{ margin: 0, color: '#65758a', fontSize: '0.9rem' }}>
                    Evaluar desempeño del período actual
                  </p>
                </div>
                <div style={{ 
                  background: target.color, 
                  color: 'white', 
                  padding: '10px 20px', 
                  borderRadius: '10px', 
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Star size={18} /> Calificar
                </div>
              </div>
            ))}
          </div>

          {targets.length === 0 && (
            <div style={{ background: '#f8fafc', padding: '40px', borderRadius: '16px', textAlign: 'center' }}>
              <Users size={48} color="#94a3b8" />
              <p style={{ color: '#64748b', marginTop: '16px' }}>No tienes roles asignados para calificar</p>
            </div>
          )}
        </div>
      )}

      {/* Tab: Historial */}
      {activeTab === 'history' && (
        <div style={{ display: 'grid', gap: '16px' }}>
          {ratingsHistory.map(rating => (
            <div key={rating.id} style={{ 
              background: 'white', 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0',
              overflow: 'hidden'
            }}>
              <div style={{ 
                background: rating.rating >= 4 ? '#d1fae5' : rating.rating >= 3 ? '#fef3c7' : '#fee2e2',
                padding: '12px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: '600', color: '#102033' }}>{rating.fromName}</span>
                  <span style={{ color: '#65758a' }}>→</span>
                  <span style={{ fontWeight: '600', color: '#102033' }}>{rating.toName}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {renderStars(rating.rating, false, 18)}
                  <span style={{ 
                    background: rating.rating >= 4 ? '#059669' : rating.rating >= 3 ? '#f59e0b' : '#ef4444',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontWeight: '700',
                    fontSize: '0.9rem'
                  }}>
                    {rating.rating}/5
                  </span>
                </div>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <span style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', color: '#475569' }}>
                    📋 {rating.categoryName}
                  </span>
                  <span style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', color: '#475569' }}>
                    📅 {rating.period}
                  </span>
                  <span style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', color: '#475569' }}>
                    🕐 {new Date(rating.date).toLocaleDateString('es-CO')}
                  </span>
                </div>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px' }}>
                  <p style={{ margin: 0, color: '#374151', lineHeight: '1.6' }}>
                    <MessageSquare size={16} style={{ display: 'inline', marginRight: '8px', color: '#6b7280' }} />
                    "{rating.comment}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Resumen */}
      {activeTab === 'summary' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {[
              { role: 'ADMIN', name: 'Administrador', icon: '🏢', color: '#667eea' },
              { role: 'CONSEJERO', name: 'Consejo de Administración', icon: '👥', color: '#10b981' },
              { role: 'CONTADOR', name: 'Contador', icon: '📊', color: '#f59e0b' },
              { role: 'REVISOR_FISCAL', name: 'Revisor Fiscal', icon: '📋', color: '#ef4444' }
            ].map(item => {
              const data = summary[item.role] || { average: '-', count: 0, ratings: [] };
              const avgNum = parseFloat(data.average) || 0;
              
              return (
                <div key={item.role} style={{ 
                  background: 'white', 
                  borderRadius: '16px', 
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 100%)`,
                    padding: '20px',
                    color: 'white'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '2rem' }}>{item.icon}</span>
                      <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{item.name}</h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span style={{ fontSize: '3rem', fontWeight: '700' }}>{data.average}</span>
                      <span style={{ opacity: 0.8 }}>/ 5</span>
                    </div>
                    {renderStars(Math.round(avgNum), false, 20)}
                  </div>
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <span style={{ color: '#65758a' }}>Total evaluaciones:</span>
                      <strong>{data.count}</strong>
                    </div>
                    
                    {data.ratings.length > 0 && (
                      <div>
                        <p style={{ margin: '0 0 8px', color: '#65758a', fontSize: '0.85rem' }}>Últimas evaluaciones:</p>
                        {data.ratings.slice(0, 2).map((r, idx) => (
                          <div key={idx} style={{ 
                            background: '#f8fafc', 
                            padding: '10px', 
                            borderRadius: '8px', 
                            marginBottom: '8px',
                            fontSize: '0.85rem'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <span style={{ color: '#475569' }}>{r.categoryName}</span>
                              {renderStars(r.rating, false, 14)}
                            </div>
                            <p style={{ margin: 0, color: '#6b7280', fontSize: '0.8rem' }}>
                              Por: {r.fromName} - {r.period}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {data.count === 0 && (
                      <p style={{ margin: 0, color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>
                        Sin evaluaciones aún
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Indicadores generales */}
          <div style={{ marginTop: '24px', background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 20px', color: '#102033', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <TrendingUp size={24} color="#059669" /> Indicadores de Gestión
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <ThumbsUp size={32} color="#059669" />
                <p style={{ margin: '12px 0 4px', fontSize: '2rem', fontWeight: '700', color: '#065f46' }}>
                  {ratingsHistory.filter(r => r.rating >= 4).length}
                </p>
                <span style={{ color: '#047857', fontSize: '0.9rem' }}>Evaluaciones Positivas</span>
              </div>
              <div style={{ background: '#fef3c7', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <Award size={32} color="#f59e0b" />
                <p style={{ margin: '12px 0 4px', fontSize: '2rem', fontWeight: '700', color: '#92400e' }}>
                  {(ratingsHistory.reduce((sum, r) => sum + r.rating, 0) / ratingsHistory.length).toFixed(1)}
                </p>
                <span style={{ color: '#92400e', fontSize: '0.9rem' }}>Promedio General</span>
              </div>
              <div style={{ background: '#dbeafe', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <FileText size={32} color="#2563eb" />
                <p style={{ margin: '12px 0 4px', fontSize: '2rem', fontWeight: '700', color: '#1e40af' }}>
                  {ratingsHistory.length}
                </p>
                <span style={{ color: '#1e40af', fontSize: '0.9rem' }}>Total Evaluaciones</span>
              </div>
              <div style={{ background: '#f1f5f9', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <Calendar size={32} color="#475569" />
                <p style={{ margin: '12px 0 4px', fontSize: '1.2rem', fontWeight: '700', color: '#1e293b' }}>
                  Junio 2026
                </p>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Período Actual</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Calificación */}
      {showRatingModal && selectedTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setShowRatingModal(false)}>
          <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ 
              background: `linear-gradient(135deg, ${selectedTarget.color} 0%, ${selectedTarget.color}dd 100%)`,
              padding: '24px',
              color: 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '3rem' }}>{selectedTarget.icon}</span>
                <div>
                  <h2 style={{ margin: '0 0 4px' }}>Evaluar</h2>
                  <p style={{ margin: 0, opacity: 0.9 }}>{selectedTarget.name}</p>
                </div>
              </div>
            </div>
            
            <div style={{ padding: '24px' }}>
              {/* Categoría */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                  Categoría a evaluar
                </label>
                <select
                  value={ratingForm.category}
                  onChange={e => setRatingForm(prev => ({ ...prev, category: e.target.value }))}
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '1rem' }}
                >
                  {getRatingCategories(selectedTarget.role).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name} - {cat.description}</option>
                  ))}
                </select>
              </div>

              {/* Período */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                  Período de evaluación
                </label>
                <select
                  value={ratingForm.period}
                  onChange={e => setRatingForm(prev => ({ ...prev, period: e.target.value }))}
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '1rem' }}
                >
                  <option value="MENSUAL">Junio 2026 (Mensual)</option>
                  <option value="TRIMESTRAL">Q2 2026 (Trimestral)</option>
                  <option value="SEMESTRAL">1er Semestre 2026</option>
                  <option value="ANUAL">Año 2026</option>
                </select>
              </div>

              {/* Calificación */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: '#374151' }}>
                  Calificación
                </label>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                  {renderStars(ratingForm.rating, true, 40)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.85rem', color: '#6b7280' }}>
                  <span>Deficiente</span>
                  <span>Excelente</span>
                </div>
              </div>

              {/* Comentario */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                  Comentarios y observaciones *
                </label>
                <textarea
                  value={ratingForm.comment}
                  onChange={e => setRatingForm(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Describe tu evaluación, aspectos positivos y áreas de mejora..."
                  rows={4}
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '1rem', resize: 'vertical' }}
                />
              </div>

              {/* Botones */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowRatingModal(false)}
                  style={{ flex: 1, padding: '14px', border: '1px solid #d1d5db', borderRadius: '10px', background: 'white', cursor: 'pointer', fontWeight: '600' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmitRating}
                  style={{ 
                    flex: 1, 
                    padding: '14px', 
                    border: 'none', 
                    borderRadius: '10px', 
                    background: selectedTarget.color, 
                    color: 'white', 
                    cursor: 'pointer', 
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Send size={18} /> Enviar Evaluación
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
