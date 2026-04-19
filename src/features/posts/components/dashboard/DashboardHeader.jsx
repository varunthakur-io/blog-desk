import { FileText } from 'lucide-react';

const DashboardHeader = ({ 
  title = "My stories", 
  subtitle = "Manage and track your publication history.", 
  icon: Icon = FileText 
}) => (
  <div className="flex items-center gap-4 py-5">
    <div className="bg-foreground text-background flex size-8 items-center justify-center rounded shadow-sm">
      <Icon className="size-4" />
    </div>
    <div>
      <h1 className="page-title">{title}</h1>
      <p className="page-subtitle">{subtitle}</p>
    </div>
  </div>
);

export default DashboardHeader;
