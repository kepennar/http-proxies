const pem = require('pem');
const { promisify } = require('util');

const createCertificate = promisify(pem.createCertificate);

module.exports = function generateCert() {
  return createCertificate({ days: 1, selfSigned: true });
};
