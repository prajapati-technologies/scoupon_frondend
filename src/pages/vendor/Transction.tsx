import { useEffect, useState } from 'react';
import { useAuth } from '../../useAuth';
import { Card, CardContent } from '../../components/ui/card';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { DashboardLayout } from './DashboardLayout';

interface ZipCode {
  id: number;
  zipcode: string;
  userId: number;
  subscribePackageId: number;
  createdAt: string;
  updatedAt: string;
}

interface SubscribePackage {
  id: number;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  packageId: number;
  userId: number;
  zipCodes: ZipCode[];
}

interface Package {
  id: number;
  name: string;
  price: number;
  duration: number;
  status: string;
}

interface Transaction {
  id: number;
  amount: number;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  subscribePackageId: string | null;
  package?: Package; // Make optional since it's not in the API response
  subscribe_package: SubscribePackage; // Add the actual property from API
}

const Transaction = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchFilters, setSearchFilters] = useState({
    date: '',
    subscriptionId: '',
    amount: '',
    status: '',
    paymentMethod: '',
    zipCodes: '', // Fixed: renamed from 'zipcodes' to match the filter
  });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchFilters, transactions]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/transactions/my/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTransactions(response.data);
      setFilteredTransactions(response.data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch transactions';
      setError(message);
      toast.error('Failed to fetch transaction history');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const filtered = transactions.filter((transaction) => {
      const date = new Date(transaction.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      
      // Helper function to get zip codes as a string
      const getZipCodesString = (transaction: Transaction) => {
        if (transaction.subscribe_package?.zipCodes) {
          return transaction.subscribe_package.zipCodes
            .map(zip => zip.zipcode)
            .join(', ');
        }
        return '';
      };

      const zipCodesString = getZipCodesString(transaction);

      return (
        (searchFilters.date ? date.includes(searchFilters.date) : true) &&
        (searchFilters.subscriptionId
          ? transaction.subscribePackageId?.toLowerCase().includes(searchFilters.subscriptionId.toLowerCase())
          : true) &&
        (searchFilters.amount
          ? transaction.amount.toString().includes(searchFilters.amount)
          : true) &&
        (searchFilters.status
          ? transaction.paymentStatus.toLowerCase().includes(searchFilters.status.toLowerCase())
          : true) &&
        (searchFilters.paymentMethod
          ? transaction.paymentMethod.toLowerCase().includes(searchFilters.paymentMethod.toLowerCase())
          : true) &&
        (searchFilters.zipCodes
          ? zipCodesString.toLowerCase().includes(searchFilters.zipCodes.toLowerCase())
          : true)
      );
    });
    setFilteredTransactions(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>, column: string) => {
    setSearchFilters({ ...searchFilters, [column]: e.target.value });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to display zip codes
  const displayZipCodes = (transaction: Transaction) => {
    if (transaction.subscribe_package?.zipCodes && transaction.subscribe_package.zipCodes.length > 0) {
      return transaction.subscribe_package.zipCodes
        .map(zip => zip.zipcode)
        .join(', ');
    }
    return 'N/A';
  };
  const deleteTransaction = async (id: number) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success('Transaction deleted successfully');
      fetchTransactions();
    } catch (error) {
      toast.error('Failed to delete transaction');
    }
  };
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredTransactions.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);

  return (
    <DashboardLayout title="Transaction History" user={user}>
      <div className="max-w-7xl mx-auto py-6 space-y-8">
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-[#a0b830]" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-red-500 mb-2">Failed to load transactions</p>
                <button onClick={fetchTransactions} className="text-[#a0b830] hover:underline">
                  Try again
                </button>
              </div>
            ) : transactions.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No transactions found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                        <input
                          type="text"
                          placeholder="Search Date"
                          value={searchFilters.date}
                          onChange={(e) => handleSearchChange(e, 'date')}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm mt-1"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subscription ID
                        <input
                          type="text"
                          placeholder="Search Subscription ID"
                          value={searchFilters.subscriptionId}
                          onChange={(e) => handleSearchChange(e, 'subscriptionId')}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm mt-1"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                        <input
                          type="text"
                          placeholder="Search Amount"
                          value={searchFilters.amount}
                          onChange={(e) => handleSearchChange(e, 'amount')}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm mt-1"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Zip Codes
                        <input
                          type="text"
                          placeholder="Search Zip Codes"
                          value={searchFilters.zipCodes}
                          onChange={(e) => handleSearchChange(e, 'zipCodes')}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm mt-1"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                        <input
                          type="text"
                          placeholder="Search Status"
                          value={searchFilters.status}
                          onChange={(e) => handleSearchChange(e, 'status')}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm mt-1"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Method
                        <input
                          type="text"
                          placeholder="Search Payment Method"
                          value={searchFilters.paymentMethod}
                          onChange={(e) => handleSearchChange(e, 'paymentMethod')}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm mt-1"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>

                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentRows.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(transaction.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {transaction.subscribePackageId || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          ${transaction.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {displayZipCodes(transaction)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                              transaction.paymentStatus
                            )}`}
                          >
                            {transaction.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {transaction.paymentMethod || 'N/A'}
                        </td>
                        {transaction.paymentStatus !== 'COMPLETED' && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => deleteTransaction(transaction.id)}
                            className="text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {filteredTransactions.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Transaction;