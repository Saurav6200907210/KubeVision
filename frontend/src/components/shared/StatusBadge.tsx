import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusColor = (s: string) => {
    const lower = s.toLowerCase();
    if (['running', 'active', 'ready', 'bound'].includes(lower)) {
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    }
    if (['pending', 'containercreating', 'warning', 'unknown'].includes(lower)) {
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    }
    if (['failed', 'error', 'crashloopbackoff', 'imagepullbackoff', 'terminated'].includes(lower)) {
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    }
    if (['succeeded', 'completed'].includes(lower)) {
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
    return 'bg-muted text-muted-foreground border-border';
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      getStatusColor(status),
      className
    )}>
      {status}
    </span>
  );
}
