import { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { FileSpreadsheet, FileText, Users, Mail, IdCard, UsersRound, Loader2 } from 'lucide-react';
import { getEventRegistrationsAdmin } from "../../services/adminService";
import { exportToExcel } from "../../utils/exportExcel";
import { exportToPDF }   from "../../utils/exportPDF";


// ── Skeleton ──
const SkeletonReg = ({ index }) => (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: index * 0.05 }}
        className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 rounded-lg md:rounded-xl p-3 md:p-5 animate-pulse border border-gray-200 dark:border-gray-700"
    >
        <div className="space-y-2 md:space-y-3">
            <div className="h-4 md:h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            <div className="h-3 md:h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="h-3 md:h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        </div>
    </motion.div>
);

// ── Empty ──
const EmptyRegistrations = () => (
    <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
        className="flex flex-col items-center justify-center py-10 md:py-16 px-4"
    >
        <motion.div
            animate={{ rotate:[0,10,-10,10,0], scale:[1,1.1,1] }}
            transition={{ duration:2, repeat:Infinity, repeatDelay:3 }}
            className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#FF8040]/20 to-[#0046FF]/20 flex items-center justify-center mb-3 md:mb-6"
        >
            <Users className="w-7 h-7 md:w-10 md:h-10 text-[#0046FF]" />
        </motion.div>
        <h4 className="text-base md:text-xl font-bold text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2">No Registrations Yet</h4>
        <p className="text-xs md:text-sm text-gray-500 text-center max-w-md">
            This event hasn't received any registrations yet. Check back later!
        </p>
    </motion.div>
);

// ── Reusable detail cell ──
const DetailCell = ({ icon: Icon, label, value, iconGradient }) => (
    <motion.div className="flex items-start gap-2 md:gap-3" whileHover={{ x:4 }} transition={{ duration:0.2 }}>
        <div className={`p-2 md:p-2.5 rounded-lg bg-gradient-to-br ${iconGradient} flex-shrink-0`}>
            <Icon className="w-3 h-3 md:w-4 md:h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[9px] md:text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-0.5 md:mb-1 font-semibold">{label}</p>
            <p className="text-xs md:text-sm font-bold text-gray-900 dark:text-white truncate">{value}</p>
        </div>
    </motion.div>
);

