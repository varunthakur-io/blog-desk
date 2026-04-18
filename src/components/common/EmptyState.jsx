import React from 'react';
import { cn } from '@/lib/utils';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className,
  iconClassName,
  animate = false,
}) => {
  return (
    <div
      className={cn(
        'border-border bg-muted/5 flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center',
        animate && 'animate-in fade-in zoom-in-95 duration-500',
        className,
      )}
    >
      {Icon && (
        <div className={cn('bg-muted mb-3 rounded-full p-4', iconClassName)}>
          <Icon className="text-muted-foreground/50 h-6 w-6" />
        </div>
      )}
      <h3 className="mb-1 text-sm font-semibold">{title}</h3>
      <p className="text-muted-foreground mb-4 max-w-xs text-xs leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
