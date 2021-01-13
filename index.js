const path = require('path');
const ConcatSource = require("webpack-sources").ConcatSource;

class MultiEntriesCssCombinationPlugin {

  constructor(config) {
    this.config = {
      entries: config.entries || [],
      augends: config.augends || []
    }
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'MultiEntriesCssCombinationPlugin',
      (compilation, callback) => {
        const { entries, augends } = this.config;
        const cssAssets = Object.keys(compilation.assets).filter(asset => path.extname(asset) === '.css')
        const augendsAssets = {};
        
        augends.forEach(augend => {
          const completeName = cssAssets.find(asset => path.basename(asset) === augend)
          augendsAssets[augend] = compilation.assets[completeName];
        })

        // 存在某个entry自身没有生成css的情况，所以不能遍历cssAssets
        entries.forEach(entry => {
          const css = new ConcatSource();
          const currentEntry = cssAssets.find(asset => path.basename(asset) === entry)

          Object.values(augendsAssets).forEach(augendAsset => css.add(augendAsset));
          css.add(compilation.assets[currentEntry]);

          compilation.assets[currentEntry] = css;
        })

        Object.keys(compilation.assets).forEach(asset => {
          if (path.extname(asset) === '.css' && !entries.includes(path.basename(asset))) {
            delete compilation.assets[asset]
          }
        })

        return callback();
      }
    );
  }
}

module.exports = MultiEntriesCssCombinationPlugin;