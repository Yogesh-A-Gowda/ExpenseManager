import { useState } from "react";
import PropTypes from "prop-types";

const TransferMoneyModal = ({ onClose, accounts, onTransfer }) => {
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");

  // Handle Transfer
  const handleTransfer = () => {
    if (fromAccount && toAccount && parseFloat(amount) > 0) {
      onTransfer(fromAccount, toAccount, parseFloat(amount));
      onClose();
    } else {
      alert("Please ensure all fields are correctly filled.");
    }
  };

  // Filter To Account options dynamically
  const filteredAccounts = accounts.filter((account) => account.id !== fromAccount);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Transfer Money</h2>

        {/* From Account */}
        <div className="mb-4">
          <label htmlFor="fromAccount" className="block text-sm font-medium text-gray-700">
            From Account
          </label>
          <select
            id="fromAccount"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={fromAccount}
            onChange={(e) => {
              setFromAccount(e.target.value);
              if (e.target.value === toAccount) {
                setToAccount(""); // Reset To Account if it matches the newly selected From Account
              }
            }}
          >
            <option value="">Select an account</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.account_name} (${account.account_balance.toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        {/* To Account */}
        <div className="mb-4">
          <label htmlFor="toAccount" className="block text-sm font-medium text-gray-700">
            To Account
          </label>
          <select
            id="toAccount"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            disabled={!fromAccount} // Disable To Account dropdown if From Account is not selected
          >
            <option value="">Select an account</option>
            {filteredAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.account_name} (${account.account_balance.toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount to transfer"
            min="0"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            onClick={handleTransfer}
            disabled={!fromAccount || !toAccount || !amount} // Disable transfer if fields are not properly filled
          >
            Transfer
          </button>
        </div>
      </div>
    </div>
  );
};

TransferMoneyModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      account_name: PropTypes.string.isRequired,
      account_balance: PropTypes.number.isRequired, // Ensure number type
    })
  ).isRequired,
  onTransfer: PropTypes.func.isRequired,
};

export default TransferMoneyModal;
