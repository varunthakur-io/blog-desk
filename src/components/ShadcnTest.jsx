import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const ShadcnTest = () => {
  return (
    <div className="p-8 space-y-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">Shadcn/ui Test Components</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Testing shadcn/ui</CardTitle>
          <CardDescription>
            This demonstrates that shadcn/ui components are working correctly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Button>Default Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="destructive">Destructive Button</Button>
          </div>
          
          <Input placeholder="Test input field" />
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Test Dialog</DialogTitle>
                <DialogDescription>
                  This is a test dialog to verify shadcn/ui components are working.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShadcnTest;