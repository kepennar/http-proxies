// preact.config.js
export default function(config, env, helpers) {
  const BASE_URL = process.env.NODE_ENV === 'production' ? '/management' : '/';
  config.output.publicPath = BASE_URL;
}
