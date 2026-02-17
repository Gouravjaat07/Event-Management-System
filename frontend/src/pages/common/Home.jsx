import { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Calendar, Sparkles, ChevronRight,
  TrendingUp, Award, Heart, Github, Twitter,
  Linkedin, Mail, Zap, Target, BookOpen, Star, Trophy,
  LogIn, UserPlus, Lock, X, AlertCircle, RefreshCw
} from 'lucide-react';
import { getAllEvents } from "../../services/eventService";
import EventCard from "../../components/EventCard";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { getUsersCount } from "../../services/userService";


// ══════════════════════════════════════════════════════════
// AUTH GATE MODAL - Fully Responsive
// ══════════════════════════════════════════════════════════
const AuthGateModal = ({ event, onClose, onLogin, onRegister }) => (
  <AnimatePresence>
    {event && (
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-4 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Gradient header */}
          <div className="relative px-6 pt-6 pb-5 bg-gradient-to-br from-[#FF8040] via-[#0046FF] to-[#001BB7]">
            <motion.div
              animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
              transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(circle,white 1px,transparent 1px)', backgroundSize: '20px 20px' }}
            />
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <div className="relative z-10 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white leading-tight">Login Required</h2>
                <p className="text-white/80 text-sm mt-1">Sign in to view event details</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-5">
              <div className="p-2.5 rounded-lg bg-gradient-to-br from-[#FF8040]/20 to-[#0046FF]/20 flex-shrink-0">
                <Calendar className="w-5 h-5 text-[#0046FF]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">You wanted to view</p>
                <p className="text-base font-bold text-gray-900 dark:text-white truncate">{event.title}</p>
                {event.eventType && (
                  <span className="inline-block mt-1.5 px-2.5 py-1 rounded-full bg-[#0046FF]/10 text-[#0046FF] text-xs font-semibold">
                    {event.eventType}
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 text-center leading-relaxed">
              Create a free account or sign in to explore event details, register, and track your campus activities.
            </p>
            <div className="flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                onClick={onLogin}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#FF8040] to-[#0046FF] text-white font-bold shadow-lg hover:shadow-xl text-base transition-shadow"
              >
                <LogIn className="w-5 h-5" /> Sign In
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                onClick={onRegister}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-[#0046FF] text-[#0046FF] hover:bg-[#0046FF]/5 dark:hover:bg-[#0046FF]/10 font-bold transition-all text-base"
              >
                <UserPlus className="w-5 h-5" /> Create Free Account
              </motion.button>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/60 border-t border-gray-100 dark:border-gray-800 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF8040]" />
            <p className="text-xs text-gray-400 dark:text-gray-500">Free to join · No credit card required</p>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);


// ══════════════════════════════════════════════════════════
// ERROR STATE - Handles API failures
// ══════════════════════════════════════════════════════════
const ErrorState = ({ onRetry, message = "Failed to load events" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }}
    className="col-span-full flex flex-col items-center justify-center py-16 md:py-24 px-4"
  >
    <div className="w-20 h-20 md:w-28 md:h-28 mb-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
      <AlertCircle className="w-10 h-10 md:w-14 md:h-14 text-red-500 dark:text-red-400" />
    </div>
    <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">{message}</h3>
    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 text-center max-w-md mb-6">
      We couldn't fetch the data. Please check your connection and try again.
    </p>
    {onRetry && (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRetry}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF8040] to-[#0046FF] text-white font-bold shadow-lg hover:shadow-xl transition-shadow"
      >
        <RefreshCw className="w-5 h-5" />
        Retry
      </motion.button>
    )}
  </motion.div>
);


// ══════════════════════════════════════════════════════════
// SKELETON CARD - Loading state
// ══════════════════════════════════════════════════════════
const SkeletonCard = ({ index }) => (
  <motion.div
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    transition={{ delay: index * 0.08 }}
    className="bg-white dark:bg-slate-800 rounded-2xl p-5 md:p-6 shadow-lg border border-[#0046FF]/10 dark:border-slate-700"
  >
    <div className="animate-pulse space-y-4">
      <div className="h-40 sm:h-44 md:h-48 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-xl" />
      <div className="space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-3/4" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/2" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-lg w-5/6" />
      </div>
    </div>
  </motion.div>
);


// ══════════════════════════════════════════════════════════
// EMPTY STATE - No events found
// ══════════════════════════════════════════════════════════
const EmptyState = ({ searchQuery }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }}
    className="col-span-full flex flex-col items-center justify-center py-16 md:py-24 px-4"
  >
    <div className="w-20 h-20 md:w-28 md:h-28 mb-6 rounded-full bg-gradient-to-br from-[#FF8040]/20 to-[#0046FF]/20 flex items-center justify-center">
      <Calendar className="w-10 h-10 md:w-14 md:h-14 text-[#0046FF] dark:text-[#FF8040]" />
    </div>
    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">No Events Found</h3>
    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 text-center max-w-md">
      {searchQuery 
        ? `No events match "${searchQuery}". Try different keywords or clear your search.`
        : "No events are currently available. Check back soon!"}
    </p>
  </motion.div>
);


