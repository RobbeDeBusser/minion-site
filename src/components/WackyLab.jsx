import React, { useState } from "react";
import { Link } from "react-router-dom";
import PanicButton from "./wackylab/PanicButton";
import FartOMatic from "./wackylab/FartOMatic";
import GachaMachine from "./wackylab/GachaMachine";
import BananaGame from "./wackylab/BananaGame";
import VoiceSynthesizer from "./wackylab/VoiceSynthesizer";

export default function WackyLab({ bananaCount, addBananas, donateBananas }) {
  const [activeTab, setActiveTab] = useState("panic");

  const tabs = [
    { id: "panic", label: "Panic Button", icon: "🚨", color: "hover:bg-red-50 hover:text-red-600 active-red" },
    { id: "fart", label: "Fart-O-Matic", icon: "💨", color: "hover:bg-purple-50 hover:text-purple-600 active-purple" },
    { id: "gacha", label: "Gacha Machine", icon: "🔮", color: "hover:bg-yellow-50 hover:text-yellow-600 active-yellow" },
    { id: "game", label: "Banana Catcher", icon: "🎮", color: "hover:bg-green-50 hover:text-green-600 active-green" },
    { id: "voice", label: "Minion Talker", icon: "🗣️", color: "hover:bg-blue-50 hover:text-blue-600 active-blue" },
  ];

  return (
    <div className="page max-w-7xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-blue-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl border-b-8 border-blue-950 relative overflow-hidden mb-12 text-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-yellow-400/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute -right-10 -bottom-10 text-9xl opacity-5 select-none pointer-events-none">🧪</div>
        <div className="absolute -left-10 -top-10 text-9xl opacity-5 select-none pointer-events-none">🧬</div>
        
        <span className="bg-yellow-400 text-blue-900 font-black px-4 py-1 rounded-full text-xs uppercase tracking-widest mb-4 inline-block shadow-md">
          Top Secret • Gru's Lab
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
          WACKY LAB <span className="text-yellow-400">🧪</span>
        </h1>
        <p className="text-blue-200 text-base md:text-lg mt-3 max-w-xl mx-auto">
          Welkom in de geheime testkamer! Hier voeren we de meest willekeurige, 
          chaotische en grappige experimenten uit met de Minions.
        </p>
      </div>

      {/* Tabs Selector Bar */}
      <div className="bg-white/80 backdrop-blur-md border-2 border-blue-100 rounded-3xl p-3 shadow-lg mb-8 flex flex-wrap gap-2 justify-center items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          let activeStyles = "";
          
          if (isActive) {
            if (tab.id === "panic") activeStyles = "bg-red-500 text-white shadow-lg shadow-red-500/30 scale-105 border-red-500";
            else if (tab.id === "fart") activeStyles = "bg-purple-600 text-white shadow-lg shadow-purple-600/30 scale-105 border-purple-600";
            else if (tab.id === "gacha") activeStyles = "bg-yellow-400 text-blue-900 shadow-lg shadow-yellow-400/30 scale-105 border-yellow-400";
            else if (tab.id === "game") activeStyles = "bg-green-500 text-white shadow-lg shadow-green-500/30 scale-105 border-green-500";
            else if (tab.id === "voice") activeStyles = "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105 border-blue-600";
          } else {
            activeStyles = "bg-transparent text-gray-600 border-transparent hover:scale-102";
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-2xl font-black text-sm transition-all duration-200 flex items-center gap-2.5 border-2 ${activeStyles} ${tab.color}`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Screen */}
      <div className="transition-all duration-500 ease-in-out">
        {activeTab === "panic" && <PanicButton />}
        {activeTab === "fart" && <FartOMatic />}
        {activeTab === "gacha" && (
          <GachaMachine
            bananaCount={bananaCount}
            donateBananas={donateBananas}
          />
        )}
        {activeTab === "game" && (
          <BananaGame addBananas={addBananas} />
        )}
        {activeTab === "voice" && <VoiceSynthesizer />}
      </div>

      {/* Meer Experimenten Links */}
      <div className="mt-12 border-t-4 border-dashed border-blue-900/30 pt-8">
        <h3 className="text-2xl font-black text-blue-900 mb-6 text-center uppercase tracking-wider">Meer Wacky Experimenten</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/translator" className="bg-white border-4 border-purple-500 rounded-3xl p-6 shadow-md hover:-translate-y-1 transition-all text-center">
            <span className="text-4xl block mb-2">🗣️</span>
            <h4 className="text-lg font-black text-blue-900">Fart Vertaler</h4>
            <p className="text-xs text-gray-500 mt-1 font-semibold">Vertaal mensentaal naar grappige scheetgeluiden.</p>
          </Link>
          <Link to="/quiz" className="bg-white border-4 border-green-500 rounded-3xl p-6 shadow-md hover:-translate-y-1 transition-all text-center">
            <span className="text-4xl block mb-2">🧠</span>
            <h4 className="text-lg font-black text-blue-900">Minion Quiz</h4>
            <p className="text-xs text-gray-500 mt-1 font-semibold">Test je kennis en verdubbel je bananen!</p>
          </Link>
          <Link to="/dictionary" className="bg-white border-4 border-yellow-400 rounded-3xl p-6 shadow-md hover:-translate-y-1 transition-all text-center">
            <span className="text-4xl block mb-2">📖</span>
            <h4 className="text-lg font-black text-blue-900">Leer-Hub</h4>
            <p className="text-xs text-gray-500 mt-1 font-semibold">Leer Bananees praten als een echte minion.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
