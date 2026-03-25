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
        'flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-border bg-muted/5',
        animate && 'animate-in fade-in zoom-in-95 duration-500',
        className
      )}
    >
      {Icon && (
        <div className={cn('bg-muted p-4 rounded-full mb-3', iconClassName)}>
          <Icon className="w-6 h-6 text-muted-foreground/50" />
        </div>
      )}
      <h3 className="text-sm font-semibold mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-xs leading-relaxed mb-4">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
