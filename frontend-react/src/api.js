import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();
const platform = Capacitor.getPlatform();

// En web usamos el proxy de Vite (/api). En Android nativo usamos 10.0.2.2 (emulador).
// Para dispositivos reales, configure VITE_API_URL al compilar o modifique este valor.
const defaultApiUrl = isNative
  ? (platform === 'android' ? 'http://10.0.2.2:8081/api' : 'http://localhost:8081/api')
  : '/api';

export const API_URL = import.meta.env.VITE_API_URL || defaultApiUrl;

const TOKEN_KEY = 'pht_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function buildHeaders(extraHeaders = {}) {
  const headers = { ...extraHeaders };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Wrapper de fetch que inyecta automáticamente el token JWT cuando existe.
 * Facilita la migración a autenticación stateless sin editar todos los componentes.
 */
export async function fetchWithAuth(url, options = {}) {
  const headers = buildHeaders(options.headers || {});
  return fetch(url, { ...options, headers });
}

export async function getModules() {
  try {
    const response = await fetchWithAuth(`${API_URL}/modules`);
    if (!response.ok) throw new Error('API no disponible');
    return await response.json();
  } catch (error) {
    const local = await import('./modules.js');
    return local.modules;
  }
}

export async function getDashboard() {
  try {
    const response = await fetchWithAuth(`${API_URL}/dashboard`);
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
    if (!response.ok) throw new Error('Credenciales inválidas');
    const data = await response.json();
    if (data.token) {
      setToken(data.token);
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchMe() {
  const response = await fetchWithAuth(`${API_URL}/auth/me`);
  if (!response.ok) throw new Error('No autenticado');
  return await response.json();
}
