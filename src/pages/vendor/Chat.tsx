import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../useAuth';
import { DashboardLayout } from './DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { Plus, MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '../../components/ui/badge';

interface Message {
  id: number;
  content: string;
  createdAt: string;
  messageBy: string;
}

interface Chat {
  id: number;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

interface ApiResponse {
  status: string;
  message: string;
  data: Chat[];
}

const Chat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      
      if (data.status === 'success') {
        setTickets(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch tickets');
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = () => {
    navigate('/vendor/createticket');
  };

  const handleViewTicket = (ticketId: number) => {
    navigate(`/vendor/ticket/${ticketId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'resolved':
        return 'bg-lime-100 text-lime-800 border-lime-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return <MessageSquare className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'closed':
        return <XCircle className="w-4 h-4" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <DashboardLayout title="Support Tickets" user={user}>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">Support Tickets</CardTitle>
              <Button 
                onClick={handleCreateTicket}
                className="bg-lime-600 hover:bg-lime-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Ticket
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-600"></div>
                <span className="ml-2 text-gray-600">Loading tickets...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <div className="flex">
                  <XCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="mt-1 text-sm text-red-700">{error}</p>
                    <Button 
                      onClick={fetchTickets}
                      className="mt-2 bg-red-600 hover:bg-red-700 text-white text-sm"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {!loading && !error && tickets.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No support tickets</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new support ticket.
                </p>
                <div className="mt-6">
                  <Button 
                    onClick={handleCreateTicket}
                    className="bg-lime-600 hover:bg-lime-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Ticket
                  </Button>
                </div>
              </div>
            )}

            {!loading && !error && tickets.length > 0 && (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleViewTicket(ticket.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {ticket.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Ticket #{ticket.id}</span>
                          <span>Created: {formatDate(ticket.createdAt)}</span>
                          <span>Updated: {formatDate(ticket.updatedAt)}</span>
                        </div>
                        {ticket.messages && ticket.messages.length > 0 && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">Last message:</span> {ticket.messages[0].content.substring(0, 100)}
                            {ticket.messages[0].content.length > 100 && '...'}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(ticket.status)} flex items-center gap-1`}>
                          {getStatusIcon(ticket.status)}
                          {ticket.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Chat;