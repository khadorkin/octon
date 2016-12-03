import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui-build/src/Dialog/Dialog';
import DialogActions from 'material-ui-build/src/Dialog/DialogActions';
import DialogContent from 'material-ui-build/src/Dialog/DialogContent';
import DialogContentText from 'material-ui-build/src/Dialog/DialogContentText';
import DialogTitle from 'material-ui-build/src/Dialog/DialogTitle';
import Text from 'material-ui-build/src/Text';
import List from 'material-ui-build/src/List/List';
import ListSubheader from 'material-ui-build/src/List/ListSubheader';
import ListItem from 'material-ui-build/src/List/ListItem';
import ListItemText from 'material-ui-build/src/List/ListItemText';
import ListItemSecondaryAction from 'material-ui-build/src/List/ListItemSecondaryAction';
import TextField, { TextFieldInput, TextFieldLabel } from 'material-ui-build/src/TextField';
import Switch from 'material-ui-build/src/Switch';
import Button from 'material-ui-build/src/Button';
import IconButton from 'material-ui-build/src/IconButton';
import Divider from 'material-ui-build/src/Divider';
import { CircularProgress } from 'material-ui-build/src/Progress';
import injectSheet from 'react-jss';

const styles = {
  title: {
    lineHeight: '54px',
  },
  text: {
    height: 40,
    lineHeight: '20px',
  },
  dockerDeleteButton: {
    float: 'right',
    marginTop: -15,
  },
  form: {
    display: 'flex',
    marginLeft: 16,
    marginRight: 16,
  },
  formInput: {
    width: '100%',
  },
  formButton: {
    marginTop: 7,
  },
};

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: '',
      error: '',
      loading: false,
      editEmail: false,
      email: props.user.email,
      dockerUsername: props.user.docker ? props.user.docker.username : '',
      showMore: false,
      dialogOpen: false,
      dialogTitle: false,
      dialogContent: false,
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
      .then(() => this.setState({ loading: false, success: 'Info updated', editEmail: false }))
      .catch(err => this.setState({ loading: false, error: err.message }));
  }

  handleChangeDockerUser = (e) => {
    if (e) {
      e.preventDefault();
    }
    const { addDockerAccount } = this.props;
    const { dockerUsername } = this.state;
    this.setState({ loading: true, success: '', error: '' });
    addDockerAccount(dockerUsername)
      .then(() => this.setState({ loading: false, success: 'Info updated' }))
      .catch(err => this.setState({ loading: false, error: err.message }));
  }

  handleDisconnectDocker = () => {
    if (!this.state.dialogOpen) {
      this.setState({
        dialogOpen: true,
        dialogTitle: 'Disconnect docker account',
        dialogContent: 'Do you really want to disconnect your docker account?',
      });
      return;
    }
    this.setState({ dockerUsername: '' });
    const { removeDockerAccount } = this.props;
    removeDockerAccount()
      .then(() => this.setState({ loading: false, success: 'Info updated', dialogOpen: false }))
      .catch(err => this.setState({ loading: false, error: err.message, dialogOpen: false }));
  }

  handleDeleteAccount = () => {
    const { deleteUserAccount } = this.props;
    if (!this.state.dialogOpen) {
      this.setState({
        dialogOpen: true,
        dialogTitle: 'Delete my account',
        dialogContent: 'Do you really want to delete your account? (this action is irreversible)',
      });
      return;
    }
    this.setState({ loading: true, success: '', error: '' });
    deleteUserAccount()
      .then(() => {
        this.setState({ loading: false, success: 'Account deleted' });
        location.reload();
      })
      .catch(err => this.setState({ loading: false, error: err.message }));
  }

  handleChangeEmail = event => this.setState({ email: event.target.value })

  handleChangeDockerUsername = event => this.setState({ dockerUsername: event.target.value })

  handleToggleEditEmail = () => this.setState({ editEmail: !this.state.editEmail })

  handleToggleShowMore = () => this.setState({ showMore: !this.state.showMore })

  handleDialogClose = () => this.setState({ dialogOpen: false })

  handleDialogOk = () => {
    if (this.state.dialogTitle === 'Delete my account') {
      this.handleDeleteAccount();
    } else {
      this.handleDisconnectDocker();
    }
  }

  render() {
    const { user, sheet: { classes } } = this.props;
    const {
      loading, success, error, email, dockerUsername, editEmail, showMore,
      dialogOpen, dialogTitle, dialogContent,
    } = this.state;
    return (<div className="col-right settings open">
      {loading ? <div className="center"><CircularProgress /></div> : null}
      {success ? <p className="bg-success">{success}</p> : null}
      {error ? <p className="bg-danger">{error}</p> : null}
      <List subheader={<ListSubheader>Notifications</ListSubheader>}>
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
      <List subheader={<ListSubheader>Email</ListSubheader>}>
        {!editEmail ?
          <ListItem>
            <ListItemText primary={user.email} />
            <ListItemSecondaryAction>
              <IconButton onClick={this.handleToggleEditEmail} title="Edit">edit</IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          : null}
      </List>
      {editEmail ?
        <form className={classes.form} onSubmit={this.handleChangeUserEmail}>
          <TextField className={classes.formInput}>
            <TextFieldLabel htmlFor="email">
              Email
            </TextFieldLabel>
            <TextFieldInput
              id="email"
              value={email}
              onChange={this.handleChangeEmail}
            />
          </TextField>
          <IconButton type="submit" className={classes.formButton} title="Save">save</IconButton>
        </form>
        : null}
      <Divider />
      <List subheader={<ListSubheader>Github</ListSubheader>}>
        <ListItem>
          <ListItemText
            primary={
              <Text>
                Connected as <b>{user.github.username}</b>
              </Text>
            }
          />
        </ListItem>
      </List>
      <Divider />
      <List subheader={<ListSubheader>Docker</ListSubheader>}>
        {user.docker ? <ListItem>
          <ListItemText
            primary={<Text>Connected as <b>{user.docker.username}</b></Text>}
          />
          <ListItemSecondaryAction>
            <IconButton onClick={this.handleDisconnectDocker} title="Delete">delete</IconButton>
          </ListItemSecondaryAction>
        </ListItem> : null}
      </List>
      {!user.docker ?
        <form className={classes.form} onSubmit={this.handleChangeDockerUser}>
          <TextField className={classes.formInput}>
            <TextFieldLabel htmlFor="username">
              Username
            </TextFieldLabel>
            <TextFieldInput
              id="username"
              value={dockerUsername}
              onChange={this.handleChangeDockerUsername}
            />
          </TextField>
          <IconButton type="submit" className={classes.formButton} title="Save">save</IconButton>
        </form>
        : null}
      <Divider />
      <List subheader={<ListSubheader>Rss</ListSubheader>}>
        <ListItem>
          <ListItemText primary={`${process.env.BASE_URL}/users/${user.id}/rss`} />
        </ListItem>
      </List>
      <Divider />
      <div className="content show-more">
        {showMore ?
          <div className="pull-right">
            <Button raised accent onClick={this.handleDeleteAccount}>Delete my account</Button>
          </div>
          : <Button onClick={this.handleToggleShowMore}>More settings</Button>}
      </div>
      <Dialog
        open={dialogOpen}
        onRequestClose={this.handleDialogClose}
      >
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleDialogOk} accent>Ok</Button>
          <Button onClick={this.handleDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>);
  }
}

Settings.propTypes = {
  user: PropTypes.object.isRequired,
  setNotification: PropTypes.func.isRequired,
  editUserEmail: PropTypes.func.isRequired,
  addDockerAccount: PropTypes.func.isRequired,
  removeDockerAccount: PropTypes.func.isRequired,
  deleteUserAccount: PropTypes.func.isRequired,
  sheet: PropTypes.object.isRequired,
};

export default injectSheet(styles)(Settings);
