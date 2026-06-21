const encodeSvg = (svg) => `data:image/svg+xml,${encodeURIComponent(svg)}`;

export const MARKETPH_LOGO = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0047FF"/>
      <stop offset="0.52" stop-color="#0033CC"/>
      <stop offset="1" stop-color="#001A80"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FFF3A3"/>
      <stop offset="0.55" stop-color="#FFD700"/>
      <stop offset="1" stop-color="#F59E0B"/>
    </linearGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#00114f" flood-opacity="0.45"/>
    </filter>
  </defs>
  <rect width="256" height="256" rx="54" fill="url(#bg)"/>
  <path d="M24 178c47-28 78-29 116-9 30 16 58 13 92-12v75H24z" fill="#00D4FF" opacity=".18"/>
  <circle cx="203" cy="48" r="17" fill="url(#gold)" opacity=".95"/>
  <g filter="url(#shadow)">
    <text x="128" y="116" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="76" font-weight="900" fill="#fff">1</text>
    <text x="128" y="174" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="52" font-weight="900" fill="#fff">Market</text>
    <text x="128" y="216" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="48" font-weight="900" fill="url(#gold)">PH</text>
  </g>
  <path d="M56 62h144" stroke="#FFD700" stroke-width="8" stroke-linecap="round" opacity=".9"/>
</svg>`);

export const ALFIE_FRAMES = [
  ['idle', '#fff7ed', 'M55 103q25 23 50 0', 'M42 65q-17-38 26-22', 'M118 65q17-38-26-22'],
  ['wave', '#fff7ed', 'M55 104q25 24 50 0', 'M39 64q-20-39 27-22', 'M119 64q18-38-25-22'],
  ['point', '#fff7ed', 'M57 106q23 18 47 0', 'M42 65q-17-38 26-22', 'M118 65q17-38-26-22'],
  ['think', '#fff7ed', 'M62 108q18 8 36 0', 'M42 65q-17-38 26-22', 'M118 65q17-38-26-22'],
  ['thumbsup', '#fff7ed', 'M55 101q25 27 50 0', 'M42 65q-17-38 26-22', 'M118 65q17-38-26-22'],
].map(([mode, face, mouth, leftEar, rightEar]) => encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
  <defs>
    <linearGradient id="fur" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${face}"/><stop offset="1" stop-color="#fed7aa"/></linearGradient>
    <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00D4FF"/><stop offset="1" stop-color="#0033CC"/></linearGradient>
    <filter id="s"><feDropShadow dx="0" dy="8" stdDeviation="7" flood-color="#0033CC" flood-opacity=".35"/></filter>
  </defs>
  <g filter="url(#s)">
    <ellipse cx="90" cy="94" rx="64" ry="67" fill="url(#fur)"/>
    <path d="${leftEar}" fill="#92400e"/><path d="${rightEar}" fill="#92400e"/>
    <path d="M54 44q10-18 29-21h14q22 5 31 22" fill="#fbbf24" opacity=".9"/>
    <circle cx="65" cy="79" r="10" fill="#09152f"/><circle cx="115" cy="79" r="10" fill="#09152f"/>
    <circle cx="69" cy="75" r="3" fill="white"/><circle cx="119" cy="75" r="3" fill="white"/>
    <ellipse cx="90" cy="99" rx="17" ry="12" fill="#09152f"/>
    <path d="${mouth}" fill="none" stroke="#0033CC" stroke-width="7" stroke-linecap="round"/>
    <path d="M50 126q40 31 80 0v29H50z" fill="url(#blue)"/>
    <text x="90" y="147" font-family="Arial Black, Arial" font-size="21" font-weight="900" text-anchor="middle" fill="#fff">Alfie</text>
    ${mode === 'wave' ? '<path d="M135 108q28-24 22-52" stroke="#f59e0b" stroke-width="13" stroke-linecap="round" fill="none"/><circle cx="158" cy="53" r="8" fill="#f59e0b"/>' : ''}
    ${mode === 'point' ? '<path d="M135 113h36" stroke="#f59e0b" stroke-width="13" stroke-linecap="round"/><path d="M164 101l14 12-14 12" fill="none" stroke="#f59e0b" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>' : ''}
    ${mode === 'think' ? '<circle cx="136" cy="38" r="7" fill="#00D4FF"/><circle cx="153" cy="24" r="5" fill="#FFD700"/><circle cx="166" cy="14" r="3" fill="#fff"/>' : ''}
    ${mode === 'thumbsup' ? '<path d="M132 114q16-24 31-8v28h-31z" fill="#f59e0b"/><path d="M148 105v-25" stroke="#f59e0b" stroke-width="12" stroke-linecap="round"/>' : ''}
  </g>
</svg>`));

export const ALFIE_CAR = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 430">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0033CC"/><stop offset="1" stop-color="#001A80"/></linearGradient>
    <linearGradient id="car" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00D4FF"/><stop offset=".55" stop-color="#2563EB"/><stop offset="1" stop-color="#0033CC"/></linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF3A3"/><stop offset="1" stop-color="#F59E0B"/></linearGradient>
    <filter id="shadow"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#000" flood-opacity=".38"/></filter>
  </defs>
  <rect width="680" height="430" rx="46" fill="url(#sky)"/>
  <circle cx="574" cy="76" r="32" fill="url(#gold)" opacity=".95"/>
  <path d="M33 313c112-50 189-53 288-17 104 39 196 24 326-45v149H33z" fill="#00D4FF" opacity=".14"/>
  <g filter="url(#shadow)">
    <path d="M98 247h88l44-79h199c47 0 86 34 96 79h41c31 0 56 25 56 56v26H65v-49c0-18 15-33 33-33z" fill="url(#car)"/>
    <path d="M241 184h89v63H206zM354 184h69c35 0 65 26 74 63H354z" fill="#bff6ff" opacity=".88"/>
    <path d="M85 292h518v43H85z" fill="#001A80" opacity=".42"/>
    <circle cx="180" cy="336" r="47" fill="#071229"/><circle cx="180" cy="336" r="23" fill="#60a5fa"/><circle cx="499" cy="336" r="47" fill="#071229"/><circle cx="499" cy="336" r="23" fill="#60a5fa"/>
    <text x="344" y="295" text-anchor="middle" font-family="Arial Black, Arial" font-size="40" font-weight="900" fill="#fff">1Market<tspan fill="#FFD700">PH</tspan></text>
    <g transform="translate(255 72) scale(1.15)">
      <ellipse cx="90" cy="94" rx="60" ry="63" fill="#fff7ed"/>
      <path d="M42 65q-17-38 26-22" fill="#92400e"/><path d="M118 65q17-38-26-22" fill="#92400e"/>
      <path d="M54 44q10-18 29-21h14q22 5 31 22" fill="#fbbf24"/>
      <circle cx="65" cy="79" r="10" fill="#09152f"/><circle cx="115" cy="79" r="10" fill="#09152f"/>
      <circle cx="69" cy="75" r="3" fill="white"/><circle cx="119" cy="75" r="3" fill="white"/>
      <ellipse cx="90" cy="99" rx="17" ry="12" fill="#09152f"/>
      <path d="M55 104q25 24 50 0" fill="none" stroke="#0033CC" stroke-width="7" stroke-linecap="round"/>
      <path d="M132 109q29-23 22-52" stroke="#f59e0b" stroke-width="13" stroke-linecap="round" fill="none"/>
      <circle cx="155" cy="54" r="8" fill="#f59e0b"/>
    </g>
  </g>
</svg>`);