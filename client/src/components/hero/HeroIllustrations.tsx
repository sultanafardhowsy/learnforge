const font = "Inter, ui-sans-serif, system-ui, sans-serif";

export function CodeIllustration() {
  return (
    <svg viewBox="0 0 640 400" className="size-full" aria-hidden>
      <circle cx="470" cy="190" r="170" fill="#ddd0fb" />
      <circle cx="590" cy="60" r="46" fill="#fbbf24" opacity=".9" />
      <circle cx="300" cy="350" r="22" fill="#7c3aed" opacity=".25" />

      {/* Browser / editor window */}
      <g transform="translate(250 70)">
        <rect width="330" height="230" rx="14" fill="#1c1d1f" />
        <rect width="330" height="34" rx="14" fill="#2d2f31" />
        <rect y="20" width="330" height="14" fill="#2d2f31" />
        <circle cx="20" cy="17" r="5" fill="#f87171" />
        <circle cx="38" cy="17" r="5" fill="#fbbf24" />
        <circle cx="56" cy="17" r="5" fill="#34d399" />
        <rect x="90" y="10" width="150" height="14" rx="7" fill="#3f4245" />
        {[
          [24, 60, 60, "#c4b5fd"], [92, 60, 90, "#fbbf24"],
          [40, 84, 120, "#7dd3fc"], [168, 84, 50, "#f9a8d4"],
          [40, 108, 80, "#86efac"], [128, 108, 110, "#c4b5fd"],
          [56, 132, 140, "#fbbf24"],
          [40, 156, 60, "#7dd3fc"], [108, 156, 70, "#f9a8d4"],
          [24, 180, 40, "#c4b5fd"],
        ].map(([x, y, w, c], i) => (
          <rect key={i} x={x as number} y={y as number} width={w as number} height="10" rx="5" fill={c as string} opacity=".9" />
        ))}
        <rect x="70" y="180" width="3" height="14" fill="#fff">
          <animate attributeName="opacity" values="1;0;1" dur="1.2s" repeatCount="indefinite" />
        </rect>
      </g>

      {/* Floating video card */}
      <g transform="translate(150 200)">
        <rect width="190" height="140" rx="12" fill="#fff" stroke="#ece7f7" />
        <rect x="12" y="12" width="166" height="80" rx="8" fill="#7c3aed" />
        <circle cx="95" cy="52" r="20" fill="#fff" />
        <path d="M89 42 L105 52 L89 62 Z" fill="#7c3aed" />
        <rect x="12" y="104" width="120" height="9" rx="4.5" fill="#2d2f31" />
        <rect x="12" y="122" width="166" height="6" rx="3" fill="#ede9fe" />
        <rect x="12" y="122" width="96" height="6" rx="3" fill="#7c3aed" />
      </g>

      {/* Progress chip */}
      <g transform="translate(500 268)">
        <rect width="130" height="44" rx="22" fill="#fff" stroke="#ece7f7" />
        <circle cx="22" cy="22" r="11" fill="#7c3aed" />
        <path d="M17 22 l3.5 3.5 6-7" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x="41" y="27" fontFamily={font} fontSize="13" fontWeight="700" fill="#1c1d1f">Lesson done</text>
      </g>
    </svg>
  );
}

