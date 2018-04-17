const connect = require('connect');
const Proxy = require('http-proxy-middleware');

const ProxiesWrapperMiddleware = require('./ProxiesWrapperMiddleware');
const store = require('./store');

module.exports = function proxy(middlewares = [], logger) {
  const conf = store.get('proxies');
  const app = connect();

  middlewares.forEach(middleware => {
    app.use(middleware);
  });
  const wrapper = new ProxiesWrapperMiddleware();
  conf.forEach(({ context, uuid, ...rules }) =>
    context.forEach(route => {
      const { rewriteHeaders, ...keep } = rules;
      const proxyConf = { ...keep, ...proxyEventsListener(rules, logger) };
      wrapper.insert(uuid, route, Proxy(proxyConf));
    })
  );
  app.use(wrapper.middleware());
  return { app, wrapper };
};

function proxyEventsListener(rules, logger) {
  const { rewriteHeaders } = rules;
  const listeners = {
    onProxyReq(proxyReq, req, res) {
      if (rewriteHeaders) {
        writeHeaders(proxyReq, rules.rewriteHeaders, logger);
      }
      logger.debug(
        'Proxy request to',
        `${proxyReq.agent.protocol}//${proxyReq.getHeader('host')}${
          proxyReq.path
        }`
      );
    }
  };

  return listeners;
}

function writeHeaders(proxyReq, rewriteHeadersConf, logger) {
  Object.entries(rewriteHeadersConf).forEach(([name, value]) => {
    logger.debug('Write header', name, value);
    proxyReq.setHeader(name, value);
  });
}
