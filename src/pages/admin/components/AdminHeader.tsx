import { Bell, Loader } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "../../../components/ui/dropdown-menu";
import { Badge } from "../../../components/ui/badge";
import { useState, useEffect } from "react";

interface DashboardHeaderProps {
  title: string;
  user: any;
}

interface NotificationData {
  chatId: number;
  userId?: number;
  userName?: string;
  adminId?: number;
  adminName?: string;
  unreadCount: number;
  latestMessage: any;
}

interface NotificationResponse {
  status: string;
  message: string;
  data?: {
    userType: string;
    totalUnreadChats: number;
    totalUnreadMessages: number;
    notifications: NotificationData[];
  };
}

export const AdminHeader = ({ title, user }: DashboardHeaderProps) => {
  const [notifications, setNotifications] = useState<NotificationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch notifications
  const fetchNotifications = async () => {
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      setIsLoading(true);
      const response = await fetch(`${baseUrl}/message/notify/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data: NotificationResponse = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Complete function to update message as read
  const updateMessageIsRead = async (messageId: number) => {
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${baseUrl}/message/notification/update/by/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update message as read');
      }

      const result = await response.json();
      console.log('Message marked as read:', result);
      
      // Refresh notifications after marking as read
      await fetchNotifications();
      
      return result;
    } catch (error) {
      console.error('Error updating message as read:', error);
      throw error;
    }
  };

  // Fetch notifications on component mount and set up polling
  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const totalUnreadMessages = notifications?.data?.totalUnreadMessages || 0;
  const notificationList = notifications?.data?.notifications || [];

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Enhanced handler for notification clicks
   const handleNotificationClick = async (messageId: number) => {
    try {
      // Mark the message as read when clicked
      await updateMessageIsRead(messageId);
      
      // Navigate to specific chat or handle notification click
      console.log('Navigate to chat:', messageId);
      
      // Example navigation (uncomment and modify based on your routing setup):
      // router.push(`/chat/${chatId}`);
      // or
      // window.location.href = `/chat/${chatId}`;
      
    } catch (error) {
      console.error('Error handling notification click:', error);
      // You might want to show a toast notification here
    }
  };

  // Handler for marking all messages as read
  // const handleMarkAllAsRead = async () => {
  //   try {
  //     const markAllPromises = notificationList.map(notification => 
  //       updateMessageIsRead(notification.chatId)
  //     );
      
  //     await Promise.all(markAllPromises);
  //     console.log('All messages marked as read');
      
  //   } catch (error) {
  //     console.error('Error marking all messages as read:', error);
  //   }
  // };

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 gap-4">
        <h1 className="text-xl font-semibold">{title}</h1>
        <div className="ml-auto flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {totalUnreadMessages > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-600"
                  >
                    {totalUnreadMessages > 99 ? '99+' : totalUnreadMessages}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex justify-between items-center">
                <span>Notifications</span>
                {/* <div className="flex items-center gap-2">
                  {totalUnreadMessages > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-6 px-2"
                      onClick={handleMarkAllAsRead}
                    >
                      Mark all read
                    </Button>
                  )}
                  {isLoading && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                  )}
                </div> */}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
               {isLoading && (
                <Loader />
               )}
              {notificationList.length === 0 ? (
                <DropdownMenuItem disabled>
                  <div className="text-center py-4 text-gray-500">
                    No new notifications
                  </div>
                </DropdownMenuItem>
              ) : (
                <>
                  {notificationList.slice(0, 5).map((notification) => (
                    <DropdownMenuItem
                      key={notification.chatId}
                      className="cursor-pointer p-3 hover:bg-gray-50 focus:bg-gray-50"
                      onClick={() => handleNotificationClick(notification.latestMessage.id)}
                    >
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-sm">
                            {notification.userName || notification.adminName}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {notification.unreadCount}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {notification.latestMessage?.content || 'New message'}
                        </p>
                        <span className="text-xs text-gray-400">
                          {notification.latestMessage?.createdAt && 
                            formatTimeAgo(notification.latestMessage.createdAt)
                          }
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  
                  {/* {notificationList.length > 5 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-center text-blue-600 cursor-pointer hover:bg-blue-50"
                        onClick={() => {
                          // Handle "View all notifications" click
                          console.log('View all notifications clicked');
                          // Navigate to notifications page
                          // router.push('/notifications');
                        }}
                      >
                        View all notifications
                      </DropdownMenuItem>
                    </>
                  )} */}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Avatar>
            <AvatarImage src="/placeholder.png" alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};