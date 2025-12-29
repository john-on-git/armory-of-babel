// @ts-check

import * as eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export default [
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      "quote-props": [
        "error",
        "consistent-as-needed",
        {
          unnecessary: true,
        }
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true
        }
      ]
    },
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname
      }
    }
  }
];