import React, { PropTypes } from 'react';
import { CircularProgress } from 'material-ui-build/src/Progress';
import injectSheet from 'react-jss';
import classNames from 'classnames';

const styles = {
  overlay: {
    position: 'absolute',
    backgroundColor: '#fff',
    zIndex: 1,
    top: 58,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    marginTop: 20,
  },
};

const Overlay = ({ sheet: { classes }, text, loading }) =>
  (<div className={classNames(classes.overlay)}>
    {text}
    {loading ? <CircularProgress className={classes.loading} /> : null}
  </div>);

Overlay.propTypes = {
  loading: PropTypes.bool,
  text: PropTypes.node,
  sheet: PropTypes.object.isRequired,
};

export default injectSheet(styles)(Overlay);
