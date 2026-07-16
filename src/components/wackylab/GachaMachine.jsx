import React, { useState, useEffect } from "react";
import { playDefaultSound } from "../../services/audio";

const GACHA_COST = 20;

const CARDS = [
  {
    id: "king_bob",
    name: "Koning Bob",
    rarity: "Secret Mythic",
    color: "from-amber-400 to-yellow-500 border-amber-500",
    textTheme: "dark",
    desc: "Heerst over alle Minions en eist absolute banana-opofferingen.",
    stats: { Chaos: 99, Cuteness: 100, Royalty: 1000 },
    icon: "👑",
  },
  {
    id: "banana_minion",
    name: "Banaan-Minion",
    rarity: "Secret Mythic",
    color: "from-yellow-300 to-yellow-500 border-yellow-400",
    textTheme: "dark",
    desc: "Hij is letterlijk veranderd in een banaan. Is hij een minion of voedsel?",
    stats: { Chaos: 20, Kalium: 999, Cuteness: 90 },
    icon: "🍌",
  },
  {
    id: "bob",
    name: "Bob",
    rarity: "Legendary",
    color: "from-yellow-400 to-orange-500 border-orange-400",
    textTheme: "dark",
    desc: "Heeft altijd zijn teddybeer Tim bij zich. Kan harten laten smelten.",
    stats: { Chaos: 50, Cuteness: 150, Knuffelbaarheid: 99 },
    icon: "🧸",
  },
  {
    id: "cyborg_bob",
    name: "Cyborg Bob",
    rarity: "Epic",
    color: "from-blue-600 to-indigo-800 border-blue-500",
    textTheme: "light",
    desc: "Halve robot, hele banaan. Werkt op bio-kalium batterijen.",
    stats: { Chaos: 85, Laserfart: 95, Batterij: 88 },
    icon: "🤖",
  },
  {
    id: "stuart",
    name: "Stuart",
    rarity: "Epic",
    color: "from-purple-600 to-indigo-700 border-purple-500",
    textTheme: "light",
    desc: "Speelt gitaar, flirt graag en negeert de regels van Kevin.",
    stats: { Chaos: 80, Gitaarsolo: 98, Coolness: 90 },
    icon: "🎸",
  },
  {
    id: "purple_mutant",
    name: "Mutant Minion",
    rarity: "Rare",
    color: "from-purple-700 to-fuchsia-800 border-purple-600",
    textTheme: "light",
    desc: "Een paars monster dat alles opvreet en constant gilt.",
    stats: { Chaos: 150, Onverwoestbaar: 100, Honger: 200 },
    icon: "😈",
  },
  {
    id: "kevin",
    name: "Kevin",
    rarity: "Rare",
    color: "from-green-600 to-emerald-800 border-green-500",
    textTheme: "light",
    desc: "De langste Minion met een verantwoordelijkheidsgevoel.",
    stats: { Chaos: 40, Leiderschap: 95, Lengte: 110 },
    icon: "🥽",
  },
  {
    id: "otto",
    name: "Otto",
    rarity: "Uncommon",
    color: "from-teal-500 to-emerald-700 border-teal-500",
    textTheme: "light",
    desc: "Draagt een brede beugel en houdt van zeldzame glimmende stenen.",
    stats: { Chaos: 35, Praten: 85, Beugel: 99 },
    icon: "🦷",
  },
  {
    id: "mel",
    name: "Mel",
    rarity: "Uncommon",
    color: "from-cyan-500 to-blue-700 border-cyan-500",
    textTheme: "light",
    desc: "De eenogige rebel met een kapsel met keurige middenscheiding.",
    stats: { Chaos: 55, Rebel: 90, Goggle: 1 },
    icon: "👁️",
  },
  {
    id: "maid_phil",
    name: "Maid Phil",
    rarity: "Common",
    color: "from-slate-200 to-slate-400 border-slate-350",
    textTheme: "dark",
    desc: "Draagt een dienstmeisjesjurk en stofzuigt de laboratoriumvloer.",
    stats: { Chaos: 30, Stofzuigen: 90, Disguise: 15 },
    icon: "🧹",
  },
  {
    id: "tourist_dave",
    name: "Toerist Dave",
    rarity: "Common",
    color: "from-red-400 to-rose-600 border-rose-500",
    textTheme: "light",
    desc: "Gekleed in een Hawaïshirt. Altijd foto's aan het maken.",
    stats: { Chaos: 45, Zonnebrandcrème: 100, "Foto-flits": 75 },
    icon: "📸",
  },
  {
    id: "baby_stuart",
    name: "Baby Stuart",
    rarity: "Common",
    color: "from-gray-100 to-gray-300 border-gray-300",
    textTheme: "dark",
    desc: "Schattige baby-versie die speentjes steelt.",
    stats: { Chaos: 25, Cuteness: 120, Slaaptijd: 95 },
    icon: "🍼",
  },
];

