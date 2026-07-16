import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { minionDictionary, dictionaryKeys } from "../data/dictionary";
import { playDefaultSound } from "../services/audio"; // AANGEPAST: Gebruik de synth!

// --- DATA ---
const botFacts = [
  "Banana Bots halen hun energie uit kalium-isotopen (bananen dus).",
  "De eerste Banana Bot was eigenlijk op zoek naar de kantine.",
  "Bananese is 50% piepjes en 50% fruit-namen.",
  "Bots roesten niet, ze krijgen alleen 'karakter'.",
  "Bob heeft ooit per ongeluk het internet verwijderd.",
  "Bots dromen van elektrische schapen (en bananen).",
];

const bots = [
  {
    name: "Bob",
    desc: "Het prototype. Eet meer dan hij oplaadt.",
    likes: "Teddybeer Tim & Bananen",
    color: "bg-yellow-400",
  },
  {
    name: "Stuart",
    desc: "De rebel. Geeft soms kleine schokjes.",
    likes: "Gitaar spelen",
    color: "bg-blue-400",
  },
  {
    name: "Kevin",
    desc: "De leider. Heeft altijd een plan.",
    likes: "Golfen",
    color: "bg-green-400",
  },
  {
    name: "Dave",
    desc: "De fanatieke. Tilt alles op.",
    likes: "Raketten",
    color: "bg-red-400",
  },
];

// Posities voor de zwevende bananen
const floatingBananas = [
  { top: "0%", left: "10%", delay: "0s" },
  { top: "20%", right: "5%", delay: "1s" },
  { top: "60%", left: "-5%", delay: "2s" },
  { bottom: "10%", right: "10%", delay: "0.5s" },
  { top: "-10%", right: "30%", delay: "1.5s" },
];

// --- WIDGET: WOORD VAN DE DAG ---
const WordOfTheDay = React.memo(function WordOfTheDay() {
  const [wotd, setWotd] = useState({ minion: "Laden...", english: "..." });
  useEffect(() => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem("bot_wotd_date");
    if (savedDate === today) {
      setWotd({
        minion: localStorage.getItem("bot_wotd_minion") || "Bello",
        english: localStorage.getItem("bot_wotd_english") || "Hello",
      });
    } else {
      const randomIndex = Math.floor(Math.random() * dictionaryKeys.length);
      const englishWord = dictionaryKeys[randomIndex];
      const minionWord = minionDictionary[englishWord];
      localStorage.setItem("bot_wotd_date", today);
      localStorage.setItem("bot_wotd_minion", minionWord);
      localStorage.setItem("bot_wotd_english", englishWord);
      setWotd({ minion: minionWord, english: englishWord });
    }
  }, []);

  return (
    <div className="bg-white border-b-8 border-r-8 border-yellow-400 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-between relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity rotate-12">
        📅
      </div>
      <div>
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
          Dagelijkse Les
        </h3>
        <div className="text-3xl font-black text-blue-600 break-words mb-1">
          "{wotd.minion}"
        </div>
        <div className="text-lg font-medium text-gray-500">
          = {wotd.english}
        </div>
      </div>
      <div className="mt-4">
        <Link
          to="/dictionary"
          className="text-xs font-bold text-yellow-600 hover:underline"
        >
          Bekijk Woordenboek →
        </Link>
      </div>
    </div>
  );
});

