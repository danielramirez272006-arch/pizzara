import React, { useRef, useState, useEffect } from 'react';
import { useToast } from '../../shared/context/toast-context';

export const InteractiveBoard = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [boardType, setBoardType] = useState('acrylic'); // 'acrylic' | 'chalk' | 'blueprint'
  const [guidePattern, setGuidePattern] = useState('none'); // 'none' | 'lines' | 'grid' | 'dots' | 'isometric'
  const [color, setColor] = useState('#2563eb');
  const [lineWidth, setLineWidth] = useState(4);
  const [tool, setTool] = useState('pen'); // 'pen' | 'line' | 'arrow' | 'rect' | 'circle' | 'text' | 'stamp' | 'eraser'
  const [isFilled, setIsFilled] = useState(false);
  const [selectedStamp, setSelectedStamp] = useState('⭐ Excelente');
  const [textInput, setTextInput] = useState('Nota de clase');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [snapshot, setSnapshot] = useState(null);

  const { addToast } = useToast();

  const colorPalettes = {
    acrylic: ['#0f172a', '#2563eb', '#dc2626', '#16a34a', '#d97706', '#7c3aed', '#ec4899'],
    chalk: ['#ffffff', '#fde047', '#67e8f9', '#f472b6', '#a3e635', '#fed7aa', '#cbd5e1'],
    blueprint: ['#38bdf8', '#4ade80', '#fbbf24', '#f43f5e', '#a855f7', '#ffffff', '#06b6d4'],
  };

  const stampsList = [
    { label: '⭐ Excelente', icon: '⭐' },
    { label: '💡 Idea Clave', icon: '💡' },
    { label: '⚠️ Importante', icon: '⚠️' },
    { label: '❓ Pregunta', icon: '❓' },
    { label: '✅ Correcto', icon: '✅' },
    { label: '🎯 Objetivo', icon: '🎯' },
  ];

  const getCanvasBackground = () => {
    if (boardType === 'acrylic') return '#ffffff';
    if (boardType === 'chalk') return '#1b3b2b';
    return '#091e3a'; // blueprint
  };

  const getGuideColor = () => {
    if (boardType === 'acrylic') return 'rgba(0, 0, 0, 0.07)';
    if (boardType === 'chalk') return 'rgba(255, 255, 255, 0.12)';
    return 'rgba(56, 189, 248, 0.15)'; // blueprint neon guide
  };

  // Dibujar patrón de guía en el lienzo
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
    } else if (guidePattern === 'isometric') {
      const step = 30;
      for (let x = -height; x < width + height; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + height * 0.577, height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x - height * 0.577, height);
        ctx.stroke();
      }
    }
    ctx.restore();
  };

  // Inicializar canvas
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parentWidth = containerRef.current?.clientWidth || 900;
    canvas.width = isFullscreen ? window.innerWidth : parentWidth - 32;
    canvas.height = isFullscreen ? window.innerHeight - 140 : 480;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = getCanvasBackground();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGuidePattern(ctx, canvas.width, canvas.height);

    saveState();
  };

  useEffect(() => {
    initCanvas();
  }, [boardType, guidePattern, isFullscreen]);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-20), imageData]);
    setRedoStack([]); // reset redo on new action
  };

  const undo = () => {
    if (history.length <= 1) {
      addToast('No hay más acciones para deshacer', 'info');
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const newHistory = [...history];
    const currentState = newHistory.pop();
    setRedoStack((prev) => [...prev, currentState]);
    const previousState = newHistory[newHistory.length - 1];
    ctx.putImageData(previousState, 0, 0);
    setHistory(newHistory);
    addToast('Acción deshecha ↩️', 'info');
  };

  const redo = () => {
    if (redoStack.length === 0) {
      addToast('No hay acciones para rehacer', 'info');
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const newRedo = [...redoStack];
    const nextState = newRedo.pop();
    ctx.putImageData(nextState, 0, 0);
    setHistory((prev) => [...prev, nextState]);
    setRedoStack(newRedo);
    addToast('Acción rehecha ↪️', 'info');
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

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);

    if (tool === 'stamp') {
      ctx.save();
      ctx.font = 'bold 22px sans-serif';
      ctx.fillStyle = color;
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 4;
      ctx.fillText(selectedStamp, pos.x - 10, pos.y);
      ctx.restore();
      saveState();
      addToast(`Sello "${selectedStamp}" estampado`, 'success');
    } else if (tool === 'text') {
      const text = prompt('Escribe el texto para la pizarra:', textInput);
      if (text) {
        setTextInput(text);
        ctx.save();
        ctx.font = `bold ${Math.max(16, lineWidth * 3)}px var(--font-family, sans-serif)`;
        ctx.fillStyle = color;
        ctx.fillText(text, pos.x, pos.y);
        ctx.restore();
        saveState();
        addToast('Texto añadido a la pizarra', 'success');
      }
    }
  };

  const startDrawing = (e) => {
    if (tool === 'text' || tool === 'stamp') {
      handleCanvasClick(e);
      return;
    }

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
      ctx.putImageData(snapshot, 0, 0);
      ctx.beginPath();

      if (tool === 'rect') {
        const width = pos.x - startPos.x;
        const height = pos.y - startPos.y;
        if (isFilled) {
          ctx.globalAlpha = 0.25;
          ctx.fillRect(startPos.x, startPos.y, width, height);
          ctx.globalAlpha = 1.0;
        }
        ctx.strokeRect(startPos.x, startPos.y, width, height);
      } else if (tool === 'circle') {
        const radius = Math.sqrt(Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2));
        ctx.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2);
        if (isFilled) {
          ctx.globalAlpha = 0.25;
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
        ctx.stroke();
      } else if (tool === 'line') {
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      } else if (tool === 'arrow') {
        const headlen = 16;
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
    addToast('Pizarra limpiada', 'info');
  };

  // Cargar imagen de fondo
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        // Escalar imagen proporcionalmente
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.min(hRatio, vRatio, 1);
        const centerShiftX = (canvas.width - img.width * ratio) / 2;
        const centerShiftY = (canvas.height - img.height * ratio) / 2;

        ctx.drawImage(img, 0, 0, img.width, img.height, centerShiftX, centerShiftY, img.width * ratio, img.height * ratio);
        saveState();
        addToast('Imagen cargada en la pizarra para anotaciones 🖼️', 'success');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Plantillas Didácticas
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
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.32, 30);
      ctx.lineTo(canvas.width * 0.32, canvas.height - 100);
      ctx.moveTo(30, canvas.height - 100);
      ctx.lineTo(canvas.width - 30, canvas.height - 100);
      ctx.stroke();

      ctx.fillText('💡 IDEAS CLAVE / PREGUNTAS', 45, 60);
      ctx.fillText('📝 NOTAS DE CLASE PRINCIPALES', canvas.width * 0.32 + 20, 60);
      ctx.fillText('📌 RESUMEN DE LA LECCIÓN', 45, canvas.height - 60);
      addToast('Plantilla Método Cornell cargada 📋', 'success');
    } else if (type === 'mapa') {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      ctx.strokeRect(cx - 90, cy - 30, 180, 60);
      ctx.fillText('TEMA CENTRAL', cx - 60, cy + 5);

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
      addToast('Plantilla Mapa Conceptual cargada 🧠', 'success');
    } else if (type === 'comparativa') {
      const mid = canvas.width / 2;
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
      ctx.beginPath();
      ctx.moveTo(mid, 30);
      ctx.lineTo(mid, canvas.height - 30);
      ctx.moveTo(30, 80);
      ctx.lineTo(canvas.width - 30, 80);
      ctx.stroke();

      ctx.fillText('⚖️ OPCIÓN A (VENTAJAS / ANÁLISIS)', 60, 60);
      ctx.fillText('⚖️ OPCIÓN B (COMPARATIVA)', mid + 30, 60);
      addToast('Plantilla Tabla Comparativa cargada ⚖️', 'success');
    }
    ctx.restore();
    saveState();
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
      addToast('Modo Presentación en Pantalla Completa activado 📺', 'info');
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
      addToast('Pantalla completa desactivada', 'info');
    }
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `pizarra-pro-${boardType}-${Date.now()}.png`;
    link.click();
    addToast('¡Pizarra exportada en alta definición PNG! 💾', 'success');
  };

  return (
    <div
      ref={containerRef}
      className={`interactive-board-container ${isFullscreen ? 'fullscreen-board' : ''}`}
    >
      <div className="board-header">
        <div className="board-title-group">
          <h3>🎨 Pizarra Digital & Estudio Interactivo Pro</h3>
          <span className="badge-live">Modo Docente 4K</span>
        </div>

        {/* 3 Modos de Pizarra */}
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
          <button
            className={`type-btn type-blueprint ${boardType === 'blueprint' ? 'active' : ''}`}
            onClick={() => {
              setBoardType('blueprint');
              setColor('#38bdf8');
            }}
          >
            🌌 Digital Blueprint
          </button>
        </div>
      </div>

      {/* Barra de herramientas principal */}
      <div className="board-toolbar">
        {/* Herramientas de dibujo */}
        <div className="toolbar-group">
          <button className={`tool-btn ${tool === 'pen' ? 'active' : ''}`} onClick={() => setTool('pen')} title="Lápiz / Marcador">
            ✏️ Trazo
          </button>
          <button className={`tool-btn ${tool === 'line' ? 'active' : ''}`} onClick={() => setTool('line')} title="Línea Recta">
            📏 Línea
          </button>
          <button className={`tool-btn ${tool === 'arrow' ? 'active' : ''}`} onClick={() => setTool('arrow')} title="Flecha">
            ➡️ Flecha
          </button>
          <button className={`tool-btn ${tool === 'rect' ? 'active' : ''}`} onClick={() => setTool('rect')} title="Caja / Rectángulo">
            ⬜ Caja
          </button>
          <button className={`tool-btn ${tool === 'circle' ? 'active' : ''}`} onClick={() => setTool('circle')} title="Círculo">
            ⭕ Círculo
          </button>
          <button className={`tool-btn ${tool === 'text' ? 'active' : ''}`} onClick={() => setTool('text')} title="Escribir Texto">
            🔤 Texto
          </button>
          <button className={`tool-btn ${tool === 'stamp' ? 'active' : ''}`} onClick={() => setTool('stamp')} title="Sellos Docentes">
            ⭐ Sellos
          </button>
          <button className={`tool-btn ${tool === 'eraser' ? 'active' : ''}`} onClick={() => setTool('eraser')} title="Borrador">
            🧽 Borrador
          </button>
        </div>

        {/* Paleta de colores */}
        <div className="toolbar-group colors-palette">
          {colorPalettes[boardType].map((c) => (
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

        {/* Opciones de Relleno & Grosor */}
        <div className="toolbar-group options-group">
          <label className="checkbox-tool-label">
            <input
              type="checkbox"
              checked={isFilled}
              onChange={(e) => setIsFilled(e.target.checked)}
            />
            <span>Relleno</span>
          </label>

          <div className="stroke-group">
            <label htmlFor="stroke-slider">Grosor:</label>
            <input
              id="stroke-slider"
              type="range"
              min="2"
              max="28"
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
            />
            <span>{lineWidth}px</span>
          </div>
        </div>

        {/* Patrón Guía de Fondo */}
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
            <option value="isometric">Isométrica 3D</option>
          </select>
        </div>

        {/* Selector de Sello cuando la herramienta es stamp */}
        {tool === 'stamp' && (
          <div className="toolbar-group stamps-group">
            <select
              value={selectedStamp}
              onChange={(e) => setSelectedStamp(e.target.value)}
              className="stamp-selector"
            >
              {stampsList.map((s) => (
                <option key={s.label} value={s.label}>
                  {s.label}
                </option>
              ))}
            </select>
            <small className="hint-stamp">Haz clic en la pizarra para estampar</small>
          </div>
        )}

        {/* Acciones Rápidas */}
        <div className="toolbar-group actions-group">
          <button className="btn-board-action" onClick={undo} title="Deshacer (Ctrl+Z)">
            ↩️
          </button>
          <button className="btn-board-action" onClick={redo} title="Rehacer (Ctrl+Y)">
            ↪️
          </button>

          {/* Cargar Plantillas */}
          <div className="dropdown-templates">
            <select
              onChange={(e) => {
                if (e.target.value) loadTemplate(e.target.value);
                e.target.value = '';
              }}
              className="template-select"
            >
              <option value="">📋 Plantillas...</option>
              <option value="cornell">Método Cornell</option>
              <option value="mapa">Mapa Conceptual</option>
              <option value="comparativa">Tabla Comparativa</option>
            </select>
          </div>

          {/* Subir Imagen */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            accept="image/*"
          />
          <button
            className="btn-board-action"
            onClick={() => fileInputRef.current?.click()}
            title="Cargar imagen para anotar sobre ella"
          >
            📂 Imagen
          </button>

          <button className="btn-board-action" onClick={clearCanvas} title="Borrar todo el lienzo">
            🗑️ Limpiar
          </button>

          <button
            className="btn-board-action btn-fullscreen"
            onClick={toggleFullscreen}
            title="Modo Pantalla Completa"
          >
            {isFullscreen ? '🗗 Salir' : '📺 Presentar'}
          </button>

          <button className="btn-board-action btn-board-export" onClick={downloadCanvas} title="Exportar dibujo en imagen PNG">
            💾 Guardar PNG
          </button>
        </div>
      </div>

      {/* Lienzo Canvas */}
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
