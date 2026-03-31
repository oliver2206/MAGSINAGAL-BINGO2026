import React, { useEffect, useRef, useState, useCallback } from "react";

const BALL_COLORS = {
  B: "#4dabf7",
  I: "#ff6b6b",
  N: "#e0e0e0",
  G: "#69db7c",
  O: "#f7c948",
};

const getLetter = (num) => {
  if (num <= 15) return "B";
  if (num <= 30) return "I";
  if (num <= 45) return "N";
  if (num <= 60) return "G";
  return "O";
};

export default function BingoFortune() {
  const canvasRef = useRef(null);
  const [balls, setBalls] = useState([]);
  const [calledNumbers, setCalledNumbers] = useState([]);

  // 🎯 Generate a bingo number
  const generateNumber = useCallback(() => {
    let num;
    do {
      num = Math.floor(Math.random() * 75) + 1;
    } while (calledNumbers.includes(num));

    const letter = getLetter(num);

    const newBall = {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      dx: (Math.random() - 0.5) * 2,
      dy: (Math.random() - 0.5) * 2,
      num,
      letter,
    };

    setCalledNumbers((prev) => [...prev, num]);
    setBalls((prev) => [...prev, newBall]);
  }, [calledNumbers]);

  // 🎨 Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      setBalls((prevBalls) =>
        prevBalls.map((ball) => {
          let { x, y, dx, dy } = ball;

          x += dx;
          y += dy;

          if (x < 30 || x > canvas.width - 30) dx *= -1;
          if (y < 30 || y > canvas.height - 30) dy *= -1;

          // Draw ball
          ctx.beginPath();
          ctx.arc(x, y, 30, 0, Math.PI * 2);
          ctx.fillStyle = BALL_COLORS[ball.letter];
          ctx.fill();
          ctx.stroke();

          // Text
          ctx.fillStyle = "#000";
          ctx.font = "bold 16px Arial";
          ctx.textAlign = "center";
          ctx.fillText(ball.letter, x, y - 5);
          ctx.fillText(ball.num, x, y + 12);

          return { ...ball, x, y, dx, dy };
        })
      );

      requestAnimationFrame(draw);
    };

    draw();
  }, []);

  // 🧠 Placeholder functions
  const pattern = () => alert("Pattern feature coming soon");
  const checker = () => alert("Checker feature coming soon");
  const analyzer = () => alert("Analyzer feature coming soon");
  const gallery = () => alert("Gallery feature coming soon");

  return (
    <div style={{ textAlign: "center" }}>
      <canvas ref={canvasRef} />

      <div style={styles.overlay}>
        <h1 style={styles.title}>BINGO FORTUNE</h1>

        <button style={styles.btn} onClick={generateNumber}>
          GENERATE
        </button>
        <button style={styles.btn} onClick={pattern}>
          PATTERN
        </button>
        <button style={styles.btn} onClick={checker}>
          CHECKER
        </button>
        <button style={styles.btn} onClick={analyzer}>
          ANALYZER
        </button>
        <button style={styles.btn} onClick={gallery}>
          GALLERY
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  title: {
    color: "white",
    marginBottom: "10px",
  },
  btn: {
    padding: "12px 20px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "none",
    background: "#333",
    color: "#fff",
    cursor: "pointer",
  },
};
