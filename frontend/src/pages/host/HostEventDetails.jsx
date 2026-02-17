import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext"; // Add import


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
                        className="w-12 h-12 md:w-16 md:h-16 border-3 md:border-4 border-[#FF8040] border-t-transparent rounded-full"
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
                        <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-red-500 mx-auto mb-3 md:mb-4" />
                        <h2 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white mb-2">Event Not Found</h2>
                        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mb-4 md:mb-6">The event you're looking for doesn't exist.</p>
                        <Link to="/host">
                            <button className="px-5 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-[#FF8040] to-[#0046FF] text-white rounded-xl font-semibold hover:shadow-xl transition-all text-sm md:text-base">
                                Back to Dashboard
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
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 md:w-80 h-64 md:h-80 rounded-full blur-3xl opacity-10 dark:opacity-5"
                         style={{ background: 'radial-gradient(circle, #001BB7 0%, #001BB700 70%)' }} />
                </div>

                <div className="relative container mx-auto px-3 py-4 md:px-4 md:py-6 lg:px-8 lg:py-8 max-w-7xl">
                    
                    {/* Back Button */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-3 md:mb-4 lg:mb-6"
                    >
                        <Link to="/host">
                            <motion.button
                                whileHover={{ x: -4 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#FF8040] dark:hover:border-[#FF8040] transition-all text-sm md:text-base"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="font-medium">Back to Dashboard</span>
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Hero Banner Section - FIXED: No Overlapping, Proper Layout */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative overflow-hidden rounded-xl md:rounded-2xl lg:rounded-3xl mb-4 md:mb-6 lg:mb-8"
                    >
                        {/* Banner Image */}
                        <div className="relative h-[400px] sm:h-[450px] md:h-96 lg:h-[28rem] bg-gradient-to-br from-[#FF8040] via-[#0046FF] to-[#001BB7]">
                            {event.banner?.url ? (
                                <img
                                    src={event.banner.url}
                                    alt={event.title}
                                    className="w-full h-full object-cover object-center"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Calendar className="w-16 md:w-24 lg:w-32 h-16 md:h-24 lg:h-32 text-white/30" />
                                </div>
                            )}
                            
                            {/* Strong Gradient Overlay for better text visibility */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent" />
                            
                            {/* Event Type Badge - Top Right */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.3 }}
                                className="absolute top-3 right-3 md:top-4 md:right-4 lg:top-6 lg:right-6 z-20"
                            >
                                <div className={`px-3 py-1.5 md:px-4 md:py-2 lg:px-6 lg:py-2 rounded-full backdrop-blur-md bg-gradient-to-r ${getEventTypeColor(event.eventType)} shadow-lg`}>
                                    <span className="text-white font-bold text-[10px] md:text-xs lg:text-sm uppercase tracking-wider flex items-center gap-1.5 md:gap-2">
                                        <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4" />
                                        {event.eventType}
                                    </span>
                                </div>
                            </motion.div>

                            {/* Bottom Section - Logo, Title, Description in VERTICAL STACK */}
                            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 lg:p-6 z-10">
                                <div className="flex flex-col gap-3 md:gap-4">
                                    
                                    {/* Event Logo - Small and Separate */}
                                    {event.logo?.url && (
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.15, duration: 0.3 }}
                                            className="w-14 h-14 md:w-16 md:h-16 rounded-lg border-2 border-white/90 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 overflow-hidden shadow-2xl"
                                        >
                                            <img
                                                src={event.logo.url}
                                                alt="Event Logo"
                                                className="w-full h-full object-cover"
                                            />
                                        </motion.div>
                                    )}

                                    {/* Title - Below Logo */}
                                    <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.25, duration: 0.3 }}
                                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight drop-shadow-2xl"
                                    >
                                        {event.title}
                                    </motion.h1>

                                    {/* Description - Below Title */}
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3, duration: 0.3 }}
                                        className="text-white/95 text-sm md:text-base lg:text-lg max-w-3xl line-clamp-3 drop-shadow-lg font-medium leading-relaxed"
                                    >
                                        {event.description}
                                    </motion.p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                        
                        {/* Main Content - Left Column */}
                        <div className="lg:col-span-2 space-y-3 md:space-y-4 lg:space-y-6">
                            
                            {/* Quick Info Cards - Fully Responsive */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35, duration: 0.3 }}
                                className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4"
                            >
                                {/* Event Date */}
                                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg md:rounded-xl lg:rounded-2xl p-2.5 md:p-3 lg:p-4 border border-slate-200 dark:border-slate-700 text-center">
                                    <Calendar className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-[#FF8040] mx-auto mb-1 md:mb-1.5 lg:mb-2" />
                                    <p className="text-[9px] md:text-[10px] lg:text-xs text-slate-500 dark:text-slate-400 mb-0.5 md:mb-1">Event Date</p>
                                    <p className="text-[11px] md:text-xs lg:text-sm font-bold text-slate-900 dark:text-white">
                                        {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </p>
                                </div>

                                {/* Participation Type */}
                                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg md:rounded-xl lg:rounded-2xl p-2.5 md:p-3 lg:p-4 border border-slate-200 dark:border-slate-700 text-center">
                                    <Users className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-[#0046FF] mx-auto mb-1 md:mb-1.5 lg:mb-2" />
                                    <p className="text-[9px] md:text-[10px] lg:text-xs text-slate-500 dark:text-slate-400 mb-0.5 md:mb-1">Type</p>
                                    <p className="text-[11px] md:text-xs lg:text-sm font-bold text-slate-900 dark:text-white">{event.participationType}</p>
                                </div>

                                {/* Team Size */}
                                {event.participationType === "Team" && (
                                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg md:rounded-xl lg:rounded-2xl p-2.5 md:p-3 lg:p-4 border border-slate-200 dark:border-slate-700 text-center">
                                        <User className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-[#001BB7] mx-auto mb-1 md:mb-1.5 lg:mb-2" />
                                        <p className="text-[9px] md:text-[10px] lg:text-xs text-slate-500 dark:text-slate-400 mb-0.5 md:mb-1">Team Size</p>
                                        <p className="text-[11px] md:text-xs lg:text-sm font-bold text-slate-900 dark:text-white">{event.teamSize}</p>
                                    </div>
                                )}

                                {/* Deadline */}
                                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg md:rounded-xl lg:rounded-2xl p-2.5 md:p-3 lg:p-4 border border-slate-200 dark:border-slate-700 text-center">
                                    <Clock className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-red-600 dark:text-red-400 mx-auto mb-1 md:mb-1.5 lg:mb-2" />
                                    <p className="text-[9px] md:text-[10px] lg:text-xs text-slate-500 dark:text-slate-400 mb-0.5 md:mb-1">Deadline</p>
                                    <p className="text-[11px] md:text-xs lg:text-sm font-bold text-slate-900 dark:text-white">
                                        {new Date(event.registrationDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Rules Section - Responsive */}
                            {event.rules && event.rules.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.3 }}
                                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg md:rounded-xl lg:rounded-2xl p-3 md:p-4 lg:p-6 border border-slate-200 dark:border-slate-700"
                                >
                                    <div className="flex items-center gap-2 md:gap-2.5 lg:gap-3 mb-2.5 md:mb-3 lg:mb-4">
                                        <div className="p-1 md:p-1.5 lg:p-2 rounded-md md:rounded-lg bg-[#FF8040]/10 dark:bg-[#FF8040]/20">
                                            <FileText className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-[#FF8040]" />
                                        </div>
                                        <h2 className="text-base md:text-lg lg:text-xl font-bold text-slate-900 dark:text-white">Rules & Guidelines</h2>
                                    </div>
                                    <div className="space-y-1.5 md:space-y-2 lg:space-y-3">
                                        {event.rules.map((rule, index) => (
                                            <div
                                                key={index}
                                                className="flex items-start gap-2 md:gap-2.5 lg:gap-3 p-2 md:p-2.5 lg:p-3 rounded-md md:rounded-lg lg:rounded-xl bg-slate-50 dark:bg-slate-900/50"
                                            >
                                                <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-[#0046FF] flex-shrink-0 mt-0.5" />
                                                <p className="text-slate-700 dark:text-slate-300 text-[11px] md:text-xs lg:text-sm leading-relaxed">{rule}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Perks Section - Responsive */}
                            {event.perks && event.perks.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.45, duration: 0.3 }}
                                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg md:rounded-xl lg:rounded-2xl p-3 md:p-4 lg:p-6 border border-slate-200 dark:border-slate-700"
                                >
                                    <div className="flex items-center gap-2 md:gap-2.5 lg:gap-3 mb-2.5 md:mb-3 lg:mb-4">
                                        <div className="p-1 md:p-1.5 lg:p-2 rounded-md md:rounded-lg bg-green-100 dark:bg-green-900/30">
                                            <Gift className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <h2 className="text-base md:text-lg lg:text-xl font-bold text-slate-900 dark:text-white">Perks & Benefits</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-2 lg:gap-3">
                                        {event.perks.map((perk, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 md:gap-2.5 lg:gap-3 p-2 md:p-2.5 lg:p-3 rounded-md md:rounded-lg lg:rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                                            >
                                                <Zap className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                                                <p className="text-slate-700 dark:text-slate-300 text-[11px] md:text-xs lg:text-sm font-medium">{perk}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Legal Notice - Responsive */}
                            {event.legalNotice && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.3 }}
                                    className="bg-yellow-50 dark:bg-yellow-900/20 backdrop-blur-sm rounded-lg md:rounded-xl lg:rounded-2xl p-3 md:p-4 lg:p-6 border border-yellow-200 dark:border-yellow-800"
                                >
                                    <div className="flex items-start gap-2 md:gap-2.5 lg:gap-3">
                                        <Shield className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="text-[11px] md:text-xs lg:text-sm font-bold text-yellow-900 dark:text-yellow-100 mb-1 md:mb-1.5 lg:mb-2">Legal Notice</h3>
                                            <p className="text-yellow-800 dark:text-yellow-200 text-[10px] md:text-xs lg:text-sm leading-relaxed">{event.legalNotice}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Sidebar - Right Column - Fully Responsive */}
                        <div className="space-y-3 md:space-y-4 lg:space-y-6">
                            
                            {/* Registration Card */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.35, duration: 0.3 }}
                                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg md:rounded-xl lg:rounded-2xl p-3 md:p-4 lg:p-6 border border-slate-200 dark:border-slate-700 lg:sticky lg:top-24"
                            >
                                {/* Prizes */}
                                {event.prizes && (
                                    <div className="mb-3 md:mb-4 lg:mb-6 p-2.5 md:p-3 lg:p-4 rounded-lg md:rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800">
                                        <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-1.5 lg:mb-2">
                                            <Trophy className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-yellow-600 dark:text-yellow-400" />
                                            <h3 className="font-bold text-xs md:text-sm lg:text-base text-slate-900 dark:text-white">Prizes</h3>
                                        </div>
                                        <p className="text-lg md:text-xl lg:text-2xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent">
                                            {event.prizes}
                                        </p>
                                    </div>
                                )}

                                {/* Registration Status */}
                                {user?.role === "student" && (
                                    <div className="space-y-2.5 md:space-y-3 lg:space-y-4">
                                        {isAlreadyRegistered ? (
                                            <motion.div
                                                initial={{ scale: 0.9 }}
                                                animate={{ scale: 1 }}
                                                className="p-2.5 md:p-3 lg:p-4 rounded-lg md:rounded-xl bg-green-50 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-400"
                                            >
                                                <div className="flex items-center gap-2 md:gap-2.5 lg:gap-3">
                                                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                                                    <div>
                                                        <p className="font-bold text-xs md:text-sm lg:text-base text-green-900 dark:text-green-100">Already Registered</p>
                                                        <p className="text-[9px] md:text-[10px] lg:text-xs text-green-700 dark:text-green-300">You're all set for this event!</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : deadlinePassed ? (
                                            <motion.div
                                                initial={{ scale: 0.9 }}
                                                animate={{ scale: 1 }}
                                                className="p-2.5 md:p-3 lg:p-4 rounded-lg md:rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-500 dark:border-red-400"
                                            >
                                                <div className="flex items-center gap-2 md:gap-2.5 lg:gap-3">
                                                    <XCircle className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                                                    <div>
                                                        <p className="font-bold text-xs md:text-sm lg:text-base text-red-900 dark:text-red-100">Registration Closed</p>
                                                        <p className="text-[9px] md:text-[10px] lg:text-xs text-red-700 dark:text-red-300">Deadline has passed</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setShowForm(true)}
                                                className="w-full px-3 py-2.5 md:px-4 md:py-3 lg:px-6 lg:py-4 rounded-lg md:rounded-xl bg-gradient-to-r from-[#FF8040] to-[#0046FF] hover:from-[#FF8040]/90 hover:to-[#0046FF]/90 text-white font-bold shadow-lg shadow-[#FF8040]/30 hover:shadow-xl hover:shadow-[#FF8040]/50 transition-all duration-300 flex items-center justify-center gap-1.5 md:gap-2 text-xs md:text-sm lg:text-base"
                                            >
                                                <Target className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                                                <span>Register Now</span>
                                            </motion.button>
                                        )}
                                    </div>
                                )}

                                {/* Coordinators */}
                                {event.coordinators && event.coordinators.length > 0 && (
                                    <div className="mt-3 pt-3 md:mt-4 md:pt-4 lg:mt-6 lg:pt-6 border-t border-slate-200 dark:border-slate-700">
                                        <h3 className="font-bold text-xs md:text-sm lg:text-base text-slate-900 dark:text-white mb-2 md:mb-3 lg:mb-4 flex items-center gap-1.5 md:gap-2">
                                            <User className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4" />
                                            Event Coordinators
                                        </h3>
                                        <div className="space-y-1.5 md:space-y-2 lg:space-y-3">
                                            {event.coordinators.map((coordinator, index) => (
                                                <div
                                                    key={index}
                                                    className="p-2 md:p-2.5 lg:p-3 rounded-md md:rounded-lg lg:rounded-xl bg-slate-50 dark:bg-slate-900/50"
                                                >
                                                    <p className="font-semibold text-slate-900 dark:text-white text-[11px] md:text-xs lg:text-sm mb-0.5 md:mb-1">
                                                        {coordinator.name}
                                                    </p>
                                                    <a
                                                        href={`tel:${coordinator.contact}`}
                                                        className="flex items-center gap-1 md:gap-1.5 lg:gap-2 text-[9px] md:text-[10px] lg:text-xs text-[#0046FF] dark:text-[#FF8040] hover:underline"
                                                    >
                                                        <Phone className="w-2.5 h-2.5 md:w-3 md:h-3" />
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

            {/* Registration Form Modal - Responsive */}
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

// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import api from "../../services/api";

// const HostEventDetails = () => {
//     const { id } = useParams();
//     const [event, setEvent] = useState(null);

//     useEffect(() => {
//         if (!id) return; // 🛑 GUARD (VERY IMPORTANT)
//         api.get(`/api/events/${id}`)
//         .then(res => setEvent(res.data))
//         .catch(err => console.log(err));
//     }, [id]);

//     if(!id) {
//         return <p>Invalid event</p>;
//     }
//     if(!event) {
//         return <p>Loading...</p>;;
//     }

//     return (
//         <div>
//             <h2>{event.title}</h2>
//             <p>{event.description}</p>
//             <p>Rules: {event.rules.join(", ")}</p>
//             <p>Perks: {event.perks.join(", ")}</p>
//             <p>Prizes: {event.prizes}</p>
//             <p>Legal: {event.legalNotice}</p>
//             <p>Event Date: {event.eventDate?.slice(0, 10)}</p>
//             <p>Registration Deadline: {event.eventDate?.slice(0, 10)}</p>
//         </div>
//     );
// };


// export default HostEventDetails;