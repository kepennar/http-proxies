import { h, Component } from 'preact';
import Dialog from 'preact-material-components/Dialog';
import FormField from 'preact-material-components/FormField';
import TextField from 'preact-material-components/TextField';
import Button from 'preact-material-components/Button';
import LayoutGrid from 'preact-material-components/LayoutGrid';

import Conf from '../../domain/Conf';

import 'preact-material-components/Dialog/style.css';
import 'preact-material-components/FormField/style.css';
import 'preact-material-components/TextField/style.css';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/LayoutGrid/style.css';

import style from './style';

export default class ConfFormDialog extends Component {
  constructor() {
    super();
    this.state = {
      conf: {
        context: '',
        target: '',
        transforms: '{}'
      },
      errors: {}
    };
  }
  show() {
    this.formDialog.MDComponent.show();
  }
  hide() {
    this.formDialog.MDComponent.close();
  }

  setFieldValue(fieldName, value) {
    this.setState({ conf: { ...this.state.conf, [fieldName]: value } });
  }

  get conf() {
    return {
      context: this.state.conf.context.split(',').map(c => c.trim()),
      target: this.state.conf.target,
      ...JSON.parse(this.state.conf.transforms.replace('\n', ''))
    };
  }

  render({ errors, createConf }, { conf }) {
    const error = errors
      ? errors.map(err => <div>{JSON.stringify(err)}</div>)
      : null;

    return (
      <Dialog
        ref={formDialog => {
          this.formDialog = formDialog;
        }}
      >
        <Dialog.Header className={style.header}>
          Create a new conf
        </Dialog.Header>
        <Dialog.Body>
          <div class={style.error}>{error}</div>
          <LayoutGrid>
            <LayoutGrid.Inner>
              <LayoutGrid.Cell cols="6">
                <form class={style.form}>
                  <FormField className={style.field}>
                    <TextField
                      value={conf.context}
                      onInput={e =>
                        this.setFieldValue('context', e.target.value)
                      }
                      label="Context"
                      helperText="Comma separated values"
                      helperTextPersistent
                    />
                  </FormField>
                  <FormField className={style.field}>
                    <TextField
                      value={conf.target}
                      onInput={e =>
                        this.setFieldValue('target', e.target.value)
                      }
                      label="Target"
                    />
                  </FormField>
                  <FormField className={style.field}>
                    <TextField
                      value={conf.transforms}
                      onInput={e =>
                        this.setFieldValue('transforms', e.target.value)
                      }
                      textarea
                      label="Transforms"
                      helperText="Raw JSON"
                      helperTextPersistent
                    />
                  </FormField>
                </form>
              </LayoutGrid.Cell>
              <LayoutGrid.Cell cols="6">
                <h2>Preview</h2>
                <pre>
                  <code>{JSON.stringify(this.conf, null, 2)}</code>
                </pre>
              </LayoutGrid.Cell>
            </LayoutGrid.Inner>
          </LayoutGrid>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.FooterButton cancel={true}>Cancel</Dialog.FooterButton>
          <Dialog.FooterButton onClick={() => createConf(this.conf)}>
            Create
          </Dialog.FooterButton>
        </Dialog.Footer>
      </Dialog>
    );
  }
}
