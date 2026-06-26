import React, { useState } from 'react';
import { 
  LayoutGrid, Users, Shield, UserCheck, Building, 
  ChevronDown, ChevronUp, Settings, Lock, Eye, 
  DollarSign, FileText, Calendar, Bell, FileSpreadsheet,
  Sparkles, Crown, Home, Briefcase, Heart, Star,
  Calculator, Search, ShieldCheck, Sparkle, BarChart3, ClipboardList
} from 'lucide-react';

const ROLES_CONFIG = {
  ADMIN: {
    name: 'Administrador',
    description: 'Control total del sistema',
    icon: <Crown size={28} />,
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    bgColor: '#f5f3ff',
    modules: [
      { name: 'dashboard', label: 'Dashboard', icon: <LayoutGrid size={20} />, description: 'Vista general' },
      { name: 'users', label: 'Usuarios', icon: <Users size={20} />, description: 'Gestión de usuarios' },
      { name: 'pqr', label: 'PQR', icon: <FileText size={20} />, description: 'Peticiones y quejas' },
      { name: 'payments', label: 'Pagos', icon: <DollarSign size={20} />, description: 'Gestión de pagos' },
      { name: 'reservations', label: 'Reservas', icon: <Calendar size={20} />, description: 'Reservas de espacios' },
      { name: 'visitors', label: 'Visitantes', icon: <Shield size={20} />, description: 'Control de visitantes' },
      { name: 'contracts', label: 'Contratos', icon: <FileText size={20} />, description: 'Gestión de contratos' },
      { name: 'fines', label: 'Multas', icon: <Lock size={20} />, description: 'Gestión de multas' },
      { name: 'documents', label: 'Documentos', icon: <FileText size={20} />, description: 'Gestión documental' },
      { name: 'assemblies', label: 'Asambleas', icon: <Users size={20} />, description: 'Gestión de asambleas' },
      { name: 'votes', label: 'Votaciones', icon: <FileText size={20} />, description: 'Sistema de votación' },
      { name: 'councils', label: 'Consejo', icon: <UserCheck size={20} />, description: 'Gestión del consejo' },
      { name: 'security', label: 'Seguridad', icon: <Shield size={20} />, description: 'Control de seguridad' },
      { name: 'contractors', label: 'Contrataciones', icon: <Building size={20} />, description: 'Gestión de contratistas' },
      { name: 'property-units', label: 'Unidades', icon: <Building size={20} />, description: 'Gestión de unidades' },
      { name: 'reserve-funds', label: 'Fondo Reserva', icon: <DollarSign size={20} />, description: 'Fondo de reserva' },
      { name: 'annual-budgets', label: 'Presupuesto', icon: <Calendar size={20} />, description: 'Presupuesto anual' },
      { name: 'insurance-policies', label: 'Seguros', icon: <Shield size={20} />, description: 'Pólizas de seguro' },
      { name: 'bank-accounts', label: 'Cuentas', icon: <DollarSign size={20} />, description: 'Cuentas bancarias' },
      { name: 'official-minutes', label: 'Actas Oficiales', icon: <FileText size={20} />, description: 'Libro de actas' },
      { name: 'council-minutes', label: 'Actas Consejo', icon: <FileText size={20} />, description: 'Actas del consejo' },
      { name: 'accounting-reports', label: 'Inf. Contables', icon: <DollarSign size={20} />, description: 'Informes del contador' },
      { name: 'fiscal-reports', label: 'Inf. Revisoría', icon: <FileSpreadsheet size={20} />, description: 'Informes del revisor' },
      { name: 'horizontal-property-regulations', label: 'Reglamento', icon: <FileText size={20} />, description: 'Reglamento PH' },
      { name: 'alerts', label: 'Alertas', icon: <Bell size={20} />, description: 'Sistema de alertas' },
      { name: 'transparency', label: 'Transparencia', icon: <Eye size={20} />, description: 'Dashboard transparencia' },
      { name: 'authorizations', label: 'Autorizaciones', icon: <Lock size={20} />, description: 'Gestión de permisos' },
      { name: 'reports', label: 'Reportes', icon: <FileSpreadsheet size={20} />, description: 'Generación de reportes' },
      { name: 'personnel-ratings', label: 'Calificaciones', icon: <Star size={20} />, description: 'Evaluación de personal' },
      { name: 'support-tasks', label: 'Soporte', icon: <Briefcase size={20} />, description: 'Tareas de soporte' },
      { name: 'task-statistics', label: 'Estadísticas', icon: <BarChart3 size={20} />, description: 'Estadísticas de tareas' },
      { name: 'staff-info', label: 'Personal', icon: <Users size={20} />, description: 'Info. del personal clave' },
      { name: 'appstore', label: 'App Store', icon: <LayoutGrid size={20} />, description: 'Tienda de aplicaciones' }
    ]
  },
  CONSEJERO: {
    name: 'Consejeros',
    description: 'Gestión y decisiones legales',
    icon: <UserCheck size={28} />,
    color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    bgColor: '#f0fdf4',
    modules: [
      { name: 'dashboard', label: 'Dashboard', icon: <LayoutGrid size={20} />, description: 'Vista general' },
      { name: 'council-minutes', label: 'Actas Consejo', icon: <FileText size={20} />, description: 'Cargar actas de reuniones' },
      { name: 'assemblies', label: 'Asambleas', icon: <Users size={20} />, description: 'Gestión de asambleas' },
      { name: 'votes', label: 'Votaciones', icon: <FileText size={20} />, description: 'Sistema de votación' },
      { name: 'councils', label: 'Consejo', icon: <UserCheck size={20} />, description: 'Gestión del consejo' },
      { name: 'documents', label: 'Documentos', icon: <FileText size={20} />, description: 'Gestión documental' },
      { name: 'accounting-reports', label: 'Inf. Contables', icon: <DollarSign size={20} />, description: 'Ver informes del contador' },
      { name: 'fiscal-reports', label: 'Inf. Revisoría', icon: <FileSpreadsheet size={20} />, description: 'Ver informes del revisor' },
      { name: 'security', label: 'Seguridad', icon: <Shield size={20} />, description: 'Control de seguridad' },
      { name: 'contractors', label: 'Contrataciones', icon: <Building size={20} />, description: 'Gestión de contratistas' },
      { name: 'property-units', label: 'Unidades', icon: <Building size={20} />, description: 'Gestión de unidades' },
      { name: 'annual-budgets', label: 'Presupuesto', icon: <Calendar size={20} />, description: 'Presupuesto anual' },
      { name: 'official-minutes', label: 'Actas Oficiales', icon: <FileText size={20} />, description: 'Libro de actas' },
      { name: 'horizontal-property-regulations', label: 'Reglamento', icon: <FileText size={20} />, description: 'Reglamento PH' },
      { name: 'alerts', label: 'Alertas', icon: <Bell size={20} />, description: 'Sistema de alertas' },
      { name: 'reports', label: 'Reportes', icon: <FileSpreadsheet size={20} />, description: 'Generación de reportes' },
      { name: 'personnel-ratings', label: 'Calificaciones', icon: <Star size={20} />, description: 'Evaluación de personal' },
      { name: 'support-tasks', label: 'Soporte', icon: <Briefcase size={20} />, description: 'Tareas de soporte' },
      { name: 'task-statistics', label: 'Estadísticas', icon: <BarChart3 size={20} />, description: 'Estadísticas de tareas' }
    ]
  },
  COPIROPIETARIO: {
    name: 'Copropietarios',
    description: 'Residentes y propietarios',
    icon: <Home size={28} />,
    color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    bgColor: '#f5f3ff',
    modules: [
      { name: 'dashboard', label: 'Dashboard', icon: <LayoutGrid size={20} />, description: 'Vista general' },
      { name: 'pqr', label: 'PQR', icon: <FileText size={20} />, description: 'Peticiones y quejas' },
      { name: 'reservations', label: 'Reservas', icon: <Calendar size={20} />, description: 'Reservas de espacios' },
      { name: 'visitors', label: 'Visitantes', icon: <Shield size={20} />, description: 'Control de visitantes' },
      { name: 'documents', label: 'Documentos', icon: <FileText size={20} />, description: 'Gestión documental' },
      { name: 'payments', label: 'Pagos', icon: <DollarSign size={20} />, description: 'Gestión de pagos' },
      { name: 'council-minutes', label: 'Actas Consejo', icon: <FileText size={20} />, description: 'Ver actas del consejo' },
      { name: 'accounting-reports', label: 'Inf. Contables', icon: <DollarSign size={20} />, description: 'Ver informes contables' },
      { name: 'fiscal-reports', label: 'Inf. Revisoría', icon: <FileSpreadsheet size={20} />, description: 'Ver informes del revisor' },
      { name: 'property-units', label: 'Unidades', icon: <Building size={20} />, description: 'Gestión de unidades' },
      { name: 'alerts', label: 'Alertas', icon: <Bell size={20} />, description: 'Sistema de alertas' },
      { name: 'transparency', label: 'Transparencia', icon: <Eye size={20} />, description: 'Dashboard transparencia' },
      { name: 'reports', label: 'Reportes', icon: <FileSpreadsheet size={20} />, description: 'Generación de reportes' },
      { name: 'personnel-ratings', label: 'Calificaciones', icon: <Star size={20} />, description: 'Evaluación de personal' },
      { name: 'support-tasks', label: 'Soporte', icon: <Briefcase size={20} />, description: 'Tareas de soporte' }
    ]
  },
  CONTADOR: {
    name: 'Contador',
    description: 'Gestión contable y financiera',
    icon: <Calculator size={28} />,
    color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    bgColor: '#fffbeb',
    modules: [
      { name: 'dashboard', label: 'Dashboard', icon: <LayoutGrid size={20} />, description: 'Vista general' },
      { name: 'accounting-reports', label: 'Mis Informes', icon: <FileSpreadsheet size={20} />, description: 'Cargar informes contables' },
      { name: 'payments', label: 'Pagos', icon: <DollarSign size={20} />, description: 'Gestión de pagos' },
      { name: 'bank-accounts', label: 'Cuentas Bancarias', icon: <DollarSign size={20} />, description: 'Cuentas bancarias' },
      { name: 'reserve-funds', label: 'Fondo Reserva', icon: <DollarSign size={20} />, description: 'Fondo de reserva' },
      { name: 'annual-budgets', label: 'Presupuesto', icon: <Calendar size={20} />, description: 'Presupuesto anual' },
      { name: 'fines', label: 'Multas', icon: <Lock size={20} />, description: 'Gestión de multas' },
      { name: 'contracts', label: 'Contratos', icon: <FileText size={20} />, description: 'Gestión de contratos' },
      { name: 'council-minutes', label: 'Actas Consejo', icon: <FileText size={20} />, description: 'Ver actas del consejo' },
      { name: 'fiscal-reports', label: 'Inf. Revisoría', icon: <FileSpreadsheet size={20} />, description: 'Ver informes del revisor' },
      { name: 'reports', label: 'Reportes', icon: <FileSpreadsheet size={20} />, description: 'Reportes financieros' },
      { name: 'documents', label: 'Documentos', icon: <FileText size={20} />, description: 'Documentos contables' },
      { name: 'transparency', label: 'Transparencia', icon: <Eye size={20} />, description: 'Dashboard transparencia' },
      { name: 'staff-info', label: 'Personal', icon: <Users size={20} />, description: 'Info. del personal clave' }
    ]
  },
  REVISOR_FISCAL: {
    name: 'Revisor Fiscal',
    description: 'Auditoría y control fiscal',
    icon: <Search size={28} />,
    color: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    bgColor: '#fef2f2',
    modules: [
      { name: 'dashboard', label: 'Dashboard', icon: <LayoutGrid size={20} />, description: 'Vista general' },
      { name: 'fiscal-reports', label: 'Mis Informes', icon: <FileSpreadsheet size={20} />, description: 'Cargar informes de revisoría' },
      { name: 'payments', label: 'Pagos', icon: <DollarSign size={20} />, description: 'Auditoría de pagos' },
      { name: 'bank-accounts', label: 'Cuentas Bancarias', icon: <DollarSign size={20} />, description: 'Revisión de cuentas' },
      { name: 'reserve-funds', label: 'Fondo Reserva', icon: <DollarSign size={20} />, description: 'Auditoría de fondos' },
      { name: 'annual-budgets', label: 'Presupuesto', icon: <Calendar size={20} />, description: 'Revisión presupuestal' },
      { name: 'contracts', label: 'Contratos', icon: <FileText size={20} />, description: 'Auditoría de contratos' },
      { name: 'council-minutes', label: 'Actas Consejo', icon: <FileText size={20} />, description: 'Ver actas del consejo' },
      { name: 'accounting-reports', label: 'Inf. Contables', icon: <DollarSign size={20} />, description: 'Ver informes del contador' },
      { name: 'official-minutes', label: 'Actas Oficiales', icon: <FileText size={20} />, description: 'Libro de actas' },
      { name: 'reports', label: 'Reportes', icon: <FileSpreadsheet size={20} />, description: 'Informes de auditoría' },
      { name: 'documents', label: 'Documentos', icon: <FileText size={20} />, description: 'Documentos fiscales' },
      { name: 'transparency', label: 'Transparencia', icon: <Eye size={20} />, description: 'Dashboard transparencia' },
      { name: 'assemblies', label: 'Asambleas', icon: <Users size={20} />, description: 'Participación en asambleas' },
      { name: 'task-statistics', label: 'Estadísticas', icon: <BarChart3 size={20} />, description: 'Estadísticas de tareas' },
      { name: 'staff-info', label: 'Personal', icon: <Users size={20} />, description: 'Info. del personal clave' }
    ]
  },
  VIGILANCIA: {
    name: 'Empresa de Vigilancia',
    description: 'Seguridad y control de acceso',
    icon: <ShieldCheck size={28} />,
    color: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
    bgColor: '#f1f5f9',
    modules: [
      { name: 'dashboard', label: 'Dashboard', icon: <LayoutGrid size={20} />, description: 'Vista general' },
      { name: 'security-reports', label: 'Minutas/Reportes', icon: <ClipboardList size={20} />, description: 'Minutas, reportes, casos y eventos' },
      { name: 'security', label: 'Seguridad', icon: <Shield size={20} />, description: 'Control de seguridad' },
      { name: 'visitors', label: 'Visitantes', icon: <Users size={20} />, description: 'Registro de visitantes' },
      { name: 'alerts', label: 'Alertas', icon: <Bell size={20} />, description: 'Alertas de seguridad' },
      { name: 'reports', label: 'Reportes', icon: <FileSpreadsheet size={20} />, description: 'Informes de seguridad' },
      { name: 'support-tasks', label: 'Tareas', icon: <Briefcase size={20} />, description: 'Tareas asignadas' },
      { name: 'personnel-ratings', label: 'Calificaciones', icon: <Star size={20} />, description: 'Ver calificaciones' }
    ]
  },
  ASEO: {
    name: 'Empresa de Aseo',
    description: 'Limpieza y mantenimiento',
    icon: <Sparkle size={28} />,
    color: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    bgColor: '#ecfeff',
    modules: [
      { name: 'dashboard', label: 'Dashboard', icon: <LayoutGrid size={20} />, description: 'Vista general' },
      { name: 'cleaning-tasks', label: 'Control Tareas', icon: <ClipboardList size={20} />, description: 'Tareas con cronograma y estadísticas' },
      { name: 'support-tasks', label: 'Tareas Soporte', icon: <Briefcase size={20} />, description: 'Tareas de soporte' },
      { name: 'reports', label: 'Reportes', icon: <FileSpreadsheet size={20} />, description: 'Informes de servicio' },
      { name: 'alerts', label: 'Alertas', icon: <Bell size={20} />, description: 'Alertas y notificaciones' },
      { name: 'personnel-ratings', label: 'Calificaciones', icon: <Star size={20} />, description: 'Ver calificaciones' },
      { name: 'documents', label: 'Documentos', icon: <FileText size={20} />, description: 'Documentos de servicio' }
    ]
  }
};

