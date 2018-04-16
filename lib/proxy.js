const connect = require('connect');
const Proxy = require('http-proxy-middleware');

module.exports = function proxy(conf, middlewares = [], logger) {
  const app = connect();

  middlewares.forEach(middleware => {
    app.use(middleware);
  });
  conf.forEach(({ context, ...rules }) =>
    context.forEach(c => {
      const { rewriteHeaders, ...keep } = rules;
      const conf = { ...keep, ...proxyEventsListener(rules, logger) };

      app.use(c, Proxy(conf));
    })
  );
  return app;
};

function proxyEventsListener(rules, logger) {
  const listeners = {};

  if (rules.rewriteHeaders) {
    const { rewriteHeaders } = rules;

    const onProxyReq = (proxyReq, req, res) => {
      writeHeaders(proxyReq, rewriteHeaders, logger);
    };
    listeners.onProxyReq = onProxyReq;
  }

  return listeners;
}

function writeHeaders(proxyReq, rewriteHeadersConf, logger) {
  Object.entries(rewriteHeadersConf).forEach(([name, value]) => {
    logger.debug('Write header', name, value);
    proxyReq.setHeader(name, value);
  });
}
