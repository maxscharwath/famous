module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:nuxt/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:tailwindcss/recommended',
    './node_modules/gts/',
  ],
  plugins: ['@typescript-eslint', 'tailwindcss'],
  rules: {
    'vue/multi-word-component-names': 0,
    'tailwindcss/no-custom-classname': 0,
    'tailwindcss/migration-from-tailwind-2': 0,
    'node/no-extraneous-import': 0,
    'node/no-unpublished-import': 0,
  },
};
