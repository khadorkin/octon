import React from 'react';
import TimeAgo from 'timeago-react';
import CircularProgress from 'material-ui/CircularProgress';
import Toggle from 'material-ui/Toggle';

const RepositoriesListItem = ({ repository }) =>
  (<div className="repositories-list-content">
    {repository.latestRelease ?
      <span className="release">Release {repository.latestRelease.tagName}</span>
      : <span className="release">No release</span>}
    <span className="date"><TimeAgo datetime={new Date(repository.latestRelease.publishedAt)} /></span>
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
          <Toggle label="Notifications" />
        </div>
      </div>
    </div>
    <span className="circle" />
  </div>);

RepositoriesListItem.propTypes = {
  repository: React.PropTypes.object,
};

const RepositoriesList = ({ loading, error, repositories }) =>
  (<div>
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
    {loading ? <CircularProgress /> : null}
    {error ? <p className="bg-danger">{error.message}</p> : null}
  </div>);

RepositoriesList.propTypes = {
  loading: React.PropTypes.bool,
  error: React.PropTypes.string,
  repositories: React.PropTypes.array,
};

RepositoriesList.defaultProps = {
  repositories: [],
};

export default RepositoriesList;
