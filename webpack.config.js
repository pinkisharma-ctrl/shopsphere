const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  name: 'mfe1',
  filename:'remoteEntry.js',

  exposes: {
    './RemoteEntryComponent': './src/app/remote-entry/remote-entry.component.ts', 
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

});
