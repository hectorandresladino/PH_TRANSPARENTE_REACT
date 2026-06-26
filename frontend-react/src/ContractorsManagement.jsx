import React, { useState, useEffect } from 'react';
import { Building2, Search, Plus, Edit, Trash2, Filter, FileText, Phone, Mail, MapPin, Calendar, DollarSign, ShieldCheck, User, Briefcase } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || `http://${location.hostname}:8081/api`;

export default function ContractorsManagement() {
  const [contractors, setContractors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterService, setFilterService] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingContractor, setEditingContractor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    documentNumber: '',
    documentType: 'CC',
    nit: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    serviceType: '',
    specialization: '',
    status: 'ACTIVO',
    contractNumber: '',
    contractStartDate: '',
    contractEndDate: '',
    contractValue: '',
    paymentTerms: '',
    contactPerson: '',
    contactPhone: '',
    observations: '',
    insurance: '',
    license: ''
  });

  useEffect(() => {
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    try {
      const response = await fetch(`${API_URL}/contractors`);
      if (response.ok) {
        const data = await response.json();
        setContractors(data);
      }
    } catch (error) {
      console.error('Error fetching contractors:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingContractor 
        ? `${API_URL}/contractors/${editingContractor.id}`
        : `${API_URL}/contractors`;
      
      const method = editingContractor ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchContractors();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving contractor:', error);
    }
  };

  const handleEdit = (contractor) => {
    setEditingContractor(contractor);
    setFormData({
      name: contractor.name || '',
      documentNumber: contractor.documentNumber || '',
      documentType: contractor.documentType || 'CC',
      nit: contractor.nit || '',
      phone: contractor.phone || '',
      email: contractor.email || '',
      address: contractor.address || '',
      city: contractor.city || '',
      serviceType: contractor.serviceType || '',
      specialization: contractor.specialization || '',
      status: contractor.status || 'ACTIVO',
      contractNumber: contractor.contractNumber || '',
      contractStartDate: contractor.contractStartDate || '',
      contractEndDate: contractor.contractEndDate || '',
      contractValue: contractor.contractValue || '',
      paymentTerms: contractor.paymentTerms || '',
      contactPerson: contractor.contactPerson || '',
      contactPhone: contractor.contactPhone || '',
      observations: contractor.observations || '',
      insurance: contractor.insurance || '',
      license: contractor.license || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Â¿EstÃ¡ seguro de eliminar este contratista?')) {
      try {
        const response = await fetch(`${API_URL}/contractors/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchContractors();
        }
      } catch (error) {
        console.error('Error deleting contractor:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      documentNumber: '',
      documentType: 'CC',
      nit: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      serviceType: '',
      specialization: '',
      status: 'ACTIVO',
      contractNumber: '',
      contractStartDate: '',
      contractEndDate: '',
      contractValue: '',
      paymentTerms: '',
      contactPerson: '',
      contactPhone: '',
      observations: '',
      insurance: '',
      license: ''
    });
    setEditingContractor(null);
  };

  const filteredContractors = contractors.filter(contractor => {
    const matchesSearch = 
      contractor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contractor.documentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contractor.nit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contractor.contractNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || contractor.status === filterStatus;
    const matchesService = filterService === 'all' || contractor.serviceType === filterService;
    
    return matchesSearch && matchesStatus && matchesService;
  });

  const serviceTypes = [...new Set(contractors.map(c => c.serviceType).filter(Boolean))];

  return (
    <div className="contractors-management">
      <div className="contractors-header">
        <div className="header-title">
          <Building2 size={32} />
          <h1>GestiÃ³n de Contrataciones</h1>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus size={20} />
          Nuevo Contratista
        </button>
      </div>

      <div className="contractors-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre, documento, NIT o contrato..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter size={18} />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Todos los estados</option>
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
            <option value="SUSPENDIDO">Suspendido</option>
            <option value="FINALIZADO">Finalizado</option>
          </select>
        </div>
        <div className="filter-group">
          <Briefcase size={18} />
          <select value={filterService} onChange={(e) => setFilterService(e.target.value)}>
            <option value="all">Todos los servicios</option>
            {serviceTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Contratista</th>
              <th>Documento/NIT</th>
              <th>Servicio</th>
              <th>Contrato</th>
              <th>Valor</th>
              <th>Vigencia</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredContractors.map(contractor => (
              <tr key={contractor.id}>
                <td>
                  <div className="contractor-name">
                    <Building2 size={16} />
                    <div>
                      <strong>{contractor.name}</strong>
                      <div className="contractor-contact">
                        <Phone size={12} /> {contractor.phone}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="document-info">
                    <span className="doc-type">{contractor.documentType}</span>
                    <span>{contractor.documentNumber}</span>
                    {contractor.nit && <span className="nit">NIT: {contractor.nit}</span>}
                  </div>
                </td>
                <td>
                  <div className="service-info">
                    <span className="service-type">{contractor.serviceType}</span>
                    {contractor.specialization && (
                      <span className="specialization">{contractor.specialization}</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="contract-info">
                    <span className="contract-number">{contractor.contractNumber}</span>
                    {contractor.contractStartDate && (
                      <span className="contract-dates">
                        <Calendar size={12} />
                        {contractor.contractStartDate} - {contractor.contractEndDate}
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="value-info">
                    <DollarSign size={14} />
                    <span>{contractor.contractValue}</span>
                  </div>
                </td>
                <td>
                  <div className="contact-info">
                    <User size={14} />
                    <span>{contractor.contactPerson}</span>
                    <Phone size={12} />
                    <span>{contractor.contactPhone}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${contractor.status?.toLowerCase()}`}>
                    {contractor.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => handleEdit(contractor)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(contractor.id)}>
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
              <h2>{editingContractor ? 'Editar Contratista' : 'Nuevo Contratista'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>Ã—</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Nombre del Contratista *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tipo de Documento</label>
                  <select
                    value={formData.documentType}
                    onChange={(e) => setFormData({...formData, documentType: e.target.value})}
                  >
                    <option value="CC">CÃ©dula</option>
                    <option value="NIT">NIT</option>
                    <option value="CE">CÃ©dula ExtranjerÃ­a</option>
                    <option value="PAS">Pasaporte</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>NÃºmero de Documento</label>
                  <input
                    type="text"
                    value={formData.documentNumber}
                    onChange={(e) => setFormData({...formData, documentNumber: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>NIT</label>
                  <input
                    type="text"
                    value={formData.nit}
                    onChange={(e) => setFormData({...formData, nit: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>TelÃ©fono</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="form-group full-width">
                  <label>DirecciÃ³n</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Ciudad</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Tipo de Servicio *</label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                    required
                  >
                    <option value="">Seleccionar...</option>
                    <option value="VIGILANCIA">Vigilancia</option>
                    <option value="ASEO">Aseo</option>
                    <option value="MANTENIMIENTO">Mantenimiento</option>
                    <option value="JARDINERIA">JardinerÃ­a</option>
                    <option value="CONSTRUCCION">ConstrucciÃ³n</option>
                    <option value="CONSULTORIA">ConsultorÃ­a</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>EspecializaciÃ³n</label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>NÃºmero de Contrato</label>
                  <input
                    type="text"
                    value={formData.contractNumber}
                    onChange={(e) => setFormData({...formData, contractNumber: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="ACTIVO">Activo</option>
                    <option value="INACTIVO">Inactivo</option>
                    <option value="SUSPENDIDO">Suspendido</option>
                    <option value="FINALIZADO">Finalizado</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Fecha Inicio Contrato</label>
                  <input
                    type="date"
                    value={formData.contractStartDate}
                    onChange={(e) => setFormData({...formData, contractStartDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Fecha Fin Contrato</label>
                  <input
                    type="date"
                    value={formData.contractEndDate}
                    onChange={(e) => setFormData({...formData, contractEndDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Valor del Contrato</label>
                  <input
                    type="text"
                    value={formData.contractValue}
                    onChange={(e) => setFormData({...formData, contractValue: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Condiciones de Pago</label>
                  <input
                    type="text"
                    value={formData.paymentTerms}
                    onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Persona de Contacto</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>TelÃ©fono Contacto</label>
                  <input
                    type="text"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Seguro</label>
                  <input
                    type="text"
                    value={formData.insurance}
                    onChange={(e) => setFormData({...formData, insurance: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Licencia</label>
                  <input
                    type="text"
                    value={formData.license}
                    onChange={(e) => setFormData({...formData, license: e.target.value})}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Observaciones</label>
                  <textarea
                    value={formData.observations}
                    onChange={(e) => setFormData({...formData, observations: e.target.value})}
                    rows="3"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingContractor ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
