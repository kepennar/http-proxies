import Card from 'preact-material-components/Card';
import List from 'preact-material-components/List';

import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/List/style.css';

import style from './style';

const hideThis = ['uuid', 'context', 'target'];

const Transforms = ({ conf }) => (
  <div class={style.transforms}>
    <div class={style.arrow} />
    {Object.entries(conf)
      .filter(([key]) => !hideThis.includes(key))
      .map(([key, value]) => (
        <div>
          <span>{key}</span> <span>{value}</span>
        </div>
      ))}
  </div>
);

export default ({ conf }) => (
  <div class={style.container}>
    <Card className={style.card}>
      <div class={style.cardHeader}>
        <h2 class=" mdc-typography--title">Sources</h2>
      </div>
      <div class={style.cardBody}>
        <List>{conf.context.map(c => <List.Item>{c}</List.Item>)}</List>
      </div>
    </Card>
    <Transforms conf={conf} />
    <Card className={style.card}>
      <div class={style.cardHeader}>
        <h2 class=" mdc-typography--title">Target</h2>
      </div>
      <div class={style.cardBody}>{conf.target}</div>
    </Card>
  </div>
);
