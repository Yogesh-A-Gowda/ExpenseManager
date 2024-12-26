import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import axios from "axios";

const CreateAccountModal = ({ onClose, onCreate }) => {
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [initialDeposit, setInitialDeposit] = useState("");

  const fetchAccounts = async() => {
    const token = localStorage.getItem("authToken");
      await axios.get(`${import.meta.env.VITE_api}/account`, {
        headers: { Authorization: `Bearer ${token}` },
  }) }
  
  const handleSubmit = async () => {
    const accountDetails = {
      name: accountName,
      account_number: accountNumber,
      amount: parseFloat(initialDeposit),
    };

    try {
      // Assuming onCreate returns a promise
      await onCreate(accountDetails);  // Call the function to create account

      // Show success snackbar
      fetchAccounts();
        onClose();
      // Navigate to Accounts Page after success
     // Delay for the toast to show before navigating
    } catch (error) {
      toast.error(error?.message || "Failed to create account. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()} // Prevent click from propagating to backdrop
      >
        <h3 className="text-lg font-medium mb-4">Create New Account</h3>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Account Name"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            placeholder="Initial Deposit"
            value={initialDeposit}
            onChange={(e) => setInitialDeposit(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={handleSubmit}
          >
            Create
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

CreateAccountModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
};

export default CreateAccountModal;
