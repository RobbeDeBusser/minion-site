import React, { useState } from "react";

export default function FartOMatic() {
  const [pitch, setPitch] = useState(85); // Hz
  const [duration, setDuration] = useState(0.8); // seconds
  const [wetness, setWetness] = useState(50); // percentage (distortion/buzz)
  const [squeak, setSqueak] = useState(30); // percentage (squeak at the end)

  const presets = [
    { name: "Classic Banana 🍌", pitch: 85, duration: 0.7, wetness: 50, squeak: 35 },
    { name: "Wet Explosion 💦", pitch: 60, duration: 1.2, wetness: 90, squeak: 10 },
    { name: "Stuart's Whisper 🤫", pitch: 120, duration: 0.3, wetness: 20, squeak: 80 },
    { name: "Bananapocalypse 🌋", pitch: 45, duration: 2.0, wetness: 100, squeak: 60 },
  ];

  const applyPreset = (p) => {
    setPitch(p.pitch);
    setDuration(p.duration);
    setWetness(p.wetness);
    setSqueak(p.squeak);
  };

  // Helper om distortion curve te genereren voor de WaveShaper
  const makeDistortionCurve = (amount) => {
    const k = typeof amount === "number" ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  };

  const playFart = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();
      const time = ctx.currentTime;

      // 1. Hoofd Oscillator (scheet base)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      const shaper = ctx.createWaveShaper();

      osc.type = "sawtooth";
      // Licht glijdende toonhoogte omlaag
      osc.frequency.setValueAtTime(pitch, time);
      osc.frequency.linearRampToValueAtTime(pitch * 0.7, time + duration);

      // Lowpass filter sweep om de hardheid te temperen aan het eind
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(400, time);
      filter.frequency.exponentialRampToValueAtTime(100, time + duration);

      // Shaper voor wetness (distortion)
      shaper.curve = makeDistortionCurve(wetness * 3);
      shaper.oversample = "4x";

      // Gain Envelope (volume verloop)
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.5, time + 0.05); // snelle attack
      gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

      // Verbinden
      osc.connect(shaper);
      shaper.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + duration);

      // 2. Tweede Oscillator (hoge minion squeak aan het einde)
      if (squeak > 0) {
        const squeakOsc = ctx.createOscillator();
        const squeakGain = ctx.createGain();
        
        squeakOsc.type = "triangle";
        
        const squeakStart = time + duration * 0.75;
        const squeakLen = duration * 0.35;
        
        squeakOsc.frequency.setValueAtTime(400 + squeak * 8, squeakStart);
        squeakOsc.frequency.exponentialRampToValueAtTime(
          800 + squeak * 15,
          squeakStart + squeakLen
        );

        squeakGain.gain.setValueAtTime(0, squeakStart);
        squeakGain.gain.linearRampToValueAtTime(0.15 * (squeak / 100), squeakStart + 0.02);
        squeakGain.gain.exponentialRampToValueAtTime(0.01, squeakStart + squeakLen);

        squeakOsc.connect(squeakGain);
        squeakGain.connect(ctx.destination);

        squeakOsc.start(squeakStart);
        squeakOsc.stop(squeakStart + squeakLen);
      }

    } catch (e) {
      console.error("Synthesizer fout:", e);
    }
  };

  return (
    <div 
      className="flex flex-col md:flex-row gap-8 p-6 bg-white/90 border border-gray-200 rounded-3xl shadow-xl min-h-[400px]"
      style={{ willChange: "transform", transform: "translate3d(0, 0, 0)" }}
    >
      <div className="flex-grow flex flex-col justify-between">
        <div>
          <div className="inline-block bg-purple-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            Experiment #002: Fart-O-Matic
          </div>
          <h2 className="text-3xl font-black text-gray-800 mb-2">
            FART-O-MATIC
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Synthetiseer de ultieme Minion scheet. Versleep de schuiven om de toon,
            lengte en nattigheid live te veranderen!
          </p>
        </div>

        {/* Sliders */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
              <span>Basistoon (Pitch):</span>
              <span className="font-mono text-purple-600">{pitch} Hz</span>
            </div>
            <input
              type="range"
              min="40"
              max="250"
              value={pitch}
              onChange={(e) => setPitch(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
              <span>Duur (Duration):</span>
              <span className="font-mono text-purple-600">{duration} s</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.1"
              value={duration}
              onChange={(e) => setDuration(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
              <span>Nattigheid (Wetness):</span>
              <span className="font-mono text-purple-600">{wetness}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={wetness}
              onChange={(e) => setWetness(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
              <span>Minion Squeak Tail:</span>
              <span className="font-mono text-purple-600">{squeak}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={squeak}
              onChange={(e) => setSqueak(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>
        </div>

        {/* Grote Knop */}
        <button
          onClick={playFart}
          className="mt-6 w-full py-4 bg-purple-600 text-white font-black text-xl rounded-2xl shadow-[0_6px_0_rgb(109,40,217)] active:shadow-none active:translate-y-1 transition-all hover:bg-purple-500 flex items-center justify-center gap-2"
        >
          <span>💨</span>
          <span>PFFFFT!</span>
        </button>
      </div>

      {/* Presets Column */}
      <div className="w-full md:w-64 bg-white/60 rounded-2xl p-4 border border-white/40 flex flex-col justify-between">
        <div>
          <h3 className="font-black text-gray-700 text-sm uppercase tracking-wider mb-3">
            Snel-presets
          </h3>
          <div className="space-y-2">
            {presets.map((p) => (
              <button
                key={p.name}
                onClick={() => applyPreset(p)}
                className="w-full text-left px-3 py-2 text-sm font-bold text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition border border-transparent hover:border-purple-100 flex items-center justify-between"
              >
                <span>{p.name}</span>
                <span className="text-xs text-gray-400 font-mono">
                  {p.pitch}Hz/{p.duration}s
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400 font-medium italic">
          "Pipo, la fart is een kunstvorm." <br />- Stuart
        </div>
      </div>
    </div>
  );
}
