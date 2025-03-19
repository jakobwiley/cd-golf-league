module.exports = api => {
  const isTest = api.env('test');
  
  // Only use babel config during tests
  if (isTest) {
    return {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript',
        ['@babel/preset-react', { runtime: 'automatic' }]
      ]
    };
  }

  // Return null to let SWC handle non-test builds
  return {};
};
