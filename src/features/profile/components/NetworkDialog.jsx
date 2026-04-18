import React from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Users } from 'lucide-react';

const UserItem = ({ user, onClick }) => (
  <Link
    to={`/profile/${user.username}`}
    onClick={onClick}
    className="hover:bg-muted/50 group flex items-center justify-between rounded-xl p-3 transition-colors"
  >
    <div className="flex items-center gap-3">
      <Avatar className="group-hover:border-primary/30 h-10 w-10 border transition-colors">
        {user.avatarUrl && <AvatarImage src={user.avatarUrl} className="object-cover" />}
        <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
          {user.name?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="leading-tight">
        <p className="text-foreground group-hover:text-primary text-sm font-bold transition-colors">
          {user.name}
        </p>
        <p className="text-muted-foreground text-xs">@{user.username}</p>
      </div>
    </div>
  </Link>
);

const NetworkDialog = ({ isOpen, onOpenChange, title, users = [], isLoading }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card overflow-hidden rounded-2xl p-0 shadow-xl sm:max-w-[400px]">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2.5 text-xl font-extrabold">
            <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <Users className="h-4.5 w-4.5" />
            </div>
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] space-y-1 overflow-y-auto p-2">
          {isLoading ? (
            <div className="space-y-4 p-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : users.length > 0 ? (
            users.map((user) => (
              <UserItem key={user.$id} user={user} onClick={() => onOpenChange(false)} />
            ))
          ) : (
            <div className="space-y-2 py-12 text-center">
              <p className="text-foreground/50 text-sm font-bold">No users found</p>
              <p className="text-muted-foreground text-xs">
                When people join, they will appear here.
              </p>
            </div>
          )}
        </div>

        <div className="bg-muted/30 border-border/50 border-t p-4 text-center">
          <p className="text-muted-foreground/50 text-[10px] font-bold tracking-widest uppercase">
            Blog Desk Network
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NetworkDialog;
