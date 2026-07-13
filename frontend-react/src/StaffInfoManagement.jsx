import React, { useState } from 'react';
import { 
  Users, Phone, Heart, Building, BadgeCheck, Stethoscope,
  User, ChevronLeft, Mail, MapPin, Clock, Calendar,
  Briefcase, GraduationCap, FileText, Shield
} from 'lucide-react';

export default function StaffInfoManagement({ userRole = 'admin', onBack }) {
  const [activeTab, setActiveTab] = useState('admin'); // admin, contador, revisor

  // Datos del Administrador
  const adminData = {
    empresa: {
      nombre: 'Conjunto Residencial Torres del Parque',
      nit: '900.555.123-4',
      direccion: 'Calle 85 #15-30, Bogotá',
      telefono: '+57 601 555 1111',
      email: 'admin@torresdelparque.com',
      horario: 'Lunes a Viernes: 8:00 - 17:00 | Sábados: 8:00 - 12:00'
    },
    personal: [
      {
        name: 'Dr. Carlos Eduardo Martínez',
        cedula: '79.123.456',
        cargo: 'Administrador General',
        profesion: 'Administrador de Empresas',
        turno: 'Lunes a Viernes 8:00 - 17:00',
        oficina: 'Oficina Administrativa - Torre A Piso 1',
        telefono: '+57 315 111 2222',
        email: 'carlos.martinez@torresdelparque.com',
        contactoEmergencia: 'María Martínez (Esposa) - +57 316 222 3333',
        eps: 'Sanitas EPS',
        arl: 'Sura ARL',
        tipoSangre: 'O+',
        alergias: 'Ninguna conocida',
        condiciones: 'Ninguna',
        estado: 'activo',
        experiencia: '15 años en administración de propiedad horizontal'
      },
      {
        name: 'Ing. Laura Patricia Gómez',
        cedula: '52.987.654',
        cargo: 'Asistente Administrativa',
        profesion: 'Ingeniera Industrial',
        turno: 'Lunes a Viernes 8:00 - 17:00',
        oficina: 'Oficina Administrativa - Torre A Piso 1',
        telefono: '+57 315 333 4444',
        email: 'laura.gomez@torresdelparque.com',
        contactoEmergencia: 'Pedro Gómez (Padre) - +57 316 444 5555',
        eps: 'Compensar EPS',
        arl: 'Positiva ARL',
        tipoSangre: 'A+',
        alergias: 'Ninguna conocida',
        condiciones: 'Ninguna',
        estado: 'activo',
        experiencia: '5 años en gestión administrativa'
      },
      {
        name: 'Sandra Milena Rodríguez',
        cedula: '52.456.789',
        cargo: 'Recepcionista',
        profesion: 'Técnica en Secretariado',
        turno: 'Lunes a Sábado 6:00 - 14:00',
        oficina: 'Recepción Principal - Torre A',
        telefono: '+57 315 555 6666',
        email: 'recepcion@torresdelparque.com',
        contactoEmergencia: 'Luis Rodríguez (Hermano) - +57 316 666 7777',
        eps: 'Nueva EPS',
        arl: 'Colmena ARL',
        tipoSangre: 'B+',
        alergias: 'Ninguna conocida',
        condiciones: 'Ninguna',
        estado: 'activo',
        experiencia: '8 años en atención al cliente'
      }
    ]
  };

  // Datos del Contador
  const contadorData = {
    empresa: {
      nombre: 'Contadores Asociados & Cía S.A.S',
      nit: '900.777.888-9',
      direccion: 'Carrera 7 #72-41 Of. 502, Bogotá',
      telefono: '+57 601 777 8888',
      email: 'contacto@contadoresasociados.com',
      horario: 'Lunes a Viernes: 8:00 - 18:00'
    },
    personal: [
      {
        name: 'CPA. María Fernanda López',
        cedula: '52.111.222',
        cargo: 'Contadora Principal',
        profesion: 'Contadora Pública Titulada',
        tarjetaProfesional: 'TP-123456-T',
        turno: 'Lunes, Miércoles y Viernes 9:00 - 13:00',
        oficina: 'Oficina Contabilidad - Torre A Piso 1',
        telefono: '+57 318 888 1111',
        email: 'maria.lopez@contadoresasociados.com',
        contactoEmergencia: 'Juan López (Esposo) - +57 319 111 2222',
        eps: 'Colsanitas EPS',
        arl: 'Sura ARL',
        tipoSangre: 'AB+',
        alergias: 'Ninguna conocida',
        condiciones: 'Ninguna',
        estado: 'activo',
        experiencia: '12 años en contabilidad de propiedad horizontal',
        especialidad: 'NIIF, Impuestos, Propiedad Horizontal'
      },
      {
        name: 'Tec. Andrea Sofía Vargas',
        cedula: '1.023.456.789',
        cargo: 'Auxiliar Contable',
        profesion: 'Técnica en Contabilidad',
        tarjetaProfesional: 'N/A',
        turno: 'Lunes a Viernes 8:00 - 17:00',
        oficina: 'Oficina Contabilidad - Torre A Piso 1',
        telefono: '+57 318 888 3333',
        email: 'andrea.vargas@contadoresasociados.com',
        contactoEmergencia: 'Rosa Vargas (Madre) - +57 319 333 4444',
        eps: 'Famisanar EPS',
        arl: 'Positiva ARL',
        tipoSangre: 'O-',
        alergias: 'Aspirina',
        condiciones: 'Ninguna',
        estado: 'activo',
        experiencia: '3 años en auxiliar contable',
        especialidad: 'Facturación, Cartera, Tesorería'
      }
    ]
  };

  // Datos del Revisor Fiscal
  const revisorData = {
    empresa: {
      nombre: 'Auditoría & Control Fiscal Ltda',
      nit: '900.999.111-2',
      direccion: 'Avenida 19 #100-45 Of. 801, Bogotá',
      telefono: '+57 601 999 1111',
      email: 'contacto@auditoriaycontrol.com',
      horario: 'Lunes a Viernes: 8:00 - 17:00'
    },
    personal: [
      {
        name: 'CPA. Roberto Andrés Sánchez',
        cedula: '79.888.999',
        cargo: 'Revisor Fiscal Principal',
        profesion: 'Contador Público con Especialización en Revisoría Fiscal',
        tarjetaProfesional: 'TP-987654-T',
        turno: 'Martes y Jueves 10:00 - 14:00',
        oficina: 'Sala de Juntas - Torre A Piso 1',
        telefono: '+57 320 999 1111',
        email: 'roberto.sanchez@auditoriaycontrol.com',
        contactoEmergencia: 'Carmen Sánchez (Esposa) - +57 321 111 2222',
        eps: 'Medimás EPS',
        arl: 'Liberty ARL',
        tipoSangre: 'A-',
        alergias: 'Ninguna conocida',
        condiciones: 'Ninguna',
        estado: 'activo',
        experiencia: '20 años en revisoría fiscal',
        especialidad: 'Auditoría Financiera, Control Interno, NIIF'
      },
      {
        name: 'CPA. Diana Carolina Mejía',
        cedula: '52.777.888',
        cargo: 'Auditora Asistente',
        profesion: 'Contadora Pública',
        tarjetaProfesional: 'TP-456789-T',
        turno: 'Según programación de auditorías',
        oficina: 'Oficina Revisoría - Torre A Piso 1',
        telefono: '+57 320 999 3333',
        email: 'diana.mejia@auditoriaycontrol.com',
        contactoEmergencia: 'Carlos Mejía (Padre) - +57 321 333 4444',
        eps: 'Sanitas EPS',
        arl: 'Sura ARL',
        tipoSangre: 'B-',
        alergias: 'Ninguna conocida',
        condiciones: 'Ninguna',
        estado: 'activo',
        experiencia: '8 años en auditoría',
        especialidad: 'Auditoría de Gestión, Cumplimiento Normativo'
      }
    ]
  };

  const getActiveData = () => {
    switch(activeTab) {
      case 'contador': return contadorData;
      case 'revisor': return revisorData;
      default: return adminData;
    }
  };

  const getColor = () => {
    switch(activeTab) {
      case 'contador': return { primary: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' };
      case 'revisor': return { primary: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' };
      default: return { primary: '#667eea', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };
    }
  };

  const data = getActiveData();
  const colors = getColor();

  return (
    <div style={{ padding: '0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {onBack && (
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', border: 'none', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', color: '#475569' }}>
            <ChevronLeft size={20} /> Atrás
          </button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
          <div style={{ width: '48px', height: '48px', background: colors.gradient, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} color="white" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#102033' }}>Información del Personal</h1>
            <p style={{ margin: 0, color: '#65758a', fontSize: '0.9rem' }}>Datos generales, salud y contactos</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', flexWrap: 'wrap' }}>
        {[
          { id: 'admin', label: 'Administración', color: '#667eea' },
          { id: 'contador', label: 'Contaduría', color: '#f59e0b' },
          { id: 'revisor', label: 'Revisoría Fiscal', color: '#ef4444' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              border: 'none',
              background: activeTab === tab.id ? tab.color : 'transparent',
              color: activeTab === tab.id ? 'white' : '#475569',
              borderRadius: '10px 10px 0 0',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Información de la Empresa/Firma */}
      <div style={{ background: colors.gradient, padding: '24px', borderRadius: '16px', color: 'white', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building size={32} color="white" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem' }}>{data.empresa.nombre}</h2>
            <p style={{ margin: '4px 0 0', opacity: 0.8 }}>NIT: {data.empresa.nit}</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <span style={{ opacity: 0.7, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> Dirección</span>
            <p style={{ margin: '4px 0 0', fontWeight: '500' }}>{data.empresa.direccion}</p>
          </div>
          <div>
            <span style={{ opacity: 0.7, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> Teléfono</span>
            <p style={{ margin: '4px 0 0', fontWeight: '500' }}>{data.empresa.telefono}</p>
          </div>
          <div>
            <span style={{ opacity: 0.7, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> Email</span>
            <p style={{ margin: '4px 0 0', fontWeight: '500' }}>{data.empresa.email}</p>
          </div>
          <div>
            <span style={{ opacity: 0.7, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> Horario</span>
            <p style={{ margin: '4px 0 0', fontWeight: '500' }}>{data.empresa.horario}</p>
          </div>
        </div>
      </div>

      {/* Personal */}
      <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #d8e4ec' }}>
        <h3 style={{ margin: '0 0 20px', color: '#102033', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <User size={24} color={colors.primary} /> Personal {activeTab === 'admin' ? 'Administrativo' : activeTab === 'contador' ? 'Contable' : 'de Revisoría'}
        </h3>
        <div style={{ display: 'grid', gap: '20px' }}>
          {data.personal.map((person, idx) => (
            <div key={idx} style={{ 
              background: '#f6f9fb', 
              border: `2px solid ${colors.primary}33`,
              padding: '24px', 
              borderRadius: '16px' 
            }}>
              {/* Header de persona */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '60px', height: '60px', background: colors.primary, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={28} color="white" />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 4px', color: '#102033', fontSize: '1.1rem' }}>{person.name}</h4>
                    <p style={{ margin: '0 0 4px', color: colors.primary, fontWeight: '600' }}>{person.cargo}</p>
                    <p style={{ margin: 0, color: '#65758a', fontSize: '0.85rem' }}>CC: {person.cedula}</p>
                  </div>
                </div>
                <span style={{ 
                  background: person.estado === 'activo' ? '#059669' : '#64748b', 
                  color: 'white', 
                  padding: '8px 16px', 
                  borderRadius: '999px', 
                  fontSize: '0.8rem', 
                  fontWeight: '700' 
                }}>
                  ● ACTIVO
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                {/* Datos Profesionales */}
                <div style={{ background: 'white', padding: '16px', borderRadius: '12px' }}>
                  <h5 style={{ margin: '0 0 12px', color: colors.primary, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <GraduationCap size={16} /> Datos Profesionales
                  </h5>
                  <div style={{ display: 'grid', gap: '8px', fontSize: '0.85rem' }}>
                    <div><span style={{ color: '#65758a' }}>Profesión:</span> <strong>{person.profesion}</strong></div>
                    {person.tarjetaProfesional && (
                      <div><span style={{ color: '#65758a' }}>Tarjeta Prof.:</span> <strong>{person.tarjetaProfesional}</strong></div>
                    )}
                    <div><span style={{ color: '#65758a' }}>Experiencia:</span> <strong>{person.experiencia}</strong></div>
                    {person.especialidad && (
                      <div><span style={{ color: '#65758a' }}>Especialidad:</span> <strong>{person.especialidad}</strong></div>
                    )}
                  </div>
                </div>

                {/* Datos de Contacto */}
                <div style={{ background: 'white', padding: '16px', borderRadius: '12px' }}>
                  <h5 style={{ margin: '0 0 12px', color: '#2563eb', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Briefcase size={16} /> Datos Laborales
                  </h5>
                  <div style={{ display: 'grid', gap: '8px', fontSize: '0.85rem' }}>
                    <div><span style={{ color: '#65758a' }}>Horario:</span> <strong>{person.turno}</strong></div>
                    <div><span style={{ color: '#65758a' }}>Ubicación:</span> <strong>{person.oficina}</strong></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={14} color="#059669" />
                      <a href={`tel:${person.telefono}`} style={{ color: '#059669', fontWeight: '600', textDecoration: 'none' }}>{person.telefono}</a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Mail size={14} color="#2563eb" />
                      <a href={`mailto:${person.email}`} style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none', fontSize: '0.8rem' }}>{person.email}</a>
                    </div>
                  </div>
                </div>

                {/* Información de Salud */}
                <div style={{ background: 'white', padding: '16px', borderRadius: '12px' }}>
                  <h5 style={{ margin: '0 0 12px', color: '#dc2626', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Stethoscope size={16} /> Información de Salud
                  </h5>
                  <div style={{ display: 'grid', gap: '8px', fontSize: '0.85rem' }}>
                    <div><span style={{ color: '#65758a' }}>EPS:</span> <strong>{person.eps}</strong></div>
                    <div><span style={{ color: '#65758a' }}>ARL:</span> <strong>{person.arl}</strong></div>
                    <div><span style={{ color: '#65758a' }}>Tipo Sangre:</span> <strong style={{ color: '#dc2626' }}>{person.tipoSangre}</strong></div>
                    <div><span style={{ color: '#65758a' }}>Alergias:</span> <strong>{person.alergias}</strong></div>
                    {person.condiciones !== 'Ninguna' && (
                      <div style={{ background: '#fef3c7', padding: '6px 10px', borderRadius: '6px', color: '#92400e' }}>
                        <strong>⚠️ {person.condiciones}</strong>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contacto de Emergencia */}
                <div style={{ background: 'white', padding: '16px', borderRadius: '12px' }}>
                  <h5 style={{ margin: '0 0 12px', color: '#f59e0b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Heart size={16} /> Contacto de Emergencia
                  </h5>
                  <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '10px' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#92400e', fontWeight: '500' }}>{person.contactoEmergencia}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contactos Importantes */}
      <div style={{ background: '#dbeafe', padding: '24px', borderRadius: '16px', border: '1px solid #93c5fd', marginTop: '24px' }}>
        <h3 style={{ margin: '0 0 16px', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Phone size={24} /> Contactos Importantes
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {[
            { name: 'Administración', number: '+57 601 555 1111', icon: '🏢' },
            { name: 'Contabilidad', number: '+57 601 777 8888', icon: '📊' },
            { name: 'Revisoría Fiscal', number: '+57 601 999 1111', icon: '📋' },
            { name: 'Consejo de Admin.', number: '+57 315 000 0000', icon: '👥' },
            { name: 'Emergencias', number: '123', icon: '🚨' },
            { name: 'Portería', number: '+57 601 555 2222', icon: '🚪' }
          ].map((contact, idx) => (
            <a key={idx} href={`tel:${contact.number}`} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              background: 'white', 
              padding: '12px 16px', 
              borderRadius: '10px', 
              textDecoration: 'none',
              border: '1px solid #93c5fd'
            }}>
              <span style={{ fontSize: '1.5rem' }}>{contact.icon}</span>
              <div>
                <p style={{ margin: 0, color: '#1e40af', fontWeight: '600', fontSize: '0.9rem' }}>{contact.name}</p>
                <p style={{ margin: 0, color: '#2563eb', fontWeight: '700' }}>{contact.number}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
