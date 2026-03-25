import React from 'react';
import { MessageSquare } from 'lucide-react';
import { EmptyState } from '@/components/common';
import CommentItem from './CommentItem';

const CommentList = ({
  comments,
  authUserId,
  currentUserProfile,
  profiles,
  currentUserName,
  onDeleteClick,
}) => {
  if (comments.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No comments yet"
        description="Be the first to share your thoughts."
      />
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <CommentItem
          key={comment.$id}
          comment={comment}
          isMe={comment.userId === authUserId}
          profile={comment.userId === authUserId ? currentUserProfile : profiles[comment.userId]}
          currentUserName={currentUserName}
          onDeleteClick={() => onDeleteClick(comment)}
        />
      ))}
    </div>
  );
};

export default CommentList;
