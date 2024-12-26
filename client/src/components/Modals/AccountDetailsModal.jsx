import PropTypes from "prop-types";

const AccountDetailsModal = ({ account, onClose }) => {
  const formatCurrency = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  AccountDetailsModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    account: PropTypes.shape({
      account_name: PropTypes.node.isRequired,
      account_balance: PropTypes.node.isRequired,
      account_number: PropTypes.node.isRequired,
    }).isRequired,
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">Account Details</h2>
        <p className="mb-2"><strong>Name:</strong> {account.account_name}</p>
        <p className="mb-2"><strong>Balance:</strong> ${formatCurrency(account.account_balance)}</p>
        <p><strong>Account Number:</strong> {account.account_number}</p>
      </div>
    </div>
  );
};

export default AccountDetailsModal;
