import React, { Component, PropTypes, cloneElement } from 'react';
import MuiThemeProvider from 'material-ui-build/src/styles/MuiThemeProvider';
import createPalette from 'material-ui-build/src/styles/palette';
import createMuiTheme from 'material-ui-build/src/styles/theme';
import { blue, pink } from 'material-ui-build/src/styles/colors';
import { CircularProgress } from 'material-ui-build/src/Progress';
import Header from './header';

class Root extends Component {
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
          {loading ? <CircularProgress />
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
};

Root.defaultProps = {
  user: {},
};

export default Root;
