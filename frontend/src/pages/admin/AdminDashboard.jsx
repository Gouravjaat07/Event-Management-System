import { motion } from 'framer-motion';
import { useAuth } from "../../context/AuthContext";
import { LogOut, Shield, TrendingUp, Users, Calendar, Trash2 } from 'lucide-react';
import AdminEvents from "./AdminEvents";
import Navbar from "../../components/Navbar";
import { useState, useEffect } from "react";
import { getAllEventsAdmin } from "../../services/adminService";


const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [darkMode, setDarkMode] = useState(false);
    const [events, setEvents]     = useState([]);
    const [stats, setStats]       = useState({
        totalEvents: 0,
        totalRegistrations: 0,
        activeEvents: 0,
        adminActions: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getAllEventsAdmin();
                const now  = new Date();
                const totalEvents         = data.length;
                const totalRegistrations  = data.reduce((s, e) => s + (e.registrations?.length || 0), 0);
                const activeEvents        = data.filter(e => new Date(e.eventDate) >= now).length;
                setEvents(data);
                setStats({
                    totalEvents,
                    totalRegistrations,
                    activeEvents,
                    adminActions: parseInt(localStorage.getItem('adminDeleteCount') || '0')
                });
            } catch (err) {
                console.error("Failed to fetch stats:", err);
            }
        };
        fetchStats();
    }, []);

    const incrementAdminActions = () => {
        const newCount = stats.adminActions + 1;
        setStats(prev => ({ ...prev, adminActions: newCount }));
        localStorage.setItem('adminDeleteCount', newCount.toString());
    };

    const statCards = [
        { icon: Calendar,  label: 'Total Events',        value: stats.totalEvents,        iconBg: 'bg-[#0046FF]',   color: 'from-[#0046FF] to-[#001BB7]', description: 'All events in system' },
        { icon: Users,     label: 'Total Registrations', value: stats.totalRegistrations,  iconBg: 'bg-[#FF8040]',   color: 'from-[#FF8040] to-[#0046FF]', description: 'Across all events' },
        { icon: TrendingUp,label: 'Active Events',       value: stats.activeEvents,        iconBg: 'bg-green-500',   color: 'from-green-500 to-emerald-500', description: 'Upcoming & ongoing' },
        { icon: Trash2,    label: 'Admin Actions',       value: stats.adminActions,        iconBg: 'bg-red-500',     color: 'from-red-500 to-pink-500',     description: 'Events deleted' },
    ];

    return (
        <div className={darkMode ? 'dark' : ''}>
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

            <div className="min-h-screen bg-[#F5F1DC] dark:bg-slate-900 transition-colors duration-500">

                {/* Background blobs */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{ scale:[1,1.2,1], rotate:[0,90,0], opacity:[0.2,0.3,0.2] }}
                        transition={{ duration:20, repeat:Infinity }}
                        className="absolute -top-40 -right-40 w-72 md:w-96 h-72 md:h-96 rounded-full blur-3xl"
                        style={{ background:'radial-gradient(circle,#FF8040 0%,#FF804000 70%)' }}
                    />
                    <motion.div
                        animate={{ scale:[1,1.3,1], rotate:[0,-90,0], opacity:[0.2,0.3,0.2] }}
                        transition={{ duration:15, repeat:Infinity }}
                        className="absolute -bottom-40 -left-40 w-72 md:w-96 h-72 md:h-96 rounded-full blur-3xl"
                        style={{ background:'radial-gradient(circle,#0046FF 0%,#0046FF00 70%)' }}
                    />
                </div>

                <div className="relative container mx-auto px-3 py-4 md:px-4 md:py-6 lg:px-8 lg:py-8 max-w-7xl">

                    {/* ── Header ── */}
                    <motion.div
                        initial={{ opacity:0, y:-20 }}
                        animate={{ opacity:1, y:0 }}
                        transition={{ duration:0.5 }}
                        className="mb-4 md:mb-6 lg:mb-8"
                    >
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl md:rounded-2xl lg:rounded-3xl p-4 md:p-6 lg:p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">

                                <div className="flex items-center gap-3 md:gap-4">
                                    <motion.div
                                        whileHover={{ rotate:360 }}
                                        transition={{ duration:0.5 }}
                                        className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#FF8040] to-[#0046FF] shadow-lg"
                                    >
                                        <Shield className="w-5 h-5 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" />
                                    </motion.div>
                                    <div>
                                        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-[#FF8040] via-[#0046FF] to-[#001BB7] bg-clip-text text-transparent leading-tight mb-0.5 md:mb-2">
                                            Admin Dashboard
                                        </h1>
                                        <p className="text-xs md:text-sm lg:text-base text-gray-600 dark:text-gray-400">
                                            Welcome back, <span className="font-semibold text-[#FF8040]">{user.name}</span>
                                        </p>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale:1.05 }}
                                    whileTap={{ scale:0.95 }}
                                    onClick={logout}
                                    className="flex items-center gap-1.5 md:gap-2 px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all text-sm md:text-base"
                                >
                                    <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                                    Logout
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Stats grid ── */}
                    <motion.div
                        initial={{ opacity:0, y:20 }}
                        animate={{ opacity:1, y:0 }}
                        transition={{ delay:0.2 }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6 mb-4 md:mb-6 lg:mb-8"
                    >
                        {statCards.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity:0, scale:0.9 }}
                                animate={{ opacity:1, scale:1 }}
                                transition={{ delay:0.3 + index * 0.1 }}
                                whileHover={{ y:-4, scale:1.02 }}
                                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl md:rounded-2xl p-3 md:p-5 lg:p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-start justify-between mb-2 md:mb-3 lg:mb-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] md:text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400 mb-0.5 md:mb-1 truncate">
                                            {stat.label}
                                        </p>
                                        <p className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-0.5 md:mb-1">
                                            {stat.value}
                                        </p>
                                        <p className="text-[9px] md:text-xs text-gray-500 hidden sm:block">
                                            {stat.description}
                                        </p>
                                    </div>
                                    <div className={`flex-shrink-0 p-2 md:p-3 rounded-lg md:rounded-xl ${stat.iconBg} shadow-lg`}>
                                        <stat.icon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
                                    </div>
                                </div>
                                <div className={`h-0.5 md:h-1 rounded-full bg-gradient-to-r ${stat.color}`} />
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* ── Admin Events section ── */}
                    <motion.div
                        initial={{ opacity:0, y:20 }}
                        animate={{ opacity:1, y:0 }}
                        transition={{ delay:0.6 }}
                    >
                        <AdminEvents onDelete={incrementAdminActions} />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;



// // Origional Page
// import { useAuth } from "../../context/AuthContext";
// import AdminEvents from "./AdminEvents";
// // import AdminCertificates from "./AdminCertificates";

// const AdminDashboard = () => {
//     const { user, logout } = useAuth();

//     return (
//         <div>
//             <h2>Admin Dashboard</h2>
//             <p>Welcome, {user.name} </p>

//             <AdminEvents />

//             {/* <AdminCertificates /> */}
//             <button onClick={logout}>Logout</button>
//         </div>
//     );
// };

// export default AdminDashboard;