import React, { useState, useEffect, useRef, useCallback } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { defaultShopItems } from "./data/dictionary";
import { missions } from "./data/missions";
import { playAudio } from "./utils/helpers";
import { playDefaultSound } from "./services/audio";
import { auth, signInWithGoogle, signOutUser, onAuthStateChanged, getRedirectResult } from "./services/firebase";
import { saveUserData, loadUserData, mergeLocalAndCloud } from "./services/cloudSave";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Translator from "./components/Translator";
import Dictionary from "./components/Dictionary";
import Quiz from "./components/Quiz";
import Shop from "./components/Shop";
import Market from "./components/Market";
import Customizer from "./components/Customizer";
import MySounds from "./components/MySounds";
import Account from "./components/Account";
import Admin from "./components/Admin";
import WackyLab from "./components/WackyLab";
import QuickSoundMenu from "./components/QuickSoundMenu";
import Footer from "./components/Footer";

const STOCK_DETAILS = {
  BAN: { name: "Banana Corp", symbol: "BAN", icon: "🍌", volatility: 0.08, startPrice: 15.0 },
  GRU: { name: "Gru Industries", symbol: "GRU", icon: "🚀", volatility: 0.18, startPrice: 120.0 },
  PPO: { name: "Papoy Apparel", symbol: "PPO", icon: "👗", volatility: 0.04, startPrice: 8.0 },
  FART: { name: "Fart Tech", symbol: "FART", icon: "💨", volatility: 0.12, startPrice: 45.0 }
};

