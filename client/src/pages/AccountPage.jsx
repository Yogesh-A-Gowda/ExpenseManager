import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import CreateAccountModal from "../components/Modals/CreateAccountModal";
import AccountDetailsModal from "../components/Modals/AccountDetailsModal";
import AddMoneyModal from "../components/Modals/AddMoneyModal";
import ExpenseModal from "../components/Modals/ExpenseModal";
import DeleteConfirmationModal from "../components/Modals/DeleteConfirmationModal";
import TransferMoneyModal from "../components/Modals/TransferMoneyModal";
import Loading from "../components/wrapper/Loading";
import { toast } from "react-toastify";

const AccountsPage = () => {
  const formatCurrency = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  const [accounts, setAccounts] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${import.meta.env.VITE_api}/account`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data.data || [];
      const formattedAccounts = data.map((account) => ({
        ...account,
        account_balance: parseFloat(account.account_balance),
      }));
      setAccounts(formattedAccounts);
      setTotalBalance(response.data.total_account_balance);
    } catch (err) {
      setError(err?.message || "Failed to fetch accounts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const addMoney = async (accountId, amount) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `${import.meta.env.VITE_api}/account/add-money/${accountId}`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the accounts state with the new balance
      setAccounts((prev) =>
        prev.map((account) =>
          account.id === accountId
            ? { ...account, account_balance: account.account_balance + amount }
            : account
        )
      );
      toast.success("Money added successfully!");
      setShowAddMoneyModal(false);
      fetchAccounts();
    } catch (err) {
      toast.error(err?.message || "Failed to add money. Please try again.");
    }
  };

  const transferMoney = async (fromAccountId, toAccountId, amount) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `${import.meta.env.VITE_api}/transaction/transfer-money`,
        { from_account: fromAccountId, to_account: toAccountId, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the accounts state with the new balance for both accounts
      setAccounts((prev) =>
        prev.map((account) => {
          if (account.id === fromAccountId) {
            return { ...account, account_balance: account.account_balance - amount };
          }
          if (account.id === toAccountId) {
            return { ...account, account_balance: account.account_balance + amount };
          }
          return account;
        })
      );

      toast.success("Money transferred successfully!");
      setShowTransferModal(false);
      fetchAccounts();
    } catch (err) {
      toast.error(err?.message || "Failed to transfer money. Please try again.");
    }
  };

  const createAccount = async (accountDetails) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `${import.meta.env.VITE_api}/account/create`,
        accountDetails,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Account created successfully!");
      setShowCreateModal(false);
      fetchAccounts();  // Fetch the updated accounts after creation
    } catch (err) {
      toast.error(err?.message || "Failed to create account. Please try again.");
    }
  };
  const deleteAccount = async (accountId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${import.meta.env.VITE_api}/account/delete/${accountId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Account deleted successfully!");
      fetchAccounts(); // Re-fetch accounts after deletion
    } catch (err) {
      toast.error(err?.message || "Failed to delete account. Please try again.");
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const openDetailsModal = (account) => {
    setSelectedAccount(account);
    setShowDetailsModal(true);
  };

  const openAddMoneyModal = (account) => {
    setSelectedAccount(account);
    setShowAddMoneyModal(true);
  };

  const openDeleteModal = (account) => {
    setSelectedAccount(account);
    setShowDeleteModal(true);
  };

  const openTransferModal = () => {
    setShowTransferModal(true);
  };

  const openExpenseModal = (account) => {
    setSelectedAccount(account);
    setShowExpenseModal(true);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowDetailsModal(false);
    setShowAddMoneyModal(false);
    setShowDeleteModal(false);
    setShowTransferModal(false);
    setShowExpenseModal(false);
  };

  if (loading) {
    return <div className="text-center mt-10"> <Loading /> </div>;
  }

  if (error) {
    return <div className="text-center text-red-600 mt-10">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          onClick={() => setShowCreateModal(true)}
        >
          Create Account
        </button>
        <button
          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
          onClick={openTransferModal}
        >
          Transfer Money
        </button>
        <div className="text-xl font-semibold">
          <span>Total Balance:</span>${formatCurrency(totalBalance)}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="p-4 border rounded-lg shadow hover:shadow-md cursor-pointer"
            onClick={() => openDetailsModal(account)}
          >
            <h3 className="text-lg font-semibold">{account.account_name}</h3>
            <p className="text-gray-600">Balance: ${formatCurrency(account.account_balance)}</p>
            <button
              className="bg-green-500 text-white py-1 px-3 mt-2 rounded hover:bg-green-600"
              onClick={(e) => {
                e.stopPropagation();
                openAddMoneyModal(account);
              }}
            >
              Add Money
            </button>
            <button
              className="bg-blue-500 text-white py-1 px-3 mt-2 rounded hover:bg-blue-600"
              onClick={(e) => {
                e.stopPropagation();
                openExpenseModal(account);
              }}
            >
              Add Expense
            </button>
            <button
              className="bg-red-500 text-white py-1 px-6 mt-2 rounded hover:bg-red-600 ml-2"
              onClick={(e) => {
                e.stopPropagation();
                openDeleteModal(account);
              }}
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateAccountModal
          onClose={() => setShowCreateModal(false)}
          onCreate={createAccount}  // Pass the create account function
        />
      )}

      {showDetailsModal && selectedAccount && (
        <AccountDetailsModal
          account={selectedAccount}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {showAddMoneyModal && selectedAccount && (
        <AddMoneyModal
          account={selectedAccount}
          onClose={() => setShowAddMoneyModal(false)}
          onAddMoney={addMoney} // Add money logic
        />
      )}

{showDeleteModal && selectedAccount && (
        <DeleteConfirmationModal
          account={selectedAccount}
          onClose={closeModals}
          onDelete={deleteAccount}  // Pass the deleteAccount function
        />
      )}

      {showTransferModal && (
        <TransferMoneyModal
          accounts={accounts}
          onClose={closeModals}
          onTransfer={transferMoney} // Transfer money logic
        />
      )}

      {showExpenseModal && selectedAccount && (
        <ExpenseModal
          account={selectedAccount}
          onClose={closeModals}
          onAddExpense={() => {fetchAccounts()}}
        />
      )}
    </div>
  );
};

export default AccountsPage;
