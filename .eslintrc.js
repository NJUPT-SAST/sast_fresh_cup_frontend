module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'import/extensions': ['warn', 'always', {
      js: 'airbnb',
      vue: 'airbnb',
    }],
    'no-unused-vars': [1, {
      vars: 'local',
      args: 'none',
    }],
    indent: [2, 2],
    'linebreak-style': 'off',
    'no-nested-ternary': 'off',
    radix: 'off',
    'no-plusplus': 'off',
    'no-param-reassign': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
