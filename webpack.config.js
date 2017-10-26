const path = require('path');

module.exports = {
  entry: { // インプットファイル
    index: './client/index.js',
  },
  output: {
    filename: '[name].bundle.js', // アウトプットファイル名
    // アウトプットファイルパス。後でHTMLファイルでインクルードします。
    path: path.resolve(__dirname, 'app/javascripts/bundle'),
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',

        // アプリのjavascriptsのパスを指定し、
        // 指定したパスでのファイルだけトランスパイルさせます。
        include: [
          path.resolve(__dirname, './client'),
        ],
        exclude: [
          path.resolve(__dirname, 'node_modules'),
        ],
        // `.js` と `.jsx` というファイルのエクステンションを指定します。
        test: /\.jsx?$/,

        // babelと一緒に使うES2015とReactの指定
        query: {
          presets: ['env', 'react'],
        },
      },
    ],
  },
};
