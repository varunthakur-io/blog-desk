import { cn } from "@/lib/utils"

/**
 * Shared base Skeleton component for consistent loading states.
 */
function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props} />
  );
}

export { Skeleton }