// ── Main ──
const AdminRegistrations = ({ event }) => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading]             = useState(true);
    const [exporting, setExporting]         = useState(null);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                setLoading(true);
                const data = await getEventRegistrationsAdmin(event._id);
                setRegistrations(data);
            } catch (err) {
                console.error("Failed to fetch registrations", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRegistrations();
    }, [event._id]);

    const handleExport = async (type) => {
        try {
            setExporting(type);
            if (type === 'excel') await exportToExcel(registrations, event.title);
            else                  await exportToPDF(registrations, event.title);
        } catch {
            alert(`Failed to export ${type}.`);
        } finally {
            setExporting(null);
        }
    };

    return (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.3 }} className="space-y-4 md:space-y-6">

            {/* Header row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4 pb-3 md:pb-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                    <h4 className="text-base md:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-0.5 md:mb-1">
                        <div className="p-1.5 md:p-2 rounded-lg bg-gradient-to-br from-[#FF8040] to-[#0046FF]">
                            <Users className="w-3.5 h-3.5 md:w-5 md:h-5 text-white" />
                        </div>
                        Event Registrations
                    </h4>
                    {!loading && (
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 ml-1">
                            <span className="font-bold text-[#0046FF]">{registrations.length}</span>{' '}
                            {registrations.length === 1 ? 'participant' : 'participants'} registered
                        </p>
                    )}
                </div>

                {/* Export buttons */}
                {!loading && registrations.length > 0 && (
                    <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
                        <motion.button
                            whileHover={{ scale:1.05, y:-1 }}
                            whileTap={{ scale:0.95 }}
                            onClick={() => handleExport('excel')}
                            disabled={exporting === 'excel'}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-3 py-2 md:px-5 md:py-2.5 rounded-lg md:rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {exporting === 'excel'
                                ? <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" />
                                : <FileSpreadsheet className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                            <span className="hidden sm:inline">Export </span>Excel
                        </motion.button>

                        <motion.button
                            whileHover={{ scale:1.05, y:-1 }}
                            whileTap={{ scale:0.95 }}
                            onClick={() => handleExport('pdf')}
                            disabled={exporting === 'pdf'}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-3 py-2 md:px-5 md:py-2.5 rounded-lg md:rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {exporting === 'pdf'
                                ? <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" />
                                : <FileText className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                            <span className="hidden sm:inline">Export </span>PDF
                        </motion.button>
                    </div>
                )}
            </div>

            {/* Content */}
            {loading ? (
                <div className="space-y-2.5 md:space-y-4">
                    {[...Array(3)].map((_, i) => <SkeletonReg key={i} index={i} />)}
                </div>
            ) : registrations.length === 0 ? (
                <EmptyRegistrations />
            ) : (
                <motion.div layout className="space-y-2.5 md:space-y-4">
                    <AnimatePresence mode="popLayout">
                        {registrations.map((reg, index) => (
                            <motion.div
                                key={reg._id}
                                layout
                                initial={{ opacity:0, x:-20 }}
                                animate={{ opacity:1, x:0 }}
                                exit={{ opacity:0, scale:0.95 }}
                                transition={{ delay: index * 0.04, layout:{ duration:0.2 } }}
                                whileHover={{ scale:1.01, y:-2, boxShadow:"0 16px 20px -4px rgba(0,0,0,0.08)" }}
                                className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800/80 dark:to-gray-800/50 rounded-lg md:rounded-xl p-3 md:p-5 border-2 border-gray-200 dark:border-gray-700 hover:border-[#FF8040] dark:hover:border-[#FF8040] transition-all duration-300 shadow-md cursor-pointer group"
                            >
                                {/* 2-col on mobile, 4-col on lg */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
                                    <DetailCell icon={Users}      label="Name"       value={reg.userId?.name      || "N/A"} iconGradient="from-[#FF8040] to-[#FF8040]/80" />
                                    <DetailCell icon={Mail}       label="Email"      value={reg.userId?.email     || "N/A"} iconGradient="from-[#0046FF] to-[#0046FF]/80" />
                                    <DetailCell icon={IdCard}     label="College ID" value={reg.userId?.collegeId || "N/A"} iconGradient="from-[#001BB7] to-[#001BB7]/80" />
                                    <DetailCell icon={UsersRound} label="Team"       value={reg.teamName          || "Solo"} iconGradient="from-purple-500 to-purple-600"  />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </motion.div>
    );
};

export default AdminRegistrations;



// // Origional code
// import { useEffect, useState } from "react";
// import { getEventRegistrationsAdmin } from "../../services/adminService";
// import { exportToExcel } from "../../utils/exportExcel";
// import { exportToPDF } from "../../utils/exportPDF";

// const AdminRegistrations = ({ event }) => {
//   const [registrations, setRegistrations] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchRegistrations = async () => {
//       try {
//         const data = await getEventRegistrationsAdmin(event._id);
//         setRegistrations(data);
//       } catch (err) {
//         console.error("Failed to fetch registrations", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRegistrations();
//   }, [event._id]);

//   if (loading) return <p>Loading registrations...</p>;

//   return (
//     <div style={{ marginTop: 20 }}>
//       <h3>Registrations – {event.title}</h3>

//       {/* 🔽 EXPORT BUTTONS */}
//       {registrations.length > 0 && (
//         <div style={{ marginBottom: 10 }}>
//           <button
//             onClick={() => exportToExcel(registrations, event.title)}
//           >
//             Export Excel
//           </button>

//           <button
//             style={{ marginLeft: 10 }}
//             onClick={() => exportToPDF(registrations, event.title)}
//           >
//             Export PDF
//           </button>
//         </div>
//       )}

//       {/* 🔽 REGISTRATION LIST */}
//       {registrations.length === 0 ? (
//         <p>No registrations found</p>
//       ) : (
//         registrations.map((r) => (
//           <div
//             key={r._id}
//             style={{
//               border: "1px dashed #aaa",
//               margin: "6px 0",
//               padding: "6px",
//             }}
//           >
//             <p><b>Name:</b> {r.userId.name}</p>
//             <p><b>Email:</b> {r.userId.email}</p>
//             <p><b>College ID:</b> {r.userId.collegeId}</p>
//             <p><b>Team:</b> {r.teamName || "Solo"}</p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default AdminRegistrations;


// // import { useEffect, useState } from "react";
// // import { getEventRegistrationsAdmin } from "../../services/adminService";

// // const AdminRegistrations = ({ event }) => {
// //   const [registrations, setRegistrations] = useState([]);

// //   useEffect(() => {
// //     const fetch = async () => {
// //       const data = await getEventRegistrationsAdmin(event._id);
// //       setRegistrations(data);
// //     };
// //     fetch();
// //   }, [event._id]);

// //   return (
// //     <div>
// //       <h3>Registrations – {event.title}</h3>

// //       {registrations.map((r) => (
// //         <div key={r._id} style={{ border: "1px dashed #aaa", margin: 6 }}>
// //           <p>Name: {r.userId.name}</p>
// //           <p>Email: {r.userId.email}</p>
// //           <p>Team: {r.teamName || "Solo"}</p>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // export default AdminRegistrations;