import React, { PropTypes } from 'react';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

const Header = ({ user, loading, onSettings }) => {
  const handleLogout = () => {
    window.location.href = '/logout';
  };
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
        <IconMenu
          iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        >
          <MenuItem primaryText="Settings" onTouchTap={onSettings} />
          <MenuItem primaryText="Sign out" onTouchTap={handleLogout} />
        </IconMenu>
      </ul>
    </div>
  </nav>);
};

Header.propTypes = {
  loading: PropTypes.bool,
  user: PropTypes.object,
  onSettings: PropTypes.func,
};

export default Header;
