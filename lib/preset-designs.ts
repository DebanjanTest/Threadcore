export interface PresetDesign {
  id: string;
  name: string;
  category: string;
  dataUrl: string;
}

// Clean, high-contrast SVG vector designs converted to inline data URIs
export const PRESET_DESIGNS: PresetDesign[] = [
  {
    id: "cyber-matrix",
    name: "Cyber Matrix",
    category: "Cyberpunk",
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
        <rect width="200" height="200" fill="transparent"/>
        <circle cx="100" cy="100" r="80" stroke="#f4f4f5" stroke-width="2" stroke-dasharray="6 4" />
        <circle cx="100" cy="100" r="50" stroke="#22c55e" stroke-width="1.5" />
        <polygon points="100,30 165,140 35,140" stroke="#f4f4f5" stroke-width="2" fill="none"/>
        <line x1="100" y1="20" x2="100" y2="180" stroke="#f4f4f5" stroke-width="1" opacity="0.6"/>
        <line x1="20" y1="100" x2="180" y2="100" stroke="#f4f4f5" stroke-width="1" opacity="0.6"/>
        <text x="100" y="105" fill="#f4f4f5" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle" letter-spacing="4">SYS//CORE</text>
        <rect x="92" y="58" width="16" height="16" fill="#f4f4f5" />
      </svg>
    `)}`,
  },
  {
    id: "glitch-disruption",
    name: "Glitch Disruption",
    category: "Typography",
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
        <rect width="200" height="200" fill="transparent"/>
        <text x="100" y="70" fill="#f4f4f5" font-family="monospace" font-size="22" font-weight="900" text-anchor="middle" letter-spacing="6">THREAD</text>
        <line x1="20" y1="75" x2="180" y2="75" stroke="#ef4444" stroke-width="2"/>
        <text x="104" y="110" fill="#ef4444" font-family="monospace" font-size="22" font-weight="900" text-anchor="middle" letter-spacing="6" opacity="0.8">OVERRIDE</text>
        <text x="96" y="110" fill="#22c55e" font-family="monospace" font-size="22" font-weight="900" text-anchor="middle" letter-spacing="6" opacity="0.8">OVERRIDE</text>
        <text x="100" y="110" fill="#f4f4f5" font-family="monospace" font-size="22" font-weight="900" text-anchor="middle" letter-spacing="6">OVERRIDE</text>
        <text x="100" y="145" fill="#a1a1aa" font-family="monospace" font-size="10" text-anchor="middle" letter-spacing="8">[PROTO_v4.2]</text>
        <rect x="30" y="160" width="140" height="4" fill="#f4f4f5" />
      </svg>
    `)}`,
  },
  {
    id: "neural-core",
    name: "Neural Core",
    category: "AI / Tech",
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
        <rect width="200" height="200" fill="transparent"/>
        <rect x="60" y="60" width="80" height="80" stroke="#f4f4f5" stroke-width="2" />
        <rect x="75" y="75" width="50" height="50" fill="#f4f4f5" />
        <circle cx="100" cy="100" r="12" fill="#0a0a0a" />
        <!-- Pins -->
        <line x1="40" y1="75" x2="60" y2="75" stroke="#f4f4f5" stroke-width="2" />
        <line x1="40" y1="100" x2="60" y2="100" stroke="#f4f4f5" stroke-width="2" />
        <line x1="40" y1="125" x2="60" y2="125" stroke="#f4f4f5" stroke-width="2" />
        <line x1="140" y1="75" x2="160" y2="75" stroke="#f4f4f5" stroke-width="2" />
        <line x1="140" y1="100" x2="160" y2="100" stroke="#f4f4f5" stroke-width="2" />
        <line x1="140" y1="125" x2="160" y2="125" stroke="#f4f4f5" stroke-width="2" />
        <text x="100" y="175" fill="#f4f4f5" font-family="monospace" font-size="9" text-anchor="middle" letter-spacing="3">AUTONOMOUS_CHIP</text>
      </svg>
    `)}`,
  },
  {
    id: "tokyo-tech",
    name: "Tokyo Tech",
    category: "Streetwear",
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
        <rect width="200" height="200" fill="transparent"/>
        <rect x="40" y="40" width="120" height="120" stroke="#eab308" stroke-width="1.5" />
        <text x="100" y="95" fill="#f4f4f5" font-family="sans-serif" font-size="34" font-weight="900" text-anchor="middle">未来</text>
        <text x="100" y="125" fill="#f4f4f5" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle" letter-spacing="6">TOKYO//CORE</text>
        <line x1="50" y1="140" x2="150" y2="140" stroke="#eab308" stroke-width="1"/>
        <text x="100" y="152" fill="#a1a1aa" font-family="monospace" font-size="8" text-anchor="middle" letter-spacing="2">NEO DISTRICT 07</text>
      </svg>
    `)}`,
  },
  {
    id: "void-runner",
    name: "Void Runner",
    category: "Athletic",
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
        <rect width="200" height="200" fill="transparent"/>
        <polygon points="40,130 160,70 140,60 20,120" fill="#f4f4f5"/>
        <polygon points="55,145 175,85 155,75 35,135" fill="#737373"/>
        <text x="100" y="170" fill="#f4f4f5" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle" letter-spacing="5">SPEED//VOID</text>
        <circle cx="100" cy="45" r="16" stroke="#f4f4f5" stroke-width="2" />
        <circle cx="100" cy="45" r="6" fill="#22c55e" />
      </svg>
    `)}`,
  },
  {
    id: "thread-protocol",
    name: "Thread Protocol",
    category: "Branded",
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
        <rect width="200" height="200" fill="transparent"/>
        <path d="M 50,50 L 150,50 L 150,80 L 115,80 L 115,150 L 85,150 L 85,80 L 50,80 Z" fill="#f4f4f5" />
        <rect x="40" y="165" width="120" height="8" fill="#22c55e" />
        <text x="100" y="190" fill="#a1a1aa" font-family="monospace" font-size="8" text-anchor="middle" letter-spacing="4">BOUNDED TRANSACTABLE</text>
      </svg>
    `)}`,
  },
];
