const defaultConfig = {
    rules: {
        // Line by line rules;
        "enforce-isprint": {},
        "enforce-require": {},
        "no-git-conflict": {},
        "no-import-package": {},
        "no-inline-style": {},
        "no-isscript": {},
        "no-space-only-lines": {},
        "no-tabs": {},
        "no-trailing-spaces": {},

        // Tree rules;
        indent: {},
        "leading-iscontent": {},
        "max-depth": {},
        "no-embedded-isml": {},
        "no-hardcode": {},
        "no-require-in-loop": {},
        "one-element-per-line": {}
    }
};

const { getConfig } = require("../util");
module.exports = getConfig("ISML", defaultConfig);
