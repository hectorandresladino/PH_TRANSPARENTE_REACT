import React, { useState } from 'react';
import { Building2, ShieldCheck, Vote, FileText, Bell, Car, Search, Users, BarChart3, Download, Check, Star, Grid } from 'lucide-react';
import { getModules } from './api.js';
import './styles.css';

const categoryIcons = {
  'Administración': <Building2 size={24} />,
  'Comunidad': <Users size={24} />,
  'Seguridad': <ShieldCheck size={24} />,
  'Financiero': <BarChart3 size={24} />,
  'Operación': <Car size={24} />,
  'Convivencia': <Vote size={24} />,
  'Documental': <FileText size={24} />,
  'Gobierno': <Vote size={24} />,
  'Contratación': <FileText size={24} />,
  'Proyectos': <Building2 size={24} />,
  'Reportes': <BarChart3 size={24} />,
  'Transparencia': <Bell size={24} />
};

const categoryColors = {
  'Administración': '#3b82f6',
  'Comunidad': '#10b981',
  'Seguridad': '#ef4444',
  'Financiero': '#f59e0b',
  'Operación': '#8b5cf6',
  'Convivencia': '#ec4899',
  'Documental': '#6366f1',
  'Gobierno': '#14b8a6',
  'Contratación': '#f97316',
  'Proyectos': '#06b6d4',
  'Reportes': '#84cc16',
  'Transparencia': '#a855f7'
};

export default function AppStore() {
  const [modules, setModules] = useState([]);
  const [installed, setInstalled] = useState(new Set([1, 2, 3, 4, 5])); // Módulos instalados por defecto
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  React.useEffect(() => {
    getModules().then(setModules);
  }, []);

  const categories = ['Todas', ...new Set(modules.map(m => m.category))];
  
  const filtered = modules.filter(m => {
    const matchesText = `${m.name} ${m.purpose} ${m.category}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || m.category === selectedCategory;
    return matchesText && matchesCategory;
  });

  const toggleInstall = (moduleId) => {
    setInstalled(prev => {
      const newInstalled = new Set(prev);
      if (newInstalled.has(moduleId)) {
        newInstalled.delete(moduleId);
      } else {
        newInstalled.add(moduleId);
      }
      return newInstalled;
    });
  };

  const isInstalled = (moduleId) => installed.has(moduleId);

  return (
    <div className="app-store">
      <div className="app-store-header">
        <div className="header-content">
          <div className="header-title">
            <Grid size={32} />
            <h1>App Store</h1>
          </div>
          <p>Explora e instala los 24 módulos del sistema PH Transparente</p>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <Download size={18} />
            <span>{installed.size} instalados</span>
          </div>
          <div className="stat-badge">
            <Star size={18} />
            <span>{modules.length} disponibles</span>
          </div>
        </div>
      </div>

      <div className="app-store-filters">
        <div className="search-bar">
          <Search size={20} />
          <input 
            placeholder="Buscar módulos..." 
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="app-grid">
        {filtered.map(module => (
          <AppCard 
            key={module.id} 
            module={module}
            isInstalled={isInstalled(module.id)}
            onToggleInstall={() => toggleInstall(module.id)}
            icon={categoryIcons[module.category] || <Building2 size={24} />}
            color={categoryColors[module.category] || '#3b82f6'}
          />
        ))}
      </div>
    </div>
  );
}

function AppCard({ module, isInstalled, onToggleInstall, icon, color }) {
  return (
    <article className="app-card">
      <div className="app-icon" style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div className="app-info">
        <div className="app-header">
          <h3>{module.name}</h3>
          <span className="app-category" style={{ color }}>{module.category}</span>
        </div>
        <p className="app-description">{module.purpose}</p>
        <div className="app-meta">
          <span className="app-id">Módulo #{module.id}</span>
          <div className="app-rating">
            <Star size={14} fill="#fbbf24" color="#fbbf24" />
            <span>4.5</span>
          </div>
        </div>
      </div>
      <button 
        className={`install-btn ${isInstalled ? 'installed' : ''}`}
        onClick={onToggleInstall}
      >
        {isInstalled ? (
          <>
            <Check size={18} />
            <span>Instalado</span>
          </>
        ) : (
          <>
            <Download size={18} />
            <span>Instalar</span>
          </>
        )}
      </button>
    </article>
  );
}
