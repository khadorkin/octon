import React, { PropTypes } from 'react';

const NotFound = ({ title, content }) =>
  (<div className="not-found">
    <h3>{title}</h3>
    <p>{content}</p>
  </div>);

NotFound.propTypes = {
  title: PropTypes.node,
  content: PropTypes.node,
};

NotFound.defaultProps = {
  title: '404 page not found',
  content: 'We are sorry but the page you are looking for does not exist.',
};

export default NotFound;
