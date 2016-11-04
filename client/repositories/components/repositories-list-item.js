import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import TimeAgo from 'timeago-react';
import Avatar from 'material-ui-build/src/Avatar';
import ListItem from 'material-ui-build/src/List/ListItem';
import ListItemText from 'material-ui-build/src/List/ListItemText';
import Text from 'material-ui-build/src/Text';

class RepositoriesListItem extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.repository.id !== nextProps.repository.id ||
      this.props.active !== nextProps.active) {
      return true;
    }
    return false;
  }

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
        button className={classnames('repositories-list-item', { active })}
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
