import React, { PropTypes } from 'react';
import Text from 'material-ui/Text';
import IconButton from 'material-ui/IconButton';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from 'material-ui/List';
import Switch from 'material-ui/Switch';

const Settings = ({ open, onSettings, user, setNotification }) => {
  if (!open) return null;
  const handleSetNotificationDaily = () => {
    setNotification('daily', !user.dailyNotification);
    // TODO error
  };
  const handleSetNotificationWeekly = () => {
    setNotification('weekly', !user.weeklyNotification);
    // TODO error
  };
  return (<div>
    <Text type="title">
      Settings
    </Text>
    <div className="pull-right">
      <IconButton onClick={onSettings}>close</IconButton>
    </div>
    <List>
      <ListItem>
        <ListItemText primary="Daily notifications" />
        <ListItemSecondaryAction>
          <Switch checked={user.dailyNotification} onClick={handleSetNotificationDaily} />
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem>
        <ListItemText primary="Weekly notifications" />
        <ListItemSecondaryAction>
          <Switch checked={user.weeklyNotification} onClick={handleSetNotificationWeekly} />
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  </div>);
};

Settings.propTypes = {
  open: PropTypes.bool,
  user: PropTypes.object,
  onSettings: PropTypes.func,
  setNotification: PropTypes.func,
};

export default Settings;
