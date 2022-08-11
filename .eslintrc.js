module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  plugins: [
    'es5'
  ],
  extends: [
    'standard',
    'eslint:recommended',
    'plugin:es5/no-es2015'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    semi: [2, 'always'],
    'no-var': 'off',
    'object-shorthand': 'off',
    'es5/no-arrow-functions': 'error'
  },
  ignorePatterns: [
    'webapp/leaflet/'
  ]
};
