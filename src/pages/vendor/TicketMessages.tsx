import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { DashboardLayout } from './DashboardLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  User, 
  Headphones, 
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Paperclip,
  Download,
  X
} from 'lucide-react';
import { useAuth } from '../../useAuth';

interface Message {
  id: number;
  content: string;
  messageBy: 'USER' | 'ADMIN' | 'SUBADMIN';
  isRead: boolean;
  createdAt: string;
  userId: number;
  attachments?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Chat {
  id: number;
  title: string;
  status: string;
  priority?: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  messages: Message[];
  user: User;
}

interface ApiResponse {
  status: string;
  message: string;
  data: Chat;
}

interface SendMessageResponse {
  status: string;
  message: string;
  data: Message;
}

const TicketMessages = () => {
  const { id } = useParams<{ id: string }>();
  const chatId = id;
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  useEffect(() => {
    if (chatId) {
      fetchChatMessages();
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-refresh messages every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (chatId && !loading && !sending) {
        refreshMessages();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [chatId, loading, sending]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${BACKEND_URL}/chat/${chatId}`, {
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
        setChat(data.data);
        setMessages(data.data.messages || []);
      } else {
        throw new Error(data.message || 'Failed to fetch chat messages');
      }
    } catch (err) {
      console.error('Error fetching chat messages:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching messages');
    } finally {
      setLoading(false);
    }
  };

  const refreshMessages = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(`${BACKEND_URL}/chat/${chatId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: ApiResponse = await response.json();
        if (data.status === 'success') {
          setChat(data.data);
          setMessages(data.data.messages || []);
        }
      }
    } catch (err) {
      console.error('Error refreshing messages:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BACKEND_URL}/message/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    const data = await response.json();
    console.log("Upload response:", data);
    
    // Return the correct file URL based on your API response structure
    return data.data?.fileUrl || data.data?.url || data.fileUrl || data.url;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!newMessage.trim() && !selectedFile) || !chatId) return;

    try {
      setSending(true);
      setError(null);

      let attachmentUrl = '';
      
      // Upload file if selected
      if (selectedFile) {
        setUploading(true);
        try {
          attachmentUrl = await uploadFile(selectedFile);
          console.log("Attachment URL:", attachmentUrl);
        } catch (uploadError) {
          throw new Error('Failed to upload file. Please try again.');
        } finally {
          setUploading(false);
        }
      }

      const response = await fetch(`${BACKEND_URL}/message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          chatId: parseInt(chatId),
          content: newMessage.trim() || (selectedFile ? `Sent an attachment: ${selectedFile.name}` : ''),
          attachments: attachmentUrl,
          messageBy: 'USER',
          isRead: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SendMessageResponse = await response.json();
      
      if (data.status === 'success') {
        setMessages(prev => [...prev, data.data]);
        setNewMessage('');
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while sending the message');
    } finally {
      setSending(false);
      setUploading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/vendor/support-chats');
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
        return <Clock className="w-4 h-4" />;
      case 'in_progress':
        return <RefreshCw className="w-4 h-4" />;
      case 'closed':
        return <XCircle className="w-4 h-4" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const getFileNameFromUrl = (url: string) => {
    return url.split('/').pop() || 'Download';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <DashboardLayout title="Support Ticket" user={user}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-600"></div>
            <span className="ml-2 text-gray-600">Loading messages...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !chat) {
    return (
      <DashboardLayout title="Support Ticket" user={user}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <Button 
                  onClick={fetchChatMessages}
                  className="mt-2 bg-red-600 hover:bg-red-700 text-white text-sm"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Support Ticket" user={user}>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Card className="h-[calc(100vh-200px)] flex flex-col">
          {/* Header */}
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={handleGoBack}
                  className="p-2 hover:bg-gray-100"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                  <CardTitle className="text-xl font-bold">
                    {chat?.title || 'Support Ticket'}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Ticket #{chat?.id} • Created {chat?.createdAt && new Date(chat.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={refreshMessages}
                  disabled={refreshing}
                  className="p-2 hover:bg-gray-100"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                </Button>
                {chat?.status && (
                  <Badge className={`${getStatusColor(chat.status)} flex items-center gap-1`}>
                    {getStatusIcon(chat.status)}
                    {chat.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.messageBy === 'USER' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.messageBy === 'USER'
                        ? 'bg-lime-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.messageBy === 'USER' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Headphones className="w-4 h-4" />
                      )}
                      <span className="text-xs opacity-75">
                        {message.messageBy === 'USER' ? 'You' : 'Support'}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    
                    {/* Attachment Display */}
                    {message.attachments && (
                      <div className={`mt-2 p-2 rounded border ${
                        message.messageBy === 'USER' 
                          ? 'bg-lime-700 border-lime-500' 
                          : 'bg-gray-200 border-gray-300'
                      }`}>
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-4 h-4" />
                          <span className="text-xs flex-1 truncate">
                            {getFileNameFromUrl(message.attachments)}
                          </span>
                          <a
                            href={message.attachments}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-1 rounded hover:bg-opacity-20 hover:bg-white ${
                              message.messageBy === 'USER' ? 'text-lime-100' : 'text-gray-600'
                            }`}
                          >
                            <Download className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    )}
                    
                    <p className={`text-xs mt-1 ${
                      message.messageBy === 'USER' ? 'text-lime-100' : 'text-gray-500'
                    }`}>
                      {formatMessageTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Message Input */}
          {chat?.status?.toLowerCase() === 'closed' ? (
            <div className="border-t p-4">
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center">
                <XCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 font-medium">This ticket is closed</p>
                <p className="text-xs text-gray-500 mt-1">You cannot send new messages to a closed ticket</p>
              </div>
            </div>
          ) : (
            <div className="border-t p-4">
              {error && (
                <div className="mb-3 bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="flex">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <p className="ml-2 text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}
              
              {/* Selected File Display */}
              {selectedFile && (
                <div className="mb-3 bg-gray-50 border border-gray-200 rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700 truncate">
                        {selectedFile.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({formatFileSize(selectedFile.size)})
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      className="p-1 hover:bg-gray-200"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <div className="flex-1">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="resize-none"
                    rows={1}
                    disabled={sending || uploading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                </div>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={sending || uploading}
                    className="px-3"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button
                    type="submit"
                    onClick={handleSendMessage}
                    disabled={sending || uploading || (!newMessage.trim() && !selectedFile)}
                    className="bg-lime-600 hover:bg-lime-700 text-white px-4"
                  >
                    {sending || uploading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept="*/*"
              />
              
              <p className="text-xs text-gray-500 mt-1">
                Press Enter to send, Shift+Enter for new line • Max file size: 10MB
              </p>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TicketMessages;