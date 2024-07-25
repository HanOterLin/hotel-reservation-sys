// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        files: ["**/*.ts"],
        rules: {
            "max-len": ["error", {code: 120}],
            "semi": ["error", "always"],
        }
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
);