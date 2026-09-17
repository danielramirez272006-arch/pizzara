import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../shared/context/toast-context';
import { Button } from '../../shared/components/ui/button';

export const ConfiguracionPage = () => {
  const { addToast } = useToast();
  const [prefs, setPrefs] = useState({
    defaultBoard: 'acrylic',
    autoSave: true,
    gridDensity: 'medium',
    emailNotifications: true,
    highContrast: false,
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setPrefs((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    addToast('Preferencias de pizarra guardadas correctamente ⚙️', 'success');
  };

  return (
    <div className="page configuracion-page">
      <div className="container">
        <div className="config-card">
          <div className="config-header">
            <Link to="/perfil" className="back-link">← Volver al Perfil</Link>
            <h2>⚙️ Configuración de la Pizarra y Cuenta</h2>
            <p>Personaliza tus herramientas de exposición y entorno de trabajo.</p>
          </div>

          <form onSubmit={handleSave} className="config-form">
            <div className="config-section">
              <h3>🎨 Preferencias de Lienzo</h3>
              
              <div className="config-item">
                <label htmlFor="defaultBoard">Tipo de Pizarra Predeterminada:</label>
                <select
                  id="defaultBoard"
                  name="defaultBoard"
                  value={prefs.defaultBoard}
                  onChange={handleChange}
                  className="config-select"
                >
                  <option value="acrylic">Pizarra Acrílica (Blanca)</option>
                  <option value="chalk">Pizarra de Tiza (Verde Oscuro)</option>
                </select>
              </div>

              <div className="config-item">
                <label htmlFor="gridDensity">Densidad de Guía Predeterminada:</label>
                <select
                  id="gridDensity"
                  name="gridDensity"
                  value={prefs.gridDensity}
                  onChange={handleChange}
                  className="config-select"
                >
                  <option value="none">Sin Guía (En Blanco)</option>
                  <option value="lines">Renglones Docentes</option>
                  <option value="grid">Cuadrícula Milimetrada</option>
                </select>
              </div>

              <div className="config-checkbox-item">
                <input
                  type="checkbox"
                  id="autoSave"
                  name="autoSave"
                  checked={prefs.autoSave}
                  onChange={handleChange}
                />
                <label htmlFor="autoSave">Guardar automáticamente historial de trazos en memoria</label>
              </div>
            </div>

            <div className="config-section">
              <h3>🔔 Notificaciones y Accesibilidad</h3>
              
              <div className="config-checkbox-item">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  name="emailNotifications"
                  checked={prefs.emailNotifications}
                  onChange={handleChange}
                />
                <label htmlFor="emailNotifications">Recibir alertas de nuevos cursos y técnicas de rotulado</label>
              </div>

              <div className="config-checkbox-item">
                <input
                  type="checkbox"
                  id="highContrast"
                  name="highContrast"
                  checked={prefs.highContrast}
                  onChange={handleChange}
                />
                <label htmlFor="highContrast">Habilitar modo de alto contraste para proyección en aula</label>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Guardar Cambios
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
