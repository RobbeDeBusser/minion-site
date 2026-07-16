import React, { useState } from "react";
import { renderMinionSvg, downloadMinionSvg } from "../utils/avatar";
import { playDefaultSound } from "../services/audio";

const CATEGORIES = {
  skin: {
    label: "Huidskleur / Type",
    options: [
      { id: "yellow", label: "Normaal 💛" },
      { id: "purple", label: "Mutant 💜" },
      { id: "gold", label: "Midas Goud 💛✨" }
    ]
  },
  eyes: {
    label: "Ogen aantal",
    options: [
      { id: 1, label: "1 Oog 👁️" },
      { id: 2, label: "2 Ogen 👁️👁️" }
    ]
  },
  look: {
    label: "Blik",
    options: [
      { id: "normal", label: "Normaal" },
      { id: "happy", label: "Vrolijk" },
      { id: "crazy", label: "Gek" },
      { id: "sleepy", label: "Slaperig" }
    ]
  },
  mouth: {
    label: "Mond",
    options: [
      { id: "smile", label: "Glimlach" },
      { id: "grin", label: "Brede Grins" },
      { id: "tongue", label: "Tong Uit 👅" },
      { id: "sad", label: "Sad Frown" },
      { id: "surprised", label: "Verbaasd" }
    ]
  },
  hair: {
    label: "Kapsel",
    options: [
      { id: "bald", label: "Kaal" },
      { id: "sprout", label: "Sprietjes" },
      { id: "shaved", label: "Stoppels" },
      { id: "combed", label: "Gekamd" }
    ]
  },
  outfit: {
    label: "Kleding",
    options: [
      { id: "overalls", label: "Tuinbroek" },
      { id: "maid", label: "Dienstmeid" },
      { id: "tourist", label: "Toerist" },
      { id: "cyborg", label: "Cyborg" }
    ]
  },
  accessory: {
    label: "Accessoire",
    options: [
      { id: "none", label: "Geen" },
      { id: "banana", label: "Banaan 🍌" },
      { id: "teddybear", label: "Tim 🧸" },
      { id: "raygun", label: "Laserpistool 🔫" }
    ]
  }
};

