import {useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack'; 


const SignIn = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar(); 

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Error state
  const [error, setError] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();

    // Data to send in the POST request
    const userData = { email, password };
    console.log(import.meta.env.api)

    try {
      const response = await axios.post(`${import.meta.env.VITE_api}/auth/sign-in`, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
       
      });


        // If successful, store the token and redirect to dashboard
        localStorage.setItem('authToken', response.data.token);
        enqueueSnackbar('Login Successful!', { variant: 'success' });
        navigate('/dashboard'); // Redirect to the Dashboard
    
    } catch (error) {
      console.log(error.response?.data?.message ) 
      setError('Invalid credentials. Please try again.');
      enqueueSnackbar('Login Error', { variant: 'error' });

    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>
        
        {/* Display error message */}
        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSignIn}>
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
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center">
          Do not have an account?{' '}
          <a href="/sign-up" className="text-blue-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
