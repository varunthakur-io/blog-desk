import { PostForm } from '@/features/posts';
import { useCreatePost } from '@/features/posts';

const CreatePost = () => {
  const { handleCreatePost, isPostCreating } = useCreatePost();

  return (
    <div>
      <PostForm mode="create" onSubmit={handleCreatePost} isSubmitting={isPostCreating} />
    </div>
  );
};

export default CreatePost;
