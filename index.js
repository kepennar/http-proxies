#!/usr/bin/env node

const readFile = require('fs').readFile;
const http = require('http');
const connect = require('connect');
const proxy = require('http-proxy-middleware');
const program = require('commander');
const morgan = require('morgan');

const packageVersion = require('./package.json').version;

program
  .version(packageVersion)
  .option('-c, --conf <path>', 'Config file defaults to ./proxies-conf.json')
  .option('-p, --port [path]', 'Http proxy server port. Default to 8080')
  .option('-l, --logs', 'With access log');

program.on('--help', () => {
  console.log('  Examples:');
  console.log('');
  console.log('    $ http-proxies --help');
  console.log('    $ http-proxies -c your-proxies-conf.json');
  console.log('');
});

program.parse(process.argv);
if (!program.conf) {
  program.outputHelp();
  return;	
}

readFile(program.conf, 'utf8', (err, confStr) => {
  if (err) {
    console.error('Invalid conf file', program.conf);
    return;
  }

  const port = program.port || 8080;
  const conf = JSON.parse(confStr);
  const app = connect();

  if (program.logs) {
    app.use(morgan('tiny'));
  }
  conf.forEach(({ context, ...rules }) => {
    context.forEach(c => app.use(c, proxy(rules)));
  });
  http.createServer(app).listen(port, () => {
    console.log('Proxy server starder on port', port);
  });
});
