import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        files: ["**/*.ts", "**/*.tsx"],
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.recommended,
            ...tseslint.configs.strict,
            ...tseslint.configs.stylistic,
        ],
        ignores: ['**/*.js', 'build'],
        rules: {
            "max-len": ["error", {code: 120}],
            "semi": ["error", "always"],
        }
    }
);