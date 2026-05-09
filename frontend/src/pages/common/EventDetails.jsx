import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { 
  Calendar, 
  Clock, 
  Users, 
  Trophy, 
  Gift, 
  AlertCircle, 
  CheckCircle2,
  XCircle,
  MapPin,
  Tag,
  FileText,
  Sparkles,
  ArrowLeft,
  User,
  Phone,
  Mail,
  Award,
  Target,
  Zap,
  Shield,
  ChevronRight
} from "lucide-react";
import { getEventById } from "../../services/eventService";
import { createRegistration, getMyRegistrations } from "../../services/registrationService";
import { useAuth } from "../../context/AuthContext";
import RegistrationForm from "../student/RegistrationForm";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";

const EventDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();

    const [darkMode, setDarkMode] = useState(false);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [registeredEventIds, setRegisteredEventIds] = useState([]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });

        const fetchEvent = async () => {
            try {
                const data = await getEventById(id);
                setEvent(data);
            } catch {
                toast.error("Event not found");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchEvent();
    }, [id]);

    useEffect(() => {
        const fetchMyRegistrations = async () => {
            if (user?.role === "student") {
                const regs = await getMyRegistrations(user.id);
                const ids = regs
                    .filter(r => r.eventId)
                    .map(r => r.eventId._id);
                setRegisteredEventIds(ids);
            }
        };

        fetchMyRegistrations();
    }, [user]);

    const handleRegistration = async (formData) => {
        try {
            await createRegistration(event._id, formData);
            toast.success("Registered successfully! ✅");
            setShowForm(false);
            const regs = await getMyRegistrations(user.id);
            const ids = regs.filter(r => r.eventId).map(r => r.eventId._id);
            setRegisteredEventIds(ids);
        } catch (err) {
            toast.error(err.response?.data?.message || "Already registered");
        }
    };

    if (loading) {
        return (
            <div className={darkMode ? 'dark' : ''}>
                <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
                <div className="min-h-screen bg-[#F5F1DC] dark:bg-slate-900 flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 md:w-16 md:h-16 border-4 border-[#FF8040] border-t-transparent rounded-full"
                    />
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className={darkMode ? 'dark' : ''}>
                <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
                <div className="min-h-screen bg-[#F5F1DC] dark:bg-slate-900 flex items-center justify-center px-4">
                    <div className="text-center max-w-md">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Event Not Found</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">The event you're looking for doesn't exist.</p>
                        <Link to="/">
                            <button className="px-6 py-3 bg-gradient-to-r from-[#FF8040] to-[#0046FF] text-white rounded-xl font-semibold hover:shadow-xl transition-all">
                                Back to Events
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const deadlinePassed = event.registrationDeadline && new Date() > new Date(event.registrationDeadline);
    const isAlreadyRegistered = registeredEventIds.includes(event._id);

    const getEventTypeColor = (type) => {
        const colors = {
            'Hackathon': 'from-[#FF8040] to-[#0046FF]',
            'Competition': 'from-[#0046FF] to-[#001BB7]',
            'Fest': 'from-[#001BB7] to-[#FF8040]',
            'Workshop': 'from-[#FF8040] via-[#0046FF] to-[#001BB7]'
        };
        return colors[type] || 'from-[#FF8040] to-[#0046FF]';
    };

    return (
        <div className={darkMode ? 'dark' : ''}>
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
            
            <div className="min-h-screen bg-[#F5F1DC] dark:bg-slate-900 transition-colors duration-300">
                
                {/* Background Decorations */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-72 md:w-96 h-72 md:h-96 rounded-full blur-3xl opacity-20 dark:opacity-10"
                         style={{ background: 'radial-gradient(circle, #FF8040 0%, #FF804000 70%)' }} />
                    <div className="absolute -bottom-40 -left-40 w-72 md:w-96 h-72 md:h-96 rounded-full blur-3xl opacity-20 dark:opacity-10"
                         style={{ background: 'radial-gradient(circle, #0046FF 0%, #0046FF00 70%)' }} />
                </div>

                <div className="relative container mx-auto px-3 py-4 md:px-4 md:py-6 lg:px-8 lg:py-8 max-w-7xl">
                    
                    {/* Back Button */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-3 md:mb-4 lg:mb-6"
                    >
                        <Link to="/">
                            <motion.button
                                whileHover={{ x: -4 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#FF8040] dark:hover:border-[#FF8040] transition-all text-sm md:text-base"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="font-medium">Back to Events</span>
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* ═══════════════════════════════════════════════
                        HERO BANNER — Fixed Layout
                        • Banner image fills container cleanly (no blur)
                        • Logo sits OUTSIDE the image, below it
                        • Title + description are BELOW the banner entirely
                    ════════════════════════════════════════════════ */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mb-4 md:mb-6 lg:mb-8"
                    >
                        {/* Banner Image Container
                             Single <img> for all breakpoints.
                             Mobile (<768px) : height:auto  → full image, no crop
                             md–lg (768–1279): max-height 340px, object-fit:cover
                             xl+ (≥1280px)   : max-height 420px, object-fit:cover
                        */}
                        <div className="relative w-full rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden bg-slate-200 dark:bg-slate-800">
                            
                            {event.banner?.url ? (
                                <img
                                    src={event.banner.url}
                                    alt={event.title}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        /* mobile: let height be natural */
                                        height: 'auto',
                                    }}
                                    /* Tailwind overrides for md+ */
                                    className="w-full h-auto md:h-[340px] xl:h-[420px] md:object-cover md:object-top"
                                />
                            ) : (
                                <div className="w-full flex items-center justify-center bg-gradient-to-br from-[#FF8040] via-[#0046FF] to-[#001BB7] h-48 md:h-[340px]">
                                    <Calendar className="w-24 h-24 text-white/30" />
                                </div>
                            )}

                            {/* Event Type Badge — top right */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.3 }}
                                className="absolute top-3 right-3 md:top-4 md:right-4 z-10"
                            >
                                <div className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full backdrop-blur-md bg-gradient-to-r ${getEventTypeColor(event.eventType)} shadow-lg`}>
                                    <span className="text-white font-bold text-[10px] md:text-xs uppercase tracking-wider flex items-center gap-1.5">
                                        <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                        {event.eventType}
                                    </span>
                                </div>
                            </motion.div>
                        </div>

                        {/* ── Below-Banner Info Card ── */}
                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-b-xl md:rounded-b-2xl border border-t-0 border-slate-200 dark:border-slate-700 px-4 pt-4 pb-5 md:px-6 md:pt-5 md:pb-6">
                            
                            {/* Logo + Title row */}
                            <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                                
                                {/* Logo — clear, properly sized */}
                                {event.logo?.url && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.15, duration: 0.3 }}
                                        className="flex-shrink-0 w-14 h-14 md:w-20 md:h-20 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 overflow-hidden shadow-md"
                                    >
                                        <img
                                            src={event.logo.url}
                                            alt="Event Logo"
                                            className="w-full h-full"
                                            style={{ objectFit: 'contain' }}
                                        />
                                    </motion.div>
                                )}

                                {/* Title + meta */}
                                <div className="flex-1 min-w-0">
                                    <motion.h1
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2, duration: 0.3 }}
                                        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-1 md:mb-2"
                                    >
                                        {event.title}
                                    </motion.h1>

                                    {/* Quick meta pills */}
                                    <div className="flex flex-wrap gap-2">
                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-full">
                                            <Calendar className="w-3 h-3 text-[#FF8040]" />
                                            {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-full">
                                            <Users className="w-3 h-3 text-[#0046FF]" />
                                            {event.participationType}
                                        </span>
                                        {event.participationType === "Team" && event.teamSize && (
                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-full">
                                                <User className="w-3 h-3 text-[#001BB7]" />
                                                Team of {event.teamSize}
                                            </span>
                                        )}
                                        {event.registrationDeadline && (
                                            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${deadlinePassed ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                                                <Clock className="w-3 h-3" />
                                                Deadline: {new Date(event.registrationDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Full Description — always fully visible */}
                            {event.description && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.3 }}
                                    className="text-slate-700 dark:text-slate-300 text-sm md:text-base lg:text-lg leading-relaxed"
                                >
                                    {event.description}
                                </motion.p>
                            )}
                        </div>
                    </motion.div>
                    {/* ══ End Hero ══ */}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                        
                        {/* Main Content — Left Column */}
                        <div className="lg:col-span-2 space-y-4 md:space-y-6">

                            {/* Quick Info Cards */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35, duration: 0.3 }}
                                className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4"
                            >
                                {/* Event Date */}
                                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-slate-200 dark:border-slate-700 text-center">
                                    <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-[#FF8040] mx-auto mb-1.5 lg:mb-2" />
                                    <p className="text-[10px] lg:text-xs text-slate-500 dark:text-slate-400 mb-1">Event Date</p>
                                    <p className="text-xs lg:text-sm font-bold text-slate-900 dark:text-white">
                                        {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </p>
                                </div>

                                {/* Participation Type */}
                                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-slate-200 dark:border-slate-700 text-center">
                                    <Users className="w-5 h-5 lg:w-6 lg:h-6 text-[#0046FF] mx-auto mb-1.5 lg:mb-2" />
                                    <p className="text-[10px] lg:text-xs text-slate-500 dark:text-slate-400 mb-1">Type</p>
                                    <p className="text-xs lg:text-sm font-bold text-slate-900 dark:text-white">{event.participationType}</p>
                                </div>

                                {/* Team Size */}
                                {event.participationType === "Team" && (
                                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-slate-200 dark:border-slate-700 text-center">
                                        <User className="w-5 h-5 lg:w-6 lg:h-6 text-[#001BB7] mx-auto mb-1.5 lg:mb-2" />
                                        <p className="text-[10px] lg:text-xs text-slate-500 dark:text-slate-400 mb-1">Team Size</p>
                                        <p className="text-xs lg:text-sm font-bold text-slate-900 dark:text-white">{event.teamSize}</p>
                                    </div>
                                )}

                                {/* Deadline */}
                                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-slate-200 dark:border-slate-700 text-center">
                                    <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-red-600 dark:text-red-400 mx-auto mb-1.5 lg:mb-2" />
                                    <p className="text-[10px] lg:text-xs text-slate-500 dark:text-slate-400 mb-1">Deadline</p>
                                    <p className="text-xs lg:text-sm font-bold text-slate-900 dark:text-white">
                                        {new Date(event.registrationDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Rules Section */}
                            {event.rules && event.rules.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.3 }}
                                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-slate-200 dark:border-slate-700"
                                >
                                    <div className="flex items-center gap-2.5 lg:gap-3 mb-3 lg:mb-4">
                                        <div className="p-1.5 lg:p-2 rounded-lg bg-[#FF8040]/10 dark:bg-[#FF8040]/20">
                                            <FileText className="w-4 h-4 lg:w-5 lg:h-5 text-[#FF8040]" />
                                        </div>
                                        <h2 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white">Rules & Guidelines</h2>
                                    </div>
                                    <div className="space-y-2 lg:space-y-3">
                                        {event.rules.map((rule, index) => (
                                            <div
                                                key={index}
                                                className="flex items-start gap-2.5 lg:gap-3 p-2.5 lg:p-3 rounded-lg lg:rounded-xl bg-slate-50 dark:bg-slate-900/50"
                                            >
                                                <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-[#0046FF] flex-shrink-0 mt-0.5" />
                                                <p className="text-slate-700 dark:text-slate-300 text-xs lg:text-sm leading-relaxed">{rule}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Perks Section */}
                            {event.perks && event.perks.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.45, duration: 0.3 }}
                                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-slate-200 dark:border-slate-700"
                                >
                                    <div className="flex items-center gap-2.5 lg:gap-3 mb-3 lg:mb-4">
                                        <div className="p-1.5 lg:p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                                            <Gift className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <h2 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white">Perks & Benefits</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-3">
                                        {event.perks.map((perk, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2.5 lg:gap-3 p-2.5 lg:p-3 rounded-lg lg:rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                                            >
                                                <Zap className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                                                <p className="text-slate-700 dark:text-slate-300 text-xs lg:text-sm font-medium">{perk}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Legal Notice */}
                            {event.legalNotice && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.3 }}
                                    className="bg-yellow-50 dark:bg-yellow-900/20 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-yellow-200 dark:border-yellow-800"
                                >
                                    <div className="flex items-start gap-2.5 lg:gap-3">
                                        <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="text-xs lg:text-sm font-bold text-yellow-900 dark:text-yellow-100 mb-1.5 lg:mb-2">Legal Notice</h3>
                                            <p className="text-yellow-800 dark:text-yellow-200 text-xs lg:text-sm leading-relaxed">{event.legalNotice}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Sidebar — Right Column */}
                        <div className="space-y-4 md:space-y-6">
                            
                            {/* Registration Card */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.35, duration: 0.3 }}
                                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-slate-200 dark:border-slate-700 lg:sticky lg:top-24"
                            >
                                {/* Prizes */}
                                {event.prizes && (
                                    <div className="mb-4 lg:mb-6 p-3 lg:p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800">
                                        <div className="flex items-center gap-2 mb-1.5 lg:mb-2">
                                            <Trophy className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-600 dark:text-yellow-400" />
                                            <h3 className="font-bold text-sm lg:text-base text-slate-900 dark:text-white">Prizes</h3>
                                        </div>
                                        <p className="text-xl lg:text-2xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent">
                                            {event.prizes}
                                        </p>
                                    </div>
                                )}

                                {/* Registration Status */}
                                {user?.role === "student" && (
                                    <div className="space-y-3 lg:space-y-4">
                                        {isAlreadyRegistered ? (
                                            <motion.div
                                                initial={{ scale: 0.9 }}
                                                animate={{ scale: 1 }}
                                                className="p-3 lg:p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-400"
                                            >
                                                <div className="flex items-center gap-2.5 lg:gap-3">
                                                    <CheckCircle2 className="w-5 h-5 lg:w-6 lg:h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                                                    <div>
                                                        <p className="font-bold text-sm lg:text-base text-green-900 dark:text-green-100">Already Registered</p>
                                                        <p className="text-[10px] lg:text-xs text-green-700 dark:text-green-300">You're all set for this event!</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : deadlinePassed ? (
                                            <motion.div
                                                initial={{ scale: 0.9 }}
                                                animate={{ scale: 1 }}
                                                className="p-3 lg:p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-500 dark:border-red-400"
                                            >
                                                <div className="flex items-center gap-2.5 lg:gap-3">
                                                    <XCircle className="w-5 h-5 lg:w-6 lg:h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                                                    <div>
                                                        <p className="font-bold text-sm lg:text-base text-red-900 dark:text-red-100">Registration Closed</p>
                                                        <p className="text-[10px] lg:text-xs text-red-700 dark:text-red-300">Deadline has passed</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setShowForm(true)}
                                                className="w-full px-4 py-3 lg:px-6 lg:py-4 rounded-xl bg-gradient-to-r from-[#FF8040] to-[#0046FF] hover:from-[#FF8040]/90 hover:to-[#0046FF]/90 text-white font-bold shadow-lg shadow-[#FF8040]/30 hover:shadow-xl hover:shadow-[#FF8040]/50 transition-all duration-300 flex items-center justify-center gap-2 text-sm lg:text-base"
                                            >
                                                <Target className="w-4 h-4 lg:w-5 lg:h-5" />
                                                <span>Register Now</span>
                                            </motion.button>
                                        )}
                                    </div>
                                )}

                                {/* Coordinators */}
                                {event.coordinators && event.coordinators.length > 0 && (
                                    <div className="mt-4 pt-4 lg:mt-6 lg:pt-6 border-t border-slate-200 dark:border-slate-700">
                                        <h3 className="font-bold text-sm lg:text-base text-slate-900 dark:text-white mb-3 lg:mb-4 flex items-center gap-2">
                                            <User className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                                            Event Coordinators
                                        </h3>
                                        <div className="space-y-2 lg:space-y-3">
                                            {event.coordinators.map((coordinator, index) => (
                                                <div
                                                    key={index}
                                                    className="p-2.5 lg:p-3 rounded-lg lg:rounded-xl bg-slate-50 dark:bg-slate-900/50"
                                                >
                                                    <p className="font-semibold text-slate-900 dark:text-white text-xs lg:text-sm mb-1">
                                                        {coordinator.name}
                                                    </p>
                                                    <a
                                                        href={`tel:${coordinator.contact}`}
                                                        className="flex items-center gap-1.5 lg:gap-2 text-[10px] lg:text-xs text-[#0046FF] dark:text-[#FF8040] hover:underline"
                                                    >
                                                        <Phone className="w-3 h-3" />
                                                        {coordinator.contact}
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Registration Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-4"
                        onClick={() => setShowForm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-slate-800 rounded-xl md:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <RegistrationForm
                                event={event}
                                onSubmit={handleRegistration}
                                onClose={() => setShowForm(false)}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EventDetails;