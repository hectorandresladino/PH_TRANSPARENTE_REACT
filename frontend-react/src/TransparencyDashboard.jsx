import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, TrendingUp, TrendingDown, DollarSign, Calendar, FileText, Building, PieChart, CheckCircle, XCircle, Clock } from 'lucide-react';

import { API_URL } from './api.js';

export default function TransparencyDashboard() {
  const [metrics, setMetrics] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('actual');

  useEffect(() => {
    fetchMetrics();
    fetchAlerts();
  }, [selectedPeriod]);

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`${API_URL}/transparency-metrics/period/${selectedPeriod}`);
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await fetch(`${API_URL}/alerts/public`);
      if (response.ok) {
        const data = await response.json();
        setAlerts(data.filter(alert => alert.status === 'ACTIVO'));
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const getComplianceColor = (isCompliant) => {
    return isCompliant ? 'compliant-green' : 'compliant-red';
  };

  const getSeverityColor = (severity) => {
    switch(severity?.toLowerCase()) {
      case 'alta': return 'severity-alta';
      case 'media': return 'severity-media';
      case 'baja': return 'severity-baja';
      default: return 'severity-media';
    }
  };

  const getComplianceIcon = (isCompliant) => {
    return isCompliant ? <CheckCircle size={20} /> : <XCircle size={20} />;
  };

  const groupedMetrics = metrics.reduce((acc, metric) => {
    if (!acc[metric.metricCategory]) {
      acc[metric.metricCategory] = [];
    }
    acc[metric.metricCategory].push(metric);
    return acc;
  }, {});

  const complianceRate = metrics.length > 0 
    ? (metrics.filter(m => m.isCompliant).length / metrics.length * 100).toFixed(0)
    : 0;

  if (loading) {
    return (
      <div className="transparency-dashboard">
        <div className="loading">Cargando métricas de transparencia...</div>
      </div>
    );
  }

  return (
    <div className="transparency-dashboard">
      <div className="dashboard-header">
        <div className="header-title">
          <ShieldCheck size={32} />
          <h1>Dashboard de Transparencia</h1>
        </div>
        <div className="period-selector">
          <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
            <option value="actual">Período Actual</option>
            <option value="mensual">Mensual</option>
            <option value="trimestral">Trimestral</option>
            <option value="anual">Anual</option>
          </select>
        </div>
      </div>

      <div className="compliance-overview">
        <div className="compliance-card">
          <div className="compliance-icon">
            <PieChart size={40} />
          </div>
          <div className="compliance-info">
            <h3>Tasa de Cumplimiento</h3>
            <div className="compliance-rate">
              <span className={`rate-value ${complianceRate >= 80 ? 'rate-good' : complianceRate >= 50 ? 'rate-medium' : 'rate-bad'}`}>
                {complianceRate}%
              </span>
            </div>
            <p>de {metrics.length} métricas legales</p>
          </div>
        </div>

        <div className="compliance-card">
          <div className="compliance-icon">
            <AlertTriangle size={40} />
          </div>
          <div className="compliance-info">
            <h3>Alertas Activas</h3>
            <div className="compliance-rate">
              <span className={`rate-value ${alerts.length === 0 ? 'rate-good' : alerts.length <= 3 ? 'rate-medium' : 'rate-bad'}`}>
                {alerts.length}
              </span>
            </div>
            <p>requieren atención</p>
          </div>
        </div>

        <div className="compliance-card">
          <div className="compliance-icon">
            <CheckCircle size={40} />
          </div>
          <div className="compliance-info">
            <h3>Métricas Cumplidas</h3>
            <div className="compliance-rate">
              <span className="rate-value rate-good">
                {metrics.filter(m => m.isCompliant).length}
              </span>
            </div>
            <p>de {metrics.length} totales</p>
          </div>
        </div>

        <div className="compliance-card">
          <div className="compliance-icon">
            <XCircle size={40} />
          </div>
          <div className="compliance-info">
            <h3>Métricas Incumplidas</h3>
            <div className="compliance-rate">
              <span className={`rate-value ${metrics.filter(m => !m.isCompliant).length === 0 ? 'rate-good' : 'rate-bad'}`}>
                {metrics.filter(m => !m.isCompliant).length}
              </span>
            </div>
            <p>requieren acción</p>
          </div>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="alerts-section">
          <h2>
            <AlertTriangle size={24} />
            Alertas Activas para Copropietarios
          </h2>
          <div className="alerts-grid">
            {alerts.map(alert => (
              <div key={alert.id} className={`alert-card ${getSeverityColor(alert.severity)}`}>
                <div className="alert-header">
                  <span className="alert-type">{alert.alertType}</span>
                  <span className="alert-severity">{alert.severity}</span>
                </div>
                <h3>{alert.title}</h3>
                <p>{alert.description}</p>
                <div className="alert-footer">
                  <span className="alert-date">
                    <Calendar size={14} />
                    {alert.alertDate}
                  </span>
                  {alert.relatedModule && (
                    <span className="alert-module">{alert.relatedModule}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="metrics-section">
        <h2>
          <FileText size={24} />
          Métricas de Cumplimiento Legal - Ley 675 de 2001
        </h2>
        
        {Object.entries(groupedMetrics).map(([category, categoryMetrics]) => (
          <div key={category} className="category-section">
            <h3 className="category-title">
              {category === 'LEGAL' && <Building size={20} />}
              {category === 'FINANCIERO' && <DollarSign size={20} />}
              {category === 'MANTENIMIENTO' && <TrendingUp size={20} />}
              {category === 'ADMINISTRATIVO' && <FileText size={20} />}
              {category}
            </h3>
            <div className="metrics-grid">
              {categoryMetrics.map(metric => (
                <div key={metric.id} className={`metric-card ${getComplianceColor(metric.isCompliant)}`}>
                  <div className="metric-header">
                    <h4>{metric.metricName}</h4>
                    <div className="compliance-badge">
                      {getComplianceIcon(metric.isCompliant)}
                      <span>{metric.isCompliant ? 'CUMPLE' : 'NO CUMPLE'}</span>
                    </div>
                  </div>
                  {metric.relatedArticle && (
                    <div className="metric-article">
                      <FileText size={14} />
                      <span>Art. {metric.relatedArticle} Ley 675</span>
                    </div>
                  )}
                  <div className="metric-value">
                    <span className="value-label">Valor Actual:</span>
                    <span className="value-number">{metric.metricValue}</span>
                    {metric.metricPercentage && (
                      <span className="value-percentage">({metric.metricPercentage}%)</span>
                    )}
                  </div>
                  {metric.targetValue && (
                    <div className="metric-target">
                      <span className="target-label">Objetivo:</span>
                      <span className="target-number">{metric.targetValue}</span>
                      {metric.targetPercentage && (
                        <span className="target-percentage">({metric.targetPercentage}%)</span>
                      )}
                    </div>
                  )}
                  {metric.description && (
                    <p className="metric-description">{metric.description}</p>
                  )}
                  {!metric.isCompliant && metric.complianceNotes && (
                    <div className="compliance-notes">
                      <AlertTriangle size={14} />
                      <span>{metric.complianceNotes}</span>
                    </div>
                  )}
                  <div className="metric-footer">
                    <span className="metric-status">{metric.status}</span>
                    <span className="metric-period">
                      <Calendar size={14} />
                      {metric.period}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {metrics.length === 0 && (
        <div className="no-metrics">
          <Clock size={48} />
          <h3>No hay métricas registradas para este período</h3>
          <p>La administración debe cargar las métricas de transparencia</p>
        </div>
      )}
    </div>
  );
}
