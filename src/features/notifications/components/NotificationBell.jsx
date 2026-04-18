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
import { selectAllNotifications, markAsRead, markAllAsRead as markAllAsReadAction } from '../store';
import { notificationService } from '../services/notification.service';
import { useNotifications } from '../hooks/useNotifications';
import { useProfileIdentity } from '@/features/profile';
import { formatDate } from '@/utils/formatters';
import { cn } from '@/lib/utils';

/**
 * Animated Notification Item Component
 */
const NotificationItem = ({ notification, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile, avatarUrl, displayName } = useProfileIdentity({ userId: notification.senderId });

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
      case 'like':
        return <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />;
      case 'follow':
        return <UserPlus className="h-3 w-3 text-blue-500" />;
      case 'comment':
        return <MessageSquare className="h-3 w-3 fill-green-500 text-green-500" />;
      default:
        return <Bell className="text-primary h-3 w-3" />;
    }
  };

  const getMessage = () => {
    switch (notification.type) {
      case 'like':
        return 'liked your post';
      case 'follow':
        return 'started following you';
      case 'comment':
        return 'commented on your post';
      default:
        return 'sent you a notification';
    }
  };

  return (
    <button
      onClick={handleItemClick}
      className={cn(
        'hover:bg-muted/50 border-border/40 flex w-full items-start gap-3 border-b p-3 text-left transition-colors last:border-0',
        !notification.isRead && 'bg-primary/5',
      )}
    >
      <div className="relative shrink-0">
        <Avatar className="border-border h-9 w-9 border">
          <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />
          <AvatarFallback className="bg-muted text-[10px]">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="bg-background border-border absolute -right-1 -bottom-1 rounded-full border p-1 shadow-sm">
          {getIcon()}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm">
          <span className="text-foreground font-semibold">{displayName}</span>{' '}
          <span className="text-muted-foreground">{getMessage()}</span>
        </p>
        <p className="text-muted-foreground mt-1 text-[10px]">
          {formatDate(notification.$createdAt, { hour: 'numeric', minute: 'numeric' })}
        </p>
      </div>

      {!notification.isRead && <div className="bg-primary mt-2 h-2 w-2 shrink-0 rounded-full" />}
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
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.$id);
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
          className="hover:bg-muted relative h-9 w-9 rounded-full transition-all duration-300 active:scale-90"
        >
          <Bell className="text-muted-foreground h-[1.1rem] w-[1.1rem]" />
          {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground border-background animate-in zoom-in absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full border-2 px-1 text-[10px] font-bold duration-300">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="border-border/60 w-80 overflow-hidden rounded-2xl p-0 shadow-2xl"
      >
        <div className="bg-muted/30 flex items-center justify-between p-4">
          <DropdownMenuLabel className="p-0 text-base font-bold">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              className="text-primary hover:text-primary hover:bg-primary/10 h-7 gap-1.5 rounded-full px-2 text-[11px] font-bold"
            >
              <CheckCheck className="h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>

        <DropdownMenuSeparator className="m-0" />

        <div className="scrollbar-thin max-h-[400px] overflow-x-hidden overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="flex flex-col">
              {notifications.map((n) => (
                <NotificationItem key={n.$id} notification={n} onClose={() => setOpen(false)} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
              <div className="bg-muted/50 rounded-full p-3">
                <Bell className="text-muted-foreground/40 h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-foreground text-sm font-semibold">No notifications yet</p>
                <p className="text-muted-foreground text-xs">
                  Activity like follows, likes and comments will appear here.
                </p>
              </div>
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="m-0" />
            <div className="bg-muted/10 p-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground h-8 w-full text-xs"
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
