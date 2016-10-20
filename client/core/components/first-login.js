import React, { PropTypes } from 'react';
import Button from 'material-ui/Button';

const FirstLogin = ({ syncUserStars }) =>
  (<div className="center">
    Welcome, this is the first time you come here<br /><br />
    <Button raised onClick={syncUserStars}>Sync my stars</Button>
  </div>);

FirstLogin.propTypes = {
  syncUserStars: PropTypes.func.isRequired,
};

export default FirstLogin;
