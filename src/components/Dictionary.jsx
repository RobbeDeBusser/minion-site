import React, { useState, useMemo, useEffect, useCallback } from "react";
import { minionDictionary, dictionaryKeys } from "../data/dictionary";

// --- 1. TELLEN (Stijl: Klembord / Lijst) ---
function NumberChart() {
  const numbers = [
    { n: 1, min: "Hana" },
    { n: 2, min: "Dul" },
    { n: 3, min: "Sae" },
    { n: 4, min: "Para" },
    { n: 5, min: "Quin" },
    { n: 6, min: "Sex" },
    { n: 7, min: "Sep" },
    { n: 8, min: "Ocho" },
    { n: 9, min: "Nove" },
    { n: 10, min: "Diez" },
    { n: 11, min: "Diez-Hana" },
    { n: 12, min: "Diez-Dul" },
    { n: 13, min: "Diez-Sae" },
    { n: 14, min: "Diez-Para" },
    { n: 15, min: "Diez-Quin" },
    { n: 16, min: "Diez-Sex" },
    { n: 17, min: "Diez-Sep" },
    { n: 18, min: "Diez-Ocho" },
    { n: 19, min: "Diez-Nove" },
    { n: 20, min: "Venti" },
    { n: 30, min: "Trenta" },
    { n: 40, min: "Quarenta" },
    { n: 50, min: "Quinta" },
    { n: 60, min: "Sessanta" },
    { n: 70, min: "Septanta" },
    { n: 80, min: "Ochenta" },
    { n: 90, min: "Noventa" },
    { n: 100, min: "Cento" },
  ];

  return (
    // Unieke Stijl: Wit Klembord met Oranje accenten
    <div className="bg-white rounded-[2rem] p-6 shadow-[8px_8px_0px_rgba(0,0,0,0.1)] border-4 border-blue-600 h-full flex flex-col relative overflow-hidden">
      {/* Decoratieve 'clip' bovenaan */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-blue-600 rounded-b-xl"></div>

      <h2 className="text-2xl font-extrabold text-center text-blue-600 mb-6 mt-4 uppercase tracking-widest">
        1-2-3 Tellen
      </h2>

      <div
        className="flex-grow overflow-y-auto space-y-3 px-2 custom-scrollbar"
        style={{ maxHeight: "600px" }}
      >
        {numbers.map((item) => (
          <div
            key={item.n}
            className="flex justify-between items-center p-3 rounded-xl bg-blue-50 border-2 border-blue-100 hover:border-blue-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="font-black text-white bg-blue-700 w-10 h-10 rounded-lg flex items-center justify-center text-lg shadow-sm">
                {item.n}
              </span>
            </div>
            <span className="font-black text-gray-800 text-xl">{item.min}</span>
          </div>
        ))}
        <p className="text-center text-xs text-blue-400 mt-4 font-bold uppercase">
          * Venti-Hana, Venti-Dul...
        </p>
      </div>
    </div>
  );
}

// --- 2. FLASHCARDS (Stijl: Blauwe Training Zone) ---
function Flashcards({ onFlip }) {
  const [currentCard, setCurrentCard] = useState({
    front: "Bello",
    back: "Hello",
  });
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSliding, setIsSliding] = useState(false);

  const loadNextCard = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * dictionaryKeys.length);
    const englishWord = dictionaryKeys[randomIndex];
    const minionWord = minionDictionary[englishWord];

    if (Math.random() > 0.5) {
      setCurrentCard({ front: englishWord, back: minionWord });
    } else {
      setCurrentCard({ front: minionWord, back: englishWord });
    }
  }, []);

  useEffect(() => {
    loadNextCard();
  }, [loadNextCard]);

  const handleNextCard = () => {
    if (isSliding) return;
    setIsSliding(true);
    setTimeout(() => {
      loadNextCard();
      setIsFlipped(false);
      setTimeout(() => {
        setIsSliding(false);
      }, 50);
    }, 500);
  };

  const handleFlip = () => {
    if (isSliding) return;
    setIsFlipped(!isFlipped);
    if (!isFlipped && onFlip) onFlip();
  };

  return (
    // Unieke Stijl: Blauwe Tech/Training Kaart
    <div className="bg-blue-600 rounded-[2.5rem] p-8 shadow-2xl border-b-[12px] border-blue-800 relative">
      {/* Schroefjes decoratie */}
      <div className="absolute top-6 left-6 w-3 h-3 bg-blue-400 rounded-full"></div>
      <div className="absolute top-6 right-6 w-3 h-3 bg-blue-400 rounded-full"></div>

      <h2 className="text-2xl font-black text-center text-white mb-6 uppercase tracking-wider">
        Hersen Training 🧠
      </h2>

      <div className="relative w-full h-64 [perspective:1000px] mb-8">
        {/* Kaart 3 (Onderop) */}
        <div className="absolute inset-0 bg-blue-800/50 rounded-3xl border-2 border-blue-400 transform scale-90 rotate-[6deg] translate-y-4"></div>
        {/* Kaart 2 (Midden) */}
        <div className="absolute inset-0 bg-blue-700 rounded-3xl border-2 border-blue-300 transform scale-95 -rotate-[3deg] translate-y-2"></div>

        {/* Kaart 1 (Bovenop - Interactief) */}
        <div
          className={`flashcard-stack-card absolute inset-0 
                                ${isFlipped ? "is-flipped" : ""} 
                                ${isSliding ? "is-sliding" : ""}`}
          onClick={handleFlip}
        >
          <div className="flashcard-face absolute w-full h-full bg-white rounded-3xl flex items-center justify-center p-6 shadow-[0_10px_20px_rgba(0,0,0,0.2)] border-4 border-yellow-400">
            <span className="text-5xl font-black text-blue-900 text-center">
              {currentCard.front}
            </span>
            <span className="absolute bottom-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
              Klik om te draaien
            </span>
          </div>
          <div className="flashcard-face flashcard-back absolute w-full h-full bg-yellow-400 rounded-3xl flex items-center justify-center p-6 shadow-[0_10px_20px_rgba(0,0,0,0.2)] border-4 border-white">
            <span className="text-5xl font-black text-blue-900 text-center">
              {currentCard.back}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleNextCard}
          className="w-full py-4 bg-yellow-400 text-blue-900 font-black text-xl rounded-2xl shadow-[0_6px_0_rgb(202,138,4)] active:shadow-none active:translate-y-1.5 transition-all hover:bg-yellow-300"
        >
          VOLGENDE KAART ➤
        </button>
      </div>
    </div>
  );
}

