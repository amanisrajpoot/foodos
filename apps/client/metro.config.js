const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Block scanning apps/api build directory to prevent watcher crashes
config.resolver.blockList = [
  /apps\/api\/.*/,
];

module.exports = withNativeWind(config, {
  input: './global.css',
  configPath: path.resolve(__dirname, './tailwind.config.js'),
});
