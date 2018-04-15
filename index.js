#!/usr/bin/env node

const { readFile } = require('fs');
const program = require('commander');
const morgan = require('morgan');

const { generateCert, log, proxy, startServer } = require('./lib');

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
  console.log('    $ http-proxies -c your-proxies-conf.json -ls');
  console.log('');
});

program.parse(process.argv);
if (!program.conf) {
  program.outputHelp();
  return;
}

const logger = log(program.logs);

readFile(program.conf, 'utf8', async (err, confStr) => {
  if (err) {
    logger.error('Invalid conf file', program.conf);
    return;
  }

  const port = program.port || 8080;
  const conf = JSON.parse(confStr);

  const middlewares = [];
  if (program.logs) {
    middlewares.push(morgan('tiny'));
  }
  const { app, wrapper } = proxy(conf, middlewares, logger);

  if (program.managment) {
    require('./lib/management')(app, conf, wrapper);
  }

  if (program.secure) {
    const cert = await generateCert();
    startServer(app, port, logger, cert);
  } else {
    startServer(app, port, logger);
  }
});
