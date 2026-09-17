import React from 'react';
import { useAuth } from '../../shared/context/auth-context';

export const UserStats = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Cursos Inscritos', value: '3', icon: '📚' },
    { label: 'Pizarras Practicadas', value: '18', icon: '🎨' },
    { label: 'Horas de Práctica', value: '24.5h', icon: '⏳' },
    { label: 'Certificados Obtenidos', value: '1', icon: '🏆' },
  ];

  return (
    <div className="user-stats-container">
      <div className="stats-welcome">
        <h2>¡Hola de nuevo, {user?.name || 'Docente'}! 👋</h2>
        <p>Continúa practicando tus diagramas y técnicas de exposición.</p>
      </div>

      <div className="stats-grid">
        {stats.map((item, index) => (
          <div key={index} className="stat-card">
            <span className="stat-icon">{item.icon}</span>
            <div className="stat-info">
              <span className="stat-value">{item.value}</span>
              <span className="stat-label">{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
