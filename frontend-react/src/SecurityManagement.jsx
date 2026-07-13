import React, { useState, useEffect } from 'react';
import { Shield, Users, MapPin, AlertTriangle, FileText, Plus, Edit, Trash2, Search, Check, X, Clock, Car, User as UserIcon } from 'lucide-react';
import './styles.css';

import { API_URL } from './api.js';

export default function SecurityManagement() {
  const [activeTab, setActiveTab] = useState('access-control');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Access Control State
  const [accessControls, setAccessControls] = useState([]);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [editingAccess, setEditingAccess] = useState(null);
  const [accessFormData, setAccessFormData] = useState({
    accessType: 'PEATONAL',
    personName: '',
    documentNumber: '',
    documentType: 'CC',
    vehiclePlate: '',
    vehicleType: '',
    entryGate: '',
    exitGate: '',
    destination: '',
    purpose: '',
    hostName: '',
    hostUnit: '',
    status: 'INGRESADO',
    observations: '',
    authorizedBy: ''
  });

  // Security Points State
  const [securityPoints, setSecurityPoints] = useState([]);
  const [showPointModal, setShowPointModal] = useState(false);
  const [editingPoint, setEditingPoint] = useState(null);
  const [pointFormData, setPointFormData] = useState({
    name: '',
    code: '',
    location: '',
    type: 'FIJO',
    zone: '',
    description: '',
    status: 'ACTIVO',
    assignedGuard: '',
    contactPhone: '',
    equipment: '',
    surveillanceArea: '',
    schedule: ''
  });

  // Security Guards State
  const [securityGuards, setSecurityGuards] = useState([]);
  const [showGuardModal, setShowGuardModal] = useState(false);
  const [editingGuard, setEditingGuard] = useState(null);
  const [guardFormData, setGuardFormData] = useState({
    name: '',
    documentNumber: '',
    documentType: 'CC',
    phone: '',
    email: '',
    shift: 'DIURNO',
    schedule: '',
    assignedZone: '',
    assignedPoint: '',
    status: 'ACTIVO',
    uniformSize: '',
    equipment: '',
    certifications: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  // Security Findings State
  const [securityFindings, setSecurityFindings] = useState([]);
  const [showFindingModal, setShowFindingModal] = useState(false);
  const [editingFinding, setEditingFinding] = useState(null);
  const [findingFormData, setFindingFormData] = useState({
    title: '',
    description: '',
    type: 'INFRAESTRUCTURA',
    severity: 'MEDIA',
    location: '',
    zone: '',
    status: 'PENDIENTE',
    reportedBy: '',
    assignedTo: '',
    resolution: '',
    actionTaken: '',
    evidence: '',
    priority: 'NORMAL',
    category: ''
  });

  // Security Events State
  const [securityEvents, setSecurityEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    type: 'INCIDENTE',
    severity: 'MEDIA',
    location: '',
    zone: '',
    status: 'PENDIENTE',
    reportedBy: '',
    assignedTo: '',
    resolution: '',
    actionTaken: '',
    witnesses: '',
    involvedPersons: '',
    evidence: '',
    priority: 'NORMAL',
    category: '',
    responseTime: '',
    followUpRequired: ''
  });

  useEffect(() => {
    fetchAccessControls();
    fetchSecurityPoints();
    fetchSecurityGuards();
    fetchSecurityFindings();
    fetchSecurityEvents();
  }, []);

  const fetchAccessControls = async () => {
    try {
      const response = await fetch(`${API_URL}/access-control`);
      if (response.ok) {
        const data = await response.json();
        setAccessControls(data);
      }
    } catch (error) {
      console.error('Error fetching access controls:', error);
    }
  };

  const fetchSecurityPoints = async () => {
    try {
      const response = await fetch(`${API_URL}/security-points`);
      if (response.ok) {
        const data = await response.json();
        setSecurityPoints(data);
      }
    } catch (error) {
      console.error('Error fetching security points:', error);
    }
  };

  const fetchSecurityGuards = async () => {
    try {
      const response = await fetch(`${API_URL}/security-guards`);
      if (response.ok) {
        const data = await response.json();
        setSecurityGuards(data);
      }
    } catch (error) {
      console.error('Error fetching security guards:', error);
    }
  };

  const fetchSecurityFindings = async () => {
    try {
      const response = await fetch(`${API_URL}/security-findings`);
      if (response.ok) {
        const data = await response.json();
        setSecurityFindings(data);
      }
    } catch (error) {
      console.error('Error fetching security findings:', error);
    }
  };

  const fetchSecurityEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/security-events`);
      if (response.ok) {
        const data = await response.json();
        setSecurityEvents(data);
      }
    } catch (error) {
      console.error('Error fetching security events:', error);
    }
  };

  const handleAccessSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingAccess 
        ? `${API_URL}/access-control/${editingAccess.id}`
        : `${API_URL}/access-control`;
      const method = editingAccess ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accessFormData)
      });

      if (response.ok) {
        fetchAccessControls();
        setShowAccessModal(false);
        setEditingAccess(null);
        resetAccessForm();
      }
    } catch (error) {
      console.error('Error saving access control:', error);
    }
  };

  const handlePointSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingPoint 
        ? `${API_URL}/security-points/${editingPoint.id}`
        : `${API_URL}/security-points`;
      const method = editingPoint ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pointFormData)
      });

      if (response.ok) {
        fetchSecurityPoints();
        setShowPointModal(false);
        setEditingPoint(null);
        resetPointForm();
      }
    } catch (error) {
      console.error('Error saving security point:', error);
    }
  };

  const handleGuardSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingGuard 
        ? `${API_URL}/security-guards/${editingGuard.id}`
        : `${API_URL}/security-guards`;
      const method = editingGuard ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guardFormData)
      });

      if (response.ok) {
        fetchSecurityGuards();
        setShowGuardModal(false);
        setEditingGuard(null);
        resetGuardForm();
      }
    } catch (error) {
      console.error('Error saving security guard:', error);
    }
  };

  const handleFindingSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingFinding 
        ? `${API_URL}/security-findings/${editingFinding.id}`
        : `${API_URL}/security-findings`;
      const method = editingFinding ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(findingFormData)
      });

      if (response.ok) {
        fetchSecurityFindings();
        setShowFindingModal(false);
        setEditingFinding(null);
        resetFindingForm();
      }
    } catch (error) {
      console.error('Error saving security finding:', error);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingEvent 
        ? `${API_URL}/security-events/${editingEvent.id}`
        : `${API_URL}/security-events`;
      const method = editingEvent ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventFormData)
      });

      if (response.ok) {
        fetchSecurityEvents();
        setShowEventModal(false);
        setEditingEvent(null);
        resetEventForm();
      }
    } catch (error) {
      console.error('Error saving security event:', error);
    }
  };

  const resetAccessForm = () => {
    setAccessFormData({
      accessType: 'PEATONAL',
      personName: '',
      documentNumber: '',
      documentType: 'CC',
      vehiclePlate: '',
      vehicleType: '',
      entryGate: '',
      exitGate: '',
      destination: '',
      purpose: '',
      hostName: '',
      hostUnit: '',
      status: 'INGRESADO',
      observations: '',
      authorizedBy: ''
    });
  };

  const resetPointForm = () => {
    setPointFormData({
      name: '',
      code: '',
      location: '',
      type: 'FIJO',
      zone: '',
      description: '',
      status: 'ACTIVO',
      assignedGuard: '',
      contactPhone: '',
      equipment: '',
      surveillanceArea: '',
      schedule: ''
    });
  };

  const resetGuardForm = () => {
    setGuardFormData({
      name: '',
      documentNumber: '',
      documentType: 'CC',
      phone: '',
      email: '',
      shift: 'DIURNO',
      schedule: '',
      assignedZone: '',
      assignedPoint: '',
      status: 'ACTIVO',
      uniformSize: '',
      equipment: '',
      certifications: '',
      emergencyContact: '',
      emergencyPhone: ''
    });
  };

  const resetFindingForm = () => {
    setFindingFormData({
      title: '',
      description: '',
      type: 'INFRAESTRUCTURA',
      severity: 'MEDIA',
      location: '',
      zone: '',
      status: 'PENDIENTE',
      reportedBy: '',
      assignedTo: '',
      resolution: '',
      actionTaken: '',
      evidence: '',
      priority: 'NORMAL',
      category: ''
    });
  };

  const resetEventForm = () => {
    setEventFormData({
      title: '',
      description: '',
      type: 'INCIDENTE',
      severity: 'MEDIA',
      location: '',
      zone: '',
      status: 'PENDIENTE',
      reportedBy: '',
      assignedTo: '',
      resolution: '',
      actionTaken: '',
      witnesses: '',
      involvedPersons: '',
      evidence: '',
      priority: 'NORMAL',
      category: '',
      responseTime: '',
      followUpRequired: ''
    });
  };

  const handleDelete = async (id, endpoint) => {
    if (window.confirm('¿Estás seguro de eliminar este registro?')) {
      try {
        const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          if (endpoint === 'access-control') fetchAccessControls();
          else if (endpoint === 'security-points') fetchSecurityPoints();
          else if (endpoint === 'security-guards') fetchSecurityGuards();
          else if (endpoint === 'security-findings') fetchSecurityFindings();
          else if (endpoint === 'security-events') fetchSecurityEvents();
        }
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  const renderAccessControlTab = () => (
    <div className="security-tab-content">
      <div className="tab-header">
        <div className="header-title">
          <Car size={32} />
          <h1>Portería - Control de Accesos</h1>
        </div>
        <button className="btn-primary" onClick={() => { resetAccessForm(); setEditingAccess(null); setShowAccessModal(true); }}>
          <Plus size={20} />
          <span>Nuevo Acceso</span>
        </button>
      </div>

      <div className="tab-filters">
        <div className="search-bar">
          <Search size={20} />
          <input
            placeholder="Buscar accesos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Persona</th>
              <th>Documento</th>
              <th>Vehículo</th>
              <th>Destino</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {accessControls.filter(ac => 
              ac.personName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              ac.documentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              ac.vehiclePlate?.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(ac => (
              <tr key={ac.id}>
                <td>
                  <span className={`type-badge ${ac.accessType.toLowerCase()}`}>
                    {ac.accessType === 'PEATONAL' ? <UserIcon size={14} /> : <Car size={14} />}
                    {ac.accessType}
                  </span>
                </td>
                <td>{ac.personName || '-'}</td>
                <td>{ac.documentNumber || '-'}</td>
                <td>{ac.vehiclePlate || '-'}</td>
                <td>{ac.destination || '-'}</td>
                <td>
                  <span className={`status-badge ${ac.status === 'INGRESADO' ? 'active' : 'inactive'}`}>
                    {ac.status === 'INGRESADO' ? <Check size={14} /> : <X size={14} />}
                    {ac.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => { setEditingAccess(ac); setAccessFormData(ac); setShowAccessModal(true); }}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(ac.id, 'access-control')}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAccessModal && (
        <div className="modal-overlay" onClick={() => setShowAccessModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingAccess ? 'Editar Acceso' : 'Nuevo Acceso'}</h2>
              <button className="btn-close" onClick={() => setShowAccessModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAccessSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Tipo de Acceso</label>
                  <select value={accessFormData.accessType} onChange={e => setAccessFormData({...accessFormData, accessType: e.target.value})}>
                    <option value="PEATONAL">Peatonal</option>
                    <option value="VEHICULAR">Vehicular</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Nombre</label>
                  <input type="text" value={accessFormData.personName} onChange={e => setAccessFormData({...accessFormData, personName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Tipo Documento</label>
                  <select value={accessFormData.documentType} onChange={e => setAccessFormData({...accessFormData, documentType: e.target.value})}>
                    <option value="CC">Cédula</option>
                    <option value="TI">Tarjeta Identidad</option>
                    <option value="CE">Cédula Extranjería</option>
                    <option value="PP">Pasaporte</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Número Documento</label>
                  <input type="text" value={accessFormData.documentNumber} onChange={e => setAccessFormData({...accessFormData, documentNumber: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Placa Vehículo</label>
                  <input type="text" value={accessFormData.vehiclePlate} onChange={e => setAccessFormData({...accessFormData, vehiclePlate: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Tipo Vehículo</label>
                  <input type="text" value={accessFormData.vehicleType} onChange={e => setAccessFormData({...accessFormData, vehicleType: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Portón Entrada</label>
                  <input type="text" value={accessFormData.entryGate} onChange={e => setAccessFormData({...accessFormData, entryGate: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Portón Salida</label>
                  <input type="text" value={accessFormData.exitGate} onChange={e => setAccessFormData({...accessFormData, exitGate: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Destino</label>
                  <input type="text" value={accessFormData.destination} onChange={e => setAccessFormData({...accessFormData, destination: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Propósito</label>
                  <input type="text" value={accessFormData.purpose} onChange={e => setAccessFormData({...accessFormData, purpose: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Nombre Anfitrión</label>
                  <input type="text" value={accessFormData.hostName} onChange={e => setAccessFormData({...accessFormData, hostName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Unidad Anfitrión</label>
                  <input type="text" value={accessFormData.hostUnit} onChange={e => setAccessFormData({...accessFormData, hostUnit: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select value={accessFormData.status} onChange={e => setAccessFormData({...accessFormData, status: e.target.value})}>
                    <option value="INGRESADO">Ingresado</option>
                    <option value="SALIDA">Salida</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Autorizado Por</label>
                  <input type="text" value={accessFormData.authorizedBy} onChange={e => setAccessFormData({...accessFormData, authorizedBy: e.target.value})} />
                </div>
                <div className="form-group full-width">
                  <label>Observaciones</label>
                  <textarea value={accessFormData.observations} onChange={e => setAccessFormData({...accessFormData, observations: e.target.value})} rows="3" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowAccessModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">{editingAccess ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderSecurityPointsTab = () => (
    <div className="security-tab-content">
      <div className="tab-header">
        <div className="header-title">
          <MapPin size={32} />
          <h1>Puntos Fijos de Vigilancia</h1>
        </div>
        <button className="btn-primary" onClick={() => { resetPointForm(); setEditingPoint(null); setShowPointModal(true); }}>
          <Plus size={20} />
          <span>Nuevo Punto</span>
        </button>
      </div>

      <div className="tab-filters">
        <div className="search-bar">
          <Search size={20} />
          <input
            placeholder="Buscar puntos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Ubicación</th>
              <th>Zona</th>
              <th>Tipo</th>
              <th>Guardia Asignado</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {securityPoints.filter(sp => 
              sp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              sp.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              sp.location?.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(sp => (
              <tr key={sp.id}>
                <td><span className="code-badge">{sp.code || '-'}</span></td>
                <td>{sp.name}</td>
                <td>{sp.location || '-'}</td>
                <td>{sp.zone || '-'}</td>
                <td>{sp.type || '-'}</td>
                <td>{sp.assignedGuard || '-'}</td>
                <td>
                  <span className={`status-badge ${sp.status === 'ACTIVO' ? 'active' : 'inactive'}`}>
                    {sp.status === 'ACTIVO' ? <Check size={14} /> : <X size={14} />}
                    {sp.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => { setEditingPoint(sp); setPointFormData(sp); setShowPointModal(true); }}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(sp.id, 'security-points')}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPointModal && (
        <div className="modal-overlay" onClick={() => setShowPointModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingPoint ? 'Editar Punto' : 'Nuevo Punto'}</h2>
              <button className="btn-close" onClick={() => setShowPointModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handlePointSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Código</label>
                  <input type="text" value={pointFormData.code} onChange={e => setPointFormData({...pointFormData, code: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Nombre</label>
                  <input type="text" value={pointFormData.name} onChange={e => setPointFormData({...pointFormData, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Ubicación</label>
                  <input type="text" value={pointFormData.location} onChange={e => setPointFormData({...pointFormData, location: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Zona</label>
                  <input type="text" value={pointFormData.zone} onChange={e => setPointFormData({...pointFormData, zone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Tipo</label>
                  <select value={pointFormData.type} onChange={e => setPointFormData({...pointFormData, type: e.target.value})}>
                    <option value="FIJO">Fijo</option>
                    <option value="MOVIL">Móvil</option>
                    <option value="TEMPORAL">Temporal</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Guardia Asignado</label>
                  <input type="text" value={pointFormData.assignedGuard} onChange={e => setPointFormData({...pointFormData, assignedGuard: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Teléfono Contacto</label>
                  <input type="text" value={pointFormData.contactPhone} onChange={e => setPointFormData({...pointFormData, contactPhone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select value={pointFormData.status} onChange={e => setPointFormData({...pointFormData, status: e.target.value})}>
                    <option value="ACTIVO">Activo</option>
                    <option value="INACTIVO">Inactivo</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Descripción</label>
                  <textarea value={pointFormData.description} onChange={e => setPointFormData({...pointFormData, description: e.target.value})} rows="2" />
                </div>
                <div className="form-group full-width">
                  <label>írea de Vigilancia</label>
                  <textarea value={pointFormData.surveillanceArea} onChange={e => setPointFormData({...pointFormData, surveillanceArea: e.target.value})} rows="2" />
                </div>
                <div className="form-group full-width">
                  <label>Horario</label>
                  <input type="text" value={pointFormData.schedule} onChange={e => setPointFormData({...pointFormData, schedule: e.target.value})} />
                </div>
                <div className="form-group full-width">
                  <label>Equipamiento</label>
                  <textarea value={pointFormData.equipment} onChange={e => setPointFormData({...pointFormData, equipment: e.target.value})} rows="2" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowPointModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">{editingPoint ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderSecurityGuardsTab = () => (
    <div className="security-tab-content">
      <div className="tab-header">
        <div className="header-title">
          <Users size={32} />
          <h1>Ronderos - Personal de Seguridad</h1>
        </div>
        <button className="btn-primary" onClick={() => { resetGuardForm(); setEditingGuard(null); setShowGuardModal(true); }}>
          <Plus size={20} />
          <span>Nuevo Rondero</span>
        </button>
      </div>

      <div className="tab-filters">
        <div className="search-bar">
          <Search size={20} />
          <input
            placeholder="Buscar ronderos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Documento</th>
              <th>Teléfono</th>
              <th>Turno</th>
              <th>Zona Asignada</th>
              <th>Punto Asignado</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {securityGuards.filter(sg => 
              sg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              sg.documentNumber?.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(sg => (
              <tr key={sg.id}>
                <td>{sg.name}</td>
                <td>{sg.documentNumber || '-'}</td>
                <td>{sg.phone || '-'}</td>
                <td>{sg.shift || '-'}</td>
                <td>{sg.assignedZone || '-'}</td>
                <td>{sg.assignedPoint || '-'}</td>
                <td>
                  <span className={`status-badge ${sg.status === 'ACTIVO' ? 'active' : 'inactive'}`}>
                    {sg.status === 'ACTIVO' ? <Check size={14} /> : <X size={14} />}
                    {sg.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => { setEditingGuard(sg); setGuardFormData(sg); setShowGuardModal(true); }}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(sg.id, 'security-guards')}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showGuardModal && (
        <div className="modal-overlay" onClick={() => setShowGuardModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingGuard ? 'Editar Rondero' : 'Nuevo Rondero'}</h2>
              <button className="btn-close" onClick={() => setShowGuardModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleGuardSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nombre</label>
                  <input type="text" value={guardFormData.name} onChange={e => setGuardFormData({...guardFormData, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Tipo Documento</label>
                  <select value={guardFormData.documentType} onChange={e => setGuardFormData({...guardFormData, documentType: e.target.value})}>
                    <option value="CC">Cédula</option>
                    <option value="TI">Tarjeta Identidad</option>
                    <option value="CE">Cédula Extranjería</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Número Documento</label>
                  <input type="text" value={guardFormData.documentNumber} onChange={e => setGuardFormData({...guardFormData, documentNumber: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input type="text" value={guardFormData.phone} onChange={e => setGuardFormData({...guardFormData, phone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={guardFormData.email} onChange={e => setGuardFormData({...guardFormData, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Turno</label>
                  <select value={guardFormData.shift} onChange={e => setGuardFormData({...guardFormData, shift: e.target.value})}>
                    <option value="DIURNO">Diurno</option>
                    <option value="NOCTURNO">Nocturno</option>
                    <option value="MIXTO">Mixto</option>
                    <option value="24H">24 Horas</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Zona Asignada</label>
                  <input type="text" value={guardFormData.assignedZone} onChange={e => setGuardFormData({...guardFormData, assignedZone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Punto Asignado</label>
                  <input type="text" value={guardFormData.assignedPoint} onChange={e => setGuardFormData({...guardFormData, assignedPoint: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select value={guardFormData.status} onChange={e => setGuardFormData({...guardFormData, status: e.target.value})}>
                    <option value="ACTIVO">Activo</option>
                    <option value="INACTIVO">Inactivo</option>
                    <option value="VACACION">Vacación</option>
                    <option value="LICENCIA">Licencia</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Talla Uniforme</label>
                  <input type="text" value={guardFormData.uniformSize} onChange={e => setGuardFormData({...guardFormData, uniformSize: e.target.value})} />
                </div>
                <div className="form-group full-width">
                  <label>Horario</label>
                  <input type="text" value={guardFormData.schedule} onChange={e => setGuardFormData({...guardFormData, schedule: e.target.value})} />
                </div>
                <div className="form-group full-width">
                  <label>Equipamiento</label>
                  <textarea value={guardFormData.equipment} onChange={e => setGuardFormData({...guardFormData, equipment: e.target.value})} rows="2" />
                </div>
                <div className="form-group full-width">
                  <label>Certificaciones</label>
                  <textarea value={guardFormData.certifications} onChange={e => setGuardFormData({...guardFormData, certifications: e.target.value})} rows="2" />
                </div>
                <div className="form-group">
                  <label>Contacto Emergencia</label>
                  <input type="text" value={guardFormData.emergencyContact} onChange={e => setGuardFormData({...guardFormData, emergencyContact: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Teléfono Emergencia</label>
                  <input type="text" value={guardFormData.emergencyPhone} onChange={e => setGuardFormData({...guardFormData, emergencyPhone: e.target.value})} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowGuardModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">{editingGuard ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderSecurityFindingsTab = () => (
    <div className="security-tab-content">
      <div className="tab-header">
        <div className="header-title">
          <FileText size={32} />
          <h1>Hallazgos de Seguridad</h1>
        </div>
        <button className="btn-primary" onClick={() => { resetFindingForm(); setEditingFinding(null); setShowFindingModal(true); }}>
          <Plus size={20} />
          <span>Nuevo Hallazgo</span>
        </button>
      </div>

      <div className="tab-filters">
        <div className="search-bar">
          <Search size={20} />
          <input
            placeholder="Buscar hallazgos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Tipo</th>
              <th>Severidad</th>
              <th>Ubicación</th>
              <th>Reportado Por</th>
              <th>Asignado A</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {securityFindings.filter(sf => 
              sf.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              sf.description?.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(sf => (
              <tr key={sf.id}>
                <td>{sf.title}</td>
                <td>{sf.type || '-'}</td>
                <td>
                  <span className={`severity-badge ${sf.severity?.toLowerCase()}`}>
                    {sf.severity}
                  </span>
                </td>
                <td>{sf.location || '-'}</td>
                <td>{sf.reportedBy || '-'}</td>
                <td>{sf.assignedTo || '-'}</td>
                <td>
                  <span className={`status-badge ${sf.status === 'RESUELTO' ? 'active' : 'inactive'}`}>
                    {sf.status === 'RESUELTO' ? <Check size={14} /> : <Clock size={14} />}
                    {sf.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => { setEditingFinding(sf); setFindingFormData(sf); setShowFindingModal(true); }}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(sf.id, 'security-findings')}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showFindingModal && (
        <div className="modal-overlay" onClick={() => setShowFindingModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingFinding ? 'Editar Hallazgo' : 'Nuevo Hallazgo'}</h2>
              <button className="btn-close" onClick={() => setShowFindingModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleFindingSubmit}>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Título</label>
                  <input type="text" value={findingFormData.title} onChange={e => setFindingFormData({...findingFormData, title: e.target.value})} required />
                </div>
                <div className="form-group full-width">
                  <label>Descripción</label>
                  <textarea value={findingFormData.description} onChange={e => setFindingFormData({...findingFormData, description: e.target.value})} rows="3" />
                </div>
                <div className="form-group">
                  <label>Tipo</label>
                  <select value={findingFormData.type} onChange={e => setFindingFormData({...findingFormData, type: e.target.value})}>
                    <option value="INFRAESTRUCTURA">Infraestructura</option>
                    <option value="PROCEDIMIENTO">Procedimiento</option>
                    <option value="EQUIPAMIENTO">Equipamiento</option>
                    <option value="PERSONAL">Personal</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Severidad</label>
                  <select value={findingFormData.severity} onChange={e => setFindingFormData({...findingFormData, severity: e.target.value})}>
                    <option value="BAJA">Baja</option>
                    <option value="MEDIA">Media</option>
                    <option value="ALTA">Alta</option>
                    <option value="CRITICA">Crítica</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Ubicación</label>
                  <input type="text" value={findingFormData.location} onChange={e => setFindingFormData({...findingFormData, location: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Zona</label>
                  <input type="text" value={findingFormData.zone} onChange={e => setFindingFormData({...findingFormData, zone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Reportado Por</label>
                  <input type="text" value={findingFormData.reportedBy} onChange={e => setFindingFormData({...findingFormData, reportedBy: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Asignado A</label>
                  <input type="text" value={findingFormData.assignedTo} onChange={e => setFindingFormData({...findingFormData, assignedTo: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Prioridad</label>
                  <select value={findingFormData.priority} onChange={e => setFindingFormData({...findingFormData, priority: e.target.value})}>
                    <option value="BAJA">Baja</option>
                    <option value="NORMAL">Normal</option>
                    <option value="ALTA">Alta</option>
                    <option value="URGENTE">Urgente</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select value={findingFormData.status} onChange={e => setFindingFormData({...findingFormData, status: e.target.value})}>
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="EN_PROCESO">En Proceso</option>
                    <option value="RESUELTO">Resuelto</option>
                    <option value="CERRADO">Cerrado</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Categoría</label>
                  <input type="text" value={findingFormData.category} onChange={e => setFindingFormData({...findingFormData, category: e.target.value})} />
                </div>
                <div className="form-group full-width">
                  <label>Acción Tomada</label>
                  <textarea value={findingFormData.actionTaken} onChange={e => setFindingFormData({...findingFormData, actionTaken: e.target.value})} rows="2" />
                </div>
                <div className="form-group full-width">
                  <label>Resolución</label>
                  <textarea value={findingFormData.resolution} onChange={e => setFindingFormData({...findingFormData, resolution: e.target.value})} rows="2" />
                </div>
                <div className="form-group full-width">
                  <label>Evidencia</label>
                  <textarea value={findingFormData.evidence} onChange={e => setFindingFormData({...findingFormData, evidence: e.target.value})} rows="2" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowFindingModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">{editingFinding ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderSecurityEventsTab = () => (
    <div className="security-tab-content">
      <div className="tab-header">
        <div className="header-title">
          <AlertTriangle size={32} />
          <h1>Eventos de Seguridad</h1>
        </div>
        <button className="btn-primary" onClick={() => { resetEventForm(); setEditingEvent(null); setShowEventModal(true); }}>
          <Plus size={20} />
          <span>Nuevo Evento</span>
        </button>
      </div>

      <div className="tab-filters">
        <div className="search-bar">
          <Search size={20} />
          <input
            placeholder="Buscar eventos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Tipo</th>
              <th>Severidad</th>
              <th>Ubicación</th>
              <th>Reportado Por</th>
              <th>Asignado A</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {securityEvents.filter(se => 
              se.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              se.description?.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(se => (
              <tr key={se.id}>
                <td>{se.title}</td>
                <td>{se.type || '-'}</td>
                <td>
                  <span className={`severity-badge ${se.severity?.toLowerCase()}`}>
                    {se.severity}
                  </span>
                </td>
                <td>{se.location || '-'}</td>
                <td>{se.reportedBy || '-'}</td>
                <td>{se.assignedTo || '-'}</td>
                <td>
                  <span className={`status-badge ${se.status === 'RESUELTO' ? 'active' : 'inactive'}`}>
                    {se.status === 'RESUELTO' ? <Check size={14} /> : <Clock size={14} />}
                    {se.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => { setEditingEvent(se); setEventFormData(se); setShowEventModal(true); }}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(se.id, 'security-events')}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEventModal && (
        <div className="modal-overlay" onClick={() => setShowEventModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingEvent ? 'Editar Evento' : 'Nuevo Evento'}</h2>
              <button className="btn-close" onClick={() => setShowEventModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEventSubmit}>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Título</label>
                  <input type="text" value={eventFormData.title} onChange={e => setEventFormData({...eventFormData, title: e.target.value})} required />
                </div>
                <div className="form-group full-width">
                  <label>Descripción</label>
                  <textarea value={eventFormData.description} onChange={e => setEventFormData({...eventFormData, description: e.target.value})} rows="3" />
                </div>
                <div className="form-group">
                  <label>Tipo</label>
                  <select value={eventFormData.type} onChange={e => setEventFormData({...eventFormData, type: e.target.value})}>
                    <option value="INCIDENTE">Incidente</option>
                    <option value="ACCIDENTE">Accidente</option>
                    <option value="ROBO">Robo</option>
                    <option value="VANDALISMO">Vandalismo</option>
                    <option value="AMENAZA">Amenaza</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Severidad</label>
                  <select value={eventFormData.severity} onChange={e => setEventFormData({...eventFormData, severity: e.target.value})}>
                    <option value="BAJA">Baja</option>
                    <option value="MEDIA">Media</option>
                    <option value="ALTA">Alta</option>
                    <option value="CRITICA">Crítica</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Ubicación</label>
                  <input type="text" value={eventFormData.location} onChange={e => setEventFormData({...eventFormData, location: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Zona</label>
                  <input type="text" value={eventFormData.zone} onChange={e => setEventFormData({...eventFormData, zone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Reportado Por</label>
                  <input type="text" value={eventFormData.reportedBy} onChange={e => setEventFormData({...eventFormData, reportedBy: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Asignado A</label>
                  <input type="text" value={eventFormData.assignedTo} onChange={e => setEventFormData({...eventFormData, assignedTo: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Prioridad</label>
                  <select value={eventFormData.priority} onChange={e => setEventFormData({...eventFormData, priority: e.target.value})}>
                    <option value="BAJA">Baja</option>
                    <option value="NORMAL">Normal</option>
                    <option value="ALTA">Alta</option>
                    <option value="URGENTE">Urgente</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select value={eventFormData.status} onChange={e => setEventFormData({...eventFormData, status: e.target.value})}>
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="EN_PROCESO">En Proceso</option>
                    <option value="RESUELTO">Resuelto</option>
                    <option value="CERRADO">Cerrado</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Categoría</label>
                  <input type="text" value={eventFormData.category} onChange={e => setEventFormData({...eventFormData, category: e.target.value})} />
                </div>
                <div className="form-group full-width">
                  <label>Testigos</label>
                  <textarea value={eventFormData.witnesses} onChange={e => setEventFormData({...eventFormData, witnesses: e.target.value})} rows="2" />
                </div>
                <div className="form-group full-width">
                  <label>Personas Involucradas</label>
                  <textarea value={eventFormData.involvedPersons} onChange={e => setEventFormData({...eventFormData, involvedPersons: e.target.value})} rows="2" />
                </div>
                <div className="form-group full-width">
                  <label>Acción Tomada</label>
                  <textarea value={eventFormData.actionTaken} onChange={e => setEventFormData({...eventFormData, actionTaken: e.target.value})} rows="2" />
                </div>
                <div className="form-group full-width">
                  <label>Resolución</label>
                  <textarea value={eventFormData.resolution} onChange={e => setEventFormData({...eventFormData, resolution: e.target.value})} rows="2" />
                </div>
                <div className="form-group full-width">
                  <label>Evidencia</label>
                  <textarea value={eventFormData.evidence} onChange={e => setEventFormData({...eventFormData, evidence: e.target.value})} rows="2" />
                </div>
                <div className="form-group">
                  <label>Tiempo de Respuesta</label>
                  <input type="text" value={eventFormData.responseTime} onChange={e => setEventFormData({...eventFormData, responseTime: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Seguimiento Requerido</label>
                  <select value={eventFormData.followUpRequired} onChange={e => setEventFormData({...eventFormData, followUpRequired: e.target.value})}>
                    <option value="">Seleccionar</option>
                    <option value="SI">Sí</option>
                    <option value="NO">No</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowEventModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">{editingEvent ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="security-management">
      <div className="security-header">
        <div className="header-title">
          <Shield size={32} />
          <h1>Gestión de Seguridad</h1>
        </div>
      </div>

      <div className="security-tabs">
        <button 
          className={`tab-button ${activeTab === 'access-control' ? 'active' : ''}`}
          onClick={() => setActiveTab('access-control')}
        >
          <Car size={18} />
          <span>Portería</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'security-points' ? 'active' : ''}`}
          onClick={() => setActiveTab('security-points')}
        >
          <MapPin size={18} />
          <span>Puntos Fijos</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'security-guards' ? 'active' : ''}`}
          onClick={() => setActiveTab('security-guards')}
        >
          <Users size={18} />
          <span>Ronderos</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'security-findings' ? 'active' : ''}`}
          onClick={() => setActiveTab('security-findings')}
        >
          <FileText size={18} />
          <span>Hallazgos</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'security-events' ? 'active' : ''}`}
          onClick={() => setActiveTab('security-events')}
        >
          <AlertTriangle size={18} />
          <span>Eventos</span>
        </button>
      </div>

      {activeTab === 'access-control' && renderAccessControlTab()}
      {activeTab === 'security-points' && renderSecurityPointsTab()}
      {activeTab === 'security-guards' && renderSecurityGuardsTab()}
      {activeTab === 'security-findings' && renderSecurityFindingsTab()}
      {activeTab === 'security-events' && renderSecurityEventsTab()}
    </div>
  );
}
