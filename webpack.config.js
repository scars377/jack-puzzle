const path = require('path');
const src = path.resolve('src');

const config = {
  context: src,
  entry:{
    app: 'index.js',
  },
  output:{
    path: path.resolve('build'),
    filename: '[name].js'
  },
  resolve:{
    modules:[src, 'node_modules'],
  },
  resolveLoader:{
    modules:['node_modules'],
  },
  module:{
    rules:[{
      test: /\.js$/,
      include: src,
      loaders: ['babel-loader'],
    },{
      test: /\.css$/,
      include: src,
      loaders: ['style-loader', 'css-loader'],
    },{
      test: /\.styl$/,
      include: src,
      loaders: ['style-loader', 'css-loader', 'stylus-loader'],
    },{
      test: /\.(html|png)$/,
      include: src,
      loaders: ['file-loader?name=[name].[ext]'],
    }],
  },
};

module.exports = config;
