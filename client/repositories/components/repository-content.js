import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import marked from 'marked';
import Avatar from 'material-ui-build/src/Avatar';
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from 'material-ui-build/src/List';
import IconButton from 'material-ui-build/src/IconButton';
import CircularProgress from 'material-ui-build/src/Progress/CircularProgress';
import Switch from 'material-ui-build/src/Switch';
import Text from 'material-ui-build/src/Text';
import TimeAgo from 'timeago-react';
import NotFound from '../../core/components/not-found';

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

  handleCloseCLick = () => {
    this.props.router.replace('/');
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
    const { loading, error: errorProp, repository, repositoryId } = this.props;
    const error = errorProp ? errorProp.message : errorState;
    return (
      <div className={classnames('col-right', 'repository-content', { open: repositoryId })}>
        {loading ? <div className="center loading"><CircularProgress /></div> : null}
        {error ? <p className="bg-danger">{error}</p> : null}
        {!loading && !error && !repository ? <NotFound title={'404 repository not found'} /> : null}
        {repository && !loading ?
          <div>
            <IconButton className="icon-close" onClick={this.handleCloseCLick}>arrow_back</IconButton>
            <ListItem button onClick={this.handleOpenNewTabRepository}>
              <Avatar
                alt={repository.name}
                src={repository.photo}
              />
              <ListItemText
                primary={repository.name}
                secondary={
                  <Text secondary>Released this{' '}
                    {repository.latestRelease ?
                      <TimeAgo datetime={new Date(repository.latestRelease.publishedAt)} />
                      : 'No release'}
                  </Text>
                }
              />
              <ListItemSecondaryAction className="actions">
                <span className="span-label">Notifications</span>
                <Switch checked={repository.starred} onClick={this.handleTrack} />
              </ListItemSecondaryAction>
            </ListItem>
            {repository.latestRelease ? <Text className="content" type="title" component="a" href={repository.latestRelease.htmlUrl} target="_blank">{repository.latestRelease.tagName}</Text> : null}
            <Text className="content description">{repository.description}</Text>
            {repository.latestRelease && repository.latestRelease.description ?
              <Text className="content markdown-body" dangerouslySetInnerHTML={{ __html: marked(repository.latestRelease.description) }} /> : null}
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
  repositoryId: PropTypes.string,
  router: PropTypes.object,
  trackRepository: PropTypes.func.isRequired,
};

export default RepositoryContent;
