/**
 * @file The eslint config.
 */
/* eslint-disable @typescript-eslint/naming-convention */
import {ConfigGenerator, mergeGlobals} from "@logicer/eslint-plugin";
import globals from "globals";

/**
 * @type {import("@logicer/eslint-plugin").ConfigOptions}
 */
export const options = {
  ecmaVersion: 2022,
  javascript: true,
  jsdoc: true,
  prettier: true,
  sourceFiles: ["src/**/*"],
  svelte: true,
  tailwind: true,
  typescript: true
};

const generator = new ConfigGenerator(options);

/**
 * @type {import("@logicer/eslint-plugin").FileSpec[]}
 */
const ignores = [
  "node_modules/**/*",
  "build/**/*",
  ".svelte-kit/**/*",
  "package/**/*",
  ".type-coverage/**/*",

  "**/.DS_Store",
  "**/.env",
  "**/.env.*",
  "**/!.env.example",
  "**/svelte.config.js",
  "**/.eslintrc.cjs",
  "**/pnpm-lock.yaml",
  "**/package-lock.json",
  "**/yarn.lock",
  "**/vite.config.js.timestamp-*",
  "**/vite.config.ts.timestamp-*",
  "**/.eslint_report.json",
  "**/*.tsbuildinfo",
  "**/.eslintcache"
];

/**
 * @type {import("@logicer/eslint-plugin").FlatConfig[]}
 */
const svelteConfigs = [
  {
    languageOptions: {
      globals: mergeGlobals(globals.browser, globals.es2020, globals.node),
      parserOptions: {
        extraFileExtensions: [".svelte"],
        project: ["./tsconfig.json", "./tsconfig.*.json"],
        sourceType: "module"
      }
    }
  }
];

/**
 * @type {import("@logicer/eslint-plugin").FlatConfig[]}
 */
const config = [
  {ignores},
  {
    settings: {
      "import/parsers": {
        // Temporary until https://github.com/import-js/eslint-plugin-import/pull/2829
        espree: [".js", ".jsx", ".cjs", ".mjs"]
      },
      "import/resolver": {
        typescript: {
          project: ["tsconfig.json", "tsconfig.eslint.json"]
        }
      }
    }
  },
  ...(await generator.config),
  ...svelteConfigs,
  ...(await generator.endConfig)
];

export default config;
