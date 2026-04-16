import React from 'react';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Users } from 'lucide-react';

const UserItem = ({ user, onClick }) => (
  <Link 
    to={`/profile/${user.username}`} 
    onClick={onClick}
    className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors group"
  >
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10 border group-hover:border-primary/30 transition-colors">
        {user.avatarUrl && <AvatarImage src={user.avatarUrl} className="object-cover" />}
        <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
          {user.name?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="leading-tight">
        <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
          {user.name}
        </p>
        <p className="text-xs text-muted-foreground">@{user.username}</p>
      </div>
    </div>
  </Link>
);

const NetworkDialog = ({ 
  isOpen, 
  onOpenChange, 
  title, 
  users = [], 
  isLoading 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden rounded-2xl border-border bg-card shadow-xl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-extrabold flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Users className="h-4.5 w-4.5" />
            </div>
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {isLoading ? (
            <div className="p-4 space-y-4">
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
              <UserItem 
                key={user.$id} 
                user={user} 
                onClick={() => onOpenChange(false)} 
              />
            ))
          ) : (
            <div className="py-12 text-center space-y-2">
              <p className="text-sm font-bold text-foreground/50">No users found</p>
              <p className="text-xs text-muted-foreground">When people join, they will appear here.</p>
            </div>
          )}
        </div>
        
        <div className="bg-muted/30 p-4 border-t border-border/50 text-center">
          <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/50">
            Blog Desk Network
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NetworkDialog;
