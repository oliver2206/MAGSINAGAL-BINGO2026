import { useEffect, useRef, useState } from 'react';

const GRAVITY = 0.4;
const FRICTION = 0.82;
const BOUNCE = 0.72;
const BALL_RADIUS = 30;

// Generate random bingo ball
const getBingoBall = () => {
  const letters = ['B', 'I', 'N', 'G', 'O'];
  const ranges = {
    B: [1, 15],
    I: [16, 30],
    N: [31, 45],
    G: [46, 60],
    O: [61, 75],
  };

  const letter = letters[Math.floor(Math.random() * 5)];
  const [min, max] = ranges[letter];
  const number = Math.floor(Math.random() * (max - min + 1)) + min;

  const colors = {
    B: '#4dabf7',
    I: '#ff6b6b',
    N: '#dee2e6',
    G: '#69db7c',
    O: '#ffd166',
  };

  return {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 6,
    vy: (Math.random() - 0.5) * 6,
    letter,
    number,
    color: colors[letter],
    trail: [],
  };
};

export default function App() {
  const canvasRef = useRef(null);
  const ballsRef = useRef(Array.from({ length: 25 }, getBingoBall));
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;

      // Gradient background
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, '#4c00ff');
      bg.addColorStop(1, '#00aaff');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      ballsRef.current.forEach(ball => {
        // Physics
        ball.vy += GRAVITY;
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Walls
        if (ball.x + BALL_RADIUS > W) { ball.x = W - BALL_RADIUS; ball.vx *= -BOUNCE; }
        if (ball.x - BALL_RADIUS < 0) { ball.x = BALL_RADIUS; ball.vx *= -BOUNCE; }
        if (ball.y + BALL_RADIUS > H) {
          ball.y = H - BALL_RADIUS;
          ball.vy *= -BOUNCE;
          ball.vx *= FRICTION;
        }
        if (ball.y - BALL_RADIUS < 0) { ball.y = BALL_RADIUS; ball.vy *= -BOUNCE; }

        // Ball
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Text
        ctx.fillStyle = '#000';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(ball.letter, ball.x, ball.y - 6);

        ctx.font = 'bold 18px Arial';
        ctx.fillText(ball.number, ball.x, ball.y + 14);
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      />

      {/* Center UI */}
      <div style={centerUI}>
        <h1 style={titleStyle}>BINGO FORTUNE</h1>

       
      </div>
    </div>
  );
}

// Styles
const centerUI = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '15px',
};

const titleStyle = {
  color: '#fff',
  fontSize: '40px',
  letterSpacing: '4px',
  marginBottom: '10px',
};

const btn = {
  width: '220px',
  padding: '12px',
  background: '#333',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  fontSize: '16px',
  cursor: 'pointer',
  boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
};
