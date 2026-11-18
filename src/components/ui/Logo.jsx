import { Link } from "react-router-dom";

export function LogoMark({ className = "size-8" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="#0F1D36" />
      <path d="M7 9l9 15 9-15" fill="none" stroke="#2F6BFF" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 13.5h3l1.6-3 2 6 1.4-3H21" fill="none" stroke="#22D3EE" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ to = "/", className = "" }) {
  return (
    <Link to={to} className={`inline-flex items-center gap-2.5 ${className}`} aria-label="Veyroniq home">
      <LogoMark />
      <span className="font-display text-[1.02rem] font-extrabold tracking-[0.16em] text-ink">VEYRONIQ</span>
    </Link>
  );
}
