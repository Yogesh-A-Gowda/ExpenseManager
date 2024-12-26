import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import axios from "axios";
const AddMoneyModal = ({ account, onClose, onAddMoney }) => {
  const [amount, setAmount] = useState("");
  const fetchAccounts = async() => {
    const token = localStorage.getItem("authToken");
      await axios.get(`${import.meta.env.VITE_api}/account`, {
        headers: { Authorization: `Bearer ${token}` },
  }) }
  const handleAddMoney = async () => {
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
      try {
        await onAddMoney(account.id, parseFloat(amount));  // Add money

        // Show success snackbar
        //toast.success("Money added successfully!");
        fetchAccounts();
        onClose();
        
        // Navigate to Accounts Page after success
    // Delay for the toast to show before navigating
      } catch (error) {
        toast.error(error?.message || "Failed to add money. Please try again.");
      }
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose} // Close modal when clicked outside
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()} // Prevent click from propagating to backdrop
      >
        <h3 className="text-lg font-medium mb-4">Add Money to Account</h3>
        <div className="mb-4">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={handleAddMoney}
          >
            Add Money
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

AddMoneyModal.propTypes = {
  account: PropTypes.object.isRequired, // Account prop should be an object
  onClose: PropTypes.func.isRequired,
  onAddMoney: PropTypes.func.isRequired,
};

export default AddMoneyModal;
