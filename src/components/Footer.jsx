import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative bg-blue-900 text-white mt-auto border-t-[12px] border-yellow-400">
      {/* --- Decoratieve Schroeven op de rand --- */}
      <div className="absolute -top-2 left-4 w-4 h-4 bg-gray-300 rounded-full border-2 border-gray-500 shadow-sm z-10"></div>
      <div className="absolute -top-2 right-4 w-4 h-4 bg-gray-300 rounded-full border-2 border-gray-500 shadow-sm z-10"></div>
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-300 rounded-full border-2 border-gray-500 shadow-sm z-10"></div>

      <div className="container mx-auto px-6 py-10">
        {/* AANGEPAST: Nu 2 kolommen (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* KOLOM 1: Branding (Links uitgelijnd op desktop) */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-4xl filter drop-shadow-lg">🍌</span>
              <h3
                className="text-2xl font-black tracking-widest text-yellow-400 uppercase"
                style={{ textShadow: "2px 2px 0 #000" }}
              >
                Minion App
              </h3>
            </div>
            <p className="text-blue-200 text-sm max-w-xs mx-auto md:mx-0">
              Een onofficieel fan-project. Powered by Banana Corp™.
            </p>
          </div>

          {/* KOLOM 2: Snelle Links (Rechts uitgelijnd op desktop) */}
          <div className="flex flex-col items-center md:items-end">
            <div className="text-center md:text-right">
              <h4 className="text-lg font-bold text-yellow-300 mb-4 uppercase tracking-wide border-b-2 border-blue-800 pb-2 inline-block">
                Snelle Toegang
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-blue-100 hover:text-yellow-400 hover:translate-x-[-4px] transition-all inline-block"
                  >
                    🏠 Home Base
                  </Link>
                </li>
                <li>
                  <Link
                    to="/translator"
                    className="text-blue-100 hover:text-yellow-400 hover:translate-x-[-4px] transition-all inline-block"
                  >
                    🗣️ Vertaler 3000
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop"
                    className="text-blue-100 hover:text-yellow-400 hover:translate-x-[-4px] transition-all inline-block"
                  >
                    🛒 Bananen Bazaar
                  </Link>
                </li>
                <li>
                  <Link
                    to="/quiz"
                    className="text-blue-100 hover:text-yellow-400 hover:translate-x-[-4px] transition-all inline-block"
                  >
                    🧠 Quiz Arena
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* DISCLAIMER */}
        <div className="mt-8 mb-2 bg-blue-950/60 border border-blue-700 rounded-xl px-5 py-3 text-center">
          <p className="text-blue-300 text-xs leading-relaxed">
            ⚠️ <strong className="text-yellow-300">Fan-project — Niet officieel.</strong>{" "}
            Minions™ en alle bijbehorende karakters, namen en logo's zijn eigendom van{" "}
            <strong className="text-white">Universal Pictures / Illumination Entertainment</strong>.{" "}
            Dit project heeft geen commercieel doel en is niet gelieerd aan of goedgekeurd door Universal of Illumination.
          </p>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-4 pt-4 border-t-2 border-blue-800 text-center md:flex md:justify-between md:items-center">
          <p className="text-blue-400 text-sm font-medium">
            &copy; {new Date().getFullYear()} Fan-project — Geen officiële Minions-site.
          </p>
          <p className="text-blue-300 text-sm mt-2 md:mt-0 font-bold">
            Gemaakt met <span className="animate-pulse inline-block">🍌</span>{" "}
            door{" "}
            <span className="text-yellow-400">
              Floris, Maxim &amp; Robbe
            </span>
          </p>
        </div>
      </div>

      {/* Decoratieve achtergrond patroon (subtiel) */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>
    </footer>
  );
}
