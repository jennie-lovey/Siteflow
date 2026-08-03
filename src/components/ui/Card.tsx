import type { ReactNode } from "react";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl bg-white ${className ?? ""}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`px-6 py-4 ${className ?? ""}`}>{children}</div>;
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`px-6 py-5 ${className ?? ""}`}>{children}</div>;
}
