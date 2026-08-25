import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createCrcTable() {
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c >>> 0;
  }
  return crcTable;
}

const crcTable = createCrcTable();
function crc32(buf) {
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  const toCrc = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(toCrc), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

export function generatePng(width, height, rgbaFunc) {
  const sig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bit
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  const rawRows = [];
  for (let y = 0; y < height; y++) {
    const row = Buffer.alloc(1 + width * 4);
    row[0] = 0; // filter None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = rgbaFunc(x, y, width, height);
      const offset = 1 + x * 4;
      row[offset] = Math.max(0, Math.min(255, Math.round(r)));
      row[offset + 1] = Math.max(0, Math.min(255, Math.round(g)));
      row[offset + 2] = Math.max(0, Math.min(255, Math.round(b)));
      row[offset + 3] = Math.max(0, Math.min(255, Math.round(a)));
    }
    rawRows.push(row);
  }

  const rawBuffer = Buffer.concat(rawRows);
  const idatData = zlib.deflateSync(rawBuffer);
  const idatChunk = makeChunk('IDAT', idatData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

/**
 * Procedural CivicBloom & FoundHub brand icon shader
 */
function renderBrandIcon(x, y, width, height, isMaskable = false) {
  // Normalize coords to [-1, 1]
  const nx = (x / (width - 1)) * 2 - 1;
  const ny = (y / (height - 1)) * 2 - 1;

  // Background corner rounding
  const sqDist = Math.pow(Math.abs(nx), 4) + Math.pow(Math.abs(ny), 4);

  // Gradient background: Deep indigo top-left (#4338CA) to purple/violet bottom-right (#7C3AED)
  const gradT = (nx + ny + 2) / 4;
  let r = 67 + gradT * (124 - 67);
  let g = 56 + gradT * (58 - 56);
  let b = 202 + gradT * (237 - 202);
  let a = 255;

  // Inner container scale
  const scale = isMaskable ? 0.65 : 0.82;
  const sx = nx / scale;
  const sy = ny / scale;
  const sDist = Math.sqrt(sx * sx + sy * sy);

  // Outer glowing ring
  if (sDist > 0.88 && sDist < 0.98) {
    const ringIntensity = (1 - Math.abs(sDist - 0.93) / 0.05);
    r = r * (1 - ringIntensity * 0.4) + 167 * ringIntensity * 0.4;
    g = g * (1 - ringIntensity * 0.4) + 243 * ringIntensity * 0.4;
    b = b * (1 - ringIntensity * 0.4) + 208 * ringIntensity * 0.4;
  }

  // Petals of the civic flower
  const angle = Math.atan2(sy, sx);
  const petalFreq = 6;
  const petalShape = Math.sin(angle * petalFreq);
  const petalR = 0.55 + 0.22 * Math.abs(petalShape);

  if (sDist < petalR) {
    // Flower petal gradient (Rose / Lavender)
    const petalGrad = sDist / petalR;
    const pr = 244 + (1 - petalGrad) * 11;
    const pg = 63 + (1 - petalGrad) * 150;
    const pb = 94 + (1 - petalGrad) * 120;

    const blend = Math.min(1, Math.max(0, (petalR - sDist) * 15));
    r = r * (1 - blend) + pr * blend;
    g = g * (1 - blend) + pg * blend;
    b = b * (1 - blend) + pb * blend;
  }

  // Inner core circle (Golden amber bloom center)
  if (sDist < 0.28) {
    const coreGrad = sDist / 0.28;
    const cr = 251 - coreGrad * 20;
    const cg = 191 - coreGrad * 40;
    const cb = 36 + coreGrad * 60;
    const blend = Math.min(1, Math.max(0, (0.28 - sDist) * 20));
    r = r * (1 - blend) + cr * blend;
    g = g * (1 - blend) + cg * blend;
    b = b * (1 - blend) + cb * blend;
  }

  // Center sparkling core
  if (sDist < 0.1) {
    const blend = Math.min(1, Math.max(0, (0.1 - sDist) * 30));
    r = r * (1 - blend) + 255 * blend;
    g = g * (1 - blend) + 255 * blend;
    b = b * (1 - blend) + 255 * blend;
  }

  // Smooth antialiased border curve for non-maskable icons
  if (!isMaskable) {
    if (sqDist > 0.9) {
      const edge = Math.min(1, Math.max(0, (1.05 - sqDist) * 10));
      a = Math.round(255 * edge);
    }
  }

  return [r, g, b, a];
}

const iconsDir = path.join(__dirname, '../public/icons');
const publicDir = path.join(__dirname, '../public');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('🌸 Generating high-resolution PWA and Web App Icons...');

// Generate standard PNG icons
const icon192 = generatePng(192, 192, (x, y, w, h) => renderBrandIcon(x, y, w, h, false));
fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), icon192);
console.log('✓ Created public/icons/icon-192.png');

