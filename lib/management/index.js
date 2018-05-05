const url = require('url');
const connectRoute = require('connect-route');
const serveStatic = require('serve-static');
const bodyParser = require('body-parser');
const Proxy = require('http-proxy-middleware');

const { validateProxy } = require('./schema');
const store = require('../store');

const FRONT = '/management';
const ROUTE = '/_admin/management';

function jsonContentTypeRes(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  next();
}

module.exports = function(app, wrapper) {
  const managementRouter = connectRoute(router => {
    router.get('/', function(req, res, next) {
      const datas = store.get('proxies');
      return res.end(JSON.stringify(datas));
    });

    router.post('/', function(req, res, next) {
      const { error, value } = validateProxy(req.body);
      if (error) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: error.details }));
      }
      let ids = [];
      value.conf.context.forEach(route => {
        const uuid = store.insert('proxies', value.conf);
        wrapper.insert(uuid, route, Proxy(value.conf));
        ids = [...ids, uuid];
      });
      return res.end(JSON.stringify({ ids }));
    });

    router.get('/:uuid', function(req, res, next) {
      const proxy = store.getById('proxies', req.params.uuid);
      if (proxy) {
        return res.end(JSON.stringify(proxy));
      } else {
        res.statusCode = 404;
        res.end();
      }
    });
    router.delete('/:uuid', function(req, res, next) {
      const uuid = req.params.uuid;
      wrapper.delete(uuid);
      store.delete('proxies', uuid);
      res.statusCode = 204;
      res.end();
    });

    router.post('/:uuid/disable', function(req, res, next) {
      store.seDisabled('proxies', req.params.uuid, true);

      return res.end(JSON.stringify({ status: 'done' }));
    });

    router.post('/:uuid/enable', function(req, res, next) {
      store.seDisabled('proxies', req.params.uuid, false);

      return res.end(JSON.stringify({ status: 'done' }));
    });
  });

  app.use(FRONT, serveStatic('front/build'));
  app.use(ROUTE, bodyParser.json());
  app.use(ROUTE, jsonContentTypeRes);
  app.use(ROUTE, managementRouter);
};
