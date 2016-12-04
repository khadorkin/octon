import React, { Component, PropTypes, cloneElement } from 'react';
import MuiThemeProvider from 'material-ui-build/src/styles/MuiThemeProvider';
import createPalette from 'material-ui-build/src/styles/palette';
import createMuiTheme from 'material-ui-build/src/styles/theme';
import { blue, pink } from 'material-ui-build/src/styles/colors';
import Header from './header';
import Overlay from './overlay';

class Root extends Component {
  componentWillReceiveProps({ user }) {
    if (user) {
      if (!user.docker) {
        // If user have github lastSync don't poll
        if (user.github.lastSync) {
          this.props.stopPolling();
        }
      } else if (!user.docker.lastSync) {
        this.props.startPolling(5000);
      } else if (user.docker.lastSync) {
        this.props.stopPolling();
      }
    }
  }

  handleSettings = () => {
    this.props.router.replace('/settings');
  }

  render() {
    const neon = blue;
    neon['500'] = '#1fe8af';
    const palette = createPalette({
      primary: neon,
      accent: pink,
      type: 'light',
    });

    const { styleManager, theme } = MuiThemeProvider.createDefaultContext({
      theme: createMuiTheme({ palette }),
    });
    const { loading, user, children } = this.props;
    return (
      <MuiThemeProvider theme={theme} styleManager={styleManager}>
        <div>
          <Header user={user} loading={loading} onSettings={this.handleSettings} />
          {loading ? <Overlay text={'Loading app...'} loading />
            : cloneElement(children, { user })}
        </div>
      </MuiThemeProvider>
    );
  }
}


Root.propTypes = {
  children: PropTypes.node,
  loading: PropTypes.bool,
  user: PropTypes.object,
  router: PropTypes.object,
  startPolling: PropTypes.func.isRequired,
  stopPolling: PropTypes.func.isRequired,
};

Root.defaultProps = {
  user: {},
};

export default Root;
