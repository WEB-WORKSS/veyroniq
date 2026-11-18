import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, Settings, Building2, LogOut, LayoutDashboard } from "lucide-react";
import { Logo } from "../ui/Logo.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { cn } from "../../lib/utils.js";

const NAV = [
  ["Product", "/#product"], ["Solutions", "/#solutions"], ["How It Works", "/#how-it-works"], ["Technology", "/#technology"],
  ["Pricing", "/#pricing"], ["Team", "/#team"], ["Contact", "/#contact"],
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const menuRef = useRef(null);

  useEffect(() => { const f = () => setScrolled(window.scrollY > 8); f(); addEventListener("scroll", f, { passive: true }); return () => removeEventListener("scroll", f); }, []);
  useEffect(() => { setOpen(false); setMenu(false); }, [loc.pathname, loc.hash]);
  useEffect(() => {
    if (!menu) return;
    const close = (e) => !menuRef.current?.contains(e.target) && setMenu(false);
    document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close);
  }, [menu]);

  const doSignOut = async () => { await signOut(); nav("/"); };

  return (
    <header className={cn("sticky top-0 z-50 border-b transition-colors", scrolled || open ? "border-line bg-bg/85 backdrop-blur-xl" : "border-transparent bg-transparent")}>
      <div className="wrap flex h-16 items-center gap-6">
        <Logo />
        <nav aria-label="Primary" className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV.map(([l, h]) => <Link key={l} to={h} className="rounded-lg px-2.5 py-2 text-[0.88rem] text-muted transition hover:text-ink">{l}</Link>)}
        </nav>
        <div className="ml-auto hidden items-center gap-2 lg:flex">
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-primary"><LayoutDashboard className="size-4" />Go to Dashboard</Link>
              <div className="relative" ref={menuRef}>
                <button className="btn btn-line" aria-haspopup="menu" aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
                  <span className="grid size-6 place-items-center rounded-full bg-blue text-[0.7rem] font-bold text-white">{(user.name || user.email)[0].toUpperCase()}</span>
                  <ChevronDown className="size-4" />
                </button>
                {menu && (
                  <div role="menu" className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-line-2 bg-panel shadow-2xl">
                    <p className="truncate border-b border-line px-4 py-3 text-xs text-muted">{user.email}</p>
                    <Link role="menuitem" to="/dashboard?view=settings" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-panel-2"><Settings className="size-4" />Account Settings</Link>
                    <Link role="menuitem" to="/dashboard?view=settings#workspace" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-panel-2"><Building2 className="size-4" />Workspace Settings</Link>
                    <button role="menuitem" onClick={doSignOut} className="flex w-full items-center gap-2 border-t border-line px-4 py-2.5 text-left text-sm hover:bg-panel-2"><LogOut className="size-4" />Sign Out</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Sign In</Link>
              <Link to="/signup" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>
        <button className="btn btn-line ml-auto p-2 lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen((o) => !o)}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="wrap flex flex-col gap-1 border-t border-line pb-5 pt-3 lg:hidden">
          {NAV.map(([l, h]) => <Link key={l} to={h} onClick={() => setOpen(false)} className="rounded-lg px-2 py-2.5 text-base text-ink hover:bg-panel">{l}</Link>)}
          <div className="mt-3 grid grid-cols-2 gap-2">
            {user ? (
              <><Link to="/dashboard" className="btn btn-primary">Dashboard</Link><button onClick={doSignOut} className="btn btn-line">Sign Out</button></>
            ) : (
              <><Link to="/login" className="btn btn-line">Sign In</Link><Link to="/signup" className="btn btn-primary">Get Started</Link></>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
