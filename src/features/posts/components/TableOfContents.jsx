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
      { rootMargin: '0px 0px -70% 0px', threshold: 0 },
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
          <p className="text-muted-foreground mb-3 text-[10px] font-semibold tracking-wider uppercase">
            On this page
          </p>
          <div className="flex flex-col gap-0.5">
            {headings.map(({ id, text, level }) => (
              <button
                key={id}
                onClick={() => handleClick(id)}
                className={`border-l-2 py-1 text-left text-xs transition-colors duration-150 ${
                  level === 3 ? 'pl-4' : 'pl-2'
                } ${
                  activeId === id
                    ? 'border-foreground text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:border-border border-transparent'
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
          <p className="text-muted-foreground mb-3 text-[10px] font-semibold tracking-wider uppercase">
            Discussion · {comments.length}
          </p>
          <div className="flex flex-col gap-2">
            {comments.slice(0, 3).map((comment) => {
              const isMe = comment.userId === authUserId;
              const profile = isMe ? currentUserProfile : profiles[comment.userId];
              const name = profile?.name || (isMe ? 'You' : 'Anonymous');

              return (
                <div key={comment.$id} className="bg-muted/40 rounded-lg px-3 py-2.5">
                  <p className="text-foreground mb-1 text-[11px] font-semibold">{name}</p>
                  <p className="text-muted-foreground line-clamp-2 text-[11px] leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              );
            })}
            {comments.length > 3 && (
              <p className="text-muted-foreground text-center text-[11px]">
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
