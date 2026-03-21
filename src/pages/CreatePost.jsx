import { PostForm } from '@/components/posts';
import { useCreatePost } from '@/hooks/posts';

const CreatePost = () => {
  const { handleCreatePost, isPostCreating } = useCreatePost();

  return (
    <div>
      <PostForm mode="create" onSubmit={handleCreatePost} isSubmitting={isPostCreating} />
    </div>
  );
};

export default CreatePost;
