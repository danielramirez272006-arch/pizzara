import React, { useRef, useState, useEffect } from 'react';
import { useToast } from '../../shared/context/toast-context';

export const InteractiveBoard = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [boardType, setBoardType] = useState('acrylic'); // 'acrylic' | 'chalk'
  const [guidePattern, setGuidePattern] = useState('none'); // 'none' | 'grid' | 'lines' | 'dots'
  const [color, setColor] = useState('#2563eb');
  const [lineWidth, setLineWidth] = useState(4);
  const [tool, setTool] = useState('pen'); // 'pen' | 'rect' | 'circle' | 'line' | 'arrow' | 'eraser'
  const [history, setHistory] = useState([]);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [snapshot, setSnapshot] = useState(null);
  const { addToast } = useToast();

  const colors = {
    acrylic: ['#0f172a', '#2563eb', '#dc2626', '#16a34a', '#d97706', '#7c3aed'],
    chalk: ['#ffffff', '#fde047', '#67e8f9', '#f472b6', '#a3e635', '#fed7aa'],
  };

  const getCanvasBackground = () => (boardType === 'acrylic' ? '#ffffff' : '#1e3a2f');
  const getGuideColor = () => (boardType === 'acrylic' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)');

  // Dibuja el patrón de fondo (cuadrícula, líneas o puntos)
  const drawGuidePattern = (ctx, width, height) => {
    if (guidePattern === 'none') return;

    ctx.save();
    ctx.strokeStyle = getGuideColor();
    ctx.fillStyle = getGuideColor();
    ctx.lineWidth = 1;

    if (guidePattern === 'lines') {
      const step = 28;
      for (let y = step; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    } else if (guidePattern === 'grid') {
      const step = 25;
      for (let x = step; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = step; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    } else if (guidePattern === 'dots') {
      const step = 25;
      for (let x = step; x < width; x += step) {
        for (let y = step; y < height; y += step) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();
  };

  // Inicializar canvas
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.parentElement.clientWidth || 850;
    canvas.height = 460;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = getCanvasBackground();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGuidePattern(ctx, canvas.width, canvas.height);

    // Guardar estado inicial
    saveState();
  };

  useEffect(() => {
    initCanvas();
  }, [boardType, guidePattern]);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-15), imageData]);
  };

  const undo = () => {
    if (history.length <= 1) {
      addToast('No hay más acciones para deshacer', 'info');
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const newHistory = [...history];
    newHistory.pop(); // remove current
    const previousState = newHistory[newHistory.length - 1];
    ctx.putImageData(previousState, 0, 0);
    setHistory(newHistory);
    addToast('Acción deshecha', 'info');
  };

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);

    setIsDrawing(true);
    setStartPos(pos);
    setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));

    if (tool === 'pen' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = tool === 'eraser' ? getCanvasBackground() : color;
    ctx.fillStyle = tool === 'eraser' ? getCanvasBackground() : color;

    if (tool === 'pen' || tool === 'eraser') {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (snapshot) {
      // Restaurar estado antes del arrastre para formas geométricas
      ctx.putImageData(snapshot, 0, 0);
      ctx.beginPath();

      if (tool === 'rect') {
        const width = pos.x - startPos.x;
        const height = pos.y - startPos.y;
        ctx.strokeRect(startPos.x, startPos.y, width, height);
      } else if (tool === 'circle') {
        const radius = Math.sqrt(Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2));
        ctx.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (tool === 'line') {
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      } else if (tool === 'arrow') {
        // Dibujar flecha
        const headlen = 15;
        const dx = pos.x - startPos.x;
        const dy = pos.y - startPos.y;
        const angle = Math.atan2(dy, dx);
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos.x - headlen * Math.cos(angle - Math.PI / 6), pos.y - headlen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos.x - headlen * Math.cos(angle + Math.PI / 6), pos.y - headlen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setSnapshot(null);
    saveState();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = getCanvasBackground();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGuidePattern(ctx, canvas.width, canvas.height);
    saveState();
    addToast('Lienzo limpiado', 'info');
  };

  const loadTemplate = (type) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    clearCanvas();

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.font = 'bold 16px sans-serif';
    ctx.lineWidth = 2;

    if (type === 'cornell') {
      // Método Cornell
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.35, 30);
      ctx.lineTo(canvas.width * 0.35, canvas.height - 110);
      ctx.moveTo(30, canvas.height - 110);
      ctx.lineTo(canvas.width - 30, canvas.height - 110);
      ctx.stroke();

      ctx.fillText('💡 IDEAS CLAVE / PREGUNTAS', 45, 60);
      ctx.fillText('📝 NOTAS DE CLASE PRINCIPALES', canvas.width * 0.35 + 20, 60);
      ctx.fillText('📌 RESUMEN DE LA LECCIÓN', 45, canvas.height - 80);
      addToast('Plantilla Método Cornell cargada', 'success');
    } else if (type === 'mapa') {
      // Mapa Conceptual
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      ctx.strokeRect(cx - 90, cy - 30, 180, 60);
      ctx.fillText('TEMA CENTRAL', cx - 60, cy + 5);

      // Nodos satélite
      const nodes = [
        { x: cx - 240, y: cy - 110, text: 'Subtema 1' },
        { x: cx + 120, y: cy - 110, text: 'Subtema 2' },
        { x: cx - 240, y: cy + 80, text: 'Subtema 3' },
        { x: cx + 120, y: cy + 80, text: 'Subtema 4' },
      ];

      nodes.forEach((n) => {
        ctx.strokeRect(n.x, n.y, 130, 45);
        ctx.fillText(n.text, n.x + 20, n.y + 28);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(n.x + 65, n.y + 22);
        ctx.stroke();
      });
      addToast('Plantilla Mapa Conceptual cargada', 'success');
    }
    ctx.restore();
    saveState();
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
          <h3>🎨 Pizarra de Práctica Profesional</h3>
          <span className="badge-live">Modo Interactivo Pro</span>
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
            🖊️ Acrílica Blanca
          </button>
          <button
            className={`type-btn ${boardType === 'chalk' ? 'active' : ''}`}
            onClick={() => {
              setBoardType('chalk');
              setColor('#ffffff');
            }}
          >
            🪵 Tiza Verde
          </button>
        </div>
      </div>

      {/* Barra de herramientas */}
      <div className="board-toolbar">
        {/* Herramientas de Dibujo y Figuras */}
        <div className="toolbar-group">
          <button className={`tool-btn ${tool === 'pen' ? 'active' : ''}`} onClick={() => setTool('pen')} title="Lápiz / Marcador">
            ✏️ Trazo
          </button>
          <button className={`tool-btn ${tool === 'line' ? 'active' : ''}`} onClick={() => setTool('line')} title="Línea Recta">
            📏 Línea
          </button>
          <button className={`tool-btn ${tool === 'arrow' ? 'active' : ''}`} onClick={() => setTool('arrow')} title="Flecha Explicativa">
            ➡️ Flecha
          </button>
          <button className={`tool-btn ${tool === 'rect' ? 'active' : ''}`} onClick={() => setTool('rect')} title="Rectángulo">
            ⬜ Caja
          </button>
          <button className={`tool-btn ${tool === 'circle' ? 'active' : ''}`} onClick={() => setTool('circle')} title="Círculo">
            ⭕ Círculo
          </button>
          <button className={`tool-btn ${tool === 'eraser' ? 'active' : ''}`} onClick={() => setTool('eraser')} title="Borrador">
            🧽 Borrador
          </button>
        </div>

        {/* Paleta de colores */}
        <div className="toolbar-group colors-palette">
          {colors[boardType].map((c) => (
            <button
              key={c}
              className={`color-dot ${color === c && tool !== 'eraser' ? 'selected' : ''}`}
              style={{ backgroundColor: c }}
              onClick={() => {
                setColor(c);
                if (tool === 'eraser') setTool('pen');
              }}
            />
          ))}
        </div>

        {/* Grosor */}
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

        {/* Patrón Guía */}
        <div className="toolbar-group guide-group">
          <label htmlFor="guide-select">Guía:</label>
          <select
            id="guide-select"
            value={guidePattern}
            onChange={(e) => setGuidePattern(e.target.value)}
            className="guide-selector"
          >
            <option value="none">En Blanco</option>
            <option value="lines">Renglones</option>
            <option value="grid">Cuadrícula</option>
            <option value="dots">Puntos</option>
          </select>
        </div>

        {/* Plantillas & Acciones */}
        <div className="toolbar-group actions-group">
          <button className="btn-board-action" onClick={undo} title="Deshacer último trazo">
            ↩️ Deshacer
          </button>
          <button className="btn-board-action" onClick={() => loadTemplate('cornell')}>
            📋 Cornell
          </button>
          <button className="btn-board-action" onClick={() => loadTemplate('mapa')}>
            🧠 Mapa
          </button>
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
