import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { minionifyName } from "../utils/localLogic";
import { renderMinionSvg } from "../utils/avatar";

// SHA-256 hash van het admin-wachtwoord (het echte wachtwoord staat NIET in de code)
const ADMIN_HASH = "956a4b488d8f58c4ee970948fe9c95c6fffd8c57ae09a4ad1e03ee7fc7970d7b";

async function sha256(text) {
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function Account({
  userName,
  setUserName,
  isAdmin,
  setIsAdmin,
  useApi,
  setUseApi,
  avatarSettings,
  setAvatarSettings,
  currentUser,
  signInWithGoogle,
  signOutUser,
}) {
  const [nameInput, setNameInput] = useState(userName);
  const [originalName, setOriginalName] = useState(userName);
  const [adminInput, setAdminInput] = useState("");
  const [nameFeedback, setNameFeedback] = useState("");
  const [adminFeedback, setAdminFeedback] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [authError, setAuthError] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    setNameInput(userName);
    setOriginalName(userName);
  }, [userName]);

  const handleSaveName = () => {
    let nameToSave = nameInput;
    if (!useApi && nameInput.length > 20) {
      nameToSave = nameInput.slice(0, 20);
    }
    setUserName(nameToSave);
    setNameInput(nameToSave);
    setOriginalName(nameToSave);
    setNameFeedback("Naam opgeslagen!");
    setTimeout(() => setNameFeedback(""), 3000);
  };

  const handleGenerateName = () => {
    setIsGenerating(true);
    setNameFeedback("Naam genereren...");
    const baseName = originalName.trim() || "Minion";
    const simpleName = minionifyName(baseName);
    setNameInput(simpleName.slice(0, 20));
    setNameFeedback("Minion-naam gegenereerd! Klik 'Opslaan'.");
    setIsGenerating(false);
  };

  const handleAdminUnlock = async () => {
    const inputHash = await sha256(adminInput);
    if (inputHash === ADMIN_HASH) {
      setIsAdmin(true);
      setAdminFeedback("Bello! Admin-modus ontgrendeld!");
      setAdminInput("");
    } else {
      setAdminFeedback("Bi-do... Fout wachtwoord!");
    }
    setTimeout(() => setAdminFeedback(""), 3000);
  };

  const handleNameInputChange = (e) => {
    const newName = e.target.value;
    if (newName.length <= 20) {
      setNameInput(newName);
      setOriginalName(newName);
    }
  };

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    setAuthError("");
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Auth error:", err);
      if (err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request") {
        // gebruiker heeft zelf het venster gesloten, geen foutmelding
      } else {
        setAuthError(`Fout: ${err.code || err.message}`);
      }
    }
    setSigningIn(false);
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <div className="page max-w-2xl mx-auto py-8 px-4 space-y-6">

      {/* Page Title */}
      <div className="text-center mb-8">
        <h1
          className="text-5xl font-extrabold tracking-wider text-blue-800"
          style={{ textShadow: "3px 3px 0px #facc15" }}
        >
          Mijn Account
        </h1>
        <p className="text-gray-500 mt-1 font-medium">Beheer je Minion-profiel en cloud opslag</p>
      </div>

      {/* ══════════════════════════════════════════════ */}
      {/*  GOOGLE LOGIN CARD                             */}
      {/* ══════════════════════════════════════════════ */}
      {currentUser ? (
        /* INGELOGD */
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 border-4 border-yellow-400 rounded-3xl p-6 shadow-2xl text-white">
          {/* Decorative glow */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-center gap-5">
            {/* Profile photo */}
            <div className="relative flex-shrink-0">
              <img
                src={currentUser.photoURL || "https://api.dicebear.com/7.x/bottts/svg?seed=minion"}
                alt="Profielfoto"
                className="w-20 h-20 rounded-2xl border-4 border-yellow-400 shadow-lg object-cover"
              />
              <span className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs font-black px-2 py-0.5 rounded-full border-2 border-white shadow">
                ✓ Ingelogd
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="text-2xl font-black text-yellow-300">
                  {currentUser.displayName || "Minion"}
                </span>
              </div>
              <p className="text-blue-200 text-sm font-medium">{currentUser.email}</p>
              <div className="mt-3 inline-flex items-center gap-2 bg-green-500/20 border border-green-400/40 text-green-300 text-xs font-bold px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                ☁️ Cloud Sync Actief — data opgeslagen op alle apparaten
              </div>
            </div>

            {/* Sign out button */}
            <button
              onClick={handleSignOut}
              className="flex-shrink-0 px-5 py-2.5 bg-white/10 hover:bg-red-500/80 text-white font-bold rounded-xl border border-white/20 hover:border-red-400 transition-all text-sm"
            >
              Uitloggen
            </button>
          </div>
        </div>
      ) : (
        /* NIET INGELOGD */
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border-4 border-blue-800 rounded-3xl p-8 shadow-2xl text-white text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.15),_transparent_70%)] pointer-events-none" />

          <div className="relative">
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-2xl font-black text-white mb-2">Log in om op te slaan</h2>
            <p className="text-blue-200 text-sm font-medium mb-6 max-w-sm mx-auto">
              Koppel je account aan Google zodat je bananen, avatar en aankopen op elk apparaat beschikbaar zijn.
            </p>

            {/* Sync features preview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-7 text-xs">
              {[
                { icon: "🍌", label: "Bananen" },
                { icon: "🧑‍🎤", label: "Minion Avatar" },
                { icon: "🛒", label: "Aankopen" },
                { icon: "🎯", label: "Missies" },
                { icon: "📈", label: "Favorieten" },
                { icon: "🎵", label: "Geluiden" },
              ].map((f) => (
                <div key={f.label} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2 font-bold text-blue-100">
                  <span>{f.icon}</span> {f.label}
                </div>
              ))}
            </div>

            <button
              id="google-signin-btn"
              onClick={handleGoogleSignIn}
              disabled={signingIn}
              className="group inline-flex items-center gap-3 bg-white text-gray-800 font-black text-base px-7 py-3.5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {/* Google "G" logo */}
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {signingIn ? "Bezig..." : "Inloggen met Google"}
            </button>

            {authError && (
              <p className="text-red-400 text-sm mt-3 font-bold">{authError}</p>
            )}

            <p className="text-blue-300/60 text-xs mt-4">
              💾 Lokaal opgeslagen — log in voor cloud sync
            </p>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/*  AI INSTELLINGEN                               */}
      {/* ══════════════════════════════════════════════ */}
      <div className="bg-white border-4 border-blue-900 rounded-3xl p-6 shadow-md">
        <h2 className="text-xl font-black text-blue-900 mb-4 uppercase tracking-wider">⚙️ Instellingen</h2>
        <div className="flex items-center justify-between">
          <label htmlFor="ai-toggle" className="block text-lg font-bold text-gray-700 cursor-pointer">
            Gebruik AI Functies
            <span className="block text-sm text-gray-500 font-normal">(Vertaler, Naam Generator, Spraak)</span>
          </label>
          <button
            id="ai-toggle"
            onClick={() => setUseApi(!useApi)}
            className={`relative inline-flex items-center h-7 rounded-full w-14 transition-colors shadow-inner ${
              useApi ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block w-5 h-5 transform bg-white rounded-full shadow transition-transform ${
                useApi ? "translate-x-8" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════ */}
      {/*  NAAM INVOEREN                                 */}
      {/* ══════════════════════════════════════════════ */}
      <div className="bg-white border-4 border-blue-900 rounded-3xl p-6 shadow-md">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-black text-blue-900 uppercase tracking-wider">✏️ Jouw Naam</h2>
          <span className={`text-sm font-bold ${nameInput.length > 20 ? "text-red-600" : "text-gray-400"}`}>
            {nameInput.length} / 20
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            id="user-name"
            maxLength={20}
            className="flex-grow p-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition font-medium"
            placeholder="Bijv. Kevin"
            value={nameInput}
            onChange={handleNameInputChange}
          />
          <button
            onClick={handleSaveName}
            className="px-5 py-3 bg-blue-700 text-white font-black rounded-xl hover:bg-blue-800 transition"
          >
            Opslaan
          </button>
          <button
            onClick={handleGenerateName}
            disabled={isGenerating}
            className="px-4 py-3 bg-yellow-400 text-gray-900 font-black rounded-xl hover:bg-yellow-500 transition disabled:opacity-50"
            title="Genereer een Minion-naam"
          >
            {isGenerating ? "..." : "✨ AI Naam"}
          </button>
        </div>
        <p className={`text-sm mt-2 h-4 font-semibold ${nameFeedback.includes("Fout") ? "text-red-600" : "text-green-600"}`}>
          {nameFeedback}
        </p>
      </div>

      {/* ══════════════════════════════════════════════ */}
      {/*  BUILD-A-MINION                                */}
      {/* ══════════════════════════════════════════════ */}
      <div className="bg-white border-4 border-blue-900 rounded-3xl p-6 shadow-md flex flex-col sm:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-yellow-50 border-2 border-yellow-200 rounded-2xl flex items-center justify-center shadow-inner">
            {renderMinionSvg(avatarSettings, 65)}
          </div>
          <div>
            <h2 className="text-xl font-black text-blue-900">🎨 Build-a-Minion</h2>
            <p className="text-sm text-gray-500 font-medium">Ontwerp en download je eigen Minion!</p>
          </div>
        </div>
        <Link
          to="/customizer"
          className="px-6 py-3 bg-yellow-400 text-gray-900 font-black rounded-xl shadow-md hover:bg-yellow-500 transition text-center"
        >
          Pas Minion Aan →
        </Link>
      </div>

      {/* ══════════════════════════════════════════════ */}
      {/*  ADMIN TOEGANG                                 */}
      {/* ══════════════════════════════════════════════ */}
      <div className="bg-white border-4 border-blue-900 rounded-3xl p-6 shadow-md">
        <h2 className="text-xl font-black text-blue-900 mb-4 uppercase tracking-wider">🔑 Admin Toegang</h2>
        {isAdmin ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-black text-green-700">Admin-modus is actief!</p>
                <Link to="/admin" className="text-sm text-blue-600 font-bold hover:underline">
                  → Ga naar Admin Paneel
                </Link>
              </div>
            </div>
            <button
              onClick={() => setIsAdmin(false)}
              className="px-4 py-2 bg-red-100 text-red-700 font-black rounded-xl border-2 border-red-300 hover:bg-red-200 hover:border-red-400 transition text-sm"
            >
              🔒 Uitloggen
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="password"
                id="admin-password"
                className="flex-grow p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 transition font-medium"
                placeholder="Typ het wachtwoord..."
                value={adminInput}
                onChange={(e) => setAdminInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdminUnlock()}
              />
              <button
                onClick={handleAdminUnlock}
                className="px-5 py-3 bg-gray-800 text-white font-black rounded-xl hover:bg-gray-900 transition"
              >
                Ontgrendel
              </button>
            </div>
            <p className={`text-sm mt-2 h-4 font-semibold ${adminFeedback.includes("Fout") ? "text-red-600" : "text-green-600"}`}>
              {adminFeedback}
            </p>
          </>
        )}
      </div>

    </div>
  );
}
