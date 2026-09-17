import React from 'react';

export const PizarrasDestacadas = () => {
  const cursos = [
    {
      id: 1,
      tipo: 'Pizarras Acrílicas',
      icon: '🖊️',
      nivel: 'Intermedio',
      duracion: '12 Horas',
      descripcion: 'Técnicas de rotulado visible, esquematización ágil, códigos de color y mantenimiento preventivo de superficies.',
    },
    {
      id: 2,
      tipo: 'Pizarras de Tiza Clásica',
      icon: '🪵',
      nivel: 'Todos los niveles',
      duracion: '8 Horas',
      descripcion: 'Caligrafía docente tradicional, manejo de contrastes, sombras, uso ergonómico de tizas y técnicas libres de polvo.',
    },
    {
      id: 3,
      tipo: 'Pizarras Interactivas & Digitales',
      icon: '💻',
      nivel: 'Avanzado',
      duracion: '20 Horas',
      descripcion: 'Dominio de pantallas táctiles, integración con Miro, Jamboard, OneNote y dinámicas interactivas para aulas híbridas.',
    },
  ];

  return (
    <section className="courses-section">
      <div className="section-header">
        <h2>Cursos Especializados en Pizarras</h2>
        <p>Aprende metodologías pedagógicas y visuales comprobadas</p>
      </div>

      <div className="courses-grid">
        {cursos.map((curso) => (
          <div key={curso.id} className="course-card">
            <div className="course-icon">{curso.icon}</div>
            <div className="course-meta">
              <span className="badge-small">{curso.nivel}</span>
              <span className="course-duration">⏱️ {curso.duracion}</span>
            </div>
            <h3>{curso.tipo}</h3>
            <p>{curso.descripcion}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
