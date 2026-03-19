import { commentApi } from './comment.api';
import { postService } from '../posts';
import { profileService } from '../profile';

class CommentService {
  // Save the author's display name with each comment and update the denormalized comment counter best-effort.
  async addComment({ postId, userId, content }) {
    try {
      // Persist the display name with the comment so older comments still render if the
      // profile cache is cold or the author later changes their name.
      const profile = await profileService.getProfile(userId);
      const authorName = profile?.name || 'Anonymous';

      const createdComment = await commentApi.createComment(postId, userId, content, authorName);

      // Count updates are best-effort so a comment can still be created even if the
      // denormalized counter falls temporarily out of sync.
      try {
        const post = await postService.getPostById(postId);
        const currentCount = post?.commentsCount || 0;
        await postService.updatePost(postId, {
          commentsCount: currentCount + 1,
        });
      } catch (postError) {
        console.warn('CommentService :: Failed to update post comment count', postError);
      }

      return createdComment;
    } catch (error) {
      console.error('CommentService :: addComment()', error);
      throw error;
    }
  }

  async getCommentsByPost(postId) {
    try {
      const commentList = await commentApi.listCommentsByPost(postId);
      return commentList.documents;
    } catch (error) {
      console.error('CommentService :: getCommentsByPost()', error);
      return [];
    }
  }

  // Delete all comments in parallel so parent post cleanup stays fast.
  async deleteCommentsByPostId(postId) {
    try {
      const commentsList = await commentApi.listCommentsByPost(postId);
      // Batch the cleanup so post deletion does not wait on sequential comment deletes.
      const deletePromises = commentsList.documents.map((comment) =>
        commentApi.deleteComment(comment.$id),
      );
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('CommentService :: deleteCommentsByPostId()', error);
      throw error;
    }
  }
}

export const commentService = new CommentService();
