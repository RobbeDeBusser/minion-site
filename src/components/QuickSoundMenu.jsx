import React, { useState } from "react";

export default function QuickSoundMenu({ favoriteSounds, playSound }) {
  const [isOpen, setIsOpen] = useState(false);

  if (favoriteSounds.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
      {/* DE HOOFDKNOP (Toggle) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full shadow-[0_4px_0_rgb(0,0,0,0.3)] border-4 border-yellow-400 flex items-center justify-center transition-all duration-200 active:translate-y-1 active:shadow-none text-white
                    ${
                      isOpen
                        ? "bg-red-500 rotate-90"
                        : "bg-blue-600 hover:bg-blue-500"
                    }`}
        aria-label="Open Quick Menu"
      >
        {isOpen ? (
          // WIT KRUIS ICOON (SVG)
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={4}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          // AANGEPAST: EEN SIMPELE, DIKKE ENKELE NOOT (SVG)
          // Deze is veel beter zichtbaar en 'breekt' niet
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8"
          >
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        )}
      </button>

      {/* HET MENU (Uitgeklapt) */}
      {isOpen && (
        <div className="bg-white/90 backdrop-blur-md border-4 border-blue-400 p-3 rounded-2xl shadow-2xl flex flex-col-reverse gap-2 animate-fade-in-up items-end">
          {favoriteSounds.map((item) => {
            // Bepaal icoon
            let icon = item.icon || "🎵";
            // Fallback voor oude items zonder icon property
            if (!item.icon) {
              if (item.id === "fart") icon = "💨";
              else if (item.id === "giggle") icon = "😆";
              else if (item.id === "banana") icon = "🍌";
              else if (item.id === "beedo") icon = "🚨";
            }

            // Is het een emoji of een fallback noot?
            const isEmoji = icon !== "🎵";

            return (
              <button
                key={item.id}
                onClick={() => playSound(item)}
                className="group flex items-center gap-3 p-2 pl-4 rounded-xl bg-blue-50 hover:bg-yellow-300 border-2 border-blue-200 hover:border-yellow-500 transition-all shadow-sm active:scale-95"
              >
                <span className="font-bold text-blue-900 text-sm truncate max-w-[100px]">
                  {item.name}
                </span>

                {/* ICOON CONTAINER */}
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-2xl shadow-inner border border-blue-600 text-white">
                  {isEmoji ? (
                    <span>{icon}</span>
                  ) : (
                    // DEZELFDE DUIDELIJKE NOOT IN HET LIJSTJE
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}

          <div className="text-center text-[10px] font-black text-blue-300 uppercase tracking-widest border-b-2 border-blue-100 pb-1 mb-1 w-full">
            Quick Sounds
          </div>
        </div>
      )}
    </div>
  );
}
