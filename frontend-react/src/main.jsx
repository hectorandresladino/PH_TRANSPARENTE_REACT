import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Building2, ShieldCheck, Vote, FileText, Bell, Car, Search, Users, BarChart3, LogOut, LayoutGrid, Grid, DollarSign, Calendar, Shield, FileText as FileTextIcon, AlertTriangle, Folder, Users as UsersIcon, Vote as VoteIcon, UserCheck, Building, PiggyBank, CreditCard, BookOpen, Bell as BellIcon, Star, TrendingUp, Menu, Send } from 'lucide-react';
import { getDashboard, getModules } from './api.js';
import { roles } from './modules.js';
import Login from './Login.jsx';
import Register from './Register.jsx';
import ForgotPassword from './ForgotPassword.jsx';
import AppStore from './AppStore.jsx';
import UsersManagement from './UsersManagement.jsx';
import PqrManagement from './PqrManagement.jsx';
import PqrStatistics from './PqrStatistics.jsx';
import PaymentReports from './PaymentReports.jsx';
import PaymentsManagement from './PaymentsManagement.jsx';
import ReservationsManagement from './ReservationsManagement.jsx';
import VisitorsManagement from './VisitorsManagement.jsx';
import ContractsManagement from './ContractsManagement.jsx';
import FinesManagement from './FinesManagement.jsx';
import DocumentsManagement from './DocumentsManagement.jsx';
import AssembliesManagement from './AssembliesManagement.jsx';
import VotesManagement from './VotesManagement.jsx';
import CouncilsManagement from './CouncilsManagement.jsx';
import SecurityManagement from './SecurityManagement.jsx';
import ContractorsManagement from './ContractorsManagement.jsx';
import PropertyUnitsManagement from './PropertyUnitsManagement.jsx';
import ReserveFundsManagement from './ReserveFundsManagement.jsx';
import AnnualBudgetsManagement from './AnnualBudgetsManagement.jsx';
import InsurancePoliciesManagement from './InsurancePoliciesManagement.jsx';
import BankAccountsManagement from './BankAccountsManagement.jsx';
import OfficialMinutesManagement from './OfficialMinutesManagement.jsx';
import HorizontalPropertyRegulationsManagement from './HorizontalPropertyRegulationsManagement.jsx';
import AlertsManagement from './AlertsManagement.jsx';
import TransparencyDashboard from './TransparencyDashboard.jsx';
import ModuleAuthorizationsManagement from './ModuleAuthorizationsManagement.jsx';
import ReportsManagement from './ReportsManagement.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import PersonnelRatingsManagement from './PersonnelRatingsManagement.jsx';
import SupportTasksManagement from './SupportTasksManagement.jsx';
import CouncilMinutesManagement from './CouncilMinutesManagement.jsx';
import AccountingReportsManagement from './AccountingReportsManagement.jsx';
import FiscalReportsManagement from './FiscalReportsManagement.jsx';
import TaskStatistics from './TaskStatistics.jsx';
import SecurityReportsManagement from './SecurityReportsManagement.jsx';
import CleaningTasksManagement from './CleaningTasksManagement.jsx';
import StaffInfoManagement from './StaffInfoManagement.jsx';
import StaffRatingsManagement from './StaffRatingsManagement.jsx';
import './styles.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ color: '#dc2626' }}>Error en la aplicación</h1>
          <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>{this.state.error?.message}</p>
          <div style={{ 
            background: '#f6f9fb', 
            padding: '20px', 
            borderRadius: '12px', 
            textAlign: 'left', 
            marginBottom: '20px',
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            <h3>Detalles del error:</h3>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {this.state.error?.toString()}
            </pre>
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: '#123b62',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Recargar página
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [user, setUser] = useState(null);
  const [modules, setModules] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [authView, setAuthView] = useState('login');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');
  const [allowedModules, setAllowedModules] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    getModules().then(setModules);
    getDashboard().then(setDashboard);
    // Cargar módulos permitidos del localStorage
    const savedModules = localStorage.getItem('allowedModules');
    if (savedModules) {
      setAllowedModules(savedModules.split(','));
    }
  }, []);

  const handleLogin = (userData) => {
    console.log('handleLogin llamado con:', userData);
    console.log('Rol del usuario:', userData.role);
    console.log('Módulos permitidos:', userData.modules);
    setUser(userData);
    setAuthView('login');
    // Actualizar módulos permitidos
    if (userData.modules) {
      const modules = userData.modules.split(',');
      setAllowedModules(modules);
      console.log('allowedModules actualizado:', modules);
    }
  };

  const handleLogout = () => {
    console.log('handleLogout llamado');
    setUser(null);
    setAuthView('login');
    setAllowedModules([]);
    localStorage.removeItem('allowedModules');
  };

  const handleRegister = (userData) => {
    console.log('handleRegister llamado con:', userData);
    setUser(userData);
    setAuthView('login');
  };

  const categories = useMemo(() => ['Todos', ...new Set(modules.map(m => m.category))], [modules]);
  const filtered = modules.filter(m => {
    const matchesText = `${m.name} ${m.purpose} ${m.category}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === 'Todos' || m.category === category;
    return matchesText && matchesCategory;
  });

  if (!user) {
    console.log('Usuario no autenticado, vista actual:', authView);
    switch (authView) {
      case 'register':
        return <Register onRegister={handleRegister} onBackToLogin={() => setAuthView('login')} />;
      case 'forgot-password':
        return <ForgotPassword onBackToLogin={() => setAuthView('login')} />;
      default:
        return (
          <Login 
            onLogin={handleLogin} 
            onShowRegister={() => setAuthView('register')}
            onShowForgotPassword={() => setAuthView('forgot-password')}
          />
        );
    }
  }

  console.log('Usuario autenticado, renderizando dashboard');

  return (
    <div className="dashboard-layout">
      <button className="menu-toggle" onClick={() => setSidebarOpen(true)} aria-label="Abrir menú">
        <Menu size={24} />
      </button>
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="user-avatar">
            <img 
              src={`https://ui-avatars.com/api/?name=${user.username}&background=123b62&color=fff&size=128`} 
              alt={user.username}
              className="avatar-image"
            />
          </div>
          <h1>PH Transparente</h1>
          <p className="user-info">{user.username} ({user.role})</p>
        </div>
        <nav className="sidebar-nav" onClick={() => setSidebarOpen(false)}>
          <button 
            className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('dashboard')}
          >
            <LayoutGrid size={18} />
            <span>Dashboard</span>
          </button>
          {allowedModules.includes('users') && (
          <button 
            className={`nav-item ${currentView === 'users' ? 'active' : ''}`}
            onClick={() => setCurrentView('users')}
          >
            <Users size={18} />
            <span>Usuarios</span>
          </button>
          )}
          {allowedModules.includes('pqr') && (
          <button 
            className={`nav-item ${currentView === 'pqr' ? 'active' : ''}`}
            onClick={() => setCurrentView('pqr')}
          >
            <FileText size={18} />
            <span>PQR</span>
          </button>
          )}
          {allowedModules.includes('pqr-statistics') && (
          <button 
            className={`nav-item ${currentView === 'pqr-statistics' ? 'active' : ''}`}
            onClick={() => setCurrentView('pqr-statistics')}
          >
            <BarChart3 size={18} />
            <span>Estadísticas PQR</span>
          </button>
          )}
          {allowedModules.includes('payment-reports') && (
          <button 
            className={`nav-item ${currentView === 'payment-reports' ? 'active' : ''}`}
            onClick={() => setCurrentView('payment-reports')}
          >
            <Send size={18} />
            <span>Reportes al Contador</span>
          </button>
          )}
          {allowedModules.includes('payments') && (
          <button 
            className={`nav-item ${currentView === 'payments' ? 'active' : ''}`}
            onClick={() => setCurrentView('payments')}
          >
            <DollarSign size={18} />
            <span>Pagos</span>
          </button>
          )}
          {allowedModules.includes('reservations') && (
          <button 
            className={`nav-item ${currentView === 'reservations' ? 'active' : ''}`}
            onClick={() => setCurrentView('reservations')}
          >
            <Calendar size={18} />
            <span>Reservas</span>
          </button>
          )}
          {allowedModules.includes('visitors') && (
          <button 
            className={`nav-item ${currentView === 'visitors' ? 'active' : ''}`}
            onClick={() => setCurrentView('visitors')}
          >
            <Shield size={18} />
            <span>Visitantes</span>
          </button>
          )}
          {allowedModules.includes('contracts') && (
          <button 
            className={`nav-item ${currentView === 'contracts' ? 'active' : ''}`}
            onClick={() => setCurrentView('contracts')}
          >
            <FileTextIcon size={18} />
            <span>Contratos</span>
          </button>
          )}
          {allowedModules.includes('fines') && (
          <button 
            className={`nav-item ${currentView === 'fines' ? 'active' : ''}`}
            onClick={() => setCurrentView('fines')}
          >
            <AlertTriangle size={18} />
            <span>Multas</span>
          </button>
          )}
          {allowedModules.includes('documents') && (
          <button 
            className={`nav-item ${currentView === 'documents' ? 'active' : ''}`}
            onClick={() => setCurrentView('documents')}
          >
            <Folder size={18} />
            <span>Documentos</span>
          </button>
          )}
          {allowedModules.includes('assemblies') && (
          <button 
            className={`nav-item ${currentView === 'assemblies' ? 'active' : ''}`}
            onClick={() => setCurrentView('assemblies')}
          >
            <UsersIcon size={18} />
            <span>Asambleas</span>
          </button>
          )}
          {allowedModules.includes('votes') && (
          <button 
            className={`nav-item ${currentView === 'votes' ? 'active' : ''}`}
            onClick={() => setCurrentView('votes')}
          >
            <VoteIcon size={18} />
            <span>Votaciones</span>
          </button>
          )}
          {allowedModules.includes('councils') && (
          <button 
            className={`nav-item ${currentView === 'councils' ? 'active' : ''}`}
            onClick={() => setCurrentView('councils')}
          >
            <UserCheck size={18} />
            <span>Consejo</span>
          </button>
          )}
          {allowedModules.includes('security') && (
          <button 
            className={`nav-item ${currentView === 'security' ? 'active' : ''}`}
            onClick={() => setCurrentView('security')}
          >
            <Shield size={20} />
            <span>Seguridad</span>
          </button>
          )}
          {allowedModules.includes('contractors') && (
          <button 
            className={`nav-item ${currentView === 'contractors' ? 'active' : ''}`}
            onClick={() => setCurrentView('contractors')}
          >
            <Building2 size={18} />
            <span>Contrataciones</span>
          </button>
          )}
          {allowedModules.includes('property-units') && (
          <button 
            className={`nav-item ${currentView === 'property-units' ? 'active' : ''}`}
            onClick={() => setCurrentView('property-units')}
          >
            <Building size={18} />
            <span>Unidades</span>
          </button>
          )}
          {allowedModules.includes('reserve-funds') && (
          <button 
            className={`nav-item ${currentView === 'reserve-funds' ? 'active' : ''}`}
            onClick={() => setCurrentView('reserve-funds')}
          >
            <PiggyBank size={18} />
            <span>Fondo Reserva</span>
          </button>
          )}
          {allowedModules.includes('annual-budgets') && (
          <button 
            className={`nav-item ${currentView === 'annual-budgets' ? 'active' : ''}`}
            onClick={() => setCurrentView('annual-budgets')}
          >
            <Calendar size={18} />
            <span>Presupuesto</span>
          </button>
          )}
          {allowedModules.includes('insurance-policies') && (
          <button 
            className={`nav-item ${currentView === 'insurance-policies' ? 'active' : ''}`}
            onClick={() => setCurrentView('insurance-policies')}
          >
            <ShieldCheck size={18} />
            <span>Seguros</span>
          </button>
          )}
          {allowedModules.includes('bank-accounts') && (
          <button 
            className={`nav-item ${currentView === 'bank-accounts' ? 'active' : ''}`}
            onClick={() => setCurrentView('bank-accounts')}
          >
            <CreditCard size={18} />
            <span>Cuentas</span>
          </button>
          )}
          {allowedModules.includes('official-minutes') && (
          <button 
            className={`nav-item ${currentView === 'official-minutes' ? 'active' : ''}`}
            onClick={() => setCurrentView('official-minutes')}
          >
            <FileText size={18} />
            <span>Actas</span>
          </button>
          )}
          {allowedModules.includes('horizontal-property-regulations') && (
          <button 
            className={`nav-item ${currentView === 'horizontal-property-regulations' ? 'active' : ''}`}
            onClick={() => setCurrentView('horizontal-property-regulations')}
          >
            <BookOpen size={18} />
            <span>Reglamento</span>
          </button>
          )}
          {allowedModules.includes('alerts') && (
          <button 
            className={`nav-item ${currentView === 'alerts' ? 'active' : ''}`}
            onClick={() => setCurrentView('alerts')}
          >
            <Bell size={18} />
            <span>Alertas</span>
          </button>
          )}
          {allowedModules.includes('transparency') && (
          <button 
            className={`nav-item ${currentView === 'transparency' ? 'active' : ''}`}
            onClick={() => setCurrentView('transparency')}
          >
            <ShieldCheck size={18} />
            <span>Transparencia</span>
          </button>
          )}
          {allowedModules.includes('authorizations') && (
          <button 
            className={`nav-item ${currentView === 'authorizations' ? 'active' : ''}`}
            onClick={() => setCurrentView('authorizations')}
          >
            <Shield size={18} />
            <span>Autorizaciones</span>
          </button>
          )}
          {allowedModules.includes('reports') && (
          <button 
            className={`nav-item ${currentView === 'reports' ? 'active' : ''}`}
            onClick={() => setCurrentView('reports')}
          >
            <FileText size={18} />
            <span>Reportes</span>
          </button>
          )}
          {allowedModules.includes('personnel-ratings') && (
          <button 
            className={`nav-item ${currentView === 'personnel-ratings' ? 'active' : ''}`}
            onClick={() => setCurrentView('personnel-ratings')}
          >
            <Star size={18} />
            <span>Calificaciones</span>
          </button>
          )}
          {allowedModules.includes('appstore') && (
          <button 
            className={`nav-item ${currentView === 'appstore' ? 'active' : ''}`}
            onClick={() => setCurrentView('appstore')}
          >
            <Grid size={18} />
            <span>App Store</span>
          </button>
          )}
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Cerrar sesión</span>
        </button>
      </aside>

      <main className="dashboard-content">
        {currentView === 'dashboard' ? (
          <>
            <section className="dashboard-header">
              <h2>Bienvenido, {user?.username}</h2>
              <p>Panel de control de Propiedad Horizontal</p>
            </section>

            <section className="dashboard-stats">
              <div className="stats-row">
                <Stat icon={<Building2 />} label="Copropiedades" value={dashboard?.copropiedades ?? '-'} />
                <Stat icon={<Users />} label="Usuarios Activos" value={dashboard?.usuariosActivos ?? '-'} />
                <Stat icon={<BarChart3 />} label="Módulos" value={dashboard?.modulos ?? 30} />
                <Stat icon={<FileText />} label="PQRS Abiertas" value={dashboard?.pqrsAbiertas ?? '-'} />
                <Stat icon={<Car />} label="Reservas Hoy" value={dashboard?.reservasHoy ?? '-'} />
                <Stat icon={<Bell />} label="Pagos Pendientes" value={dashboard?.pagosPendientes ?? '-'} />
                <Stat icon={<ShieldCheck />} label="Alertas Seguridad" value={dashboard?.alertasSeguridad ?? '-'} />
                <Stat icon={<Users />} label="Visitantes Hoy" value={dashboard?.visitantesHoy ?? '-'} />
                <Stat icon={<FileText />} label="Multas Pendientes" value={dashboard?.multasPendientes ?? '-'} />
                <Stat icon={<FileText />} label="Contratos Activos" value={dashboard?.contratosActivos ?? '-'} />
                <Stat icon={<Star />} label="Calificaciones" value={dashboard?.calificaciones ?? '-'} />
                <Stat icon={<TrendingUp />} label="Promedio Calificación" value={dashboard?.promedioCalificacion ?? '-'} />
              </div>
            </section>

            <section className="quick-actions">
              <h3>Acciones Rápidas</h3>
              <div className="quick-actions-grid">
                {allowedModules.includes('pqr') && (
                  <button className="quick-action-btn" onClick={() => setCurrentView('pqr')}>
                    <FileText size={24} />
                    <span>Crear PQR</span>
                  </button>
                )}
                {allowedModules.includes('reservations') && (
                  <button className="quick-action-btn" onClick={() => setCurrentView('reservations')}>
                    <Calendar size={24} />
                    <span>Reservar Espacio</span>
                  </button>
                )}
                {allowedModules.includes('payments') && (
                  <button className="quick-action-btn" onClick={() => setCurrentView('payments')}>
                    <DollarSign size={24} />
                    <span>Ver Pagos</span>
                  </button>
                )}
                {allowedModules.includes('alerts') && (
                  <button className="quick-action-btn" onClick={() => setCurrentView('alerts')}>
                    <Bell size={24} />
                    <span>Ver Alertas</span>
                  </button>
                )}
              </div>
            </section>

            <AdminDashboard onModuleSelect={setCurrentView} currentView={currentView} userRole={user?.role} />
          </>
        ) : currentView === 'users' ? (
          <UsersManagement />
        ) : currentView === 'pqr' ? (
          <PqrManagement user={user} />
        ) : currentView === 'pqr-statistics' ? (
          <PqrStatistics user={user} />
        ) : currentView === 'payment-reports' ? (
          <PaymentReports userRole={user?.role} />
        ) : currentView === 'payments' ? (
          <PaymentsManagement />
        ) : currentView === 'reservations' ? (
          <ReservationsManagement userRole={user?.role} />
        ) : currentView === 'visitors' ? (
          <VisitorsManagement />
        ) : currentView === 'contracts' ? (
          <ContractsManagement />
        ) : currentView === 'fines' ? (
          <FinesManagement />
        ) : currentView === 'documents' ? (
          <DocumentsManagement />
        ) : currentView === 'assemblies' ? (
          <AssembliesManagement />
        ) : currentView === 'votes' ? (
          <VotesManagement />
        ) : currentView === 'councils' ? (
          <CouncilsManagement />
        ) : currentView === 'security' ? (
          <SecurityManagement />
        ) : currentView === 'contractors' ? (
          <ContractorsManagement />
        ) : currentView === 'property-units' ? (
          <PropertyUnitsManagement />
        ) : currentView === 'reserve-funds' ? (
          <ReserveFundsManagement />
        ) : currentView === 'annual-budgets' ? (
          <AnnualBudgetsManagement />
        ) : currentView === 'insurance-policies' ? (
          <InsurancePoliciesManagement />
        ) : currentView === 'bank-accounts' ? (
          <BankAccountsManagement />
        ) : currentView === 'official-minutes' ? (
          <OfficialMinutesManagement />
        ) : currentView === 'horizontal-property-regulations' ? (
          <HorizontalPropertyRegulationsManagement />
        ) : currentView === 'alerts' ? (
          <AlertsManagement />
        ) : currentView === 'transparency' ? (
          <TransparencyDashboard />
        ) : currentView === 'authorizations' ? (
          <ModuleAuthorizationsManagement />
        ) : currentView === 'reports' ? (
          <ReportsManagement />
        ) : currentView === 'personnel-ratings' ? (
          <PersonnelRatingsManagement />
        ) : currentView === 'support-tasks' ? (
          <SupportTasksManagement />
        ) : currentView === 'council-minutes' ? (
          <CouncilMinutesManagement userRole={user?.role} />
        ) : currentView === 'accounting-reports' ? (
          <AccountingReportsManagement userRole={user?.role} />
        ) : currentView === 'fiscal-reports' ? (
          <FiscalReportsManagement userRole={user?.role} />
        ) : currentView === 'task-statistics' ? (
          <TaskStatistics userRole={user?.role} onBack={() => setCurrentView('dashboard')} />
        ) : currentView === 'security-reports' ? (
          <SecurityReportsManagement userRole={user?.role} onBack={() => setCurrentView('dashboard')} />
        ) : currentView === 'cleaning-tasks' ? (
          <CleaningTasksManagement userRole={user?.role} onBack={() => setCurrentView('dashboard')} />
        ) : currentView === 'staff-info' ? (
          <StaffInfoManagement userRole={user?.role} onBack={() => setCurrentView('dashboard')} />
        ) : currentView === 'staff-ratings' ? (
          <StaffRatingsManagement userRole={user?.role} onBack={() => setCurrentView('dashboard')} />
        ) : (
          <AppStore />
        )}
      </main>
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="stat-card">
      {icon}
      <div className="stat-info">
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

function ModuleCard({ module }) {
  return (
    <article className="module-card-column">
      <div className="module-header">
        <span className="module-id">Módulo {module.id}</span>
        <span className="module-category">{module.category}</span>
      </div>
      <h3>{module.name}</h3>
      <p>{module.purpose}</p>
    </article>
  );
}

// Ocultar pantalla de carga
const loadingEl = document.getElementById('loading');
if (loadingEl) loadingEl.style.display = 'none';

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