const APP_DATA_KEY = "minionAppData";
const TOTAL_QUIZ_QUESTIONS = 15;
const QUIZ_BONUS = 20;
const MISSION_REWARD = 50;
const COOLDOWN_TIME = 24 * 60 * 60 * 1000;

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const cloudSaveTimer = useRef(null);
  const [bananaCount, setBananaCount] = useState(0);
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [shopItems, setShopItems] = useState(defaultShopItems);
  const [quizInProgress, setQuizInProgress] = useState(false);
  const [useApi, setUseApi] = useState(true);

  const [isDiscountActive, setIsDiscountActive] = useState(false);
  const [globalVolume, setGlobalVolume] = useState(0.5);

  const [activeMission, setActiveMission] = useState(null);
  const [missionProgress, setMissionProgress] = useState(0);
  const [missionClaimed, setMissionClaimed] = useState(false);
  const [missionStarted, setMissionStarted] = useState(false);
  const [nextMissionTime, setNextMissionTime] = useState(0);

  // Global stocks state
  const [favoriteStock, setFavoriteStock] = useState(() => {
    return localStorage.getItem("minion_favorite_stock") || "BAN";
  });
  
  const [stocks, setStocks] = useState(() => {
    const saved = localStorage.getItem("minion_stocks_state");
    return saved ? JSON.parse(saved) : {
      BAN: { price: 15.0, history: [15.0], high: 15.0, low: 15.0, volume: 1.2, cap: 15.0 },
      GRU: { price: 120.0, history: [120.0], high: 120.0, low: 120.0, volume: 5.8, cap: 120.0 },
      PPO: { price: 8.0, history: [8.0], high: 8.0, low: 8.0, volume: 0.4, cap: 8.0 },
      FART: { price: 45.0, history: [45.0], high: 45.0, low: 45.0, volume: 2.1, cap: 45.0 }
    };
  });

  // Global stock price fluctuation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((prev) => {
        const next = { ...prev };
        Object.keys(STOCK_DETAILS).forEach((key) => {
          const detail = STOCK_DETAILS[key];
          const pct = (Math.random() - 0.47) * detail.volatility;
          let newPrice = next[key].price * (1 + pct);
          newPrice = Math.max(0.2, Math.round(newPrice * 100) / 100);

          const newHistory = [...next[key].history, newPrice];
          if (newHistory.length > 20) newHistory.shift();

          const simulatedVol = Math.round((next[key].volume + (Math.random() - 0.45) * 0.5) * 100) / 100;
          const simulatedCap = Math.round(newPrice * 1.5 * 100) / 100;

          next[key] = {
            price: newPrice,
            history: newHistory,
            high: Math.max(next[key].high, newPrice),
            low: Math.min(next[key].low, newPrice),
            volume: Math.max(0.1, simulatedVol),
            cap: simulatedCap
          };
        });
        localStorage.setItem("minion_stocks_state", JSON.stringify(next));
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const [avatarSettings, setAvatarSettings] = useState({
    eyes: 2,
    look: "normal",
    hair: "sprout",
    outfit: "overalls",
  });

  const [activeEffects, setActiveEffects] = useState({
    freeze: false,
    purple: false,
    slip: false,
    gold: false,
  });

  const timeoutRefs = useRef({});

  const [isLoaded, setIsLoaded] = useState(false);

  // Helper: apply a saved data object into all state setters
  const applyAppData = useCallback((appData) => {
    setBananaCount(appData.bananaCount || 0);
    setUserName(appData.userName || "");
    setIsAdmin(appData.isAdmin || false);
    setUseApi(appData.useApi !== undefined ? appData.useApi : true);
    setIsDiscountActive(appData.isDiscountActive || false);
    setGlobalVolume(appData.globalVolume !== undefined ? appData.globalVolume : 0.5);
    setFavoriteStock(appData.favoriteStock || "BAN");

    if (appData.shopItems) {
      const defaultSoundIds = defaultShopItems.sounds.map((s) => s.id);
      const customSounds = appData.shopItems.sounds.filter(
        (s) => !defaultSoundIds.includes(s.id)
      );
      const newSounds = [...defaultShopItems.sounds];
      newSounds.forEach((defaultSound) => {
        const savedVersion = appData.shopItems.sounds.find((s) => s.id === defaultSound.id);
        if (savedVersion) {
          defaultSound.purchased = savedVersion.purchased;
          defaultSound.discounted = savedVersion.discounted || false;
          defaultSound.isFavorite = savedVersion.isFavorite || false;
        }
      });
      setShopItems({ sounds: [...newSounds, ...customSounds] });
    } else {
      setShopItems(defaultShopItems);
    }

    if (appData.avatarSettings) setAvatarSettings(appData.avatarSettings);

    const savedNextTime = appData.nextMissionTime || 0;
    const now = Date.now();
    setNextMissionTime(savedNextTime);

    if (now < savedNextTime) {
      setActiveMission(appData.activeMission);
      setMissionProgress(appData.missionProgress || 0);
      setMissionClaimed(true);
      setMissionStarted(true);
    } else {
      if (appData.activeMission && !appData.missionClaimed) {
        setActiveMission(appData.activeMission);
        setMissionProgress(appData.missionProgress || 0);
        setMissionClaimed(false);
        setMissionStarted(appData.missionStarted || false);
      } else {
        const randomMission = missions[Math.floor(Math.random() * missions.length)];
        setActiveMission(randomMission);
        setMissionProgress(0);
        setMissionClaimed(false);
        setMissionStarted(false);
      }
    }
  }, []);

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Meteen de UI updaten — niet wachten op Firestore
      setCurrentUser(user);
      setAuthLoading(false);

      // Cloud sync asynchroon op de achtergrond laden
      if (user) {
        (async () => {
          try {
            const localRaw = localStorage.getItem(APP_DATA_KEY);
            const localData = localRaw ? JSON.parse(localRaw) : null;
            const cloudData = await loadUserData(user.uid);
            const merged = mergeLocalAndCloud(localData, cloudData);
            if (merged) {
              applyAppData(merged);
              localStorage.setItem(APP_DATA_KEY, JSON.stringify(merged));
            }
          } catch (err) {
            console.warn("[Auth] Cloud sync mislukt:", err);
          }
        })();
      }
    });
    return () => unsubscribe();
  }, [applyAppData]);


  // Verwerk het redirect-resultaat nadat de gebruiker terugkomt van Google
  useEffect(() => {
    getRedirectResult(auth).catch(() => {
      // Stille fout — onAuthStateChanged handelt het inloggen af
    });
  }, []);

  useEffect(() => {
    const data = localStorage.getItem(APP_DATA_KEY);
    if (data) {
      applyAppData(JSON.parse(data));
    } else {
      setActiveMission(missions[0]);
    }
    setIsLoaded(true);
  }, [applyAppData]);


  useEffect(() => {
    if (!isLoaded) return;

    const appData = {
      bananaCount,
      userName,
      isAdmin,
      shopItems,
      useApi,
      isDiscountActive,
      globalVolume,
      activeMission,
      missionProgress,
      missionClaimed,
      missionStarted,
      nextMissionTime,
      missionDate: new Date().toDateString(),
      avatarSettings,
      favoriteStock,
    };
    localStorage.setItem(APP_DATA_KEY, JSON.stringify(appData));

    // Debounced cloud save: wait 2s after last change before writing to Firestore
    if (currentUser) {
      if (cloudSaveTimer.current) clearTimeout(cloudSaveTimer.current);
      cloudSaveTimer.current = setTimeout(() => {
        saveUserData(currentUser.uid, appData);
      }, 2000);
    }
  }, [
    bananaCount,
    userName,
    isAdmin,
    shopItems,
    useApi,
    activeMission,
    missionProgress,
    missionClaimed,
    missionStarted,
    nextMissionTime,
    isLoaded,
    isDiscountActive,
    globalVolume,
    avatarSettings,
    favoriteStock,
    currentUser,
  ]);

  const addBananas = (amount) => setBananaCount((prev) => prev + amount);

  const triggerPrankEffect = (effectId) => {
    let key = effectId;
    if (effectId === "freeze_ray") key = "freeze";
    else if (effectId === "purple_serum") key = "purple";
    else if (effectId === "banana_peel") key = "slip";
    else if (effectId === "golden_skin") key = "gold";

    if (timeoutRefs.current[key]) {
      clearTimeout(timeoutRefs.current[key]);
    }

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch (e) {}

    setActiveEffects((prev) => ({ ...prev, [key]: true }));

    let duration = 8000;
    if (effectId === "purple_serum") duration = 15000;
    else if (effectId === "banana_peel") duration = 12000;
    else if (effectId === "golden_skin") duration = 25000;

    timeoutRefs.current[key] = setTimeout(() => {
      setActiveEffects((prev) => ({ ...prev, [key]: false }));
      // Direct DOM safety net to guarantee class removal
      if (key === "purple") {
        document.body.classList.remove("purple-mutant-active");
      } else if (key === "slip") {
        document.body.classList.remove("banana-peel-active");
      } else if (key === "gold") {
        document.body.classList.remove("gold-skin-active");
      }
      delete timeoutRefs.current[key];
    }, duration);
  };

  useEffect(() => {
    if (activeEffects.purple) {
      document.body.classList.add("purple-mutant-active");
    } else {
      document.body.classList.remove("purple-mutant-active");
    }
    return () => document.body.classList.remove("purple-mutant-active");
  }, [activeEffects.purple]);

  useEffect(() => {
    if (activeEffects.slip) {
      document.body.classList.add("banana-peel-active");
    } else {
      document.body.classList.remove("banana-peel-active");
    }
    return () => document.body.classList.remove("banana-peel-active");
  }, [activeEffects.slip]);

  useEffect(() => {
    if (activeEffects.gold) {
      document.body.classList.add("gold-skin-active");
    } else {
      document.body.classList.remove("gold-skin-active");
    }
    return () => document.body.classList.remove("gold-skin-active");
  }, [activeEffects.gold]);

  useEffect(() => {
    if (!activeEffects.gold) return;

    const spawnGoldSparkle = (x, y) => {
      const el = document.createElement("div");
      el.textContent = "✨";
      el.className = "fixed pointer-events-none z-[99999] text-xl select-none gold-sparkle";
      el.style.left = `${x - 10}px`;
      el.style.top = `${y - 10}px`;
      el.style.transition = "all 0.6s ease-out";
      el.style.transform = "scale(0.5)";
      el.style.opacity = "1";
      document.body.appendChild(el);

      requestAnimationFrame(() => {
        el.style.transform = `scale(1.5) translate(${(Math.random() - 0.5) * 40}px, -30px) rotate(${(Math.random() - 0.5) * 360}deg)`;
        el.style.opacity = "0";
      });

      setTimeout(() => {
        if (document.body.contains(el)) {
          document.body.removeChild(el);
        }
      }, 600);
    };

    let lastSpawn = 0;
    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastSpawn > 60) {
        spawnGoldSparkle(e.clientX, e.clientY);
        lastSpawn = now;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [activeEffects.gold]);

  const buyShopItem = (itemId) => {
    const item = shopItems.sounds.find((i) => i.id === itemId);
    if (!item || item.purchased) return false;

    const isItemDiscounted = isDiscountActive || item.discounted;
    const finalPrice = isItemDiscounted
      ? Math.floor(item.price / 2)
      : item.price;

    if (bananaCount >= finalPrice) {
      setBananaCount((prev) => prev - finalPrice);
      const newShopItems = {
        ...shopItems,
        sounds: shopItems.sounds.map((s) =>
          s.id === itemId ? { ...s, purchased: true } : s
        ),
      };
      setShopItems(newShopItems);
      return true;
    }
    return false;
  };

  const addNewSound = (name, price, dataUrl, icon) => {
    const newItem = {
      id: `custom_${Date.now()}`,
      name,
      price,
      purchased: false,
      type: "sound",
      dataUrl,
      icon: icon || "🎵",
      discounted: false,
      isFavorite: false,
    };
    setShopItems((prev) => ({ ...prev, sounds: [...prev.sounds, newItem] }));
  };

  const updateSound = (id, updatedData) => {
    setShopItems((prev) => ({
      ...prev,
      sounds: prev.sounds.map((s) =>
        s.id === id ? { ...s, ...updatedData } : s
      ),
    }));
  };

  const deleteSound = (id) => {
    setShopItems((prev) => ({
      ...prev,
      sounds: prev.sounds.filter((s) => s.id !== id),
    }));
  };

  const toggleItemDiscount = (id) => {
    setShopItems((prev) => ({
      ...prev,
      sounds: prev.sounds.map((s) =>
        s.id === id ? { ...s, discounted: !s.discounted } : s
      ),
    }));
  };

  const toggleFavorite = (id) => {
    setShopItems((prev) => {
      const currentFavorites = prev.sounds.filter((s) => s.isFavorite).length;
      const item = prev.sounds.find((s) => s.id === id);

      if (!item.isFavorite && currentFavorites >= 3) {
        alert("Bi-do! Maximaal 3 favorieten in het Quick Menu!");
        return prev;
      }

      return {
        ...prev,
        sounds: prev.sounds.map((s) =>
          s.id === id ? { ...s, isFavorite: !s.isFavorite } : s
        ),
      };
    });
  };

  // --- AANGEPASTE AUDIO FUNCTIE ---
  const playSound = (item) => {
    let url = "";
    
    // Map geluidsbestanden die echt bestaan in public/sounds
    if (item.id === "banana") url = "/sounds/banana_pickup.mp3";
    else if (item.id === "giggle") url = "/sounds/minion_eet1.mp3";
    else if (item.id === "computah") url = "/sounds/sound_effect_1.mp3";
    else if (item.id === "hahaha") url = "/sounds/minion_eet2.mp3";
    else if (item.id === "bottom") url = "/sounds/minion_eet3.mp3";
    else if (item.dataUrl && !item.dataUrl.startsWith("/sounds/minion_")) {
      // Custom geüploade bestanden door de gebruiker
      url = item.dataUrl;
    }

    if (url) {
      playAudio(url, globalVolume);
    } else {
      // Fallback naar de Web Audio synthesizer voor alle ingebouwde Minion-geluiden!
      playDefaultSound(item.id, globalVolume);
    }
  };

  const startMission = () => {
    setMissionStarted(true);
  };

  const updateMissionProgress = (type) => {
    if (Date.now() < nextMissionTime || !missionStarted) return;
    if (!activeMission || missionClaimed) return;

    if (activeMission.type === type) {
      setMissionProgress((prev) => {
        const newProgress = prev + 1;
        return newProgress > activeMission.target
          ? activeMission.target
          : newProgress;
      });
    }
  };

  const claimMissionReward = () => {
    if (
      activeMission &&
      missionProgress >= activeMission.target &&
      !missionClaimed
    ) {
      addBananas(MISSION_REWARD);
      setMissionClaimed(true);
      setNextMissionTime(Date.now() + COOLDOWN_TIME);
      return true;
    }
    return false;
  };

  const donateBananas = (amount) => {
    if (bananaCount >= amount) {
      setBananaCount((prev) => prev - amount);
      return true;
    }
    return false;
  };
  window.handleDonation = donateBananas;

  return (
    <BrowserRouter>
      <Navbar
        bananaCount={bananaCount}
        userName={userName}
        isAdmin={isAdmin}
        quizInProgress={quizInProgress}
        activeMission={activeMission}
        missionProgress={missionProgress}
        missionClaimed={missionClaimed}
        missionStarted={missionStarted}
        claimMissionReward={claimMissionReward}
        isCooldown={Date.now() < nextMissionTime}
        avatarSettings={avatarSettings}
        stocks={stocks}
        favoriteStock={favoriteStock}
        currentUser={currentUser}
      />

      {!quizInProgress && (
        <QuickSoundMenu
          favoriteSounds={shopItems.sounds.filter((s) => s.isFavorite && s.type !== "prank")}
          playSound={playSound}
        />
      )}

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                bananaCount={bananaCount}
                userName={userName}
                activeMission={activeMission}
                missionProgress={missionProgress}
                missionClaimed={missionClaimed}
                missionStarted={missionStarted}
                startMission={startMission}
                claimMissionReward={claimMissionReward}
                missionRewardAmount={MISSION_REWARD}
                nextMissionTime={nextMissionTime}
                globalVolume={globalVolume}
                addBananas={addBananas}
                donateBananas={donateBananas}
              />
            }
          />
          <Route
            path="/translator"
            element={
              <Translator
                useApi={useApi}
                onTranslate={() => updateMissionProgress("translate")}
              />
            }
          />
          <Route
            path="/dictionary"
            element={
              <Dictionary
                onFlashcardFlip={() => updateMissionProgress("flashcard")}
              />
            }
          />
          <Route
            path="/quiz"
            element={
              <Quiz
                useApi={useApi}
                userName={userName}
                addBananas={addBananas}
                setQuizInProgress={setQuizInProgress}
                totalQuestions={TOTAL_QUIZ_QUESTIONS}
                bonus={QUIZ_BONUS}
                onCorrectAnswer={() => updateMissionProgress("quiz")}
              />
            }
          />

          <Route
            path="/shop"
            element={
              <Shop
                shopItems={shopItems.sounds}
                buyShopItem={buyShopItem}
                bananaCount={bananaCount}
                isDiscountActive={isDiscountActive}
                triggerPrankEffect={triggerPrankEffect}
              />
            }
          />

          <Route
            path="/market"
            element={
              <Market
                bananaCount={bananaCount}
                addBananas={addBananas}
                donateBananas={donateBananas}
                globalVolume={globalVolume}
                stocks={stocks}
                setStocks={setStocks}
                favoriteStock={favoriteStock}
                setFavoriteStock={setFavoriteStock}
              />
            }
          />

          <Route
            path="/my-sounds"
            element={
              <MySounds
                shopItems={shopItems.sounds}
                globalVolume={globalVolume}
                setGlobalVolume={setGlobalVolume}
                toggleFavorite={toggleFavorite}
                playSound={playSound}
              />
            }
          />

          <Route
            path="/customizer"
            element={
              <Customizer
                userName={userName}
                avatarSettings={avatarSettings}
                setAvatarSettings={setAvatarSettings}
                globalVolume={globalVolume}
              />
            }
          />

          <Route
            path="/account"
            element={
              <Account
                userName={userName}
                setUserName={setUserName}
                isAdmin={isAdmin}
                setIsAdmin={setIsAdmin}
                useApi={useApi}
                setUseApi={setUseApi}
                onNameGenerated={() => updateMissionProgress("name")}
                avatarSettings={avatarSettings}
                setAvatarSettings={setAvatarSettings}
                currentUser={currentUser}
                signInWithGoogle={signInWithGoogle}
                signOutUser={signOutUser}
              />
            }
          />

          <Route
            path="/admin"
            element={
              isAdmin ? (
                <Admin
                  addNewSound={addNewSound}
                  updateSound={updateSound}
                  deleteSound={deleteSound}
                  toggleItemDiscount={toggleItemDiscount}
                  addBananas={addBananas}
                  shopItems={shopItems.sounds}
                  isDiscountActive={isDiscountActive}
                  setIsDiscountActive={setIsDiscountActive}
                />
              ) : (
                <Navigate to="/account" replace />
              )
            }
          />
          <Route
            path="/wacky-lab"
            element={
              <WackyLab
                bananaCount={bananaCount}
                addBananas={addBananas}
                donateBananas={donateBananas}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      
      {/* Visual Prank Overlays */}
      {activeEffects.freeze && (
        <div className="fixed inset-0 bg-sky-200/40 backdrop-blur-[6px] z-[99999] pointer-events-auto flex flex-col items-center justify-center text-center select-none cursor-not-allowed">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.45)_0%,_transparent_100%)]"></div>
          <span className="text-8xl animate-pulse drop-shadow-lg mb-4">❄️🥶🧊</span>
          <h2 className="text-4xl md:text-5xl font-black text-blue-900 uppercase tracking-widest drop-shadow">
            GEFREEZED!
          </h2>
          <p className="text-blue-700 font-black text-sm mt-2">
            Gru heeft zijn Freeze Ray afgevuurd. Alles is stijf bevroren!
          </p>
        </div>
      )}

      <audio id="custom-audio-player" className="hidden"></audio>
    </BrowserRouter>
  );
}
