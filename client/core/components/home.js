import React, { Component, PropTypes } from 'react';
import { CircularProgress } from 'material-ui-build/src/Progress';
import FirstLogin from './first-login';
import RepositoriesList from '../../repositories/containers/repositories-list';
import RepositoryContent from '../../repositories/containers/repository-content';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
      selectedId: null,
    };
  }

  syncUserStars = () => {
    const { syncUserGithubStars } = this.props;
    this.setState({ loading: true, error: '' });
    syncUserGithubStars().then(() => {
      this.setState({ loading: false });
    }).catch((err) => {
      this.setState({ loading: false, error: err.message });
    });
  }

  handleItemSelect = (id) => {
    this.setState({ selectedId: id });
  }

  render() {
    const { loading, user, error: errorProp } = this.props;
    const { loading: loadingState, error: errorState, selectedId } = this.state;
    const error = errorProp ? errorProp.message : errorState;
    return (
      <div>
        {loading ? <CircularProgress />
          : <div>
            {error ? <p className="bg-danger">{error}</p> : null}
            {loadingState ? <div className="center"><CircularProgress /></div> : null}
            {!user.github.lastSync ?
              <FirstLogin syncUserStars={this.syncUserStars} loading={loadingState} />
              : <div>
                <RepositoriesList
                  user={user}
                  selectedId={selectedId}
                  onItemSelect={this.handleItemSelect}
                />
                <RepositoryContent repositoryId={selectedId} />
              </div>}
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
