import React, { Component, PropTypes } from 'react';
import { CircularProgress } from 'material-ui/Progress';
import Button from 'material-ui/Button';
import RepositoriesListItem from './repositories-list-item';

class RepositoriesList extends Component {
  constructor(props) {
    super(props);
    this.handleTrack = this.handleTrack.bind(this);
    this.showMore = this.showMore.bind(this);
    this.state = {
      page: 1,
      error: null,
    };
  }

  handleTrack(id, val) {
    const { trackRepository } = this.props;
    this.setState({ error: null });
    trackRepository(id, val)
      .catch((err) => {
        this.setState({ error: err.message });
      });
  }

  showMore() {
    const page = this.state.page + 1;
    this.setState({ page });
    this.props.loadMoreRepositories({ page });
  }

  render() {
    const { loading, error: errorProp, repositories } = this.props;
    const { page, error: errorState } = this.state;
    const error = errorProp ? errorProp.message : errorState;
    return (<div style={{ paddingLeft: 16 }}>
      {!loading && !error && repositories.length === 0 ?
        <div className="center">
          <p>You don&apos;t have starred repositories</p>
        </div> : null}
      <div className="repositories-list">
        {repositories.map(repository =>
          <RepositoriesListItem
            key={repository.id}
            repository={repository}
            onTrack={this.handleTrack}
          />
        )}
      </div>
      {!loading && repositories.length === 50 * page ?
        <div className="center">
          <Button onClick={this.showMore}>Show more</Button>
        </div>
        : null}
      {loading ? <CircularProgress /> : null}
      {error ? <p className="bg-danger">{error}</p> : null}
    </div>);
  }
}

RepositoriesList.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.string,
  repositories: PropTypes.array,
  loadMoreRepositories: PropTypes.func,
  trackRepository: PropTypes.func,
};

RepositoriesList.defaultProps = {
  repositories: [],
};

export default RepositoriesList;
