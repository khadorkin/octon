import React, { PropTypes } from 'react';
import TimeAgo from 'timeago-react';
import Toggle from 'material-ui/Toggle';

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

export default RepositoriesListItem;