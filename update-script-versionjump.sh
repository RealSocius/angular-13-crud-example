pnpm update --latest
pnpm i -D typescript@5.1
# Error 1
# https://stackoverflow.com/questions/56644864/uncaught-typeerror-webpack-require-context-is-not-a-function
sed -i 's|"main": "src/test.ts",||' angular.json
sed -i 's|"polyfills": "src/polyfills.ts",|"polyfills": ["zone.js", "zone.js/testing"],|' angular.json
