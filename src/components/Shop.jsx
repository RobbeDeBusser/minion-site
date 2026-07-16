import React, { useState } from "react";

const RARITIES = {
  common: {
    label: "COMMON",
    color: "text-gray-400",
    bg: "bg-gray-100",
    border: "border-gray-300",
    glow: "hover:shadow-[0_0_30px_rgba(156,163,175,0.6)]",
  },
  uncommon: {
    label: "UNCOMMON",
    color: "text-green-400",
    bg: "bg-green-50",
    border: "border-green-300",
    glow: "hover:shadow-[0_0_30px_rgba(74,222,128,0.6)]",
  },
  rare: {
    label: "RARE",
    color: "text-blue-400",
    bg: "bg-blue-50",
    border: "border-blue-300",
    glow: "hover:shadow-[0_0_30px_rgba(96,165,250,0.6)]",
  },
  epic: {
    label: "EPIC",
    color: "text-purple-400",
    bg: "bg-purple-50",
    border: "border-purple-300",
    glow: "hover:shadow-[0_0_30px_rgba(192,132,252,0.6)]",
  },
  legendary: {
    label: "LEGENDARY",
    color: "text-orange-400",
    bg: "bg-orange-50",
    border: "border-orange-300",
    glow: "hover:shadow-[0_0_30px_rgba(251,146,60,0.6)]",
  },
  mythic: {
    label: "MYTHIC",
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-300",
    glow: "hover:shadow-[0_0_30px_rgba(239,68,68,0.6)]",
  },
};

