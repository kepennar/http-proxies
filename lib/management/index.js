const url = require('url');
const connectRoute = require('connect-route');
const bodyParser = require('body-parser');
const Proxy = require('http-proxy-middleware');

const { validateProxy } = require('./schema');

const ROUTE = '/_admin/management';

function jsonContentTypeRes(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  next();
}

module.exports = function(app, conf, wrapper) {
  const getInfos = ({ route, uuid, disabled }) => ({
    uuid,
    path: route,
    disabled,
    conf: conf.find(({ context }) => context.includes(route))
  });

  const managementRouter = connectRoute(router => {
    router.get('/', function(req, res, next) {
      const datas = wrapper._middlewares.map(getInfos);
      return res.end(JSON.stringify(datas));
    });

    router.post('/', function(req, res, next) {
      const { error, value } = validateProxy(req.body);
      if (error) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: error.details }));
      }
      const uuid = wrapper.insert(value.route, Proxy(value.conf));
      return res.end(JSON.stringify({ uuid }));
    });

    router.get('/:uuid', function(req, res, next) {
      const proxy = wrapper.getById(req.params.uuid);
      if (proxy) {
        const proxyInfos = getInfos(proxy);

        return res.end(JSON.stringify(proxyInfos));
      } else {
        res.statusCode = 404;
        res.end();
      }
    });
    router.delete('/:uuid', function(req, res, next) {
      wrapper.delete(req.params.uuid);

      res.statusCode = 204;
      res.end();
    });

    router.post('/:uuid/disable', function(req, res, next) {
      wrapper.seDisabled(req.params.uuid, true);

      return res.end(JSON.stringify({ status: 'done' }));
    });

    router.post('/:uuid/enable', function(req, res, next) {
      wrapper.seDisabled(req.params.uuid, false);

      return res.end(JSON.stringify({ status: 'done' }));
    });
  });
  app.use(ROUTE, bodyParser.json());
  app.use(ROUTE, jsonContentTypeRes);
  app.use(ROUTE, managementRouter);
};
