import { PostForm } from '@/components/posts';
import { useCreatePost } from '@/hooks/posts';

const CreatePost = () => {
  const { handleCreatePost, isSubmitting } = useCreatePost();

  return (
    <div>
      <PostForm mode="create" onSubmit={handleCreatePost} isSubmitting={isSubmitting} />
    </div>
  );
};

export default CreatePost;
