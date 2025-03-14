import { FlatCompat } from "@eslint/eslintrc";
import unusedImports from "eslint-plugin-unused-imports";

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next"],
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-page-custom-font": "off",
      "no-console": "error", // Warns on console.log usage
      "no-unused-vars": ["error"], // Warns for unused variables
      "no-undef": "error", // Disallows undefined variables
      "unused-imports/no-unused-imports": "error", // Warns on unused imports
      "unused-imports/no-unused-vars": ["error"],
    },
    ignorePatterns: [
      ".next/",
      "node_modules/",
      ".git/",
      "*.min.js",
      "*.test.js",
      "*.spec.js",
      "*.mjs",
    ],
  }),
  {
    plugins: {
      "unused-imports": unusedImports,
    },
  },
];

export default eslintConfig;
