import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- Bouncing Ball React Component ---
// Inspired by the retro BINGO FORTUNE aesthetic: bold numbers, neon accents, checker patterns.

const BouncingBall: React.FC = () => {
  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // Ball physics state
  const [position, setPosition] = useState({ x: 300, y: 200 });
  const [velocity, setVelocity] = useState({ vx: 3.2, vy: -4.7 });
  const [gravity] = useState(0.35);
  const [bounceDamping] = useState(0.92);
  const [groundFriction] = useState(0.995);
  
  // Interactive controls
  const [isDragging, setIsDragging] = useState(false);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [tempVelocity, setTempVelocity] = useState({ vx: 0, vy: 0 });
  const [showTrail, setShowTrail] = useState(true);
  const [ballColor, setBallColor] = useState('#ffcc44');
  const [effectIntensity, setEffectIntensity] = useState(0.8);
  
  // Dimensions
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  
  // Random fortune phrases (bingo style)
  const fortunes = [
    "⭐ LUCKY STRIKE ⭐", "🎲 DOUBLE BOUNCE 🎲", "💎 JACKPOT HIT 💎", 
    "🍀 FOUR LEAF CLOVER 🍀", "🔔 BINGO BONUS 🔔", "✨ GOLDEN DICE ✨",
    "🎯 CENTER SPOT 🎯", "🌈 RAINBOW BOUNCE 🌈", "💥 POWER SPIN 💥"
  ];
  const [currentFortune, setCurrentFortune] = useState("⚡ BOUNCE READY ⚡");
  const [showFortune, setShowFortune] = useState(false);
  
  // Checker patterns & background style
  const [checkerStyle, setCheckerStyle] = useState<'dark' | 'neon' | 'classic'>('neon');
  
  // Resize observer
  useEffect(() => {
    const updateSize = () => {
      if (canvasRef.current) {
        const container = canvasRef.current.parentElement;
        if (container) {
          const maxWidth = Math.min(1000, window.innerWidth - 40);
          const width = maxWidth;
          const height = Math.min(550, window.innerHeight * 0.7);
          setDimensions({ width, height });
          canvasRef.current.width = width;
          canvasRef.current.height = height;
        }
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  // Reset ball to center with random velocity (but safe)
  const resetBall = useCallback(() => {
    const safeW = dimensions.width;
    const safeH = dimensions.height;
    setPosition({ x: safeW / 2, y: safeH / 3 });
    setVelocity({ 
      vx: (Math.random() * 5 + 2) * (Math.random() > 0.5 ? 1 : -1), 
      vy: -5 - Math.random() * 4 
    });
    setCurrentFortune("🔄 RESET BOUNCE 🔄");
    setShowFortune(true);
    setTimeout(() => setShowFortune(false), 800);
  }, [dimensions]);
  
  // Apply impulse (throw from drag)
  const applyImpulse = useCallback((fromX: number, fromY: number, toX: number, toY: number) => {
    const dx = (fromX - toX) * 0.28;
    const dy = (fromY - toY) * 0.28;
    const newVx = Math.min(Math.max(dx, -12), 12);
    const newVy = Math.min(Math.max(dy, -12), 8);
    setVelocity({ vx: newVx, vy: newVy });
    setPosition({ x: fromX, y: fromY });
    
    // show random fortune on flick
    const randomFort = fortunes[Math.floor(Math.random() * fortunes.length)];
    setCurrentFortune(randomFort);
    setShowFortune(true);
    setTimeout(() => setShowFortune(false), 600);
  }, [fortunes]);
  
  // Mouse / Touch interactions
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const canvasX = (e.clientX - rect.left) * (dimensions.width / rect.width);
    const canvasY = (e.clientY - rect.top) * (dimensions.height / rect.height);
    setIsDragging(true);
    setDragPos({ x: canvasX, y: canvasY });
    setTempVelocity({ vx: velocity.vx, vy: velocity.vy });
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };
  
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const canvasX = (e.clientX - rect.left) * (dimensions.width / rect.width);
    const canvasY = (e.clientY - rect.top) * (dimensions.height / rect.height);
    // Show rubberband effect line
    setDragPos({ x: canvasX, y: canvasY });
  };
  
  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const canvasX = (e.clientX - rect.left) * (dimensions.width / rect.width);
      const canvasY = (e.clientY - rect.top) * (dimensions.height / rect.height);
      const dx = dragPos.x - canvasX;
      const dy = dragPos.y - canvasY;
      if (Math.hypot(dx, dy) > 5) {
        applyImpulse(dragPos.x, dragPos.y, canvasX, canvasY);
      } else {
        // small nudge
        setVelocity({ vx: velocity.vx + (Math.random() - 0.5) * 2, vy: velocity.vy - 2 });
      }
    }
    setIsDragging(false);
    startAnimationLoop();
  };
  
  // Animation loop: update physics and render
  const startAnimationLoop = useCallback(() => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    
    let lastTimestamp = 0;
    let posX = position.x;
    let posY = position.y;
    let velX = velocity.vx;
    let velY = velocity.vy;
    const { width, height } = dimensions;
    const radius = Math.min(26, width * 0.065);
    
    const updatePhysics = () => {
      // Euler integration
      velY += gravity;
      posX += velX;
      posY += velY;
      
      // Ground collision (floor)
      if (posY + radius >= height) {
        posY = height - radius;
        velY = -velY * bounceDamping;
        velX = velX * groundFriction;
        if (Math.abs(velY) < 0.8 && velY > 0) velY = 0;
        // Trigger fortune bounce effect (with throttle via random)
        if (Math.abs(velY) > 2.5) {
          const bounceFort = fortunes[Math.floor(Math.random() * fortunes.length)];
          setCurrentFortune(bounceFort);
          setShowFortune(true);
          setTimeout(() => setShowFortune(false), 400);
        }
      }
      // Ceiling collision
      if (posY - radius <= 0) {
        posY = radius;
        velY = -velY * 0.92;
        if (Math.abs(velY) < 0.5) velY = 0;
      }
      // Left & right walls
      if (posX + radius >= width) {
        posX = width - radius;
        velX = -velX * 0.98;
      }
      if (posX - radius <= 0) {
        posX = radius;
        velX = -velX * 0.98;
      }
      
      // Apply small air resistance
      velX *= 0.999;
      
      setPosition({ x: posX, y: posY });
      setVelocity({ vx: velX, vy: velY });
    };
    
    const renderFrame = () => {
      updatePhysics();
      drawCanvas(posX, posY, radius);
      animationRef.current = requestAnimationFrame(renderFrame);
    };
    
    renderFrame();
  }, [dimensions, gravity, bounceDamping, groundFriction, fortunes]);
  
  // Drawing routine (includes checker patterns, glow, trail effect)
  const drawCanvas = (ballX: number, ballY: number, radius: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = dimensions.width;
    const h = dimensions.height;
    
    // ---- BACKGROUND: Checker pattern style ----
    const cellSize = 32;
    if (checkerStyle === 'neon') {
      ctx.fillStyle = '#0a121f';
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < w + cellSize; i += cellSize) {
        for (let j = 0; j < h + cellSize; j += cellSize) {
          if ((i + j) % (cellSize * 2) === 0) {
            ctx.fillStyle = '#1e2a3a';
            ctx.fillRect(i, j, cellSize, cellSize);
          } else {
            ctx.fillStyle = '#0d1b2a';
            ctx.fillRect(i, j, cellSize, cellSize);
          }
        }
      }
      // neon grid lines
      ctx.strokeStyle = '#2affb6';
      ctx.lineWidth = 0.6;
      for (let i = 0; i < w + cellSize; i += cellSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, h);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(w, i);
        ctx.stroke();
      }
    } else if (checkerStyle === 'classic') {
      ctx.fillStyle = '#1e3b2f';
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < w + 40; i += 40) {
        for (let j = 0; j < h + 40; j += 40) {
          if ((i + j) % 80 === 0) {
            ctx.fillStyle = '#2b5a42';
            ctx.fillRect(i, j, 40, 40);
          } else {
            ctx.fillStyle = '#1e4d38';
            ctx.fillRect(i, j, 40, 40);
          }
        }
      }
    } else {
      // dark mode with subtle bingo numbers
      ctx.fillStyle = '#010d0f';
      ctx.fillRect(0, 0, w, h);
      ctx.font = `bold ${Math.floor(cellSize * 0.7)}px "Courier New", monospace`;
      ctx.fillStyle = '#234f3c';
      for (let i = 20; i < w; i += 45) {
        for (let j = 20; j < h; j += 45) {
          const num = (Math.floor(i / 23) + Math.floor(j / 17)) % 10;
          ctx.fillText(`${num}`, i, j);
        }
      }
    }
    
    // ---- "BINGO FORTUNE" corner text ----
    ctx.font = `bold ${Math.max(18, Math.floor(w * 0.045))}px "Orbitron", "Segoe UI", monospace`;
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#f5e56b';
    ctx.shadowColor = '#ffaa33';
    ctx.fillText("🎲 BINGO FORTUNE 🎲", 18, 42);
    ctx.font = `12px monospace`;
    ctx.fillStyle = '#c0e0d0';
    ctx.fillText("BOUNCE · PREDICT · WIN", 20, 72);
    
    // ---- draw decorative side numbers (inspired by your image) ----
    ctx.font = `bold 18px "Courier New"`;
    ctx.fillStyle = '#ffdd88';
    const numbers = [6, 0, 18, 27, 71, 34, 41, 62, 54, 20, 69, 57, 30, 65, 12, 70, 46, 24, 19, 35, 4];
    for (let idx = 0; idx < numbers.length && idx < 25; idx++) {
      const x = w - 48 + (idx % 3) * 16;
      const y = 50 + Math.floor(idx / 3) * 24;
      if (x < w - 10 && y < h - 20) {
        ctx.fillStyle = '#b9f6ca';
        ctx.fillText(`${numbers[idx]}`, x, y);
      }
    }
    
    // ---- TRAIL EFFECT (ghost shadows) ----
    if (showTrail) {
      ctx.save();
      ctx.globalAlpha = 0.25 * effectIntensity;
      for (let i = 1; i <= 5; i++) {
        const trailX = ballX - velocity.vx * i * 1.8;
        const trailY = ballY - velocity.vy * i * 1.8;
        ctx.beginPath();
        ctx.arc(trailX, trailY, radius * (1 - i * 0.12), 0, Math.PI * 2);
        ctx.fillStyle = ballColor;
        ctx.shadowBlur = 12;
        ctx.fill();
      }
      ctx.restore();
    }
    
    // ---- MAIN BALL with GLOW ----
    ctx.shadowBlur = 18;
    ctx.shadowColor = `rgba(255, 200, 80, 0.8)`;
    const grad = ctx.createRadialGradient(ballX - 5, ballY - 5, 5, ballX, ballY, radius);
    grad.addColorStop(0, '#fff5b0');
    grad.addColorStop(0.5, ballColor);
    grad.addColorStop(1, '#c97800');
    ctx.beginPath();
    ctx.arc(ballX, ballY, radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#ffea9e';
    ctx.lineWidth = 2;
    ctx.stroke();
    // specular highlight
    ctx.beginPath();
    ctx.arc(ballX - 4, ballY - 5, radius * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 245, 0.7)';
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // draw inner bingo star icon
    ctx.font = `${Math.floor(radius * 0.8)}px "Segoe UI Emoji"`;
    ctx.fillStyle = '#1e2a1f';
    ctx.shadowBlur = 2;
    ctx.fillText("🎯", ballX - 10, ballY + 8);
    
    // ---- DRAG LINE (elastic effect) ----
    if (isDragging && dragPos) {
      ctx.beginPath();
      ctx.moveTo(ballX, ballY);
      ctx.lineTo(dragPos.x, dragPos.y);
      ctx.strokeStyle = '#ffb347';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 8]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(dragPos.x, dragPos.y, 12, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
      ctx.fill();
      ctx.fillStyle = '#ffd966';
      ctx.font = 'bold 16px monospace';
      ctx.fillText("⚡", dragPos.x - 7, dragPos.y + 6);
    }
    
    // FORTUNE POPUP (floating text)
    if (showFortune) {
      ctx.font = `bold ${Math.floor(w * 0.045)}px "Orbitron", monospace`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#ffaa33';
      ctx.fillStyle = '#ffec99';
      ctx.textAlign = 'center';
      ctx.fillText(currentFortune, w / 2, h * 0.18);
      ctx.textAlign = 'left';
      ctx.shadowBlur = 0;
    }
    
    // small checker panels (like UI buttons)
    ctx.font = 'bold 14px monospace';
    ctx.fillStyle = '#d4f1f9';
    ctx.fillText(`⚡ SPEED: ${Math.abs(velocity.vx + velocity.vy).toFixed(1)}`, w - 130, h - 18);
    ctx.fillStyle = '#ffc857';
    ctx.fillText(`🎲 BOUNCE FORTUNE`, w - 145, h - 38);
  };
  
  // Initialize animation after dimensions are ready
  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      setPosition({ x: dimensions.width / 2, y: dimensions.height - 60 });
      setVelocity({ vx: 3.8, vy: -6.2 });
      startAnimationLoop();
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [dimensions, startAnimationLoop]);
  
  // Sync canvas size on dimension change and redraw
  useEffect(() => {
    if (canvasRef.current && dimensions.width) {
      canvasRef.current.width = dimensions.width;
      canvasRef.current.height = dimensions.height;
    }
  }, [dimensions]);
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'radial-gradient(circle at 30% 10%, #061010, #020808)',
      fontFamily: '"Courier New", "Orbitron", monospace',
      padding: '20px',
    }}>
      <div style={{
        background: 'rgba(0, 0, 0, 0.6)',
        borderRadius: '48px',
        padding: '20px 20px 24px 20px',
        boxShadow: '0 20px 35px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,200,0.2)',
        border: '1px solid #ffd966'
      }}>
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            display: 'block',
            margin: '0 auto',
            borderRadius: '28px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5), 0 0 0 2px #f3c26b',
            cursor: isDragging ? 'grabbing' : 'grab',
            width: '100%',
            height: 'auto',
            background: '#00000022'
          }}
        />
        
        {/* Control Panel inspired by BINGO CHECKER buttons */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '12px',
          marginTop: '22px',
          padding: '10px 12px',
          background: '#0c1f1cd9',
          borderRadius: '60px',
          backdropFilter: 'blur(4px)'
        }}>
          <button onClick={resetBall} style={buttonStyle('#e6b422')}>🎲 RESET BALL</button>
          <button onClick={() => {
            setVelocity({ vx: (Math.random() * 8 - 4), vy: -7 - Math.random() * 4 });
            setCurrentFortune("✨ WILD SPIN ✨");
            setShowFortune(true);
            setTimeout(() => setShowFortune(false), 600);
          }} style={buttonStyle('#44aa88')}>🌀 RANDOM BOOST</button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1a2f2a', borderRadius: '40px', padding: '0 12px' }}>
            <span style={{ color: '#ffdd99', fontSize: '14px' }}>🎨 BALL</span>
            <input 
              type="color" value={ballColor} onChange={(e) => setBallColor(e.target.value)}
              style={{ width: '38px', height: '38px', border: 'none', background: 'transparent', cursor: 'pointer' }}
            />
          </div>
          
          <button onClick={() => setShowTrail(!showTrail)} style={buttonStyle(showTrail ? '#f5b042' : '#4f6f62')}>
            {showTrail ? '✨ TRAIL ON' : '🌙 TRAIL OFF'}
          </button>
          
          <select 
            value={checkerStyle} onChange={(e) => setCheckerStyle(e.target.value as any)}
            style={{ ...buttonStyle('#2c5a4a'), background: '#2c5a4a', fontFamily: 'monospace', fontWeight: 'bold' }}
          >
            <option value="neon">🌀 NEON CHECKER</option>
            <option value="classic">🍀 CLASSIC BINGO</option>
            <option value="dark">🔮 DARK NUMBERS</option>
          </select>
          
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#ddd' }}>💥 GLOW</span>
            <input 
              type="range" min="0" max="1" step="0.02" value={effectIntensity}
              onChange={(e) => setEffectIntensity(parseFloat(e.target.value))}
              style={{ width: '80px' }}
            />
          </div>
        </div>
        
        {/* Mini info panel: fortune & stats */}
        <div style={{
          marginTop: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#020e0caa',
          borderRadius: '40px',
          padding: '6px 20px',
          border: '1px solid #d4af37'
        }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span style={{ color: '#f3c969' }}>⚡ VX: {velocity.vx.toFixed(1)}</span>
            <span style={{ color: '#f3c969' }}>⬇️ VY: {velocity.vy.toFixed(1)}</span>
            <span style={{ color: '#b5ffcf' }}>🎯 BOUNCE COUNT: {Math.floor(Math.abs(velocity.vy * 3) % 99)}</span>
          </div>
          <div style={{ fontFamily: 'monospace', background: '#00000066', padding: '4px 12px', borderRadius: '50px' }}>
            <span style={{ color: '#ffcf4a' }}>🎰 BINGO FORTUNE · DRAG & FLICK 🎰</span>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '11px', color: '#8aa' }}>
          ⚡ Click + drag on ball to launch | bounce off walls & floor | bingo style checker patterns
        </div>
      </div>
    </div>
  );
};

// Helper button style (retro bingo)
const buttonStyle = (bg: string): React.CSSProperties => ({
  background: bg,
  border: 'none',
  padding: '8px 18px',
  borderRadius: '40px',
  fontWeight: 'bold',
  fontFamily: '"Orbitron", "Courier New", monospace',
  fontSize: '14px',
  color: '#0f1f1c',
  cursor: 'pointer',
  boxShadow: '0 3px 0 #6b3e00',
  transition: '0.07s linear',
  letterSpacing: '1px'
});

export default BouncingBall;