// --- SUB-COMPONENT: MISSION COUNTDOWN ---
function MissionCountdown({ nextMissionTime }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = Date.now();
      const distance = nextMissionTime - now;
      if (distance < 0) {
        setTimeLeft("");
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}u ${minutes}m ${seconds}s`);
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [nextMissionTime]);

  if (!timeLeft) return null;

  return (
    <p className="text-2xl font-mono font-bold text-gray-400 mt-2 animate-pulse">
      {timeLeft}
    </p>
  );
}



// --- MAIN COMPONENT ---
export default function Home({
  bananaCount,
  userName,
  activeMission,
  missionProgress,
  missionClaimed,
  missionStarted,
  startMission,
  claimMissionReward,
  missionRewardAmount,
  nextMissionTime,
  globalVolume,
  addBananas,
  donateBananas,
}) {
  const [donationAmount, setDonationAmount] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [isDonating, setIsDonating] = useState(false);
  const [randomFact, setRandomFact] = useState("");
  const [randomBot, setRandomBot] = useState(bots[0]);

  const [bananaBlast, setBananaBlast] = useState(false);
  const [boboJump, setBoboJump] = useState(false);

  useEffect(() => {
    setRandomFact(botFacts[Math.floor(Math.random() * botFacts.length)]);
    setRandomBot(bots[Math.floor(Math.random() * bots.length)]);
  }, []);

  const handleDonate = () => {
    if (bananaCount >= donationAmount) {
      setIsDonating(true);
      setBoboJump(true);
      setBananaBlast(true);

      if (window.handleDonation) window.handleDonation(donationAmount);

      playDefaultSound("banana", globalVolume);

      setFeedback(`Tank yu! Accu opgeladen met ${donationAmount} 🍌!`);

      setTimeout(() => {
        setIsDonating(false);
        setFeedback("");
        setBoboJump(false);
        setBananaBlast(false);
      }, 1500);
    } else {
      setFeedback("Bi-do... Te weinig brandstof!");
    }
  };

  const progressPercent = activeMission
    ? Math.min((missionProgress / activeMission.target) * 100, 100)
    : 0;
  const isMissionComplete =
    activeMission && missionProgress >= activeMission.target;
  const isCooldown = Date.now() < nextMissionTime;

  return (
    <div 
      className="page max-w-7xl mx-auto px-4 py-8"
      style={{ willChange: "transform", transform: "translate3d(0, 0, 0)" }}
    >
      {/* --- DISCLAIMER BANNER --- */}
      <div className="mb-6 flex items-center gap-3 bg-yellow-50 border-2 border-yellow-400 rounded-2xl px-5 py-3 text-sm">
        <span className="text-2xl flex-shrink-0">⚠️</span>
        <p className="text-yellow-900 font-semibold leading-snug">
          <strong>Fan-project — Niet officieel.</strong>{" "}
          Minions™ is een handelsmerk van Universal Pictures / Illumination Entertainment.
          Dit is een hobbyproject zonder commercieel doel, niet gelieerd aan of goedgekeurd door Universal of Illumination.
        </p>
      </div>

      {/* --- HERO SECTION --- */}
      <div className="bg-blue-900 rounded-[3rem] p-8 md:p-12 shadow-2xl border-b-8 border-blue-950 relative overflow-hidden mb-12">
        {/* Achtergrond decoratie */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-400 via-blue-900 to-blue-900"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Intro & Image */}
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start relative">
            <span className="bg-yellow-400 text-blue-900 font-black px-4 py-1 rounded-full text-sm mb-4 shadow-lg">
              🍌 Fan-project — Niet Officieel
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              <span className="text-yellow-400 block">Banana Corp</span>
              Control Center
            </h1>
            <p className="text-blue-200 text-lg mb-8 max-w-md">
              Welkom, {userName || "Operator"}. Alle systemen zijn operationeel.
              Tijd om chaos te creëren en bananen te verdienen!
            </p>

            {/* CONTAINER VOOR MINION + ZWEVENDE BANANEN */}
            <div className="relative mt-4 w-64 h-64 md:w-80 md:h-80 flex items-center justify-center select-none">
              {/* Soft Ground Shadow behind Minion */}
              <div 
                className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-6 bg-black/35 rounded-full blur-md z-10 pointer-events-none transition-transform duration-300"
                style={{ transform: `translateX(-50%) scale(${boboJump ? 0.6 : 1})` }}
              ></div>

              {/* ZWEVENDE BANANEN */}
              {floatingBananas.map((pos, i) => (
                <span
                  key={`float-${i}`}
                  className="absolute inline-block text-4xl animate-float-banana pointer-events-none opacity-80 z-10"
                  style={{ ...pos, animationDelay: pos.delay }}
                >
                  🍌
                </span>
              ))}

              <img
                src="/fat-minion.png"
                alt="Onze favoriete Minion"
                className={`relative z-20 w-full h-full object-contain transition-transform duration-300 ease-out 
                                    ${
                                      boboJump
                                        ? "animate-bobo-jump"
                                        : "hover:scale-105"
                                    }`}
              />

              {/* Banana Blast Effect */}
              {bananaBlast && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                  <span className="text-6xl animate-ping absolute opacity-50">
                    ✨
                  </span>
                  <span className="text-6xl animate-bounce absolute delay-100">
                    🍌
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Donation Panel */}
          <div className="w-full max-w-md bg-blue-950/60 border-2 border-blue-500/20 rounded-3xl p-8 shadow-2xl mx-auto lg:mx-0">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-white mb-2">
                Energie Transfer
              </h2>
              <p className="text-blue-200 text-sm">
                Geef Bobo brandstof (Bananen)
              </p>
            </div>

            <div className="bg-blue-950/50 rounded-2xl p-6 mb-6 border border-blue-500/30">
              <div className="flex justify-between text-yellow-400 font-bold mb-2">
                <span>POWER:</span>
                <span>{donationAmount} 🍌</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={donationAmount}
                onChange={(e) => setDonationAmount(parseInt(e.target.value))}
                className="w-full h-4 bg-blue-800 rounded-lg appearance-none cursor-pointer accent-yellow-400"
              />
            </div>

            <button
              onClick={handleDonate}
              className="w-full py-4 bg-yellow-400 text-blue-900 font-black text-xl rounded-xl shadow-[0_6px_0_rgb(161,98,7)] active:shadow-none active:translate-y-1 transition-all hover:bg-yellow-300 flex items-center justify-center gap-2 group"
            >
              <span>⚡</span>
              <span>LAAD OP!</span>
            </button>

            <div className="h-8 mt-4 text-center">
              {feedback && (
                <span className="text-green-400 font-bold animate-pulse text-sm bg-green-900/50 px-3 py-1 rounded-full">
                  {feedback}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- DASHBOARD GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* CARD 1: MISSION */}
        <div
          className={`bg-white border-b-8 border-r-8 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-between
                ${
                  isMissionComplete && !missionClaimed && !isCooldown
                    ? "border-green-500 bg-green-50"
                    : "border-blue-200"
                }
          `}
        >
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl">
                {isCooldown ? "⏳" : activeMission?.icon || "🎯"}
              </div>
              {isCooldown && (
                <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
                  Cooldown
                </span>
              )}
            </div>
            <h3 className="text-xl font-black text-gray-800 mb-2">
              {isCooldown
                ? "Even Pauze"
                : missionClaimed
                ? "Missie Voltooid"
                : "Missie Protocol"}
            </h3>

            {!isCooldown && activeMission && !missionClaimed && (
              <p className="text-gray-600 font-medium text-sm mb-4">
                {activeMission.desc}
              </p>
            )}
            {isCooldown && (
              <MissionCountdown nextMissionTime={nextMissionTime} />
            )}
          </div>

          <div className="mt-4">
            {!isCooldown &&
              activeMission &&
              !missionClaimed &&
              (!missionStarted ? (
                <button
                  onClick={startMission}
                  className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                >
                  START
                </button>
              ) : isMissionComplete ? (
                <button
                  onClick={claimMissionReward}
                  className="w-full py-2 bg-green-500 text-white font-bold rounded-lg animate-bounce"
                >
                  CLAIM {missionRewardAmount} 🍌
                </button>
              ) : (
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              ))}
          </div>
        </div>

        {/* CARD 2: WORD OF THE DAY */}
        <WordOfTheDay />



        {/* CARD 4: FACTS */}
        <div className="bg-white border-b-8 border-r-8 border-purple-400 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-6xl opacity-10 rotate-12">
            💡
          </div>
          <h3 className="text-xs font-black text-purple-400 uppercase tracking-widest mb-3">
            Data Archief
          </h3>
          <p className="text-lg font-bold text-gray-700 italic">
            "{randomFact}"
          </p>
        </div>

        {/* CARD 4: BOT PROFILE */}
        <div
          className={`bg-white border-b-8 border-r-8 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-between relative overflow-hidden ${randomBot.color.replace(
            "bg-",
            "border-"
          )}`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div
              className={`w-16 h-16 rounded-full ${randomBot.color} border-4 border-white shadow-md flex items-center justify-center text-3xl`}
            >
              🍌
            </div>
            <div>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Medewerker
              </h3>
              <div className="text-xl font-black text-gray-800">
                {randomBot.name}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600 border border-gray-100">
            <p className="mb-1">
              <strong>Status:</strong> {randomBot.desc}
            </p>
            <p>
              <strong>Likes:</strong> {randomBot.likes}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
