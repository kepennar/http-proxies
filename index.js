#!/usr/bin/env node

const { readFile } = require('fs');
const program = require('commander');
const morgan = require('morgan');

const { store, generateCert, log, proxy, startServer } = require('./lib');

const packageVersion = require('./package.json').version;

program
  .version(packageVersion)
  .option('-c, --conf <path>', 'Config file defaults to ./proxies-conf.json')
  .option('-p, --port [path]', 'Http proxy server port. Default to 8080')
  .option('-l, --logs', 'With access log')
  .option('-s, --secure', 'With SSL (Auto generated self signed certificate)')
  .option('-m, --managment', 'Enable managment');

program.on('--help', () => {
  console.log('  Examples:');
  console.log('');
  console.log('    $ http-proxies --help');
  console.log('    $ http-proxies -c your-proxies-conf.json');
  console.log('    $ http-proxies -c your-proxies-conf.json -lsm');
  console.log('');
});

program.parse(process.argv);
if (!program.conf) {
  program.outputHelp();
  return;
}

const logger = log(program.logs);

(async () => {
  try {
    await store.initFromFile('proxies', program.conf);
  } catch (e) {
    logger.error('Invalid conf file', program.conf);
    return;
  }
  const port = program.port || 8080;

  const middlewares = [];
  if (program.logs) {
    middlewares.push(morgan('tiny'));
  }
  const { app, wrapper } = proxy(middlewares, logger);

  if (program.managment) {
    require('./lib/management')(app, wrapper);
  }

  if (program.secure) {
    const cert = await generateCert();
    startServer(app, port, logger, cert);
  } else {
    startServer(app, port, logger);
  }
})();
