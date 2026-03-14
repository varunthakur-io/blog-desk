import { commentApi } from './comment.api';
import { postService } from '../posts';
import { profileService } from '../profile';

class CommentService {
  async addComment({ postId, userId, content }) {
    try {
      // 1. Fetch user profile to get the display name
      const profile = await profileService.getProfile(userId);
      const authorName = profile?.name || 'Anonymous';

      // 2. Create the comment document with the author name
      const createdComment = await commentApi.createComment(postId, userId, content, authorName);

      // 3. Increment the comment count on the post document
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
      const res = await commentApi.listCommentsByPost(postId);
      return res.documents;
    } catch (error) {
      console.error('CommentService :: getCommentsByPost()', error);
      return [];
    }
  }

  async deleteCommentsByPostId(postId) {
    try {
      const commentsList = await commentApi.listCommentsByPost(postId);
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
