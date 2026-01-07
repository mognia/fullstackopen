import js from "@eslint/js";
import globals from "globals";

export default [
    js.configs.recommended,
    {
        files: ["**/*.js"],
        languageOptions: {
            sourceType: "commonjs",     // Tells ESLint you are using 'require' (CommonJS)
            globals: {
                ...globals.node,          // Adds Node.js globals like 'process' and 'require'
            },
        },
        rules: {
            "indent": ["error", 2],
            "linebreak-style": ["error", "unix"],
            "quotes": ["error", "single"],
            "semi": ["error", "never"],
            "no-unused-vars": ["warn"],
            "no-console": "off",        // Allows console.log in the backend
        },
    },
];