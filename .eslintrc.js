module.exports = {
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "sourceType": "module",
    "allowImportExportEverywhere": true
  },
  "extends": "airbnb/base",
  "env": {
    "browser": true,
    "node": true,
    "jest": true
  },
  "globals": {
    "$Subtype": false,
    "$Supertype": false,
    "Class": false,
    "$ReadOnlyArray": false,
  },
  "rules": {
    // 优先使用 interface 而不是 type
    '@typescript-eslint/consistent-type-definitions': [
      "error",
      "interface"
    ],
    "max-len": ["error", {
      "code": 120,
      "tabWidth": 2,
      "ignoreComments": true,
      "ignoreStrings": true,
      "ignoreTemplateLiterals": true,
      "ignoreRegExpLiterals": true
    }],
    "no-await-in-loop": "off",
    "class-methods-use-this": "off",
    "arrow-parens": ["off"],
    "consistent-return": "off",
    "comma-dangle": "off",
    "function-paren-newline": ["error", "consistent"],
    "generator-star-spacing": "off",
    "import/no-unresolved": "error",
    "import/no-extraneous-dependencies": "off",
    "linebreak-style": "off",
    "no-console": "off",
    "no-plusplus": "off",
    "no-param-reassign": ["error", { "props": false }],
    "no-multi-assign": "off",
    "no-restricted-syntax": [
      "error",
      "LabeledStatement",
      "WithStatement"
    ],
    "no-underscore-dangle": "off",
    "no-use-before-define": "off",
    "object-curly-newline": ["error", { "consistent": true }],
    "operator-linebreak": ["error", "after"],
    "prefer-destructuring": ["error", {
      "VariableDeclarator": {
        "array": false,
        "object": true
      },
      "AssignmentExpression": {
        "array": false,
        "object": false
      }
    }],
    "promise/param-names": "error",
    "promise/always-return": "off",
    "promise/catch-or-return": "error",
    "promise/no-native": "off",
    "import/extensions": [
      "error",
      "always",
      {
        ts: "never",
        js: "never",
      }
    ],
  },
  "plugins": [
    '@typescript-eslint',
    "import",
    "promise"
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.app.dev.ts', '.app.ts', '.dev.ts', '.ts', '.app.dev.js', '.app.js', '.dev.js', '.js']
      },
    },
    polyfills: ['fetch', 'promises']
  },
};
