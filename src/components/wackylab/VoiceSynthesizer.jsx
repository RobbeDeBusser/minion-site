import React, { useState, useEffect } from "react";

const MINION_WORDS = [
  "bello", "banana", "papoy", "gelato", "beedo", "muak", "para tu",
  "pooka", "tulaliloo", "underpants", "choka", "kampai", "bottom",
  "bi-do", "poopaye", "tank yu", "luka", "lala", "sprout", "tata"
];

export default function VoiceSynthesizer() {
  const [text, setText] = useState("Hallo, ik ben een Minion en ik hou ontzettend veel van bananen!");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [babbleMode, setBabbleMode] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [pitch, setPitch] = useState(1.9); // Default high pitch
  const [rate, setRate] = useState(1.4);   // Default fast rate

  // Laad beschikbare stemmen
  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const list = window.speechSynthesis.getVoices();
        setVoices(list);
        
        // Kies bij voorkeur een Nederlandse stem voor verstaanbaarheid in het NL, of anders Engels
        const defaultVoice =
          list.find((v) => v.lang.startsWith("nl")) ||
          list.find((v) => v.lang.startsWith("en")) ||
          list[0];
        
        if (defaultVoice) {
          setSelectedVoice(defaultVoice.name);
        }
      }
    };

    loadVoices();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Vertaal gewone tekst naar Bananese willekeurige gebrabbel
  const babbleTranslate = (input) => {
    const words = input.trim().split(/\s+/);
    if (words.length === 0 || words[0] === "") return "Banana!";

    const translated = words.map((w) => {
      const lastChar = w[w.length - 1];
      const hasPunctuation = [".", ",", "!", "?"].includes(lastChar);
      const cleanWord = hasPunctuation ? w.slice(0, -1) : w;

      const wordHash = cleanWord.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      let minionWord = MINION_WORDS[wordHash % MINION_WORDS.length];

      if (w[0] === w[0].toUpperCase()) {
        minionWord = minionWord.charAt(0).toUpperCase() + minionWord.slice(1);
      }

      return minionWord + (hasPunctuation ? lastChar : "");
    });

    return translated.join(" ");
  };

  const speakText = () => {
    if (!window.speechSynthesis) {
      alert("Spraaksynthese wordt helaas niet ondersteund door jouw browser.");
      return;
    }

    // Stop eventueel lopende spraak
    window.speechSynthesis.cancel();

    // Vertaal indien babbleMode aan staat
    const finalSpeechText = babbleMode ? babbleTranslate(text) : text;

    const utterance = new SpeechSynthesisUtterance(finalSpeechText);
    
    // Stem selectie
    if (selectedVoice) {
      const voiceObj = voices.find((v) => v.name === selectedVoice);
      if (voiceObj) utterance.voice = voiceObj;
    }

    // Gekoppeld aan de sliders voor de perfecte pitch en rate tuning!
    utterance.pitch = pitch;
    utterance.rate = rate;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);

    // Fallback voor browsers die onend niet betrouwbaar afvuren
    const estimatedDuration = (finalSpeechText.length / (10 * rate)) * 1000 + 600;
    const timer = setTimeout(() => {
      setIsSpeaking(false);
    }, estimatedDuration);

    return () => clearTimeout(timer);
  };

  return (
    <div 
      className="flex flex-col lg:flex-row gap-8 p-6 bg-white/90 border border-gray-200 rounded-3xl shadow-xl min-h-[480px]"
      style={{ willChange: "transform", transform: "translate3d(0, 0, 0)" }}
    >
      
      {/* Linker Column: Instellingen & Form */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="inline-block bg-blue-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            Experiment #005: Voice Synth
          </div>
          <h2 className="text-3xl font-black text-gray-800 mb-2">
            MINION TALKER
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Typ een zin, zet de stem op 'Minion Mode' en laat Bob het brabbelen met zijn
            schattige, snelle stemmetje!
          </p>

          <div className="space-y-4">
            {/* Input veld */}
            <div>
              <label className="block text-sm font-black text-gray-700 mb-1.5">
                Wat moet Bob zeggen?
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-4 bg-white border-2 border-blue-200 rounded-2xl shadow-inner focus:border-blue-400 focus:outline-none text-gray-800 font-medium"
                rows="2"
                placeholder="Schrijf hier iets grappigs..."
              />
            </div>

            {/* Babble Mode Toggle */}
            <div className="flex items-center gap-3 bg-blue-50/80 border border-blue-100 rounded-2xl p-4">
              <input
                type="checkbox"
                id="babbleMode"
                checked={babbleMode}
                onChange={(e) => setBabbleMode(e.target.checked)}
                className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="babbleMode" className="text-sm font-black text-blue-900 cursor-pointer select-none">
                Vertaal automatisch naar Bananese brabbeltaal (Aangeraden! 🍌)
              </label>
            </div>

            {/* Tuning Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                  <span>Toonhoogte (Pitch):</span>
                  <span className="font-mono text-blue-600">{pitch}x</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="2.0"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                  <span>Snelheid (Rate):</span>
                  <span className="font-mono text-blue-600">{rate}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="2.0"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>

            {/* Stem selectie */}
            {voices.length > 0 && (
              <div>
                <label className="block text-sm font-black text-gray-700 mb-1.5">
                  Kies Voorlees-stem (Browser TTS):
                </label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full p-3 bg-white border-2 border-blue-100 rounded-xl focus:border-blue-300 focus:outline-none text-gray-700 text-sm font-bold"
                >
                  {voices.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={speakText}
          className="mt-6 w-full py-4 bg-blue-600 text-white font-black text-xl rounded-2xl shadow-[0_6px_0_rgb(29,78,216)] active:shadow-none active:translate-y-1 transition-all hover:bg-blue-500 flex items-center justify-center gap-2"
        >
          <span>🗣️</span>
          <span>SPREEK HET UIT!</span>
        </button>
      </div>

      {/* Rechter Column: Visuele Pratende Minion (Met dynamisch bewegende vector mond & ogen!) */}
      <div className="w-full md:w-72 bg-gradient-to-br from-blue-900 to-blue-950 rounded-3xl p-6 border border-blue-950 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(250,204,21,0.08)_0%,_transparent_130%)] pointer-events-none"></div>

        {/* Minion Body (Bob met 3D-shading en live mondchatter!) */}
        <div className="w-48 h-64 bg-yellow-400 rounded-t-[5rem] rounded-b-[2.5rem] border-4 border-yellow-500 relative flex flex-col items-center shadow-xl overflow-hidden">
          {/* 3D cilinderschaduw over lichaam */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/30 pointer-events-none z-20"></div>

          {/* Sprietjes haar */}
          <div className="absolute top-1 flex justify-center w-full z-10">
            <svg width="30" height="15" viewBox="0 0 30 15" fill="none" stroke="#18181b" strokeWidth="1.8" strokeLinecap="round">
              <path d="M15,15 Q15,4 19,4" />
              <path d="M15,15 Q11,5 8,5" />
              <path d="M15,15 Q15,2 25,6" />
            </svg>
          </div>

          {/* Goggle Band */}
          <div className="absolute top-16 inset-x-0 h-6 bg-zinc-900 z-0"></div>

          {/* Goggles (3D zilveren randen en glare) */}
          <div className="absolute top-10 flex gap-0.5 z-10">
            {/* Oog L */}
            <div className="w-18 h-18 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-500 border-4 border-zinc-600 flex items-center justify-center relative shadow-md">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20 pointer-events-none z-10"></div>
                {/* Pupil */}
                <div className={`w-5 h-5 rounded-full bg-amber-700 flex items-center justify-center absolute transition-all duration-100
                  ${isSpeaking ? "scale-90" : "scale-100"}
                `} style={{ top: "35%" }}>
                  <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
                </div>
              </div>
            </div>

            {/* Oog R */}
            <div className="w-18 h-18 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-500 border-4 border-zinc-600 flex items-center justify-center relative shadow-md">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20 pointer-events-none z-10"></div>
                {/* Pupil */}
                <div className={`w-5 h-5 rounded-full bg-green-700 flex items-center justify-center absolute transition-all duration-100
                  ${isSpeaking ? "scale-90" : "scale-100"}
                `} style={{ top: "35%" }}>
                  <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Vector Mond die live meebeweegt en opent/sluit bij spraak! */}
          <div 
            className="absolute flex justify-center items-center h-12 w-full z-10"
            style={{ top: "145px" }}
          >
            {isSpeaking ? (
              <div className="w-14 h-12 bg-zinc-950 border-4 border-yellow-600 rounded-[2rem] flex flex-col justify-between items-center py-1.5 overflow-hidden animate-mouth-speak relative">
                {/* Teeth (boven) */}
                <div className="w-10 h-2.5 bg-white rounded-b-md"></div>
                {/* Tongue (onder) */}
                <div className="w-8 h-3.5 bg-red-500 rounded-t-full mt-auto"></div>
              </div>
            ) : (
              /* Smiling closed mouth */
              <svg width="40" height="20" viewBox="0 0 40 20" fill="none" stroke="#18181b" strokeWidth="3" strokeLinecap="round">
                <path d="M5,5 Q20,15 35,5" />
              </svg>
            )}
          </div>

          {/* Tuinbroek (hugs capsule body) */}
          <div className="absolute bottom-0 inset-x-0 h-12 bg-blue-800 border-t-4 border-blue-900 z-10 flex flex-col justify-end">
            <div className="w-16 h-10 bg-blue-800 border-x-4 border-t-4 border-blue-900 mx-auto rounded-t-xl flex justify-center items-center">
              {/* Logo pocket */}
              <div className="w-6 h-5 bg-blue-950 rounded-b-md border border-blue-900"></div>
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="mt-4 text-center">
          <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider
            ${isSpeaking ? "bg-green-500 text-white animate-pulse shadow-md" : "bg-white/10 text-blue-300"}
          `}>
            {isSpeaking ? "Aan het praten... 🍌" : "Standby 😴"}
          </span>
        </div>
      </div>

    </div>
  );
}
