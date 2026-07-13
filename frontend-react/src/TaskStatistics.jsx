import React, { useState, useMemo } from 'react';
import { 
  BarChart3, Calendar, Clock, TrendingUp, Filter,
  ChevronLeft, ChevronRight, Activity, CheckCircle,
  AlertCircle, Users, FileText, Shield
} from 'lucide-react';

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

// Datos de ejemplo - en producción vendrían del backend
const generateMockData = (role) => {
  const data = {};
  const currentYear = new Date().getFullYear();
  
  for (let month = 0; month < 12; month++) {
    data[month] = {
      weeks: [],
      totalTasks: 0,
      totalTime: 0,
      avgTime: 0
    };
    
    for (let week = 1; week <= 4; week++) {
      const weekData = {
        week,
        days: DAYS.map((day, idx) => ({
          day,
          tasks: Math.floor(Math.random() * 8) + 1,
          timeSpent: Math.floor(Math.random() * 180) + 30, // minutos
          completed: Math.floor(Math.random() * 6) + 1,
          pending: Math.floor(Math.random() * 3)
        }))
      };
      
      const weekTasks = weekData.days.reduce((sum, d) => sum + d.tasks, 0);
      const weekTime = weekData.days.reduce((sum, d) => sum + d.timeSpent, 0);
      
      weekData.totalTasks = weekTasks;
      weekData.totalTime = weekTime;
      
      data[month].weeks.push(weekData);
      data[month].totalTasks += weekTasks;
      data[month].totalTime += weekTime;
    }
    
    data[month].avgTime = Math.round(data[month].totalTime / data[month].totalTasks);
  }
  
  return data;
};

const taskTypes = {
  admin: [
    { name: 'Gestión de usuarios', color: '#667eea' },
    { name: 'Revisión de pagos', color: '#10b981' },
    { name: 'Aprobación de PQR', color: '#f59e0b' },
    { name: 'Gestión documental', color: '#ef4444' },
    { name: 'Reuniones', color: '#8b5cf6' }
  ],
  consejero: [
    { name: 'Revisión de actas', color: '#10b981' },
    { name: 'Votaciones', color: '#667eea' },
    { name: 'Reuniones de consejo', color: '#f59e0b' },
    { name: 'Aprobación de presupuesto', color: '#ef4444' },
    { name: 'Revisión de contratos', color: '#8b5cf6' }
  ],
  revisor: [
    { name: 'Auditoría financiera', color: '#ef4444' },
    { name: 'Revisión de estados', color: '#667eea' },
    { name: 'Elaboración de informes', color: '#10b981' },
    { name: 'Verificación de contratos', color: '#f59e0b' },
    { name: 'Reuniones con administración', color: '#8b5cf6' }
  ]
};

