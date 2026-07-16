import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { renderMinionSvg } from "../utils/avatar";

export default function Navbar({
  bananaCount,
  userName,
  isAdmin,
  quizInProgress,
  activeMission,
  missionProgress,
  missionClaimed,
  missionStarted,
  claimMissionReward,
  avatarSettings,
  stocks,
  favoriteStock,
  currentUser,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Favoriete beurs weergave in de navbar
  const favDetail = stocks && favoriteStock ? stocks[favoriteStock] : null;
  const favConfig = favoriteStock ? {
    BAN: { symbol: "BAN", icon: "🍌" },
    GRU: { symbol: "GRU", icon: "🚀" },
    PPO: { symbol: "PPO", icon: "👗" },
    FART: { symbol: "FART", icon: "💨" }
  }[favoriteStock] : null;

  const favPctChange = favDetail && favDetail.history && favDetail.history.length > 1
    ? ((favDetail.price - favDetail.history[favDetail.history.length - 2]) / favDetail.history[favDetail.history.length - 2]) * 100
    : 0;

  // AANGEPAST: Nieuwe stijlen voor de donkerblauwe balk
  const getLinkClass = ({ isActive }) => {
    const baseClasses =
      "inline-flex items-center justify-center px-4 py-2 rounded-full font-bold text-sm sm:text-base transition-all duration-200 ease-in-out";

    if (isActive) {
      // Actief: Geel met blauwe tekst (De "Minion" look)
      return `${baseClasses} bg-yellow-400 text-blue-900 shadow-[0_0_15px_rgba(250,204,21,0.6)] transform scale-105`;
    } else {
      // Inactief: Wit met gele hover
      return `${baseClasses} text-white hover:text-yellow-300 hover:bg-blue-800`;
    }
  };

  // Stijl voor MOBIELE links
  const getMobileLinkClass = ({ isActive }) => {
    const baseClasses =
      "block px-4 py-3 rounded-xl font-bold text-lg transition-colors";
    return isActive
      ? `${baseClasses} bg-yellow-400 text-blue-900 shadow-md`
      : `${baseClasses} text-white hover:bg-blue-800`;
  };

  const getMobileAccountClass = ({ isActive }) => {
    const baseClasses =
      "block px-4 py-3 rounded-xl font-bold text-lg border-2 border-white/20 mt-2";
    return isActive
      ? `${baseClasses} bg-blue-700 text-white border-yellow-400`
      : `${baseClasses} bg-blue-800 text-white hover:bg-blue-700`;
  };

  const getQuizLockClass = ({ isActive }) => {
    let baseClass = getLinkClass({ isActive });
    if (quizInProgress) {
      baseClass += " opacity-50 cursor-not-allowed grayscale";
    }
    return baseClass;
  };

  const handleQuizLockClick = (e) => {
    if (quizInProgress) {
      e.preventDefault();
    }
  };

  const handleMobileLinkClick = (e) => {
    if (quizInProgress) {
      e.preventDefault();
    } else {
      setIsMenuOpen(false);
    }
  };

  const handleMobileAccountClick = () => {
    setIsMenuOpen(false);
  };

  const progressPercent = activeMission
    ? Math.min((missionProgress / activeMission.target) * 100, 100)
    : 0;
  const isMissionComplete =
    activeMission && missionProgress >= activeMission.target;

  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-4 flex flex-col gap-3 pointer-events-none">
      {/* 1. DE NAVBAR (Donkerblauw) */}
      <nav
        className="pointer-events-auto container mx-auto px-2 py-2 flex justify-between items-center gap-3
                      bg-blue-900/95 backdrop-blur-md rounded-full shadow-2xl 
                      border-4 border-yellow-400 relative z-50"
      >
        {/* Links: Hamburger of Welkom */}
        <div className="flex-1 min-w-0 flex justify-start pl-2">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-full text-yellow-400 hover:bg-blue-800 transition"
            aria-label="Menu"
          >
            {isMenuOpen ? (
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            )}
          </button>
        <div className="hidden lg:flex items-center gap-2 text-yellow-100 ml-2 self-center font-bold text-lg truncate">
          <span>👋</span>
          {userName && avatarSettings && (
            <div className="w-8 h-8 rounded-full bg-blue-900 border-2 border-yellow-400 overflow-hidden flex items-center justify-center p-0.5 shadow-inner">
              {renderMinionSvg(avatarSettings, 26)}
            </div>
          )}
          <span>{userName || "Welkom!"}</span>
        </div>
        </div>

        {/* Midden: Links (Desktop) */}
        <div className="hidden lg:flex flex-auto justify-center gap-x-1">
          <NavLink
            to="/"
            className={getQuizLockClass}
            onClick={handleQuizLockClick}
          >
            Home
          </NavLink>
          <NavLink
            to="/customizer"
            className={getQuizLockClass}
            onClick={handleQuizLockClick}
          >
            Creator
          </NavLink>
          <NavLink
            to="/shop"
            className={getQuizLockClass}
            onClick={handleQuizLockClick}
          >
            Bazaar
          </NavLink>
          <NavLink
            to="/market"
            className={getQuizLockClass}
            onClick={handleQuizLockClick}
          >
            Beurs
          </NavLink>
          <NavLink
            to="/my-sounds"
            className={getQuizLockClass}
            onClick={handleQuizLockClick}
          >
            Beatbox
          </NavLink>
          <NavLink
            to="/wacky-lab"
            className={getQuizLockClass}
            onClick={handleQuizLockClick}
          >
            Wacky Lab
          </NavLink>
          {isAdmin && (
            <NavLink
              to="/admin"
              className={getQuizLockClass}
              onClick={handleQuizLockClick}
            >
              Admin
            </NavLink>
          )}
        </div>

        {/* Rechts: Account & Bananen */}
        <div className="flex-1 flex justify-end items-center space-x-3 min-w-0 pr-1">
          {/* Account button — shows Google photo if signed in */}
          <NavLink
            to="/account"
            className={({ isActive }) =>
              `${getLinkClass({
                isActive,
              })} hidden lg:inline-flex border-2 border-white/20 hover:border-yellow-400 gap-2`
            }
          >
            {currentUser && currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="Profiel"
                className="w-5 h-5 rounded-full border border-yellow-300 flex-shrink-0 object-cover"
              />
            ) : null}
            {currentUser ? (currentUser.displayName?.split(" ")[0] || "Account") : "Account"}
            {currentUser && (
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" title="Cloud Sync Actief" />
            )}
          </NavLink>

          {/* Favoriete Beurs Tracker Pill */}
          {favDetail && favConfig && (
            <NavLink
              to="/market"
              className="flex items-center gap-1 bg-yellow-400/10 hover:bg-yellow-400/20 text-white px-2.5 py-1.5 rounded-full border border-yellow-400/50 hover:border-yellow-400 transition-all flex-shrink-0"
              title={`Favoriete Beurs: ${favConfig.symbol} - Klik om te handelen!`}
              style={{ pointerEvents: "auto" }}
            >
              <span className="text-xs">{favConfig.icon}</span>
              <span className="font-black text-[9px] uppercase tracking-wider text-yellow-300 hidden sm:inline">{favConfig.symbol}:</span>
              <span className="font-mono text-xs font-black text-white">{favDetail.price.toFixed(2)}</span>
              <span className={`text-[9px] font-bold ${favPctChange >= 0 ? "text-green-400" : "text-red-400"}`}>
                {favPctChange >= 0 ? "▲" : "▼"}{Math.abs(favPctChange).toFixed(1)}%
              </span>
            </NavLink>
          )}

          {/* Banaan Teller (Wit pilletje) */}
          <div
            id="banana-balance-nav"
            className="flex items-center gap-2 bg-white text-blue-900 px-4 py-1.5 rounded-full shadow-lg border-2 border-gray-200 transition-transform duration-150 flex-shrink-0"
          >
            <span className="text-2xl">🍌</span>
            <span className="text-xl font-black">{bananaCount}</span>
          </div>
        </div>
      </nav>

      {/* 2. DE MISSIE BALK (Geel "Alert" stijl) */}
      {activeMission && missionStarted && !missionClaimed && (
        <div
          className={`pointer-events-auto container mx-auto px-4 py-2 rounded-2xl shadow-lg border-2 border-yellow-600 flex items-center justify-between gap-4 transition-all duration-500 transform translate-y-[-10px] pt-6 -z-10
                          ${
                            isMissionComplete
                              ? "bg-green-400 cursor-pointer hover:bg-green-300"
                              : "bg-yellow-300"
                          }`}
          onClick={isMissionComplete ? claimMissionReward : undefined}
          style={{ marginTop: "-20px" }} // Schuif hem onder de navbar
        >
          <div className="flex items-center gap-3 min-w-0 pl-2">
            <span className="text-2xl filter drop-shadow-sm">
              {isMissionComplete ? "🎁" : activeMission.icon}
            </span>
            <span
              className={`font-bold text-sm sm:text-base truncate text-blue-900`}
            >
              {isMissionComplete
                ? "MISSIE VOLTOOID! KLIK!"
                : activeMission.desc}
            </span>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {!isMissionComplete ? (
              <div className="relative w-28 sm:w-40 h-5 bg-blue-900/20 rounded-full overflow-hidden border border-blue-900/30">
                <div
                  className="h-full bg-blue-600 transition-all duration-500 ease-out relative"
                  style={{ width: `${progressPercent}%` }}
                ></div>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-blue-900">
                  {missionProgress} / {activeMission.target}
                </span>
              </div>
            ) : (
              <span className="font-black text-white bg-blue-600 px-3 py-1 rounded-lg shadow animate-pulse text-sm">
                CLAIM 50 🍌
              </span>
            )}
          </div>
        </div>
      )}

      {/* 3. Mobiel Menu (Donkerblauw) */}
      {isMenuOpen && (
        <div
          className="pointer-events-auto lg:hidden container mx-auto px-4 py-4 
                        bg-blue-900/95 backdrop-blur-xl rounded-3xl shadow-2xl 
                        border-4 border-yellow-400 
                        flex flex-col gap-2 page animate-fade-in-down"
        >
          <div className="flex items-center justify-center gap-2 text-yellow-200 font-bold mb-2 border-b border-white/10 pb-2">
            {userName && avatarSettings && (
              <div className="w-7 h-7 rounded-full bg-blue-900 border-2 border-yellow-400 overflow-hidden flex items-center justify-center p-0.5 shadow-inner">
                {renderMinionSvg(avatarSettings, 22)}
              </div>
            )}
            <span>{userName ? `Bello, ${userName}!` : "Menu"}</span>
          </div>

          <NavLink
            to="/"
            className={getMobileLinkClass}
            onClick={handleMobileLinkClick}
          >
            Home
          </NavLink>
          <NavLink
            to="/customizer"
            className={getMobileLinkClass}
            onClick={handleMobileLinkClick}
          >
            Creator
          </NavLink>
          <NavLink
            to="/shop"
            className={getMobileLinkClass}
            onClick={handleMobileLinkClick}
          >
            Bazaar
          </NavLink>
          <NavLink
            to="/market"
            className={getMobileLinkClass}
            onClick={handleMobileLinkClick}
          >
            Beurs
          </NavLink>
          <NavLink
            to="/my-sounds"
            className={getMobileLinkClass}
            onClick={handleMobileLinkClick}
          >
            Beatbox
          </NavLink>
          <NavLink
            to="/wacky-lab"
            className={getMobileLinkClass}
            onClick={handleMobileLinkClick}
          >
            Wacky Lab
          </NavLink>
          {isAdmin && (
            <NavLink
              to="/admin"
              className={getMobileLinkClass}
              onClick={handleMobileLinkClick}
            >
              Admin
            </NavLink>
          )}
          <NavLink
            to="/account"
            className={getMobileAccountClass}
            onClick={handleMobileAccountClick}
          >
            Account Instellingen
          </NavLink>
        </div>
      )}
    </header>
  );
}