const DOME_CAPSULES = [
  { bg: "from-red-400 to-red-600", size: "w-10 h-10", anim: "animate-bounce-capsule-a", left: "10%", top: "25%" },
  { bg: "from-blue-400 to-blue-600", size: "w-9 h-9", anim: "animate-bounce-capsule-b", left: "45%", top: "15%" },
  { bg: "from-green-400 to-green-600", size: "w-10 h-10", anim: "animate-bounce-capsule-c", left: "62%", top: "40%" },
  { bg: "from-yellow-300 to-yellow-500", size: "w-11 h-11", anim: "animate-bounce-capsule-a", left: "22%", top: "52%" },
  { bg: "from-purple-400 to-purple-600", size: "w-10 h-10", anim: "animate-bounce-capsule-b", left: "5%", top: "55%" },
  { bg: "from-pink-400 to-pink-600", size: "w-9 h-9", anim: "animate-bounce-capsule-c", left: "75%", top: "30%" },
  { bg: "from-orange-400 to-orange-600", size: "w-10 h-10", anim: "animate-bounce-capsule-a", left: "38%", top: "60%" },
  { bg: "from-cyan-400 to-cyan-600", size: "w-9 h-9", anim: "animate-bounce-capsule-b", left: "68%", top: "10%" },
];

const ODDS_LEGEND = [
  { rarity: "Secret Mythic", chance: "2%", color: "bg-red-600 text-white font-black animate-pulse" },
  { rarity: "Legendary", chance: "6%", color: "bg-amber-500 text-white font-black" },
  { rarity: "Epic", chance: "12%", color: "bg-purple-600 text-white font-bold" },
  { rarity: "Rare", chance: "15%", color: "bg-blue-600 text-white font-bold" },
  { rarity: "Uncommon", chance: "25%", color: "bg-teal-600 text-white font-bold" },
  { rarity: "Common", chance: "40%", color: "bg-gray-500 text-white font-bold" },
];

