import React, { Component, PropTypes } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import createPalette from 'material-ui/styles/palette';
import createMuiTheme from 'material-ui/styles/theme';
import { blue, pink } from 'material-ui/styles/colors';
import { CircularProgress } from 'material-ui/Progress';
import Header from './header';
import Settings from './../containers/settings';
import FirstLogin from './first-login';
import RepositoriesList from '../../repositories/containers/repositories-list';

class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
      settingsOpen: false,
    };
  }

  handleSettings = () => {
    this.setState({ settingsOpen: !this.state.settingsOpen });
  }

  syncUserStars = () => {
    const { syncUserStars } = this.props;
    this.setState({ loading: true, error: '' });
    syncUserStars().then(() => {
      this.setState({ loading: false });
      location.reload();
    }).catch((err) => {
      this.setState({ loading: false, error: err.message });
    });
  }

  render() {
    const palette = createPalette({
      primary: blue,
      accent: pink,
      type: 'light',
    });

    const { styleManager, theme } = MuiThemeProvider.createDefaultContext({
      theme: createMuiTheme({ palette }),
    });
    const { loading, user, error: errorProp } = this.props;
    const { loading: loadingState, error: errorState, settingsOpen } = this.state;
    const error = errorProp ? errorProp.message : errorState;
    return (
      <MuiThemeProvider theme={theme} styleManager={styleManager}>
        <div>
          <Header user={user} loading={loading} onSettings={this.handleSettings} />
          {loading ? <CircularProgress />
            : <div className="container main-container">
              <Settings open={settingsOpen} user={user} onSettings={this.handleSettings} />
              {error ? <p className="bg-danger">{error}</p> : null}
              {loadingState ? <div className="center"><CircularProgress /></div> : null}
              {!user.lastSync ?
                <FirstLogin syncUserStars={this.syncUserStars} />
                : <RepositoriesList user={user} />}
            </div>}
        </div>
      </MuiThemeProvider>
    );
  }
}


Root.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.object,
  user: PropTypes.object,
  syncUserStars: PropTypes.func.isRequired,
};

Root.defaultProps = {
  user: {},
};

export default Root;
