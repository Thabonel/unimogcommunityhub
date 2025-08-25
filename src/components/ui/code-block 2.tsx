
import React from 'react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ children, className }) => {
  return (
    <pre className={cn(
      "bg-zinc-950 text-white p-4 rounded-md overflow-x-auto text-sm font-mono",
      className
    )}>
      <code>{children}</code>
    </pre>
  );
};
