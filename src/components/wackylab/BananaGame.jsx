import React, { useState, useEffect, useRef } from "react";
import { playDefaultSound } from "../../services/audio";

const MAX_EARN_PER_GAME = 50;

export default function BananaGame({ addBananas, globalVolume }) {
  const [gameState, setGameState] = useState("START"); // START, PLAYING, GAMEOVER
  const [score, setScore] = useState(0);
  const [bananasEarned, setBananasEarned] = useState(0);
  const [lives, setLives] = useState(3);
  const [highScore, setHighScore] = useState(0);
  const [combo, setCombo] = useState(0);

  const canvasRef = useRef(null);
  const stateRef = useRef({
    gameState: "START",
    score: 0,
    bananasEarned: 0,
    lives: 3,
    playerX: 270,
    playerTargetX: 270,
    playerWidth: 60,
    playerHeight: 70,
    tilt: 0,
    expression: "normal",
    expressionTimer: 0,
    speedBoost: false,
    speedBoostTime: 0,
    items: [],
    particles: [],
    spawnTimer: 0, // Tijd-gebaseerde spawn timer (in plaats van frame-gebaseerd!)
    clouds: [
      { x: 50, y: 40, speed: 15, size: 40 },
      { x: 300, y: 70, speed: 10, size: 60 },
      { x: 500, y: 30, speed: 20, size: 50 },
    ],
    keys: {},
    combo: 0,
    lastScore: 0,
    lastBananasEarned: 0,
    lastLives: 3,
    lastCombo: 0,
    lastTime: 0,
  });

  // Laad highscore
  useEffect(() => {
    const saved = localStorage.getItem("minion_game_highscore");
    if (saved) setHighScore(parseInt(saved));
  }, []);

  useEffect(() => {
    stateRef.current.gameState = gameState;
  }, [gameState]);

  const startGame = () => {
    setScore(0);
    setBananasEarned(0);
    setLives(3);
    setCombo(0);
    setGameState("PLAYING");

    stateRef.current = {
      ...stateRef.current,
      gameState: "PLAYING",
      score: 0,
      bananasEarned: 0,
      lives: 3,
      playerX: 270,
      playerTargetX: 270,
      tilt: 0,
      expression: "normal",
      speedBoost: false,
      speedBoostTime: 0,
      items: [],
      particles: [],
      spawnTimer: 0.5, // Start direct met spawnen na 0.5s
      combo: 0,
      lastScore: 0,
      lastBananasEarned: 0,
      lastLives: 3,
      lastCombo: 0,
      lastTime: performance.now(),
    };
    playDefaultSound("banana", globalVolume);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      stateRef.current.keys[e.code] = true;
    };
    const handleKeyUp = (e) => {
      stateRef.current.keys[e.code] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const updatePlayerPos = (clientX) => {
    if (stateRef.current.gameState !== "PLAYING") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    stateRef.current.playerTargetX = Math.max(0, Math.min(canvas.width - stateRef.current.playerWidth, x - stateRef.current.playerWidth / 2));
  };

  const handleCanvasMouseMove = (e) => updatePlayerPos(e.clientX);
  const handleCanvasTouchMove = (e) => {
    if (e.touches.length > 0) {
      updatePlayerPos(e.touches[0].clientX);
    }
  };

  // Hoofd game loop (Delta-Time gebaseerd!)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const gameLoop = (timestamp) => {
      const state = stateRef.current;
      if (!state.lastTime) state.lastTime = timestamp;
      
      const dt = Math.min((timestamp - state.lastTime) / 1000, 0.1);
      state.lastTime = timestamp;

      // Clearen
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Achtergrond tekenen (Sky gradient & wolken)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, "#bae6fd");
      skyGrad.addColorStop(0.8, "#f0f9ff");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Wolken tekenen
      ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
      state.clouds.forEach((cloud) => {
        cloud.x += cloud.speed * dt;
        if (cloud.x > canvas.width + 80) cloud.x = -80;

        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.size * 0.5, cloud.y - cloud.size * 0.2, cloud.size * 0.8, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.size, cloud.y, cloud.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Gras onderaan
      ctx.fillStyle = "#22c55e"; 
      ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

      if (state.gameState === "PLAYING") {
        // --- 1. SPELER UPDATE ---
        let baseSpeed = state.speedBoost ? 700 : 420;
        let moveDirection = 0;

        if (state.keys["ArrowLeft"] || state.keys["KeyA"]) {
          state.playerTargetX = Math.max(0, state.playerX - baseSpeed * dt);
          moveDirection = -1;
        }
        if (state.keys["ArrowRight"] || state.keys["KeyD"]) {
          state.playerTargetX = Math.min(canvas.width - state.playerWidth, state.playerX + baseSpeed * dt);
          moveDirection = 1;
        }

        const oldX = state.playerX;
        state.playerX += (state.playerTargetX - state.playerX) * (1 - Math.exp(-22 * dt));
        
        const velocityX = (state.playerX - oldX) / dt;
        state.tilt = Math.max(-0.15, Math.min(0.15, velocityX * 0.0003));

        if (state.speedBoost && Date.now() > state.speedBoostTime) {
          state.speedBoost = false;
        }

        if (state.expression !== "normal" && Date.now() > state.expressionTimer) {
          state.expression = "normal";
        }

        // --- 2. TEKEN MINION ---
        const px = state.playerX;
        const py = canvas.height - 20 - state.playerHeight;
        const pw = state.playerWidth;
        const ph = state.playerHeight;

        ctx.save();
        ctx.translate(px + pw / 2, py + ph / 2);
        ctx.rotate(state.tilt);
        ctx.translate(-(px + pw / 2), -(py + ph / 2));

        // Gele body
        ctx.fillStyle = "#facc15";
        ctx.beginPath();
        ctx.arc(px + pw / 2, py + pw / 2, pw / 2, Math.PI, 0, false);
        ctx.rect(px, py + pw / 2, pw, ph - pw / 2);
        ctx.fill();

        // Blauwe overalls
        ctx.fillStyle = "#1e40af";
        ctx.fillRect(px, py + ph - 25, pw, 25);
        ctx.fillRect(px + 10, py + ph - 35, pw - 20, 10);
        ctx.fillStyle = "#172554";
        ctx.fillRect(px + pw / 2 - 6, py + ph - 22, 12, 10);

        // Goggles
        ctx.strokeStyle = "#9ca3af";
        ctx.lineWidth = 5;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(px + pw / 2, py + 22, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Pupil
        let pupilSize = state.expression === "shocked" ? 1.5 : 3.5;
        ctx.fillStyle = "#78350f";
        ctx.beginPath();
        ctx.arc(px + pw / 2, py + 22, pupilSize + 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(px + pw / 2, py + 22, pupilSize, 0, Math.PI * 2);
        ctx.fill();

        // Goggle band
        ctx.fillStyle = "#000000";
        ctx.fillRect(px, py + 18, 5, 8);
        ctx.fillRect(px + pw - 5, py + 18, 5, 8);

        // Mond
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 3;
        ctx.beginPath();
        if (state.expression === "happy") {
          ctx.fillStyle = "#ffffff";
          ctx.arc(px + pw / 2, py + 42, 10, 0, Math.PI, false);
          ctx.fill();
          ctx.stroke();
        } else if (state.expression === "shocked") {
          ctx.arc(px + pw / 2, py + 44, 4, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.arc(px + pw / 2, py + 42, 8, 0, Math.PI, false);
          ctx.stroke();
        }

        ctx.restore();

        // --- 3. TIJD-GEBASEERD SPAWN-SYSTEEM ---
        // Verminder spawn timer met delta-tijd
        state.spawnTimer -= dt;
        if (state.spawnTimer <= 0) {
          const rand = Math.random();
          let type = "banana";
          let emoji = "🍌";
          
          if (rand < 0.16) {
            type = "bomb";
            emoji = "💣";
          } else if (rand < 0.28) {
            type = "gelato";
            emoji = "🍦";
          }

          // Ramping: start langzaam (120-160 px/s) en ga geleidelijk sneller
          const speedMin = 120 + Math.min(200, state.score * 3.5);
          const speedMax = 160 + Math.min(220, state.score * 4.5);

          state.items.push({
            x: Math.random() * (canvas.width - 30) + 15,
            y: -20,
            type,
            emoji,
            speed: Math.random() * (speedMax - speedMin) + speedMin,
            size: 26,
            rot: Math.random() * Math.PI,
            rotSpeed: Math.random() * 2 - 1,
          });

          // Ramping Spawn Interval: start op 1.35 seconde, verlaag naarmate score stijgt
          const nextSpawnDelay = Math.max(0.48, 1.35 - (state.score * 0.018));
          state.spawnTimer = nextSpawnDelay;
        }

        // --- 4. BEWEGING & BOTSNINGEN ---
        for (let i = state.items.length - 1; i >= 0; i--) {
          const item = state.items[i];
          item.y += item.speed * dt;
          item.rot += item.rotSpeed * dt;

          if (item.type === "bomb" && Math.abs(item.x - (px + pw/2)) < 80 && item.y > py - 60 && item.y < py) {
            state.expression = "shocked";
            state.expressionTimer = Date.now() + 400;
          }

          ctx.save();
          ctx.translate(item.x, item.y);
          ctx.rotate(item.rot);
          ctx.font = `${item.size}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(item.emoji, 0, 0);
          ctx.restore();

          // AABB Botsing
          if (
            item.x + 12 > px &&
            item.x - 12 < px + pw &&
            item.y + 12 > py &&
            item.y - 12 < py + ph
          ) {
            if (item.type === "banana") {
              const pts = 1 + Math.floor(state.combo / 5);
              state.score += pts;
              state.combo += 1;
              state.expression = "happy";
              state.expressionTimer = Date.now() + 500;
              playDefaultSound("banana_pickup", globalVolume);

              state.particles.push({
                x: item.x,
                y: item.y,
                text: `+${pts} 🍌`,
                color: "#eab308",
                life: 1.0,
                vy: -80,
              });

              if (state.bananasEarned < MAX_EARN_PER_GAME) {
                const addVal = Math.min(pts, MAX_EARN_PER_GAME - state.bananasEarned);
                state.bananasEarned += addVal;
                addBananas(addVal);
              }
            } else if (item.type === "gelato") {
              state.score += 8;
              state.combo += 2;
              state.expression = "happy";
              state.expressionTimer = Date.now() + 800;
              playDefaultSound("banana_pickup", globalVolume);

              state.speedBoost = true;
              state.speedBoostTime = Date.now() + 6000;

              state.particles.push({
                x: item.x,
                y: item.y,
                text: "+8 GELATO! ⚡",
                color: "#10b981",
                life: 1.2,
                vy: -100,
              });

              if (state.bananasEarned < MAX_EARN_PER_GAME) {
                const addVal = Math.min(8, MAX_EARN_PER_GAME - state.bananasEarned);
                state.bananasEarned += addVal;
                addBananas(addVal);
              }
            } else if (item.type === "bomb") {
              state.lives -= 1;
              state.combo = 0;
              playDefaultSound("fart", globalVolume);

              canvas.style.transform = `translate(${(Math.random() - 0.5) * 15}px, ${(Math.random() - 0.5) * 15}px)`;
              canvas.style.filter = "invert(0.1) saturate(2)";
              setTimeout(() => {
                canvas.style.transform = "none";
                canvas.style.filter = "none";
              }, 150);

              state.particles.push({
                x: item.x,
                y: item.y,
                text: "KABOOM! 💔",
                color: "#ef4444",
                life: 1.5,
                vy: -40,
              });

              if (state.lives <= 0) {
                state.gameState = "GAMEOVER";
                setGameState("GAMEOVER");
                playDefaultSound("fart", globalVolume);
                
                if (state.score > highScore) {
                  localStorage.setItem("minion_game_highscore", state.score.toString());
                  setHighScore(state.score);
                }
              }
            }

            state.items.splice(i, 1);
            continue;
          }

          if (item.y > canvas.height + 20) {
            if (item.type === "banana") {
              state.combo = 0;
            }
            state.items.splice(i, 1);
          }
        }

        // --- 5. DEELTJES EFFECTEN ---
        for (let p = state.particles.length - 1; p >= 0; p--) {
          const part = state.particles[p];
          part.y += part.vy * dt;
          part.life -= dt;

          ctx.fillStyle = part.color;
          ctx.font = "black 14px Arial";
          ctx.globalAlpha = Math.max(0, part.life);
          ctx.fillText(part.text, part.x, part.y);
          ctx.globalAlpha = 1.0;

          if (part.life <= 0) state.particles.splice(p, 1);
        }

        // --- 6. COMBO METER ---
        if (state.combo > 2) {
          ctx.fillStyle = "#db2777";
          ctx.font = "black 18px Arial";
          ctx.textAlign = "center";
          ctx.fillText(`COMBO x${state.combo}! 🔥`, canvas.width / 2, 35);
        }

        // Sync react state
        if (state.lastScore !== state.score) {
          setScore(state.score);
          state.lastScore = state.score;
        }
        if (state.lastBananasEarned !== state.bananasEarned) {
          setBananasEarned(state.bananasEarned);
          state.lastBananasEarned = state.bananasEarned;
        }
        if (state.lastLives !== state.lives) {
          setLives(state.lives);
          state.lastLives = state.lives;
        }
        if (state.lastCombo !== state.combo) {
          setCombo(state.combo);
          state.lastCombo = state.combo;
        }
      } else if (state.gameState === "START") {
        // Start Screen
        ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ffffff";
        ctx.font = "black 36px Arial";
        ctx.textAlign = "center";
        ctx.fillText("BANANEN VANGER PRO 🍌🎮", canvas.width / 2, canvas.height / 2 - 40);

        ctx.font = "14px Arial";
        ctx.fillStyle = "#cbd5e1";
        ctx.fillText("Beweeg de Minion via A/D, Pijltjestoetsen of sleep met je Muis/Touch!", canvas.width / 2, canvas.height / 2);
        ctx.fillText("Vang 🍌 (+1) en 🍦 (+8 Gelato Speed Boost!). Ontwijk 💣 bommen!", canvas.width / 2, canvas.height / 2 + 25);
        ctx.fillText("De snelheid loopt langzaam op naarmate je meer bananen vangt!", canvas.width / 2, canvas.height / 2 + 50);

        ctx.font = "bold 16px Arial";
        ctx.fillStyle = "#facc15";
        ctx.fillText("Klik op de knop hieronder en ga voor de Highscore!", canvas.width / 2, canvas.height / 2 + 100);
      } else if (state.gameState === "GAMEOVER") {
        // Game Over Screen
        ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ef4444";
        ctx.font = "black 42px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 50);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 22px Arial";
        ctx.fillText(`Eindscore: ${state.score} 🏆`, canvas.width / 2, canvas.height / 2);
        ctx.fillText(`Totaal verdiend: +${state.bananasEarned} 🍌`, canvas.width / 2, canvas.height / 2 + 30);
        
        ctx.font = "16px Arial";
        ctx.fillStyle = "#facc15";
        ctx.fillText(state.score > highScore ? "NIEUWE RECORD HIGHSCORE! 🎉" : `Persoonlijk Record: ${highScore}`, canvas.width / 2, canvas.height / 2 + 70);
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop(performance.now());

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState, highScore]);

  return (
    <div 
      className="flex flex-col items-center p-6 bg-white border border-gray-200 rounded-3xl shadow-xl min-h-[500px]"
      style={{ willChange: "transform", transform: "translate3d(0, 0, 0)" }}
    >
      <div className="text-center w-full mb-4">
        <div className="inline-block bg-green-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          Experiment #004: Arcade Game
        </div>
        <h2 className="text-3xl font-black text-gray-800 mb-1">
          BANANEN VANGER PRO
        </h2>
        <p className="text-gray-500 text-sm">
          De snelheid en spawn-rate lopen langzaam op met je score!
        </p>
      </div>

      {/* Spel Statistieken */}
      <div className="w-full max-w-[600px] flex justify-between items-center bg-blue-900 text-white px-5 py-3 rounded-t-2xl font-black text-sm border-b-4 border-blue-950 shadow-md">
        <div className="flex flex-col">
          <span className="text-[10px] opacity-70">SCORE</span>
          <span className="text-yellow-400 font-mono text-xl">{score}</span>
        </div>

        {combo > 2 && (
          <div className="animate-bounce bg-pink-600 px-3 py-1 rounded-lg text-xs font-black">
            COMBO x{combo} 🔥
          </div>
        )}

        <div className="flex flex-col text-center">
          <span className="text-[10px] opacity-70">SALDO VERDIEND</span>
          <span className="text-yellow-300 font-mono text-sm">
            +{bananasEarned} / {MAX_EARN_PER_GAME} 🍌
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] opacity-70">LEVENS</span>
          <span className="text-red-500 text-base">
            {"❤️".repeat(Math.max(0, lives)) || "💀"}
          </span>
        </div>
      </div>

      {/* Het Game Canvas */}
      <div className="relative border-x-4 border-b-4 border-blue-900 bg-sky-100 overflow-hidden shadow-2xl w-full max-w-[600px] rounded-b-2xl">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          onMouseMove={handleCanvasMouseMove}
          onTouchMove={handleCanvasTouchMove}
          className="w-full block cursor-none"
        />
        
        {stateRef.current.speedBoost && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-blue-900 font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-widest animate-pulse border-2 border-yellow-600 shadow-md">
            ⚡ GELATO SPEED ACTIVE! 🍦
          </div>
        )}
      </div>

      {/* Knoppen onderaan */}
      <div className="mt-5 w-full max-w-[600px]">
        {gameState !== "PLAYING" ? (
          <button
            onClick={startGame}
            className="w-full py-4 bg-green-500 text-white font-black text-lg rounded-2xl shadow-[0_6px_0_rgb(22,101,52)] active:shadow-none active:translate-y-1 transition-all hover:bg-green-400 flex items-center justify-center gap-2"
          >
            <span>🎮</span>
            <span>{gameState === "START" ? "SPEEL BANANEN VANGER" : "START NIEUW SPEL"}</span>
          </button>
        ) : (
          <div className="text-center text-xs text-gray-400 font-bold italic">
            Tip: Bestuur Bob met je vinger of muis op het spelbord voor maximale controle!
          </div>
        )}
      </div>
    </div>
  );
}
