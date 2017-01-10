
'use strict';

const express = require('express');
const yaml = require('js-yaml');
const fs = require('fs');
const debug = require('debug')('restfulmodel-copy:app');
const http = require('http');
const swaggerTools = require('swagger-tools');
const mongojs = require('mongojs');

debug('making App...');

function App(config) {
  const self = this;

  self.main = {
    name: 'NEWAPP',
    config: config,
    db: mongojs(config.get('db.url'), config.get('db.collections')),
  };

  return new Promise((resolve, reject) => {
    self.swaggerDocs()
      .then(() => {
        return self.getApp();
      })
      .then(() => {
        return self.libs();
      })
      .then(() => {
        return self.controllers();
      })
      .then(() => {
        return self.swaggerize();
      })
      .then (()=>{
        resolve(self.main);
      })
      .catch((e) => {
        console.log(e);
      });
  });
}

App.prototype.swaggerDocs = function () {
  debug('swaggerDocs...');
  const self = this;

  return new Promise((resolve, reject) => {
    try {
      const doc = yaml.safeLoad(fs.readFileSync('./api/swagger/swagger.yaml', 'utf8'));
      self.main.swaggerDocs = doc;
      self.main.swaggerDocs.basePath = self.main.config.get('service.pathname');
      resolve({ swaggerDocs: self.main.swaggerDocs });
    } catch (e) {
      console.log(e);
    }
  });
};

App.prototype.getApp = function () {
  debug('getApp...');
  const self = this;

  return new Promise((resolve, reject) => {
    self.main.app = express();
    self.main.app.set('trust proxy', 1);
    self.main.server = http.createServer(self.main.app);
    resolve({ express: self.main.express, server: self.main.server });
  });
}

App.prototype.libs = function () {
  const self = this;

  return new Promise((resolve, reject) => {
    self.main.libs = {};
    self.main.libs.users = require('./api/libs/Users')(self.main);
    resolve();
  });
};

App.prototype.controllers = function () {
  debug('Controllers...')
  const self = this;

  return new Promise((resolve, reject) => {
    self.main.controller = require ('./api/controllers')(self.main);
    resolve();
  });
};

App.prototype.swaggerize = function () {
  debug('swaggerize...')
  const self = this;
  const app = self.main.app;
  const options = {
    controllers: self.main.controller,
    apiDocs: self.main.swaggerDocs.basePath + '/api-docs',
    swaggerUi: self.main.swaggerDocs.basePath + '/docs',
  };

  return new Promise((resolve, reject) => {

    swaggerTools.initializeMiddleware(self.main.swaggerDocs, function (middleware) {
      // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
      app.use(middleware.swaggerMetadata());

      // Validate Swagger requests
      app.use(middleware.swaggerValidator());

      // Route validated requests to appropriate controller
      app.use(middleware.swaggerRouter(options));

      // Serve the Swagger documents and Swagger UI
      app.use(middleware.swaggerUi(options));
    });
    resolve();
  });
};

module.exports = App;
