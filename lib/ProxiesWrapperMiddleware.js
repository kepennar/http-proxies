const uuid = require('uuid/v1');

module.exports = class ProxiesWrapperMiddleware {
  constructor() {
    this._middlewares = [];
  }
  insert(route, proxy) {
    const newUuid = uuid();
    this._middlewares = [
      ...this._middlewares,
      {
        uuid: newUuid,
        route,
        proxy,
        disabled: false
      }
    ];
    return newUuid;
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
        const { route, proxy, disabled } = this._middlewares[rank];
        rank++;
        if (path.indexOf(route) !== 0 || disabled) {
          return nextProxy();
        }
        proxy(req, res, nextProxy);
      };
      nextProxy();
    };
  }
  getById(uuid) {
    return this._middlewares.find(m => m.uuid === uuid);
  }

  seDisabled(uuid, disabled) {
    const proxy = this._middlewares.find(m => m.uuid === uuid);
    if (proxy) {
      proxy.disabled = disabled;
    }
  }
};
