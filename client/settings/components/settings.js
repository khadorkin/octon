import React, { Component, PropTypes } from 'react';
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
import Divider from 'material-ui-build/src/Divider';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: '',
      error: '',
      email: props.user.email,
      showMore: false,
    };
  }

  handleSetNotificationDaily = () => {
    const { setNotification, user } = this.props;
    this.setState({ success: '', error: '' });
    setNotification('daily', !user.dailyNotification, user)
      .then(() => this.setState({ success: 'Info updated' }))
      .catch(err => this.setState({ error: err.message }));
  }

  handleSetNotificationWeekly = () => {
    const { setNotification, user } = this.props;
    this.setState({ success: '', error: '' });
    setNotification('weekly', !user.weeklyNotification, user)
      .then(() => this.setState({ success: 'Info updated' }))
      .catch(err => this.setState({ error: err.message }));
  }

  handleChangeUserEmail = (e) => {
    e.preventDefault();
    const { editUserEmail } = this.props;
    const { email } = this.state;
    this.setState({ success: '', error: '' });
    editUserEmail(email)
      .then(() => this.setState({ success: 'Info updated' }))
      .catch(err => this.setState({ error: err.message }));
  }

  handleDeleteAccount = () => {
    // TODO make a clean material modal
    const { deleteUserAccount } = this.props;
    const choice = confirm('Do you really want to delete your account? (this action is irreversible)');
    if (choice) {
      this.setState({ success: '', error: '' });
      deleteUserAccount()
        .then(() => {
          this.setState({ success: 'Account deleted' });
          location.reload();
        })
        .catch(err => this.setState({ error: err.message }));
    }
  }

  handleChangeEmail = event => this.setState({ email: event.target.value })

  handleToggleShowMore = () => this.setState({ showMore: !this.state.showMore })

  render() {
    const { user } = this.props;
    const { success, error, email, showMore } = this.state;
    return (<div className="settings">
      <Text type="title" className="title">Settings</Text>
      {success ? <p className="bg-success">{success}</p> : null}
      {error ? <p className="bg-danger">{error}</p> : null}
      <Divider className="content" />
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
      <Divider className="content" />
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
      {showMore ?
        <div className="pull-right">
          <Button raised accent onClick={this.handleDeleteAccount}>Delete my account</Button>
        </div>
        : <Button onClick={this.handleToggleShowMore}>Show more</Button>}
    </div>);
  }
}

Settings.propTypes = {
  user: PropTypes.object.isRequired,
  setNotification: PropTypes.func.isRequired,
  editUserEmail: PropTypes.func.isRequired,
  deleteUserAccount: PropTypes.func.isRequired,
};

export default Settings;
