import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Users, LogOut, LayoutDashboard, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  let navLinks = [
    { path: '/',            label: 'Home' },
    { path: '/ngos',        label: 'Find NGOs' },
  ];

  if (!user) {
    navLinks.push({ path: '/register-ngo', label: 'Register NGO' });
  }

  const getDashboardPath = () => {
    if (!user) return '/';
    const role = user.role?.toLowerCase();
    if (role === 'admin') return '/admin';
    if (role === 'ngo') return '/dashboard/ngo';
    return '/dashboard/user';
  };

  const getDashboardLabel = () => {
    if (!user) return '';
    const role = user.role?.toLowerCase();
    if (role === 'admin') return 'Admin Panel';
    if (role === 'ngo') return 'NGO Dashboard';
    return 'Dashboard';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: 'hsla(0,0%,100%,0.92)',
        backdropFilter: 'blur(16px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.8)',
        borderBottom: '1px solid hsl(var(--border))',
        boxShadow: '0 1px 3px hsla(200,25%,15%,0.06), 0 8px 24px hsla(200,25%,15%,0.04)',
      }}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-[72px] px-4 sm:px-6 lg:px-8">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0 no-underline">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
              style={{
                background: 'hsl(var(--primary))',
                boxShadow: '0 2px 12px hsla(175,45%,30%,0.3)',
              }}
            >
              <Heart className="w-4 h-4" style={{ color: 'hsl(var(--primary-foreground))' }} />
            </div>
            <div className="hidden sm:flex items-baseline gap-1 leading-none">
              <span
                className="font-display text-lg font-bold tracking-tight"
                style={{ color: 'hsl(var(--foreground))' }}
              >
                Seva
              </span>
              <span
                className="font-display text-lg font-bold tracking-tight"
                style={{ color: 'hsl(var(--primary))' }}
              >
                Connect
              </span>
            </div>
          </Link>

          {/* ── Desktop nav links ── */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative px-4 py-2 rounded-lg text-[13px] font-semibold tracking-wide uppercase transition-all duration-300 no-underline group"
                  style={{
                    color: active ? 'hsl(var(--primary))' : 'hsl(var(--foreground)/0.6)',
                    background: active ? 'hsl(var(--primary)/0.08)' : 'transparent',
                    letterSpacing: '0.04em',
                  }}
                >
                  {link.label}
                  {active && (
                    <span
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: 'hsl(var(--primary))' }}
                    />
                  )}
                  {!active && (
                    <span
                      className="absolute bottom-1 left-4 right-4 h-[2px] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                      style={{ background: 'hsl(var(--primary)/0.4)' }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Desktop action buttons ── */}
          <div className="hidden md:flex items-center gap-2.5">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 no-underline hover:-translate-y-px"
                  style={{
                    color: 'hsl(var(--foreground))',
                    border: '1.5px solid hsl(var(--border))',
                    background: 'transparent',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'hsl(var(--accent))'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 no-underline hover:-translate-y-px"
                  style={{
                    background: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))',
                    boxShadow: '0 2px 16px hsla(175,45%,30%,0.25)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 24px hsla(175,45%,30%,0.35)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 16px hsla(175,45%,30%,0.25)'; }}
                >
                  <Users className="w-3.5 h-3.5" />
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 no-underline hover:-translate-y-px"
                  style={{
                    color: 'hsl(var(--foreground))',
                    border: '1.5px solid hsl(var(--border))',
                    background: 'transparent',
                  }}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {getDashboardLabel()}
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 hover:-translate-y-px bg-destructive text-destructive-foreground cursor-pointer"
                  style={{ boxShadow: '0 2px 12px hsla(0,72%,51%,0.25)' }}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl transition-all duration-300 cursor-pointer"
            style={{
              color: 'hsl(var(--foreground))',
              background: 'hsl(var(--accent))',
              border: '1px solid hsl(var(--border))',
            }}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* ── Mobile dropdown menu ── */}
        <div
          className="md:hidden overflow-hidden transition-all duration-400"
          style={{
            maxHeight: isMenuOpen ? '500px' : '0',
            opacity: isMenuOpen ? 1 : 0,
          }}
        >
          <div className="border-t border-border bg-card rounded-b-2xl shadow-xl mx-2 mb-2">
            <nav className="flex flex-col p-3 gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 no-underline ${
                    isActive(link.path)
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'hover:bg-accent text-foreground'
                  }`}
                >
                  {link.label}
                  {isActive(link.path) && <ChevronRight className="w-4 h-4 opacity-60" />}
                </Link>
              ))}

              <div className="border-t border-border mt-2 pt-3 flex flex-col gap-2 px-1">
                {!user ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold border border-border hover:bg-accent transition-all duration-200 text-foreground no-underline"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-primary text-primary-foreground no-underline shadow-md"
                    >
                      <Users className="w-3.5 h-3.5" />
                      Sign Up
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to={getDashboardPath()}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border border-border hover:bg-accent transition-all duration-200 text-foreground no-underline"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      {getDashboardLabel()}
                    </Link>
                    <button
                      onClick={() => { logout(); setIsMenuOpen(false); }}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-destructive text-destructive-foreground cursor-pointer shadow-md"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Logout
                    </button>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
