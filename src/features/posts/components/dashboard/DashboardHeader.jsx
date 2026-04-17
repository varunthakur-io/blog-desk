import { FileText } from 'lucide-react';

const DashboardHeader = () => (
  <div className="flex items-center gap-4 py-5">
    <div className="size-8 rounded bg-foreground flex items-center justify-center text-background">
      <FileText className="h-4 w-4" />
    </div>
    <h1 className="text-3xl font-black tracking-tighter text-foreground">My stories</h1>
  </div>
);

export default DashboardHeader;
