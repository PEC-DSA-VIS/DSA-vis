import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MarkdownMessageProps {
  content: string;
}

export const MarkdownMessage: React.FC<MarkdownMessageProps> = ({ content }) => {
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  // Remove ACTION tags from visible prose
  const sanitized = content.replace(/<<<ACTION:[\s\S]*?>>>/g, '').trim();

  // Split into paragraphs and code blocks
  const parts = sanitized.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2 text-xs leading-relaxed text-foreground select-text">
      {parts.map((part, idx) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).trim().split('\n');
          const firstLine = lines[0]?.trim();
          const hasLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
          const lang = hasLang ? firstLine : 'code';
          const codeBody = hasLang ? lines.slice(1).join('\n') : lines.join('\n');

          return (
            <div key={idx} className="my-2.5 rounded-lg border border-border bg-zinc-950 text-zinc-100 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-1 bg-zinc-900 border-b border-zinc-800 text-[10px] font-mono text-zinc-400">
                <span>{lang}</span>
                <button
                  onClick={() => handleCopyCode(codeBody, idx)}
                  className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                >
                  {copiedCodeIdx === idx ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 font-mono text-[11px] overflow-x-auto text-zinc-200">
                <code>{codeBody}</code>
              </pre>
            </div>
          );
        }

        // Inline formatting: Bold, backticks, bullet lists
        const paragraphs = part.split('\n\n').filter((p) => p.trim().length > 0);
        return (
          <React.Fragment key={idx}>
            {paragraphs.map((p, pIdx) => {
              // Check if bullet list
              if (p.trim().startsWith('- ') || p.trim().startsWith('* ')) {
                const items = p.split('\n').filter((item) => item.trim().length > 0);
                return (
                  <ul key={pIdx} className="space-y-1 list-disc pl-4 text-foreground/90">
                    {items.map((it, itIdx) => (
                      <li key={itIdx}>
                        <span dangerouslySetInnerHTML={{ __html: formatInline(it.replace(/^[-*]\s+/, '')) }} />
                      </li>
                    ))}
                  </ul>
                );
              }

              return (
                <p
                  key={pIdx}
                  className="leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatInline(p) }}
                />
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Safe inline formatting for bold, inline code, and math symbols
function formatInline(text: string): string {
  let res = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold **text**
  res = res.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
  // Inline code `code`
  res = res.replace(
    /`([^`]+)`/g,
    '<code class="font-mono text-[11px] px-1 py-0.5 rounded bg-muted text-primary border border-border/80">$1</code>'
  );
  // LaTeX $$ or $ math approximations
  res = res.replace(/\$\$([^$]+)\$\$/g, '<span class="font-mono text-primary font-semibold">$1</span>');
  res = res.replace(/\$([^$]+)\$/g, '<span class="font-mono text-primary font-semibold">$1</span>');

  return res;
}
