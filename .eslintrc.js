module.exports = {
  "parser": "babel-eslint",
  "root": true,
  "env": {
    "browser": false,
    "node": true,
    "es6": true
  },
  "extends": "airbnb",
  "rules": {
    "import/no-extraneous-dependencies": [2, { "devDependencies": true }]
  }
}
