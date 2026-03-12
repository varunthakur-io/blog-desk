import { commentApi } from './comment.api';

class CommentService {
  async addComment({ postId, userId, content }) {
    try {
      return await commentApi.createComment(postId, userId, content);
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
