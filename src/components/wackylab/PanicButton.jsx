import React, { useState, useEffect, useRef } from "react";

export default function PanicButton() {
  const [isPanic, setIsPanic] = useState(false);
  const [scurryingMinions, setScurryingMinions] = useState([]);
  const audioCtxRef = useRef(null);
  const sirenIntervalRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);

  // Effect om body class te toggelen
  useEffect(() => {
    if (isPanic) {
      document.body.classList.add("panic-active");
      startSiren();
      spawnMinions();
    } else {
      document.body.classList.remove("panic-active");
      stopSiren();
      setScurryingMinions([]);
    }

    return () => {
      document.body.classList.remove("panic-active");
      stopSiren();
    };
  }, [isPanic]);

  const startSiren = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);

      osc.start();
      oscillatorRef.current = osc;
      gainNodeRef.current = gain;

      // Pitch sweep interval (sirene effect)
      let high = true;
      sirenIntervalRef.current = setInterval(() => {
        if (ctx.state === "suspended") ctx.resume();
        const time = ctx.currentTime;
        // Glijdende pitch van 500Hz naar 900Hz en terug
        osc.frequency.exponentialRampToValueAtTime(high ? 900 : 500, time + 0.45);
        high = !high;
      }, 500);

    } catch (e) {
      console.error("Sirene audio fout:", e);
    }
  };

  const stopSiren = () => {
    if (sirenIntervalRef.current) {
      clearInterval(sirenIntervalRef.current);
      sirenIntervalRef.current = null;
    }
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch (e) {}
      oscillatorRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
  };

  const spawnMinions = () => {
    // Genereer willekeurige minions die over het scherm rennen
    const list = [];
    const minionEmojis = ["🏃‍♂️🍌", "🥽", "🏃‍♂️", "💨", "🚨", "🍌"];
    for (let i = 0; i < 15; i++) {
      list.push({
        id: i,
        emoji: minionEmojis[i % minionEmojis.length],
        top: `${Math.random() * 80 + 10}%`,
        delay: `${Math.random() * 3}s`,
        duration: `${Math.random() * 2 + 1.5}s`,
        size: `${Math.random() * 2 + 1.5}rem`,
      });
    }
    setScurryingMinions(list);
  };

  const handlePanicClick = () => {
    setIsPanic(!isPanic);
  };

  return (
    <div 
      className="flex flex-col items-center justify-center p-6 bg-white/90 border border-gray-200 rounded-3xl shadow-xl min-h-[400px] text-center relative overflow-hidden"
      style={{ willChange: "transform", transform: "translate3d(0, 0, 0)" }}
    >
      <div className="absolute top-4 left-4 bg-red-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
        Experiment #001: Panic Mode
      </div>

      <div className="max-w-md z-10">
        <h2 className="text-3xl font-black text-gray-800 mb-2">
          {isPanic ? "ALARM STAND BEEDO!" : "DE RODE KNOP"}
        </h2>
        <p className="text-gray-600 text-sm mb-8">
          {isPanic 
            ? "DRUK SNEL OP DE KALA-KNOP OM DE CHAOS TE STOPPEN!" 
            : "Niet op drukken. Absoluut niet. Gru heeft gezegd dat dit de bananensirene activeert."}
        </p>
      </div>

      {/* 3D Gevaarlijke Knop */}
      <div className="relative flex items-center justify-center w-64 h-64 z-10">
        {/* Waarschuwingsrand met strepen */}
        <div className="absolute inset-0 rounded-full border-8 border-dashed border-yellow-500 animate-spin" style={{ animationDuration: "12s" }}></div>
        
        <button
          onClick={handlePanicClick}
          className={`w-44 h-44 rounded-full font-black text-2xl transition-all duration-300 transform select-none outline-none
            ${
              isPanic
                ? "bg-gradient-to-tr from-green-600 to-green-400 text-white shadow-[0_4px_0_rgb(22,101,52)] translate-y-2 scale-95 hover:from-green-500 hover:to-green-300"
                : "bg-gradient-to-tr from-red-700 to-red-500 text-white shadow-[0_12px_0_rgb(153,27,27)] active:shadow-[0_4px_0_rgb(153,27,27)] active:translate-y-2 hover:scale-105 active:scale-95 animate-pulse"
            }
          `}
        >
          {isPanic ? "KALM!" : "BEEDO!"}
        </button>
      </div>

      {isPanic && (
        <div className="mt-8 text-red-600 font-black text-xl animate-bounce z-10 bg-red-100/80 px-4 py-2 rounded-full border-2 border-red-500">
          🚨 BANANEN ALARM GEACTIVEERD! 🚨
        </div>
      )}

      {/* Rennende minions overlay */}
      {isPanic &&
        scurryingMinions.map((m) => (
          <div
            key={m.id}
            className="absolute pointer-events-none animate-scurry text-center z-50 select-none whitespace-nowrap"
            style={{
              top: m.top,
              animationDelay: m.delay,
              animationDuration: m.duration,
              fontSize: m.size,
            }}
          >
            {m.emoji}
          </div>
        ))}
    </div>
  );
}
