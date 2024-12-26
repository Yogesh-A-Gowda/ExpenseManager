import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');

  // If the user is authenticated, redirect them to the dashboard
  if (token) {
    return <Navigate to="/dashboard" />;
  }

  return children; // Return the children (sign-in page or other public content)
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute;
