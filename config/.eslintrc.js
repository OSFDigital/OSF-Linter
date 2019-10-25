module.exports = {
    root: true,
    extends: "eslint:recommended",
    env: {
        commonjs: true,
        es6: true
    },
    globals: {},
    rules: {
        "array-bracket-spacing": ["error", "never"],
        "comma-spacing": ["error", { before: false, after: true }],
        "eol-last": ["error", "always"],
        "func-style": "off",
        "global-require": "off",
        indent: ["error", 4, { SwitchCase: 1 }],
        "keyword-spacing": ["error", { before: true, after: true }],
        "linebreak-style": ["error", "unix"],
        "no-bitwise": "off",
        "no-plusplus": "off",
        "no-unneeded-ternary": "off",
        "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        "prefer-const": "off",
        "prefer-spread": "off",
        quotes: ["error", "double"],
        radix: ["error", "always"],
        semi: ["error", "always"],
        "space-before-blocks": ["error", "always"],
        "space-before-function-paren": ["error", { anonymous: "always", named: "never", asyncArrow: "always" }],
        "space-in-parens": ["error", "never"],
        strict: ["error", "global"]
    }
};
