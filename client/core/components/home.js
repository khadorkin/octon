import React, { Component, PropTypes } from 'react';
import { CircularProgress } from 'material-ui-build/src/Progress';
import FirstLogin from './first-login';
import RepositoriesList from '../../repositories/containers/repositories-list';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
    };
  }

  syncUserStars = () => {
    const { syncUserGithubStars } = this.props;
    this.setState({ loading: true, error: '' });
    syncUserGithubStars().then(() => {
      this.setState({ loading: false });
      // location.reload();
    }).catch((err) => {
      this.setState({ loading: false, error: err.message });
    });
  }

  render() {
    const { loading, user, error: errorProp } = this.props;
    const { loading: loadingState, error: errorState } = this.state;
    const error = errorProp ? errorProp.message : errorState;
    return (
      <div>
        {loading ? <CircularProgress />
          : <div>
            {error ? <p className="bg-danger">{error}</p> : null}
            {loadingState ? <div className="center"><CircularProgress /></div> : null}
            {!user.github.lastSync ?
              <FirstLogin syncUserStars={this.syncUserStars} loading={loadingState} />
              : <RepositoriesList user={user} />}
          </div>}
      </div>
    );
  }
}


Home.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.object,
  user: PropTypes.object,
  syncUserGithubStars: PropTypes.func.isRequired,
};

Home.defaultProps = {
  user: {},
};

export default Home;
