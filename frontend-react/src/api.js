const API_URL = import.meta.env.VITE_API_URL || `http://${location.hostname}:8081/api`;

export async function getModules() {
  try {
    const response = await fetch(`${API_URL}/modules`);
    if (!response.ok) throw new Error('API no disponible');
    return await response.json();
  } catch (error) {
    const local = await import('./modules.js');
    return local.modules;
  }
}

export async function getDashboard() {
  try {
    const response = await fetch(`${API_URL}/dashboard`);
    if (!response.ok) throw new Error('API no disponible');
    return await response.json();
  } catch (error) {
    return { copropiedades: 1, modulos: 24, pqrsAbiertas: 3, reservasHoy: 5, pagosPendientes: 12, alertasSeguridad: 2 };
  }
}

export async function login(username, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!response.ok) throw new Error('Credenciales invÃ¡lidas');
    return await response.json();
  } catch (error) {
    throw error;
  }
}
