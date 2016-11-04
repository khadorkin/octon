import React, { PropTypes, Component } from 'react';
import TimeAgo from 'timeago-react';
import {
  ListItem,
  ListItemText,
} from 'material-ui-build/src/List';
import Avatar from 'material-ui-build/src/Avatar';
import Text from 'material-ui-build/src/Text';

class RepositoriesListItem extends Component {
  handleClick = () => {
    this.props.onClick(this.props.repository.id);
  }

  render() {
    const { repository, active } = this.props;
    const latestRelease = repository.latestRelease ?
      <Text secondary>Released{' '}
        <a className="version" href={repository.latestRelease.htmlUrl} target="_blank" rel="noopener noreferrer">
          {repository.latestRelease.tagName}
        </a>
        {' • '}
        <TimeAgo datetime={new Date(repository.latestRelease.publishedAt)} /></Text>
      : 'No release';
    return (
      <ListItem
        button className={active ? 'repositories-list-item active' : 'repositories-list-item'}
        onClick={this.handleClick}
      >
        <Avatar
          alt={repository.name}
          src={repository.photo}
        />
        <ListItemText
          primary={repository.name}
          secondary={latestRelease}
        />
        {repository.type === 'github' ? <i className="devicon-github-plain" /> : <i className="devicon-docker-plain" />}
      </ListItem>
    );
  }
}

RepositoriesListItem.propTypes = {
  active: PropTypes.bool.isRequired,
  repository: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default RepositoriesListItem;
