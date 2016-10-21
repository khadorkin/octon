import React, { Component, PropTypes } from 'react';
import IconButton from 'material-ui-build/src/IconButton';
import { Menu, MenuItem } from 'material-ui-build/src/Menu';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      menuAnchorEl: null,
    };
  }

  handleLogout = () => {
    this.handleToggleMenu();
    window.location.href = '/logout';
  }

  handleSettings = () => {
    this.handleToggleMenu();
    this.props.onSettings();
  }

  handleToggleMenu = event =>
    this.setState({ menuOpen: !this.state.menuOpen, menuAnchorEl: event && event.currentTarget });

  render() {
    const { user, loading } = this.props;
    const { menuOpen, menuAnchorEl } = this.state;
    return (<nav className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <a className="navbar-brand" href="/">
            <img alt="Brand" src="/img/logo.svg" />
          </a>
        </div>
        <ul className="nav navbar-nav navbar-right">
          {loading ? <li><a>Loading ...</a></li> :
            <li className="navbar-avatar" style={{ backgroundImage: `url(${user.photo})` }} />
          }
          <IconButton onClick={this.handleToggleMenu}>more_vert</IconButton>
          <Menu
            anchorEl={menuAnchorEl}
            open={menuOpen}
            onRequestClose={this.handleToggleMenu}
          >
            <MenuItem onClick={this.handleSettings}>Settings</MenuItem>
            <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
          </Menu>
        </ul>
      </div>
    </nav>);
  }
}

Header.propTypes = {
  loading: PropTypes.bool,
  user: PropTypes.object,
  onSettings: PropTypes.func,
};

export default Header;