// --- 3. WOORDENBOEK (Stijl: Geel Notitieblok) ---
function DictionaryList() {
  const [filter, setFilter] = useState("");
  const lowerFilter = filter.toLowerCase();

  const filteredList = useMemo(() => {
    if (!filter) {
      return dictionaryKeys.map((key) => ({
        english: key,
        minion: minionDictionary[key],
      }));
    }
    return dictionaryKeys
      .filter(
        (key) =>
          key.toLowerCase().includes(lowerFilter) ||
          minionDictionary[key].toLowerCase().includes(lowerFilter)
      )
      .map((key) => ({ english: key, minion: minionDictionary[key] }));
  }, [filter, lowerFilter]);

  return (
    // Unieke Stijl: Groot Geel Boek
    <div className="bg-yellow-100 rounded-[2rem] p-6 lg:p-8 shadow-xl border-4 border-yellow-400 h-full flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-yellow-400 p-3 rounded-xl shadow-sm">
          <span className="text-3xl">📚</span>
        </div>
        <h2 className="text-3xl font-black text-yellow-800">Het Grote Boek</h2>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          className="w-full p-4 pl-12 bg-white border-4 border-yellow-200 rounded-2xl text-lg font-bold text-gray-700 placeholder-yellow-300 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 transition-all shadow-sm"
          placeholder="Zoek iets..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">
          🔍
        </span>
      </div>

      <div
        className="flex-grow overflow-y-auto space-y-3 pr-2 custom-scrollbar"
        style={{ maxHeight: "600px" }}
      >
        {filteredList.length > 0 ? (
          filteredList.map(({ english, minion }, index) => (
            <div
              key={english}
              className="group bg-white p-4 rounded-2xl border-2 border-transparent hover:border-yellow-400 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <span className="font-bold text-gray-500 text-lg">{english}</span>
              <div className="hidden sm:block flex-grow border-b-2 border-dotted border-gray-200 mx-4"></div>
              <span className="font-extrabold text-blue-600 text-xl text-right">
                {minion}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-12 opacity-50">
            <p className="text-4xl mb-2">🤷‍♂️</p>
            <p className="font-bold text-yellow-800">
              Geen woorden gevonden...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Hoofdcomponent ---
export default function Dictionary({ onFlashcardFlip }) {
  return (
    <div className="page max-w-[90rem] mx-auto px-4 py-8">
      <h1 className="text-5xl md:text-7xl font-extrabold text-center tracking-wider text-blue-900 mb-12 drop-shadow-sm">
        Leer-Hub
      </h1>

      {/* Grid Layout: Geen overkoepelende kaart meer, maar losse, unieke elementen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 items-start">
        {/* Kolom 1: Flashcards */}
        <div className="flex flex-col gap-8">
          <Flashcards onFlip={onFlashcardFlip} />
        </div>

        {/* Kolom 2: Tellen */}
        <div className="h-full">
          <NumberChart />
        </div>

        {/* Kolom 3: Woordenboek */}
        <div className="lg:col-span-2 2xl:col-span-1 h-full min-h-[500px]">
          <DictionaryList />
        </div>
      </div>
    </div>
  );
}
