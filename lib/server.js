const http = require('http');
const https = require('https');

module.exports = function startServer(app, port, logger, cert) {
  const displayStartingMessage = () => {
    const message = `${
      !!cert ? 'HTTPS' : 'HTTP'
    } proxy server starder on port ${port}`;
    logger.log(message);
  };
  if (cert) {
    https
      .createServer({ key: cert.serviceKey, cert: cert.certificate }, app)
      .listen(port, displayStartingMessage);
  } else {
    http.createServer(app).listen(port, displayStartingMessage);
  }
};
