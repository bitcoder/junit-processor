'use strict';

module.exports = {
  "env": {
    "browser": true,
    "node": true,
    "es6": true
  },
  "parserOptions": {
    "ecmaVersion": 2017
  },
  "extends": "eslint:recommended",
  "rules": {
    "no-extra-semi": "warn",
    "semi": ["error", "always"],
    "space-in-parens": ["error", "never"],
    "space-infix-ops": "error",
    "strict": "error"
  }
};
