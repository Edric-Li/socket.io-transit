const c = ({
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 8
        },
        useBuiltIns: 'usage',
        corejs: 3,
      }
    ],
    '@babel/preset-flow',
    ...(process.env.NODE_ENV === 'production' ?
      [['minify', { mangle: false, builtIns: false }]] :
      []
    )
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties'
  ],
  overrides: [
    {
      test: ['./**/*.ts'],
      presets: [
        '@babel/preset-typescript',
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current',
            },
          },
        ]
      ],
    },
  ],
});
module.exports = c;
