import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Mail, Lock, Eye, EyeOff, UserPlus, ArrowRight,
  Sparkles, Calendar, User, IdCard, LogIn,
  GraduationCap, Users,
} from "lucide-react";
import Navbar from "../../components/Navbar";

/* ─── Global CSS (injected once) ─────────────────────────────────────────── */
const GLOBAL_STYLES = `
  @keyframes blob-a {
    0%,100% { transform: scale(1)    rotate(0deg);   opacity:.16; }
    50%      { transform: scale(1.18) rotate(90deg);  opacity:.26; }
  }
  @keyframes blob-b {
    0%,100% { transform: scale(1)    rotate(0deg);   opacity:.16; }
    50%      { transform: scale(1.22) rotate(-90deg); opacity:.26; }
  }
  @keyframes float-up {
    0%,100% { transform:translateY(0);    opacity:.18; }
    50%     { transform:translateY(-26px); opacity:.42; }
  }
  @keyframes glow-pulse {
    0%,100% { opacity:.16; }
    50%     { opacity:.30; }
  }
  @keyframes dot-scroll {
    0%   { background-position:0% 0%; }
    100% { background-position:100% 100%; }
  }
  @keyframes arrow-nudge {
    0%,100% { transform:translateX(0); }
    50%     { transform:translateX(4px); }
  }
  @keyframes spin {
    to { transform:rotate(360deg); }
  }
  @keyframes role-icon-spin {
    0%   { transform:rotate(0deg); }
    100% { transform:rotate(360deg); }
  }

  .blob-a  { animation: blob-a      20s ease-in-out infinite; will-change:transform,opacity; }
  .blob-b  { animation: blob-b      15s ease-in-out infinite; will-change:transform,opacity; }
  .glow-r  { animation: glow-pulse   4s ease-in-out infinite; will-change:opacity; }
  .dot-bg  { animation: dot-scroll  10s linear     infinite; will-change:background-position; }

  /* One full spin (0.6s) when selected — stops after completing */
  .role-icon-selected { animation: role-icon-spin 0.6s ease-in-out 1 forwards; will-change:transform; }

  button, a { -webkit-tap-highlight-color: transparent; }
`;

/* ─── Static particle positions (no Math.random — fixes lag) ─────────────── */
const PARTICLES = [
  [8,  6,  0], [24, 52, 1], [42, 20, 0], [61, 68, 1],
  [76, 13, 0], [90, 46, 1], [33, 83, 0], [53, 36, 1],
  [5,  70, 0], [81, 88, 1], [18, 28, 0], [68, 60, 1],
];

/* ─── Fade-up helper ─────────────────────────────────────────────────────── */
const fu = (delay) => ({
  initial:    { opacity: 0, y: 14 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.38, delay, ease: "easeOut" },
});

/* ─── Slide-in helper ────────────────────────────────────────────────────── */
const sl = (delay) => ({
  initial:    { opacity: 0, x: -20 },
  animate:    { opacity: 1, x: 0   },
  transition: { duration: 0.38, delay, ease: "easeOut" },
});

