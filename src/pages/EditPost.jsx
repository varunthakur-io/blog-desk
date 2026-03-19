import { ArrowLeft } from 'lucide-react';

// UI Components
import { FormSkeleton, PostForm } from '@/components/posts';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Hooks
import { useEditPost } from '@/hooks/posts';

export default function EditPost() {
  const { formData, isLoading, isSaving, error, handleUpdate, navigate } = useEditPost();

  if (isLoading) {
    return <FormSkeleton />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] p-4">
        <Card className="w-full max-w-lg border-destructive/50">
          <CardContent className="pt-6">
            <Alert variant="destructive" className="border-none">
              <AlertDescription className="text-center font-medium">{error}</AlertDescription>
            </Alert>
            <Button
              variant="outline"
              className="w-full mt-4"
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
        isSubmitting={isSaving}
        onBackClick={() => navigate('/dashboard')}
      />
    </div>
  );
}
