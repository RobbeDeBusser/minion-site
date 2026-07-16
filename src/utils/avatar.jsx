import React from "react";

export function renderMinionSvg(settings, size = 100) {
  const { 
    eyes = 2, 
    look = "normal", 
    hair = "sprout", 
    outfit = "overalls", 
    accessory = "none", 
    mouth = "smile", 
    skin = "yellow" 
  } = settings || {};

  // Kleurdefinities voor de body
  let bodyFill = "#facc15";
  let bodyStroke = "#ca8a04";
  if (skin === "purple") {
    bodyFill = "#a78bfa";
    bodyStroke = "#6d28d9";
  } else if (skin === "gold") {
    bodyFill = "url(#gold-grad)";
    bodyStroke = "#b45309";
  }

  // Dynamische Mutant Tandjes (uitgelijnd op de mondtype)
  let fangs = null;
  if (skin === "purple") {
    if (mouth === "smile") {
      fangs = (
        <g fill="#ffffff">
          <polygon points="44,51.5 46,55.5 48,51.5" />
          <polygon points="52,51.5 54,55.5 56,51.5" />
        </g>
      );
    } else if (mouth === "grin") {
      fangs = (
        <g fill="#ffffff">
          <polygon points="43,49.5 45,54.5 47,49.5" />
          <polygon points="53,49.5 55,54.5 57,49.5" />
        </g>
      );
    } else if (mouth === "tongue") {
      fangs = (
        <g fill="#ffffff">
          <polygon points="44,50.5 46,54.5 48,50.5" />
          <polygon points="52,50.5 54,54.5 56,50.5" />
        </g>
      );
    } else if (mouth === "sad") {
      fangs = (
        <g fill="#ffffff">
          <polygon points="44,52.5 46,55.5 48,52.5" />
          <polygon points="52,52.5 54,55.5 56,52.5" />
        </g>
      );
    } else if (mouth === "surprised") {
      fangs = (
        <g fill="#ffffff">
          <polygon points="48,49.5 50,52.5 52,49.5" />
        </g>
      );
    }
  }

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="select-none inline-block">
      <defs>
        {/* Luxe Gouden Gradiënt */}
        <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="30%" stopColor="#f59e0b" />
          <stop offset="70%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>

        {/* 3D Cilindrische Schaduw Gradiënt */}
        <linearGradient id="cylindrical-shadow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.25" />
          <stop offset="20%" stopColor="#000000" stopOpacity="0.0" />
          <stop offset="80%" stopColor="#000000" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.30" />
        </linearGradient>

        {/* Body Clip Path om kleding 3D te laten aansluiten op de capsule */}
        <clipPath id="body-clip">
          <rect x="25" y="15" width="50" height="70" rx="25" />
        </clipPath>
      </defs>

      {/* Gele body (capsule) */}
      <rect x="25" y="15" width="50" height="70" rx="25" fill={bodyFill} stroke={bodyStroke} strokeWidth="2.5" />

      {/* Haar */}
      {hair === "sprout" && (
        <g stroke="#18181b" strokeWidth="1.5" strokeLinecap="round" fill="none">
          <path d="M50,15 Q50,6 54,6" />
          <path d="M50,15 Q46,8 43,8" />
          <path d="M50,15 Q53,9 58,10" />
        </g>
      )}
      {hair === "shaved" && (
        <g stroke="#18181b" strokeWidth="1" strokeLinecap="round">
          <line x1="45" y1="14" x2="45" y2="10" />
          <line x1="50" y1="13" x2="50" y2="9" />
          <line x1="55" y1="14" x2="55" y2="10" />
        </g>
      )}
      {hair === "combed" && (
        <g stroke="#18181b" strokeWidth="1.2" strokeLinecap="round" fill="none">
          <path d="M35,18 Q45,11 55,15" />
          <path d="M38,19 Q48,12 58,16" />
        </g>
      )}

      {/* Goggle Band */}
      <rect x="24" y="32" width="52" height="6" fill="#18181b" rx="1" />

      {/* Kleding (EERST RENDEREN ZODAT MOND ALTIJD OP DE KLEDING VALT!) */}
      <g clipPath="url(#body-clip)">
        {outfit === "overalls" && (
          <g>
            <rect x="25" y="66" width="50" height="22" fill="#1d4ed8" />
            <rect x="34" y="59" width="32" height="8" fill="#1d4ed8" />
            {/* Straps */}
            <line x1="25" y1="56" x2="35.5" y2="61" stroke="#1d4ed8" strokeWidth="5" strokeLinecap="round" />
            <line x1="75" y1="56" x2="64.5" y2="61" stroke="#1d4ed8" strokeWidth="5" strokeLinecap="round" />
            {/* Pocket */}
            <rect x="44" y="66" width="12" height="9" fill="#1e3a8a" rx="1.5" />
          </g>
        )}

        {outfit === "maid" && (
          <g>
            <rect x="24" y="58" width="52" height="30" fill="#18181b" />
            {/* Apron */}
            <rect x="34" y="63" width="32" height="25" fill="#ffffff" rx="1.5" />
            {/* Apron Straps */}
            <path d="M26,58 C34,55 66,55 74,58" stroke="#ffffff" strokeWidth="3" fill="none" />
          </g>
        )}

        {outfit === "tourist" && (
          <g>
            <rect x="24" y="58" width="52" height="30" fill="#e11d48" />
            {/* Flowers */}
            <circle cx="33" cy="64" r="2.5" fill="#ffffff" />
            <circle cx="42" cy="76" r="2.5" fill="#ffffff" />
            <circle cx="58" cy="66" r="2.5" fill="#ffffff" />
            <circle cx="67" cy="78" r="2.5" fill="#ffffff" />
            {/* Flower centers */}
            <circle cx="33" cy="64" r="0.9" fill="#facc15" />
            <circle cx="42" cy="76" r="0.9" fill="#facc15" />
            <circle cx="58" cy="66" r="0.9" fill="#facc15" />
            <circle cx="67" cy="78" r="0.9" fill="#facc15" />
          </g>
        )}

        {outfit === "cyborg" && (
          <g>
            <rect x="24" y="58" width="52" height="30" fill="#4b5563" stroke="#1f2937" strokeWidth="1.5" />
            {/* Metal plating lines */}
            <line x1="50" y1="58" x2="50" y2="88" stroke="#1f2937" strokeWidth="1.5" />
            <line x1="24" y1="73" x2="76" y2="73" stroke="#1f2937" strokeWidth="1.5" />
            {/* Rivets */}
            <circle cx="29" cy="63" r="1.2" fill="#1f2937" />
            <circle cx="71" cy="63" r="1.2" fill="#1f2937" />
            <circle cx="29" cy="83" r="1.2" fill="#1f2937" />
            <circle cx="71" cy="83" r="1.2" fill="#1f2937" />
            {/* Glowing Red Button */}
            <circle cx="50" cy="73" r="5" fill="#ef4444" className="animate-pulse" />
            <circle cx="50" cy="73" r="1.8" fill="#fecaca" />
          </g>
        )}
      </g>

      {/* 3D Shading Overlay (Over de kleding heen) */}
      <rect x="25" y="15" width="50" height="70" rx="25" fill="url(#cylindrical-shadow)" stroke="none" pointerEvents="none" />

      {/* Ogen */}
      {eyes === 1 ? (
        <g>
          {/* Goggle rand */}
          <circle cx="50" cy="35" r="11" fill="#9ca3af" stroke="#4b5563" strokeWidth="1.5" />
          <circle cx="50" cy="35" r="7.5" fill="#fff" />
          
          {/* Pupil */}
          {look === "normal" && (
            <g>
              <circle cx="50" cy="35" r="3.2" fill={skin === "purple" ? "#ef4444" : "#78350f"} />
              <circle cx="50" cy="35" r="1.5" fill="#000" />
            </g>
          )}
          {look === "happy" && (
            <path d="M47.5,36 Q50,33 52.5,36" stroke={skin === "purple" ? "#ef4444" : "#78350f"} strokeWidth="2" fill="none" strokeLinecap="round" />
          )}
          {look === "crazy" && (
            <g>
              <circle cx="48.5" cy="33.5" r="2.8" fill="#ef4444" />
              <circle cx="48.5" cy="33.5" r="1.2" fill="#000" />
            </g>
          )}
          {look === "sleepy" && (
            <g>
              <circle cx="50" cy="36.5" r="2" fill={skin === "purple" ? "#ef4444" : "#78350f"} />
              {/* Halfronde oogleden voor een echt slaperige blik */}
              <path d="M39,35 A11,11 0 0,1 61,35 Z" fill={skin === "purple" ? "#a78bfa" : "#facc15"} stroke={skin === "purple" ? "#6d28d9" : "#ca8a04"} strokeWidth="1.5" />
            </g>
          )}
        </g>
      ) : (
        <g>
          {/* Oog Links */}
          <circle cx="41.5" cy="35" r="8.5" fill="#9ca3af" stroke="#4b5563" strokeWidth="1.5" />
          <circle cx="41.5" cy="35" r="5.8" fill="#fff" />

          {/* Oog Rechts */}
          <circle cx="58.5" cy="35" r="8.5" fill="#9ca3af" stroke="#4b5563" strokeWidth="1.5" />
          <circle cx="58.5" cy="35" r="5.8" fill="#fff" />

          {/* Pupils */}
          {look === "normal" && (
            <g>
              <circle cx="41.5" cy="35" r="2.5" fill={skin === "purple" ? "#ef4444" : "#78350f"} />
              <circle cx="41.5" cy="35" r="1.2" fill="#000" />
              <circle cx="58.5" cy="35" r="2.5" fill={skin === "purple" ? "#ef4444" : "#78350f"} />
              <circle cx="58.5" cy="35" r="1.2" fill="#000" />
            </g>
          )}
          {look === "happy" && (
            <g>
              <path d="M39.5,36 Q41.5,34 43.5,36" stroke={skin === "purple" ? "#ef4444" : "#78350f"} strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d="M56.5,36 Q58.5,34 60.5,36" stroke={skin === "purple" ? "#ef4444" : "#78350f"} strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </g>
          )}
          {look === "crazy" && (
            <g>
              <circle cx="40" cy="33.5" r="2" fill="#ef4444" />
              <circle cx="40" cy="33.5" r="0.8" fill="#000" />
              <circle cx="57" cy="36.5" r="2" fill="#ef4444" />
              <circle cx="57" cy="36.5" r="0.8" fill="#000" />
            </g>
          )}
          {look === "sleepy" && (
            <g>
              <circle cx="41.5" cy="37" r="1.5" fill={skin === "purple" ? "#ef4444" : "#78350f"} />
              <circle cx="58.5" cy="37" r="1.5" fill={skin === "purple" ? "#ef4444" : "#78350f"} />
              {/* Halfronde oogleden links en rechts */}
              <path d="M33,35 A8.5,8.5 0 0,1 50,35 Z" fill={skin === "purple" ? "#a78bfa" : "#facc15"} stroke={skin === "purple" ? "#6d28d9" : "#ca8a04"} strokeWidth="1.2" />
              <path d="M50,35 A8.5,8.5 0 0,1 67,35 Z" fill={skin === "purple" ? "#a78bfa" : "#facc15"} stroke={skin === "purple" ? "#6d28d9" : "#ca8a04"} strokeWidth="1.2" />
            </g>
          )}
        </g>
      )}

      {/* Monden & Tandjes (Gefixeerd op de voorgrond!) */}
      {mouth === "smile" && (
        <path d="M43,51 Q50,56 57,51" stroke="#18181b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}
      {mouth === "grin" && (
        <path d="M41,49 Q50,57 59,49 Z" fill="#ffffff" stroke="#18181b" strokeWidth="2" strokeLinecap="round" />
      )}
      {mouth === "tongue" && (
        <g>
          <path d="M43,50 Q50,56 57,50" stroke="#18181b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M46.5,51.5 Q50,59 53.5,51.5 Z" fill="#ef4444" stroke="#18181b" strokeWidth="1.5" />
        </g>
      )}
      {mouth === "sad" && (
        <path d="M43,55 Q50,50 57,55" stroke="#18181b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}
      {mouth === "surprised" && (
        <circle cx="50" cy="52.5" r="3.5" stroke="#18181b" strokeWidth="2.5" fill="none" />
      )}

      {/* Exclusieve Mutanten Tanden */}
      {fangs}

      {/* Accessoires (35% groter geschaald via matrix transform) */}
      {accessory === "banana" && (
        <g transform="translate(76, 65) scale(1.35) translate(-76, -65)">
          <path d="M72,60 Q82,60 85,72 Q75,70 72,60 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
          <path d="M72,60 Q70,57 68,58" stroke="#854d0e" strokeWidth="2" fill="none" />
        </g>
      )}
      {accessory === "teddybear" && (
        <g transform="translate(71, 65) scale(1.4) translate(-71, -65)">
          <g transform="translate(68, 62)">
            <circle cx="5" cy="5" r="5" fill="#78350f" stroke="#451a03" strokeWidth="0.8" />
            <circle cx="1.5" cy="1" r="1.8" fill="#78350f" />
            <circle cx="8.5" cy="1" r="1.8" fill="#78350f" />
            <circle cx="5" cy="5" r="1.8" fill="#fbcfe8" />
            <circle cx="4" cy="4" r="0.6" fill="#000" />
            <circle cx="6" cy="4" r="0.6" fill="#000" />
          </g>
        </g>
      )}
      {accessory === "raygun" && (
        <g transform="translate(71, 64) scale(1.35) translate(-71, -64)">
          <g transform="translate(67, 61) rotate(10)">
            <rect x="0" y="2" width="13" height="4.5" fill="#64748b" rx="1" stroke="#334155" strokeWidth="0.8" />
            <rect x="9" y="0" width="3.5" height="8.5" fill="#ef4444" rx="1" />
            <line x1="2" y1="4.5" x2="2" y2="10.5" stroke="#475569" strokeWidth="2" />
          </g>
        </g>
      )}
    </svg>
  );
}

// Helper om SVG te downloaden
export function downloadMinionSvg(settings, userName = "Minion") {
  const { 
    eyes = 2, 
    look = "normal", 
    hair = "sprout", 
    outfit = "overalls", 
    accessory = "none", 
    mouth = "smile", 
    skin = "yellow" 
  } = settings || {};

  const hairMarkup = {
    sprout: `<g stroke="#18181b" stroke-width="1.5" stroke-linecap="round" fill="none"><path d="M50,15 Q50,6 54,6" /><path d="M50,15 Q46,8 43,8" /><path d="M50,15 Q53,9 58,10" /></g>`,
    shaved: `<g stroke="#18181b" stroke-width="1" stroke-linecap="round"><line x1="45" y1="14" x2="45" y2="10" /><line x1="50" y1="13" x2="50" y2="9" /><line x1="55" y1="14" x2="55" y2="10" /></g>`,
    combed: `<g stroke="#18181b" stroke-width="1.2" stroke-linecap="round" fill="none"><path d="M35,18 Q45,11 55,15" /><path d="M38,19 Q48,12 58,16" /></g>`,
    bald: ""
  }[hair];

  const eyesMarkup = eyes === 1 ? `
    <circle cx="50" cy="35" r="11" fill="#9ca3af" stroke="#4b5563" stroke-width="1.5" />
    <circle cx="50" cy="35" r="7.5" fill="#fff" />
    ${{
      normal: `<circle cx="50" cy="35" r="3.2" fill="${skin === "purple" ? "#ef4444" : "#78350f"}" /><circle cx="50" cy="35" r="1.5" fill="#000" />`,
      happy: `<path d="M47.5,36 Q50,33 52.5,36" stroke="${skin === "purple" ? "#ef4444" : "#78350f"}" stroke-width="2" fill="none" stroke-linecap="round" />`,
      crazy: `<circle cx="48.5" cy="33.5" r="2.8" fill="#ef4444" /><circle cx="48.5" cy="33.5" r="1.2" fill="#000" />`,
      sleepy: `<circle cx="50" cy="36.5" r="2" fill="${skin === "purple" ? "#ef4444" : "#78350f"}" /><path d="M39,35 A11,11 0 0,1 61,35 Z" fill="${skin === "purple" ? "#a78bfa" : "#facc15"}" stroke="${skin === "purple" ? "#6d28d9" : "#ca8a04"}" stroke-width="1.5" />`
    }[look]}
  ` : `
    <circle cx="41.5" cy="35" r="8.5" fill="#9ca3af" stroke="#4b5563" stroke-width="1.5" />
    <circle cx="41.5" cy="35" r="5.8" fill="#fff" />
    <circle cx="58.5" cy="35" r="8.5" fill="#9ca3af" stroke="#4b5563" stroke-width="1.5" />
    <circle cx="58.5" cy="35" r="5.8" fill="#fff" />
    ${{
      normal: `<circle cx="41.5" cy="35" r="2.5" fill="${skin === "purple" ? "#ef4444" : "#78350f"}" /><circle cx="41.5" cy="35" r="1.2" fill="#000" /><circle cx="58.5" cy="35" r="2.5" fill="${skin === "purple" ? "#ef4444" : "#78350f"}" /><circle cx="58.5" cy="35" r="1.2" fill="#000" />`,
      happy: `<path d="M39.5,36 Q41.5,34 43.5,36" stroke="${skin === "purple" ? "#ef4444" : "#78350f"}" stroke-width="1.5" fill="none" stroke-linecap="round" /><path d="M56.5,36 Q58.5,34 60.5,36" stroke="${skin === "purple" ? "#ef4444" : "#78350f"}" stroke-width="1.5" fill="none" stroke-linecap="round" />`,
      crazy: `<circle cx="40" cy="33.5" r="2" fill="#ef4444" /><circle cx="40" cy="33.5" r="0.8" fill="#000" /><circle cx="57" cy="36.5" r="2" fill="#ef4444" /><circle cx="57" cy="36.5" r="0.8" fill="#000" />`,
      sleepy: `<circle cx="41.5" cy="37" r="1.5" fill="${skin === "purple" ? "#ef4444" : "#78350f"}" /><circle cx="58.5" cy="37" r="1.5" fill="${skin === "purple" ? "#ef4444" : "#78350f"}" /><path d="M33,35 A8.5,8.5 0 0,1 50,35 Z" fill="${skin === "purple" ? "#a78bfa" : "#facc15"}" stroke="${skin === "purple" ? "#6d28d9" : "#ca8a04"}" stroke-width="1.2" /><path d="M50,35 A8.5,8.5 0 0,1 67,35 Z" fill="${skin === "purple" ? "#a78bfa" : "#facc15"}" stroke="${skin === "purple" ? "#6d28d9" : "#ca8a04"}" stroke-width="1.2" />`
    }[look]}
  `;

  const mouthMarkup = {
    smile: `<path d="M43,51 Q50,56 57,51" stroke="#18181b" stroke-width="2.5" fill="none" stroke-linecap="round" />`,
    grin: `<path d="M41,49 Q50,57 59,49 Z" fill="#ffffff" stroke="#18181b" stroke-width="2" stroke-linecap="round" />`,
    tongue: `<path d="M43,50 Q50,56 57,50" stroke="#18181b" stroke-width="2.5" fill="none" stroke-linecap="round" /><path d="M46.5,51.5 Q50,59 53.5,51.5 Z" fill="#ef4444" stroke="#18181b" stroke-width="1.5" />`,
    sad: `<path d="M43,55 Q50,50 57,55" stroke="#18181b" stroke-width="2.5" fill="none" stroke-linecap="round" />`,
    surprised: `<circle cx="50" cy="52.5" r="3.5" stroke="#18181b" stroke-width="2.5" fill="none" />`
  }[mouth];

  let fangsMarkup = "";
  if (skin === "purple") {
    if (mouth === "smile") fangsMarkup = `<g fill="#ffffff"><polygon points="44,51.5 46,55.5 48,51.5" /><polygon points="52,51.5 54,55.5 56,51.5" /></g>`;
    else if (mouth === "grin") fangsMarkup = `<g fill="#ffffff"><polygon points="43,49.5 45,54.5 47,49.5" /><polygon points="53,49.5 55,54.5 57,49.5" /></g>`;
    else if (mouth === "tongue") fangsMarkup = `<g fill="#ffffff"><polygon points="44,50.5 46,54.5 48,50.5" /><polygon points="52,50.5 54,54.5 56,50.5" /></g>`;
    else if (mouth === "sad") fangsMarkup = `<g fill="#ffffff"><polygon points="44,52.5 46,55.5 48,52.5" /><polygon points="52,52.5 54,55.5 56,52.5" /></g>`;
    else if (mouth === "surprised") fangsMarkup = `<g fill="#ffffff"><polygon points="48,49.5 50,52.5 52,49.5" /></g>`;
  }

  const outfitMarkup = {
    overalls: `<g><rect x="25" y="66" width="50" height="22" fill="#1d4ed8" /><rect x="34" y="59" width="32" height="8" fill="#1d4ed8" /><line x1="25" y1="56" x2="35.5" y2="61" stroke="#1d4ed8" stroke-width="5" stroke-linecap="round" /><line x1="75" y1="56" x2="64.5" y2="61" stroke="#1d4ed8" stroke-width="5" stroke-linecap="round" /><rect x="44" y="66" width="12" height="9" fill="#1e3a8a" rx="1.5" /></g>`,
    maid: `<g><rect x="24" y="58" width="52" height="30" fill="#18181b" /><rect x="34" y="63" width="32" height="25" fill="#ffffff" rx="1.5" /><path d="M26,58 C34,55 66,55 74,58" stroke="#ffffff" stroke-width="3" fill="none" /></g>`,
    tourist: `<g><rect x="24" y="58" width="52" height="30" fill="#e11d48" /><circle cx="33" cy="64" r="2.5" fill="#ffffff" /><circle cx="42" cy="76" r="2.5" fill="#ffffff" /><circle cx="58" cy="66" r="2.5" fill="#ffffff" /><circle cx="67" cy="78" r="2.5" fill="#ffffff" /><circle cx="33" cy="64" r="0.9" fill="#facc15" /><circle cx="42" cy="76" r="0.9" fill="#facc15" /><circle cx="58" cy="66" r="0.9" fill="#facc15" /><circle cx="67" cy="78" r="0.9" fill="#facc15" /></g>`,
    cyborg: `<g><rect x="24" y="58" width="52" height="30" fill="#4b5563" stroke="#1f2937" stroke-width="1.5" /><line x1="50" y1="58" x2="50" y2="88" stroke="#1f2937" stroke-width="1.5" /><line x1="24" y1="73" x2="76" y2="73" stroke="#1f2937" stroke-width="1.5" /><circle cx="29" cy="63" r="1.2" fill="#1f2937" /><circle cx="71" cy="63" r="1.2" fill="#1f2937" /><circle cx="29" cy="83" r="1.2" fill="#1f2937" /><circle cx="71" cy="83" r="1.2" fill="#1f2937" /><circle cx="50" cy="73" r="5" fill="#ef4444" /><circle cx="50" cy="73" r="1.8" fill="#fecaca" /></g>`
  }[outfit];

  const accessoryMarkup = {
    banana: `<g transform="translate(76, 65) scale(1.35) translate(-76, -65)"><path d="M72,60 Q82,60 85,72 Q75,70 72,60 Z" fill="#facc15" stroke="#ca8a04" stroke-width="1.5" /><path d="M72,60 Q70,57 68,58" stroke="#854d0e" stroke-width="2" fill="none" /></g>`,
    teddybear: `<g transform="translate(71, 65) scale(1.4) translate(-71, -65)"><g transform="translate(68, 62)"><circle cx="5" cy="5" r="5" fill="#78350f" stroke="#451a03" stroke-width="0.8" /><circle cx="1.5" cy="1" r="1.8" fill="#78350f" /><circle cx="8.5" cy="1" r="1.8" fill="#78350f" /><circle cx="5" cy="5" r="1.8" fill="#fbcfe8" /><circle cx="4" cy="4" r="0.6" fill="#000" /><circle cx="6" cy="4" r="0.6" fill="#000" /></g></g>`,
    raygun: `<g transform="translate(71, 64) scale(1.35) translate(-71, -64)"><g transform="translate(67, 61) rotate(10)"><rect x="0" y="2" width="13" height="4.5" fill="#64748b" rx="1" stroke="#334155" stroke-width="0.8" /><rect x="9" y="0" width="3.5" height="8.5" fill="#ef4444" rx="1" /><line x1="2" y1="4.5" x2="2" y2="10.5" stroke="#475569" stroke-width="2" /></g></g>`,
    none: ""
  }[accessory];

  let bodyFill = "#facc15";
  let bodyStroke = "#ca8a04";
  if (skin === "purple") {
    bodyFill = "#a78bfa";
    bodyStroke = "#6d28d9";
  } else if (skin === "gold") {
    bodyFill = "url(#gold-grad)";
    bodyStroke = "#b45309";
  }

  const fullSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="500" height="500">
  <defs>
    <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#fbbf24" />
      <stop offset="30%" stopColor="#f59e0b" />
      <stop offset="70%" stopColor="#fbbf24" />
      <stop offset="100%" stopColor="#d97706" />
    </linearGradient>
    <linearGradient id="cylindrical-shadow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#000000" stopOpacity="0.25" />
      <stop offset="20%" stopColor="#000000" stopOpacity="0.0" />
      <stop offset="80%" stopColor="#000000" stopOpacity="0.0" />
      <stop offset="100%" stopColor="#000000" stopOpacity="0.30" />
    </linearGradient>
    <clipPath id="body-clip">
      <rect x="25" y="15" width="50" height="70" rx="25" />
    </clipPath>
  </defs>
  <rect x="25" y="15" width="50" height="70" rx="25" fill="${bodyFill}" stroke="${bodyStroke}" stroke-width="2.5" />
  ${hairMarkup}
  <rect x="24" y="32" width="52" height="6" fill="#18181b" rx="1" />
  <g clip-path="url(#body-clip)">
    ${outfitMarkup}
  </g>
  <rect x="25" y="15" width="50" height="70" rx="25" fill="url(#cylindrical-shadow)" stroke="none" pointer-events="none" />
  ${eyesMarkup}
  ${mouthMarkup}
  ${fangsMarkup}
  ${accessoryMarkup}
</svg>
`.trim();

  const blob = new Blob([fullSvg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${userName}_minion_avatar.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
