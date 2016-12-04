import React, { PropTypes } from 'react';
import injectSheet from 'react-jss';

const styles = {
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    flexDirection: 'column',
  },
};

const NotFound = ({ title, content, sheet: { classes } }) =>
  (<div className={classes.root}>
    <h3>{title}</h3>
    <p>{content}</p>
  </div>);

NotFound.propTypes = {
  title: PropTypes.node,
  content: PropTypes.node,
  sheet: PropTypes.object.isRequired,
};

NotFound.defaultProps = {
  title: '404 page not found',
  content: 'We are sorry but the page you are looking for does not exist.',
};

export default injectSheet(styles)(NotFound);
