import React, { useEffect, useRef, useState, useCallback } from 'react';

// Bingo numbers extracted from the provided image sequence
const BINGO_NUMBERS = [
  'G59', '27', 'N42', 'N35', 'G54', 'G46', 'N41', 'G49', 'B',
  'G50', 'G61', 'B12', 'B6', 'N37', 'O68', 'G53', 'N40', 'G47',
  'N63', 'O43', 'G29', 'O1', 'G28'
];

// Color mapping for BINGO letters
const getLetterColor = (call: string): string => {
  const letter = call.charAt(0);
  switch(letter) {
    case 'B': return '#e63946'; // red
    case 'I': return '#f4a261'; // orange
    case 'N': return '#2a9d8f'; // teal
    case 'G': return '#2b9348'; // green
    case 'O': return '#e9c46a'; // gold
    default: return '#1d3557'; // dark blue for plain numbers
  }
};

const BouncingBingoNumber: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [currentNumber, setCurrentNumber] = useState<string>(BINGO_NUMBERS[0]);
  const [isBouncing, setIsBouncing] = useState<boolean>(true);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  
  // Bouncing ball physics
  const ballRef = useRef({
    x: 0,
    y: 0,
    vx: 3.2,
    vy: -4.8,
    radius: 55,
    gravity: 0.35,
    bounceDamping: 0.82,
    wallDamping: 0.99,
    rotation: 0,
    rotationSpeed: 0.02
  });
  
  const dimensionsRef = useRef({ width: 800, height: 500 });
  
  // Draw the bouncing bingo ball with number
  const drawBall = useCallback((
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    radius: number,
    numberText: string,
    rotation: number
  ) => {
    const letterColor = getLetterColor(numberText);
    const isPlainNumber = !isNaN(Number(numberText.charAt(0)));
    
    // Draw shadow for depth
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    
    // Main ball gradient (3D sphere effect)
    const gradient = ctx.createRadialGradient(x - 12, y - 12, 8, x, y, radius);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.3, '#f0f0f0');
    gradient.addColorStop(0.7, '#dddddd');
    gradient.addColorStop(1, '#b0b0b0');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Outer ring with bingo color
    ctx.shadowBlur = 8;
    ctx.strokeStyle = letterColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x, y, radius - 2, 0, Math.PI * 2);
    ctx.stroke();
    
    // Inner glow ring
    ctx.strokeStyle = 'rgba(255,255,200,0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, radius - 6, 0, Math.PI * 2);
    ctx.stroke();
    
    // Highlight reflection
    const highlight = ctx.createRadialGradient(x - 15, y - 15, 5, x - 10, y - 10, 15);
    highlight.addColorStop(0, 'rgba(255,255,255,0.9)');
    highlight.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = highlight;
    ctx.beginPath();
    ctx.arc(x - 12, y - 12, 18, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw bingo-style ribbon behind text (semi-transparent)
    ctx.save();
    ctx.shadowBlur = 4;
    ctx.font = `bold ${Math.floor(radius * 0.55)}px "Segoe UI", "Poppins", "Impact", system-ui`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Text background pill
    const textWidth = ctx.measureText(numberText).width;
    const pillPadding = 12;
    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.roundRect(x - textWidth/2 - pillPadding, y - radius * 0.38, textWidth + pillPadding * 2, radius * 0.65, radius * 0.2);
    ctx.fill();
    
    // Main text with letter-specific color
    ctx.fillStyle = letterColor;
    ctx.shadowBlur = 0;
    ctx.font = `bold ${Math.floor(radius * 0.55)}px "Segoe UI", "Poppins", "Impact", system-ui`;
    ctx.fillText(numberText, x, y + 3);
    
    // Add a subtle stroke to text
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeText(numberText, x, y + 3);
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.floor(radius * 0.55)}px "Segoe UI", "Poppins", "Impact", system-ui`;
    ctx.fillText(numberText, x, y + 2);
    
    // BINGO stamp effect (small letter on bottom)
    if (!isPlainNumber && numberText.length > 1) {
      ctx.font = `bold ${Math.floor(radius * 0.22)}px monospace`;
      ctx.fillStyle = '#555';
      ctx.shadowBlur = 0;
      ctx.fillText('BINGO', x, y + radius * 0.65);
    }
    
    ctx.restore();
    
    // Rotation effect lines (bouncing motion lines)
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = '#ffd966';
    ctx.lineWidth = 2;
    for(let i = 0; i < 3; i++) {
      const angle = rotation + i * Math.PI * 2 / 3;
      const dx = Math.cos(angle) * radius * 0.7;
      const dy = Math.sin(angle) * radius * 0.7;
      ctx.beginPath();
      ctx.moveTo(x + dx * 0.6, y + dy * 0.6);
      ctx.lineTo(x + dx, y + dy);
      ctx.stroke();
    }
    ctx.restore();
  }, []);
  
  // Animation loop for bouncing physics
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const ball = ballRef.current;
    const dims = dimensionsRef.current;
    
    // Update physics if bouncing is active
    if (isBouncing) {
      ball.x += ball.vx;
      ball.y += ball.vy;
      
      // Apply gravity
      ball.vy += ball.gravity;
      
      // Rotation based on velocity
      ball.rotation += ball.rotationSpeed * (Math.abs(ball.vx) + Math.abs(ball.vy)) * 0.3;
      
      // Wall collisions (horizontal)
      if (ball.x + ball.radius >= dims.width) {
        ball.x = dims.width - ball.radius;
        ball.vx = -ball.vx * ball.wallDamping;
        // Add slight vibration effect
        triggerCelebration();
      }
      if (ball.x - ball.radius <= 0) {
        ball.x = ball.radius;
        ball.vx = -ball.vx * ball.wallDamping;
        triggerCelebration();
      }
      
      // Floor & ceiling collisions (vertical)
      if (ball.y + ball.radius >= dims.height) {
        ball.y = dims.height - ball.radius;
        ball.vy = -ball.vy * ball.bounceDamping;
        // Stop tiny bounces to avoid micro-bouncing
        if (Math.abs(ball.vy) < 0.8 && ball.y + ball.radius >= dims.height - 1) {
          ball.vy = 0;
          ball.y = dims.height - ball.radius;
        }
        triggerCelebration();
      }
      if (ball.y - ball.radius <= 0) {
        ball.y = ball.radius;
        ball.vy = -ball.vy * 0.85;
        triggerCelebration();
      }
    }
    
    // Clear canvas with bingo floor pattern
    ctx.clearRect(0, 0, dims.width, dims.height);
    
    // Draw bingo carpet / floor pattern
    ctx.fillStyle = '#1e3a2f';
    ctx.fillRect(0, 0, dims.width, dims.height);
    
    // Draw grid pattern (bingo card vibe)
    ctx.strokeStyle = '#ffd966';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.2;
    for(let i = 0; i < dims.width; i += 60) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, dims.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i % dims.height);
      ctx.lineTo(dims.width, i % dims.height);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    
    // Draw glowing floor shadow
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(ball.x, dims.height - 15, ball.radius * 0.9, ball.radius * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw the bouncing ball
    drawBall(ctx, ball.x, ball.y, ball.radius, currentNumber, ball.rotation);
    
    // Add extra motion streaks if bouncing fast
    const speed = Math.abs(ball.vx) + Math.abs(ball.vy);
    if (speed > 5 && isBouncing) {
      ctx.save();
      ctx.globalAlpha = 0.25;
      for(let s = 0; s < 2; s++) {
        const trailX = ball.x - ball.vx * (s+1) * 1.8;
        const trailY = ball.y - ball.vy * (s+1) * 1.8;
        ctx.beginPath();
        ctx.arc(trailX, trailY, ball.radius * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = '#ffb347';
        ctx.fill();
      }
      ctx.restore();
    }
    
    animationRef.current = requestAnimationFrame(animate);
  }, [isBouncing, currentNumber, drawBall, triggerCelebration]);
  
  // Small celebration effect (particles / flash)
  const triggerCelebration = useCallback(() => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 180);
  }, []);
  
  // Next number with spin effect and reset physics kick
  const nextNumber = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);
    
    // Add celebration bounce
    triggerCelebration();
    
    // Update to next number (cyclic)
    const nextIdx = (index + 1) % BINGO_NUMBERS.length;
    setIndex(nextIdx);
    setCurrentNumber(BINGO_NUMBERS[nextIdx]);
    
    // Give ball a random energy boost when number changes
    const ball = ballRef.current;
    ball.vx = (Math.random() - 0.5) * 7 + (ball.vx * 0.6);
    ball.vy = -6 - Math.random() * 3;
    
    // Ensure ball doesn't stick to edges
    if (ball.y + ball.radius >= dimensionsRef.current.height - 2) {
      ball.vy = -7;
    }
    
    // Playful vibration effect on canvas container
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.transform = 'scale(0.99)';
      setTimeout(() => {
        if (canvas) canvas.style.transform = '';
      }, 100);
    }
    
    setTimeout(() => setIsSpinning(false), 400);
  }, [index, triggerCelebration, isSpinning]);
  
  // Toggle bounce on/off
  const toggleBounce = useCallback(() => {
    setIsBouncing(prev => !prev);
    if (!isBouncing) {
      // Small push when reactivating
      const ball = ballRef.current;
      if (Math.abs(ball.vy) < 0.5 && ball.y + ball.radius >= dimensionsRef.current.height - 2) {
        ball.vy = -5;
        ball.vx = (Math.random() - 0.5) * 6;
      }
    }
  }, [isBouncing]);
  
  // Reset ball to center with moderate energy
  const resetBallPosition = useCallback(() => {
    const ball = ballRef.current;
    ball.x = dimensionsRef.current.width / 2;
    ball.y = dimensionsRef.current.height - ball.radius - 20;
    ball.vx = (Math.random() - 0.5) * 5;
    ball.vy = -4.5 - Math.random() * 3;
    ball.rotation = 0;
    triggerCelebration();
    if (!isBouncing) setIsBouncing(true);
  }, [triggerCelebration, isBouncing]);
  
  // Initialize canvas & handle resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      const maxWidth = Math.min(1000, window.innerWidth - 60);
      const aspectRatio = 800 / 500;
      let width = maxWidth;
      let height = width / aspectRatio;
      if (height > window.innerHeight - 150) {
        height = window.innerHeight - 150;
        width = height * aspectRatio;
      }
      canvas.width = width;
      canvas.height = height;
      dimensionsRef.current = { width: canvas.width, height: canvas.height };
      
      // Reset ball position relative to new dimensions
      const ball = ballRef.current;
      ball.x = canvas.width / 2;
      ball.y = canvas.height - ball.radius - 15;
      ball.vx = 3;
      ball.vy = -4;
      ball.radius = Math.min(65, canvas.width * 0.09, canvas.height * 0.13);
      ball.radius = Math.max(42, ball.radius);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Start animation
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);
  
  // Helper: roundRect for canvas
  useEffect(() => {
    if (!CanvasRenderingContext2D.prototype.roundRect) {
      CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.moveTo(x+r, y);
        this.lineTo(x+w-r, y);
        this.quadraticCurveTo(x+w, y, x+w, y+r);
        this.lineTo(x+w, y+h-r);
        this.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
        this.lineTo(x+r, y+h);
        this.quadraticCurveTo(x, y+h, x, y+h-r);
        this.lineTo(x, y+r);
        this.quadraticCurveTo(x, y, x+r, y);
        return this;
      };
    }
  }, []);
  
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'radial-gradient(circle at 20% 30%, #1a472a, #0a2417)',
      fontFamily: "'Poppins', 'Segoe UI', system-ui, sans-serif",
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(0,0,0,0.4)',
        borderRadius: '60px',
        padding: '20px 25px 25px 25px',
        backdropFilter: 'blur(6px)',
        boxShadow: '0 25px 40px rgba(0,0,0,0.5)'
      }}>
        <div style={{
          background: '#fcf3da',
          borderRadius: '48px',
          padding: '20px',
          boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.2)'
        }}>
          {/* Header with bingo style */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '15px',
            padding: '0 12px'
          }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['B','I','N','G','O'].map((letter, i) => (
                <span key={letter} style={{
                  fontSize: '28px',
                  fontWeight: '900',
                  color: ['#e63946','#f4a261','#2a9d8f','#2b9348','#e9c46a'][i],
                  textShadow: '2px 2px 0 rgba(0,0,0,0.1)',
                  letterSpacing: '4px'
                }}>{letter}</span>
              ))}
            </div>
            <div style={{
              background: '#2d3e2b',
              padding: '6px 16px',
              borderRadius: '40px',
              color: '#f9e7b3',
              fontWeight: 'bold',
              fontSize: '14px',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)'
            }}>
              🎯 BOUNCE BALL
            </div>
          </div>
          
          {/* Canvas area */}
          <div style={{ position: 'relative' }}>
            <canvas
              ref={canvasRef}
              style={{
                display: 'block',
                margin: '0 auto',
                borderRadius: '36px',
                boxShadow: '0 12px 28px black, inset 0 0 0 3px #ffefb9',
                cursor: 'pointer',
                background: '#2a4a33',
                transition: 'transform 0.08s ease'
              }}
              onClick={resetBallPosition}
            />
            {/* Celebration flash overlay */}
            {showCelebration && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '36px',
                background: 'radial-gradient(circle, rgba(255,215,0,0.45), transparent)',
                pointerEvents: 'none',
                animation: 'flashPop 0.2s ease-out'
              }} />
            )}
          </div>
          
          {/* Control panel */}
          <div style={{
            display: 'flex',
            gap: '14px',
            justifyContent: 'center',
            marginTop: '24px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={nextNumber}
              disabled={isSpinning}
              style={{
                background: 'linear-gradient(135deg, #ffb347, #ff8c1a)',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '60px',
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: 'white',
                cursor: 'pointer',
                boxShadow: '0 5px 0 #b45f06',
                transform: isSpinning ? 'scale(0.96)' : 'scale(1)',
                transition: '0.08s linear',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              🎲 NEXT NUMBER
            </button>
            
            <button
              onClick={toggleBounce}
              style={{
                background: isBouncing ? '#2c5538' : '#5a3e2b',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '60px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                color: 'white',
                cursor: 'pointer',
                boxShadow: '0 5px 0 #1f2f1c',
                transition: '0.08s linear',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {isBouncing ? '⏸️ PAUSE BOUNCE' : '▶️ START BOUNCE'}
            </button>
            
            <button
              onClick={resetBallPosition}
              style={{
                background: '#3a6b47',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '60px',
                fontSize: '1rem',
                fontWeight: 'bold',
                color: '#f9eec1',
                cursor: 'pointer',
                boxShadow: '0 5px 0 #1f3b28',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              🔄 RESET BALL
            </button>
          </div>
          
          {/* Current number display & progress */}
          <div style={{
            marginTop: '20px',
            textAlign: 'center',
            background: '#e8dcc0',
            borderRadius: '60px',
            padding: '12px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{
              background: '#2c2b26',
              padding: '6px 20px',
              borderRadius: '40px',
              color: '#ffdd99',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}>
              📢 BOUNCING BINGO
            </div>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '800',
              background: '#fff3df',
              padding: '5px 20px',
              borderRadius: '50px',
              fontFamily: 'monospace',
              letterSpacing: '2px',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <span style={{ color: getLetterColor(currentNumber) }}>{currentNumber}</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#4a3922', fontWeight: '500' }}>
              {index+1} / {BINGO_NUMBERS.length}
            </div>
          </div>
          
          {/* Tiny instruction */}
          <div style={{ fontSize: '12px', textAlign: 'center', marginTop: '14px', color: '#6b4c2c' }}>
            💡 Click canvas → reset ball position | Ball bounces with real physics!
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes flashPop {
          0% { opacity: 0.8; transform: scale(0.98);}
          100% { opacity: 0; transform: scale(1.02);}
        }
        button:active {
          transform: translateY(2px) !important;
          box-shadow: 0 2px 0 rgba(0,0,0,0.3) !important;
        }
        canvas {
          transition: transform 0.05s cubic-bezier(0.2, 1.2, 0.8, 1);
        }
      `}</style>
    </div>
  );
};

export default BouncingBingoNumber;
