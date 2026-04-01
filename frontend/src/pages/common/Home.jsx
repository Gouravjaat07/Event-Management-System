import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Calendar, Sparkles, ChevronRight,
  TrendingUp, Award, Heart, Github, Twitter,
  Linkedin, Mail, Zap, Target, BookOpen, Star, Trophy,
  LogIn, UserPlus, Lock, X, AlertCircle, RefreshCw, Code2
} from 'lucide-react';
import { getAllEvents } from "../../services/eventService";
import EventCard from "../../components/EventCard";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { getUsersCount } from "../../services/userService";

// ─────────────────────────────────────────────
// PERF: CSS-only styles injected once
// ─────────────────────────────────────────────
const GLOBAL_STYLES = `
  /* GPU-composited hover lifts */
  .card-lift {
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease;
    will-change: transform;
    transform: translateZ(0);
  }
  .card-lift:hover {
    transform: translateY(-6px) translateZ(0);
    box-shadow: 0 20px 40px -12px rgba(0,70,255,0.18);
  }
  .btn-press {
    transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
    will-change: transform;
    transform: translateZ(0);
  }
  .btn-press:hover  { transform: scale(1.03) translateZ(0); }
  .btn-press:active { transform: scale(0.97) translateZ(0); }

  /* Skeleton shimmer */
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }
  .shimmer {
    background: linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%);
    background-size: 800px 100%;
    animation: shimmer 1.4s infinite linear;
  }
  .dark .shimmer {
    background: linear-gradient(90deg,#1e293b 25%,#334155 50%,#1e293b 75%);
    background-size: 800px 100%;
  }

  @keyframes ping { 75%,100% { transform:scale(2); opacity:0; } }
  .ping { animation: ping 1.2s cubic-bezier(0,0,.2,1) infinite; }

  @keyframes heartbeat { 0%,100%{transform:scale(1)} 50%{transform:scale(1.3)} }
  .heartbeat { animation: heartbeat 1.2s ease-in-out infinite; }

  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.25;
    pointer-events: none;
    will-change: transform;
    transform: translateZ(0);
  }

  .card-lift:hover .icon-scale {
    transform: scale(1.1) rotate(6deg);
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  .icon-scale {
    transition: transform 0.3s ease;
    transform: translateZ(0);
  }

  .feat-card .feat-overlay { opacity:0; transition:opacity 0.4s ease; }
  .feat-card:hover .feat-overlay { opacity:1; }
  .feat-card:hover .feat-title { color:#0046FF; }
  .dark .feat-card:hover .feat-title { color:#FF8040; }
  .feat-title { transition:color 0.2s ease; }

  .avatar-item { transition:transform 0.2s ease; will-change:transform; }
  .avatar-item:hover { transform:translateY(-4px); z-index:10; }

  .footer-link { transition:color 0.15s ease,transform 0.15s ease; }
  .footer-link:hover { color:#FF8040; transform:translateX(4px); }

  .social-icon { transition:transform 0.2s ease,background-color 0.2s ease; will-change:transform; }
  .social-icon:hover { transform:scale(1.15) rotate(5deg); }

  /* Search focus ring */
  .search-wrap:focus-within .search-border {
    border-color: rgba(0,70,255,0.5);
    box-shadow: 0 0 0 3px rgba(0,70,255,0.08);
  }

  .stat-card .stat-overlay { opacity:0; transition:opacity 0.3s ease; }
  .stat-card:hover .stat-overlay { opacity:0.07; }
  .stat-card:hover .icon-scale { transform:scale(1.1) translateZ(0); }

  /* Smooth scroll */
  html { scroll-behavior: smooth; }

  /* Safe tap targets on mobile */
  @media (max-width: 640px) {
    .btn-press { min-height: 44px; }
    .card-lift:hover { transform: none; box-shadow: none; }
  }

  /* Prevent horizontal overflow on small screens */
  * { box-sizing: border-box; }
  body { overflow-x: hidden; }
`;

