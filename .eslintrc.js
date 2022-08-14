module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  plugins: [
    'es5',
  ],
  extends: [
    'standard',
    'eslint:recommended',
    'plugin:es5/no-es2015',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-var': 'off',
    'object-shorthand': 'off',
    'es5/no-arrow-functions': 'error',
    semi: [2, 'always'],
    'comma-dangle': [2, 'always-multiline'],
  },
  ignorePatterns: [
    'webapp/leaflet/',
  ],
};
