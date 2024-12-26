// src/pages/SignUp.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack'; // Import the hook from notistack


const SignUp = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar(); // Hook to show snackbar

  // Form fields
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Error state
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Data to send in the POST request
    const userData = { firstName, email, password };

    try {
      await axios.post(`${import.meta.env.VITE_api}/auth/sign-up`, userData).then(() => {
        // User created successfully, show Snackbar
        enqueueSnackbar('Account created successfully!', { variant: 'success' });

        // Redirect to Sign-In page after 2 seconds
        navigate('/sign-in')
      
      })
     
    } catch (error) {
      console.log(error.response?.data?.message ) 
      setError('Failed to create account. Please try again.');
      enqueueSnackbar('Error creating account.', { variant: 'error' }); // Show error snackbar
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>

        {/* Display error message */}
        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-gray-700">firstName</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center">
          Already have an account?{' '}
          <a href="/sign-in" className="text-blue-600 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
