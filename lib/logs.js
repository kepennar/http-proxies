const chalk = require('chalk');

const prefix = chalk.bold.blue;
const error = chalk.red;

module.exports = function(enabled) {
  return {
    log(txt, ...more) {
      console.log(prefix('[HPS]'), txt, ...more);
    },
    debug(txt, ...more) {
      if (enabled) {
        console.log(prefix('[HPS]'), txt, ...more);
      }
    },
    error(txt, ...more) {
      console.error(prefix('[HPS]'), error(txt), ...more);
    }
  };
};
