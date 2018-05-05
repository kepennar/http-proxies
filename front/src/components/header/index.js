import { h, Component } from 'preact';
import { route } from 'preact-router';
import Toolbar from 'preact-material-components/Toolbar';
import Switch from 'preact-material-components/Switch';
import FormField from 'preact-material-components/FormField';

import Logo from '../Logo';

import 'preact-material-components/Toolbar/style.css';
import 'preact-material-components/Switch/style.css';
import 'preact-material-components/FormField/style.css';

import style from './style.scss';

export default class Header extends Component {
  componentDidMount() {
    this.toggleDarkTheme();
  }

  toggleDarkTheme = () => {
    this.setState(
      {
        darkThemeEnabled: !this.state.darkThemeEnabled
      },
      () => {
        if (this.state.darkThemeEnabled) {
          document.body.classList.add('mdc-theme--dark');
        } else {
          document.body.classList.remove('mdc-theme--dark');
        }
      }
    );
  };

  render() {
    const { darkThemeEnabled } = this.state;
    return (
      <div>
        <Toolbar className={style.toolbar}>
          <Toolbar.Row>
            <Toolbar.Section align-start>
              <Logo className={style.logo} />
            </Toolbar.Section>
            <Toolbar.Section align-end>
              <FormField className="field-darkmode">
                Dark theme
                <Switch
                  checked={darkThemeEnabled}
                  onClick={this.toggleDarkTheme}
                />
              </FormField>
            </Toolbar.Section>
          </Toolbar.Row>
        </Toolbar>
      </div>
    );
  }
}
