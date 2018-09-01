module.exports = {
  "parser": "babel-eslint",
  "extends": "airbnb",
  "globals": {
    document: true,
    atom: true,
    React: true,
  },
  "rules": {
    "no-plusplus": [0],
    "react/button-has-type": [0],
    "class-methods-use-this": [0],
    "import/prefer-default-export": [0],
    "react/jsx-filename-extension": [0],
    "react/jsx-one-expression-per-line": [0]
  },
  "plugins": ["babel"]
};


// module.exports = {
//   "extends": "airbnb",
//   "parser": "babel-eslint",
//   "plugins": [
//
//    ],
//    "env": {
//     "es6": true // enables es6 features
//   },
//   "rules": {
//     "class-methods-use-this": [0],
//     "no-use-before-define": [0],
//     "no-underscore-dangle" : [0],
//     "import/prefer-default-export": [0]
//   }
// };
