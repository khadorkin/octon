import React, { Component, PropTypes } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';
import Header from './header';
import FirstLogin from './first-login';
import RepositoriesList from '../../repositories/containers/repositories-list';

class Root extends Component {
  constructor(props) {
    super(props);
    this.syncUserStars = this.syncUserStars.bind(this);
    this.state = {
      loading: false,
      error: null,
    };
  }

  syncUserStars() {
    const { syncUserStars } = this.props;
    this.setState({ loading: true, error: '' });
    syncUserStars().then(() => {
      this.setState({ loading: false });
    }).catch((err) => {
      this.setState({ loading: false, error: err.message });
    });
  }

  render() {
    const { loading, user, error: errorProp } = this.props;
    const { loading: loadingState, error: errorState } = this.state;
    const error = errorProp ? errorProp.message : errorState;
    return (
      <MuiThemeProvider>
        <div>
          <Header user={user} loading={loading} />
          {loading ? <CircularProgress />
            : <div className="container main-container">
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
