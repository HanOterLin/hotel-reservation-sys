import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: "@typescript-eslint/parser",
      globals: {
      },
    },
    rules: {
      "max-len": ["error", { code: 150 }],
      "semi": ["error", "always"],
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
