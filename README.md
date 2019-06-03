# OSF Linter

## Installation
Make sure your NodeJS version is up to date, as requred in `package.json` in `engines` section.

Use NVM to be able to easely install and use any version of NodeJS you need (https://github.com/coreybutler/nvm-windows for Windows or https://github.com/nvm-sh/nvm for MacOS/Linux)

Run `yarn add --dev @osf-global/linter` if you use Yarn (recommended) or `npm install --save-dev @osf-global/linter` if you use NPM

Edit your `package.json` file and add the following scripts:

```
"lint:scss": "osf-linter --linter=SCSS",
"lint:jsClient": "osf-linter --linter=JS_CLIENT",
"lint:jsServer": "osf-linter --linter=JS_SERVER",
"lint:isml": "osf-linter --linter=ISML",
"fix:scss": "stylelint --config stylelint.config.js --fix",
"fix:jsClient": "eslint --config eslint.config.js --fix",
"fix:jsServer": "eslint --config eslintServer.config.js --fix"
```

For additional help messages you can also run `./node_modules/.bin/osf-linter --help`

## Configuration
To configure OSF Linter you will need to create a new file `osflinter.config.js` next to your `package.json` file which should be at the root of your repo/project (if best practices are followed).

The contents of the `osflinter.config.js` should look like the bellow example, with each linter (see `./node_modules/.bin/osf-linter --help` for the available linters and thieir respective names) having a `...Paths` configuration, which is an array of path patterns used by the linter to check the files. See https://github.com/sindresorhus/globby#globbing-patterns for the syntax supported for the patterns.

```
module.exports.SCSS_PATHS = [
    "cartridges/app_demo/cartridge/client/*/css/**/*.scss"
];

module.exports.JS_CLIENT_PATHS = [
    "cartridges/app_demo/cartridge/client/*/js/**/*.js"
];

module.exports.JS_SERVER_PATHS = [

];
```

If needed (even tough not really recommended) you can also extend/customize the rules used by each of the supported linters.

To do so, you just need to add a new entry in `osflinter.config.js` and provide a `...Config` for each linter you want to customize.

Ex:

```
module.exports.SCSS_CONFIG = {
    rules: {
        indentation: 2
    }
};
```

This would overwride the default rule of `4` spaces for indentation used by Stylelint and set it to `2`. You can do the same for the other linters also. See their documentatin pages for the available rulles/options and the format in which they are configured.

## Integration with code editors
To integrate with the desired code editor just install the available plugins as usual. Those plugins will expect you to have a config file for each of the linters.

For example if we take Stylelint again, the Stylelint plugin for VSCode will expect you to have a `stylelint.config.js` file at the root of your project (so next to `package.json`, `osflinter.config.js`, etc.).

So, to make it work just go ahead and create the `stylelint.config.js`. The only difference is that before you would have the rules here, directly in this file. Now since you use the `OSF Linter` tool, all you need to do is paste the following into `stylelint.config.js` file:

```
module.exports = require("@osf-global/linter/stylelint/config");
```

This will actually import the base config from `OSF Linter` and will also take care of merging it with your overwrides from `osflinter.config.js` and then, further, it should work as before.

## Contributors
See https://github.com/OSFGlobal/OSF-Linter/graphs/contributors for a list of people that contributed to this project
