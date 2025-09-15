import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BookOpen, Search, Loader2 } from 'lucide-react';

import PostCard from '../components/PostCard';
import { postService } from '../services/postService';
import { setError, setLoading, setPosts } from '../store/postSlice';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';

const Home = () => {
   const dispatch = useDispatch();
   const { posts, loading, error, fetched, searchTerm } = useSelector(
      (state) => state.posts
   );

   useEffect(() => {
      const fetchPosts = async () => {
         try {
            dispatch(setLoading(true));
            const data = await postService.getAllPosts();
            dispatch(setPosts(data));
         } catch (err) {
            dispatch(setError(err.message));
            console.error('Failed to fetch posts:', err);
         }
      };

      if (!fetched) fetchPosts();
   }, [dispatch, fetched]);

   const filteredPosts = useMemo(() => {
      if (!searchTerm) {
         return posts;
      }
      return posts.filter((post) =>
         post.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
   }, [posts, searchTerm]);

   const renderContent = () => {
      if (loading) {
         return (
            <div className="flex flex-col items-center justify-center text-center py-32">
               <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
               <p className="text-muted-foreground text-lg">Loading posts...</p>
            </div>
         );
      }

      if (error) {
         return (
            <div className="flex justify-center py-20">
               <Alert variant="destructive" className="max-w-md">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
               </Alert>
            </div>
         );
      }

      if (filteredPosts.length === 0) {
         return (
            <div className="text-center py-32">
               <div className="flex flex-col items-center space-y-4">
                  {searchTerm ? (
                     <Search className="h-20 w-20 text-muted-foreground/50" />
                  ) : (
                     <BookOpen className="h-20 w-20 text-muted-foreground/50" />
                  )}
                  <h3 className="text-2xl font-semibold">
                     {searchTerm ? 'No Results Found' : 'No Posts Yet'}
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                     {searchTerm
                        ? `We couldn't find any posts matching "${searchTerm}". Try a different search.`
                        : 'There are no posts to display right now. Why not be the first to create one?'}
                  </p>
                  {!searchTerm && (
                     <Button asChild>
                        <NavLink to="/create">Create Post</NavLink>
                     </Button>
                  )}
               </div>
            </div>
         );
      }

      return (
         <div className="space-y-8">
            {searchTerm && (
               <div className="text-center">
                  <p className="text-muted-foreground">
                     Found {filteredPosts.length}{' '}
                     {filteredPosts.length === 1 ? 'post' : 'posts'} for "
                     {searchTerm}"
                  </p>
               </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {filteredPosts.map((post) => (
                  <PostCard key={post.$id} post={post} />
               ))}
            </div>
         </div>
      );
   };

   return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
         {/* Hero Section */}
         {!searchTerm && (
            <div className="text-center py-20 sm:py-32">
               <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
                  Stories & Ideas
               </h1>
               <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  A minimal blog for creative minds. Explore and share your
                  thoughts with the world.
               </p>
            </div>
         )}

         {/* Content Section */}
         {renderContent()}
      </div>
   );
};

export default Home;
