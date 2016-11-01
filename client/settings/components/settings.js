import React, { Component, PropTypes } from 'react';
import TimeAgo from 'timeago-react';
import Text from 'material-ui-build/src/Text';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from 'material-ui-build/src/List';
import TextField, { TextFieldInput, TextFieldLabel } from 'material-ui-build/src/TextField';
import Switch from 'material-ui-build/src/Switch';
import Button from 'material-ui-build/src/Button';
import { CircularProgress } from 'material-ui-build/src/Progress';

class Settings extends Component {
  constructor(props) {
    super(props);
    // TODO loading
    this.state = {
      success: '',
      error: '',
      loading: false,
      email: props.user.email,
      dockerUsername: props.user.docker ? props.user.docker.username : '',
      showMore: false,
    };
  }

  handleSetNotificationDaily = () => {
    const { setNotification, user } = this.props;
    this.setState({ loading: true, success: '', error: '' });
    setNotification('daily', !user.dailyNotification, user)
      .then(() => this.setState({ loading: false, success: 'Info updated' }))
      .catch(err => this.setState({ loading: false, error: err.message }));
  }

  handleSetNotificationWeekly = () => {
    const { setNotification, user } = this.props;
    this.setState({ loading: true, success: '', error: '' });
    setNotification('weekly', !user.weeklyNotification, user)
      .then(() => this.setState({ loading: false, success: 'Info updated' }))
      .catch(err => this.setState({ loading: false, error: err.message }));
  }

  handleChangeUserEmail = (e) => {
    e.preventDefault();
    const { editUserEmail } = this.props;
    const { email } = this.state;
    this.setState({ loading: true, success: '', error: '' });
    editUserEmail(email)
      .then(() => this.setState({ loading: false, success: 'Info updated' }))
      .catch(err => this.setState({ loading: false, error: err.message }));
  }

  handleChangeDockerUser = (e) => {
    e.preventDefault();
    const { addDockerAccount } = this.props;
    const { dockerUsername } = this.state;
    this.setState({ loading: true, success: '', error: '' });
    addDockerAccount(dockerUsername)
      .then(() => this.setState({ loading: false, success: 'Info updated' }))
      .catch(err => this.setState({ loading: false, error: err.message }));
  }

  handleSyncUserGithubStars = (e) => {
    e.preventDefault();
    const { syncUserGithubStars } = this.props;
    this.setState({ loading: true, success: '', error: '' });
    syncUserGithubStars()
      .then(() => this.setState({ loading: false, success: 'Github stars synced' }))
      .catch(err => this.setState({ loading: false, error: err.message }));
  }

  handleSyncUserDockerStars = (e) => {
    e.preventDefault();
    const { syncUserDockerStars } = this.props;
    this.setState({ loading: true, success: '', error: '' });
    syncUserDockerStars()
      .then(() => this.setState({ loading: false, success: 'Docker stars synced' }))
      .catch(err => this.setState({ loading: false, error: err.message }));
  }

  handleDeleteAccount = () => {
    // TODO make a clean material modal
    const { deleteUserAccount } = this.props;
    const choice = confirm('Do you really want to delete your account? (this action is irreversible)');
    if (choice) {
      this.setState({ loading: true, success: '', error: '' });
      deleteUserAccount()
        .then(() => {
          this.setState({ loading: false, success: 'Account deleted' });
          location.reload();
        })
        .catch(err => this.setState({ loading: false, error: err.message }));
    }
  }

  handleChangeEmail = event => this.setState({ email: event.target.value })

  handleChangeDockerUsername = event => this.setState({ dockerUsername: event.target.value })

  handleToggleShowMore = () => this.setState({ showMore: !this.state.showMore })

  render() {
    const { user } = this.props;
    const { loading, success, error, email, dockerUsername, showMore } = this.state;
    return (<div className="settings">
      <Text type="title" className="content title">Settings</Text>
      {loading ? <CircularProgress /> : null}
      {success ? <p className="bg-success">{success}</p> : null}
      {error ? <p className="bg-danger">{error}</p> : null}
      <List>
        <ListItem>
          <ListItemText primary="Daily notifications" />
          <ListItemSecondaryAction>
            <Switch checked={user.dailyNotification} onClick={this.handleSetNotificationDaily} />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText primary="Weekly notifications" />
          <ListItemSecondaryAction>
            <Switch checked={user.weeklyNotification} onClick={this.handleSetNotificationWeekly} />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      <Text type="subheading" className="content title">Email</Text>
      <form onSubmit={this.handleChangeUserEmail} className="content form-email">
        <TextField className="input">
          <TextFieldLabel htmlFor="email">
            Email
          </TextFieldLabel>
          <TextFieldInput
            id="email"
            value={email}
            onChange={this.handleChangeEmail}
          />
        </TextField>
        <Button type="submit">Submit</Button>
      </form>
      <Text type="subheading" className="content title">Github</Text>
      <Text className="content">Connected as {user.github.username}</Text>
      <Text className="content">
        Last star sync: <TimeAgo datetime={new Date(user.github.lastSync)} />
        <Button onClick={this.handleSyncUserGithubStars}>Sync github stars</Button>
      </Text>
      <Text type="subheading" className="content title">Docker</Text>
      <form onSubmit={this.handleChangeDockerUser} className="content form-email">
        <TextField className="input">
          <TextFieldLabel htmlFor="username">
            Username
          </TextFieldLabel>
          <TextFieldInput
            id="username"
            value={dockerUsername}
            onChange={this.handleChangeDockerUsername}
          />
        </TextField>
        <Button type="submit">Submit</Button>
      </form>
      {user.docker ?
        <Text className="content">
          Last star sync: {user.docker && user.docker.lastSync ? <TimeAgo datetime={new Date(user.docker.lastSync)} /> : ' No sync yet'}
          <Button onClick={this.handleSyncUserDockerStars}>Sync docker stars</Button>
        </Text>
        : null}
      <div className="content show-more">
        {showMore ?
          <div className="pull-right">
            <Button raised accent onClick={this.handleDeleteAccount}>Delete my account</Button>
          </div>
          : <Button onClick={this.handleToggleShowMore}>More settings</Button>}
      </div>
    </div>);
  }
}

Settings.propTypes = {
  user: PropTypes.object.isRequired,
  setNotification: PropTypes.func.isRequired,
  editUserEmail: PropTypes.func.isRequired,
  addDockerAccount: PropTypes.func.isRequired,
  syncUserGithubStars: PropTypes.func.isRequired,
  syncUserDockerStars: PropTypes.func.isRequired,
  deleteUserAccount: PropTypes.func.isRequired,
};

export default Settings;