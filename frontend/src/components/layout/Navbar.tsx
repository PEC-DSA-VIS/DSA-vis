import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Layers,
  GitCompare,
  BrainCircuit,
  GraduationCap,
  User,
  Shield,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type NavView = 'home' | 'topics' | 'visualizer' | 'compare' | 'solver';

interface NavbarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  onOpenCommandPalette: () => void;
  onOpenChatDrawer?: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  isAudioMuted?: boolean;
  onToggleAudio?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenCommandPalette,
  onOpenChatDrawer,
  theme,
  onToggleTheme,
  isAudioMuted = false,
  onToggleAudio,
}) => {
  const { user, isAuthenticated, isAdmin, openLoginModal, openAdminDashboard, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-surface/90 dark:bg-[#0b1020]/90 backdrop-blur-md border-b border-outline-variant/30 dark:border-white/10 shadow-[0_1px_8px_rgba(0,0,0,0.04)] select-none transition-colors">
      <div className="h-14 w-full px-3 sm:px-6 flex items-center justify-between gap-3">
        {/* Left: Brand Logo & Navigation Links */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
            title="AlgoViz Observatory Home"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-primary-container text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              <span className="font-mono font-black text-base">A</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-headline-sm text-base text-primary dark:text-inverse-primary tracking-tight font-extrabold">
                AlgoViz
              </span>
              <span className="font-code-sm text-[10px] px-2 py-0.5 bg-surface-container dark:bg-white/10 text-secondary dark:text-secondary-fixed rounded-full font-bold uppercase tracking-wider hidden sm:inline-block">
                OBSERVATORY v2.4
              </span>
            </div>
          </button>

          {/* Navigation Links - ONLY VISIBLE WHEN AUTHENTICATED */}
          {isAuthenticated && (
            <nav className="hidden lg:flex items-center gap-1 font-label-md text-xs">
              <button
                onClick={() => onNavigate('topics')}
                className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentView === 'topics'
                    ? 'bg-surface-container dark:bg-white/15 text-primary dark:text-inverse-primary font-bold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low dark:hover:bg-white/5'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Topics</span>
              </button>
              <button
                onClick={() => onNavigate('visualizer')}
                className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentView === 'visualizer'
                    ? 'bg-surface-container dark:bg-white/15 text-primary dark:text-inverse-primary font-bold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low dark:hover:bg-white/5'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Observatory</span>
              </button>
              <button
                onClick={() => onNavigate('solver')}
                className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentView === 'solver'
                    ? 'bg-surface-container dark:bg-white/15 text-primary dark:text-inverse-primary font-bold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low dark:hover:bg-white/5'
                }`}
              >
                <BrainCircuit className="w-3.5 h-3.5 text-primary dark:text-inverse-primary" />
                <span>Solve a Problem</span>
              </button>
              <button
                onClick={() => onNavigate('compare')}
                className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentView === 'compare'
                    ? 'bg-surface-container dark:bg-white/15 text-primary dark:text-inverse-primary font-bold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low dark:hover:bg-white/5'
                }`}
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Compare &amp; Learn</span>
              </button>
            </nav>
          )}
        </div>

        {/* Center / Flexible Space: Search Bar when authenticated; Portal Lock Status when unauthenticated */}
        <div className="flex-1 flex items-center justify-end md:justify-center px-2">
          {isAuthenticated ? (
            <div
              onClick={onOpenCommandPalette}
              className="relative flex items-center w-full max-w-[220px] sm:max-w-[280px] bg-surface-container-lowest dark:bg-white/5 rounded-full px-3 py-1.5 border border-outline-variant/40 dark:border-white/10 shadow-xs hover:border-primary/50 cursor-pointer transition-all"
              title="Search algorithms (Cmd+K / Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-outline mr-2 shrink-0" />
              <span className="w-full font-body-sm text-xs text-outline-variant truncate select-none">
                Search algorithms...
              </span>
              <span className="font-code-sm text-[10px] px-1.5 py-0.2 bg-surface-container-low dark:bg-white/10 text-on-surface-variant rounded font-semibold shrink-0 ml-1">
                ⌘K
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-container dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 text-xs text-on-surface-variant dark:text-white/70 font-medium shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-primary dark:text-purple-400" />
              <span className="hidden sm:inline font-bold">AlgoViz Portal · </span>
              <span>Sign in required to access laboratory &amp; visualizers</span>
            </div>
          )}
        </div>

        {/* Right Tools & Action Strip */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Ask AI Pill Button - ONLY VISIBLE WHEN AUTHENTICATED */}
          {isAuthenticated && onOpenChatDrawer && (
            <button
              onClick={onOpenChatDrawer}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary to-primary-container text-white rounded-full font-label-md text-xs font-bold shadow-sm shadow-primary/25 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Ask AI</span>
            </button>
          )}

          {/* Sound Audio Toggle - ONLY VISIBLE WHEN AUTHENTICATED */}
          {isAuthenticated && onToggleAudio && (
            <button
              onClick={onToggleAudio}
              type="button"
              className="w-8 h-8 rounded-full bg-surface-container-low dark:bg-white/10 text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center justify-center transition-colors cursor-pointer"
              title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isAudioMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-outline" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-primary dark:text-inverse-primary" />
              )}
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            type="button"
            className="w-8 h-8 rounded-full bg-surface-container-low dark:bg-white/10 text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center justify-center transition-colors cursor-pointer"
            title="Toggle Light / Dark Mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-slate-700" />
            )}
          </button>

          {/* Authentication Button & Profile Dropdown */}
          {!isAuthenticated ? (
            <button
              onClick={() => openLoginModal('user')}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-label-md text-xs font-bold transition-all cursor-pointer shadow-md shadow-primary/25 hover:opacity-95 hover:scale-105 active:scale-95"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          ) : (
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                type="button"
                className="inline-flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-surface-container-low dark:bg-white/10 hover:bg-surface-container border border-outline-variant/30 dark:border-white/15 font-label-md text-xs cursor-pointer transition-colors"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] shadow-xs ${
                    isAdmin ? 'bg-purple-600 text-white' : 'bg-primary text-white'
                  }`}
                >
                  {isAdmin ? (
                    <ShieldCheck className="w-3.5 h-3.5" />
                  ) : (
                    (user as any)?.rollNumber?.slice(0, 2) || 'ST'
                  )}
                </div>
                <div className="hidden sm:flex flex-col items-start leading-tight text-left">
                  <span className="font-bold text-on-surface dark:text-white max-w-[90px] truncate text-[11px]">
                    {isAdmin ? (user as any)?.name : (user as any)?.rollNumber}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-semibold uppercase ${
                      isAdmin ? 'text-purple-600 dark:text-purple-400' : 'text-primary dark:text-cyan-400'
                    }`}
                  >
                    {isAdmin ? 'ADMIN' : (user as any)?.section || 'STUDENT'}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-outline" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-surface dark:bg-[#0c1222] rounded-2xl shadow-xl border border-outline-variant/30 dark:border-white/10 p-3 space-y-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-2.5 rounded-xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/20 dark:border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-on-surface dark:text-white">
                        {isAdmin ? (user as any)?.name : (user as any)?.rollNumber}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full uppercase ${
                          isAdmin
                            ? 'bg-purple-600/20 text-purple-600 dark:text-purple-300'
                            : 'bg-primary/20 text-primary dark:text-cyan-300'
                        }`}
                      >
                        {user?.role}
                      </span>
                    </div>
                    <p className="font-mono text-[10px] text-on-surface-variant dark:text-white/60 truncate">
                      College ID: {user?.collegeId}
                    </p>
                    <p className="font-mono text-[10px] text-on-surface-variant dark:text-white/60 truncate">
                      {user?.email}
                    </p>
                    {!isAdmin && (
                      <p className="font-mono text-[10px] text-on-surface-variant dark:text-white/60">
                        {(user as any)?.branch} · {(user as any)?.section}
                      </p>
                    )}
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        openAdminDashboard();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 text-purple-600 dark:text-purple-300 font-label-md text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Admin Management Console</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      logout();
                    }}
                    className="w-full py-2 px-3 rounded-xl hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-label-md text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
