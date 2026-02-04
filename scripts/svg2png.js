/**
 * 将 tabBar 的 SVG 图标转换为微信小程序支持的 PNG 格式（81x81）
 * 运行: npm run build:tabbar
 */
const fs = require('fs');
const path = require('path');

const sharp = require('sharp');

const tabbarDir = path.join(__dirname, '../miniprogram/images/tabbar');
const icons = [
  'card.svg',
  'card-active.svg',
  'profile.svg',
  'profile-active.svg',
];

async function convert() {
  for (const name of icons) {
    const svgPath = path.join(tabbarDir, name);
    const pngPath = path.join(tabbarDir, name.replace('.svg', '.png'));
    const svgBuffer = fs.readFileSync(svgPath);
    await sharp(svgBuffer)
      .resize(81, 81)
      .png()
      .toFile(pngPath);
    console.log('OK:', name, '->', path.basename(pngPath));
  }
}

convert().catch((err) => {
  console.error(err);
  process.exit(1);
});
