const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconDir = path.join(__dirname, '../public/icons');

// Create the icon directory if it doesn't exist
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Create a simple green golf-themed icon
async function generateIcon() {
  // Create a base image with green background
  const baseSize = 512;
  const baseImage = sharp({
    create: {
      width: baseSize,
      height: baseSize,
      channels: 4,
      background: { r: 76, g: 175, b: 80, alpha: 1 }
    }
  }).png();
  
  // Generate icons for all sizes
  for (const size of sizes) {
    await baseImage
      .clone()
      .resize(size, size)
      .toFile(path.join(iconDir, `icon-${size}x${size}.png`));
    
    console.log(`Generated ${size}x${size} icon`);
  }
  
  // Create a maskable icon (with padding)
  await baseImage
    .clone()
    .resize(512, 512)
    .toFile(path.join(iconDir, 'maskable-icon.png'));
  
  console.log('Generated maskable icon');
}

generateIcon().catch(console.error); 