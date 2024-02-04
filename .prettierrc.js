/**
 * @file The prettier config.
 */

import logicerPrettierConfig from "@logicer/prettier-config";

/**
 * @type {import('prettier').Options}
 */
const prettierConfig = {
  ...logicerPrettierConfig,
  overrides: [{files: "*.svelte", options: {parser: "svelte"}}],
  plugins: ["prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
  svelteStrictMode: true
};

export default prettierConfig;
