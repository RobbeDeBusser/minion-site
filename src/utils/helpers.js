// Functie om een array te shufflen
export function shuffleArray(array) {
  let newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Functie voor de vliegende banaan animatie
export function animateBanana(fromElement) {
  if (!fromElement) return;

  const bananaCounter = document.getElementById("banana-balance-nav");
  if (!bananaCounter) return;

  const startRect = fromElement.getBoundingClientRect();
  const endRect = bananaCounter.getBoundingClientRect();

  const bananaEl = document.createElement("span");
  bananaEl.textContent = "🍌";
  bananaEl.className = "flying-banana";
  document.body.appendChild(bananaEl);

  const startX = startRect.left + startRect.width / 2 - 15;
  const startY = startRect.top + startRect.height / 2 - 15;

  bananaEl.style.left = `${startX}px`;
  bananaEl.style.top = `${startY}px`;
  bananaEl.style.transform = "scale(1)";

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const endX = endRect.left + endRect.width / 2 - 10;
      const endY = endRect.top + endRect.height / 2 - 10;
      bananaEl.style.left = `${endX}px`;
      bananaEl.style.top = `${endY}px`;
      bananaEl.style.transform = "scale(0.5)";
      bananaEl.style.opacity = "0";
    });
  });

  setTimeout(() => {
    if (document.body.contains(bananaEl)) {
      document.body.removeChild(bananaEl);
    }
    if (bananaCounter) {
      bananaCounter.classList.add(
        "transform",
        "scale-125",
        "transition-transform",
        "duration-150"
      );
      setTimeout(() => {
        bananaCounter.classList.remove("transform", "scale-125");
      }, 150);
    }
  }, 700);
}

// --- AUDIO HELPER (Met Volume) ---
// Accepteert nu een tweede argument: volume (0.0 tot 1.0)
export function playAudio(url, volume = 0.5) {
  try {
    if (!url) {
      // Fallback piepje (volume toegepast op gain)
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = "sine";
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.1);

        // Gebruik het meegegeven volume
        gain.gain.setValueAtTime(volume * 0.6, ctx.currentTime); // x0.6 om piep niet te hard te maken
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
      return;
    }

    const audio = new Audio(url);
    audio.volume = volume; // Zet volume
    audio.play().catch((e) => {
      console.log("Audio autoplay blocked:", e);
    });
  } catch (e) {
    console.error("Audio fout:", e);
  }
}
