import React, { useState, useEffect } from "react";
import { playDefaultSound } from "../services/audio";

const STOCK_DETAILS = {
  BAN: { name: "Banana Corp", symbol: "BAN", icon: "🍌", volatility: 0.08, startPrice: 15.0, color: "text-yellow-500", border: "border-yellow-400", bg: "bg-yellow-50" },
  GRU: { name: "Gru Industries", symbol: "GRU", icon: "🚀", volatility: 0.18, startPrice: 120.0, color: "text-purple-500", border: "border-purple-400", bg: "bg-purple-50" },
  PPO: { name: "Papoy Apparel", symbol: "PPO", icon: "👗", volatility: 0.04, startPrice: 8.0, color: "text-pink-500", border: "border-pink-400", bg: "bg-pink-50" },
  FART: { name: "Fart Tech", symbol: "FART", icon: "💨", volatility: 0.12, startPrice: 45.0, color: "text-teal-500", border: "border-teal-400", bg: "bg-teal-50" }
};

const MARKET_NEWS = [
  "Kevin koopt de dip: markten reageren optimistisch.",
  "Stuart sneed gitaarsnaar door: GRU daalt licht.",
  "Bananenschaarste in laboratorium 3 dreigt.",
  "Dave lanceert per ongeluk prototype minion-raket.",
  "Bob verliest teddybeer Tim: emotionele verkoopgolf op komst.",
  "Nieuwe levering dienstmeisjes-outfits stuwt PPO koers.",
  "Fart-O-Matic patent goedgekeurd door Gru.",
  "Kalium-inflatie stijgt wereldwijd met 3.5%.",
  "Minion-beursbengels schreeuwen 'BANANA' op de handelsvloer."
];

