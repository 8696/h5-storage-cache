const config = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    index: './src/index.ts',
  },
  output: {
    path: require('path').resolve(__dirname, 'dist'),
    library: 'H5StorageCache',
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {loader: 'babel-loader'}
        ],
        exclude: /node_modules/,

      },
      {
        test: /\.ts$/,
        use: [
          {loader: 'babel-loader'},
          {loader: 'ts-loader'},
        ],

      }
    ]
  },
};
module.exports = [
  require('webpack-merge')(config, {
    output: {
      filename: 'h5-storage-cache.min.js',
      libraryTarget: 'umd',
      umdNamedDefine: true
    }
  }),
];

