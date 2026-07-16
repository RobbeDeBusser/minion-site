import React, { useState } from "react";
import { Link } from "react-router-dom";

// Sub-component: De Arcade Knop
function SoundboardButton({ item, isPlaying, onPlay, toggleFavorite }) {
  const getIcon = () => {
    if (item.icon && item.icon.trim() !== "") return item.icon;
    switch (item.id) {
      case "fart":
        return "💨";
      case "giggle":
        return "😆";
      case "banana":
        return "🍌";
      case "beedo":
        return "🚨";
      default:
        return "🎵";
    }
  };

  const icon = getIcon();

  return (
    <div className="relative group">
      {/* FAVORITE BUTTON (Sterretje Rechtsboven) */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Voorkom afspelen
          toggleFavorite(item.id);
        }}
        className={`absolute -top-2 -right-2 z-20 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110 border-2 border-white
                            ${
                              item.isFavorite
                                ? "bg-yellow-400 text-white"
                                : "bg-gray-200 text-gray-400 hover:bg-gray-300"
                            }`}
        title={
          item.isFavorite
            ? "Verwijder uit Quick Menu"
            : "Voeg toe aan Quick Menu"
        }
      >
        ★
      </button>

      {/* DE SPEEL KNOP */}
      <button
        onClick={() => onPlay(item)}
        className={`relative w-full aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-100 outline-none
                    ${
                      isPlaying
                        ? "bg-yellow-300 translate-y-2 shadow-none ring-4 ring-white"
                        : "bg-yellow-400 shadow-[0_8px_0_rgb(202,138,4)] hover:bg-yellow-300 active:shadow-none active:translate-y-2"
                    }`}
      >
        {/* Decoratie */}
        <div className="absolute top-2 left-2 w-2 h-2 bg-yellow-600 rounded-full opacity-50"></div>
        <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-600 rounded-full opacity-50"></div>

        <span
          className={`text-5xl mb-2 filter drop-shadow-sm transition-transform duration-300 ${
            isPlaying ? "animate-bounce" : "group-hover:scale-110"
          }`}
        >
          {icon}
        </span>

        <span className="font-extrabold text-blue-900 text-sm sm:text-base px-2 truncate w-full">
          {item.name}
        </span>
      </button>
    </div>
  );
}

// AANGEPAST: Props ontvangen voor favorieten en afspelen
export default function MySounds({
  shopItems,
  globalVolume,
  setGlobalVolume,
  toggleFavorite,
  playSound,
}) {
  const [playingId, setPlayingId] = useState(null);

  const purchasedSounds = shopItems.filter((s) => s.purchased && s.type !== "prank");

  const handlePlaySound = (item) => {
    setPlayingId(item.id);

    // Gebruik de centrale playSound functie die we van App.jsx kregen
    playSound(item);

    // Omdat we geen callback hebben van playSound over wanneer het klaar is (voor default sounds),
    // gebruiken we een timeout voor de animatie. Voor custom sounds in App.jsx zou dit beter kunnen,
    // maar dit werkt prima visueel.
    setTimeout(() => setPlayingId(null), 1000);
  };

  return (
    <div className="page max-w-5xl mx-auto px-4 py-8">
      <h1
        className="text-5xl md:text-6xl font-extrabold text-center tracking-wider text-blue-800 mb-10"
        style={{ textShadow: "4px 4px 6px rgba(255, 204, 0, 0.6)" }}
      >
        Jouw Beatbox
      </h1>

      {/* Volume Slider */}
      <div className="max-w-xs mx-auto mb-8 bg-white/80 backdrop-blur-sm p-4 rounded-2xl border-2 border-blue-200 shadow-md flex items-center gap-4">
        <span className="text-2xl">🔊</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={globalVolume}
          onChange={(e) => setGlobalVolume(parseFloat(e.target.value))}
          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <span className="font-bold text-blue-900 w-8">
          {Math.round(globalVolume * 100)}%
        </span>
      </div>

      {purchasedSounds.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-md border-4 border-dashed border-gray-300 rounded-3xl p-12 text-center">
          <div className="text-6xl mb-4 opacity-50">🕸️</div>
          <h3 className="text-2xl font-bold text-gray-500 mb-2">
            Het is hier zo stil...
          </h3>
          <p className="text-gray-600 mb-8">
            Je hebt nog geen geluiden gekocht!
          </p>
          <Link
            to="/shop"
            className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition transform hover:scale-105 inline-block"
          >
            Ga naar de Shop 🛒
          </Link>
        </div>
      ) : (
        <div className="bg-blue-800 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl border-b-[12px] border-blue-900 relative">
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            <div
              className="w-3 h-3 rounded-full bg-green-500 animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </div>

          {/* Header met info */}
          <div className="text-center mb-6">
            <span className="bg-blue-900/50 text-blue-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              Kies max 6 favorieten (★) voor je Quick Menu
            </span>
          </div>

          <div
            id="my-sounds-soundboard"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8"
          >
            {purchasedSounds.map((item) => (
              <SoundboardButton
                key={item.id}
                item={item}
                isPlaying={playingId === item.id}
                onPlay={handlePlaySound}
                toggleFavorite={toggleFavorite} // Doorgeven
              />
            ))}
          </div>

          <div className="text-center mt-8 opacity-50">
            <span className="text-blue-200 font-black tracking-[0.5em] text-xs">
              GRU INDUSTRIES AUDIO
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
