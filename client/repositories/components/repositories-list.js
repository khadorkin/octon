import React, { Component, PropTypes } from 'react';
import TimeAgo from 'timeago-react';
import CircularProgress from 'material-ui/CircularProgress';
import Toggle from 'material-ui/Toggle';
import RaisedButton from 'material-ui/RaisedButton';

const RepositoriesListItem = ({ repository }) =>
  (<div className="repositories-list-content">
    {repository.latestRelease ?
      <span className="release">Release {repository.latestRelease.tagName}</span>
      : <span className="release">No release</span>}
    {repository.latestRelease ?
      <span className="date"><TimeAgo datetime={new Date(repository.latestRelease.publishedAt)} /></span>
      : null}
    <div className="media">
      <div className="media-left">
        <a href={repository.htmlUrl} target="_blank" rel="noopener noreferrer">
          <img className="media-object" src={repository.photo} alt="profile" />
        </a>
      </div>
      <div className="media-body">
        <p className="media-heading">
          <a href={repository.htmlUrl} target="_blank" rel="noopener noreferrer">
            {repository.fullName}
          </a>
        </p>
        <div className="pull-right">
          <Toggle label="Notifications" toggled={repository.starred} />
        </div>
      </div>
    </div>
    <span className="circle" />
  </div>);

RepositoriesListItem.propTypes = {
  repository: React.PropTypes.object,
};

class RepositoriesList extends Component {
  constructor(props) {
    super(props);
    this.showMore = this.showMore.bind(this);
    this.state = {
      page: 1,
    };
  }

  showMore() {
    const page = this.state.page + 1;
    this.setState({ page });
    this.props.loadMoreRepositories({ page });
  }

  render() {
    const { loading, error, repositories } = this.props;
    const { page } = this.state;
    return (<div>
      {!loading && !error && repositories.length === 0 ?
        <div className="center">
          <p>You don&apos;t have starred repositories</p>
        </div> : null}
      <div className="repositories-list">
        {repositories.map(repository =>
          <RepositoriesListItem
            key={repository.id}
            repository={repository}
          />
        )}
      </div>
      {!loading && repositories.length === 50 * page ?
        <div className="center">
          <RaisedButton label="Show more" onTouchTap={this.showMore} />
        </div>
        : null}
      {loading ? <CircularProgress /> : null}
      {error ? <p className="bg-danger">{error.message}</p> : null}
    </div>);
  }
}


RepositoriesList.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.string,
  repositories: PropTypes.array,
  loadMoreRepositories: PropTypes.func,
};

RepositoriesList.defaultProps = {
  repositories: [],
};

export default RepositoriesList;
