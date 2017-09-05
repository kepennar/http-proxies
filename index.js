#!/usr/bin/env node

const readFile = require('fs').readFile;
const http = require('http');
const connect = require('connect');
const proxy = require('http-proxy-middleware');
const program = require('commander');

const packageVersion = require('./package.json').version;

program
  .version(packageVersion)
  .option('-c, --conf <path>', 'Config file defaults to ./proxies-conf.json')
  .option('--p, --port <path>', 'Http proxy server port. Default to 8080')
  .option('-h, --help', 'Help');

program.on('--help', () => {
  console.log('  Examples:');
  console.log('');
  console.log('    $ http-proxies --help');
  console.log('    $ http-proxies -c your-proxies-conf.json');
  console.log('');
});
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse(process.argv);

console.log('With conf', program.conf);
readFile(program.conf, 'utf8', (err, confStr) => {
  if (err) {
    console.error('Invalid conf file', program.conf);
    return;
  }

  const port = program.port || 8080;
  const conf = JSON.parse(confStr);
  const app = connect();
  conf.forEach(({ context, ...entry }) => {
    context.forEach(c => app.use(c, proxy(entry)));
  });
  http.createServer(app).listen(port, () => {
    console.log('Proxy server starder on port', port);
  });
});
