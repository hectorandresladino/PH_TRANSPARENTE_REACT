import React, { useCallback, useEffect, useState } from 'react';
import { Building2, CreditCard, LogOut, Plus, RefreshCw, ShieldCheck, Users } from 'lucide-react';
import { API_URL } from './api.js';

const initialPlan = {
  code: '', name: '', description: '', price: 0, billingPeriod: 'MONTHLY',
  modules: 'dashboard,users,pqr,payments,reservations,visitors,property-units,alerts,reports,transparency',
  maxUsers: 20, maxUnits: 50, active: true
};

const initialOrganization = {
  slug: '', name: '', nit: '', status: 'TRIAL', planId: '',
  adminUsername: '', adminPassword: '', adminEmail: '', adminFullName: ''
};

async function apiRequest(path, options) {
  const response = await fetch(`${API_URL}${path}`, options);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Error ${response.status}`);
  }
  return response.status === 204 ? null : response.json();
}

export default function SaasAdminDashboard({ user, onLogout }) {
  const [organizations, setOrganizations] = useState([]);
  const [plans, setPlans] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [stats, setStats] = useState({ organizations: 0, plans: 0, subscriptions: 0, users: 0 });
  const [planForm, setPlanForm] = useState(initialPlan);
  const [organizationForm, setOrganizationForm] = useState(initialOrganization);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const [organizationData, planData, subscriptionData, statsData] = await Promise.all([
        apiRequest('/superadmin/organizations'),
        apiRequest('/superadmin/plans'),
        apiRequest('/superadmin/subscriptions'),
        apiRequest('/superadmin/stats')
      ]);
      setOrganizations(organizationData);
      setPlans(planData);
      setSubscriptions(subscriptionData);
      setStats(statsData);
    } catch (err) {
      setError(err.message || 'No fue posible cargar la plataforma');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const createPlan = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await apiRequest('/superadmin/plans', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...planForm,
          code: planForm.code.trim().toUpperCase(),
          price: Number(planForm.price), maxUsers: Number(planForm.maxUsers), maxUnits: Number(planForm.maxUnits)
        })
      });
      setPlanForm(initialPlan);
      setNotice('Plan creado correctamente');
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const createOrganization = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await apiRequest('/superadmin/organizations', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...organizationForm, planId: Number(organizationForm.planId) })
      });
      setOrganizationForm(initialOrganization);
      setNotice('Copropiedad y administrador creados correctamente');
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const changeOrganizationStatus = async (organization, status) => {
    setError('');
    try {
      await apiRequest(`/superadmin/organizations/${organization.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status })
      });
      setNotice(`Organización ${status === 'ACTIVE' ? 'activada' : 'suspendida'}`);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const changeSubscriptionStatus = async (subscription, status) => {
    setError('');
    try {
      await apiRequest(`/superadmin/subscriptions/${subscription.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status })
      });
      setNotice(`Suscripción actualizada a ${status}`);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f7fb', padding: '24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: 0, color: '#123b62' }}>Plataforma SaaS</h1>
            <p style={{ color: '#65758a', margin: '6px 0 0' }}>{user.username} · Superadministrador</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={loadData} disabled={loading}><RefreshCw size={17} /> Actualizar</button>
            <button type="button" onClick={onLogout}><LogOut size={17} /> Salir</button>
          </div>
        </header>

        {error && <p className="error">{error}</p>}
        {notice && <p className="success" onClick={() => setNotice('')} style={{ cursor: 'pointer' }}>{notice}</p>}

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 16, marginBottom: 24 }}>
          <Metric icon={<Building2 />} label="Copropiedades" value={stats.organizations} />
          <Metric icon={<CreditCard />} label="Suscripciones" value={stats.subscriptions} />
          <Metric icon={<ShieldCheck />} label="Planes" value={stats.plans} />
          <Metric icon={<Users />} label="Usuarios" value={stats.users} />
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 20, alignItems: 'start' }}>
          <Panel title="Crear plan">
            <form onSubmit={createPlan} style={formStyle}>
              <Field label="Código" value={planForm.code} onChange={(value) => setPlanForm({ ...planForm, code: value })} required />
              <Field label="Nombre" value={planForm.name} onChange={(value) => setPlanForm({ ...planForm, name: value })} required />
              <Field label="Descripción" value={planForm.description} onChange={(value) => setPlanForm({ ...planForm, description: value })} />
              <Field label="Precio mensual" type="number" min="0" value={planForm.price} onChange={(value) => setPlanForm({ ...planForm, price: value })} required />
              <Field label="Máximo de usuarios" type="number" min="1" value={planForm.maxUsers} onChange={(value) => setPlanForm({ ...planForm, maxUsers: value })} required />
              <Field label="Máximo de unidades" type="number" min="1" value={planForm.maxUnits} onChange={(value) => setPlanForm({ ...planForm, maxUnits: value })} required />
              <label style={{ gridColumn: '1 / -1' }}>Módulos (separados por coma)
                <textarea value={planForm.modules} onChange={(event) => setPlanForm({ ...planForm, modules: event.target.value })} required rows={4} style={inputStyle} />
              </label>
              <button type="submit" disabled={saving}><Plus size={17} /> Crear plan</button>
            </form>
          </Panel>

          <Panel title="Crear copropiedad">
            <form onSubmit={createOrganization} style={formStyle}>
              <Field label="Nombre" value={organizationForm.name} onChange={(value) => setOrganizationForm({ ...organizationForm, name: value })} required />
              <Field label="Slug" value={organizationForm.slug} onChange={(value) => setOrganizationForm({ ...organizationForm, slug: value.toLowerCase() })} pattern="[a-z0-9][a-z0-9-]{2,62}" required />
              <Field label="NIT" value={organizationForm.nit} onChange={(value) => setOrganizationForm({ ...organizationForm, nit: value })} />
              <label>Plan
                <select value={organizationForm.planId} onChange={(event) => setOrganizationForm({ ...organizationForm, planId: event.target.value })} required style={inputStyle}>
                  <option value="">Seleccionar…</option>
                  {plans.filter((plan) => plan.active).map((plan) => <option key={plan.id} value={plan.id}>{plan.name}</option>)}
                </select>
              </label>
              <Field label="Usuario administrador" value={organizationForm.adminUsername} onChange={(value) => setOrganizationForm({ ...organizationForm, adminUsername: value })} required />
              <Field label="Nombre del administrador" value={organizationForm.adminFullName} onChange={(value) => setOrganizationForm({ ...organizationForm, adminFullName: value })} />
              <Field label="Correo del administrador" type="email" value={organizationForm.adminEmail} onChange={(value) => setOrganizationForm({ ...organizationForm, adminEmail: value })} />
              <Field label="Contraseña inicial" type="password" value={organizationForm.adminPassword} onChange={(value) => setOrganizationForm({ ...organizationForm, adminPassword: value })} required autoComplete="new-password" />
              <button type="submit" disabled={saving || plans.length === 0}><Plus size={17} /> Crear copropiedad</button>
            </form>
          </Panel>
        </div>

        <Panel title="Copropiedades">
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead><tr><th>Nombre</th><th>Slug</th><th>Estado</th><th>Usuarios</th><th>Unidades</th><th>Acciones</th></tr></thead>
              <tbody>{organizations.map((organization) => (
                <tr key={organization.id}>
                  <td>{organization.name}</td><td>{organization.slug}</td><td>{organization.status}</td>
                  <td>Máx. {organization.maxUsers}</td><td>Máx. {organization.maxUnits}</td>
                  <td><button type="button" onClick={() => changeOrganizationStatus(organization, organization.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED')}>
                    {organization.status === 'SUSPENDED' ? 'Activar' : 'Suspender'}
                  </button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Suscripciones">
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead><tr><th>Organización</th><th>Plan</th><th>Estado</th><th>Periodo</th><th>Acciones</th></tr></thead>
              <tbody>{subscriptions.map((subscription) => (
                <tr key={subscription.id}>
                  <td>{organizations.find((item) => item.id === subscription.organizationId)?.name || subscription.organizationId}</td>
                  <td>{plans.find((item) => item.id === subscription.planId)?.name || subscription.planId}</td>
                  <td>{subscription.status}</td><td>{subscription.billingPeriod}</td>
                  <td><button type="button" onClick={() => changeSubscriptionStatus(subscription, subscription.status === 'ACTIVE' ? 'PAST_DUE' : 'ACTIVE')}>
                    {subscription.status === 'ACTIVE' ? 'Marcar mora' : 'Activar'}
                  </button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}

const formStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 14 };
const inputStyle = { width: '100%', boxSizing: 'border-box', marginTop: 6, padding: '10px 12px', border: '1px solid #d8e4ec', borderRadius: 10, background: '#fff' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', minWidth: 720 };

function Field({ label, onChange, ...props }) {
  return <label>{label}<input {...props} onChange={(event) => onChange(event.target.value)} style={inputStyle} /></label>;
}

function Panel({ title, children }) {
  return <section style={{ background: '#fff', border: '1px solid #e1e9ef', borderRadius: 16, padding: 20, marginBottom: 20, boxShadow: '0 8px 30px rgba(18,59,98,.06)' }}>
    <h2 style={{ margin: '0 0 18px', color: '#123b62', fontSize: '1.15rem' }}>{title}</h2>{children}
  </section>;
}

function Metric({ icon, label, value }) {
  return <div style={{ background: '#fff', border: '1px solid #e1e9ef', borderRadius: 16, padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
    <span style={{ color: '#0f766e' }}>{icon}</span><div><strong style={{ display: 'block', fontSize: '1.5rem', color: '#123b62' }}>{value ?? 0}</strong><span style={{ color: '#65758a' }}>{label}</span></div>
  </div>;
}
