const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix Windows spawn EPERM
config.maxWorkers = 1;

module.exports = config;
