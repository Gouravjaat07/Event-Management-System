import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { 
  User, 
  Calendar, 
  Award, 
  TrendingUp, 
  Activity,
  Clock,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import MyRegistrations from "./MyRegistrations";
import Navbar from "../../components/Navbar";
import { getMyRegistrations } from "../../services/registrationService";
import { getAllEvents } from "../../services/eventService";

const StudentDashboard = () => {
    const { user } = useAuth();
    const [darkMode, setDarkMode] = useState(false);
    const [stats, setStats] = useState({
        totalEvents: 0,
        registered: 0,
        upcoming: 0,
        certificates: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        if (!user?.id) return;

        try {
            const [registrations, allEvents] = await Promise.all([
                getMyRegistrations(user.id),
                getAllEvents()
            ]);

            const registeredCount = registrations.length;

            const upcomingCount = registrations.filter(reg => {
                if (!reg.eventId?.eventDate) return false;
                return new Date(reg.eventId.eventDate) > new Date();
            }).length;

            setStats({
                totalEvents: allEvents.length,
                registered: registeredCount,
                upcoming: upcomingCount,
                certificates: 0
            });
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [user?.id]);


    const statsConfig = [
        {
            label: "Total Events",
            value: stats.totalEvents,
            icon: Calendar,
            color: "from-[#FF8040] to-[#FF8040]/80",
            bgColor: "bg-[#FF8040]/10 dark:bg-[#FF8040]/20",
            iconColor: "text-[#FF8040]"
        },
        {
            label: "Registered",
            value: stats.registered,
            icon: CheckCircle2,
            color: "from-green-500 to-teal-500",
            bgColor: "bg-green-100 dark:bg-green-900/30",
            iconColor: "text-green-600 dark:text-green-400"
        },
        {
            label: "Upcoming",
            value: stats.upcoming,
            icon: Clock,
            color: "from-[#0046FF] to-[#001BB7]",
            bgColor: "bg-[#0046FF]/10 dark:bg-[#0046FF]/20",
            iconColor: "text-[#0046FF]"
        },
        {
            label: "Certificates",
            value: stats.certificates,
            icon: Award,
            color: "from-[#001BB7] to-[#FF8040]",
            bgColor: "bg-[#001BB7]/10 dark:bg-[#001BB7]/20",
            iconColor: "text-[#001BB7]"
        }
    ];

    const StatsSkeleton = () => (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6 mb-4 md:mb-6 lg:mb-8">
            {[1, 2, 3, 4].map((i) => (
                <div
                    key={i}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl md:rounded-2xl p-3 md:p-5 lg:p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
                >
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    </div>
                    <div className="w-10 h-6 md:w-16 md:h-8 rounded bg-gray-200 dark:bg-gray-700 animate-pulse mb-1.5 md:mb-2" />
                    <div className="w-16 h-3 md:w-24 md:h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </div>
            ))}
        </div>
    );

    return (
        <div className={darkMode ? 'dark' : ''}>
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

            <div className="min-h-screen bg-[#F5F1DC] dark:bg-slate-900 transition-colors duration-500">

                {/* Background Blobs */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.2, 0.3, 0.2] }}
                        transition={{ duration: 20, repeat: Infinity }}
                        className="absolute -top-40 -right-40 w-72 md:w-96 h-72 md:h-96 rounded-full blur-3xl"
                        style={{ background: 'radial-gradient(circle, #FF8040 0%, #FF804000 70%)' }}
                    />
                    <motion.div
                        animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0], opacity: [0.2, 0.3, 0.2] }}
                        transition={{ duration: 15, repeat: Infinity }}
                        className="absolute -bottom-40 -left-40 w-72 md:w-96 h-72 md:h-96 rounded-full blur-3xl"
                        style={{ background: 'radial-gradient(circle, #0046FF 0%, #0046FF00 70%)' }}
                    />
                </div>

                <div className="relative container mx-auto px-3 py-4 md:px-4 md:py-6 lg:px-8 lg:py-8 max-w-7xl">

                    {/* Welcome Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-4 md:mb-6 lg:mb-8"
                    >
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl md:rounded-2xl lg:rounded-3xl p-4 md:p-6 lg:p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
                            <div className="flex items-center gap-3 md:gap-5 lg:gap-6">

                                {/* Avatar */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                    whileHover={{ scale: 1.05, rotate: 360 }}
                                    className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-[#FF8040] to-[#0046FF] flex items-center justify-center text-white font-bold text-lg md:text-xl lg:text-2xl shadow-lg relative overflow-hidden flex-shrink-0"
                                >
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 rounded-full border-2 border-white/30 border-t-white/80"
                                    />
                                    <span className="relative z-10">
                                        {user?.name?.charAt(0).toUpperCase() || 'S'}
                                    </span>
                                </motion.div>

                                {/* Welcome Text */}
                                <div className="flex-1 min-w-0">
                                    <motion.h1
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black bg-gradient-to-r from-[#FF8040] via-[#0046FF] to-[#001BB7] bg-clip-text text-transparent mb-1 leading-tight truncate"
                                    >
                                        Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
                                    </motion.h1>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-xs md:text-sm lg:text-base text-gray-600 dark:text-gray-400"
                                    >
                                        Here's your event dashboard overview
                                    </motion.p>
                                </div>

                                {/* Role Badge - hidden on very small screens */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5, type: "spring" }}
                                    className="hidden sm:block px-3 py-2 md:px-4 md:py-2.5 lg:px-6 lg:py-3 rounded-xl md:rounded-2xl bg-gradient-to-r from-[#FF8040] to-[#0046FF] text-white shadow-lg flex-shrink-0"
                                >
                                    <div className="flex items-center gap-1.5 md:gap-2">
                                        <User className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                                        <div>
                                            <p className="text-[9px] md:text-[10px] lg:text-xs opacity-80">Role</p>
                                            <p className="font-bold text-[11px] md:text-xs lg:text-sm">Student</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    {loading ? (
                        <StatsSkeleton />
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6 mb-4 md:mb-6 lg:mb-8"
                        >
                            {statsConfig.map((stat, index) => {
                                const IconComponent = stat.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                        whileHover={{ y: -4, scale: 1.02 }}
                                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl md:rounded-2xl p-3 md:p-5 lg:p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="flex items-center justify-between mb-2 md:mb-3 lg:mb-4">
                                            <div className={`p-2 md:p-2.5 lg:p-3 rounded-lg md:rounded-xl ${stat.bgColor}`}>
                                                <IconComponent className={`w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 ${stat.iconColor}`} />
                                            </div>
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                            >
                                                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                                            </motion.div>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl lg:text-3xl font-black text-gray-900 dark:text-white mb-0.5 md:mb-1">
                                            {stat.value || "N/A"}
                                        </h3>
                                        <p className="text-[10px] md:text-xs lg:text-sm text-gray-600 dark:text-gray-400 font-medium">
                                            {stat.label}
                                        </p>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}

                    {/* My Registrations Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-5 lg:mb-6">
                            <div className="p-1.5 md:p-2 rounded-lg bg-[#FF8040]/10 dark:bg-[#FF8040]/20">
                                <Activity className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-[#FF8040]" />
                            </div>
                            <h2 className="text-lg md:text-xl lg:text-2xl font-black text-gray-900 dark:text-white">
                                My Registrations
                            </h2>
                        </div>
                        <MyRegistrations onRegistrationChange={fetchStats} />
                    </motion.div>

                    {/* Footer Note */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-6 md:mt-8 flex items-center justify-center gap-1.5 md:gap-2 text-xs md:text-sm text-gray-500 dark:text-gray-400"
                    >
                        <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                        <span>Keep exploring and learning new things!</span>
                        <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;


// import { useAuth } from "../../context/AuthContext";
// import MyRegistrations from "./MyRegistrations";

// const StudentDashboard = () => {
//     const { user, logout } = useAuth();

//     return (
//         <div>
//             <h2>Student Dashboard</h2>
//             <p>Welcome, {user.name}</p>

//             {/* ✅ Single source of truth */}
//             <MyRegistrations />

//             <br />
//             <button onClick={logout}>Logout</button>
//         </div>
//     );
// };

// export default StudentDashboard;

