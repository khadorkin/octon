import React, { Component, PropTypes } from 'react';
import { CircularProgress } from 'material-ui-build/src/Progress';
import Overlay from './overlay';
import RepositoriesList from '../../repositories/containers/repositories-list';
import RepositoryContent from '../../repositories/containers/repository-content';
import Settings from '../../settings/containers/settings';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
    };
  }

  handleItemSelect = ({ type, name }) => {
    this.props.router.replace(`/repositories/${type}/${name}`);
  }

  render() {
    const { loading: loadingProp, user, error: errorProp, params, router } = this.props;
    const { loading: loadingState, error: errorState } = this.state;
    const error = errorProp ? errorProp.message : errorState;
    const loading = loadingProp || loadingState;
    const path = router.location.pathname;
    const repositoryName = `${params.repositoryUser}/${params.repositoryName}`;
    return (
      <div>
        {loading ? <Overlay loading /> : null}
        {!user.github.lastSync || (user.docker && !user.docker.lastSync) ?
          <Overlay text={'We are importing your stars please wait a minute...'} loading />
          : null}
        <div className="col-left">
          {loading ? <div className="center"><CircularProgress /></div> : null}
          {error ? <p className="bg-danger">{error}</p> : null}
          {user.github.lastSync ?
            <RepositoriesList
              user={user}
              selectedName={repositoryName}
              onItemSelect={this.handleItemSelect}
            /> : null}
        </div>
        {path === '/settings' ? <Settings user={user} /> : null}
        {path !== '/settings' && params.repositoryType ?
          <RepositoryContent
            router={router}
            repositoryType={params.repositoryType}
            repositoryName={repositoryName}
          /> : null}
      </div>
    );
  }
}

Home.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.object,
  user: PropTypes.object,
  router: PropTypes.object,
  params: PropTypes.object,
};

Home.defaultProps = {
  user: {},
};

export default Home;
