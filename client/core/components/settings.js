import React, { Component, PropTypes } from 'react';
import Text from 'material-ui/Text';
import IconButton from 'material-ui/IconButton';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from 'material-ui/List';
import Switch from 'material-ui/Switch';
import Divider from 'material-ui/Divider';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
    };
  }

  handleSetNotificationDaily = () => {
    const { setNotification, user } = this.props;
    this.setState({ error: '' });
    setNotification('daily', !user.dailyNotification, user)
      .catch(err => this.setState({ error: err.message }));
  }

  handleSetNotificationWeekly = () => {
    const { setNotification, user } = this.props;
    this.setState({ error: '' });
    setNotification('weekly', '!user.weeklyNotification', user)
      .catch(err => this.setState({ error: err.message }));
  }

  render() {
    const { open, onSettings, user } = this.props;
    const { error } = this.state;
    if (!open) return null;
    return (<div className="settings">
      <Text type="title" className="title">
        Settings
        <div className="pull-right">
          <IconButton onClick={onSettings}>close</IconButton>
        </div>
      </Text>
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
      <Divider />
    </div>);
  }
}

Settings.propTypes = {
  open: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  onSettings: PropTypes.func.isRequired,
  setNotification: PropTypes.func.isRequired,
};

export default Settings;
