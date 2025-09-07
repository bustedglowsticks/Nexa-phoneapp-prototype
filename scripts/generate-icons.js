// Simple icon generator using sharp
// Input: public/icons/source.png (square)
// Output: public/icons/icon-192.png, icon-256.png, icon-384.png, icon-512.png, icon-1024.png
//         and apple-touch-icon variants (152, 167, 180)

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

(async () => {
  try {
    const projectRoot = process.cwd();
    const inPath = process.env.ICON_INPUT || path.join(projectRoot, 'public', 'icons', 'source.png');
    const outDir = path.join(projectRoot, 'public', 'icons');

    if (!fs.existsSync(inPath)) {
      console.error(`Source icon not found at: ${inPath}`);
      console.error('Please place your logo at public/icons/source.png or set ICON_INPUT env var.');
      process.exit(1);
    }

    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const targets = [
      // Standard PWA icons
      { size: 192, name: 'icon-192.png' },
      { size: 256, name: 'icon-256.png' },
      { size: 384, name: 'icon-384.png' },
      { size: 512, name: 'icon-512.png' },
      { size: 1024, name: 'icon-1024.png' },
      // Apple touch icons
      { size: 152, name: 'apple-touch-icon-152.png' },
      { size: 167, name: 'apple-touch-icon-167.png' },
      { size: 180, name: 'apple-touch-icon.png' },
    ];

    for (const t of targets) {
      const outPath = path.join(outDir, t.name);
      await sharp(inPath)
        .resize(t.size, t.size, { fit: 'cover' })
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toFile(outPath);
      console.log(`Generated ${t.name}`);
    }

    console.log('All icons generated successfully.');
  } catch (err) {
    console.error('Failed to generate icons:', err);
    process.exit(1);
  }
})();
