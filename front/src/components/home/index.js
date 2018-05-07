import { h, Component } from 'preact';
import Fab from 'preact-material-components/Fab';

import ProxyConf from '../../components/ProxyConf';
import ConfFormDialog from '../../components/ConfFormDialog';
import Conf from '../../domain/Conf';

import 'preact-material-components/Fab/style.css';
import style from './style';

export default class Home extends Component {
  componentWillMount() {
    this.fetchConfigs();
  }

  fetchConfigs() {
    Conf.configs.then(configs => {
      this.setState({ configs });
    });
  }

  createConf(conf) {
    const afterConfCreation = () => {
      this.fetchConfigs();
      this.confFormDialog.hide();
    };
    Conf.createNewConf(conf)
      .then(afterConfCreation)
      .catch(({ error }) => {
        this.setState({ errors: error });
      });
  }
  render(props, { configs, errors }) {
    return (
      <div class={style.home}>
        <h1>Config</h1>
        <Fab ripple={true} onClick={() => this.confFormDialog.show()}>
          Add
        </Fab>
        {configs ? (
          configs.map(conf => <ProxyConf conf={conf} />)
        ) : (
          <div>Loading ...</div>
        )}

        <ConfFormDialog
          ref={confFormDialog => {
            this.confFormDialog = confFormDialog;
          }}
          errors={errors}
          createConf={conf => this.createConf(conf)}
        />
      </div>
    );
  }
}
