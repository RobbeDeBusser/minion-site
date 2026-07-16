import { minionDictionary } from "../data/dictionary";

// --- Lokale "Simpele" Vertaler ---
const simpleDictionary = {};
// Maak een lowercase-versie van het woordenboek voor makkelijk opzoeken
Object.keys(minionDictionary).forEach((key) => {
  simpleDictionary[key.toLowerCase()] = minionDictionary[key];
  // Voeg veelvoorkomende variaties toe
  if (key === "Hello") simpleDictionary["hi"] = minionDictionary[key];
  if (key === "Thank you") simpleDictionary["thanks"] = minionDictionary[key];
});

// Lijsten voor willekeurige "minionificatie"
const prefixes = ["ba", "po", "la", "mu", "no", "ta", "bee-do"];
const suffixes = ["nana", "bobo", "poy", "ka", "tov", "latoo", "bala"];

// Functie om willekeurige woorden te "minionificeren"
function minionifyWord(word) {
  if (word.length <= 3) return word;
  if (Math.random() > 0.5) {
    return prefixes[Math.floor(Math.random() * prefixes.length)] + word;
  } else {
    return word + suffixes[Math.floor(Math.random() * suffixes.length)];
  }
}

export function translateSimple(text) {
  // Split op woorden en interpunctie
  const words = text.toLowerCase().split(/(\b[^\s]+\b)/);
  let result = "";

  words.forEach((word) => {
    if (!word.trim()) {
      result += word; // Behoud spaties
      return;
    }
    // Check voor exacte match (inclusief multi-word)
    // Dit is een simpele check; voor "how are you" werkt dit niet perfect
    // maar "hello" en "thank you" wel.
    let found = simpleDictionary[word];

    if (found) {
      result += found;
    } else {
      // Geen match? Minionify het woord
      result += minionifyWord(word);
    }
  });
  return result;
}

// --- Lokale Naam Generator ("Minionify") ---
export function minionifyName(name) {
  if (!name || name.trim() === "") return "Minion";
  const cleanName = name.split(" ")[0]; // Neem alleen het eerste woord
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  let minionifiedName = cleanName;

  if (Math.random() > 0.5) {
    minionifiedName = randomPrefix + cleanName;
  } else {
    minionifiedName = cleanName + randomSuffix;
  }
  // Zorg voor een hoofdletter en lowercase rest
  return (
    minionifiedName.charAt(0).toUpperCase() +
    minionifiedName.slice(1).toLowerCase()
  );
}
// --- Lokale Browser Spraak (TTS) ---
export function speakBrowserTts(text) {
  if ("speechSynthesis" in window) {
    // Stop eventuele vorige spraak
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Probeer een Engelse stem te vinden, anders pakt het de standaard
    const voices = window.speechSynthesis.getVoices();
    const ukVoice = voices.find(
      (v) => v.lang === "en-GB" || v.lang === "en-US"
    );

    if (ukVoice) {
      utterance.voice = ukVoice;
    }
    utterance.pitch = 1.2; // Iets hoger
    utterance.rate = 1.0; // Normale snelheid

    window.speechSynthesis.speak(utterance);
  } else {
    console.error("Browser Speech Synthesis wordt niet ondersteund.");
  }
}

// Zorg ervoor dat stemmen geladen zijn (Safari/Chrome fix)
if (
  "speechSynthesis" in window &&
  window.speechSynthesis.getVoices().length === 0
) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}
