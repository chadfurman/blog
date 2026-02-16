import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

export function Card({ children, className = "", id, style }: CardProps) {
  return (
    <div
      id={id}
      style={style}
      className={`card-interactive rounded-xl border border-foreground/10 bg-white p-5 text-center hover:-translate-y-1 hover:border-primary/30 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardStatic({ children, className = "", id, style }: CardProps) {
  return (
    <div
      id={id}
      style={style}
      className={`rounded-xl border border-foreground/10 bg-white p-5 text-center ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
