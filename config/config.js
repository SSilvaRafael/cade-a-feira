var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'projetokepler'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/projetokepler-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'projetokepler'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/projetokepler-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'projetokepler'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/projetokepler-production'
  }
};

module.exports = config[env];