export default function Market({ 
  bananaCount, 
  addBananas, 
  donateBananas, 
  globalVolume,
  stocks,
  setStocks,
  favoriteStock,
  setFavoriteStock
}) {
  const [activeStock, setActiveStock] = useState("BAN");

  const [shares, setShares] = useState({ BAN: 0, GRU: 0, PPO: 0, FART: 0 });
  const [debt, setDebt] = useState({ BAN: 0, GRU: 0, PPO: 0, FART: 0 }); // Schulden voor hefboomwerking
  const [leverage, setLeverage] = useState(1); // 1x, 2x, 5x, 10x
  const [news, setNews] = useState(["Minion Aandelenmarkt geopend!"]);
  const [sentiment, setSentiment] = useState("BANANA 🍌"); // Bullish, Bearish, Banana
  const [customAmount, setCustomAmount] = useState(5);

  // Laad aandelen & schulden uit localStorage op mount
  useEffect(() => {
    const savedShares = {};
    const savedDebt = {};
    Object.keys(STOCK_DETAILS).forEach((key) => {
      savedShares[key] = parseInt(localStorage.getItem(`minion_shares_${key}`) || "0");
      savedDebt[key] = parseFloat(localStorage.getItem(`minion_debt_${key}`) || "0");
    });
    setShares(savedShares);
    setDebt(savedDebt);
  }, []);

  // Nieuws & Sentiment loop
  useEffect(() => {
    const interval = setInterval(() => {
      // Update nieuws
      if (Math.random() < 0.6) {
        const randNews = MARKET_NEWS[Math.floor(Math.random() * MARKET_NEWS.length)];
        setNews((prev) => [randNews, ...prev].slice(0, 5));
      }

      // Update sentiment
      const r = Math.random();
      setSentiment(r < 0.35 ? "BULLISH 🐂" : r < 0.7 ? "BEARISH 🐻" : "BANANA 🍌");
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Margin Call Check loop
  useEffect(() => {
    Object.keys(STOCK_DETAILS).forEach((key) => {
      const currentPrice = stocks[key].price;
      const currentShares = shares[key];
      const currentDebt = debt[key];
      
      if (currentShares > 0 && currentDebt > 0) {
        const totalValue = currentShares * currentPrice;
        const netWorth = totalValue - currentDebt;
        
        // Liquidatiegrens: net worth is 0 of negatief
        if (netWorth <= 0) {
          // Liquidatie!
          setShares((prev) => {
            const next = { ...prev, [key]: 0 };
            localStorage.setItem(`minion_shares_${key}`, "0");
            return next;
          });
          setDebt((prev) => {
            const next = { ...prev, [key]: 0 };
            localStorage.setItem(`minion_debt_${key}`, "0");
            return next;
          });
          playDefaultSound("beedo", globalVolume);
          alert(`🚨 MARGIN CALL op ${key}! Bob heeft je aandelen opgegeten omdat je hefboomschuld groter was dan je onderpand!`);
        }
      }
    });
  }, [stocks, shares, debt, globalVolume]);

  const toggleFavoriteStock = () => {
    setFavoriteStock(activeStock);
    localStorage.setItem("minion_favorite_stock", activeStock);
    playDefaultSound("banana_pickup", globalVolume);
  };

  const activePrice = stocks[activeStock].price;
  const activeShares = shares[activeStock];
  const activeDebt = debt[activeStock];
  const activeNetWorth = Math.round((activeShares * activePrice - activeDebt) * 100) / 100;

  const buyShares = (qty) => {
    if (qty <= 0) return;
    const requiredBananas = Math.round((qty * activePrice) / leverage);
    
    if (bananaCount >= requiredBananas) {
      const success = donateBananas(requiredBananas);
      if (success) {
        const addedDebt = requiredBananas * (leverage - 1);
        const nextShares = activeShares + qty;
        const nextDebt = activeDebt + addedDebt;

        setShares((prev) => {
          const next = { ...prev, [activeStock]: nextShares };
          localStorage.setItem(`minion_shares_${activeStock}`, nextShares.toString());
          return next;
        });
        setDebt((prev) => {
          const next = { ...prev, [activeStock]: nextDebt };
          localStorage.setItem(`minion_debt_${activeStock}`, nextDebt.toString());
          return next;
        });
        playDefaultSound("banana", globalVolume);
        setNews((prev) => [`> Gekocht: ${qty} ${activeStock} met ${leverage}x hefboom.`, ...prev].slice(0, 5));
      }
    } else {
      alert("Bi-do! Te weinig bananen!");
    }
  };

  const buyAll = () => {
    const maxSpending = bananaCount * leverage;
    const qty = Math.floor(maxSpending / activePrice);
    if (qty > 0) {
      buyShares(qty);
    } else {
      alert("Bi-do! Je kunt niet eens 1 aandeel kopen!");
    }
  };

  const sellShares = (qty) => {
    if (qty <= 0 || activeShares < qty) return;
    
    const sellValue = qty * activePrice;
    const debtRatio = qty / activeShares;
    const debtToPay = activeDebt * debtRatio;
    
    const profit = Math.round(sellValue - debtToPay);
    
    addBananas(profit);

    const nextShares = activeShares - qty;
    const nextDebt = Math.max(0, activeDebt - debtToPay);

    setShares((prev) => {
      const next = { ...prev, [activeStock]: nextShares };
      localStorage.setItem(`minion_shares_${activeStock}`, nextShares.toString());
      return next;
    });
    setDebt((prev) => {
      const next = { ...prev, [activeStock]: nextShares === 0 ? 0 : nextDebt };
      localStorage.setItem(`minion_debt_${activeStock}`, nextShares === 0 ? "0" : nextDebt.toString());
      return next;
    });

    playDefaultSound("giggle", globalVolume);
    setNews((prev) => [`> Verkocht: ${qty} ${activeStock}. Winst/Verlies: ${profit} 🍌.`, ...prev].slice(0, 5));
  };

  const sellAll = () => {
    if (activeShares > 0) {
      sellShares(activeShares);
    }
  };

  const chartHistory = stocks[activeStock].history;
  const maxChart = Math.max(...chartHistory) * 1.05;
  const minChart = Math.min(...chartHistory) * 0.95;
  const chartHeight = 200;
  const chartWidth = 500;

  const points = chartHistory.map((price, i) => {
    const x = (i / (chartHistory.length - 1 || 1)) * chartWidth;
    const y = chartHeight - ((price - minChart) / (maxChart - minChart || 1)) * chartHeight;
    return `${x},${y}`;
  }).join(" ");

  const isFavorite = favoriteStock === activeStock;

  return (
    <div className="page max-w-7xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center mb-10">
        <span className="bg-green-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
          Miny-Wallstreet 💸
        </span>
        <h1
          className="text-5xl md:text-7xl font-extrabold tracking-wider text-blue-800"
          style={{ textShadow: "4px 4px 0px #facc15" }}
        >
          Minion Beurs
        </h1>
        <p className="text-gray-500 mt-2 font-medium">
          Investeer je zuurverdiende bananen in de meest chaotische beurs ter wereld.
        </p>
      </div>

      {/* Wallet balance */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex items-center gap-4 bg-blue-900 text-white px-8 py-3 rounded-2xl shadow-xl border-4 border-blue-950">
          <span className="text-sm text-blue-200 font-bold uppercase tracking-wider">Jouw Bananen:</span>
          <span className="text-3xl font-black text-yellow-400">{bananaCount} 🍌</span>
        </div>
      </div>

      {/* Grid Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Stock Selector and Details */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white border-4 border-blue-900 rounded-3xl p-6 shadow-md">
            <h3 className="text-lg font-black text-blue-900 mb-4 uppercase tracking-wider">Kies Aandeel</h3>
            
            <div className="space-y-3">
              {Object.entries(STOCK_DETAILS).map(([key, item]) => {
                const isSelected = activeStock === key;
                const price = stocks[key].price;
                const pctChange = stocks[key].history.length > 1
                  ? ((price - stocks[key].history[stocks[key].history.length - 2]) / stocks[key].history[stocks[key].history.length - 2]) * 100
                  : 0;

                return (
                  <button
                    key={key}
                    onClick={() => setActiveStock(key)}
                    className={`w-full p-4 rounded-2xl border-4 flex items-center justify-between transition-all text-left
                      ${isSelected ? "border-yellow-400 bg-yellow-50/50 shadow-md" : "border-gray-200 bg-white hover:bg-gray-50"}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{item.icon}</span>
                      <div>
                        <div className="font-black text-blue-900 flex items-center gap-1.5">
                          <span>{item.symbol}</span>
                          {favoriteStock === key && <span className="text-yellow-500 text-sm">★</span>}
                        </div>
                        <div className="text-xs text-gray-400 font-bold">{item.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-black text-blue-900">{price.toFixed(2)} 🍌</div>
                      <div className={`text-xs font-black ${pctChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {pctChange >= 0 ? "▲" : "▼"} {Math.abs(pctChange).toFixed(1)}%
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sentiment Widget */}
          <div className="bg-white border-4 border-blue-900 rounded-3xl p-6 shadow-md flex justify-between items-center">
            <div>
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Sentiment Indicator</h4>
              <div className="text-2xl font-black text-blue-900">{sentiment}</div>
            </div>
            <span className="text-4xl">
              {sentiment.includes("🐂") ? "🐂" : sentiment.includes("🐻") ? "🐻" : "🍌"}
            </span>
          </div>
        </div>

        {/* Middle column: Graph & Statistics */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SVG Graph Card */}
          <div className="bg-white border-4 border-blue-900 rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{STOCK_DETAILS[activeStock].icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-blue-900">{STOCK_DETAILS[activeStock].name} ({activeStock})</h2>
                    <button
                      onClick={toggleFavoriteStock}
                      className={`text-xl transition-all hover:scale-115 active:scale-90 ${isFavorite ? "text-yellow-500 drop-shadow" : "text-gray-300 hover:text-yellow-400"}`}
                      title={isFavorite ? "Ontvolg beurs als favoriet" : "Markeer deze beurs als favoriet voor de Navbar!"}
                    >
                      {isFavorite ? "★" : "☆"}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 font-semibold">Real-time prijsgeschiedenis (laatste 20 ticks)</p>
                </div>
              </div>
              <div className="text-right font-mono">
                <span className="text-3xl font-black text-green-600">{activePrice.toFixed(2)} 🍌</span>
              </div>
            </div>

            {/* Interactive SVG Chart */}
            <div className="bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 flex items-center justify-center">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-48 overflow-visible">
                {/* Horizontal Guide Lines */}
                <line x1="0" y1="0" x2={chartWidth} y2="0" stroke="#f1f5f9" strokeWidth="2" />
                <line x1="0" y1={chartHeight / 2} x2={chartWidth} y2={chartHeight / 2} stroke="#f1f5f9" strokeWidth="2" />
                <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#e2e8f0" strokeWidth="2" />

                {/* Price labels */}
                <text x="5" y="15" fill="#94a3b8" fontSize="10" className="font-mono font-bold">{maxChart.toFixed(2)}</text>
                <text x="5" y={chartHeight / 2 + 4} fill="#94a3b8" fontSize="10" className="font-mono font-bold">{((maxChart + minChart) / 2).toFixed(2)}</text>
                <text x="5" y={chartHeight - 6} fill="#94a3b8" fontSize="10" className="font-mono font-bold">{minChart.toFixed(2)}</text>

                {/* Gradient Fill under the line */}
                <defs>
                  <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d={`M0,${chartHeight} L${points} L${chartWidth},${chartHeight} Z`}
                  fill="url(#chart-grad)"
                />

                {/* Historical Price Path Line */}
                <polyline
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />

                {/* Current Price Dot */}
                {chartHistory.length > 0 && (
                  <circle
                    cx={chartWidth}
                    cy={chartHeight - ((activePrice - minChart) / (maxChart - minChart || 1)) * chartHeight}
                    r="6"
                    fill="#15803d"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                )}
              </svg>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl">
                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Dag High</span>
                <span className="font-mono font-extrabold text-blue-900">{stocks[activeStock].high.toFixed(2)} 🍌</span>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl">
                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Dag Low</span>
                <span className="font-mono font-extrabold text-blue-900">{stocks[activeStock].low.toFixed(2)} 🍌</span>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl">
                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Dagvolume</span>
                <span className="font-mono font-extrabold text-blue-900">{stocks[activeStock].volume.toFixed(2)}M 🍌</span>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl">
                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Market Cap</span>
                <span className="font-mono font-extrabold text-blue-900">{stocks[activeStock].cap.toFixed(2)}M 🍌</span>
              </div>
            </div>
          </div>

          {/* Trade controls card */}
          <div className="bg-white border-4 border-blue-900 rounded-3xl p-6 shadow-md grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            {/* Left: Portefeuille */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-blue-900 uppercase tracking-wider">Jouw Portefeuille</h3>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-bold">Gekocht:</span>
                  <span className="font-mono font-extrabold text-blue-900">{activeShares} aandelen</span>
                </div>
                {activeDebt > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-red-400 font-bold">Schuld (Hefboom):</span>
                    <span className="font-mono font-extrabold text-red-600">-{Math.round(activeDebt)} 🍌</span>
                  </div>
                )}
                <div className="flex justify-between text-base border-t border-gray-200 pt-2 font-black">
                  <span className="text-blue-900">Netto Waarde:</span>
                  <span className="font-mono text-green-600">{activeNetWorth} 🍌</span>
                </div>
              </div>

              {/* Leverage selector */}
              <div>
                <span className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                  Bananen-Hefboom (Leverage) 🚀
                </span>
                <div className="flex gap-2">
                  {[1, 2, 5, 10].map((lv) => (
                    <button
                      key={lv}
                      onClick={() => setLeverage(lv)}
                      className={`flex-1 py-2 text-xs font-black rounded-xl border-2 transition-all
                        ${leverage === lv
                          ? "bg-red-500 text-white border-red-600 shadow-[0_3px_0_rgb(185,28,28)] -translate-y-0.5"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                        }
                      `}
                    >
                      {lv}x {lv > 1 ? "Extreem" : "Normaal"}
                    </button>
                  ))}
                </div>
                {leverage > 1 && (
                  <p className="text-[10px] text-red-500 font-bold mt-2 animate-pulse">
                    ⚠️ Risico op MARGIN CALL liquidatie! Bob eet al je aandelen op als je bezit onder de schuld zakt!
                  </p>
                )}
              </div>
            </div>

            {/* Right: Buy / Sell Knoppen */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-blue-900 uppercase tracking-wider">Transacties</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => buyShares(1)}
                  className="py-3 bg-green-500 hover:bg-green-400 text-white font-black text-sm rounded-xl shadow-[0_4px_0_rgb(22,101,52)] active:translate-y-0.5 active:shadow-none transition-all"
                >
                  KOOP 1 AANDEEL
                </button>
                <button
                  onClick={() => sellShares(1)}
                  disabled={activeShares === 0}
                  className={`py-3 font-black text-sm rounded-xl shadow transition-all active:translate-y-0.5 active:shadow-none
                    ${activeShares > 0
                      ? "bg-red-500 hover:bg-red-400 text-white shadow-[0_4px_0_rgb(185,28,28)]"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                    }
                  `}
                >
                  VERKOOP 1
                </button>
              </div>

              {/* Custom amount inputs */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Aantal</label>
                  <input
                    type="number"
                    min="1"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 px-2 py-1.5 border-2 border-gray-300 rounded-lg text-center font-bold text-blue-900 focus:outline-none focus:border-yellow-400"
                  />
                </div>
                <div className="flex-1 flex gap-2">
                  <button
                    onClick={() => buyShares(customAmount)}
                    className="flex-1 py-2.5 bg-green-500 hover:bg-green-400 text-white font-black text-xs rounded-xl shadow-[0_3px_0_rgb(22,101,52)] active:translate-y-0.5 active:shadow-none transition-all"
                  >
                    KOOP {customAmount}
                  </button>
                  <button
                    onClick={() => sellShares(customAmount)}
                    disabled={activeShares < customAmount}
                    className={`flex-1 py-2.5 font-black text-xs rounded-xl shadow transition-all active:translate-y-0.5 active:shadow-none
                      ${activeShares >= customAmount
                        ? "bg-red-500 hover:bg-red-400 text-white shadow-[0_3px_0_rgb(185,28,28)]"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                      }
                    `}
                  >
                    VERKOOP {customAmount}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={buyAll}
                  className="py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-black text-sm rounded-2xl shadow-[0_5px_0_rgb(6,78,59)] active:translate-y-0.5 active:shadow-none transition-all"
                >
                  💰 INVESTEER ALLES
                </button>
                <button
                  onClick={sellAll}
                  disabled={activeShares === 0}
                  className={`py-4 font-black text-sm rounded-2xl shadow transition-all active:translate-y-0.5 active:shadow-none
                    ${activeShares > 0
                      ? "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white shadow-[0_5px_0_rgb(159,18,57)]"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                    }
                  `}
                >
                  🚨 VERKOOP ALLES
                </button>
              </div>
            </div>

          </div>

          {/* News Feed ticker */}
          <div className="bg-blue-900 border-4 border-blue-950 rounded-3xl p-6 shadow-md text-white">
            <h3 className="text-xs font-black text-yellow-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
              LIVE MINY-NEWS FEED 📺
            </h3>
            <div className="bg-blue-950/50 rounded-2xl p-4 border border-blue-800/40 font-mono text-xs h-32 overflow-y-auto space-y-2">
              {news.map((item, i) => (
                <div key={i} className="truncate text-green-400">
                  <span className="text-blue-300 mr-2">[{new Date().toLocaleTimeString()}]</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
