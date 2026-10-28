import React from 'react';
import { cn } from '../../lib/utils';

export const BackgroundBeams = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden opacity-40 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]',
        className
      )}
    >
      <div className="absolute -left-1/4 -top-1/4 h-[150%] w-[150%] animate-[spin_60s_linear_infinite] bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.15),transparent_30%),radial-gradient(circle_at_20%_80%,rgba(14,165,233,0.15),transparent_35%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
    </div>
  );
};
