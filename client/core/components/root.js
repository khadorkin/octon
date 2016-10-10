import React, { PropTypes } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';
import Header from './header';

const Root = ({ loading, user }) =>
  (<MuiThemeProvider>
    <div>
      <Header user={user} loading={loading} />
      {loading ? <CircularProgress />
        : <div className="container">
          Hey
        </div>}
    </div>
  </MuiThemeProvider>);

Root.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.string, // eslint-disable-line
  // TODO error handling
  user: PropTypes.object,
};

export default Root;
