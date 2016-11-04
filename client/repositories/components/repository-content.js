import React, { PropTypes, Component } from 'react';
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from 'material-ui-build/src/List';
import Switch from 'material-ui-build/src/Switch';
import Avatar from 'material-ui-build/src/Avatar';
import Text from 'material-ui-build/src/Text';
import { CircularProgress } from 'material-ui-build/src/Progress';
import TimeAgo from 'timeago-react';

class RepositoryContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
    };
  }

  handleOpenNewTabRepository = () => {
    window.open(this.props.repository.htmlUrl, '_blank');
  }

  handleOpenNewTabRelease = () => {
    window.open(this.props.repository.latestRelease.htmlUrl, '_blank');
  }

  handleTrack = () => {
    const { trackRepository, repository } = this.props;
    this.setState({ error: null });
    trackRepository(repository.id, !repository.starred)
      .catch((err) => {
        this.setState({ error: err.message });
      });
  }

  render() {
    const { error: errorState } = this.props;
    const { loading, error: errorProp, repository } = this.props;
    const error = errorProp ? errorProp.message : errorState;
    return (
      <div className="col-right repository-content">
        {loading ? <CircularProgress /> : null}
        {error ? <p className="bg-danger">{error.message}</p> : null}
        {!repository && !loading && !error ? <div>Select a repository</div> : null}
        {repository ?
          <div>
            <ListItem button onClick={this.handleOpenNewTabRepository}>
              <Avatar
                alt={repository.name}
                src={repository.photo}
              />
              <ListItemText
                primary={repository.name}
                secondary={
                  <Text secondary>Released this{' '}
                    <TimeAgo datetime={new Date(repository.latestRelease.publishedAt)} />
                  </Text>
                }
              />
              <ListItemSecondaryAction className="actions">
                <span>Notifications</span>
                <Switch checked={repository.starred} onClick={this.handleTrack} />
              </ListItemSecondaryAction>
            </ListItem>
            <Text className="content" type="title" component="a" href={repository.latestRelease.htmlUrl} target="_blank">{repository.latestRelease.tagName}</Text>
          </div>
          : null}
      </div>
    );
  }
}

RepositoryContent.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.string,
  repository: PropTypes.object,
  trackRepository: PropTypes.func.isRequired,
};

export default RepositoryContent;
