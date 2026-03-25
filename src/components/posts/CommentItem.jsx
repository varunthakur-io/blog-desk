import React from 'react';
import { Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const CommentItem = ({ comment, isMe, profile, currentUserName, onDeleteClick }) => {
  const name = profile?.name || (isMe ? currentUserName : 'Anonymous');

  return (
    <div className="flex gap-3 group">
      <Avatar className="h-8 w-8 border border-border shrink-0 mt-1">
        <AvatarImage src={profile?.avatarUrl} alt={name} />
        <AvatarFallback className="bg-muted text-muted-foreground font-medium text-xs">
          {name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="rounded-2xl border border-border bg-card px-4 py-3 transition-colors hover:bg-muted/40">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground leading-none">{name}</span>
              <time className="text-xs text-muted-foreground">
                {comment.$createdAt
                  ? new Date(comment.$createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'Just now'}
              </time>
            </div>

            {isMe && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDeleteClick}
                className="h-7 px-2 gap-1.5 text-xs font-medium text-destructive/70 opacity-60 group-hover:opacity-100 transition-all duration-200 hover:text-destructive hover:bg-destructive/10 rounded-md"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            )}
          </div>

          <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
            {comment.content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
