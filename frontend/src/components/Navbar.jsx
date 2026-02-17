import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

import {
  Calendar,
  LogOut,
  User,
  Home,
  LayoutDashboard,
  Sparkles,
  UserCircle,
  Shield,
  ChevronDown,
  Bell,
  Moon,
  Sun,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import svsuLogo from "../assets/svsu_logo.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme(); // ✅ Using global theme context
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen]           = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const userRole  = user?.role;
  const isLoggedIn = !!user;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // ✅ Your logout() already clears localStorage AND updates state perfectly!
  const handleLogout = () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    logout(); // Uses your AuthContext logout - clears storage + updates state
    navigate('/', { replace: true });
  };

  const getDashboardPath = () => {
    switch (userRole) {
      case 'student': return '/student';
      case 'host':    return '/host';
      case 'admin':   return '/admin';
      default:        return '/';
    }
  };

  const getRoleIcon  = () => {
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

  return (
    <motion.nav
      initial={{ y:-100 }}
      animate={{ y:0 }}
      transition={{ duration:0.4, ease:[0.25,0.46,0.45,0.94] }}
      className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b-2 border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16 lg:h-20">

          {/* ── Brand / Logo ── */}
          <motion.div
            onClick={() => navigate('/')}
            className="flex items-center gap-2 md:gap-3 group cursor-pointer"
            whileHover={{ scale:1.02 }}
            whileTap={{ scale:0.98 }}
          >
            {/* logo box */}
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 flex-shrink-0">
              <div className="w-full h-full rounded-lg md:rounded-xl bg-gradient-to-br from-[#FF8040] to-[#0046FF] p-0.5 shadow-lg">
                <div className="w-full h-full rounded-md md:rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden p-0.5 md:p-1">
                  <img src={svsuLogo} alt="SVSU Logo" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>
            {/* text */}
            <div>
              <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-black bg-gradient-to-r from-[#FF8040] via-[#0046FF] to-[#001BB7] bg-clip-text text-transparent leading-tight">
                SVSU Events
              </h1>
              <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-semibold -mt-0.5">
                Skill University
              </p>
            </div>
          </motion.div>

          {/* ── Desktop right side ── */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {!isLoggedIn ? (
              <>
                <motion.button onClick={() => navigate('/')} whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                  className="flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-lg lg:rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-semibold text-sm">
                  <Home className="w-4 h-4" /><span>Home</span>
                </motion.button>
                <motion.button onClick={() => navigate('/login')} whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                  className="px-4 lg:px-5 py-2 rounded-lg lg:rounded-xl border-2 border-[#0046FF] text-[#0046FF] hover:bg-[#0046FF]/5 dark:hover:bg-[#0046FF]/10 transition-all font-bold text-sm">
                  Login
                </motion.button>
                <motion.button onClick={() => navigate('/register')} whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                  className="px-4 lg:px-5 py-2 rounded-lg lg:rounded-xl bg-gradient-to-r from-[#FF8040] to-[#0046FF] text-white font-bold shadow-lg hover:shadow-xl transition-all text-sm">
                  Register
                </motion.button>
              </>
            ) : (
              <>
                {/* Events link */}
                <motion.button onClick={() => navigate('/')} whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                  className="flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-lg lg:rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-semibold text-sm">
                  <Calendar className="w-4 h-4" /><span>Events</span>
                </motion.button>

                {/* Bell */}
                <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                  className="relative p-2 rounded-lg lg:rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                  <Bell className="w-4 h-4 lg:w-5 lg:h-5 text-slate-600 dark:text-slate-400" />
                  <motion.span animate={{ scale:[1,1.2,1] }} transition={{ duration:2, repeat:Infinity }}
                    className="absolute top-1 right-1 w-1.5 h-1.5 lg:w-2 lg:h-2 bg-[#FF8040] rounded-full" />
                </motion.button>

                {/* Dark mode toggle */}
                <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }} onClick={toggleDarkMode}
                  className="p-2 rounded-lg lg:rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                  <AnimatePresence mode="wait">
                    {darkMode
                      ? <motion.div key="sun" initial={{ rotate:-90, opacity:0 }} animate={{ rotate:0, opacity:1 }} exit={{ rotate:90, opacity:0 }}><Sun  className="w-4 h-4 lg:w-5 lg:h-5 text-[#FF8040]" /></motion.div>
                      : <motion.div key="moon" initial={{ rotate:90, opacity:0 }} animate={{ rotate:0, opacity:1 }} exit={{ rotate:-90, opacity:0 }}><Moon className="w-4 h-4 lg:w-5 lg:h-5 text-[#001BB7]" /></motion.div>}
                  </AnimatePresence>
                </motion.button>

                {/* Profile dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <motion.button type="button" whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setProfileDropdownOpen(!profileDropdownOpen); }}
                    className="flex items-center gap-2 px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg lg:rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  >
                    {/* avatar */}
                    <div className={`w-7 h-7 lg:w-9 lg:h-9 rounded-full bg-gradient-to-br ${getRoleColor()} flex items-center justify-center text-white font-bold text-xs lg:text-sm shadow-lg`}>
                      {getInitials(user?.name)}
                    </div>
                    {/* name+role — only on lg */}
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                        {user?.name || 'User'}
                      </p>
                      <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md ${getRoleBadgeColor()} text-[10px] font-bold uppercase tracking-wide`}>
                        <RoleIcon className="w-2.5 h-2.5" />{userRole}
                      </div>
                    </div>
                    <motion.div animate={{ rotate: profileDropdownOpen ? 180 : 0 }} transition={{ duration:0.3 }}>
                      <ChevronDown className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-slate-600 dark:text-slate-400" />
                    </motion.div>
                  </motion.button>

                  {/* Dropdown panel */}
                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        initial={{ opacity:0, y:10, scale:0.95 }}
                        animate={{ opacity:1, y:0, scale:1 }}
                        exit={{ opacity:0, y:10, scale:0.95 }}
                        transition={{ duration:0.2 }}
                        className="absolute right-0 mt-2 w-56 lg:w-64 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                        style={{ zIndex:9999 }}
                      >
                        {/* Dropdown header */}
                        <div className="p-3 lg:p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-800/50 dark:to-slate-800">
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

                        {/* Menu items */}
                        <div className="p-1.5 lg:p-2">
                          <motion.button type="button"
                            onClick={(e) => { e.preventDefault(); setProfileDropdownOpen(false); navigate(getDashboardPath()); }}
                            whileHover={{ x:2 }} whileTap={{ scale:0.98 }}
                            className={`w-full flex items-center gap-2 lg:gap-2.5 px-2.5 lg:px-3 py-2 lg:py-2.5 rounded-lg bg-gradient-to-r ${getRoleColor()} text-white transition-all cursor-pointer hover:shadow-md group`}>
                            <div className="p-1 lg:p-1.5 rounded-md bg-white/20 group-hover:bg-white/30 transition-colors">
                              <LayoutDashboard className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                            </div>
                            <span className="font-semibold text-xs lg:text-sm flex-1 text-left">Dashboard</span>
                            <ChevronRight className="w-3 h-3 lg:w-3.5 lg:h-3.5 opacity-70" />
                          </motion.button>

                          <motion.button type="button"
                            onClick={(e) => { e.preventDefault(); setProfileDropdownOpen(false); navigate('/profile'); }}
                            whileHover={{ x:2 }} whileTap={{ scale:0.98 }}
                            className="w-full flex items-center gap-2 lg:gap-2.5 px-2.5 lg:px-3 py-2 lg:py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all cursor-pointer mt-1 group">
                            <div className="p-1 lg:p-1.5 rounded-md bg-slate-100 dark:bg-slate-700 group-hover:bg-slate-200 transition-colors">
                              <User className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                            </div>
                            <span className="font-medium text-xs lg:text-sm flex-1 text-left">My Profile</span>
                            <ChevronRight className="w-3 h-3 lg:w-3.5 lg:h-3.5 opacity-0 group-hover:opacity-70 transition-all" />
                          </motion.button>

                          <div className="my-1.5 lg:my-2 border-t border-slate-200 dark:border-slate-700" />

                          <motion.button type="button" whileHover={{ x:2 }} whileTap={{ scale:0.98 }} onClick={handleLogout}
                            className="w-full flex items-center gap-2 lg:gap-2.5 px-2.5 lg:px-3 py-2 lg:py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer group">
                            <div className="p-1 lg:p-1.5 rounded-md bg-red-50 dark:bg-red-900/20 group-hover:bg-red-100 transition-colors">
                              <LogOut className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                            </div>
                            <span className="font-semibold text-xs lg:text-sm flex-1 text-left">Sign Out</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>

          {/* ── Mobile controls ── */}
          <div className="md:hidden flex items-center gap-1.5">
            {/* dark mode toggle always visible on mobile */}
            <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }} onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              {darkMode
                ? <Sun  className="w-4 h-4 text-[#FF8040]" />
                : <Moon className="w-4 h-4 text-[#001BB7]" />}
            </motion.button>
            {/* hamburger */}
            <motion.button whileTap={{ scale:0.95 }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              {mobileMenuOpen
                ? <X    className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                : <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />}
            </motion.button>
          </div>
        </div>

        {/* ── Mobile dropdown menu ── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity:0, height:0 }}
              animate={{ opacity:1, height:'auto' }}
              exit={{ opacity:0, height:0 }}
              transition={{ duration:0.25 }}
              className="md:hidden overflow-hidden border-t-2 border-slate-200 dark:border-slate-800"
            >
              <div className="py-3 space-y-1.5">
                {!isLoggedIn ? (
                  <>
                    <button onClick={() => { setMobileMenuOpen(false); navigate('/'); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm transition-colors">
                      <Home className="w-4 h-4 flex-shrink-0" /><span>Home</span>
                    </button>
                    <button onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[#0046FF] text-[#0046FF] font-bold text-sm transition-colors hover:bg-[#0046FF]/5">
                      Login
                    </button>
                    <button onClick={() => { setMobileMenuOpen(false); navigate('/register'); }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF8040] to-[#0046FF] text-white font-bold text-sm shadow">
                      Register
                    </button>
                  </>
                ) : (
                  <>
                    {/* User info pill */}
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

                    <button onClick={() => { setMobileMenuOpen(false); navigate('/'); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm transition-colors">
                      <Calendar className="w-4 h-4 flex-shrink-0" /><span>All Events</span>
                    </button>

                    <button onClick={() => { setMobileMenuOpen(false); navigate(getDashboardPath()); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r ${getRoleColor()} text-white font-bold text-sm shadow`}>
                      <LayoutDashboard className="w-4 h-4 flex-shrink-0" /><span>Dashboard</span>
                    </button>

                    <button onClick={() => { setMobileMenuOpen(false); navigate('/profile'); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm transition-colors">
                      <User className="w-4 h-4 flex-shrink-0" /><span>My Profile</span>
                    </button>

                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 font-bold text-sm transition-colors">
                      <LogOut className="w-4 h-4 flex-shrink-0" /><span>Sign Out</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;