import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';

export default {
  input: 'src/index.js',
  plugins: [ babel(babelrc()) ],
  output: {
    file: 'dist/index.js',
    format: 'umd'
  },
  name: 'kai',
  external: [ 'praan', 'React', 'babylon-walker', 'babel-generator', 'babylon', 'fs' ]
};