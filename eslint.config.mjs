import globals from "globals";
import tseslint from "typescript-eslint";
import json from "@eslint/json";
import prettier from "eslint-plugin-prettier";
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from "eslint-plugin-unused-imports";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      globals: [globals.node, globals.jest],
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      }
    },
    plugins: {
      ts: tseslint.plugin,
      'unused-imports': unusedImports,
      'simple-import-sort': simpleImportSort,
      prettier,
    },
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
    ],
    rules: {
      "unused-imports/no-unused-imports": "error",
      "simple-import-sort/imports": "error",
      "prettier/prettier": "error",
    }
  },
  {
    files: ["src/**/*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"]
  },
]);
