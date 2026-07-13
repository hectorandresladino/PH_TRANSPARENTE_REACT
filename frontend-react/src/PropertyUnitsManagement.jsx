import React, { useState, useEffect } from 'react';
import { Building, Search, Plus, Edit, Trash2, Filter, MapPin, Home, User, Calendar, DollarSign } from 'lucide-react';

import { API_URL } from './api.js';

export default function PropertyUnitsManagement() {
  const [units, setUnits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, filterSetStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [formData, setFormData] = useState({
    unitNumber: '',
    unitType: 'APARTAMENTO',
    area: '',
    privateArea: '',
    commonArea: '',
    totalArea: '',
    ownershipCoefficient: '',
    floorNumber: '',
    block: '',
    building: '',
    propertyType: 'RESIDENCIAL',
    address: '',
    city: '',
    status: 'ACTIVO',
    constructionYear: '',
    description: '',
    numberOfRooms: '',
    numberOfBathrooms: '',
    numberOfParkingSpaces: '',
    hasBalcony: false,
    hasTerrace: false,
    hasStorage: false,
    observations: '',
    currentOwnerId: '',
    purchaseDate: '',
    purchaseValue: '',
    currentAssessmentValue: ''
  });

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const response = await fetch(`${API_URL}/property-units`);
      if (response.ok) {
        const data = await response.json();
        setUnits(data);
      }
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingUnit 
        ? `${API_URL}/property-units/${editingUnit.id}`
        : `${API_URL}/property-units`;
      
      const method = editingUnit ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchUnits();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving unit:', error);
    }
  };

  const handleEdit = (unit) => {
    setEditingUnit(unit);
    setFormData({
      unitNumber: unit.unitNumber || '',
      unitType: unit.unitType || 'APARTAMENTO',
      area: unit.area || '',
      privateArea: unit.privateArea || '',
      commonArea: unit.commonArea || '',
      totalArea: unit.totalArea || '',
      ownershipCoefficient: unit.ownershipCoefficient || '',
      floorNumber: unit.floorNumber || '',
      block: unit.block || '',
      building: unit.building || '',
      propertyType: unit.propertyType || 'RESIDENCIAL',
      address: unit.address || '',
      city: unit.city || '',
      status: unit.status || 'ACTIVO',
      constructionYear: unit.constructionYear || '',
      description: unit.description || '',
      numberOfRooms: unit.numberOfRooms || '',
      numberOfBathrooms: unit.numberOfBathrooms || '',
      numberOfParkingSpaces: unit.numberOfParkingSpaces || '',
      hasBalcony: unit.hasBalcony || false,
      hasTerrace: unit.hasTerrace || false,
      hasStorage: unit.hasStorage || false,
      observations: unit.observations || '',
      currentOwnerId: unit.currentOwnerId || '',
      purchaseDate: unit.purchaseDate || '',
      purchaseValue: unit.purchaseValue || '',
      currentAssessmentValue: unit.currentAssessmentValue || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta unidad?')) {
      try {
        const response = await fetch(`${API_URL}/property-units/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchUnits();
        }
      } catch (error) {
        console.error('Error deleting unit:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      unitNumber: '',
      unitType: 'APARTAMENTO',
      area: '',
      privateArea: '',
      commonArea: '',
      totalArea: '',
      ownershipCoefficient: '',
      floorNumber: '',
      block: '',
      building: '',
      propertyType: 'RESIDENCIAL',
      address: '',
      city: '',
      status: 'ACTIVO',
      constructionYear: '',
      description: '',
      numberOfRooms: '',
      numberOfBathrooms: '',
      numberOfParkingSpaces: '',
      hasBalcony: false,
      hasTerrace: false,
      hasStorage: false,
      observations: '',
      currentOwnerId: '',
      purchaseDate: '',
      purchaseValue: '',
      currentAssessmentValue: ''
    });
    setEditingUnit(null);
  };

  const filteredUnits = units.filter(unit => {
    const matchesSearch = 
      unit.unitNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.block?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.building?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || unit.status === filterStatus;
    const matchesType = filterType === 'all' || unit.unitType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="property-units-management">
      <div className="contractors-header">
        <div className="header-title">
          <Building size={32} />
          <h1>Gestión de Unidades</h1>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus size={20} />
          Nueva Unidad
        </button>
      </div>

      <div className="contractors-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por número, bloque o edificio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter size={18} />
          <select value={filterStatus} onChange={(e) => filterSetStatus(e.target.value)}>
            <option value="all">Todos los estados</option>
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
          </select>
        </div>
        <div className="filter-group">
          <Home size={18} />
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">Todos los tipos</option>
            <option value="APARTAMENTO">Apartamento</option>
            <option value="CASA">Casa</option>
            <option value="OFICINA">Oficina</option>
            <option value="LOCAL">Local</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Unidad</th>
              <th>Tipo</th>
              <th>írea</th>
              <th>Coeficiente</th>
              <th>Ubicación</th>
              <th>Propietario</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUnits.map(unit => (
              <tr key={unit.id}>
                <td>
                  <div className="unit-info">
                    <Building size={16} />
                    <strong>{unit.unitNumber}</strong>
                  </div>
                </td>
                <td>{unit.unitType}</td>
                <td>{unit.totalArea} mÂ²</td>
                <td>{unit.ownershipCoefficient}%</td>
                <td>
                  <div className="location-info">
                    <MapPin size={14} />
                    <span>Torre {unit.block} - Piso {unit.floorNumber}</span>
                  </div>
                </td>
                <td>
                  <div className="owner-info">
                    <User size={14} />
                    <span>ID: {unit.currentOwnerId}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${unit.status?.toLowerCase()}`}>
                    {unit.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => handleEdit(unit)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(unit.id)}>
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
              <h2>{editingUnit ? 'Editar Unidad' : 'Nueva Unidad'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>í—</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Número de Unidad *</label>
                  <input
                    type="text"
                    value={formData.unitNumber}
                    onChange={(e) => setFormData({...formData, unitNumber: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tipo de Unidad</label>
                  <select
                    value={formData.unitType}
                    onChange={(e) => setFormData({...formData, unitType: e.target.value})}
                  >
                    <option value="APARTAMENTO">Apartamento</option>
                    <option value="CASA">Casa</option>
                    <option value="OFICINA">Oficina</option>
                    <option value="LOCAL">Local</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>írea Total (mÂ²)</label>
                  <input
                    type="number"
                    value={formData.totalArea}
                    onChange={(e) => setFormData({...formData, totalArea: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Coeficiente de Copropiedad (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.ownershipCoefficient}
                    onChange={(e) => setFormData({...formData, ownershipCoefficient: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Bloque/Torre</label>
                  <input
                    type="text"
                    value={formData.block}
                    onChange={(e) => setFormData({...formData, block: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Piso</label>
                  <input
                    type="number"
                    value={formData.floorNumber}
                    onChange={(e) => setFormData({...formData, floorNumber: e.target.value})}
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
                  </select>
                </div>
                <div className="form-group">
                  <label>ID Propietario Actual</label>
                  <input
                    type="number"
                    value={formData.currentOwnerId}
                    onChange={(e) => setFormData({...formData, currentOwnerId: e.target.value})}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingUnit ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
