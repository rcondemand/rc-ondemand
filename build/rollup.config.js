'use strict'

const path    = require('path')
const babel   = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const banner  = require('./banner.js')

const BUNDLE  = process.env.BUNDLE === 'true'

let fileDest  = 'bootstrap.js'
const external = ['jquery', 'popper.js']
const globals = {
  jquery: 'jQuery',
  'popper.js': 'Popper'
}

const plugins = [
  babel({
    exclude: 'node_modules/**',
    externalHelpersWhitelist: [
      'defineProperties',
      'createClass',
      'inheritsLoose',
      'defineProperty',
      'objectSpread'
    ]
  })
]
if (BUNDLE) {
  fileDest = 'bootstrap.bundle.js'
  external.pop()
  delete globals['popper.js']
  plugins.push(resolve())
}

module.exports = {
  input: path.resolve(__dirname, '../js/src/index.js'),
  output: {
    banner,
    file: path.resolve(__dirname, `../dist/js/${fileDest}`),
    format: 'umd',
    globals
  },
  external,
  plugins
}
