import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

import {
  Calendar, LogOut, User, Home, LayoutDashboard, Sparkles,
  UserCircle, Shield, ChevronDown, Bell, Moon, Sun, Menu, X,
  ChevronRight, Info
} from 'lucide-react';
import svsuLogo from "../assets/svsu_logo.png";


const DROPDOWN_CSS = `
  .nav-dropdown {
    position: absolute;
    right: 0;
    top: calc(100% + 8px);
    width: 224px;
    z-index: 9999;
    transform-origin: top right;
    pointer-events: none;
    opacity: 0;
    transform: scale(0.95) translateY(-6px);
    transition: opacity 150ms ease, transform 150ms ease;
    will-change: transform, opacity;
  }
  @media (min-width: 1024px) {
    .nav-dropdown { width: 256px; }
  }
  .nav-dropdown.open {
    opacity: 1;
    transform: scale(1) translateY(0);
    pointer-events: auto;
  }

  .mobile-menu {
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    transition: max-height 250ms ease, opacity 200ms ease;
    will-change: max-height, opacity;
  }
  .mobile-menu.open {
    max-height: 600px;
    opacity: 1;
  }

  .nav-btn {
    -webkit-tap-highlight-color: transparent;
    -webkit-font-smoothing: antialiased;
  }

  @keyframes bell-dot {
    0%,100% { transform: scale(1); }
    50%      { transform: scale(1.3); }
  }
  .bell-dot { animation: bell-dot 2s ease-in-out infinite; }

  @keyframes arrow-nudge {
    0%,100% { transform: translateX(0); }
    50%      { transform: translateX(3px); }
  }
  .arrow-nudge { animation: arrow-nudge 1.6s ease-in-out infinite; }
`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const dropdownRef = useRef(null);
  const navigate    = useNavigate();
  const location    = useLocation();

  const userRole   = user?.role;
  const isLoggedIn = !!user;

  /* Inject CSS once */
  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = DROPDOWN_CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler, { passive: true });
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = useCallback(() => {
    setProfileOpen(false);
    setMobileOpen(false);
    logout();
    navigate('/', { replace: true });
  }, [logout, navigate]);

  const go = useCallback((path) => {
    setProfileOpen(false);
    setMobileOpen(false);
    navigate(path);
  }, [navigate]);

  const getDashboardPath = () => {
    switch (userRole) {
      case 'student': return '/student';
      case 'host':    return '/host';
      case 'admin':   return '/admin';
      default:        return '/';
    }
  };

  const getRoleIcon = () => {
    switch (userRole) {
      case 'student': return User;
      case 'host':    return Sparkles;
      case 'admin':   return Shield;
      default:        return UserCircle;
    }
  };

  const getRoleColor = () => {
    switch (userRole) {
      case 'student': return 'from-[#0046FF] to-[#001BB7]';
      case 'host':    return 'from-[#FF8040] to-[#0046FF]';
      case 'admin':   return 'from-[#001BB7] to-[#FF8040]';
      default:        return 'from-slate-500 to-slate-600';
    }
  };

  const getRoleBadgeColor = () => {
    switch (userRole) {
      case 'student': return 'bg-[#0046FF]/10 text-[#0046FF] dark:bg-[#0046FF]/20';
      case 'host':    return 'bg-[#FF8040]/10 text-[#FF8040] dark:bg-[#FF8040]/20';
      case 'admin':   return 'bg-[#001BB7]/10 text-[#001BB7] dark:bg-[#001BB7]/20';
      default:        return 'bg-slate-100 text-slate-600 dark:bg-slate-700';
    }
  };

  const getInitials = (name) => {
    if (!name) return user?.email?.charAt(0).toUpperCase() || 'U';
    return name.split(' ').map(w => w.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const RoleIcon = getRoleIcon();

  /* ─── Shared button class for desktop nav items ─── */
  const navBtnCls = "nav-btn flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-lg lg:rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-semibold text-sm cursor-pointer";

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b-2 border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="w-full px-3 sm:px-5 md:px-7 lg:px-10">
        <div className="flex items-center justify-between h-14 md:h-16 lg:h-20">

          {/* ── Brand ── */}
          <button
            onClick={() => go('/')}
            className="nav-btn flex items-center gap-2 md:gap-3 group active:scale-95 transition-transform duration-100"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 flex-shrink-0">
              <div className="w-full h-full rounded-lg md:rounded-xl bg-gradient-to-br from-[#FF8040] to-[#0046FF] p-0.5 shadow-lg">
                <div className="w-full h-full rounded-md md:rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden p-0.5 md:p-1">
                  <img src={svsuLogo} alt="SVSU Logo" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-black bg-gradient-to-r from-[#FF8040] via-[#0046FF] to-[#001BB7] bg-clip-text text-transparent leading-tight">
                SVSU Events
              </h1>
              <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-semibold -mt-0.5">
                Skill University
              </p>
            </div>
          </button>

          {/* ── Desktop right ── */}
          <div className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {!isLoggedIn ? (
              <>
                <button onClick={() => go('/')} className={navBtnCls}>
                  <Home className="w-4 h-4" /><span>Home</span>
                </button>

                <button onClick={() => go('/about')} className="nav-btn flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-lg lg:rounded-xl font-bold text-sm border border-[#FF8040]/30 hover:border-[#0046FF]/30 bg-gradient-to-r from-[#FF8040]/8 to-[#0046FF]/8 hover:from-[#FF8040]/15 hover:to-[#0046FF]/15 transition-all duration-150 cursor-pointer">
                  <Info className="w-4 h-4 flex-shrink-0 text-[#FF8040]" />
                  <span className="bg-gradient-to-r from-[#FF8040] to-[#0046FF] bg-clip-text text-transparent">About Us</span>
                </button>

                <button onClick={() => go('/login')} className="nav-btn px-4 lg:px-5 py-2 rounded-lg lg:rounded-xl border-2 border-[#0046FF] text-[#0046FF] hover:bg-[#0046FF]/5 dark:hover:bg-[#0046FF]/10 transition-colors font-bold text-sm cursor-pointer">
                  Login
                </button>
                <button onClick={() => go('/register')} className="nav-btn px-4 lg:px-5 py-2 rounded-lg lg:rounded-xl bg-gradient-to-r from-[#FF8040] to-[#0046FF] text-white font-bold shadow-lg hover:shadow-xl hover:opacity-90 transition-all text-sm cursor-pointer active:scale-95">
                  Register
                </button>
              </>
            ) : (
              <>
                <button onClick={() => go('/about')} className="nav-btn flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-lg lg:rounded-xl font-bold text-sm border border-[#FF8040]/30 hover:border-[#0046FF]/40 bg-gradient-to-r from-[#FF8040]/8 to-[#0046FF]/8 hover:from-[#FF8040]/15 hover:to-[#0046FF]/15 transition-all duration-150 cursor-pointer">
                  <Info className="w-4 h-4 flex-shrink-0 text-[#FF8040]" />
                  <span className="bg-gradient-to-r from-[#FF8040] to-[#0046FF] bg-clip-text text-transparent">About Us</span>
                </button>

                <button onClick={() => go('/')} className={navBtnCls}>
                  <Calendar className="w-4 h-4" /><span>Events</span>
                </button>

                {/* Bell — no animation library, pure CSS */}
                <button className="nav-btn relative p-2 rounded-lg lg:rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                  <Bell className="w-4 h-4 lg:w-5 lg:h-5 text-slate-600 dark:text-slate-400" />
                  <span className="bell-dot absolute top-1.5 right-1.5 w-1.5 h-1.5 lg:w-2 lg:h-2 bg-[#FF8040] rounded-full" />
                </button>

                {/* Dark mode */}
                <button onClick={toggleDarkMode} className="nav-btn p-2 rounded-lg lg:rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                  {darkMode
                    ? <Sun  className="w-4 h-4 lg:w-5 lg:h-5 text-[#FF8040]" />
                    : <Moon className="w-4 h-4 lg:w-5 lg:h-5 text-[#001BB7]" />
                  }
                </button>

                {/* ── Profile dropdown (CSS-driven, zero lag) ── */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setProfileOpen(v => !v)}
                    className="nav-btn flex items-center gap-2 px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg lg:rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer"
                  >
                    <div className={`w-7 h-7 lg:w-9 lg:h-9 rounded-full bg-gradient-to-br ${getRoleColor()} flex items-center justify-center text-white font-bold text-xs lg:text-sm shadow-md`}>
                      {getInitials(user?.name)}
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                        {user?.name || 'User'}
                      </p>
                      <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md ${getRoleBadgeColor()} text-[10px] font-bold uppercase tracking-wide`}>
                        <RoleIcon className="w-2.5 h-2.5" />{userRole}
                      </div>
                    </div>
                    <ChevronDown
                      className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-slate-600 dark:text-slate-400 transition-transform duration-200"
                      style={{ transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </button>

                  {/* CSS-animated dropdown — no Framer Motion here */}
                  <div className={`nav-dropdown bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden ${profileOpen ? 'open' : ''}`}>
                    {/* Header */}
                    <div className="p-3 lg:p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-800">
                      <div className="flex items-center gap-2.5 lg:gap-3">
                        <div className={`w-9 h-9 lg:w-11 lg:h-11 rounded-lg bg-gradient-to-br ${getRoleColor()} flex items-center justify-center text-white font-bold shadow-md text-sm`}>
                          {getInitials(user?.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs lg:text-sm font-bold text-slate-900 dark:text-white truncate mb-0.5">{user?.name || 'User'}</p>
                          <div className={`inline-flex items-center gap-1 px-1.5 lg:px-2 py-0.5 rounded-md ${getRoleBadgeColor()} text-[9px] lg:text-[10px] font-bold uppercase`}>
                            <RoleIcon className="w-2 h-2 lg:w-2.5 lg:h-2.5" />{userRole}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="p-1.5 lg:p-2">
                      <button
                        type="button"
                        onClick={() => go(getDashboardPath())}
                        className={`nav-btn w-full flex items-center gap-2 lg:gap-2.5 px-2.5 lg:px-3 py-2 lg:py-2.5 rounded-lg bg-gradient-to-r ${getRoleColor()} text-white hover:opacity-90 transition-opacity cursor-pointer group`}
                      >
                        <div className="p-1 lg:p-1.5 rounded-md bg-white/20 group-hover:bg-white/30 transition-colors">
                          <LayoutDashboard className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                        </div>
                        <span className="font-semibold text-xs lg:text-sm flex-1 text-left">Dashboard</span>
                        <ChevronRight className="w-3 h-3 lg:w-3.5 lg:h-3.5 opacity-70" />
                      </button>

                      <button
                        type="button"
                        onClick={() => go('/profile')}
                        className="nav-btn w-full flex items-center gap-2 lg:gap-2.5 px-2.5 lg:px-3 py-2 lg:py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer mt-1 group"
                      >
                        <div className="p-1 lg:p-1.5 rounded-md bg-slate-100 dark:bg-slate-700 group-hover:bg-slate-200 dark:group-hover:bg-slate-600 transition-colors">
                          <User className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                        </div>
                        <span className="font-medium text-xs lg:text-sm flex-1 text-left">My Profile</span>
                        <ChevronRight className="w-3 h-3 lg:w-3.5 lg:h-3.5 opacity-0 group-hover:opacity-70 transition-opacity" />
                      </button>

                      <div className="my-1.5 lg:my-2 border-t border-slate-200 dark:border-slate-700" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="nav-btn w-full flex items-center gap-2 lg:gap-2.5 px-2.5 lg:px-3 py-2 lg:py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer group"
                      >
                        <div className="p-1 lg:p-1.5 rounded-md bg-red-50 dark:bg-red-900/20 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
                          <LogOut className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                        </div>
                        <span className="font-semibold text-xs lg:text-sm flex-1 text-left">Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ── Mobile controls ── */}
          <div className="md:hidden flex items-center gap-1">
            <button onClick={toggleDarkMode} className="nav-btn p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
              {darkMode
                ? <Sun  className="w-4 h-4 text-[#FF8040]" />
                : <Moon className="w-4 h-4 text-[#001BB7]" />
              }
            </button>
            <button onClick={() => setMobileOpen(v => !v)} className="nav-btn p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
              {mobileOpen
                ? <X    className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                : <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              }
            </button>
          </div>
        </div>

        {/* ── Mobile menu (CSS-driven height animation) ── */}
        <div className={`mobile-menu md:hidden border-t-2 border-slate-200 dark:border-slate-800 ${mobileOpen ? 'open' : ''}`}>
          <div className="py-3 space-y-1.5">
            {!isLoggedIn ? (
              <>
                <button onClick={() => go('/')} className="nav-btn w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm transition-colors cursor-pointer">
                  <Home className="w-4 h-4 flex-shrink-0" /><span>Home</span>
                </button>

                <button onClick={() => go('/about')} className="nav-btn w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm transition-all border border-[#FF8040]/20 hover:border-[#0046FF]/30 bg-gradient-to-r from-[#FF8040]/10 to-[#0046FF]/10 hover:from-[#FF8040]/20 hover:to-[#0046FF]/20 cursor-pointer">
                  <Info className="w-4 h-4 flex-shrink-0 text-[#FF8040]" />
                  <span className="bg-gradient-to-r from-[#FF8040] to-[#0046FF] bg-clip-text text-transparent">About Us</span>
                </button>

                <button onClick={() => go('/login')} className="nav-btn w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[#0046FF] text-[#0046FF] font-bold text-sm hover:bg-[#0046FF]/5 transition-colors cursor-pointer">
                  Login
                </button>
                <button onClick={() => go('/register')} className="nav-btn w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF8040] to-[#0046FF] text-white font-bold text-sm shadow cursor-pointer">
                  Register
                </button>
              </>
            ) : (
              <>
                {/* User info */}
                <div className="flex items-center gap-3 mx-1 px-3 py-2.5 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getRoleColor()} flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0`}>
                    {getInitials(user?.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name || 'User'}</p>
                    <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md ${getRoleBadgeColor()} text-[9px] font-bold uppercase mt-0.5`}>
                      <RoleIcon className="w-2.5 h-2.5" />{userRole}
                    </div>
                  </div>
                </div>

                <button onClick={() => go('/about')} className="nav-btn w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm transition-all border border-[#FF8040]/20 hover:border-[#0046FF]/30 bg-gradient-to-r from-[#FF8040]/10 to-[#0046FF]/10 hover:from-[#FF8040]/20 hover:to-[#0046FF]/20 cursor-pointer">
                  <Info className="w-4 h-4 flex-shrink-0 text-[#FF8040]" />
                  <span className="bg-gradient-to-r from-[#FF8040] to-[#0046FF] bg-clip-text text-transparent">About Us</span>
                </button>

                <button onClick={() => go('/')} className="nav-btn w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm transition-colors cursor-pointer">
                  <Calendar className="w-4 h-4 flex-shrink-0" /><span>All Events</span>
                </button>

                <button onClick={() => go(getDashboardPath())} className={`nav-btn w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r ${getRoleColor()} text-white font-bold text-sm shadow cursor-pointer`}>
                  <LayoutDashboard className="w-4 h-4 flex-shrink-0" /><span>Dashboard</span>
                </button>

                <button onClick={() => go('/profile')} className="nav-btn w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm transition-colors cursor-pointer">
                  <User className="w-4 h-4 flex-shrink-0" /><span>My Profile</span>
                </button>

                <button onClick={handleLogout} className="nav-btn w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 font-bold text-sm transition-colors cursor-pointer">
                  <LogOut className="w-4 h-4 flex-shrink-0" /><span>Sign Out</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;