import React, { useState, useEffect } from "react";
import { translateSimple } from "../utils/localLogic";

// --- SUB-COMPONENT: AUDIO WAVEFORM (Visueel effect) ---
function AudioVisualizer({ isActive }) {
  return (
    <div className="flex items-end justify-center gap-1 h-12 w-full overflow-hidden">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className={`w-2 bg-yellow-400 rounded-t-md transition-all duration-100 ease-in-out ${
            isActive ? "animate-pulse" : "h-2 opacity-30"
          }`}
          style={{
            height: isActive ? `${Math.random() * 100}%` : "10%",
            animationDelay: `${i * 0.05}s`,
            animationDuration: "0.4s", // Snelle update voor 'praten' effect
          }}
        ></div>
      ))}
    </div>
  );
}

// --- SUB-COMPONENT: TERMINAL HEADER ---
function TerminalHeader({ title, icon, status }) {
  return (
    <div className="bg-gray-800 p-3 rounded-t-xl flex items-center justify-between border-b-2 border-gray-600">
      <div className="flex items-center gap-2 text-gray-300 font-mono text-sm font-bold">
        <span>{icon}</span>
        <span className="uppercase tracking-widest">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            status === "active" ? "bg-green-400 animate-pulse" : "bg-red-500"
          }`}
        ></span>
      </div>
    </div>
  );
}

export default function Translator({ useApi, onTranslate }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [consoleLog, setConsoleLog] = useState("> Systeem gereed..."); // Voor nep-terminal effect
  const [fartTranslation, setFartTranslation] = useState(false);


  const playSingleFart = (ctx, time, pitch, duration, wetness) => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      const shaper = ctx.createWaveShaper();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(pitch, time);
      osc.frequency.linearRampToValueAtTime(pitch * 0.7, time + duration);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, time);
      filter.frequency.exponentialRampToValueAtTime(100, time + duration);

      const k = wetness * 3;
      const n_samples = 44100;
      const curve = new Float32Array(n_samples);
      const deg = Math.PI / 180;
      for (let i = 0; i < n_samples; ++i) {
        const x = (i * 2) / n_samples - 1;
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
      }
      shaper.curve = curve;
      shaper.oversample = "4x";

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.35, time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

      osc.connect(shaper);
      shaper.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + duration);
    } catch (e) {}
  };

  const playFartSequence = (text) => {
    const words = text.trim().split(/\s+/);
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    let time = ctx.currentTime;

    words.forEach((word) => {
      const codeSum = word.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const pitch = 50 + (codeSum % 100);
      const duration = 0.15 + ((word.length % 5) * 0.08);
      const wetness = 30 + (codeSum % 70);

      playSingleFart(ctx, time, pitch, duration, wetness);
      time += duration + 0.08;
    });
  };

  // --- Functie om resultaat te tonen ---
  const handleSuccess = (text) => {
    setOutput(text);
    setLoading(false);
    setIsSpeaking(true);
    setConsoleLog("> Vertaling voltooid.\n> Audio output gestart...");

    if (fartTranslation) {
      playFartSequence(text);
    }

    // Stop animatie na 2.5s (langer voor farts)
    setTimeout(() => {
      setIsSpeaking(false);
      setConsoleLog("> Wachten op input...");
    }, fartTranslation ? 3500 : 1500);

    if (onTranslate) onTranslate();
  };


  function handleSimpleTranslation() {
    if (!input.trim()) {
      setConsoleLog("> FOUT: Typ eerst iets!");
      return;
    }
    setLoading(true);
    setIsSpeaking(false);
    setConsoleLog("> Lokaal woordenboek laden...");

    const simpleText = translateSimple(input);
    setTimeout(() => {
      handleSuccess(simpleText);
    }, 600);
  }

  return (
    <div className="page max-w-6xl mx-auto px-4 py-8">
      {/* --- HEADER --- */}
      <div className="text-center mb-10">
        <span className="bg-blue-900 text-yellow-400 px-4 py-1 rounded-full font-mono text-xs font-bold tracking-[0.2em] border border-yellow-600 uppercase">
          Banana Corp. Communication Link
        </span>
        <h1
          className="text-4xl md:text-6xl font-black text-blue-900 mt-4 uppercase tracking-tighter"
          style={{ textShadow: "3px 3px 0px rgba(0,0,0,0.1)" }}
        >
          Vertaal <span className="text-yellow-500">Terminal</span>
        </h1>
      </div>

      {/* --- MAIN CONSOLE --- */}
      <div className="bg-blue-900 p-2 md:p-4 rounded-3xl shadow-2xl border-b-[12px] border-blue-950">
        {/* Binnenste rand/behuizing */}
        <div className="bg-gray-900 rounded-2xl p-6 md:p-8 border-4 border-gray-700 relative overflow-hidden">
          {/* Achtergrond Raster Effect */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* --- LINKER PANEEL: INPUT --- */}
            <div className="flex flex-col h-full">
              <TerminalHeader
                title="INPUT SOURCE: HUMAN"
                icon="👤"
                status="active"
              />
              <div className="bg-black/80 backdrop-blur-sm border-x-2 border-b-2 border-gray-600 rounded-b-xl p-4 flex-grow shadow-inner relative group flex flex-col justify-between">
                <textarea
                  id="text-input"
                  className="w-full h-40 lg:h-56 bg-transparent border-none outline-none text-blue-200 font-mono text-lg resize-none placeholder-blue-800/50"
                  placeholder="Typ hier je bericht..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  spellCheck="false"
                />
                <div className="flex justify-between items-center border-t border-gray-800 pt-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-400 select-none">
                    <input
                      type="checkbox"
                      id="fart-trans-check"
                      checked={fartTranslation}
                      onChange={(e) => setFartTranslation(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="fart-trans-check" className="cursor-pointer">
                      Vertaal in scheetgeluiden 💨 (Tekst-naar-Scheet)
                    </label>
                  </div>
                  {/* Karakter teller */}
                  <div className="text-xs font-mono text-blue-500">
                    LENGTH: {input.length}
                  </div>
                </div>
              </div>
            </div>

            {/* --- MIDDEN: CONTROLS (Desktop: Tussenin, Mobiel: Tussenin) --- */}
            <div className="lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 z-20 flex flex-row lg:flex-col gap-4 justify-center items-center my-4 lg:my-0">
              {/* Knop 1: Simpel */}
              <button
                onClick={handleSimpleTranslation}
                disabled={loading}
                className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-gray-200 border-4 border-gray-400 shadow-lg flex items-center justify-center hover:scale-110 hover:bg-white transition-all active:scale-95 group"
                title="Simpele Vertaling"
              >
                <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">
                  📖
                </span>
              </button>

              {/* Pijl (Draait op desktop) */}
              <div className="text-yellow-500 text-2xl animate-pulse lg:rotate-90">
                ➤
              </div>

              {/* Knop 2: Bananen Vertaling (Groot) */}
              <button
                onClick={handleSimpleTranslation}
                disabled={loading}
                className={`w-20 h-20 lg:w-24 lg:h-24 rounded-full border-4 shadow-[0_0_30px_rgba(234,179,8,0.4)] flex items-center justify-center transition-all active:scale-95 relative overflow-hidden
                            ${
                              loading
                                ? "bg-yellow-600 border-yellow-700 animate-pulse cursor-wait"
                                : "bg-yellow-400 border-yellow-500 hover:bg-yellow-300 hover:scale-110 hover:shadow-[0_0_50px_rgba(234,179,8,0.8)]"
                            }`}
              >
                {loading ? (
                  <span className="animate-spin text-3xl">⚙️</span>
                ) : (
                  <span className="text-4xl relative z-10">🍌</span>
                )}
                {/* Glans effect */}
                {!loading && (
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 rounded-t-full pointer-events-none"></div>
                )}
              </button>
            </div>

            {/* --- RECHTER PANEEL: OUTPUT --- */}
            <div className="flex flex-col h-full">
              <TerminalHeader
                title="TARGET: BOT-SPEAK"
                icon="🤖"
                status={isSpeaking ? "active" : "idle"}
              />
              <div className="bg-black/80 backdrop-blur-sm border-x-2 border-b-2 border-gray-600 rounded-b-xl p-4 flex-grow shadow-inner relative flex flex-col">
                {/* Output Tekst (Typewriter font) */}
                <textarea
                  id="text-output"
                  className={`w-full flex-grow bg-transparent border-none outline-none font-mono text-xl lg:text-2xl font-bold leading-relaxed resize-none
                                ${
                                  isSpeaking
                                    ? "text-yellow-300 drop-shadow-[0_0_5px_rgba(253,224,71,0.5)]"
                                    : "text-yellow-600"
                                }`}
                  placeholder="// Waiting for data..."
                  value={output}
                  readOnly
                />

                {/* Visualizer Balk (Onderaan) */}
                <div className="mt-auto border-t border-gray-700 pt-4">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-mono text-gray-500 uppercase">
                      Audio Stream
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase ${
                        isSpeaking
                          ? "text-green-500 animate-pulse"
                          : "text-gray-600"
                      }`}
                    >
                      {isSpeaking ? "TRANSMITTING" : "OFFLINE"}
                    </span>
                  </div>
                  <AudioVisualizer isActive={isSpeaking} />
                </div>
              </div>
            </div>
          </div>

          {/* --- FOOTER STATUS BAR --- */}
          <div className="mt-8 bg-black rounded-lg p-3 border border-gray-700 font-mono text-xs text-green-500 shadow-inner h-24 overflow-y-auto custom-scrollbar opacity-80">
            <span className="block opacity-50 mb-1">// SYSTEM LOGS:</span>
            <pre className="whitespace-pre-wrap font-mono leading-tight">
              {consoleLog}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
