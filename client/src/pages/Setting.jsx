import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as z from 'zod';
import {
  TextField,
  Button,
  Box,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import Loading from '../components/wrapper/Loading';

const Setting = () => {
  const [userData, setUserData] = useState({});
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [currency, setCurrency] = useState('');
  const [contact, setContact] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [openUpdateUserModal, setOpenUpdateUserModal] = useState(false);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);

  // Zod schema for password validation
  const passwordSchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
  });

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const response = await axios.get(`${import.meta.env.VITE_api}/user`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.status === 200) {
          const { firstname, lastname, country, currency, contact } = response.data.user;
          setUserData(response.data.user);
          setFirstName(firstname || 'No Data');
          setLastName(lastname || 'No Data');
          setCountry(country || 'No Data');
          setCurrency(currency || 'USD');
          setContact(contact || 'No Data');
        
        } else {
          toast.error('Failed to fetch user data.');
        }
      } catch (error) {
        toast.error(error?.message || 'An error occurred while fetching user data.');
      } finally {
        setIsLoading(false); // Stop loading after the API call completes
      }
    };

    fetchUserData();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const passwordData = { currentPassword, newPassword, confirmPassword };
      const validationResult = passwordSchema.safeParse(passwordData);

      if (!validationResult.success) {
        toast.error(validationResult.error.issues[0].message);
        return;
      }

      const authToken = localStorage.getItem('authToken');
      const response = await axios.put(
        `${import.meta.env.VITE_api}/user/changepassword`,
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setOpenChangePasswordModal(false); // Close the modal after success
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error?.message || 'An error occurred while changing password.');
    }
  };

  const handleSettingUpdate = async (e) => {
    e.preventDefault();
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await axios.put(
        `${import.meta.env.VITE_api}/user/updateuser`,
        {
          firstName,
          lastName,
          country,
          currency,
          contact,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success('Setting updated successfully!');
        setOpenUpdateUserModal(false); // Close the modal after success
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error?.message || 'An error occurred while updating Setting.');
    }
  };

  const handleOpenUpdateUserModal = () => setOpenUpdateUserModal(true);
  const handleCloseUpdateUserModal = () => setOpenUpdateUserModal(false);

  const handleOpenChangePasswordModal = () => setOpenChangePasswordModal(true);
  const handleCloseChangePasswordModal = () => setOpenChangePasswordModal(false);

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Loading /> </Box>; // Show loading text while fetching user data
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* User Info Display */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
        padding: '20px',
        borderRadius: '8px',
        boxShadow: 3,
        width: '100%',
        maxWidth: '600px',
        backgroundColor: '#f4f4f9',
      }}>
        <div style={{
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '16px',
        }}>
          User Settings
        </div>

        <div style={{
          fontSize: '18px',
          fontWeight: '500',
          marginBottom: '10px',
        }}>
          <strong>First Name:</strong> {firstName}
        </div>
        <div style={{
          fontSize: '18px',
          fontWeight: '500',
          marginBottom: '10px',
        }}>
          <strong>Last Name:</strong> {lastName}
        </div>
        <div style={{
          fontSize: '18px',
          fontWeight: '500',
          marginBottom: '10px',
        }}>
          <strong>Country:</strong> {country}
        </div>
        <div style={{
          fontSize: '18px',
          fontWeight: '500',
          marginBottom: '10px',
        }}>
          <strong>Currency:</strong> {currency}
        </div>
        <div style={{
          fontSize: '18px',
          fontWeight: '500',
          marginBottom: '10px',
        }}>
          <strong>Contact:</strong> {contact}
        </div>
      </Box>

      {/* Buttons to open modals */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleOpenUpdateUserModal}
          >
            Update User Info
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleOpenChangePasswordModal}
          >
            Change Password
          </Button>
        </Grid>
      </Grid>

      {/* Modals */}
      {/* Update User Modal */}
      <Dialog open={openUpdateUserModal} onClose={handleCloseUpdateUserModal}>
        <DialogTitle>Update User Info</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="First Name"
            variant="outlined"
            margin="normal"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Last Name"
            variant="outlined"
            margin="normal"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Country"
            variant="outlined"
            margin="normal"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <TextField
            fullWidth
            label="Currency"
            variant="outlined"
            margin="normal"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          />
          <TextField
            fullWidth
            label="Contact"
            variant="outlined"
            margin="normal"
            value={userData.contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateUserModal} color="secondary">Cancel</Button>
          <Button onClick={handleSettingUpdate} color="primary">Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Modal */}
      <Dialog open={openChangePasswordModal} onClose={handleCloseChangePasswordModal}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Current Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextField
            fullWidth
            label="New Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseChangePasswordModal} color="secondary">Cancel</Button>
          <Button onClick={handlePasswordChange} color="primary">Change Password</Button>
        </DialogActions>
      </Dialog>

      {/* Toastify container */}
      <ToastContainer />
    </Box>
  );
};

export default Setting;
