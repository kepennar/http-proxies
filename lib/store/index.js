const { promisify } = require('util');
const fs = require('fs');
const clone = require('clone');
const uuid = require('uuid/v1');

const readFile = promisify(fs.readFile);

const store = {};
module.exports = {
  async initFromFile(collectionName, path) {
    const confStr = await readFile(path, 'utf8');
    this.init(collectionName, JSON.parse(confStr));
  },
  init(collectionName, initDatas = []) {
    store[collectionName] = initDatas.map(item => ({
      uuid: uuid(),
      ...item
    }));
  },
  get(collectionName) {
    return clone(store[collectionName]);
  },
  insert(collectionName, obj) {
    const newUuid = uuid();
    store[collectionName] = [
      ...this.get(collectionName),
      { uuid: newUuid, ...obj }
    ];
    return newUuid;
  },
  getById(collectionName, id) {
    const item = this.get(collectionName).find(({ uuid }) => uuid === id);
    return clone(item);
  },
  delete(collectionName, id) {
    store[collectionName] = store[collectionName].filter(
      ({ uuid }) => uuid !== id
    );
  },

  seDisabled(collectionName, id, disabled) {
    const item = store[collectionName].find(({ uuid }) => uuid === id);
    if (item) {
      item.disabled = disabled;
    }
  }
};