export function LessonIllustration() {
  return (
    <svg viewBox="0 0 640 400" className="size-full" aria-hidden>
      <circle cx="450" cy="200" r="175" fill="#fde68a" />
      <circle cx="270" cy="70" r="30" fill="#f59e0b" opacity=".35" />
      <circle cx="610" cy="340" r="40" fill="#7c3aed" opacity=".15" />

      {/* Player */}
      <g transform="translate(220 80)">
        <rect width="300" height="200" rx="14" fill="#1c1d1f" />
        <rect x="12" y="12" width="276" height="150" rx="8" fill="#3b0f80" />
        <circle cx="70" cy="60" r="34" fill="#7c3aed" opacity=".6" />
        <circle cx="230" cy="120" r="46" fill="#a78bfa" opacity=".35" />
        <circle cx="150" cy="87" r="28" fill="#fff" />
        <path d="M141 73 L165 87 L141 101 Z" fill="#3b0f80" />
        <rect x="12" y="176" width="276" height="6" rx="3" fill="#3f4245" />
        <rect x="12" y="176" width="170" height="6" rx="3" fill="#fbbf24" />
        <circle cx="182" cy="179" r="7" fill="#fbbf24" />
      </g>

      {/* Curriculum list */}
      <g transform="translate(440 190)">
        <rect width="180" height="150" rx="12" fill="#fff" stroke="#f1e7c9" />
        <text x="16" y="28" fontFamily={font} fontSize="12" fontWeight="700" fill="#1c1d1f">Course content</text>
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(16 ${46 + i * 32})`}>
            <circle cx="9" cy="9" r="9" fill={i < 2 ? "#7c3aed" : "#ede9fe"} />
            {i < 2 && <path d="M5 9 l3 3 5-6" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />}
            <rect x="26" y="4" width={i === 1 ? 90 : 110} height="9" rx="4.5" fill={i < 2 ? "#2d2f31" : "#d1d7dc"} />
          </g>
        ))}
      </g>

      {/* Clock chip */}
      <g transform="translate(150 250)">
        <rect width="118" height="46" rx="23" fill="#fff" stroke="#f1e7c9" />
        <circle cx="23" cy="23" r="12" fill="none" stroke="#7c3aed" strokeWidth="2.5" />
        <path d="M23 16 v7 l5 3" stroke="#7c3aed" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <text x="44" y="28" fontFamily={font} fontSize="13" fontWeight="700" fill="#1c1d1f">Your pace</text>
      </g>
    </svg>
  );
}

export function StackIllustration() {
  return (
    <svg viewBox="0 0 640 400" className="size-full" aria-hidden>
      <circle cx="460" cy="200" r="175" fill="#a7f3d0" />
      <circle cx="600" cy="70" r="34" fill="#7c3aed" opacity=".2" />
      <circle cx="260" cy="330" r="26" fill="#059669" opacity=".25" />

      {/* Connectors */}
      <path d="M330 130 C 380 130, 380 200, 430 200" stroke="#065f46" strokeWidth="2.5" strokeDasharray="6 6" fill="none" />
      <path d="M430 200 C 480 200, 480 280, 530 280" stroke="#065f46" strokeWidth="2.5" strokeDasharray="6 6" fill="none" />

      {/* Front-end card */}
      <g transform="translate(200 80)">
        <rect width="140" height="100" rx="12" fill="#fff" stroke="#c7eedd" />
        <rect x="14" y="14" width="112" height="44" rx="6" fill="#ede9fe" />
        <rect x="24" y="24" width="40" height="8" rx="4" fill="#7c3aed" />
        <rect x="24" y="38" width="70" height="8" rx="4" fill="#c4b5fd" />
        <rect x="14" y="70" width="52" height="16" rx="8" fill="#7c3aed" />
        <rect x="74" y="70" width="52" height="16" rx="8" fill="#ede9fe" />
      </g>

      {/* Server */}
      <g transform="translate(380 150)">
        <rect width="110" height="100" rx="12" fill="#1c1d1f" />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(12 ${12 + i * 28})`}>
            <rect width="86" height="20" rx="5" fill="#2d2f31" />
            <circle cx="12" cy="10" r="4" fill={i === 1 ? "#fbbf24" : "#34d399"} />
            <rect x="24" y="7" width="48" height="6" rx="3" fill="#4b4f52" />
          </g>
        ))}
      </g>

      {/* Database */}
      <g transform="translate(500 230)">
        <path d="M0 18 v64 c0 10 26 18 58 18 s58 -8 58 -18 v-64" fill="#059669" />
        <ellipse cx="58" cy="18" rx="58" ry="18" fill="#34d399" />
        <path d="M0 50 c0 10 26 18 58 18 s58 -8 58 -18" stroke="#a7f3d0" strokeWidth="2" fill="none" />
      </g>

      {/* Terminal chip */}
      <g transform="translate(150 230)">
        <rect width="150" height="46" rx="23" fill="#fff" stroke="#c7eedd" />
        <text x="22" y="29" fontFamily="ui-monospace, Menlo, monospace" fontSize="14" fontWeight="700" fill="#059669">$</text>
        <text x="38" y="29" fontFamily="ui-monospace, Menlo, monospace" fontSize="13" fill="#1c1d1f">npm run dev</text>
      </g>
    </svg>
  );
}