export default function Customizer({ userName, avatarSettings, setAvatarSettings, globalVolume }) {
  const [localSettings, setLocalSettings] = useState(avatarSettings || {
    eyes: 2,
    look: "normal",
    hair: "sprout",
    outfit: "overalls",
    mouth: "smile",
    skin: "yellow",
    accessory: "none"
  });

  const [activeTab, setActiveTab] = useState("skin");
  const [tagline, setTagline] = useState("BANANA!");

  const updateSetting = (key, value) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setAvatarSettings(localSettings);
    playDefaultSound("giggle", globalVolume);
    alert("Bello! Je nieuwe Minion-avatar is opgeslagen als profielfoto!");
  };

  const handleRandomize = () => {
    const randomSettings = {};
    Object.keys(CATEGORIES).forEach((key) => {
      const opts = CATEGORIES[key].options;
      const randomOpt = opts[Math.floor(Math.random() * opts.length)];
      randomSettings[key] = randomOpt.id;
    });

    setLocalSettings(randomSettings);
    
    // Random grappig soundboard geluid
    const randSounds = ["fart", "giggle", "banana"];
    playDefaultSound(randSounds[Math.floor(Math.random() * randSounds.length)], globalVolume);
  };

  return (
    <div className="page max-w-6xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center mb-10">
        <span className="bg-yellow-400 text-blue-900 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
          Build-a-Minion 🧪
        </span>
        <h1
          className="text-5xl md:text-6xl font-extrabold tracking-wider text-blue-800"
          style={{ textShadow: "4px 4px 0px #facc15" }}
        >
          Minion Creator
        </h1>
        <p className="text-gray-500 mt-2 font-medium">
          Ontwerp je eigen unieke hulpje. Pas zijn kapsel, kleding, blik en accessoires aan!
        </p>
      </div>

      {/* Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
        
        {/* Left Column: Live Interactive Card Preview */}
        <div className="lg:col-span-2 flex flex-col justify-between bg-gradient-to-br from-blue-900 to-blue-950 border-4 border-blue-950 rounded-3xl p-8 text-center text-white relative shadow-2xl overflow-hidden min-h-[450px]">
          {/* Decorative grid */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(250,204,21,0.1)_0%,_transparent_150%)] pointer-events-none"></div>

          {/* Tagline sticker top */}
          <div className="absolute top-4 left-4 z-20 bg-yellow-400 text-blue-900 font-black px-4 py-1 rounded-lg text-xs transform -rotate-6 shadow-md border-2 border-white">
            "{tagline || "POUPEI"}"
          </div>

          <div className="flex-1 flex flex-col items-center justify-center relative mt-6">
            {/* Soft Ellipse Ground Shadow */}
            <div className="absolute bottom-2 w-48 h-6 bg-black/45 rounded-full blur-md z-0 pointer-events-none animate-pulse"></div>

            <div className="transform scale-125 md:scale-150 z-10 transition-transform duration-300">
              {renderMinionSvg(localSettings, 140)}
            </div>
          </div>

          {/* Name Tag Input overlay */}
          <div className="mt-8 z-10 space-y-4">
            <div className="bg-white/10 border border-white/20 p-3 rounded-2xl">
              <span className="block text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1 text-left">Naambordje sticker</span>
              <input
                type="text"
                maxLength={15}
                value={tagline}
                onChange={(e) => setTagline(e.target.value.toUpperCase())}
                placeholder="BANANA!"
                className="w-full bg-transparent text-center text-xl font-black text-yellow-300 focus:outline-none placeholder-yellow-300/40 uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleSave}
                className="py-3 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-black rounded-xl shadow-[0_4px_0_rgb(161,98,7)] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1.5"
              >
                <span>💾</span>
                <span>Profielfoto</span>
              </button>
              <button
                onClick={() => downloadMinionSvg(localSettings, userName || "MijnMinion")}
                className="py-3 bg-white/15 hover:bg-white/20 text-white border border-white/30 font-black rounded-xl active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
              >
                <span>📥</span>
                <span>SVG Opslaan</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Customizer options dashboard */}
        <div className="lg:col-span-3 bg-white border-4 border-blue-900 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            {/* Tab Header Selector */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-100 pb-4">
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-3 py-1.5 text-xs font-black rounded-xl border transition-all uppercase
                    ${activeTab === key
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                    }
                  `}
                >
                  {cat.label.split(" ")[0]}
                </button>
              ))}
            </div>

            {/* Tab Options Content */}
            <div className="space-y-4">
              <h3 className="text-xl font-black text-blue-900 uppercase tracking-wide">
                Kies {CATEGORIES[activeTab].label}
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CATEGORIES[activeTab].options.map((opt) => {
                  const isSelected = localSettings[activeTab] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => updateSetting(activeTab, opt.id)}
                      className={`p-4 font-black rounded-2xl border-4 transition-all text-center flex flex-col items-center justify-center h-24
                        ${isSelected
                          ? "border-yellow-400 bg-yellow-50 text-blue-900 shadow-md -translate-y-0.5"
                          : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-300"
                        }
                      `}
                    >
                      <span className="text-sm leading-tight">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Randomizer Card */}
          <div className="mt-8 border-t border-gray-100 pt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <p className="text-xs font-semibold text-gray-400">
              Heb je inspiratie nodig? Klik op de Chaos Generator om een compleet willekeurig Minion-ontwerp te genereren!
            </p>
            <button
              onClick={handleRandomize}
              className="py-3 px-6 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black rounded-2xl shadow-[0_5px_0_rgb(67,56,202)] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>🎲</span>
              <span>CHAOS GENERATOR</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
