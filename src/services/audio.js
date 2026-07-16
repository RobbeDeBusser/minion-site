// src/services/audio.js

// Maak één AudioContext aan voor de hele app
let audioContext;
try {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
} catch (e) {
  console.warn("Web Audio API wordt niet ondersteund in deze browser.");
}

// Functie om de standaard geluidseffecten af te spelen
// AANGEPAST: Nu met volume parameter!
export function playDefaultSound(id, volume = 0.5) {
  if (!audioContext) return;

  // Hervat context als die op 'suspended' staat (browser policy)
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  const time = audioContext.currentTime;
  // Beperk volume voor de zekerheid
  const safeVol = Math.max(0, Math.min(1, volume));

  switch (id) {
    case "fart": {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(100, time);
      oscillator.frequency.exponentialRampToValueAtTime(50, time + 0.3);

      gain.gain.setValueAtTime(safeVol, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);

      oscillator.start(time);
      oscillator.stop(time + 0.3);
      break;
    }
    case "giggle": {
      for (let i = 0; i < 5; i++) {
        const o = audioContext.createOscillator();
        const g = audioContext.createGain();
        o.connect(g);
        g.connect(audioContext.destination);
        o.type = "sine";
        o.frequency.setValueAtTime(800 + i * 100, time + i * 0.08);

        g.gain.setValueAtTime(safeVol * 0.5, time + i * 0.08);
        g.gain.exponentialRampToValueAtTime(0.01, time + i * 0.08 + 0.05);

        o.start(time + i * 0.08);
        o.stop(time + i * 0.08 + 0.05);
      }
      break;
    }
    case "banana": {
      // Dit gebruiken we ook als "Donatie / Power Up" geluid
      const o1 = audioContext.createOscillator();
      const g1 = audioContext.createGain();
      o1.connect(g1);
      g1.connect(audioContext.destination);
      o1.type = "square";
      o1.frequency.setValueAtTime(300, time);
      o1.frequency.linearRampToValueAtTime(500, time + 0.1);

      g1.gain.setValueAtTime(safeVol * 0.4, time);
      g1.gain.linearRampToValueAtTime(0, time + 0.15);

      o1.start(time);
      o1.stop(time + 0.15);

      const o2 = audioContext.createOscillator();
      const g2 = audioContext.createGain();
      o2.connect(g2);
      g2.connect(audioContext.destination);
      o2.type = "square";
      o2.frequency.setValueAtTime(400, time + 0.15);
      o2.frequency.linearRampToValueAtTime(600, time + 0.3);

      g2.gain.setValueAtTime(safeVol * 0.4, time + 0.15);
      g2.gain.linearRampToValueAtTime(0, time + 0.35);

      o2.start(time + 0.15);
      o2.stop(time + 0.35);
      break;
    }
    case "beedo": {
      const b1 = audioContext.createOscillator();
      const bg1 = audioContext.createGain();
      b1.connect(bg1);
      bg1.connect(audioContext.destination);
      b1.type = "sawtooth";
      b1.frequency.setValueAtTime(800, time);
      bg1.gain.setValueAtTime(safeVol * 0.5, time);
      b1.start(time);
      b1.stop(time + 0.15);

      const b2 = audioContext.createOscillator();
      const bg2 = audioContext.createGain();
      b2.connect(bg2);
      bg2.connect(audioContext.destination);
      b2.type = "sawtooth";
      b2.frequency.setValueAtTime(700, time + 0.2);
      bg2.gain.setValueAtTime(safeVol * 0.5, time + 0.2);
      b2.start(time + 0.2);
      b2.stop(time + 0.35);
      break;
    }
    default: {
      // Fallback piep
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(440, time);
      gain.gain.setValueAtTime(safeVol * 0.2, time);
      oscillator.start(time);
      oscillator.stop(time + 0.2);
    }
  }
}