// ══════════════════════════════════════════════════════════
// STATS SECTION - Live data from backend
// ══════════════════════════════════════════════════════════
const StatsSection = ({ events, loading }) => {
  // Calculate live stats from actual event data
  const totalEvents = events?.length || 0;
  const upcomingEvents = events?.filter(e => {
    try {
      return new Date(e.eventDate) > new Date();
    } catch {
      return false;
    }
  }).length || 0;
  const uniqueCategories = events ? [...new Set(events.map(e => e.eventType).filter(Boolean))].length : 0;

  const stats = [
    {
      label: "Total Events",
      value: loading ? "..." : totalEvents,
      icon: Calendar,
      gradient: "from-[#FF8040] to-[#FF8040]/80",
      iconBg: "bg-[#FF8040]/10 dark:bg-[#FF8040]/20",
      iconColor: "text-[#FF8040]",
      description: "Events available",
    },
    {
      label: "Active Now",
      value: loading ? "..." : upcomingEvents,
      icon: TrendingUp,
      gradient: "from-[#0046FF] to-[#001BB7]",
      iconBg: "bg-[#0046FF]/10 dark:bg-[#0046FF]/20",
      iconColor: "text-[#0046FF]",
      description: "Upcoming events",
    },
    {
      label: "Categories",
      value: loading ? "..." : uniqueCategories,
      icon: Award,
      gradient: "from-[#001BB7] to-[#0046FF]",
      iconBg: "bg-[#001BB7]/10 dark:bg-[#001BB7]/20",
      iconColor: "text-[#001BB7]",
      description: "Event types",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-16">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -6, scale: 1.02 }}
          className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-5 md:p-6 lg:p-7 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-300 cursor-pointer"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-300`} />
          
          <div className="relative flex items-center justify-between mb-3">
            <div className={`${stat.iconBg} p-3 md:p-3.5 rounded-xl group-hover:scale-110 transition-all duration-300`}>
              <stat.icon className={`w-6 h-6 md:w-7 md:h-7 ${stat.iconColor}`} />
            </div>
          </div>
          
          <div className="relative">
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-1">
              {stat.value}
            </h3>
            <p className="text-sm md:text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {stat.label}
            </p>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              {stat.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};


// ══════════════════════════════════════════════════════════
// COMMUNITY BANNER - Live user count from backend
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

  // Format user count for display
  const formatUserCount = (count) => {
    if (loading) return "...";
    if (count === 0) return "0";
    if (count > 999) return `${Math.floor(count / 1000)}k`;
    return count.toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl md:rounded-3xl mb-12 md:mb-20"
    >
      {/* Dark background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0533] via-[#0f172a] to-[#1e1b4b]" />

      {/* Animated glow blobs */}
      <motion.div
        className="absolute -top-32 -right-32 w-72 md:w-96 h-72 md:h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle,#FF8040,transparent 70%)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -left-32 w-72 md:w-96 h-72 md:h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle,#0046FF,transparent 70%)" }}
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.25, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 md:w-80 h-56 md:h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle,#a855f7,transparent 70%)" }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.8) 1px,transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 px-6 py-10 md:px-12 md:py-12 lg:px-16 lg:py-14">

        {/* LEFT — counter */}
        <div className="text-center md:text-left w-full md:w-auto">

          {/* Live badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-5"
          >
            <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF8040] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#FF8040]" />
            </span>
            <span className="text-xs md:text-sm font-bold text-white/90 uppercase tracking-wide">
              Live Community
            </span>
          </motion.div>

          {/* Big number */}
          <motion.div
            className="flex items-end gap-2 justify-center md:justify-start mb-4"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
          >
            <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-[#FF8040] via-white to-[#a78bfa] bg-clip-text text-transparent leading-none tabular-nums">
              {formatUserCount(totalUsers)}
            </span>
            {!loading && totalUsers > 0 && (
              <motion.span
                className="text-3xl md:text-4xl lg:text-5xl font-black text-[#FF8040] mb-2 leading-none"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                +
              </motion.span>
            )}
          </motion.div>

          <motion.p
            className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
          >
            Students already on EventHub
          </motion.p>
          <motion.p
            className="text-sm md:text-base text-white/60 max-w-md mx-auto md:mx-0 leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Join your peers — explore events, compete, learn &amp; grow together at SVSU
          </motion.p>

          {/* Category pills */}
          <motion.div
            className="flex flex-wrap gap-2 mt-5 justify-center md:justify-start"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45 }}
          >
            {[
              { icon: "🏆", label: "Competitions" },
              { icon: "💻", label: "Hackathons" },
              { icon: "🎓", label: "Workshops" },
              { icon: "🎉", label: "Fests" },
            ].map((pill, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/80 text-xs md:text-sm font-semibold"
              >
                <span className="text-base">{pill.icon}</span>
                {pill.label}
              </span>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — avatars + CTA */}
        <div className="flex flex-col items-center gap-6 flex-shrink-0 w-full md:w-auto">

          {/* Stacked avatars */}
          <motion.div
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex -space-x-4">
              {avatarColors.map((grad, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  whileHover={{ y: -4, zIndex: 10 }}
                  className={`relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br ${grad} border-[3px] border-[#1a0533] flex items-center justify-center shadow-xl flex-shrink-0 cursor-default`}
                >
                  <span className="text-xs md:text-sm font-black text-white select-none">
                    {initials[i]}
                  </span>
                </motion.div>
              ))}
              {/* Overflow count bubble */}
              {!loading && totalUsers > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.65 }}
                  className="relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-white/15 to-white/5 border-[3px] border-[#1a0533] flex items-center justify-center flex-shrink-0"
                >
                  <span className="text-[10px] md:text-xs font-black text-white/90 leading-tight text-center">
                    {totalUsers > 999 ? `${Math.floor(totalUsers / 1000)}k` : totalUsers}
                    <br />
                    <span className="text-white/60">more</span>
                  </span>
                </motion.div>
              )}
            </div>
            <p className="text-xs md:text-sm text-white/50 text-center">
              Real students · Real achievements · Real impact
            </p>
          </motion.div>

          {/* Horizontal divider (desktop only) */}
          <div className="w-full max-w-sm h-px bg-gradient-to-r from-transparent via-white/20 to-transparent hidden md:block" />

          {/* CTA buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <motion.a
              href="https://chat.whatsapp.com/BUuQnAOPCSRBBG0xJTPP2J"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, boxShadow: "0 0 32px rgba(255,128,64,0.55)" }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-3.5 rounded-xl bg-gradient-to-r from-[#FF8040] to-[#0046FF] text-white font-bold shadow-xl text-base whitespace-nowrap transition-all"
            >
              <UserPlus className="w-5 h-5 flex-shrink-0" />
              Join the Community
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={onBrowse}
              className="flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-3.5 rounded-xl border-2 border-white/30 text-white hover:bg-white/10 font-bold transition-all text-base whitespace-nowrap"
            >
              <Calendar className="w-5 h-5 flex-shrink-0" />
              Browse Events
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};


// ══════════════════════════════════════════════════════════
// FEATURES SECTION - Fully Responsive
// ══════════════════════════════════════════════════════════
const FeaturesSection = () => {
  const features = [
    {
      icon: Zap,
      title: "Real-Time Updates",
      description: "Never miss an event! Get instant notifications about new registrations, updates, and reminders",
      color: "#FF8040",
      bgColor: "bg-[#FF8040]/10 dark:bg-[#FF8040]/20",
    },
    {
      icon: Target,
      title: "Smart Discovery",
      description: "AI-powered recommendations to find events matching your interests, skills, and academic goals",
      color: "#0046FF",
      bgColor: "bg-[#0046FF]/10 dark:bg-[#0046FF]/20",
    },
    {
      icon: BookOpen,
      title: "Quick Registration",
      description: "Register for events in seconds with one-click process and automatic calendar integration",
      color: "#001BB7",
      bgColor: "bg-[#001BB7]/10 dark:bg-[#001BB7]/20",
    },
  ];

  return (
    <div className="mb-12 md:mb-20 mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }}
        className="text-center mb-10 md:mb-14"
      >
        <motion.div
          initial={{ scale: 0.9 }} 
          whileInView={{ scale: 1 }} 
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF8040]/10 to-[#0046FF]/10 dark:from-[#FF8040]/20 dark:to-[#0046FF]/20 border border-[#FF8040]/20 dark:border-[#0046FF]/30 mb-6"
        >
          <Star className="w-4 h-4 md:w-5 md:h-5 text-[#FF8040]" />
          <span className="text-sm md:text-base font-bold text-slate-700 dark:text-slate-300">Platform Features</span>
        </motion.div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-800 dark:text-white mb-4 px-4">
          Why Choose{" "}
          <span className="bg-gradient-to-r from-[#FF8040] to-[#0046FF] bg-clip-text text-transparent">
            SVSU Events Hub?
          </span>
        </h2>
        <p className="text-base md:text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-4 leading-relaxed">
          Your ultimate companion for campus life — discover, participate, and excel
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            transition={{ delay: 0.1 + index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="relative group bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: `linear-gradient(135deg,${feature.color}05 0%,${feature.color}10 100%)` }}
            />
            <div className="relative">
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                <feature.icon className="w-7 h-7 md:w-8 md:h-8" style={{ color: feature.color }} />
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-800 dark:text-white mb-3 group-hover:text-[#0046FF] dark:group-hover:text-[#FF8040] transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};


// ══════════════════════════════════════════════════════════
// MAIN HOME COMPONENT
// ══════════════════════════════════════════════════════════
const Home = () => {
  // State management
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [gateEvent, setGateEvent] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(false);

  // Hooks
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getAllEvents();
      
      // Validate and set data
      if (Array.isArray(data)) {
        setEvents(data);
      } else {
        console.error("Invalid events data format:", data);
        setEvents([]);
      }
    } catch (err) {
      console.error("Failed to load events:", err);
      setError(true);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users count from backend
  const fetchUsersCount = async () => {
    try {
      setUsersLoading(true);
      setUsersError(false);
      const data = await getUsersCount();
      
      // Validate and set data
      if (data && typeof data.totalUsers === 'number') {
        setTotalUsers(data.totalUsers);
      } else {
        console.error("Invalid users count data format:", data);
        setTotalUsers(0);
      }
    } catch (err) {
      console.error("Failed to fetch user count:", err);
      setUsersError(true);
      setTotalUsers(0);
    } finally {
      setUsersLoading(false);
    }
  };

  // Retry both fetches
  const handleRetryAll = () => {
    fetchEvents();
    fetchUsersCount();
  };

  // Initial data fetch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    fetchEvents();
    fetchUsersCount();
  }, []);

  // Filter events based on search query
  const filteredEvents = events.filter(event => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      event.title?.toLowerCase().includes(query) ||
      event.description?.toLowerCase().includes(query) ||
      event.eventType?.toLowerCase().includes(query) ||
      event.venue?.toLowerCase().includes(query)
    );
  });

  // Handle event card click
  const handleViewDetails = (event) => {
    if (user) {
      navigate(`/events/${event._id}`);
    } else {
      setGateEvent(event);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-slate-900' : 'bg-[#F5F1DC]'}`}>
      <Navbar />

      {/* Auth Gate Modal */}
      <AuthGateModal
        event={gateEvent}
        onClose={() => setGateEvent(null)}
        onLogin={() => {
          const eventId = gateEvent?._id;
          setGateEvent(null);
          navigate('/login', {
            state: eventId ? { from: { pathname: `/events/${eventId}` } } : undefined,
          });
        }}
        onRegister={() => {
          setGateEvent(null);
          navigate('/register');
        }}
      />

      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 md:w-96 h-80 md:h-96 rounded-full blur-3xl opacity-30 dark:opacity-20"
          style={{ background: 'radial-gradient(circle,#FF8040 0%,#FF804000 70%)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 md:w-96 h-80 md:h-96 rounded-full blur-3xl opacity-30 dark:opacity-20"
          style={{ background: 'radial-gradient(circle,#0046FF 0%,#0046FF00 70%)' }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.3, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 md:w-96 h-72 md:h-96 rounded-full blur-3xl opacity-20 dark:opacity-10"
          style={{ background: 'radial-gradient(circle,#001BB7 0%,#001BB700 70%)' }}
          animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <div
          className="absolute inset-0 opacity-5 dark:opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle,#0046FF 1px,transparent 1px)', backgroundSize: '50px 50px' }}
        />
      </div>

      {/* ── HERO ── */}
      <div className="relative pt-20 md:pt-28 lg:pt-32 pb-8 md:pb-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">

          {/* Hero content */}
          <motion.div
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 md:mb-14"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }} 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-full bg-gradient-to-r from-[#FF8040]/10 to-[#0046FF]/10 dark:from-[#FF8040]/20 dark:to-[#0046FF]/20 border-2 border-[#FF8040]/30 dark:border-[#0046FF]/30 mb-6 shadow-lg backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-[#FF8040]" />
              <span className="text-sm md:text-base font-bold bg-gradient-to-r from-[#FF8040] to-[#0046FF] bg-clip-text text-transparent">
                Shri Vishwakarma Skill University
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 leading-tight px-4"
            >
              <span className="bg-gradient-to-r from-[#FF8040] via-[#0046FF] to-[#001BB7] bg-clip-text text-transparent">
                Campus Event Hub
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-slate-700 dark:text-slate-300 max-w-4xl mx-auto font-medium leading-relaxed px-4"
            >
              <span className="text-slate-800 dark:text-slate-200 font-bold">Transform your college experience.</span>
              {' '}Explore workshops, compete in hackathons, attend tech fests, and
              <span className="bg-gradient-to-r from-[#FF8040] to-[#0046FF] bg-clip-text text-transparent font-bold"> build skills that matter</span> — your journey to excellence starts here!
            </motion.p>

            {/* Guest CTA */}
            {!user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.45 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mt-6 md:mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/register')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-xl bg-gradient-to-r from-[#FF8040] to-[#0046FF] text-white font-bold shadow-lg hover:shadow-xl transition-all text-base md:text-lg"
                >
                  <UserPlus className="w-5 h-5 md:w-6 md:h-6" /> Get Started Free
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-xl border-2 border-[#0046FF] text-[#0046FF] hover:bg-[#0046FF]/5 dark:hover:bg-[#0046FF]/10 font-bold transition-all text-base md:text-lg"
                >
                  <LogIn className="w-5 h-5 md:w-6 md:h-6" /> Sign In
                </motion.button>
              </motion.div>
            )}
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4 }}
            className="max-w-4xl mx-auto mb-10 md:mb-16"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF8040] via-[#0046FF] to-[#001BB7] rounded-2xl opacity-20 group-hover:opacity-30 blur-xl transition-opacity duration-500" />
              <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border-2 border-slate-200 dark:border-slate-700 group-hover:border-[#0046FF]/50 transition-all duration-300">
                <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-slate-400 group-focus-within:text-[#0046FF] transition-colors z-10" />
                <input
                  type="text"
                  placeholder="Search events by name, type, or venue..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-12 md:pl-16 pr-28 md:pr-40 py-4 md:py-5 lg:py-6 rounded-2xl bg-transparent border-0 focus:ring-4 focus:ring-[#0046FF]/20 outline-none transition-all text-slate-900 dark:text-slate-100 placeholder-slate-500 font-medium text-base md:text-lg"
                />
                <button 
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 md:px-6 md:py-3 rounded-xl bg-gradient-to-r from-[#FF8040] to-[#0046FF] text-white font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                  onClick={() => {/* Add filter functionality if needed */}}
                >
                  <Filter className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline text-sm md:text-base">Filter</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Stats Section - with live data */}
          {!loading && !error && events.length > 0 && (
            <StatsSection events={events} loading={loading} />
          )}

          {/* Guest teaser banner */}
          {!user && !loading && !error && filteredEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.5 }}
              className="mb-8 md:mb-10 flex flex-col sm:flex-row items-center gap-3 md:gap-4 p-4 md:p-5 rounded-2xl bg-gradient-to-r from-[#FF8040]/10 to-[#0046FF]/10 dark:from-[#FF8040]/15 dark:to-[#0046FF]/15 border-2 border-[#FF8040]/20 dark:border-[#0046FF]/25 backdrop-blur-sm"
            >
              <div className="p-2.5 md:p-3 rounded-xl bg-gradient-to-br from-[#FF8040] to-[#0046FF] flex-shrink-0">
                <Lock className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <p className="text-sm md:text-base font-bold text-slate-800 dark:text-white">Sign in to view event details &amp; register</p>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1">Click any event card to get started</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-xl bg-gradient-to-r from-[#FF8040] to-[#0046FF] text-white font-bold text-sm md:text-base shadow-lg"
              >
                <LogIn className="w-4 h-4 md:w-5 md:h-5" />
                <span>Sign In</span>
              </motion.button>
            </motion.div>
          )}

          {/* Events section heading */}
          {!loading && !error && filteredEvents.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="mb-6 md:mb-10"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                  <Trophy className="w-6 h-6 md:w-8 md:h-8 text-[#FF8040]" />
                  Trending Events
                </h2>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
                  {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
                </p>
              </div>
            </motion.div>
          )}

          {/* Events grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8 mb-12 md:mb-20">
            {loading ? (
              // Loading state
              <AnimatePresence>
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} index={i} />)}
              </AnimatePresence>
            ) : error ? (
              // Error state
              <ErrorState onRetry={handleRetryAll} message="Failed to load events" />
            ) : filteredEvents.length === 0 ? (
              // Empty state
              <EmptyState searchQuery={searchQuery} />
            ) : (
              // Events display
              <AnimatePresence mode="popLayout">
                {filteredEvents.map((event, index) => (
                  <EventCard
                    key={event._id || event.id || index}
                    event={event}
                    index={index}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* ── Community Banner with live user count ── */}
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
      <footer className="relative mt-16 md:mt-24 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-950/40 to-slate-900/60" />
        <div className="relative h-1 bg-gradient-to-r from-[#FF8040] via-[#0046FF] to-[#001BB7]" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 mb-8">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[#FF8040] to-[#0046FF] flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#FF8040] to-[#0046FF] bg-clip-text text-transparent">
                  SVSU Events
                </h3>
              </div>
              <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                Connecting students with opportunities. Empowering learning through workshops, competitions, and collaborative experiences.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-base md:text-lg font-semibold mb-4 text-[#FF8040]">Quick Links</h4>
              <ul className="space-y-3">
                {['About SVSU', 'Browse Events', 'Host an Event', 'Contact Us'].map((link, i) => (
                  <motion.li key={i} whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                    <a href="#" className="text-slate-400 hover:text-[#FF8040] transition-colors flex items-center gap-2 group text-sm md:text-base">
                      <ChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-base md:text-lg font-semibold mb-4 text-[#0046FF]">Connect With Us</h4>
              <div className="flex gap-3 mb-4 flex-wrap">
                {[
                  { Icon: Twitter, color: 'hover:bg-blue-500', label: 'Twitter' },
                  { Icon: Linkedin, color: 'hover:bg-blue-600', label: 'LinkedIn' },
                  { Icon: Github, color: 'hover:bg-slate-700', label: 'GitHub' },
                  { Icon: Mail, color: 'hover:bg-[#FF8040]', label: 'Email' },
                ].map(({ Icon, color, label }, i) => (
                  <motion.a
                    key={i} 
                    href="#" 
                    aria-label={label}
                    whileHover={{ scale: 1.15, rotate: 5 }} 
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 md:p-3.5 rounded-xl bg-slate-900 ${color} transition-all shadow-lg group`}
                  >
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-slate-400 group-hover:text-white transition-colors" />
                  </motion.a>
                ))}
              </div>
              <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                <strong className="text-slate-400">Email:</strong> info@svsu.ac.in<br />
                <strong className="text-slate-400">Phone:</strong> 18001800147
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 md:pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-xs md:text-sm flex items-center gap-2 text-center md:text-left">
              © 2026 SVSU Events. Crafted with
              <motion.span 
                animate={{ scale: [1, 1.3, 1] }} 
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              >
                <Heart className="w-4 h-4 text-[#FF8040] fill-[#FF8040]" />
              </motion.span>
              for students
            </p>
            <div className="flex gap-5 md:gap-6 text-xs md:text-sm">
              {['Privacy', 'Terms', 'Cookies'].map((link, i) => (
                <motion.a 
                  key={i} 
                  href="#" 
                  whileHover={{ scale: 1.05 }}
                  className="text-slate-500 hover:text-[#FF8040] transition-colors"
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;


// // Origional Code
// import { useEffect, useState } from "react";
// import { getAllEvents } from "../../services/eventService";
// import EventCard from "../../components/EventCard";

// const Home = () => {
//     const [events, setEvents] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchEvents = async () => {
//             try {
//                 const data = await getAllEvents();
//                 setEvents(data);
//             } catch(error) {
//                 alert("Failed to load events");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchEvents();
//     }, []);

//     if(loading) {
//         return <p>Loading events...</p>;
//     }

//     return (
//         <div>
//             <h2>All Events</h2>

//             {events.length === 0 && <p>No events available</p>}
//             {events.map((event) => (
//                 <EventCard key={event._id} event={event} />
//             ))}
//         </div>
//     );
// };

// export default Home;