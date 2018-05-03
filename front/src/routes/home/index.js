import { h, Component } from 'preact';
import ProxyConf from '../../components/ProxyConf';

import style from './style';

const sampleConfig = [
  {
    context: ['/google'],
    target: 'https://www.google.com',
    secure: false,
    autoRewrite: true,
    pathRewrite: {
      '^/google': '/'
    },
    rewriteHeaders: {
      Host: 'example.com'
    },
    cookieDomainRewrite: { '*': '' }
  },
  {
    context: ['/v1/app1'],
    target: 'http://localhost:1234',
    secure: false,
    pathRewrite: {
      '^/v1/app1': '/app1'
    }
  },
  {
    context: ['/app2'],
    target: 'http://localhost:4001',
    secure: false,
    changeOrigin: true,
    enforceAutoRewrite: true
  }
];

export default class Home extends Component {
  render() {
    return (
      <div class={style.home}>
        <h1>Config</h1>
        {sampleConfig.map(conf => <ProxyConf conf={conf} />)}
      </div>
    );
  }
}