function StyleInjector() {
  const injected = useRef(false);
  if (!injected.current && typeof document !== 'undefined') {
    const el = document.createElement('style');
    el.textContent = GLOBAL_STYLES;
    document.head.appendChild(el);
    injected.current = true;
  }
  return null;
}

// ══════════════════════════════════════════════════════════
// AUTH GATE MODAL
// ══════════════════════════════════════════════════════════
const AuthGateModal = ({ event, onClose, onLogin, onRegister }) => (
  <AnimatePresence>
    {event && (
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-3 pb-3 sm:p-4"
        style={{ backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="relative px-5 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-5"
            style={{ background: 'linear-gradient(135deg,#FF8040,#0046FF,#001BB7)' }}>
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-xl bg-white/20 hover:bg-white/30 btn-press"
              aria-label="Close"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2.5 sm:p-3 rounded-xl bg-white/20 flex-shrink-0">
                <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white">Login Required</h2>
                <p className="text-white/80 text-xs sm:text-sm mt-0.5">Sign in to view event details</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-5 py-4 sm:px-6 sm:py-5">
            <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-4 sm:mb-5">
              <div className="p-2 sm:p-2.5 rounded-lg flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,rgba(255,128,64,.15),rgba(0,70,255,.15))' }}>
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#0046FF]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">You wanted to view</p>
                <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">{event.title}</p>
                {event.eventType && (
                  <span className="inline-block mt-1.5 px-2.5 py-0.5 sm:py-1 rounded-full bg-[#0046FF]/10 text-[#0046FF] text-xs font-semibold">
                    {event.eventType}
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-5 text-center leading-relaxed">
              Create a free account or sign in to explore event details, register, and track your campus activities.
            </p>
            <div className="flex flex-col gap-2.5 sm:gap-3">
              <button
                onClick={onLogin}
                className="btn-press w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 rounded-xl text-white font-bold shadow-lg text-sm sm:text-base"
                style={{ background: 'linear-gradient(135deg,#FF8040,#0046FF)' }}
              >
                <LogIn className="w-4 h-4 sm:w-5 sm:h-5" /> Sign In
              </button>
              <button
                onClick={onRegister}
                className="btn-press w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 rounded-xl border-2 border-[#0046FF] text-[#0046FF] hover:bg-[#0046FF]/5 font-bold text-sm sm:text-base"
              >
                <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" /> Create Free Account
              </button>
            </div>
          </div>

          <div className="px-5 py-3 sm:px-6 sm:py-4 bg-gray-50 dark:bg-gray-900/60 border-t border-gray-100 dark:border-gray-800 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF8040]" />
            <p className="text-xs text-gray-400 dark:text-gray-500">Free to join · No credit card required</p>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ══════════════════════════════════════════════════════════
// ERROR STATE
// ══════════════════════════════════════════════════════════
const ErrorState = ({ onRetry, message = "Failed to load events" }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-12 sm:py-16 md:py-24 px-4">
    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 mb-4 sm:mb-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
      <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 text-red-500 dark:text-red-400" />
    </div>
    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">{message}</h3>
    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 text-center max-w-sm mb-5 sm:mb-6">
      We couldn't fetch the data. Please check your connection and try again.
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="btn-press flex items-center gap-2 px-5 py-3 rounded-xl text-white font-bold shadow-lg text-sm sm:text-base"
        style={{ background: 'linear-gradient(135deg,#FF8040,#0046FF)' }}
      >
        <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
        Retry
      </button>
    )}
  </div>
);

// ══════════════════════════════════════════════════════════
// SKELETON CARD
// ══════════════════════════════════════════════════════════
const SkeletonCard = ({ index }) => (
  <div
    className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-[#0046FF]/10 dark:border-slate-700"
    style={{ opacity: 0, animation: `fadeIn 0.3s ease forwards ${index * 80}ms` }}
  >
    <style>{`@keyframes fadeIn{to{opacity:1}}`}</style>
    <div className="space-y-3 sm:space-y-4">
      <div className="h-36 sm:h-40 md:h-48 rounded-xl shimmer" />
      <div className="space-y-2 sm:space-y-3">
        <div className="h-4 rounded-lg shimmer w-3/4" />
        <div className="h-3 rounded-lg shimmer w-1/2" />
        <div className="h-3 rounded-lg shimmer w-5/6" />
      </div>
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════
// EMPTY STATE
// ══════════════════════════════════════════════════════════
const EmptyState = ({ searchQuery }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-12 sm:py-16 md:py-24 px-4">
    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 mb-4 sm:mb-6 rounded-full flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg,rgba(255,128,64,.15),rgba(0,70,255,.15))' }}>
      <Calendar className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 text-[#0046FF] dark:text-[#FF8040]" />
    </div>
    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 sm:mb-3 text-center">
      No Events Found
    </h3>
    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 text-center max-w-xs sm:max-w-md">
      {searchQuery
        ? `No events match "${searchQuery}". Try different keywords or clear your search.`
        : "No events are currently available. Check back soon!"}
    </p>
  </div>
);

// ══════════════════════════════════════════════════════════
// STATS SECTION
// ══════════════════════════════════════════════════════════
const StatsSection = ({ events, loading }) => {
  const totalEvents = events?.length || 0;
  const upcomingEvents = events?.filter(e => {
    try { return new Date(e.eventDate) > new Date(); } catch { return false; }
  }).length || 0;
  const uniqueCategories = events
    ? [...new Set(events.map(e => e.eventType).filter(Boolean))].length
    : 0;

  const stats = [
    {
      label: "Total Events", value: loading ? "..." : totalEvents,
      icon: Calendar, iconBg: "bg-[#FF8040]/10 dark:bg-[#FF8040]/20",
      iconColor: "text-[#FF8040]", description: "Events available", overlayColor: "#FF8040"
    },
    {
      label: "Active Now", value: loading ? "..." : upcomingEvents,
      icon: TrendingUp, iconBg: "bg-[#0046FF]/10 dark:bg-[#0046FF]/20",
      iconColor: "text-[#0046FF]", description: "Upcoming events", overlayColor: "#0046FF"
    },
    {
      label: "Categories", value: loading ? "..." : uniqueCategories,
      icon: Award, iconBg: "bg-[#001BB7]/10 dark:bg-[#001BB7]/20",
      iconColor: "text-[#001BB7]", description: "Event types", overlayColor: "#001BB7"
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-10 md:mb-16">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="stat-card card-lift relative overflow-hidden bg-white/80 dark:bg-slate-800/80 rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 lg:p-7 shadow-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
        >
          <div
            className="stat-overlay absolute inset-0 pointer-events-none"
            style={{ background: `linear-gradient(135deg,${stat.overlayColor},transparent)` }}
          />
          <div className="relative flex items-center justify-between mb-2 sm:mb-3">
            <div className={`icon-scale ${stat.iconBg} p-2 sm:p-3 md:p-3.5 rounded-lg sm:rounded-xl`}>
              <stat.icon className={`w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 ${stat.iconColor}`} />
            </div>
          </div>
          <div className="relative">
            <h3 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-0.5 sm:mb-1">
              {stat.value}
            </h3>
            <p className="text-xs sm:text-sm md:text-base font-semibold text-slate-700 dark:text-slate-300 mb-0.5 sm:mb-1 leading-tight">
              {stat.label}
            </p>
            <p className="hidden sm:block text-xs md:text-sm text-slate-500 dark:text-slate-400">
              {stat.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// COMMUNITY BANNER
// ══════════════════════════════════════════════════════════
const CommunityBanner = ({ totalUsers, loading, onBrowse }) => {
  const avatarColors = [
    "from-[#FF8040] to-[#ff6010]",
    "from-[#0046FF] to-[#001BB7]",
    "from-[#a855f7] to-[#7c3aed]",
    "from-[#ec4899] to-[#db2777]",
    "from-[#10b981] to-[#059669]",
  ];
  const initials = ["AK", "SR", "PM", "NK", "VR"];

  const formatUserCount = (count) => {
    if (loading) return "...";
    if (count === 0) return "0";
    if (count > 999) return `${Math.floor(count / 1000)}k`;
    return count.toLocaleString();
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl md:rounded-3xl mb-10 sm:mb-12 md:mb-20"
      style={{ background: 'linear-gradient(135deg,#1a0533 0%,#0f172a 50%,#1e1b4b 100%)' }}
    >
      <div className="blob w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 -top-20 sm:-top-32 -right-20 sm:-right-32"
        style={{ background: 'radial-gradient(circle,#FF8040,transparent 70%)' }} />
      <div className="blob w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 -bottom-20 sm:-bottom-32 -left-20 sm:-left-32"
        style={{ background: 'radial-gradient(circle,#0046FF,transparent 70%)' }} />
      <div className="blob w-40 sm:w-56 md:w-80 h-40 sm:h-56 md:h-80 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'radial-gradient(circle,#a855f7,transparent 70%)', opacity: 0.15 }} />
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle,rgba(255,255,255,.8) 1px,transparent 1px)', backgroundSize: '24px 24px' }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-12 px-5 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12 lg:px-16 lg:py-14">
        {/* LEFT */}
        <div className="text-center md:text-left w-full md:w-auto">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/10 border border-white/20 mb-4 sm:mb-5">
            <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 flex-shrink-0">
              <span className="ping absolute inline-flex h-full w-full rounded-full bg-[#FF8040] opacity-75" />
              <span className="relative inline-flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#FF8040]" />
            </span>
            <span className="text-xs sm:text-sm font-bold text-white/90 uppercase tracking-wide">Live Community</span>
          </div>

          <div className="flex items-end gap-2 justify-center md:justify-start mb-3 sm:mb-4">
            <span className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-[#FF8040] via-white to-[#a78bfa] bg-clip-text text-transparent leading-none tabular-nums">
              {formatUserCount(totalUsers)}
            </span>
            {!loading && totalUsers > 0 && (
              <span className="text-2xl sm:text-3xl md:text-5xl font-black text-[#FF8040] mb-1 sm:mb-2 leading-none">+</span>
            )}
          </div>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-1 sm:mb-2">
            Students already on EventHub
          </p>
          <p className="text-xs sm:text-sm md:text-base text-white/60 max-w-sm sm:max-w-md mx-auto md:mx-0 leading-relaxed">
            Join your peers — explore events, compete, learn &amp; grow together at SVSU
          </p>

          {/* Pills with Lucide icons */}
          <div className="flex flex-wrap gap-2 mt-4 sm:mt-5 justify-center md:justify-start">
            {[
              { icon: Trophy,   label: "Competitions", color: "#FF8040" },
              { icon: Code2,    label: "Hackathons",   color: "#a78bfa" },
              { icon: BookOpen, label: "Workshops",    color: "#34d399" },
              { icon: Star,     label: "Fests",        color: "#60a5fa" },
            ].map(({ icon: Icon, label, color }, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/10 border border-white/15 text-white/80 text-xs sm:text-sm font-semibold backdrop-blur-sm"
              >
                <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" style={{ color }} />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col items-center gap-5 sm:gap-6 flex-shrink-0 w-full md:w-auto">
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <div className="flex -space-x-3 sm:-space-x-4">
              {avatarColors.map((grad, i) => (
                <div
                  key={i}
                  className={`avatar-item relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br ${grad} border-[2px] sm:border-[3px] border-[#1a0533] flex items-center justify-center shadow-xl flex-shrink-0 cursor-default`}
                >
                  <span className="text-[10px] sm:text-xs md:text-sm font-black text-white select-none">{initials[i]}</span>
                </div>
              ))}
              {!loading && totalUsers > 0 && (
                <div className="avatar-item relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/10 border-[2px] sm:border-[3px] border-[#1a0533] flex items-center justify-center flex-shrink-0">
                  <span className="text-[9px] sm:text-[10px] md:text-xs font-black text-white/90 leading-tight text-center">
                    {totalUsers > 999 ? `${Math.floor(totalUsers / 1000)}k` : totalUsers}<br />
                    <span className="text-white/60">more</span>
                  </span>
                </div>
              )}
            </div>
            <p className="text-xs sm:text-sm text-white/50 text-center">
              Real students · Real achievements · Real impact
            </p>
          </div>

          <div className="w-full max-w-xs sm:max-w-sm h-px bg-gradient-to-r from-transparent via-white/20 to-transparent hidden md:block" />

          <div className="flex flex-col xs:flex-row sm:flex-row gap-2.5 sm:gap-3 w-full sm:w-auto">
            <a
              href="https://chat.whatsapp.com/BUuQnAOPCSRBBG0xJTPP2J"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-press flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3 md:px-8 md:py-3.5 rounded-xl text-white font-bold shadow-xl text-sm sm:text-base whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg,#FF8040,#0046FF)' }}
            >
              <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              Join the Community
            </a>
            <button
              onClick={onBrowse}
              className="btn-press flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3 md:px-8 md:py-3.5 rounded-xl border-2 border-white/30 text-white hover:bg-white/10 font-bold text-sm sm:text-base whitespace-nowrap"
            >
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              Browse Events
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// FEATURES SECTION
// ══════════════════════════════════════════════════════════
const FeaturesSection = () => {
  const features = [
    {
      icon: Zap, title: "Real-Time Updates",
      description: "Never miss an event! Get instant notifications about new registrations, updates, and reminders",
      color: "#FF8040", bgColor: "bg-[#FF8040]/10 dark:bg-[#FF8040]/20", overlay: "rgba(255,128,64,.06)"
    },
    {
      icon: Target, title: "Smart Discovery",
      description: "AI-powered recommendations to find events matching your interests, skills, and academic goals",
      color: "#0046FF", bgColor: "bg-[#0046FF]/10 dark:bg-[#0046FF]/20", overlay: "rgba(0,70,255,.06)"
    },
    {
      icon: BookOpen, title: "Quick Registration",
      description: "Register for events in seconds with one-click process and automatic calendar integration",
      color: "#001BB7", bgColor: "bg-[#001BB7]/10 dark:bg-[#001BB7]/20", overlay: "rgba(0,27,183,.06)"
    },
  ];

  return (
    <div className="mb-10 sm:mb-12 md:mb-20 mt-6 sm:mt-8">
      <div className="text-center mb-8 sm:mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-[#FF8040]/10 to-[#0046FF]/10 dark:from-[#FF8040]/20 dark:to-[#0046FF]/20 border border-[#FF8040]/20 dark:border-[#0046FF]/30 mb-4 sm:mb-6">
          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#FF8040]" />
          <span className="text-xs sm:text-sm md:text-base font-bold text-slate-700 dark:text-slate-300">Platform Features</span>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-800 dark:text-white mb-3 sm:mb-4 px-4">
          Why Choose{" "}
          <span className="bg-gradient-to-r from-[#FF8040] to-[#0046FF] bg-clip-text text-transparent">
            SVSU Events Hub?
          </span>
        </h2>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-4 leading-relaxed">
          Your ultimate companion for campus life — discover, participate, and excel
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="feat-card card-lift relative bg-white/90 dark:bg-slate-800/90 rounded-2xl p-5 sm:p-6 md:p-8 border border-slate-200 dark:border-slate-700 cursor-pointer overflow-hidden"
          >
            <div
              className="feat-overlay absolute inset-0 pointer-events-none"
              style={{ background: `linear-gradient(135deg,${feature.overlay} 0%,transparent 100%)` }}
            />
            <div className="relative">
              <div className={`icon-scale w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl ${feature.bgColor} flex items-center justify-center mb-4 sm:mb-5`}>
                <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" style={{ color: feature.color }} />
              </div>
              <h3 className="feat-title text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-slate-800 dark:text-white mb-2 sm:mb-3">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// MAIN HOME COMPONENT
// ══════════════════════════════════════════════════════════
const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [gateEvent, setGateEvent] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(false);

  const { darkMode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getAllEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load events:", err);
      setError(true);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsersCount = useCallback(async () => {
    try {
      setUsersLoading(true);
      setUsersError(false);
      const data = await getUsersCount();
      setTotalUsers(data?.totalUsers ?? 0);
    } catch (err) {
      console.error("Failed to fetch user count:", err);
      setUsersError(true);
      setTotalUsers(0);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  const handleRetryAll = useCallback(() => {
    fetchEvents();
    fetchUsersCount();
  }, [fetchEvents, fetchUsersCount]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    fetchEvents();
    fetchUsersCount();
  }, [fetchEvents, fetchUsersCount]);

  // Debounced search
  const [debouncedQuery, setDebouncedQuery] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 200);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const filteredEvents = events.filter(event => {
    if (!debouncedQuery.trim()) return true;
    const q = debouncedQuery.toLowerCase();
    return (
      event.title?.toLowerCase().includes(q) ||
      event.description?.toLowerCase().includes(q) ||
      event.eventType?.toLowerCase().includes(q) ||
      event.venue?.toLowerCase().includes(q)
    );
  });

  const handleViewDetails = useCallback((event) => {
    if (user) navigate(`/events/${event._id}`);
    else setGateEvent(event);
  }, [user, navigate]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-slate-900' : 'bg-[#F5F1DC]'}`}>
      <StyleInjector />
      <Navbar />

      {/* Auth Gate Modal */}
      <AuthGateModal
        event={gateEvent}
        onClose={() => setGateEvent(null)}
        onLogin={() => {
          const eventId = gateEvent?._id;
          setGateEvent(null);
          navigate('/login', { state: eventId ? { from: { pathname: `/events/${eventId}` } } : undefined });
        }}
        onRegister={() => { setGateEvent(null); navigate('/register'); }}
      />

      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="blob w-56 sm:w-80 md:w-96 h-56 sm:h-80 md:h-96 -top-28 sm:-top-40 -right-28 sm:-right-40"
          style={{ background: 'radial-gradient(circle,#FF8040,transparent 70%)' }} />
        <div className="blob w-56 sm:w-80 md:w-96 h-56 sm:h-80 md:h-96 -bottom-28 sm:-bottom-40 -left-28 sm:-left-40"
          style={{ background: 'radial-gradient(circle,#0046FF,transparent 70%)' }} />
        <div className="blob w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ background: 'radial-gradient(circle,#001BB7,transparent 70%)', opacity: 0.15 }} />
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle,#0046FF 1px,transparent 1px)', backgroundSize: '40px 40px' }}
        />
      </div>

      {/* ── HERO ── */}
      <div className="relative pt-16 sm:pt-20 md:pt-28 lg:pt-32 pb-6 sm:pb-8 md:pb-12 px-4 sm:px-5 md:px-6">
        <div className="max-w-7xl mx-auto">

          {/* Hero content */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center mb-6 sm:mb-8 md:mb-14"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-full bg-gradient-to-r from-[#FF8040]/10 to-[#0046FF]/10 dark:from-[#FF8040]/20 dark:to-[#0046FF]/20 border-2 border-[#FF8040]/30 dark:border-[#0046FF]/30 mb-4 sm:mb-6 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#FF8040]" />
              <span className="text-xs sm:text-sm md:text-base font-bold bg-gradient-to-r from-[#FF8040] to-[#0046FF] bg-clip-text text-transparent">
                Shri Vishwakarma Skill University
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight px-2 sm:px-4">
              <span className="bg-gradient-to-r from-[#FF8040] via-[#0046FF] to-[#001BB7] bg-clip-text text-transparent">
                Campus Event Hub
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl text-slate-700 dark:text-slate-300 max-w-xs sm:max-w-2xl md:max-w-4xl mx-auto font-medium leading-relaxed px-2 sm:px-4">
              <span className="text-slate-800 dark:text-slate-200 font-bold">Transform your college experience.</span>
              {' '}Explore workshops, compete in hackathons, attend tech fests, and
              <span className="bg-gradient-to-r from-[#FF8040] to-[#0046FF] bg-clip-text text-transparent font-bold"> build skills that matter</span> — your journey to excellence starts here!
            </p>

            {/* Guest CTA */}
            {!user && (
              <div className="flex flex-col xs:flex-row sm:flex-row items-center justify-center gap-2.5 sm:gap-3 md:gap-4 mt-5 sm:mt-6 md:mt-8 px-2">
                <button
                  onClick={() => navigate('/register')}
                  className="btn-press w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-xl text-white font-bold shadow-lg text-sm sm:text-base md:text-lg"
                  style={{ background: 'linear-gradient(135deg,#FF8040,#0046FF)' }}
                >
                  <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> Get Started Free
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="btn-press w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-xl border-2 border-[#0046FF] text-[#0046FF] hover:bg-[#0046FF]/5 dark:hover:bg-[#0046FF]/10 font-bold text-sm sm:text-base md:text-lg"
                >
                  <LogIn className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> Sign In
                </button>
              </div>
            )}
          </motion.div>

          {/* Stats */}
          {!loading && !error && events.length > 0 && (
            <StatsSection events={events} loading={loading} />
          )}

          {/* Guest teaser */}
          {!user && !loading && !error && filteredEvents.length > 0 && (
            <div className="mb-5 sm:mb-8 md:mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3.5 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#FF8040]/10 to-[#0046FF]/10 dark:from-[#FF8040]/15 dark:to-[#0046FF]/15 border-2 border-[#FF8040]/20 dark:border-[#0046FF]/25">
              <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                <div className="p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#FF8040,#0046FF)' }}>
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm md:text-base font-bold text-slate-800 dark:text-white">
                    Sign in to view event details &amp; register
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                    Click any event card to get started
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="btn-press w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-lg sm:rounded-xl text-white font-bold text-xs sm:text-sm md:text-base shadow-lg"
                style={{ background: 'linear-gradient(135deg,#FF8040,#0046FF)' }}
              >
                <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                <span>Sign In</span>
              </button>
            </div>
          )}

          {/* Events heading + Search bar */}
          {!loading && !error && (
            <div className="mb-5 sm:mb-6 md:mb-8">
              {/* Heading row */}
              <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-4 mb-3 sm:mb-5">
                <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white flex items-center gap-2 sm:gap-3">
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-[#FF8040] flex-shrink-0" />
                  Trending Events
                </h2>
                {filteredEvents.length > 0 && (
                  <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400">
                    {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
                  </p>
                )}
              </div>

              {/* Redesigned Search Bar */}
              <div className="search-wrap w-full">
                <div className="search-border relative flex items-center gap-2 sm:gap-3 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-4 transition-all duration-200">
                  {/* Gradient search icon */}
                  <div
                    className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,#FF8040,#0046FF)' }}
                  >
                    <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                  </div>

                  {/* Input */}
                  <input
                    type="text"
                    placeholder="Search events by name, type, or venue..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="flex-1 min-w-0 bg-transparent border-0 outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 font-medium text-xs sm:text-sm md:text-base"
                  />

                  {/* Clear button */}
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="flex-shrink-0 p-1 sm:p-1.5 rounded-md sm:rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  )}

                  {/* Divider + Filter pill */}
                  <div className="flex-shrink-0 h-6 sm:h-8 w-px bg-slate-200 dark:bg-slate-600" />
                  <button
                    className="btn-press flex-shrink-0 flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-[#0046FF] hover:text-[#0046FF] dark:hover:border-[#FF8040] dark:hover:text-[#FF8040] transition-colors bg-slate-50 dark:bg-slate-700/50"
                  >
                    <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline sm:inline">Filter</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Events grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8 mb-10 sm:mb-12 md:mb-20">
            {loading ? (
              [...Array(6)].map((_, i) => <SkeletonCard key={i} index={i} />)
            ) : error ? (
              <ErrorState onRetry={handleRetryAll} message="Failed to load events" />
            ) : filteredEvents.length === 0 ? (
              <EmptyState searchQuery={debouncedQuery} />
            ) : (
              filteredEvents.map((event, index) => (
                <EventCard
                  key={event._id || event.id || index}
                  event={event}
                  index={index}
                  onViewDetails={handleViewDetails}
                />
              ))
            )}
          </div>

          {/* Community Banner */}
          {!loading && !error && (
            <CommunityBanner
              totalUsers={totalUsers}
              loading={usersLoading}
              onBrowse={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
          )}

          {/* Features */}
          <FeaturesSection />
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="relative mt-12 sm:mt-16 md:mt-24 bg-slate-950/95 border-t border-slate-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-950/40 to-slate-900/60 pointer-events-none" />
        <div className="relative h-1 bg-gradient-to-r from-[#FF8040] via-[#0046FF] to-[#001BB7]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-5 md:px-6 py-8 sm:py-10 md:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mb-6 sm:mb-8">
            {/* Brand */}
            <div className="sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#FF8040,#0046FF)' }}>
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-[#FF8040] to-[#0046FF] bg-clip-text text-transparent">
                  SVSU Events
                </h3>
              </div>
              <p className="text-slate-400 leading-relaxed text-xs sm:text-sm md:text-base">
                Connecting students with opportunities. Empowering learning through workshops, competitions, and collaborative experiences.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4 text-[#FF8040]">Quick Links</h4>
              <ul className="space-y-2 sm:space-y-3">
                {['About SVSU', 'Browse Events', 'Host an Event', 'Contact Us'].map((link, i) => (
                  <li key={i}>
                    <a href="#" className="footer-link text-slate-400 hover:text-[#FF8040] flex items-center gap-2 text-xs sm:text-sm md:text-base">
                      <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4 text-[#0046FF]">Connect With Us</h4>
              <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                {[
                  { Icon: Twitter,  bg: 'hover:bg-blue-500',  label: 'Twitter' },
                  { Icon: Linkedin, bg: 'hover:bg-blue-600',  label: 'LinkedIn' },
                  { Icon: Github,   bg: 'hover:bg-slate-700', label: 'GitHub' },
                  { Icon: Mail,     bg: 'hover:bg-[#FF8040]', label: 'Email' },
                ].map(({ Icon, bg, label }, i) => (
                  <a key={i} href="#" aria-label={label}
                    className={`social-icon p-2.5 sm:p-3 md:p-3.5 rounded-xl bg-slate-900 ${bg} group`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-slate-400 group-hover:text-white transition-colors duration-150" />
                  </a>
                ))}
              </div>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                <strong className="text-slate-400">Email:</strong> info@svsu.ac.in<br />
                <strong className="text-slate-400">Phone:</strong> 18001800147
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-5 sm:pt-6 md:pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-slate-500 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 text-center sm:text-left">
              © 2026 SVSU Events. Crafted with
              <Heart className="heartbeat w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF8040] fill-[#FF8040] inline-block" />
              for students
            </p>
            <div className="flex gap-4 sm:gap-5 md:gap-6 text-xs sm:text-sm">
              {['Privacy', 'Terms', 'Cookies'].map((link, i) => (
                <a key={i} href="#"
                  className="text-slate-500 hover:text-[#FF8040] transition-colors duration-150">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;