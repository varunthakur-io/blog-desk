import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Lucide-based spinner that can be reused across the app.
 */
const Spinner = ({ size = 20, className }) => (
  <Loader2
    aria-hidden="true"
    className={cn('animate-spin text-primary', className)}
    style={{ width: size, height: size }}
  />
);

/**
 * Universal app loader
 * @param {string} text - Optional message shown beside spinner
 * @param {number} size - Icon size in px
 * @param {boolean} center - Whether to center horizontally
 * @param {string} className - Optional additional classes for container
 * @param {string} textClassName - Optional classes for the helper text
 * @param {string} spinnerClassName - Optional classes for the spinner icon
 */
const Loader = ({
  text = 'Loading...',
  size = 28,
  center = true,
  className,
  textClassName,
  spinnerClassName,
}) => {
  return (
    <div
      className={cn(
        'flex items-center gap-3 py-10 text-muted-foreground',
        center && 'justify-center',
        className,
      )}
    >
      <Spinner size={size} className={spinnerClassName} />
      {text ? (
        <span className={cn('text-sm font-medium tracking-wide', textClassName)}>
          {text}
        </span>
      ) : null}
    </div>
  );
};

export { Loader, Spinner };
export default Loader;
