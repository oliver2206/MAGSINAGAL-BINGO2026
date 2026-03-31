import React, { useState, useEffect, useRef } from 'react';

const BouncingBingoBalls = () => {
  const [balls, setBalls] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const animationRef = useRef(null);
  const containerRef = useRef(null);

  // Ball colors commonly used in bingo
  const colors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#FFE66D', // Yellow
    '#FF9F1C', // Orange
    '#9B59B6', // Purple
    '#3498DB', // Blue
    '#2ECC71', // Green
    '#E74C3C', // Crimson
    '#F39C12', // Gold
    '#1ABC9C', // Turquoise
  ];

  // Generate random ball data
  const generateBall = (id, containerWidth, containerHeight) => {
    const size = 50 + Math.random() * 20; // 50-70px
    const x = Math.random() * (containerWidth - size);
    const y = Math.random() * (containerHeight - size);
    const vx = (Math.random() - 0.5) * 8;
    const vy = (Math.random() - 0.5) * 8;
    const number = Math.floor(Math.random() * 75) + 1; // 1-75 for American bingo
    const letter = getBingoLetter(number);
    const color = colors[Math.floor(Math.random() * colors.length)];

    return {
      id,
      x,
      y,
      vx,
      vy,
      size,
      number,
      letter,
      color,
      mass: size / 50, // Mass proportional to size for realistic physics
    };
  };

  const getBingoLetter = (number) => {
    if (number <= 15) return 'B';
    if (number <= 30) return 'I';
    if (number <= 45) return 'N';
    if (number <= 60) return 'G';
    return 'O';
  };

  // Initialize balls
  const initializeBalls = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const newBalls = [];
    const ballCount = 15; // Number of bouncing balls
    
    for (let i = 0; i < ballCount; i++) {
      newBalls.push(generateBall(i, rect.width, rect.height));
    }
    setBalls(newBalls);
  };

  // Update ball positions with collision detection
  const updatePositions = () => {
    if (!containerRef.current || !isRunning) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    setBalls(prevBalls => {
      let newBalls = [...prevBalls];
      
      // Update positions and handle wall collisions
      for (let i = 0; i < newBalls.length; i++) {
        let ball = { ...newBalls[i] };
        
        // Update position
        ball.x += ball.vx;
        ball.y += ball.vy;
        
        // Wall collision (left/right)
        if (ball.x <= 0) {
          ball.x = 0;
          ball.vx = Math.abs(ball.vx);
        } else if (ball.x + ball.size >= width) {
          ball.x = width - ball.size;
          ball.vx = -Math.abs(ball.vx);
        }
        
        // Wall collision (top/bottom)
        if (ball.y <= 0) {
          ball.y = 0;
          ball.vy = Math.abs(ball.vy);
        } else if (ball.y + ball.size >= height) {
          ball.y = height - ball.size;
          ball.vy = -Math.abs(ball.vy);
        }
        
        // Add slight damping to prevent infinite bouncing
        ball.vx *= 0.998;
        ball.vy *= 0.998;
        
        newBalls[i] = ball;
      }
      
      // Ball-to-ball collision detection
      for (let i = 0; i < newBalls.length; i++) {
        for (let j = i + 1; j < newBalls.length; j++) {
          const ball1 = newBalls[i];
          const ball2 = newBalls[j];
          
          const dx = (ball1.x + ball1.size / 2) - (ball2.x + ball2.size / 2);
          const dy = (ball1.y + ball1.size / 2) - (ball2.y + ball2.size / 2);
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = (ball1.size + ball2.size) / 2;
          
          if (distance < minDistance) {
            // Collision detected - resolve using physics
            const angle = Math.atan2(dy, dx);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);
            
            // Rotate velocities
            const v1 = { x: ball1.vx, y: ball1.vy };
            const v2 = { x: ball2.vx, y: ball2.vy };
            
            const v1r = {
              x: v1.x * cos + v1.y * sin,
              y: v1.y * cos - v1.x * sin
            };
            const v2r = {
              x: v2.x * cos + v2.y * sin,
              y: v2.y * cos - v2.x * sin
            };
            
            // Collision response (elastic)
            const m1 = ball1.mass;
            const m2 = ball2.mass;
            const v1rf = {
              x: (v1r.x * (m1 - m2) + 2 * m2 * v2r.x) / (m1 + m2),
              y: v1r.y
            };
            const v2rf = {
              x: (v2r.x * (m2 - m1) + 2 * m1 * v1r.x) / (m1 + m2),
              y: v2r.y
            };
            
            // Rotate back
            ball1.vx = v1rf.x * cos - v1rf.y * sin;
            ball1.vy = v1rf.y * cos + v1rf.x * sin;
            ball2.vx = v2rf.x * cos - v2rf.y * sin;
            ball2.vy = v2rf.y * cos + v2rf.x * sin;
            
            // Separate balls to prevent sticking
            const overlap = minDistance - distance;
            const angleRad = Math.atan2(dy, dx);
            const moveX = Math.cos(angleRad) * overlap / 2;
            const moveY = Math.sin(angleRad) * overlap / 2;
            
            ball1.x -= moveX;
            ball1.y -= moveY;
            ball2.x += moveX;
            ball2.y += moveY;
            
            // Keep balls within bounds after separation
            ball1.x = Math.max(0, Math.min(ball1.x, width - ball1.size));
            ball1.y = Math.max(0, Math.min(ball1.y, height - ball1.size));
            ball2.x = Math.max(0, Math.min(ball2.x, width - ball2.size));
            ball2.y = Math.max(0, Math.min(ball2.y, height - ball2.size));
          }
        }
      }
      
      return newBalls;
    });
  };
  
  // Animation loop
  useEffect(() => {
    if (isRunning) {
      const animate = () => {
        updatePositions();
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning]);
  
  // Initialize balls when component mounts or container resizes
  useEffect(() => {
    initializeBalls();
    
    const handleResize = () => {
      initializeBalls();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Add a new ball
  const addBall = () => {
    if (!containerRef.current || !isRunning) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newBall = generateBall(Date.now(), rect.width, rect.height);
    setBalls(prev => [...prev, newBall]);
  };
  
  // Remove a ball
  const removeBall = () => {
    if (balls.length > 1) {
      setBalls(prev => prev.slice(0, -1));
    }
  };
  
  // Reset all balls
  const resetBalls = () => {
    initializeBalls();
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.controls}>
        <button onClick={() => setIsRunning(!isRunning)} style={styles.button}>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button onClick={addBall} disabled={!isRunning} style={styles.button}>
          Add Ball
        </button>
        <button onClick={removeBall} disabled={!isRunning || balls.length <= 1} style={styles.button}>
          Remove Ball
        </button>
        <button onClick={resetBalls} disabled={!isRunning} style={styles.button}>
          Reset
        </button>
        <div style={styles.ballCount}>Balls: {balls.length}</div>
      </div>
      
      <div 
        ref={containerRef}
        style={styles.bingoArea}
      >
        {balls.map(ball => (
          <div
            key={ball.id}
            style={{
              ...styles.ball,
              width: ball.size,
              height: ball.size,
              left: ball.x,
              top: ball.y,
              backgroundColor: ball.color,
              boxShadow: `0 4px 8px rgba(0,0,0,0.2), inset 0 -2px 0 rgba(0,0,0,0.1), inset 0 2px 0 rgba(255,255,255,0.3)`,
            }}
          >
            <div style={styles.letter}>{ball.letter}</div>
            <div style={styles.number}>{ball.number}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  controls: {
    marginBottom: '20px',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    transition: 'transform 0.2s, backgroundColor 0.2s',
  },
  buttonHover: {
    backgroundColor: '#45a049',
    transform: 'scale(1.05)',
  },
  ballCount: {
    padding: '10px 15px',
    backgroundColor: '#f0f0f0',
    borderRadius: '5px',
    fontWeight: 'bold',
  },
  bingoArea: {
    position: 'relative',
    width: '900px',
    height: '600px',
    border: '3px solid #333',
    borderRadius: '10px',
    backgroundColor: '#f5f5dc', // Cream color like bingo cards
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  },
  ball: {
    position: 'absolute',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'box-shadow 0.1s',
    color: 'white',
    textShadow: '1px 1px 0 rgba(0,0,0,0.3)',
    fontWeight: 'bold',
  },
  letter: {
    fontSize: '14px',
    fontWeight: 'bold',
    lineHeight: 1,
  },
  number: {
    fontSize: '20px',
    fontWeight: 'bold',
    lineHeight: 1,
  },
};

// Add hover effect for buttons
const buttonStyle = document.createElement('style');
buttonStyle.textContent = `
  button:hover {
    background-color: #45a049 !important;
    transform: scale(1.05);
  }
  button:active {
    transform: scale(0.95);
  }
  button:disabled {
    background-color: #cccccc !important;
    cursor: not-allowed;
    transform: none;
  }
`;
document.head.appendChild(buttonStyle);

export default BouncingBingoBalls;
