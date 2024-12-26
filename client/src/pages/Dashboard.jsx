import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler } from "chart.js";
import Loading from "../components/wrapper/Loading";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement,Filler);

const Dashboard = () => {
  const [chartData, setChartData] = useState(null);
  const [pieData, setPieData] = useState(null);
  const [accounts, setAccounts] = useState([]); // Accounts data
  const [transactions, setTransactions] = useState([]); // Latest transactions
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const response = await axios.get(`${import.meta.env.VITE_api}/transaction/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const {
          totalIncome,
          totalExpense,
          chartData: fetchedChartData,
          lastTransactions,
          lastAccount,
        } = response.data;

        // Set summary

        // Prepare chart data
        setChartData({
          labels: fetchedChartData.map((item) => item.label),
          datasets: [
            {
              label: "Income",
              data: fetchedChartData.map((item) => item.income),
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true,
            },
            {
              label: "Expense",
              data: fetchedChartData.map((item) => item.expense),
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              fill: true,
            },
          ],
        });

        // Prepare pie data
        setPieData({
          labels: ["Income", "Expense"],
          datasets: [
            {
              data: [totalIncome, totalExpense],
              backgroundColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
              hoverOffset: 4,
            },
          ],
        });

        // Set accounts and transactions
        setAccounts(lastAccount || []);
        setTransactions(lastTransactions || []);
      } catch (err) {
        setError(err?.message || "Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return <div className="error text-red-600">{error}</div>;
  }

  if (loading) {
    return <div><Loading /></div>;
  }

  return (
    <div className="px-6 py-8">
      {/* Analytics Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">Dashboard Analytics</h1>
        <div className="mt-4">
          {/* You can add any other elements here if needed */}
        </div>
      </div>

      {/* Division 1: Line Graph */}
      <div className="flex justify-center items-center w-full mb-12">
        <div className="w-full lg:w-3/4"> {/* Set width to 3/4 of the container */}
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Monthly Income and Expense",
                },
              },
            }}
          />
        </div>
      </div>

      {/* Division 2: Accounts and Pie Chart */}
      <div className="flex flex-wrap justify-center gap-8 mb-12">
        {/* Pie Chart Section */}
        <div className="w-full sm:w-1/2 md:w-1/3">
          <Pie
            data={pieData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Income vs Expense",
                },
              },
            }}
          />
        </div>

        {/* Account Details Section */}
        <div className="w-full sm:w-1/2 md:w-1/3 mt-8 sm:mt-0">
          <div className="pt-12"> {/* Adds padding from the top */}
            <div className="flex justify-center">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">Accounts</h2>
            </div>
            <div className="h-48 overflow-y-auto p-4 rounded-md">
              {accounts.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {accounts.map((account) => (
                    <li key={account.id} className="flex items-center justify-between mb-2">
                      <p className="text-xl font-semibold text-blue-600">{account.account_name}</p>
                      <p className="text-lg font-semibold text-gray-500">Balance: ${account.account_balance}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No accounts available.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Division 3: Latest Transactions */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Latest Transactions</h2>
        <div className="h-60 overflow-y-auto border border-gray-300 p-4 rounded-md">
          {transactions.length > 0 ? (
            <ul>
              {transactions.map((transaction) => (
                <li key={transaction.id} className="mb-2">
                  <p className="text-lg font-semibold">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    Amount: ${transaction.amount} | Date: {transaction.createdat}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No transactions available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;