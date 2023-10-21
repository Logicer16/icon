import logicerPrettierConfig from "@logicer/prettier-config";

/**
 * @type {import('prettier').Options}
 */
const prettierConfig = {
  ...logicerPrettierConfig,
  plugins: ["prettier-plugin-svelte"],
  overrides: [{files: "*.svelte", options: {parser: "svelte"}}],
  svelteStrictMode: true
};

export default prettierConfig;
