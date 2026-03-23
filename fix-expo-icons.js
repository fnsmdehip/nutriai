const fs = require('fs');
const path = require('path');

// Define the Expo Vector Icons directory
const expoVectorIconsDir = path.join(__dirname, 'node_modules', '@expo', 'vector-icons', 'build');

// Define the React Native Vector Icons directory
const rnVectorIconsDir = path.join(__dirname, 'node_modules', 'react-native-vector-icons');

// Create vendor directory if it doesn't exist
const vendorDir = path.join(expoVectorIconsDir, 'vendor', 'react-native-vector-icons');
if (!fs.existsSync(path.join(expoVectorIconsDir, 'vendor'))) {
  fs.mkdirSync(path.join(expoVectorIconsDir, 'vendor'), { recursive: true });
}

if (!fs.existsSync(vendorDir)) {
  fs.mkdirSync(vendorDir, { recursive: true });
}

// Create Fonts and glyphmaps directories
const fontsDirDest = path.join(vendorDir, 'Fonts');
const glyphmapsDirDest = path.join(vendorDir, 'glyphmaps');

if (!fs.existsSync(fontsDirDest)) {
  fs.mkdirSync(fontsDirDest, { recursive: true });
}

if (!fs.existsSync(glyphmapsDirDest)) {
  fs.mkdirSync(glyphmapsDirDest, { recursive: true });
}

// Copy font files
const fontsDirSrc = path.join(rnVectorIconsDir, 'Fonts');
const glyphmapsDirSrc = path.join(rnVectorIconsDir, 'glyphmaps');

// Also handle app directory structure
const appNodeModules = path.join(__dirname, 'app', 'node_modules');
if (fs.existsSync(appNodeModules)) {
  const appExpoVectorIconsDir = path.join(appNodeModules, '@expo', 'vector-icons', 'build');
  const appVendorDir = path.join(appExpoVectorIconsDir, 'vendor', 'react-native-vector-icons');
  
  if (!fs.existsSync(path.join(appExpoVectorIconsDir, 'vendor'))) {
    fs.mkdirSync(path.join(appExpoVectorIconsDir, 'vendor'), { recursive: true });
  }
  
  if (!fs.existsSync(appVendorDir)) {
    fs.mkdirSync(appVendorDir, { recursive: true });
  }
  
  const appFontsDirDest = path.join(appVendorDir, 'Fonts');
  const appGlyphmapsDirDest = path.join(appVendorDir, 'glyphmaps');
  
  if (!fs.existsSync(appFontsDirDest)) {
    fs.mkdirSync(appFontsDirDest, { recursive: true });
  }
  
  if (!fs.existsSync(appGlyphmapsDirDest)) {
    fs.mkdirSync(appGlyphmapsDirDest, { recursive: true });
  }
  
  copyFiles(fontsDirSrc, appFontsDirDest);
  copyFiles(glyphmapsDirSrc, appGlyphmapsDirDest);
}

// Function to copy all files from src to dest directory
function copyFiles(src, dest) {
  if (fs.existsSync(src)) {
    const files = fs.readdirSync(src);
    files.forEach(file => {
      const srcFile = path.join(src, file);
      const destFile = path.join(dest, file);
      if (fs.lstatSync(srcFile).isFile()) {
        fs.copyFileSync(srcFile, destFile);
        console.log(`Copied ${srcFile} to ${destFile}`);
      }
    });
  }
}

// Copy fonts and glyphmaps
copyFiles(fontsDirSrc, fontsDirDest);
copyFiles(glyphmapsDirSrc, glyphmapsDirDest);

console.log('Expo Vector Icons fixed successfully!'); 