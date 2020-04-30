# OSF Linter

## Installation
Make sure your NodeJS version is up to date, as requred in `package.json` in `engines` section.

Use NVM to be able to easely install and use any version of NodeJS you need (https://github.com/coreybutler/nvm-windows for Windows or https://github.com/nvm-sh/nvm for MacOS/Linux)

Run `yarn add --dev @osf-global/linter` if you use Yarn (recommended) or `npm install --save-dev @osf-global/linter` if you use NPM

Edit your `package.json` file and add the following scripts:

```
"lint:js": "osf-linter --linter=JS",
"lint:scss": "osf-linter --linter=SCSS",
"lint:isml": "osf-linter --linter=ISML",
"fix:js": "osf-fixer --fixer=JS",
"fix:scss": "osf-fixer --fixer=SCSS",
"fix:isml": "osf-fixer --fixer=ISML"
```

For additional help messages you can also run `./node_modules/.bin/osf-linter --help` or `./node_modules/.bin/osf-fixer --help`

## Configuration
To configure OSF Linter and define the list of paths to be linted you will need to create a new file `osflinter.paths.js` next to your `package.json` file which should be at the root of your repo/project (if best practices are followed).

The contents of the `osflinter.paths.js` should look like the bellow example, with each linter (see `./node_modules/.bin/osf-linter --help` for the available linters and thieir respective names) exporting an array of path patterns used by the linter to check the files. See https://github.com/sindresorhus/globby#globbing-patterns for the syntax supported for the patterns.

```
module.exports.JS = [
    "cartridges/app_demo/**/*.js",  // include all JS files from the app_demo cartridge
    "!cartridges/app_demo/cartridge/client/default/js/specific-file.js" // exclude this JavaScript file using a path pattern that begins with "!"
];

module.exports.SCSS = [
    "cartridges/app_demo/cartridge/client/*/css/**/*.scss"
];

module.exports.ISML = [
    "cartridges/app_demo/cartridge/templates/**/*.isml"
];
```


## Next you need to create these three new files next to your `package.json` file which should be at the root of your repo/project:

### `.eslintrc.js` with the following contents:

```
module.exports = require("@osf-global/linter/config/.eslintrc");
```

If you want to customize the default rules you can do that by either setting the specific properties that you want directly on the `module.exports` object or by using a variable that you then reexport.

Ex:
```
module.exports = require("@osf-global/linter/config/.eslintrc");

# Using single quotes
module.exports.rules.quotes = ["error", "single"];
```

A good example is setting up default SFCC globals and adding support of ES6 for your client side code.

Ex:
```
module.exports = require("@osf-global/linter/config/.eslintrc");
module.exports.overrides = [
    // Setting up default SFCC globals
    {
        files: ["cartridges/*/cartridge/{controllers,models,scripts}/**/*.js"],
        globals: {
            dw: true,
            customer: true,
            session: true,
            request: true,
            response: true,
            empty: true,
            PIPELET_ERROR: true,
            PIPELET_NEXT: true,
            webreferences: true
        }
    },

    // Adding support for ES6 code in the client folder for your cartridge
    {
        files: ["cartridges/*/cartridge/client/*/js/**/*.js"],
        parser: "babel-eslint",
        parserOptions: {
            ecmaVersion: 6,
            sourceType: "module",
            allowImportExportEverywhere: false
        },
        env: {
            browser: true,
            commonjs: true,
            es6: true,
            jquery: true
        },
        globals: {
            __webpack_public_path__: true
        }
    }
];
```


### `.stylelintrc.js` with the following contents:

```
module.exports = require("@osf-global/linter/config/.stylelintrc");
```

If you want to customize the default rules you can do that by either setting the specific properties that you want directly on the `module.exports` object or by using a variable that you then reexport.

Ex:
```
module.exports = require("@osf-global/linter/config/.stylelintrc");

# Using two spaces for indentation
module.exports.rules.indentation = 2;
```

### `.ismllintrc.js` with the following contents:

```
module.exports = require("@osf-global/linter/config/.ismllintrc");
```

If you want to customize the default rules you can do that by either setting the specific properties that you want directly on the `module.exports` object or by using a variable that you then reexport.

Ex:
```
module.exports = require("@osf-global/linter/config/.ismllintrc");

# Using two spaces for indentation
module.exports.rules.indent = {value: 2};
```

You can find all available rules and configurations for Isml Linter [here][url-isml-linter].

## Contributors
See https://github.com/OSFGlobal/OSF-Linter/graphs/contributors for a list of people that contributed to this project

[url-isml-linter]:  <https://www.npmjs.com/package/isml-linter>
