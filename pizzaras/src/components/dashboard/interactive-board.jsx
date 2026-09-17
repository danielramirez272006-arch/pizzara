import React, { useRef, useState, useEffect } from 'react';
import { useToast } from '../../shared/context/toast-context';

export const InteractiveBoard = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [boardType, setBoardType] = useState('acrylic'); // 'acrylic' | 'chalk'
  const [color, setColor] = useState('#2563eb');
  const [lineWidth, setLineWidth] = useState(4);
  const [tool, setTool] = useState('pen'); // 'pen' | 'eraser'
  const { addToast } = useToast();

  const colors = {
    acrylic: ['#0f172a', '#2563eb', '#dc2626', '#16a34a', '#d97706'],
    chalk: ['#ffffff', '#fde047', '#67e8f9', '#f472b6', '#a3e635'],
  };

  const getCanvasBackground = () => (boardType === 'acrylic' ? '#ffffff' : '#1e3a2f');

  // Inicializar canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.parentElement.clientWidth || 800;
    canvas.height = 420;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = getCanvasBackground();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [boardType]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = lineWidth;

    if (tool === 'eraser') {
      ctx.strokeStyle = getCanvasBackground();
    } else {
      ctx.strokeStyle = color;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = getCanvasBackground();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    addToast('Lienzo limpiado', 'info');
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `pizarra-practica-${Date.now()}.png`;
    link.click();
    addToast('¡Pizarra exportada en formato PNG!', 'success');
  };

  return (
    <div className="interactive-board-container">
      <div className="board-header">
        <div className="board-title-group">
          <h3>🎨 Lienzo de Práctica en Vivo</h3>
          <span className="badge-live">Modo Interactivo</span>
        </div>

        {/* Tipo de Pizarra */}
        <div className="board-type-selector">
          <button
            className={`type-btn ${boardType === 'acrylic' ? 'active' : ''}`}
            onClick={() => {
              setBoardType('acrylic');
              setColor('#2563eb');
            }}
          >
            🖊️ Acrílica (Blanca)
          </button>
          <button
            className={`type-btn ${boardType === 'chalk' ? 'active' : ''}`}
            onClick={() => {
              setBoardType('chalk');
              setColor('#ffffff');
            }}
          >
            🪵 Tiza (Verde Oscuro)
          </button>
        </div>
      </div>

      {/* Barra de herramientas */}
      <div className="board-toolbar">
        <div className="toolbar-group">
          <button
            className={`tool-btn ${tool === 'pen' ? 'active' : ''}`}
            onClick={() => setTool('pen')}
            title="Lápiz / Marcador"
          >
            ✏️ Trazo
          </button>
          <button
            className={`tool-btn ${tool === 'eraser' ? 'active' : ''}`}
            onClick={() => setTool('eraser')}
            title="Borrador"
          >
            🧽 Borrador
          </button>
        </div>

        {/* Paleta de colores */}
        <div className="toolbar-group colors-palette">
          {colors[boardType].map((c) => (
            <button
              key={c}
              className={`color-dot ${color === c && tool === 'pen' ? 'selected' : ''}`}
              style={{ backgroundColor: c }}
              onClick={() => {
                setColor(c);
                setTool('pen');
              }}
            />
          ))}
        </div>

        {/* Grosor de trazo */}
        <div className="toolbar-group stroke-group">
          <label htmlFor="stroke-slider">Grosor:</label>
          <input
            id="stroke-slider"
            type="range"
            min="2"
            max="24"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
          />
          <span>{lineWidth}px</span>
        </div>

        {/* Acciones */}
        <div className="toolbar-group actions-group">
          <button className="btn-board-action" onClick={clearCanvas}>
            🗑️ Limpiar
          </button>
          <button className="btn-board-action btn-board-export" onClick={downloadCanvas}>
            💾 Descargar PNG
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="practice-canvas"
        />
      </div>
    </div>
  );
};
