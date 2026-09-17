import React, { useState } from 'react';
import { UserStats } from '../../components/dashboard/user-stats';
import { InteractiveBoard } from '../../components/dashboard/interactive-board';
import { useToast } from '../../shared/context/toast-context';

export const DashboardPage = () => {
  const { addToast } = useToast();
  const [modules, setModules] = useState([
    {
      id: 1,
      title: 'Módulo 1: Fundamentos de Diagramación en Pizarra Acrílica',
      description: 'Manejo de cuadrículas invisibles, jerarquía de 3 colores y trazos legibles a 10 metros de distancia.',
      completed: true,
      duration: '45 min',
    },
    {
      id: 2,
      title: 'Módulo 2: Técnicas de Tiza: Contrastes y Tipografía Docente',
      description: 'Ilustraciones explicativas rápidas, sombras, líneas dobles y mapas mentales sobre fondo oscuro.',
      completed: false,
      duration: '60 min',
    },
    {
      id: 3,
      title: 'Módulo 3: Pizarras Digitales en Vivo para Clases Híbridas',
      description: 'Configuración de stylus táctil, atajos gestuales e integración colaborativa con Miro y Jamboard.',
      completed: false,
      duration: '50 min',
    },
    {
      id: 4,
      title: 'Módulo 4: Método Cornell y Mapas Conceptuales en Directo',
      description: 'Estructuración de pizarras de alta retención para estudiantes y toma de apuntes guiada.',
      completed: false,
      duration: '40 min',
    },
  ]);

  const toggleModule = (id) => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const newState = !m.completed;
          addToast(
            newState ? `¡Módulo "${m.title.slice(0, 30)}..." completado! 🎉` : 'Módulo marcado como pendiente',
            newState ? 'success' : 'info'
          );
          return { ...m, completed: newState };
        }
        return m;
      })
    );
  };

  const completedCount = modules.filter((m) => m.completed).length;
  const progressPercent = Math.round((completedCount / modules.length) * 100);

  return (
    <div className="page dashboard-page">
      <div className="container">
        {/* Estadísticas del usuario */}
        <UserStats />

        {/* Pizarra Interactiva de Práctica */}
        <InteractiveBoard />

        {/* Módulos de aprendizaje con checklist interactivo */}
        <div className="dashboard-content">
          <div className="modules-header">
            <div>
              <h3>📚 Módulos del Curso de Pizarras</h3>
              <p className="modules-subtitle">Marca los módulos conforme completes tu práctica en la pizarra</p>
            </div>
            <div className="progress-badge">
              <span className="progress-text">{progressPercent}% Completado ({completedCount}/{modules.length})</span>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
          </div>

          <div className="dashboard-modules">
            {modules.map((module) => (
              <div
                key={module.id}
                className={`module-item ${module.completed ? 'module-item-completed' : ''}`}
                onClick={() => toggleModule(module.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="module-top">
                  <div className="module-status-group">
                    <span className={`module-status ${module.completed ? 'completed' : 'pending'}`}>
                      {module.completed ? '✅ Completado' : '⏳ En curso'}
                    </span>
                    <span className="module-duration">⏱️ {module.duration}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={module.completed}
                    onChange={() => {}}
                    className="module-checkbox"
                  />
                </div>
                <h4>{module.title}</h4>
                <p>{module.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
