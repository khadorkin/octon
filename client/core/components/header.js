import React, { PropTypes } from 'react';

const Header = ({ user, loading }) =>
  (<nav className="navbar navbar-default navbar-fixed-top">
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
      </ul>
    </div>
  </nav>);

Header.propTypes = {
  loading: PropTypes.bool,
  user: PropTypes.object,
};

export default Header;
