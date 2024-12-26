import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import Loading from "../components/wrapper/Loading";
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=delete" />

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [searchTerm, setSearchTerm] = useState("");

  // Confirmation Modal States
  const [showModal, setShowModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const formatCurrency = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  const fetchTransactions = async (startDate, endDate, searchTerm) => {
    try {
      const token = localStorage.getItem("authToken");
      const queryParams = [
        `df=${startDate}`,
        `dt=${endDate}`,
        `s=${encodeURIComponent(searchTerm) || ""}`,
      ].join("&");

      const { data } = await axios.get(
        `${import.meta.env.VITE_api}/transaction?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTransactions(data.data);
    } catch (error) {
      setError(error?.message || "Failed to fetch transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPastSevenDays = () => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    return { startDate: format(sevenDaysAgo, "yyyy-MM-dd"), endDate: format(today, "yyyy-MM-dd") };
  };

  useEffect(() => {
    setLoading(true);
    const { startDate: defaultStartDate, endDate: defaultEndDate } = getPastSevenDays();
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
    fetchTransactions(defaultStartDate, defaultEndDate, "");
  }, []);

  const handleSearchClick = () => {
    setLoading(true);
    fetchTransactions(startDate, endDate, searchTerm);
  };

  const handleDeleteTransaction = async () => {
    try {
      const token = localStorage.getItem("authToken");
      setLoading(true);
  
      await axios.delete(`${import.meta.env.VITE_api}/transaction/delete`, {
        headers: { Authorization: `Bearer ${token}` }, // Headers go here
        data: { transactionId: transactionToDelete }, // Body goes inside 'data'
      });
  
      // Refresh transactions after successful deletion
      fetchTransactions(startDate, endDate, searchTerm);
    } catch (error) {
      setError(error?.message || "Failed to delete transaction. Please try again.");
    } finally {
      setShowModal(false); // Close the modal
      setLoading(false);
    }
  };
  

  const openDeleteModal = (transactionId) => {
    setTransactionToDelete(transactionId);
    setShowModal(true);
  };

  const closeDeleteModal = () => {
    setTransactionToDelete(null);
    setShowModal(false);
  };

  if (loading) {
    return <div className="text-center mt-10"><Loading/></div>;
  }

  if (error) {
    return <div className="text-center text-red-600 mt-10">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Filters */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <label htmlFor="start-date" className="mr-2">Start Date:</label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="end-date" className="mr-2">End Date:</label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="search-term" className="mr-2">Search:</label>
          <input
            type="text"
            id="search-term"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded"
          />
        </div>
        <button
          onClick={handleSearchClick}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Search
        </button>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th scope="col" className="px-4 py-2 text-left">ID</th>
              <th scope="col" className="px-4 py-2 text-left">Description</th>
              <th scope="col" className="px-4 py-2 text-left">Type</th>
              <th scope="col" className="px-4 py-2 text-left">Source</th>
              <th scope="col" className="px-4 py-2 text-left">Status</th>
              <th scope="col" className="px-4 py-2 text-left">Amount</th>
              <th scope="col" className="px-4 py-2 text-left">Date</th>
              <th scope="col" className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-4 py-2 border">{transaction.id}</td>
                <td className="px-4 py-2 border">{transaction.description}</td>
                <td className="px-4 py-2 border">{transaction.type}</td>
                <td className="px-4 py-2 border">{transaction.source}</td>
                <td className="px-4 py-2 border">{transaction.status}</td>
                <td className="px-4 py-2 border">{formatCurrency(transaction.amount)}</td>
                <td className="px-4 py-2 border">{format(new Date(transaction.createdat), "yyyy-MM-dd")}</td>
                <td className="px-4 py-2 border text-center">
                  <button
                    onClick={() => openDeleteModal(transaction.id)}
                    className="text-red-600 hover:text-red-800"
                  >
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={closeDeleteModal} >
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-bold mb-4">Delete Transaction</h2>
            <p className="mb-4 text-gray-700">
              Transactions are unchangeable and treated as history. Deleting this might cause inconsistency in calculation, as consistency part is still under development. Are you sure you want to proceed?
            </p>
            <div className="flex justify-end">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-300 text-black rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTransaction}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionPage;
