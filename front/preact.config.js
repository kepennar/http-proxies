// preact.config.js
export default function(config, env, helpers) {
  const BASE_URL = process.env.WITH_BASE ? '/management' : '';
  config.output.publicPath = BASE_URL;
}
