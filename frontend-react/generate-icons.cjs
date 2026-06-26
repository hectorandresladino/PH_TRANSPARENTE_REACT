// Script para generar iconos para la aplicación móvil
// Este script crea iconos básicos que pueden ser mejorados con herramientas de diseño

const fs = require('fs');
const path = require('path');

// Crear directorio de iconos si no existe
const iconDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Crear un archivo SVG básico para el icono
const svgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#123b62"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="200" font-weight="bold" fill="white">PH</text>
</svg>
`;

// Guardar el SVG
fs.writeFileSync(path.join(iconDir, 'icon.svg'), svgIcon);

console.log('Icono SVG creado en public/icons/icon.svg');
console.log('Para generar los iconos PNG, use una herramienta como ImageMagick o un servicio online como:');
console.log('https://www.favicon-generator.org/');
console.log('https://realfavicongenerator.net/');
console.log('');
console.log('Necesita generar los siguientes tamaños:');
console.log('- icon-192.png (192x192)');
console.log('- icon-512.png (512x512)');
console.log('- icon-72.png (72x72)');
console.log('- icon-96.png (96x96)');
console.log('- icon-128.png (128x128)');
console.log('- icon-144.png (144x144)');
console.log('- icon-152.png (152x152)');
console.log('- icon-384.png (384x384)');