export default function TaskStatistics({ userRole = 'admin', onBack }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [viewType, setViewType] = useState('weekly'); // weekly, monthly, yearly
  
  const roleKey = userRole.toLowerCase().includes('consej') ? 'consejero' : 
                  userRole.toLowerCase().includes('revisor') ? 'revisor' : 'admin';
  
  const data = useMemo(() => generateMockData(roleKey), [roleKey]);
  const monthData = data[selectedMonth];
  const weekData = monthData?.weeks[selectedWeek - 1];
  
  const maxTasks = Math.max(...(weekData?.days.map(d => d.tasks) || [1]));
  const maxTime = Math.max(...(weekData?.days.map(d => d.timeSpent) || [1]));

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getRoleTitle = () => {
    switch(roleKey) {
      case 'consejero': return 'Consejeros';
      case 'revisor': return 'Revisor Fiscal';
      default: return 'Administrador';
    }
  };

  const getRoleColor = () => {
    switch(roleKey) {
      case 'consejero': return '#10b981';
      case 'revisor': return '#ef4444';
      default: return '#667eea';
    }
  };

  // Calcular estadísticas anuales
  const yearlyStats = useMemo(() => {
    let totalTasks = 0;
    let totalTime = 0;
    const monthlyData = [];
    
    Object.keys(data).forEach(month => {
      totalTasks += data[month].totalTasks;
      totalTime += data[month].totalTime;
      monthlyData.push({
        month: MONTHS[month],
        tasks: data[month].totalTasks,
        time: data[month].totalTime,
        avgTime: data[month].avgTime
      });
    });
    
    return { totalTasks, totalTime, avgTime: Math.round(totalTime / totalTasks), monthlyData };
  }, [data]);

  return (
    <div style={{ padding: '0' }}>
      {/* Header con botón atrás */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {onBack && (
          <button 
            onClick={onBack}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: '#f1f5f9', 
              border: 'none', 
              padding: '10px 16px', 
              borderRadius: '10px', 
              cursor: 'pointer',
              fontWeight: '600',
              color: '#475569'
            }}
          >
            <ChevronLeft size={20} /> Atrás
          </button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            background: `linear-gradient(135deg, ${getRoleColor()} 0%, ${getRoleColor()}dd 100%)`, 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <BarChart3 size={24} color="white" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#102033' }}>Estadísticas de Tareas</h1>
            <p style={{ margin: 0, color: '#65758a', fontSize: '0.9rem' }}>{getRoleTitle()} - Año {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>

      {/* Resumen anual */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #d8e4ec' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Activity size={20} color={getRoleColor()} />
            <span style={{ color: '#65758a', fontSize: '0.9rem' }}>Total Tareas (Año)</span>
          </div>
          <span style={{ fontSize: '2rem', fontWeight: '700', color: '#102033' }}>{yearlyStats.totalTasks}</span>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #d8e4ec' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Clock size={20} color="#f59e0b" />
            <span style={{ color: '#65758a', fontSize: '0.9rem' }}>Tiempo Total</span>
          </div>
          <span style={{ fontSize: '2rem', fontWeight: '700', color: '#102033' }}>{formatTime(yearlyStats.totalTime)}</span>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #d8e4ec' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <TrendingUp size={20} color="#10b981" />
            <span style={{ color: '#65758a', fontSize: '0.9rem' }}>Promedio por Tarea</span>
          </div>
          <span style={{ fontSize: '2rem', fontWeight: '700', color: '#102033' }}>{formatTime(yearlyStats.avgTime)}</span>
        </div>
      </div>

      {/* Selector de vista */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['weekly', 'monthly', 'yearly'].map(type => (
          <button
            key={type}
            onClick={() => setViewType(type)}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              background: viewType === type ? getRoleColor() : '#f1f5f9',
              color: viewType === type ? 'white' : '#475569',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {type === 'weekly' ? 'Semanal' : type === 'monthly' ? 'Mensual' : 'Anual'}
          </button>
        ))}
      </div>

      {/* Selector de mes y semana */}
      {viewType !== 'yearly' && (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={() => setSelectedMonth(m => Math.max(0, m - 1))} style={{ background: '#f1f5f9', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
              <ChevronLeft size={20} />
            </button>
            <span style={{ fontWeight: '600', minWidth: '80px', textAlign: 'center' }}>{MONTHS[selectedMonth]}</span>
            <button onClick={() => setSelectedMonth(m => Math.min(11, m + 1))} style={{ background: '#f1f5f9', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
              <ChevronRight size={20} />
            </button>
          </div>
          
          {viewType === 'weekly' && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3, 4].map(week => (
                <button
                  key={week}
                  onClick={() => setSelectedWeek(week)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: selectedWeek === week ? `2px solid ${getRoleColor()}` : '1px solid #d8e4ec',
                    background: selectedWeek === week ? `${getRoleColor()}15` : 'white',
                    color: selectedWeek === week ? getRoleColor() : '#475569',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Sem {week}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Gráfica semanal */}
      {viewType === 'weekly' && weekData && (
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #d8e4ec', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 20px', color: '#102033' }}>Tareas por Día - Semana {selectedWeek}</h3>
          
          {/* Gráfica de barras */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '200px', marginBottom: '16px' }}>
            {weekData.days.map((day, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '100%', 
                  maxWidth: '50px',
                  height: `${(day.tasks / maxTasks) * 150}px`,
                  background: `linear-gradient(180deg, ${getRoleColor()} 0%, ${getRoleColor()}99 100%)`,
                  borderRadius: '8px 8px 0 0',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  paddingTop: '8px',
                  minHeight: '30px'
                }}>
                  <span style={{ color: 'white', fontWeight: '700', fontSize: '0.85rem' }}>{day.tasks}</span>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#65758a', fontWeight: '600' }}>{day.day}</span>
              </div>
            ))}
          </div>

          {/* Tiempo por día */}
          <h4 style={{ margin: '24px 0 16px', color: '#102033' }}>Tiempo Invertido por Día</h4>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '120px' }}>
            {weekData.days.map((day, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '100%', 
                  maxWidth: '50px',
                  height: `${(day.timeSpent / maxTime) * 80}px`,
                  background: `linear-gradient(180deg, #f59e0b 0%, #f59e0b99 100%)`,
                  borderRadius: '8px 8px 0 0',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  paddingTop: '4px',
                  minHeight: '25px'
                }}>
                  <span style={{ color: 'white', fontWeight: '600', fontSize: '0.7rem' }}>{formatTime(day.timeSpent)}</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#65758a' }}>{day.day}</span>
              </div>
            ))}
          </div>

          {/* Resumen de la semana */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginTop: '24px', padding: '16px', background: '#f6f9fb', borderRadius: '12px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#65758a' }}>Total Tareas</span>
              <p style={{ margin: '4px 0 0', fontWeight: '700', fontSize: '1.2rem', color: '#102033' }}>{weekData.totalTasks}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#65758a' }}>Tiempo Total</span>
              <p style={{ margin: '4px 0 0', fontWeight: '700', fontSize: '1.2rem', color: '#102033' }}>{formatTime(weekData.totalTime)}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#65758a' }}>Promedio/Tarea</span>
              <p style={{ margin: '4px 0 0', fontWeight: '700', fontSize: '1.2rem', color: '#102033' }}>{formatTime(Math.round(weekData.totalTime / weekData.totalTasks))}</p>
            </div>
          </div>
        </div>
      )}

      {/* Gráfica mensual */}
      {viewType === 'monthly' && monthData && (
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #d8e4ec', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 20px', color: '#102033' }}>Tareas por Semana - {MONTHS[selectedMonth]}</h3>
          
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', height: '200px', marginBottom: '16px' }}>
            {monthData.weeks.map((week, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '100%', 
                  maxWidth: '80px',
                  height: `${(week.totalTasks / Math.max(...monthData.weeks.map(w => w.totalTasks))) * 150}px`,
                  background: `linear-gradient(180deg, ${getRoleColor()} 0%, ${getRoleColor()}99 100%)`,
                  borderRadius: '12px 12px 0 0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingTop: '12px',
                  minHeight: '50px'
                }}>
                  <span style={{ color: 'white', fontWeight: '700', fontSize: '1.1rem' }}>{week.totalTasks}</span>
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem' }}>tareas</span>
                </div>
                <span style={{ fontSize: '0.85rem', color: '#65758a', fontWeight: '600' }}>Sem {idx + 1}</span>
                <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: '600' }}>{formatTime(week.totalTime)}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginTop: '24px', padding: '16px', background: '#f6f9fb', borderRadius: '12px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#65758a' }}>Total Mes</span>
              <p style={{ margin: '4px 0 0', fontWeight: '700', fontSize: '1.2rem', color: '#102033' }}>{monthData.totalTasks} tareas</p>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#65758a' }}>Tiempo Total</span>
              <p style={{ margin: '4px 0 0', fontWeight: '700', fontSize: '1.2rem', color: '#102033' }}>{formatTime(monthData.totalTime)}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#65758a' }}>Promedio/Tarea</span>
              <p style={{ margin: '4px 0 0', fontWeight: '700', fontSize: '1.2rem', color: '#102033' }}>{formatTime(monthData.avgTime)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Gráfica anual */}
      {viewType === 'yearly' && (
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #d8e4ec', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 20px', color: '#102033' }}>Tareas por Mes - Año {new Date().getFullYear()}</h3>
          
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '220px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
            {yearlyStats.monthlyData.map((month, idx) => (
              <div key={idx} style={{ flex: '1', minWidth: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '100%', 
                  maxWidth: '45px',
                  height: `${(month.tasks / Math.max(...yearlyStats.monthlyData.map(m => m.tasks))) * 160}px`,
                  background: `linear-gradient(180deg, ${getRoleColor()} 0%, ${getRoleColor()}99 100%)`,
                  borderRadius: '8px 8px 0 0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingTop: '8px',
                  minHeight: '40px'
                }}>
                  <span style={{ color: 'white', fontWeight: '700', fontSize: '0.85rem' }}>{month.tasks}</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#65758a', fontWeight: '600' }}>{month.month}</span>
              </div>
            ))}
          </div>

          {/* Tiempo por mes */}
          <h4 style={{ margin: '24px 0 16px', color: '#102033' }}>Tiempo Invertido por Mes</h4>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '140px', overflowX: 'auto', paddingBottom: '8px' }}>
            {yearlyStats.monthlyData.map((month, idx) => (
              <div key={idx} style={{ flex: '1', minWidth: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '100%', 
                  maxWidth: '45px',
                  height: `${(month.time / Math.max(...yearlyStats.monthlyData.map(m => m.time))) * 100}px`,
                  background: `linear-gradient(180deg, #f59e0b 0%, #f59e0b99 100%)`,
                  borderRadius: '8px 8px 0 0',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  paddingTop: '4px',
                  minHeight: '30px'
                }}>
                  <span style={{ color: 'white', fontWeight: '600', fontSize: '0.6rem' }}>{Math.round(month.time/60)}h</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#65758a' }}>{month.month}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tipos de tareas */}
      <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #d8e4ec' }}>
        <h3 style={{ margin: '0 0 20px', color: '#102033' }}>Distribución por Tipo de Tarea</h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          {taskTypes[roleKey].map((task, idx) => {
            const percentage = Math.floor(Math.random() * 30) + 10;
            return (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.9rem', color: '#102033', fontWeight: '500' }}>{task.name}</span>
                  <span style={{ fontSize: '0.85rem', color: '#65758a', fontWeight: '600' }}>{percentage}%</span>
                </div>
                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${percentage}%`, background: task.color, borderRadius: '4px' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
