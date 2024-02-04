/**
 * @file The eslint config.
 */
/* eslint-disable @typescript-eslint/naming-convention */
import {ConfigGenerator, mergeGlobals} from "@logicer/eslint-plugin";
import globals from "globals";

const generator = new ConfigGenerator({
  javascript: true,
  jsdoc: true,
  prettier: true,
  svelte: true,
  typescript: true
});

/**
 * @type {import("eslint").Linter.FlatConfigFileSpec[]}
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
 * @type {import("eslint").Linter.FlatConfig[]}
 */
const svelteConfigs = [
  {
    languageOptions: {
      globals: mergeGlobals(globals.browser, globals.es2017, globals.node),
      parserOptions: {
        ecmaVersion: 2020,
        extraFileExtensions: [".svelte"],
        project: ["./tsconfig.json", "./tsconfig.*.json"],
        sourceType: "module"
      }
    }
  },
  {
    files: ["src/**/*"],
    rules: {
      "import/no-unresolved": [
        "error",
        {
          // Regex
          ignore: [
            "\\$app/environment",
            "\\$app/forms",
            "\\$app/navigation",
            "\\$app/paths",
            "\\$app/stores",
            "\\$env/dynamic/private",
            "\\$env/dynamic/public",
            "\\$env/static/private",
            "\\$env/static/public",
            "\\$service-worker"
          ]
        }
      ],
      "n/no-missing-import": "off",
      "n/prefer-global/process": ["error", "always"]
    }
  }
];

/**
 * @type {import("eslint").Linter.FlatConfig[]}
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
