let webpackEntry = process.env.WEBPACK_ENTRY;

// backpack.config.js
module.exports = {
  webpack: (config, options, webpack) => {
    // Perform customizations to config
    // Important: return the modified config
    config.devtool = 'source-map';
    config.target = 'node';
    if (webpackEntry) {
      delete config.entry.main;
      config.entry[webpackEntry] = `./src/index-${webpackEntry}.js`;
    }
    return config;
  }
};
