import React, { Component, PropTypes } from 'react';
import TimeAgo from 'timeago-react';
import CircularProgress from 'material-ui/CircularProgress';
import Toggle from 'material-ui/Toggle';
import RaisedButton from 'material-ui/RaisedButton';

const RepositoriesListItem = ({ repository, onTrack }) => {
  const handleToggle = (_, val) => {
    onTrack(repository.id, val);
  };
  return (<div className="repositories-list-content">
    <div className="left-block overflow">
      {repository.latestRelease ?
        <span className="release">
          <a
            href={repository.latestRelease.htmlUrl}
            target="_blank" rel="noopener noreferrer"
            title={repository.latestRelease.tagName}
          >Release {repository.latestRelease.tagName}</a>
        </span>
        : <span className="release">No release</span>}
      <br />
      {repository.latestRelease ?
        <span className="date"><TimeAgo datetime={new Date(repository.latestRelease.publishedAt)} /></span>
        : null}
    </div>
    <div className="media">
      <div className="media-left">
        <a href={repository.htmlUrl} target="_blank" rel="noopener noreferrer">
          <img className="media-object" src={repository.photo} alt="profile" />
        </a>
      </div>
      <div className="media-body">
        <p className="media-heading">
          <a href={repository.htmlUrl} target="_blank" rel="noopener noreferrer">
            {repository.name}
          </a>
        </p>
        <div className="pull-right">
          <Toggle label="Notifications" toggled={repository.starred} onToggle={handleToggle} />
        </div>
      </div>
    </div>
    <span className="circle" />
  </div>);
};

RepositoriesListItem.propTypes = {
  repository: PropTypes.object,
  onTrack: PropTypes.func,
};

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
          <RaisedButton label="Show more" onTouchTap={this.showMore} />
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
