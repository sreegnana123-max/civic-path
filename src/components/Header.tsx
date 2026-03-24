import { Shield, LogIn, LogOut, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthority, signOut } = useAuth();

  const links = [
    { to: "/", label: "Issues" },
    ...(isAuthority ? [{ to: "/dashboard", label: "Dashboard" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Shield className="w-4 h-4 text-accent-foreground" />
          </div>
          <span className="font-heading font-bold text-lg text-foreground tracking-tight">
            CivicsTrack
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <nav className="flex items-center gap-1 mr-2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === link.to
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {user ? (
            <Button variant="ghost" size="sm" onClick={() => signOut()} className="gap-1.5 text-xs">
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")} className="gap-1.5 text-xs">
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
