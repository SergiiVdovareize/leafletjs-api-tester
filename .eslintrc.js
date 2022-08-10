module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    semi: [2, 'always'],
    'no-var': 'off',
    'object-shorthand': 'off'
  },
  ignorePatterns: [
    'webapp/leaflet/'
  ]
};
