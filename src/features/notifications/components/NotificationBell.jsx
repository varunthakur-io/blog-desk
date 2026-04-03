import React, { useState } from 'react';
import { Bell, Heart, UserPlus, MessageSquare, CheckCheck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  selectAllNotifications,
  markAsRead,
  markAllAsRead as markAllAsReadAction,
} from '../store';
import { notificationService } from '../services/notification.service';
import { useNotifications } from '../hooks/useNotifications';
import { useProfile } from '@/features/profile';
import { formatDate } from '@/utils/formatters';
import { cn } from '@/lib/utils';

/**
 * Animated Notification Item Component
 */
const NotificationItem = ({ notification, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile, avatarUrl, displayName } = useProfile({ userId: notification.senderId });

  const handleItemClick = async () => {
    if (!notification.isRead) {
      dispatch(markAsRead(notification.$id));
      await notificationService.markAsRead(notification.$id);
    }

    onClose();

    // Navigate based on type
    if (notification.type === 'follow') {
      navigate(`/profile/${profile?.username}`);
    } else if (notification.postId) {
      navigate(`/posts/${notification.postId}`);
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'like': return <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />;
      case 'follow': return <UserPlus className="h-3 w-3 text-blue-500" />;
      case 'comment': return <MessageSquare className="h-3 w-3 text-green-500 fill-green-500" />;
      default: return <Bell className="h-3 w-3 text-primary" />;
    }
  };

  const getMessage = () => {
    switch (notification.type) {
      case 'like': return 'liked your post';
      case 'follow': return 'started following you';
      case 'comment': return 'commented on your post';
      default: return 'sent you a notification';
    }
  };

  return (
    <button
      onClick={handleItemClick}
      className={cn(
        "flex items-start gap-3 w-full p-3 text-left hover:bg-muted/50 transition-colors border-b border-border/40 last:border-0",
        !notification.isRead && "bg-primary/5"
      )}
    >
      <div className="relative shrink-0">
        <Avatar className="h-9 w-9 border border-border">
          <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />
          <AvatarFallback className="text-[10px] bg-muted">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -right-1 -bottom-1 bg-background rounded-full p-1 border border-border shadow-sm">
          {getIcon()}
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-semibold text-foreground">{displayName}</span>{' '}
          <span className="text-muted-foreground">{getMessage()}</span>
        </p>
        <p className="text-[10px] text-muted-foreground mt-1">
          {formatDate(notification.$createdAt, { hour: 'numeric', minute: 'numeric' })}
        </p>
      </div>

      {!notification.isRead && (
        <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
      )}
    </button>
  );
};

/**
 * Main Notification Bell Component
 */
const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { unreadCount } = useNotifications();
  const notifications = useSelector(selectAllNotifications);

  const handleMarkAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n.$id);
    if (unreadIds.length === 0) return;

    dispatch(markAllAsReadAction());
    if (notifications[0]) {
      await notificationService.markAllAsRead(notifications[0].recipientId);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative rounded-full hover:bg-muted h-9 w-9 transition-all duration-300 active:scale-90"
        >
          <Bell className="h-[1.1rem] w-[1.1rem] text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground border-2 border-background animate-in zoom-in duration-300">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className="w-80 p-0 shadow-2xl border-border/60 overflow-hidden rounded-2xl"
      >
        <div className="flex items-center justify-between p-4 bg-muted/30">
          <DropdownMenuLabel className="font-bold text-base p-0">
            Notifications
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllRead}
              className="h-7 text-[11px] font-bold text-primary hover:text-primary hover:bg-primary/10 gap-1.5 px-2 rounded-full"
            >
              <CheckCheck className="h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>
        
        <DropdownMenuSeparator className="m-0" />

        <div className="max-h-[400px] overflow-y-auto overflow-x-hidden scrollbar-thin">
          {notifications.length > 0 ? (
            <div className="flex flex-col">
              {notifications.map((n) => (
                <NotificationItem 
                  key={n.$id} 
                  notification={n} 
                  onClose={() => setOpen(false)} 
                />
              ))}
            </div>
          ) : (
            <div className="py-12 px-4 text-center flex flex-col items-center gap-3">
              <div className="p-3 rounded-full bg-muted/50">
                <Bell className="h-6 w-6 text-muted-foreground/40" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">No notifications yet</p>
                <p className="text-xs text-muted-foreground">
                  Activity like follows, likes and comments will appear here.
                </p>
              </div>
            </div>
          )}
        </div>
        
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="m-0" />
            <div className="p-2 bg-muted/10">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-xs text-muted-foreground hover:text-foreground h-8"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
