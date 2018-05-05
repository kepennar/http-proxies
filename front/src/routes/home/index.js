import { h, Component } from 'preact';
import ProxyConf from '../../components/ProxyConf';

import style from './style';

export default class Home extends Component {
  componentWillMount() {
    fetch('/_admin/management')
      .then(resp => resp.json())
      .then(config => {
        this.setState({ config });
      });
  }
  render(props, { config }) {
    return (
      <div class={style.home}>
        <h1>Config</h1>
        {config ? (
          config.map(conf => <ProxyConf conf={conf} />)
        ) : (
          <div>Loading ...</div>
        )}
      </div>
    );
  }
}