const icon512 = generatePng(512, 512, (x, y, w, h) => renderBrandIcon(x, y, w, h, false));
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), icon512);
console.log('✓ Created public/icons/icon-512.png');

// Generate maskable PNG icons (full bleed canvas safe-zone)
const iconMaskable192 = generatePng(192, 192, (x, y, w, h) => renderBrandIcon(x, y, w, h, true));
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-192.png'), iconMaskable192);
console.log('✓ Created public/icons/icon-maskable-192.png');

const iconMaskable512 = generatePng(512, 512, (x, y, w, h) => renderBrandIcon(x, y, w, h, true));
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512.png'), iconMaskable512);
console.log('✓ Created public/icons/icon-maskable-512.png');

// Generate Apple Touch Icon (180x180)
const appleIcon = generatePng(180, 180, (x, y, w, h) => renderBrandIcon(x, y, w, h, false));
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), appleIcon);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleIcon);
console.log('✓ Created public/apple-touch-icon.png');

// Generate Favicons (32x32, 16x16)
const favicon32 = generatePng(32, 32, (x, y, w, h) => renderBrandIcon(x, y, w, h, false));
fs.writeFileSync(path.join(iconsDir, 'favicon-32x32.png'), favicon32);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), favicon32);
console.log('✓ Created public/favicon.ico & public/icons/favicon-32x32.png');

const favicon16 = generatePng(16, 16, (x, y, w, h) => renderBrandIcon(x, y, w, h, false));
fs.writeFileSync(path.join(iconsDir, 'favicon-16x16.png'), favicon16);
console.log('✓ Created public/icons/favicon-16x16.png');

// Generate crisp SVG icons
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4F46E5"/>
      <stop offset="100%" stop-color="#7C3AED"/>
    </linearGradient>
    <linearGradient id="bloomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F43F5E"/>
      <stop offset="50%" stop-color="#FB7185"/>
      <stop offset="100%" stop-color="#FDA4AF"/>
    </linearGradient>
    <linearGradient id="coreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FBBF24"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  
  <!-- Rounded Base -->
  <rect width="512" height="512" rx="128" fill="url(#bgGrad)"/>
  
  <!-- Ambient Ring -->
  <circle cx="256" cy="256" r="200" fill="none" stroke="#A7F3D0" stroke-width="6" opacity="0.4" stroke-dasharray="16 12"/>
  <circle cx="256" cy="256" r="170" fill="none" stroke="#DDD6FE" stroke-width="4" opacity="0.3"/>

  <!-- Bloom Petals -->
  <g transform="translate(256, 256)" filter="url(#glow)">
    <path d="M 0 -130 C 50 -130 90 -70 0 0 C -90 -70 -50 -130 0 -130 Z" fill="url(#bloomGrad)" opacity="0.95"/>
    <path d="M 0 130 C 50 130 90 70 0 0 C -90 70 -50 130 0 130 Z" fill="url(#bloomGrad)" opacity="0.95"/>
    <path d="M -130 0 C -130 50 -70 90 0 0 C -70 -90 -130 -50 -130 0 Z" fill="url(#bloomGrad)" opacity="0.95"/>
    <path d="M 130 0 C 130 50 70 90 0 0 C 70 -90 130 -50 130 0 Z" fill="url(#bloomGrad)" opacity="0.95"/>
    <path d="M -90 -90 C -50 -120 -10 -90 0 0 C -90 -10 -120 -50 -90 -90 Z" fill="url(#bloomGrad)" opacity="0.85"/>
    <path d="M 90 -90 C 50 -120 10 -90 0 0 C 90 -10 120 -50 90 -90 Z" fill="url(#bloomGrad)" opacity="0.85"/>
    <path d="M -90 90 C -50 120 -10 90 0 0 C -90 10 -120 50 -90 90 Z" fill="url(#bloomGrad)" opacity="0.85"/>
    <path d="M 90 90 C 50 120 10 90 0 0 C 90 10 120 50 90 90 Z" fill="url(#bloomGrad)" opacity="0.85"/>
    
    <!-- Central Core -->
    <circle cx="0" cy="0" r="48" fill="url(#coreGrad)"/>
    <circle cx="0" cy="0" r="20" fill="#FFFFFF"/>
  </g>
</svg>`;

fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgContent);
fs.writeFileSync(path.join(iconsDir, 'icon-192.svg'), svgContent);
fs.writeFileSync(path.join(iconsDir, 'icon-512.svg'), svgContent);
console.log('✓ Created SVG icons in public/icons/');
console.log('🎉 All PWA assets generated successfully!');
