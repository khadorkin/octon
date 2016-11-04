import React, { PropTypes } from 'react';
import Button from 'material-ui-build/src/Button';

const FirstLogin = ({ syncUserStars, loading }) =>
  (<div className="center">
    {!loading ?
      <div>
        Welcome, this is the first time you come here<br /><br />
        <Button primary raised onClick={syncUserStars}>Sync my stars</Button>
      </div>
      : 'Syncing your stars ...'}
  </div>);

FirstLogin.propTypes = {
  syncUserStars: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default FirstLogin;
