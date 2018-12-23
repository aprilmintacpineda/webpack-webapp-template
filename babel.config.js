module.exports = {
  'comments': false,
  'presets': [
    '@babel/preset-env',
    '@babel/preset-flow',
    'minify'
  ],
  'plugins': [
    'babel-plugin-inferno',
    '@babel/plugin-syntax-jsx',
    '@babel/plugin-syntax-dynamic-import'
  ]
};
