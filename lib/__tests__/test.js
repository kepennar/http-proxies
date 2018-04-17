const ProxiesWrapperMiddleware = require('../ProxiesWrapperMiddleware');
const store = require('../store');

describe('ProxiesWrapperMiddleware', () => {
  let wrapper;

  beforeEach(() => {
    store.init('proxies');
    wrapper = new ProxiesWrapperMiddleware(store);
  });

  it('should handle correctly one middleware chain', done => {
    const uuid = store.insert('proxies', {});
    wrapper.insert(uuid, '/', (req, res, next) => {
      req.body = 'middleware1Req';
      res.body = 'middleware1Res';
      next();
    });
    let req = { url: '/', body: 'testReq' };
    let res = { url: '/', body: 'testRes' };
    wrapper.middleware()(req, res, () => {
      expect(req.body).toEqual('middleware1Req');
      expect(res.body).toEqual('middleware1Res');
      done();
    });
  });

  it('should handle correctly two middleware chain', done => {
    const strConcatMiddleware = label => (req, res, next) => {
      req.body = `${req.body}-${label}Req`;
      res.body = `${res.body}-${label}Res`;
      next();
    };
    const uuid1 = store.insert('proxies', {});
    wrapper.insert(uuid1, '/', strConcatMiddleware('middleware1'));
    const uuid2 = store.insert('proxies', {});
    wrapper.insert(uuid2, '/', strConcatMiddleware('middleware2'));

    let req = { url: '/', body: 'testReq' };
    let res = { url: '/', body: 'testRes' };
    wrapper.middleware()(req, res, () => {
      expect(req.body).toEqual('testReq-middleware1Req-middleware2Req');
      expect(res.body).toEqual('testRes-middleware1Res-middleware2Res');
      done();
    });
  });

  it('should handle only matching path middlewares', done => {
    const strConcatMiddleware = label => (req, res, next) => {
      req.body = `${req.body}-${label}Req`;
      res.body = `${res.body}-${label}Res`;
      next();
    };

    const uuid1 = store.insert('proxies', {});
    wrapper.insert(uuid1, '/noMatching', strConcatMiddleware('shouldnt'));
    const uuid2 = store.insert('proxies', {});
    wrapper.insert(uuid2, '/', strConcatMiddleware('middleware2'));

    let req = { url: '/', body: 'testReq' };
    let res = { url: '/', body: 'testRes' };
    wrapper.middleware()(req, res, () => {
      expect(req.body).toEqual('testReq-middleware2Req');
      expect(res.body).toEqual('testRes-middleware2Res');
      done();
    });
  });
});
