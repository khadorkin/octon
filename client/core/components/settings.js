import React, { PropTypes } from 'react';
import Subheader from 'material-ui/Subheader';
import { List, ListItem } from 'material-ui/List';
import Toggle from 'material-ui/Toggle';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

const Settings = ({ open, onSettings, user, setNotification }) => {
  if (!open) return null;
  const handleSetNotificationDaily = (_, active) => {
    setNotification('daily', active);
    // TODO error
  };
  const handleSetNotificationWeekly = (_, active) => {
    setNotification('weekly', active);
    // TODO error
  };
  return (<div>
    <div className="pull-right">
      <IconButton onTouchTap={onSettings}><CloseIcon /></IconButton>
    </div>
    <List>
      <Subheader>Settings</Subheader>
      <ListItem
        primaryText="Daily notifications"
        rightToggle={
          <Toggle toggled={user.dailyNotification} onToggle={handleSetNotificationDaily} />
        }
      />
      <ListItem
        primaryText="Weekly notifications"
        rightToggle={
          <Toggle toggled={user.weeklyNotification} onToggle={handleSetNotificationWeekly} />
        }
      />
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
