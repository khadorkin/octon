import React, { Component, PropTypes } from 'react';
import Text from 'material-ui-build/src/Text';
import IconButton from 'material-ui-build/src/IconButton';
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

  handleChangeEmail = event => this.setState({ email: event.target.value })

  render() {
    const { open, onSettings, user } = this.props;
    const { success, error, email } = this.state;
    if (!open) return null;
    return (<div className="settings">
      <Text type="title" className="title">
        Settings
        <div className="pull-right">
          <IconButton onClick={onSettings}>close</IconButton>
        </div>
      </Text>
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
      <form onSubmit={this.handleChangeUserEmail} className="form-email">
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
      <div className="clearfix" />
      <Divider />
    </div>);
  }
}

Settings.propTypes = {
  open: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  onSettings: PropTypes.func.isRequired,
  setNotification: PropTypes.func.isRequired,
  editUserEmail: PropTypes.func.isRequired,
};

export default Settings;
