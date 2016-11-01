import React, { PropTypes, Component } from 'react';
import TimeAgo from 'timeago-react';
import Switch from 'material-ui-build/src/Switch';
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from 'material-ui-build/src/List';
import Avatar from 'material-ui-build/src/Avatar';
import Text from 'material-ui-build/src/Text';

class RepositoriesListItem extends Component {
  handleToggle = () => {
    const { onTrack, repository } = this.props;
    onTrack(repository.id, !repository.starred);
  }

  render() {
    const { repository } = this.props;
    return (<ListItem className="repositories-list-content">
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
      <Avatar
        alt={repository.name}
        src={repository.photo}
      />
      <ListItemText
        primary={
          <Text
            type="subheading"
            component="a"
            className="name"
            href={repository.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
          >{repository.name}</Text>}
      />
      <ListItemSecondaryAction className="actions">
        <span>Notifications</span>
        <Switch checked={repository.starred} onClick={this.handleToggle} />
      </ListItemSecondaryAction>
      <span className="circle" />
    </ListItem>);
  }
}

RepositoriesListItem.propTypes = {
  repository: PropTypes.object,
  onTrack: PropTypes.func,
};

export default RepositoriesListItem;
