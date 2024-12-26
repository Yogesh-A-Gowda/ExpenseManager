import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');

  // If there's no token, redirect to sign-in page
  if (!token) {
    return <Navigate to="/sign-in" />;
  }

  return children; // Return the private content (dashboard, etc.)
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