export default function AdminDashboard({ onModuleSelect, currentView }) {
  const [expandedRoles, setExpandedRoles] = useState({});

  const toggleRole = (roleKey) => {
    setExpandedRoles(prev => ({
      ...prev,
      [roleKey]: !prev[roleKey]
    }));
  };

  const handleModuleClick = (moduleName) => {
    onModuleSelect(moduleName);
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="header-content">
          <div className="header-icon">
            <Sparkles size={32} />
          </div>
          <div className="header-text">
            <h1>Dashboard de Administración</h1>
            <p>Gestión de Roles y Módulos por Perfil</p>
          </div>
        </div>
        <div className="header-badge">
          <Heart size={16} />
          <span>PH Transparente</span>
        </div>
      </div>

      <div className="roles-grid">
        {Object.entries(ROLES_CONFIG).map(([roleKey, roleConfig]) => (
          <div key={roleKey} className="role-card" style={{ backgroundColor: roleConfig.bgColor }}>
            <div 
              className="role-header"
              onClick={() => toggleRole(roleKey)}
              style={{ background: roleConfig.color }}
            >
              <div className="role-info">
                <div className="role-icon-wrapper">
                  {roleConfig.icon}
                </div>
                <div className="role-details">
                  <h3>{roleConfig.name}</h3>
                  <p className="role-description">{roleConfig.description}</p>
                  <span className="module-count">{roleConfig.modules.length} módulos disponibles</span>
                </div>
              </div>
              <div className="expand-icon">
                {expandedRoles[roleKey] ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </div>
            </div>

            {expandedRoles[roleKey] && (
              <div className="role-modules">
                <div className="modules-list">
                  {roleConfig.modules.map(module => (
                    <button
                      key={module.name}
                      className={`module-item ${currentView === module.name ? 'active' : ''}`}
                      onClick={() => handleModuleClick(module.name)}
                    >
                      <div className="module-icon">{module.icon}</div>
                      <div className="module-info">
                        <span className="module-label">{module.label}</span>
                        <span className="module-description">{module.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