export default function GachaMachine({ bananaCount, donateBananas, globalVolume }) {
  const [rolling, setRolling] = useState(false);
  const [dispensing, setDispensing] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [capsuleOpen, setCapsuleOpen] = useState(false);
  const [capsuleOpening, setCapsuleOpening] = useState(false);
  const [collection, setCollection] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [ledText, setLedText] = useState("WERPT BANAAN");

  // Laad collectie uit localStorage
  useEffect(() => {
    const saved = localStorage.getItem("minion_gacha_collection");
    if (saved) {
      setCollection(JSON.parse(saved));
    }
  }, []);

  const rollGacha = () => {
    if (rolling || dispensing) return;
    setErrorMsg("");
    setActiveCard(null);
    setCapsuleOpen(false);
    setCapsuleOpening(false);

    // Trek bananen af
    const success = donateBananas(GACHA_COST);
    if (!success) {
      setErrorMsg("Te weinig bananen! Verzamel er meer via de quiz of game.");
      setLedText("ERROR: BANAAN TEKORT");
      playDefaultSound("fart", globalVolume);
      return;
    }

    setRolling(true);
    setLedText("SHAKING...");
    playDefaultSound("banana", globalVolume);

    // Gacha trekking logica met kansberekening
    const rand = Math.random() * 100;
    let chosenRarity = "Common";
    if (rand < 2) chosenRarity = "Secret Mythic";
    else if (rand < 8) chosenRarity = "Legendary";
    else if (rand < 20) chosenRarity = "Epic";
    else if (rand < 35) chosenRarity = "Rare";
    else if (rand < 60) chosenRarity = "Uncommon";

    const filteredCards = CARDS.filter((c) => c.rarity === chosenRarity);
    const card = filteredCards.length > 0
      ? filteredCards[Math.floor(Math.random() * filteredCards.length)]
      : CARDS[CARDS.length - 1];

    // Schudden van de machine (1.2s)
    setTimeout(() => {
      setRolling(false);
      setDispensing(true);
      setLedText("DISPENSING...");
      playDefaultSound("giggle", globalVolume);

      // Capsule rolt naar beneden (0.6s)
      setTimeout(() => {
        setDispensing(false);
        setActiveCard(card);
        setLedText("KRAAK DE CAPSULE");
        
        // Update collectie
        setCollection((prev) => {
          const next = { ...prev, [card.id]: (prev[card.id] || 0) + 1 };
          localStorage.setItem("minion_gacha_collection", JSON.stringify(next));
          return next;
        });
      }, 600);
    }, 1200);
  };

  const triggerOpenCapsule = () => {
    if (capsuleOpening || capsuleOpen) return;
    setCapsuleOpening(true);
    setLedText("OPENING...");
    playDefaultSound("banana_pickup", globalVolume);

    // Splits-animatie duurt 0.5s
    setTimeout(() => {
      setCapsuleOpen(true);
      setLedText("MINION GEVONDEN!");
    }, 500);
  };

  // Bekijk een reeds verzamelde kaart uit het album opnieuw
  const handleInspectCard = (card) => {
    if (collection[card.id] > 0) {
      setActiveCard(card);
      setCapsuleOpen(true);
      setCapsuleOpening(false);
      setLedText(card.name.toUpperCase());
      playDefaultSound("banana_pickup", globalVolume);
    }
  };

  const getRarityBadgeColor = (rarity) => {
    switch (rarity) {
      case "Secret Mythic":
        return "bg-gradient-to-r from-red-500 to-amber-500 text-white animate-pulse shadow-md";
      case "Legendary":
        return "bg-amber-500 text-white font-black shadow-md";
      case "Epic":
        return "bg-purple-600 text-white font-bold shadow-md";
      case "Rare":
        return "bg-blue-600 text-white font-bold shadow-md";
      case "Uncommon":
        return "bg-teal-600 text-white font-bold shadow-md";
      default:
        return "bg-gray-500 text-white font-bold shadow-md";
    }
  };

  const collectedCount = Object.keys(collection).length;
  
  // Handige text contrast status
  const isDarkText = activeCard && activeCard.textTheme === "dark";

  return (
    <div 
      className="flex flex-col lg:flex-row gap-8 p-8 bg-white border border-gray-200 rounded-3xl shadow-xl min-h-[580px]"
      style={{ willChange: "transform", transform: "translate3d(0, 0, 0)" }}
    >
      
      {/* Linkerkant: De ENORME Automaat Cabinet */}
      <div className="flex-1 flex flex-col items-center justify-between min-h-[520px]">
        <div className="text-center w-full mb-4">
          <div className="inline-block bg-yellow-500 text-blue-950 font-black text-xs px-4 py-1 rounded-full uppercase tracking-wider mb-2">
            Experiment #003: Mega Gacha Cabinet
          </div>
          <h2 className="text-4xl font-black text-gray-800 tracking-wide mb-1">
            CAPSULE MACHINE XL
          </h2>
          <p className="text-gray-500 text-sm">
            Trek aan het tandwiel voor <strong>{GACHA_COST} 🍌</strong> en verzamel alle unieke kaarten!
          </p>
        </div>

        {/* Visuele Capsule Automaat - ENORM KABINET (w-80 h-[460px]) */}
        <div 
          className={`relative w-80 h-[460px] bg-gradient-to-b from-blue-900 via-blue-950 to-indigo-950 rounded-t-[6rem] rounded-b-3xl border-8 border-yellow-400 shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-5 flex flex-col items-center justify-between
            ${rolling ? "animate-shake-machine" : ""}
          `}
        >
          {/* Neon Light Header bovenop de kast */}
          <div className="absolute top-3 inset-x-8 h-4 bg-yellow-300 rounded-full blur-[2px] opacity-80 animate-pulse"></div>

          {/* GROTE Glasdome van de machine */}
          <div 
            className="absolute inset-x-3 top-3 h-64 bg-cyan-950/45 rounded-t-[5rem] border-b-[10px] border-yellow-400 shadow-[inset_0_4px_20px_rgba(0,0,0,0.8)] overflow-hidden"
            style={{ position: "absolute", zIndex: 10 }}
          >
            {/* Glass reflection gradient & shiny curve overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none z-20"></div>
            <div className="absolute top-2 left-6 w-8 h-48 bg-white/10 rounded-full blur-[3px] rotate-[15deg] pointer-events-none z-20"></div>

            {/* Bouncing Capsules inside */}
            {DOME_CAPSULES.map((cap, i) => (
              <div
                key={i}
                className={`absolute rounded-full bg-gradient-to-br ${cap.bg} border border-white/40 shadow-md ${cap.size}
                  ${rolling ? cap.anim : "hover:scale-110 duration-200 cursor-pointer"}
                `}
                style={{
                  left: cap.left,
                  top: cap.top,
                  willChange: "transform"
                }}
              />
            ))}
          </div>

          {/* Doorzichtige Drop Chute in het midden van de kast */}
          <div className="absolute top-64 left-1/2 -translate-x-1/2 w-12 h-14 bg-white/10 border-x-2 border-white/20 z-0">
            {/* Animatie van vallende capsule in de trechter */}
            {dispensing && (
              <div className="w-10 h-10 rounded-full bg-gradient-to-b from-yellow-300 to-red-500 border-2 border-white animate-bounce-capsule-c mx-auto" />
            )}
          </div>

          {/* LED PANEL & CONTROLS CONTAINER */}
          <div className="absolute bottom-4 inset-x-3 z-20 flex flex-col items-center gap-4">
            
            {/* LED Status Screen */}
            <div className="w-48 bg-black border-2 border-zinc-700 px-3 py-1.5 rounded-lg text-center shadow-inner">
              <span className="font-mono text-xs font-bold text-green-400 tracking-widest animate-pulse uppercase">
                {ledText}
              </span>
            </div>

            {/* CONTROL BUTTONS PANEL */}
            <div className="flex items-center gap-6 bg-zinc-900/90 border-2 border-zinc-800 p-3 rounded-2xl w-full justify-around shadow-lg">
              
              {/* Premium Coin Slot Decoration */}
              <div className="flex flex-col items-center">
                <div className="w-3 h-8 bg-zinc-950 border border-zinc-700 rounded-sm flex items-center justify-center">
                  <div className="w-0.5 h-6 bg-yellow-500 animate-pulse"></div>
                </div>
                <span className="text-[7px] text-zinc-500 font-bold uppercase mt-1">20🍌</span>
              </div>

              {/* Roterende mechanical crank (Spin animatie verbeterd!) */}
              <button
                onClick={rollGacha}
                disabled={rolling || dispensing}
                className={`w-18 h-18 rounded-full bg-gradient-to-br from-zinc-300 via-zinc-400 to-zinc-600 border-4 border-zinc-500 flex items-center justify-center text-3xl shadow-[0_5px_0_rgb(63,63,70)] active:shadow-none active:translate-y-1 transition-all
                  ${rolling ? "animate-[spin_0.35s_cubic-bezier(0.25,1,0.5,1)_infinite] cursor-not-allowed border-zinc-400" : "hover:scale-105 active:scale-95"}
                `}
                title="Draai om een capsule te pakken!"
              >
                ⚙️
              </button>

              {/* Glowing Green START Button */}
              <button
                onClick={rollGacha}
                disabled={rolling || dispensing}
                className={`w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 border-4 border-green-700 flex items-center justify-center font-black text-xs text-white shadow-[0_4px_0_rgb(21,128,61)] active:shadow-none active:translate-y-0.5 transition-all
                  ${rolling || dispensing ? "opacity-50 cursor-not-allowed animate-none" : "animate-pulse hover:brightness-110"}
                `}
              >
                PLAY
              </button>

            </div>
            
            {/* Dispenser kom */}
            <div className="w-24 h-16 bg-zinc-900 rounded-t-2xl border-t-4 border-zinc-700 flex items-center justify-center relative shadow-[inset_0_4px_8px_rgba(0,0,0,0.8)]">
              {activeCard && !dispensing && (
                <div 
                  onClick={triggerOpenCapsule}
                  className={`w-12 h-12 cursor-pointer absolute transition-all duration-300 flex items-center justify-center
                    ${capsuleOpening ? "scale-110 rotate-12" : "animate-bounce hover:scale-115"}
                    ${capsuleOpen ? "opacity-0 scale-0 pointer-events-none" : ""}
                  `}
                  style={{ top: "2px", zIndex: 30 }}
                >
                  {/* Realistisch splitsbare 3D capsule */}
                  <div className="relative w-12 h-12">
                    <div className="absolute top-0 w-12 h-6 bg-red-500 rounded-t-full border border-white/20 shadow-md"></div>
                    <div className="absolute bottom-0 w-12 h-6 bg-yellow-400 rounded-b-full border border-white/20 shadow-md"></div>
                    <div className="absolute top-5.5 inset-x-0 h-1.5 bg-white border-y border-gray-400"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Foutmelding */}
        <div className="h-6 text-center text-red-600 font-bold text-xs">
          {errorMsg}
        </div>

        {/* Grote Draaiknop onder de kast */}
        <button
          onClick={rollGacha}
          disabled={rolling || dispensing}
          className="w-full py-4 bg-yellow-400 text-blue-900 font-black text-xl rounded-2xl shadow-[0_6px_0_rgb(161,98,7)] active:shadow-none active:translate-y-1 transition-all hover:bg-yellow-300 flex items-center justify-center gap-2"
        >
          <span>🔮</span>
          <span>START CASINO ROLL</span>
        </button>
      </div>

      {/* Rechterkant: Kaartweergave & Album */}
      <div className="w-full lg:w-96 bg-white border border-gray-200 rounded-3xl p-6 flex flex-col justify-between">
        
        {/* Getrokken of Geïnspecteerde Kaart */}
        {activeCard ? (
          <div className="flex-1 flex flex-col items-center justify-center mb-6 min-h-[220px] relative">
            <h3 className="font-black text-gray-700 text-xs uppercase tracking-wider mb-3 animate-pulse text-center">
              {capsuleOpen ? `🔍 ${activeCard.name.toUpperCase()} INSPECTIE` : "🎁 KLIK OP CAPSULE OM TE KRAKEN! 🎁"}
            </h3>

            {/* Capsule Splitsings-effect */}
            {capsuleOpening && !capsuleOpen && (
              <div className="absolute z-20 flex flex-col items-center justify-center w-full h-full pointer-events-none">
                <div className="w-20 h-10 bg-red-500 rounded-t-full border-x-4 border-t-4 border-white/30 animate-[bounce-capsule-a_0.5s_forwards] mb-2" />
                <div className="w-20 h-10 bg-yellow-400 rounded-b-full border-x-4 border-b-4 border-white/30 animate-[bounce-capsule-b_0.5s_forwards]" />
              </div>
            )}

            {/* De Minion Card met Premium Glow (EN EXPLICIETE LEESBARE TEKSTKLEUREN) */}
            <div className={`w-60 h-80 rounded-3xl bg-gradient-to-br ${activeCard.color} border-8 border-white/50 shadow-2xl p-4 flex flex-col justify-between relative overflow-hidden transition-all duration-700 transform
              ${capsuleOpen ? "scale-100 rotate-0 opacity-100 shadow-[0_0_25px_rgba(250,204,21,0.5)]" : "scale-0 rotate-45 opacity-0 pointer-events-none"}
            `}>
              {/* Rarity Watermark */}
              <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 font-black select-none pointer-events-none rotate-12">
                {activeCard.rarity[0]}
              </div>

              {/* Bovenkant: Naam & Type */}
              <div className="flex justify-between items-start">
                <div>
                  <h4 className={`text-xl font-black truncate ${isDarkText ? "text-slate-900" : "text-white"}`}>{activeCard.name}</h4>
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${getRarityBadgeColor(activeCard.rarity)}`}>
                    {activeCard.rarity}
                  </span>
                </div>
                <div className="text-2xl bg-white/20 p-2 rounded-2xl">{activeCard.icon}</div>
              </div>

              {/* Midden: Afbeelding / Emoji in cirkel */}
              <div className="w-24 h-24 rounded-full bg-white/35 border-4 border-white/40 mx-auto flex items-center justify-center text-5xl shadow-inner animate-pulse">
                {activeCard.icon}
              </div>

              {/* Onderkant: Beschrijving & Stats (Perfecte Legibiliteit met contrast backdrops) */}
              <div>
                <p className={`text-[10px] italic text-center font-bold mb-2 p-2 rounded-xl leading-tight border
                  ${isDarkText 
                    ? "bg-white/50 text-slate-800 border-slate-300/40" 
                    : "bg-black/35 text-white border-white/10"
                  }
                `}>
                  "{activeCard.desc}"
                </p>

                {/* Stats Grid */}
                <div className={`grid grid-cols-3 gap-1 p-1.5 rounded-xl text-[9px] font-bold text-center
                  ${isDarkText 
                    ? "bg-white/40 text-slate-800" 
                    : "bg-black/25 text-white"
                  }
                `}>
                  {Object.entries(activeCard.stats).map(([k, v]) => (
                    <div key={k} className="flex flex-col">
                      <span className="opacity-70 text-[7px] uppercase">{k}</span>
                      <span className="truncate">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 mb-6">
            <span className="text-6xl mb-3 animate-bounce">🔮</span>
            <h3 className="text-xl font-black text-gray-800 uppercase">Geen Actieve Minion</h3>
            <p className="text-xs text-gray-400 mt-2 max-w-xs">
              Draai aan de grote capsule-automaat aan de linkerkant en kraak de vallende capsule! Of klik op een kaart in je album om hem hier te bekijken.
            </p>
          </div>
        )}

        {/* Album & Odds Progress */}
        <div className="border-t border-gray-100 pt-4">
          
          {/* VERBETERDE ODDS TABEL (Premium grid) */}
          <div className="mb-4 bg-gray-50 border border-gray-200 rounded-2xl p-3 shadow-inner">
            <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-2.5 text-center">Trekking Kansen (Odds)</h4>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
              {ODDS_LEGEND.map((odd) => (
                <div key={odd.rarity} className="flex items-center justify-between bg-white border border-gray-100 px-2.5 py-1.5 rounded-xl shadow-sm">
                  <span className={`px-2 py-0.5 rounded-lg text-[8px] ${odd.color}`}>{odd.rarity}</span>
                  <span className="text-blue-950 font-black font-mono">{odd.chance}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between text-xs font-black text-gray-500 uppercase mb-2">
            <span>Mijn Album ({collectedCount} / {CARDS.length})</span>
            <span>{Math.round((collectedCount / CARDS.length) * 100)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-4 border border-gray-200">
            <div
              className="h-full bg-yellow-400 transition-all duration-500 rounded-full"
              style={{ width: `${(collectedCount / CARDS.length) * 100}%` }}
            />
          </div>

          {/* KLIKBAAR INTERACTIEF ALBUM GRID */}
          <div className="grid grid-cols-6 gap-1.5 max-h-24 overflow-y-auto pr-1">
            {CARDS.map((c) => {
              const amount = collection[c.id] || 0;
              const hasIt = amount > 0;
              return (
                <button
                  key={c.id}
                  onClick={() => handleInspectCard(c)}
                  disabled={!hasIt}
                  className={`aspect-square rounded-lg border-2 flex items-center justify-center relative text-lg font-bold transition-all
                    ${
                      hasIt
                        ? "bg-yellow-100 border-yellow-400 text-yellow-950 scale-100 hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
                        : "bg-gray-50 border-gray-200 text-gray-300 opacity-40 cursor-not-allowed"
                    }
                  `}
                  title={hasIt ? `${c.name} (${amount}x) - Klik om te bekijken` : "Nog niet ontgrendeld"}
                >
                  <span>{c.icon}</span>
                  {amount > 1 && (
                    <span className="absolute -right-1 -bottom-1 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                      {amount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
