import React, { Component, PropTypes } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';
import Header from './header';

class Root extends Component {
  render() {
    const {
      loading,
      error, // eslint-disable-line
      user,
    } = this.props;
    // TODO error handling
    return (
      <MuiThemeProvider>
        <div>
          <Header user={user} loading={loading} />
          {loading ? <CircularProgress />
            : <div className="container">
              Hey
            </div>}
        </div>
      </MuiThemeProvider>
    );
  }
}

Root.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.string,
  user: PropTypes.object,
};

export default Root;
