import React, { PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const FirstLogin = ({ syncUserStars }) =>
  (<div className="center">
    Welcome, this is the first time you come here<br /><br />
    <RaisedButton label="Sync my stars" onTouchTap={syncUserStars} />
  </div>);

FirstLogin.propTypes = {
  syncUserStars: PropTypes.func.isRequired,
};

export default FirstLogin;
