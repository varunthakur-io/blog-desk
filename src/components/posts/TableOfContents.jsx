import { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';

const TableOfContents = ({ headings, comments, profiles, authUserId, currentUserProfile }) => {
  const [activeId, setActiveId] = useState('');

  // scrollspy — watches which heading is currently in view
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <aside className="sticky top-24 flex flex-col gap-6">

      {/* ── On this page ───────────────────────────── */}
      {headings.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            On this page
          </p>
          <div className="flex flex-col gap-0.5">
            {headings.map(({ id, text, level }) => (
              <button
                key={id}
                onClick={() => handleClick(id)}
                className={`text-left text-xs py-1 border-l-2 transition-colors duration-150 ${
                  level === 3 ? 'pl-4' : 'pl-2'
                } ${
                  activeId === id
                    ? 'border-foreground text-foreground font-medium'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      )}

      {headings.length > 0 && comments.length > 0 && <Separator />}

      {/* ── Recent comments ────────────────────────── */}
      {comments.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Discussion · {comments.length}
          </p>
          <div className="flex flex-col gap-2">
            {comments.slice(0, 3).map((comment) => {
              const isMe = comment.userId === authUserId;
              const profile = isMe ? currentUserProfile : profiles[comment.userId];
              const name = profile?.name || (isMe ? 'You' : 'Anonymous');

              return (
                <div key={comment.$id} className="rounded-lg bg-muted/40 px-3 py-2.5">
                  <p className="text-[11px] font-semibold text-foreground mb-1">{name}</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                    {comment.content}
                  </p>
                </div>
              );
            })}
            {comments.length > 3 && (
              <p className="text-[11px] text-muted-foreground text-center">
                +{comments.length - 3} more comments
              </p>
            )}
          </div>
        </div>
      )}

    </aside>
  );
};

export default TableOfContents;
