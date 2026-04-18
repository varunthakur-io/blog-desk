import { ArrowLeft } from 'lucide-react';

// UI Components
import { FormSkeleton, PostForm } from '@/features/posts';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Hooks
import { useEditPost } from '@/features/posts';

export default function EditPost() {
  const { formData, isPostLoading, isPostUpdating, postFetchError, handleUpdate, navigate } =
    useEditPost();

  if (isPostLoading) {
    return <FormSkeleton />;
  }

  if (postFetchError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <Card className="border-destructive/50 w-full max-w-lg">
          <CardContent className="pt-6">
            <Alert variant="destructive" className="border-none">
              <AlertDescription className="text-center font-medium">
                {postFetchError}
              </AlertDescription>
            </Alert>
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PostForm
        mode="edit"
        initialData={formData}
        onSubmit={handleUpdate}
        isSubmitting={isPostUpdating}
        onBackClick={() => navigate('/dashboard')}
      />
    </div>
  );
}
