import globals from "globals";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: {...globals.browser, ...globals.node} }},
  ...tseslint.configs.recommended,
];


// const globals = require('globals');
// const tseslint = require('typescript-eslint');

// /** @type {import('eslint').Linter.Config[]} */
// module.exports = [
//   {files: ["**/*.{js,mjs,cjs,ts}"]},
//   {languageOptions: { globals: {...globals.browser, ...globals.node} }},
//   ...tseslint.configs.recommended,
// ];