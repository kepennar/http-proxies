const store = require('./store');

module.exports = class ProxiesWrapperMiddleware {
  constructor() {
    this._middlewares = [];
  }

  insert(uuid, route, proxy) {
    this._middlewares = [
      ...this._middlewares,
      {
        uuid,
        route,
        proxy
      }
    ];
  }

  delete(uuidToBeDeleted) {
    this._middlewares = this._middlewares.filter(
      ({ uuid }) => uuid !== uuidToBeDeleted
    );
  }

  middleware() {
    return (req, res, next) => {
      const path = req.originalUrl || req.url;
      let rank = 0;

      const nextProxy = () => {
        if (rank === this._middlewares.length) {
          return next();
        }
        const { uuid, route, proxy } = this._middlewares[rank];
        const { disabled } = this.getConf(uuid);
        rank++;
        if (disabled || path.indexOf(route) !== 0) {
          return nextProxy();
        }
        proxy(req, res, nextProxy);
      };
      nextProxy();
    };
  }

  getConf(uuid) {
    return store.getById('proxies', uuid);
  }
};
