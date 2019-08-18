const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'));
    config.module.rule('xlsx').test(/\.(xlsx|xls)$/).use('file-loader').loader('file-loader');
  },
};
