module.exports = {
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "es6": true,
    "node": true,
    "jest": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "sourceType": "module"
  },
  "ecmaFeatures": {
    "destructuring": true
  },
  plugins: [
    'html', //插件，此插件用于识别文件中的js代码，没有MIME类型标识没有script标签也可以识别到，因此拿来识别.vue文件中的js代码
    'testcafe'
  ],
  "extends": "plugin:testcafe/recommended",
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": 'off',
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    'no-console': 'off',
    'no-debugger': 'off',
    "experimentalDecorators": true
  },
};
