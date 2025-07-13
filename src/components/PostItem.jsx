const PostItem = ({ post, onEdit, onDelete }) => {
  return (
    <div
      className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100
                 flex flex-col sm:flex-row justify-between items-start sm:items-center
                 transition-all duration-300 hover:shadow-xl hover:scale-[1.005]"
    >
      <div className="mb-4 sm:mb-0 sm:mr-6 flex-grow">
        <h2 className="text-2xl font-bold text-gray-800 mb-1 leading-tight">
          {post.title}
        </h2>
        <p className="text-sm text-gray-500">
          Published:{' '}
          {new Date(post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </p>
      </div>
      <div className="flex flex-wrap gap-3 sm:gap-2 justify-end">
        <button
          onClick={() => onEdit(post.$id)}
          className="inline-flex items-center px-4 py-2 border border-blue-500 rounded-lg text-blue-600
                     hover:bg-blue-50 hover:border-blue-600 transition-colors duration-200 font-medium text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(post.$id)}
          className="inline-flex items-center px-4 py-2 border border-red-500 rounded-lg text-red-600
                     hover:bg-red-50 hover:border-red-600 transition-colors duration-200 font-medium text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default PostItem;
