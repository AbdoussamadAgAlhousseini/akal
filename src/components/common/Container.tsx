import type {ReactNode} from 'react';

/** Centered 1200px content column (prototype `.wrap`). */
export default function Container({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-[1200px] px-6 ${className}`}>{children}</div>
  );
}
