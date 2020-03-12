module.exports = {
    'extends': 'airbnb-base',
    'parserOptions': {
        'ecmaVersion': 8,
        'sourceType': 'module',
        'ecmaFeatures': {
            'jsx': true
        }
    },
    'env': {
        'es6': true
    },
    rules: {
        'linebreak-style': 0,
        'indent': ['error', 4],
        'no-console': 'off',
        'object-curly-spacing': 'off',
        'arrow-parens': 2,
        'semi': 2,
        'no-underscore-dangle': 'off',
        'array-callback-return': 'off',
        'consistent-return': 'off',
        'no-restricted-syntax': 'off',
        'no-shadow': 'off',
        'max-len': ['error', { 'code': 200 }],
        'no-plusplus': 'off',
        'func-names': 'off',
        'no-use-before-define': 'off',
        'no-undef': 'off',
        'strict': 'off',
        'camelcase': 'off',
        'no-fallthrough': 'off',
        'no-unused-vars': 'off',
        'refer-destructuring': 'off'
    }
};