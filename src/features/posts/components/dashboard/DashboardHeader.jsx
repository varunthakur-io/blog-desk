import { FileText } from 'lucide-react';

const DashboardHeader = () => (
  <div className="flex items-center gap-4 py-5">
    <div className="bg-foreground text-background flex size-8 items-center justify-center rounded">
      <FileText className="h-4 w-4" />
    </div>
    <h1 className="text-foreground text-3xl font-black tracking-tighter">My stories</h1>
  </div>
);

export default DashboardHeader;
