import React from 'react';
import { UserStats } from '../../components/dashboard/user-stats';
import { InteractiveBoard } from '../../components/dashboard/interactive-board';

export const DashboardPage = () => {
  return (
    <div className="page dashboard-page">
      <div className="container">
        {/* Estadísticas del usuario */}
        <UserStats />

        {/* Pizarra Interactiva de Práctica */}
        <InteractiveBoard />

        {/* Módulos de aprendizaje */}
        <div className="dashboard-content">
          <h3>Mis Clases Activas de Pizarra</h3>
          <div className="dashboard-modules">
            <div className="module-item">
              <div className="module-status completed">Completado</div>
              <h4>Módulo 1: Fundamentos de Diagramación en Pizarra Acrílica</h4>
              <p>Manejo de cuadrículas invisibles, jerarquía de marcadores y trazos legibles a distancia.</p>
            </div>
            <div className="module-item">
              <div className="module-status in-progress">En Progreso</div>
              <h4>Módulo 2: Técnicas de Tiza: Contrastes y Tipografía</h4>
              <p>Ilustraciones explicativas rápidas y mapas mentales sobre fondo oscuro.</p>
            </div>
            <div className="module-item">
              <div className="module-status pending">Pendiente</div>
              <h4>Módulo 3: Pizarras Digitales en Vivo para Clases Híbridas</h4>
              <p>Configuración de stylus, atajos de pantalla táctil y pizarras colaborativas.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
