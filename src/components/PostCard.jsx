// src/components/PostCard.jsx
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  return (
    <div
      key={post.$id}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 border border-gray-100 dark:bg-gray-800 dark:shadow-md dark:hover:shadow-lg dark:border-gray-700"
    >
      <div className="p-7 flex-grow">
        <Link to={`/posts/${post.$id}`}>
          <h2 className="text-2xl font-bold text-gray-800 mb-3 hover:text-blue-700 transition-colors duration-200 leading-snug dark:text-gray-100 dark:hover:text-blue-400">
            {post.title}
          </h2>
        </Link>
        <p className="text-gray-600 leading-relaxed text-base mb-5 dark:text-gray-300">
          {post.content.length > 200
            ? post.content.slice(0, 200) + '...'
            : post.content}
        </p>
      </div>
      <div className="px-7 py-5 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
        <span className="font-semibold text-gray-700 dark:text-gray-200">
          By {post.authorName}
        </span>
        <span>
          {new Date(post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>
      <div className="px-7 pb-7 pt-0">
        <Link
          to={`/posts/${post.$id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 font-semibold text-base group dark:text-blue-400 dark:hover:text-blue-300"
        >
          Read Article
          <svg
            className="ml-2 w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            ></path>
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
