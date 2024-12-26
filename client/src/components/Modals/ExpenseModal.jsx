import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const ExpenseModal = ({ account, onClose, onAddExpense }) => {

  ExpenseModal.propTypes = {
    account: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onAddExpense: PropTypes.func.isRequired,
  };
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [source, setSource] = useState('');

  // const fetchAccounts = async() => {
  //   const token = localStorage.getItem("authToken");
  //     await axios.get(`${import.meta.env.VITE_api}/account`, {
  //       headers: { Authorization: `Bearer ${token}` },
  // }) }
  const handleSubmit = async () => {
    try { 
      // Call the API to add the expense
      const token = localStorage.getItem("authToken");
      await axios.post(
        `${import.meta.env.VITE_api}/transaction/add-transaction/${account.id}`,
        { amount, description, source },
        {headers: { Authorization: `Bearer ${token}` } }
      );
      // fetchAccounts()
      onAddExpense()// Optional: refresh accounts after adding the expense
      onClose(); // Close the modal after adding expense
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-semibold mb-4">Add Expense</h2>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Amount"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Description"
        />
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Source"
        />
        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Add Expense
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseModal;