function RarityLegend() {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border-2 border-yellow-400">
      <span className="w-full text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
        Rarity Legende
      </span>
      {Object.entries(RARITIES).map(([key, conf]) => (
        <div
          key={key}
          className={`flex items-center gap-2 px-3 py-1 rounded-full border ${conf.bg} ${conf.border}`}
        >
          <svg
            className={`w-4 h-4 ${conf.color}`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12,0 L15,8 L24,8 L17,14 L20,24 L12,18 L4,24 L7,14 L0,8 L9,8 Z" />
          </svg>
          <span className="text-[10px] font-black text-gray-600">
            {conf.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function ShopItem({ item, bananaCount, buyShopItem, isDiscountActive }) {
  // Bereken prijs (met korting indien actief)
  const isDiscounted = isDiscountActive || item.discounted;
  const finalPrice = isDiscounted ? Math.floor(item.price / 2) : item.price;
  const canAfford = bananaCount >= finalPrice;
  const isPurchased = item.purchased;

  const handleBuyClick = () => {
    if (canAfford && !isPurchased) {
      buyShopItem(item.id);
    }
  };

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
  const rarityConf = RARITIES[item.rarity] || RARITIES["common"];

  return (
    <div
      className={`relative flex flex-col bg-white rounded-3xl p-6 shadow-lg border border-gray-100 transition-all duration-300 hover:-translate-y-2 group
                        ${isPurchased ? "opacity-90" : rarityConf.glow}`}
    >
      {/* Prijskaartje */}
      {!isPurchased && (
        <div className="absolute -top-3 -right-3 z-20 flex flex-col items-end">
          {/* Toon oude prijs als er korting is */}
          {isDiscounted && (
            <div className="text-xs font-bold text-gray-400 line-through bg-white px-2 rounded border border-gray-200 mb-[-5px] mr-2 relative z-0">
              {item.price} 🍌
            </div>
          )}
          <div
            className={`font-black text-xl px-4 py-2 rounded-full shadow-xl transform rotate-12 border-4 border-white group-hover:scale-110 transition-transform relative z-10
                                    ${
                                      isDiscounted
                                        ? "bg-red-600 text-white animate-pulse"
                                        : "bg-blue-600 text-white"
                                    }`}
          >
            {finalPrice} 🍌
          </div>
        </div>
      )}

      <div className="relative h-40 flex items-center justify-center mb-2 mt-6">
        <div
          className={`absolute inset-0 flex items-center justify-center ${rarityConf.color} transition-transform duration-700 group-hover:rotate-45`}
        >
          <svg
            className="w-40 h-40 opacity-30"
            viewBox="0 0 100 100"
            fill="currentColor"
          >
            <path d="M50 0 L63 25 L90 20 L80 45 L100 60 L75 75 L80 100 L55 85 L40 100 L35 75 L10 80 L25 55 L0 40 L25 30 L20 5 L45 25 Z" />
          </svg>
        </div>
        <div className="text-6xl z-10 transform transition-transform duration-300 group-hover:scale-125 drop-shadow-md">
          {icon}
        </div>
      </div>

      <h3 className="text-xl font-extrabold text-blue-900 text-center mb-6 leading-tight h-12 flex items-center justify-center z-10">
        {item.name}
      </h3>

      <div className="mt-auto z-10">
        {isPurchased ? (
          <div className="w-full py-3 bg-green-100 text-green-700 font-bold rounded-xl border-2 border-green-200 flex items-center justify-center gap-2">
            <span>✅ EIGENDOM</span>
          </div>
        ) : (
          <button
            onClick={handleBuyClick}
            disabled={!canAfford}
            className={`w-full py-3 font-extrabold rounded-xl shadow-md transition-all active:scale-95 active:shadow-none border-b-4
                            ${
                              canAfford
                                ? "bg-green-500 text-white border-green-700 hover:bg-green-400"
                                : "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed"
                            }`}
          >
            {canAfford ? "KOOP NU!" : "TE DUUR..."}
          </button>
        )}
      </div>
    </div>
  );
}

// AANGEPAST: Zoekbalk toegevoegd
export default function Shop({
  shopItems,
  buyShopItem,
  bananaCount,
  isDiscountActive,
  triggerPrankEffect,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("sounds");

  // Splitsen op type
  const sounds = shopItems.filter((i) => i.type !== "prank");
  const pranks = shopItems.filter((i) => i.type === "prank");

  const currentTabItems = activeTab === "sounds" ? sounds : pranks;

  // Filteren op zoekterm
  const filteredItems = currentTabItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ownedPranks = pranks.filter((i) => i.purchased);

  return (
    <div className="page max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1
          className="text-5xl md:text-7xl font-extrabold tracking-wider text-blue-800 mb-6"
          style={{ textShadow: "4px 4px 0px #facc15" }}
        >
          Bananen Bazaar
        </h1>

        {isDiscountActive && (
          <div className="inline-block bg-red-600 text-white font-black text-2xl px-6 py-2 rounded-full animate-bounce mb-6 shadow-lg rotate-2 border-4 border-white">
            🔥 50% KORTING OP ALLES! 🔥
          </div>
        )}

        <br />

        <div className="inline-flex items-center gap-4 bg-blue-600 text-white px-8 py-3 rounded-full shadow-xl border-4 border-blue-700 mb-8">
          <span className="text-lg font-medium text-blue-100">
            Je portemonnee:
          </span>
          <span className="text-3xl font-black text-yellow-400 drop-shadow-sm">
            {bananaCount} 🍌
          </span>
        </div>

        {/* Tab Selectors */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => {
              setActiveTab("sounds");
              setSearchTerm("");
            }}
            className={`px-6 py-3 rounded-2xl font-black text-lg shadow transition-all duration-200
              ${
                activeTab === "sounds"
                  ? "bg-yellow-400 text-blue-900 scale-105 border-b-4 border-yellow-600"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }
            `}
          >
            🎵 Geluidsclips
          </button>
          <button
            onClick={() => {
              setActiveTab("pranks");
              setSearchTerm("");
            }}
            className={`px-6 py-3 rounded-2xl font-black text-lg shadow transition-all duration-200
              ${
                activeTab === "pranks"
                  ? "bg-purple-600 text-white scale-105 border-b-4 border-purple-800"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }
            `}
          >
            🧪 Chaos Items
          </button>
        </div>

        {/* Zoekbalk */}
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder={
              activeTab === "sounds" ? "Zoek een geluid..." : "Zoek een chaos item..."
            }
            className="w-full p-4 rounded-2xl border-4 border-blue-200 shadow-inner text-lg font-bold text-gray-700 focus:border-yellow-400 focus:outline-none transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <RarityLegend />
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center p-12 bg-white/50 rounded-3xl border-4 border-dashed border-gray-300">
          <p className="text-gray-500 text-2xl font-bold">
            Geen items gevonden... 😱
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
          {filteredItems.map((item) => (
            <ShopItem
              key={item.id}
              item={item}
              bananaCount={bananaCount}
              buyShopItem={buyShopItem}
              isDiscountActive={isDiscountActive}
            />
          ))}
        </div>
      )}

      {/* --- INVENTARIS SECTIE --- */}
      <div className="border-t-4 border-dashed border-blue-200 pt-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-blue-900 flex items-center justify-center gap-2">
            <span>Inventaris</span>
            <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-mono uppercase">
              {ownedPranks.length} Items owned
            </span>
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Activeer je gekochte chaos items om de website te saboteren!
          </p>
        </div>

        {ownedPranks.length === 0 ? (
          <div className="max-w-md mx-auto text-center p-8 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-300">
            <span className="text-4xl">🎒</span>
            <h3 className="font-bold text-gray-700 mt-2">Inventaris is leeg</h3>
            <p className="text-xs text-gray-400 mt-1">
              Koop hierboven een item uit de 'Chaos Items' tab om hier te activeren!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ownedPranks.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border-2 border-purple-200 shadow-md flex flex-col justify-between items-center text-center relative overflow-hidden"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h4 className="font-black text-blue-900 text-lg mb-1">{item.name}</h4>
                <p className="text-xs text-gray-500 mb-6">{item.desc}</p>
                <button
                  onClick={() => triggerPrankEffect(item.id)}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-sm rounded-xl shadow-[0_4px_0_rgb(109,40,217)] active:shadow-none active:translate-y-1 transition-all hover:from-purple-500 hover:to-indigo-500"
                >
                  🚀 ACTIVEREN!
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
