const connect = require('connect');
const Proxy = require('http-proxy-middleware');

const ProxiesWrapperMiddleware = require('./ProxiesWrapperMiddleware');

module.exports = function proxy(conf, middlewares = [], logger) {
  const app = connect();

  middlewares.forEach(middleware => {
    app.use(middleware);
  });
  const wrapper = new ProxiesWrapperMiddleware();
  conf.forEach(({ context, ...rules }) =>
    context.forEach(c => {
      const { rewriteHeaders, ...keep } = rules;
      const conf = { ...keep, ...proxyEventsListener(rules, logger) };
      wrapper.insert(c, Proxy(conf));
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