/* ════════════════════════════════════════════════════════════════════════════ */
const Register = () => {
  const navigate     = useNavigate();
  const { register } = useAuth();

  const [darkMode,     setDarkMode]     = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);
  const [formData,     setFormData]     = useState({
    name: "", email: "", collegeId: "", password: "", role: "student",
  });

  /* ── Scroll only on mount ── */
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  /* ── Inject styles once ── */
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = GLOBAL_STYLES;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(formData);
      toast.success("Registration successful ✅");
      navigate("/");
    } catch {
      toast.error("Registration failed ❌");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Role options (static — no re-creation on render) ── */
  const roleOptions = [
    {
      value: "student",
      label: "Student",
      icon: GraduationCap,
      description: "Attend & discover events",
      grad: "from-[#0046FF] to-[#001BB7]",
    },
    {
      value: "host",
      label: "Event Host",
      icon: Users,
      description: "Create & manage events",
      grad: "from-[#FF8040] to-[#0046FF]",
    },
  ];

  /* Shared input class */
  const inputCls =
    "w-full rounded-lg sm:rounded-xl " +
    "bg-gray-50 dark:bg-gray-800 " +
    "border-2 border-gray-200 dark:border-gray-700 " +
    "focus:border-[#0046FF] focus:ring-2 focus:ring-[#0046FF]/10 " +
    "outline-none transition-all duration-200 " +
    "text-gray-900 dark:text-gray-100 placeholder-gray-400 " +
    "py-3 text-sm " +
    "sm:py-3.5 sm:text-[15px] " +
    "lg:py-4 lg:text-base";

  const labelCls =
    "block font-semibold text-gray-700 dark:text-gray-300 mb-1.5 " +
    "text-[11px] sm:text-xs md:text-sm";

  const iconSlot =
    "absolute inset-y-0 left-0 flex items-center pointer-events-none " +
    "pl-3 sm:pl-3.5 md:pl-4";

  /* ══════════════════════ RENDER ══════════════════════ */
  return (
    <div className={darkMode ? "dark" : ""}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* ── Page shell ── */}
      <div className="
        min-h-[100dvh]
        bg-[#F5F1DC] dark:bg-slate-900
        transition-colors duration-500
        flex items-center justify-center
        px-3 py-6
        sm:px-5 sm:py-10
        md:px-8 md:py-12
        lg:px-10 lg:py-16
      ">

        {/* ── Background (CSS-only — no framer, no Math.random) ── */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
          <div
            className="blob-a absolute -top-32 -right-32
                        w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96
                        rounded-full"
            style={{ background: "radial-gradient(circle,#FF8040 0%,transparent 70%)", filter: "blur(52px)" }}
          />
          <div
            className="blob-b absolute -bottom-32 -left-32
                        w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96
                        rounded-full"
            style={{ background: "radial-gradient(circle,#0046FF 0%,transparent 70%)", filter: "blur(52px)" }}
          />
          {PARTICLES.map(([l, t, ci], i) => (
            <div
              key={i}
              className="absolute rounded-full hidden sm:block"
              style={{
                left: `${l}%`, top: `${t}%`,
                width: "6px", height: "6px",
                background: ci === 0 ? "#FF8040" : "#0046FF",
                animation: `float-up ${3 + (i % 3)}s ease-in-out ${(i * 0.28).toFixed(2)}s infinite`,
                willChange: "transform,opacity",
              }}
            />
          ))}
        </div>

        {/* ── Card wrapper ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="
            relative z-10 w-full
            max-w-[390px]
            sm:max-w-[420px]
            md:max-w-[460px]
            lg:max-w-[500px]
            xl:max-w-[520px]
          "
        >
          {/* Glow ring */}
          <div
            className="glow-r absolute -inset-[3px] rounded-2xl sm:rounded-3xl"
            style={{
              background: "linear-gradient(135deg,#FF8040,#0046FF,#001BB7)",
              filter: "blur(18px)",
              zIndex: -1,
            }}
          />

          {/* ── Main card ── */}
          <div className="relative bg-white/85 dark:bg-gray-900/85 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200/80 dark:border-gray-800 overflow-hidden">

            {/* ════ Header ════ */}
            <div className="
              relative overflow-hidden
              bg-gradient-to-br from-[#FF8040] via-[#0046FF] to-[#001BB7]
              px-5 pt-7 pb-6
              sm:px-7 sm:pt-8 sm:pb-7
              md:px-9 md:pt-9 md:pb-8
              lg:px-10 lg:pt-10 lg:pb-9
            ">
              {/* Dot pattern */}
              <div
                className="dot-bg absolute inset-0 opacity-[0.13] pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(circle,white 1px,transparent 1px)",
                  backgroundSize: "18px 18px",
                }}
              />

              <div className="relative z-10 flex flex-col items-center">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.48, delay: 0.12, type: "spring", stiffness: 200, damping: 18 }}
                  className="
                    mb-3 sm:mb-4
                    p-3 sm:p-3.5 md:p-4
                    rounded-xl sm:rounded-2xl
                    bg-white/20 backdrop-blur-sm border border-white/30 shadow-xl
                  "
                >
                  <Calendar className="text-white w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10" />
                </motion.div>

                <motion.h1
                  {...fu(0.22)}
                  className="
                    font-black text-white text-center leading-tight mb-1.5 sm:mb-2
                    text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.1rem]
                  "
                >
                  Join SVSU Events
                </motion.h1>

                <motion.p
                  {...fu(0.30)}
                  className="text-white/90 text-center text-[11px] sm:text-xs md:text-[13px] lg:text-sm"
                >
                  Create your account and start exploring
                </motion.p>
              </div>
            </div>

            {/* ════ Form ════ */}
            <div className="
              px-4  py-5
              sm:px-6 sm:py-6
              md:px-8 md:py-7
              lg:px-9 lg:py-8
            ">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

                {/* Full Name */}
                <motion.div {...sl(0.36)}>
                  <label className={labelCls}>Full Name</label>
                  <div className="relative group">
                    <span className={iconSlot}>
                      <User className="w-4 h-4 sm:w-[17px] sm:h-[17px] md:w-5 md:h-5 text-gray-400 group-focus-within:text-[#0046FF] transition-colors duration-200" />
                    </span>
                    <input
                      type="text" name="name" required
                      placeholder="Enter your full name"
                      value={formData.name} onChange={handleChange}
                      className={`${inputCls} pl-9 sm:pl-10 md:pl-12 pr-3 md:pr-4`}
                    />
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div {...sl(0.43)}>
                  <label className={labelCls}>Email Address</label>
                  <div className="relative group">
                    <span className={iconSlot}>
                      <Mail className="w-4 h-4 sm:w-[17px] sm:h-[17px] md:w-5 md:h-5 text-gray-400 group-focus-within:text-[#0046FF] transition-colors duration-200" />
                    </span>
                    <input
                      type="email" name="email" required
                      placeholder="Enter your email"
                      value={formData.email} onChange={handleChange}
                      className={`${inputCls} pl-9 sm:pl-10 md:pl-12 pr-3 md:pr-4`}
                    />
                  </div>
                </motion.div>

                {/* College ID */}
                <motion.div {...sl(0.50)}>
                  <label className={labelCls}>College ID</label>
                  <div className="relative group">
                    <span className={iconSlot}>
                      <IdCard className="w-4 h-4 sm:w-[17px] sm:h-[17px] md:w-5 md:h-5 text-gray-400 group-focus-within:text-[#0046FF] transition-colors duration-200" />
                    </span>
                    <input
                      type="text" name="collegeId" required
                      placeholder="Enter your college ID"
                      value={formData.collegeId} onChange={handleChange}
                      className={`${inputCls} pl-9 sm:pl-10 md:pl-12 pr-3 md:pr-4`}
                    />
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div {...sl(0.57)}>
                  <label className={labelCls}>Password</label>
                  <div className="relative group">
                    <span className={iconSlot}>
                      <Lock className="w-4 h-4 sm:w-[17px] sm:h-[17px] md:w-5 md:h-5 text-gray-400 group-focus-within:text-[#0046FF] transition-colors duration-200" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"} name="password" required
                      placeholder="Create a strong password"
                      value={formData.password} onChange={handleChange}
                      className={`${inputCls} pl-9 sm:pl-10 md:pl-12 pr-10 sm:pr-11 md:pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="
                        absolute inset-y-0 right-0 flex items-center
                        pr-3 sm:pr-3.5 md:pr-4
                        hover:scale-110 active:scale-90
                        transition-transform duration-150
                        min-w-[44px] justify-center
                      "
                    >
                      {showPassword
                        ? <EyeOff className="w-4 h-4 sm:w-[17px] sm:h-[17px] md:w-5 md:h-5 text-gray-400 hover:text-[#0046FF] transition-colors duration-200" />
                        : <Eye    className="w-4 h-4 sm:w-[17px] sm:h-[17px] md:w-5 md:h-5 text-gray-400 hover:text-[#0046FF] transition-colors duration-200" />
                      }
                    </button>
                  </div>
                </motion.div>

                {/* ── Role Selection ── */}
                <motion.div {...fu(0.63)}>
                  <label className={labelCls}>I want to join as</label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {roleOptions.map((option) => {
                      const Icon     = option.icon;
                      const selected = formData.role === option.value;
                      return (
                        <label
                          key={option.value}
                          className={`
                            relative cursor-pointer select-none
                            rounded-lg sm:rounded-xl
                            p-3 sm:p-4
                            border-2 transition-all duration-200
                            ${selected
                              ? "border-[#0046FF] bg-[#0046FF]/5 dark:bg-[#0046FF]/10 shadow-lg shadow-[#0046FF]/20"
                              : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-[#0046FF]/50"
                            }
                          `}
                        >
                          <input
                            type="radio" name="role" value={option.value}
                            checked={selected} onChange={handleChange}
                            className="sr-only"
                          />

                          {/* ── Icon + Text (pointer-events-none so label handles click) ── */}
                          <div className="flex flex-col items-center text-center gap-1.5 sm:gap-2 pointer-events-none">
                            {/*
                              Icon badge:
                              • key={selected} forces a fresh DOM node when selection changes
                                → the CSS animation always starts from 0° on each click
                              • animation class only applied when selected → one 0.6s spin, then stops
                            */}
                            <div
                              key={`${option.value}-${selected}`}
                              className={`
                                p-1.5 sm:p-2 rounded-md sm:rounded-lg
                                bg-gradient-to-br ${option.grad}
                                ${selected ? "role-icon-selected" : ""}
                              `}
                            >
                              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>

                            <div>
                              <p className={`text-xs sm:text-sm font-bold transition-colors duration-200 ${selected ? "text-[#0046FF]" : "text-gray-700 dark:text-gray-300"}`}>
                                {option.label}
                              </p>
                              <p className="text-[9px] sm:text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">
                                {option.description}
                              </p>
                            </div>
                          </div>

                          {/*
                            Check badge:
                            • Always rendered (no conditional mount/unmount) → zero layout shift
                            • Visibility toggled via opacity + scale — GPU-composited, no reflow
                          */}
                          <span
                            className={`
                              absolute top-1.5 right-1.5 sm:top-2 sm:right-2
                              w-4 h-4 sm:w-5 sm:h-5
                              bg-[#0046FF] rounded-full
                              flex items-center justify-center
                              transition-all duration-200
                              ${selected ? "opacity-100 scale-100" : "opacity-0 scale-50"}
                            `}
                            aria-hidden={!selected}
                          >
                            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Create Account button */}
                <motion.div {...fu(0.70)}>
                  <button
                    type="submit" disabled={isLoading}
                    className="
                      w-full flex items-center justify-center gap-2 font-bold text-white
                      rounded-lg sm:rounded-xl
                      min-h-[48px] sm:min-h-[50px] md:min-h-[54px]
                      px-4
                      text-sm sm:text-[15px] md:text-base
                      bg-gradient-to-r from-[#FF8040] to-[#0046FF]
                      hover:from-[#FF8040]/90 hover:to-[#0046FF]/90
                      disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
                      shadow-lg shadow-[#0046FF]/20
                      hover:shadow-xl hover:scale-[1.02] active:scale-[0.97]
                      transition-all duration-200
                    "
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full flex-shrink-0"
                          style={{ animation: "spin 0.75s linear infinite" }}
                        />
                        <span>Creating Account…</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        <span>Create Account</span>
                        <ArrowRight
                          className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                          style={{ animation: "arrow-nudge 1.5s ease-in-out infinite" }}
                        />
                      </>
                    )}
                  </button>
                </motion.div>

                {/* Divider */}
                <motion.div {...fu(0.74)} className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="
                      px-3 sm:px-4
                      bg-white dark:bg-gray-900
                      text-[11px] sm:text-xs md:text-sm
                      text-gray-400 dark:text-gray-500 font-medium
                    ">
                      Already have an account?
                    </span>
                  </div>
                </motion.div>

                {/* Sign In button */}
                <motion.div {...fu(0.78)}>
                  <Link to="/login" className="block">
                    <button
                      type="button"
                      className="
                        w-full flex items-center justify-center gap-2 font-bold
                        rounded-lg sm:rounded-xl
                        min-h-[48px] sm:min-h-[50px] md:min-h-[54px]
                        px-4
                        text-sm sm:text-[15px] md:text-base
                        border-2 border-[#0046FF] text-[#0046FF]
                        hover:bg-[#0046FF]/5 dark:hover:bg-[#0046FF]/10
                        hover:scale-[1.02] active:scale-[0.97]
                        transition-all duration-200
                      "
                    >
                      <LogIn className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span>Sign In Instead</span>
                    </button>
                  </Link>
                </motion.div>

              </form>
            </div>

            {/* ════ Footer ════ */}
            <motion.div
              {...fu(0.82)}
              className="
                border-t border-gray-200 dark:border-gray-800
                bg-gray-50 dark:bg-gray-900/50
                px-4 py-3
                sm:px-6 sm:py-3.5
                md:px-8 md:py-4
              "
            >
              <p className="text-center text-gray-400 dark:text-gray-500 text-[10px] sm:text-[11px] md:text-xs">
                By creating an account, you agree to our{" "}
                <a href="#" className="text-[#0046FF] hover:underline font-semibold">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-[#0046FF] hover:underline font-semibold">Privacy Policy</a>
              </p>
            </motion.div>
          </div>

          {/* Bottom badge */}
          <motion.div
            {...fu(0.86)}
            className="
              mt-4 sm:mt-5
              flex items-center justify-center gap-1.5 sm:gap-2
              text-[11px] sm:text-xs md:text-sm
              text-gray-400 dark:text-gray-500
            "
          >
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-[#FF8040] flex-shrink-0" />
            <span>Join thousands of event enthusiasts</span>
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-[#0046FF] flex-shrink-0" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;