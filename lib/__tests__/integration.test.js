const http = require('http');
const chai = require('chai');
const chaiHttp = require('chai-http');

const store = require('../store');
const proxy = require('../proxy');
const startServer = require('../server');
const log = require('../logs');

chai.use(chaiHttp);

const logger = log(true);
const STOP_CALLBACKS = [];

describe('Integration tests', () => {
  describe('Test tooling', () => {
    it('should start a test server', async () => {
      const confs = [
        { port: 8791, text: 'testServer1' },
        { port: 8792, text: 'testServer2' }
      ];
      runServers(confs);

      const resp1 = await chai.request('http://localhost:8791').get('/');
      chai.expect(resp1).to.have.status(200);
      chai.expect(resp1.text).to.equal('testServer1');

      const resp2 = await chai.request('http://localhost:8792').get('/');
      chai.expect(resp2).to.have.status(200);
      chai.expect(resp2.text).to.equal('testServer2');
    });
  });

  describe('Proxy', () => {
    it('should proxify one single server', async () => {
      const confs = [{ port: 8791, text: 'proxiedTestServer1' }];
      runServers(confs);

      const proxyConf = [
        {
          context: ['/test1'],
          target: 'http://localhost:8791',
          secure: false,
          pathRewrite: {
            '^/test1': '/'
          }
        }
      ];
      store.init('proxies', proxyConf);
      const { app } = proxy([], logger);
      const server = startServer(app, 8888, logger);
      addServer(server);

      const resp1 = await chai.request('http://localhost:8888').get('/test1');
      chai.expect(resp1).to.have.status(200);
      chai.expect(resp1.text).to.equal('proxiedTestServer1');
    });

    it('should proxify multiple servers', async () => {
      const confs = [
        { port: 8791, text: 'proxiedTestServer1' },
        { port: 8792, text: 'proxiedTestServer2' },
        { port: 8793, text: 'proxiedTestServer3' }
      ];
      runServers(confs);

      const proxyConf = [
        {
          context: ['/test1'],
          target: 'http://localhost:8791',
          secure: false,
          pathRewrite: {
            '^/test1': '/'
          }
        },
        {
          context: ['/test2'],
          target: 'http://localhost:8792',
          secure: false,
          pathRewrite: {
            '^/test2': '/'
          }
        },
        {
          context: ['/test3'],
          target: 'http://localhost:8793',
          secure: false,
          pathRewrite: {
            '^/test3': '/'
          }
        }
      ];
      store.init('proxies', proxyConf);
      const { app } = proxy([], logger);
      const server = startServer(app, 8888, logger);
      addServer(server);

      const resp1 = await chai.request('http://localhost:8888').get('/test2');
      chai.expect(resp1).to.have.status(200);
      chai.expect(resp1.text).to.equal('proxiedTestServer2');

      const resp2 = await chai.request('http://localhost:8888').get('/test1');
      chai.expect(resp2).to.have.status(200);
      chai.expect(resp2.text).to.equal('proxiedTestServer1');

      const resp3 = await chai.request('http://localhost:8888').get('/test3');
      chai.expect(resp3).to.have.status(200);
      chai.expect(resp3.text).to.equal('proxiedTestServer3');

      const noContentResp = await chai
        .request('http://localhost:8888')
        .get('/unknown');
      chai.expect(noContentResp).to.have.status(404);
    });
  });

  afterEach(() => {
    return stopAllServers();
  });
});

function runServers(serverConfs) {
  serverConfs.forEach(({ port, text }) => runServer(port, text));
}
function runServer(port, text) {
  const server = http
    .createServer(function(req, res) {
      res.setHeader('content-type', 'text/plain');
      res.write(text);
      res.end();
    })
    .listen(port);
  addServer(server);
}
function addServer(server) {
  STOP_CALLBACKS.push(() => {
    return new Promise(resolve => {
      server.close(resolve);
    });
  });
}
function stopAllServers() {
  const promises = STOP_CALLBACKS.map(stop => stop());
  return Promise.all(promises);
}
