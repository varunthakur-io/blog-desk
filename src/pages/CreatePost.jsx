// CreatePost: editor shell for new content creation
import { PostForm } from '@/features/posts';
import { useCreatePost } from '@/features/posts';

const CreatePost = () => {
  const { handleCreatePost, isPostCreating } = useCreatePost();

  return <PostForm mode="create" onSubmit={handleCreatePost} isSubmitting={isPostCreating} />;
};

export default CreatePost;
