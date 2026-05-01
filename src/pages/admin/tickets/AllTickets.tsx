import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Clock, CheckCircle, XCircle, User, UserCheck, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../../useAuth';
import { AdminDashboardLayout } from '../layout/AdminDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';

interface Message {
  id: number;
  content: string;
  createdAt: string;
  messageBy: string;
}

interface Vendor {
  id: number;
  name: string;
  email: string;
  company?: string;
}

interface AssignedUser {
  id: number;
  name: string;
  email: string;
  utype: string;
}

interface Chat {
  id: number;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  user: Vendor;
  admin?: AssignedUser;
}

interface ApiResponse {
  status: string;
  message: string;
  data: Chat[];
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
  utype: 'ADMIN' | 'SUBADMIN';
}

const AllTickets = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Chat[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Chat | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [assigningTicket, setAssigningTicket] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    assignedTo: 'all'
  });

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchTickets();
    fetchAdminUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tickets, filters]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

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
        console.log("object chat", data.data)
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

  const fetchAdminUsers = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/user/all/admin-users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setAdminUsers(data.data);
        }
      }
    } catch (err) {
      console.error('Error fetching admin users:', err);
    }
  };

  const handleViewTicket = (ticketId: number) => {
    navigate(`/admin/ticket/${ticketId}`);
  };

  const handleAssignTicket = (ticket: Chat) => {
    setSelectedTicket(ticket);
    setIsAssignDialogOpen(true);
  };

  const updateTicketStatus = async (status: string, ticketId: number) => {
    try {
      setUpdatingStatus(ticketId);
      const response = await fetch(`${BACKEND_URL}/chat/update/status/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: status }),
      });
      
      if (response.ok) {
        // Update local state immediately for better UX
        setTickets(prev => prev.map(ticket => 
          ticket.id === ticketId 
            ? { ...ticket, status: status }
            : ticket
        ));
        
        // Also refresh from server to ensure consistency
        await fetchTickets();
      } else {
        throw new Error('Failed to update status');
      }
    } catch (err) {
      console.error('Error updating ticket status:', err);
      // You can add toast notification here if you have toast library
      // toast.error('Failed to update status.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const assignTicketToUser = async (userId: number) => {
    if (!selectedTicket) return;

    try {
      setAssigningTicket(true);
      const response = await fetch(`${BACKEND_URL}/chat/update/${selectedTicket.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminId: userId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          // Find the assigned admin user
          const assignedAdmin = adminUsers.find(u => u.id === userId);
          
          // Update the ticket in the local state
          setTickets(prev => prev.map(ticket => 
            ticket.id === selectedTicket.id 
              ? { ...ticket, admin: assignedAdmin }
              : ticket
          ));
          
          setIsAssignDialogOpen(false);
          setSelectedTicket(null);
          
          // Refresh the tickets to ensure we have the latest data
          await fetchTickets();
        }
      }
    } catch (err) {
      console.error('Error assigning ticket:', err);
    } finally {
      setAssigningTicket(false);
    }
  };

  const applyFilters = () => {
    let filtered = tickets;

    if (filters.status !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === filters.status);
    }

    if (filters.assignedTo !== 'all') {
      if (filters.assignedTo === 'unassigned') {
        filtered = filtered.filter(ticket => !ticket.admin);
      } else {
        filtered = filtered.filter(ticket => ticket.admin?.id.toString() === filters.assignedTo);
      }
    }

    setFilteredTickets(filtered);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTickets = filteredTickets.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
      case 'inprogress':
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
      case 'inprogress':
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

  const getAvailableStatusOptions = (currentStatus: string) => {
    const options = [];
    
    if (currentStatus !== 'INPROGRESS') {
      options.push({ value: 'INPROGRESS', label: 'In Progress' });
    }
    if (currentStatus !== 'RESOLVED') {
      options.push({ value: 'RESOLVED', label: 'Resolved' });
    }
    options.push({ value: 'CLOSED', label: 'Closed' });
    
    return options;
  };

  return (
    <AdminDashboardLayout title="All Support Tickets" user={user}>
      <div className="max-w-7xl mx-auto py-4 px-2 sm:py-6 sm:px-4 lg:px-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
              <CardTitle className="text-xl sm:text-2xl font-bold">All Support Tickets</CardTitle>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="OPEN">Open</SelectItem>
                      <SelectItem value="INPROGRESS">In Progress</SelectItem>
                      <SelectItem value="RESOLVED">Resolved</SelectItem>
                      <SelectItem value="CLOSED">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                
                  <Select value={filters.assignedTo} onValueChange={(value) => setFilters(prev => ({ ...prev, assignedTo: value }))}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Assigned To" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Assignments</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {adminUsers.map(user => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name} ({user.utype})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
              </div>
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

            {!loading && !error && filteredTickets.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No support tickets found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No tickets match your current filters or no tickets have been created yet.
                </p>
              </div>
            )}

            {!loading && !error && filteredTickets.length > 0 && (
              <div className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center text-sm text-gray-600 mb-4">
                  <span>
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredTickets.length)} of {filteredTickets.length} tickets
                  </span>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
                
                {currentTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col gap-4">
                      {/* Header Section */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                              {ticket.title}
                            </h3>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-2">
                            <span className="whitespace-nowrap">Ticket #{ticket.id}</span>
                            <span className="truncate">Vendor: {ticket.user.name} ({ticket.user.company || ticket.user.email})</span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-2">
                            <span className="whitespace-nowrap">Created: {formatDate(ticket.createdAt)}</span>
                            <span className="whitespace-nowrap">Updated: {formatDate(ticket.updatedAt)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="truncate">
                                Assigned to: {ticket.admin 
                                  ? `${ticket.admin.name} (${ticket.admin.utype})`
                                  : 'Unassigned'
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Status Badge */}
                        <div className="flex items-center">
                          <Badge className={`${getStatusColor(ticket.status)} flex items-center gap-1 text-xs`}>
                            {getStatusIcon(ticket.status)}
                            {ticket.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Last Message */}
                      {ticket.messages && ticket.messages.length > 0 && (
                        <div className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          <span className="font-medium">Last message:</span> {ticket.messages[0].content.substring(0, 100)}
                          {ticket.messages[0].content.length > 100 && '...'}
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:items-center">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                          {/* Status Update Select - only show if not closed */}
                          {ticket.status !== 'CLOSED' && (
                            <div onClick={(e) => e.stopPropagation()}>
                              <Select 
                                value="" // Always keep empty to show placeholder
                                onValueChange={(value) => {
                                  if (value) {
                                    updateTicketStatus(value, ticket.id);
                                  }
                                }}
                                disabled={updatingStatus === ticket.id}
                              >
                                <SelectTrigger className="w-full sm:w-32">
                                  <SelectValue placeholder={updatingStatus === ticket.id ? "Updating..." : "Update Status"} />
                                </SelectTrigger>
                                <SelectContent>
                                  {getAvailableStatusOptions(ticket.status).map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          {user && user.utype == 'SUPERADMIN' &&(
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAssignTicket(ticket);
                            }}
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto"
                          >
                            <UserCheck className="w-4 h-4 mr-1" />
                            {ticket.admin ? 'Reassign' : 'Assign'}
                          </Button>
                          )}
                          
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewTicket(ticket.id);
                            }}
                            variant="default"
                            size="sm"
                            className="w-full sm:w-auto bg-lime-600 hover:bg-lime-700"
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Chat
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:items-center sm:gap-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-full sm:w-auto"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>
                    
                    <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className={`w-8 h-8 sm:w-10 sm:h-10 ${currentPage === page ? "bg-lime-600 hover:bg-lime-700" : ""}`}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="w-full sm:w-auto"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Assignment Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Assign Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Assign ticket "#{selectedTicket?.id} - {selectedTicket?.title}" to:
              </p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {adminUsers.map(user => (
                  <Button
                    key={user.id}
                    onClick={() => assignTicketToUser(user.id)}
                    variant="outline"
                    className="w-full justify-start text-left"
                    disabled={assigningTicket}
                  >
                    <User className="w-4 h-4 mr-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="truncate">
                        {user.name} - {user.utype}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {user.email}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
              {assigningTicket && (
                <div className="flex justify-center items-center mt-4">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-lime-600"></div>
                  <span className="ml-2 text-sm text-gray-600">Assigning ticket...</span>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminDashboardLayout>
  );
};

export default AllTickets;