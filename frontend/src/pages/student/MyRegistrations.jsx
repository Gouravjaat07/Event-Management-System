import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

import {
    getMyRegistrations,
    updateRegistration,
    deleteRegistration,
} from "../../services/registrationService";
import RegistrationForm from "./RegistrationForm";
import {
    Calendar,
    Clock,
    Edit3,
    Trash2,
    XCircle,
    CheckCircle2,
    AlertCircle,
    User,
    Users,
    Mail,
    Phone,
    Building2,
    BookOpen,
    Tag,
} from "lucide-react";
import toast from "react-hot-toast";

/* ─── tiny reusable info tile ─── */
const InfoTile = ({ icon: Icon, label, value, iconColor, bgClass, borderClass }) => (
    <div className={`p-2.5 md:p-3 lg:p-4 rounded-lg md:rounded-xl ${bgClass} border ${borderClass}`}>
        <div className="flex items-center gap-1.5 mb-1 md:mb-1.5">
            <Icon className={`w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 flex-shrink-0 ${iconColor}`} />
            <span className={`text-[9px] md:text-[10px] lg:text-xs font-semibold ${iconColor} uppercase tracking-wide`}>
                {label}
            </span>
        </div>
        <p className="text-[11px] md:text-xs lg:text-sm font-bold text-gray-900 dark:text-white break-words leading-snug">
            {value}
        </p>
    </div>
);

/* ─── responsive edit modal ─── */
const EditModal = ({ reg, onSubmit, onClose }) => {
    return (
        <AnimatePresence>
            {reg && (
                <motion.div
                    key="backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col"
                    onClick={onClose}
                >
                    {/* ── Mobile: slides up from bottom ── */}
                    <motion.div
                        key="sheet-mobile"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                        onClick={e => e.stopPropagation()}
                        className="md:hidden mt-auto w-full bg-white dark:bg-gray-900 rounded-t-2xl overflow-hidden shadow-2xl"
                        style={{ maxHeight: '93dvh' }}
                    >
                        {/* drag handle */}
                        <div className="flex justify-center pt-2.5 pb-1">
                            <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                        </div>
                        <RegistrationForm
                            event={reg.eventId}
                            initialData={reg}
                            onSubmit={onSubmit}
                            onClose={onClose}
                        />
                    </motion.div>

                    {/* ── Desktop: centered modal ── */}
                    <div className="hidden md:flex flex-1 items-center justify-center p-4">
                        <motion.div
                            key="modal-desktop"
                            initial={{ scale: 0.92, opacity: 0, y: 16 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.92, opacity: 0, y: 16 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
                            onClick={e => e.stopPropagation()}
                            className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
                            style={{ maxHeight: '90dvh' }}
                        >
                            <RegistrationForm
                                event={reg.eventId}
                                initialData={reg}
                                onSubmit={onSubmit}
                                onClose={onClose}
                            />
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
const MyRegistrations = ({ onRegistrationChange }) => {
    const [darkMode, setDarkMode] = useState(false);
    const { user }  = useAuth();
    const [regs, setRegs]       = useState([]);
    const [editing, setEditing] = useState(null);   // the full reg object being edited
    const [loading, setLoading] = useState(true);

    const fetchRegs = async () => {
        try {
            const data = await getMyRegistrations(user.id);
            setRegs(data);
        } catch {
            toast.error("Failed to load registrations");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        if (user?.id) fetchRegs();
    }, [user?.id]);

    const handleUpdate = async (data) => {
        try {
            await updateRegistration(editing._id, data);
            setEditing(null);
            fetchRegs();
            toast.success("Registration updated! ✅");
        } catch {
            toast.error("Failed to update registration");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this registration?")) return;
        try {
            await deleteRegistration(id);
            fetchRegs();
            toast.success("Registration deleted");

            if (onRegistrationChange) {
                onRegistrationChange();   // 👈 refresh dashboard stats
            }
        } catch {
            toast.error("Failed to delete registration");
        }
    };

    /* ── loading ── */
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 md:w-12 md:h-12 border-[3px] md:border-4 border-[#FF8040] border-t-transparent rounded-full"
                />
            </div>
        );
    }

    /* ── empty ── */
    if (regs.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl md:rounded-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700 text-center"
            >
                <motion.div
                    animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    className="w-14 h-14 md:w-20 md:h-20 mx-auto rounded-full bg-gradient-to-br from-[#FF8040]/20 to-[#0046FF]/20 flex items-center justify-center mb-4 md:mb-6"
                >
                    <Calendar className="w-7 h-7 md:w-10 md:h-10 text-[#FF8040]" />
                </motion.div>
                <h3 className="text-base md:text-xl font-bold text-gray-900 dark:text-white mb-1.5 md:mb-2">
                    No Registrations Yet
                </h3>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4 md:mb-6">
                    You haven't registered for any events. Start exploring!
                </p>
                <a href="/">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-5 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-[#FF8040] to-[#0046FF] text-white rounded-lg md:rounded-xl font-semibold shadow-lg text-sm md:text-base"
                    >
                        Browse Events
                    </motion.button>
                </a>
            </motion.div>
        );
    }

    return (
        <>
            {/* ── registration cards ── */}
            <div className="space-y-3 md:space-y-5 lg:space-y-6">
                {regs.map((r, index) => {
                    if (!r.eventId) return null;
                    const deadlinePassed = new Date() > new Date(r.eventId.registrationDeadline);
                    const isTeam        = r.eventId.participationType === "Team";

                    return (
                        <motion.div
                            key={r._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 }}
                            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            {/* ── event banner header ── */}
                            <div className="relative px-4 py-3.5 md:px-5 md:py-4 lg:px-6 lg:py-5 bg-gradient-to-r from-[#FF8040] via-[#0046FF] to-[#001BB7]">
                                <motion.div
                                    animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                                    transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                                    className="absolute inset-0 opacity-20 pointer-events-none"
                                    style={{ backgroundImage: 'radial-gradient(circle,white 1px,transparent 1px)', backgroundSize: '20px 20px' }}
                                />
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="text-sm md:text-lg lg:text-xl font-black text-white leading-tight">
                                            {r.eventId.title}
                                        </h3>
                                        {deadlinePassed ? (
                                            <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-red-500/25 border border-red-300/30 text-[9px] md:text-[10px] font-bold text-white">
                                                <XCircle className="w-2.5 h-2.5 md:w-3 md:h-3" /> Closed
                                            </span>
                                        ) : (
                                            <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-green-500/25 border border-green-300/30 text-[9px] md:text-[10px] font-bold text-white">
                                                <CheckCircle2 className="w-2.5 h-2.5 md:w-3 md:h-3" /> Active
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-white/85 text-[10px] md:text-xs lg:text-sm">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                            {new Date(r.eventId.eventDate).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                            Deadline: {new Date(r.eventId.registrationDeadline).toLocaleDateString('en-US', { month:'short', day:'numeric' })}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Tag className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                            {r.eventId.eventType}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* ── detail tiles ── */}
                            <div className="p-3 md:p-4 lg:p-6">
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-2.5 lg:gap-3 mb-3 md:mb-4">
                                    {isTeam ? (
                                        <>
                                            <InfoTile icon={Users}    label="Team Name" value={r.teamName}
                                                iconColor="text-[#FF8040]" bgClass="bg-[#FF8040]/10 dark:bg-[#FF8040]/20" borderClass="border-[#FF8040]/25" />
                                            <InfoTile icon={User}     label="Members"   value={r.teamMembers?.join(", ") || "N/A"}
                                                iconColor="text-[#0046FF]" bgClass="bg-[#0046FF]/10 dark:bg-[#0046FF]/20" borderClass="border-[#0046FF]/25" />
                                        </>
                                    ) : (
                                        <>
                                            <InfoTile icon={User}     label="Name"       value={r.name}
                                                iconColor="text-[#FF8040]" bgClass="bg-[#FF8040]/10 dark:bg-[#FF8040]/20" borderClass="border-[#FF8040]/25" />
                                            <InfoTile icon={Tag}      label="College ID" value={r.collegeId || "N/A"}
                                                iconColor="text-[#0046FF]" bgClass="bg-[#0046FF]/10 dark:bg-[#0046FF]/20" borderClass="border-[#0046FF]/25" />
                                        </>
                                    )}
                                    <InfoTile icon={Mail}      label="Email"         value={r.email}
                                        iconColor="text-green-600 dark:text-green-400" bgClass="bg-green-50 dark:bg-green-900/20" borderClass="border-green-200 dark:border-green-800" />
                                    <InfoTile icon={Phone}     label="Contact"       value={r.contact}
                                        iconColor="text-orange-600 dark:text-orange-400" bgClass="bg-orange-50 dark:bg-orange-900/20" borderClass="border-orange-200 dark:border-orange-800" />
                                    <InfoTile icon={Building2} label="College"       value={r.collegeName}
                                        iconColor="text-[#001BB7]" bgClass="bg-[#001BB7]/10 dark:bg-[#001BB7]/20" borderClass="border-[#001BB7]/25" />
                                    <InfoTile icon={BookOpen}  label="Course & Year" value={`${r.course} — ${r.year}`}
                                        iconColor="text-violet-600 dark:text-violet-400" bgClass="bg-violet-50 dark:bg-violet-900/20" borderClass="border-violet-200 dark:border-violet-800" />
                                </div>

                                {/* ── action buttons ── */}
                                {!deadlinePassed ? (
                                    <div className="flex gap-2 md:gap-3 pt-3 md:pt-4 border-t border-gray-200 dark:border-gray-700">
                                        {/* Edit button */}
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => setEditing(r)}
                                            className="flex-1 flex items-center justify-center gap-1.5 md:gap-2 py-2 md:py-2.5 lg:py-3 rounded-lg md:rounded-xl bg-[#0046FF] hover:bg-[#0046FF]/90 text-white font-semibold text-xs md:text-sm lg:text-base transition-all shadow-md shadow-[#0046FF]/20 hover:shadow-lg"
                                        >
                                            <Edit3 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                            <span>Edit</span>
                                        </motion.button>

                                        {/* Delete button */}
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => handleDelete(r._id)}
                                            className="flex-1 flex items-center justify-center gap-1.5 md:gap-2 py-2 md:py-2.5 lg:py-3 rounded-lg md:rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs md:text-sm lg:text-base transition-all shadow-md shadow-red-600/20 hover:shadow-lg"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                            <span>Delete</span>
                                        </motion.button>
                                    </div>
                                ) : (
                                    <div className="pt-3 md:pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-start gap-2 md:gap-3 p-2.5 md:p-3 lg:p-4 rounded-lg md:rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                            <AlertCircle className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                            <p className="text-[10px] md:text-xs lg:text-sm font-semibold text-red-900 dark:text-red-100">
                                                Registration period has ended. Modifications are not allowed.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* ── Edit modal (bottom-sheet on mobile, centered on desktop) ── */}
            <EditModal
                reg={editing}
                onSubmit={handleUpdate}
                onClose={() => setEditing(null)}
            />
        </>
    );
};

export default MyRegistrations;





// import { useEffect, useState } from "react";
// import { useAuth } from "../../context/AuthContext";
// import {
//     getMyRegistrations,
//     updateRegistration,
//     deleteRegistration,
// } from "../../services/registrationService";
// import RegistrationForm from "./RegistrationForm";

// const MyRegistrations = () => {
//     const { user } = useAuth();
//     const [regs, setRegs] = useState([]);
//     const [editing, setEditing] = useState(null);

//     const fetchRegs = async () => {
//         const data = await getMyRegistrations(user.id);
//         setRegs(data);
//     };

//     useEffect(() => {
//         if (user?.id) fetchRegs();
//     }, [user.id]);

//     const handleUpdate = async (id, data) => {
//         await updateRegistration(id, data);
//         setEditing(null);
//         fetchRegs(); // ✅ refresh list
//     };

//     const handleDelete = async (id) => {
//         if (window.confirm("Delete this registration?")) {
//             await deleteRegistration(id);
//             fetchRegs(); // ✅ refresh list
//         }
//     };

//     return (
//         <div>
//             <h3>My Registrations</h3>

//             {regs.length === 0 && <p>No registrations found</p>}

//             {regs.map((r) => {
//                 if (!r.eventId) return null;

//                 const deadlinePassed =
//                     new Date() > new Date(r.eventId.registrationDeadline);

//                 return (
//                     <div
//                         key={r._id}
//                         style={{
//                             border: "1px solid #ccc",
//                             padding: 10,
//                             marginBottom: 12,
//                         }}
//                     >
//                         {/* ✅ Event Details */}
//                         <p><b>Event:</b> {r.eventId.title}</p>
//                         <p>
//                             <b>Event Date:</b>{" "}
//                             {new Date(r.eventId.eventDate).toDateString()}
//                         </p>
//                         <p>
//                             <b>Registration Deadline:</b>{" "}
//                             {new Date(
//                                 r.eventId.registrationDeadline
//                             ).toDateString()}
//                         </p>

//                         {/* ✅ Buttons only before deadline */}
//                         {!deadlinePassed && (
//                             <>
//                                 <button onClick={() => setEditing(r)}>
//                                     Edit
//                                 </button>

//                                 <button
//                                     style={{ marginLeft: 10 }}
//                                     onClick={() => handleDelete(r._id)}
//                                 >
//                                     Delete
//                                 </button>
//                             </>
//                         )}

//                         {/* ✅ Edit Form */}
//                         {editing?._id === r._id && (
//                             <RegistrationForm
//                                 event={r.eventId}
//                                 initialData={r}
//                                 onSubmit={(data) =>
//                                     handleUpdate(r._id, data)
//                                 }
//                             />
//                         )}

//                         {/* ❌ After deadline */}
//                         {deadlinePassed && (
//                             <p style={{ color: "red" }}>
//                                 Registration closed
//                             </p>
//                         )}
//                     </div>
//                 );
//             })}
//         </div>
//     );
// };

// export default MyRegistrations;


// import { useEffect, useState } from "react";
// import { useAuth } from "../../context/AuthContext";
// // import { getCertificate } from "../../services/certificateService";
// // import MyRegistrations from "./MyRegistrations";
// import {
//     getMyRegistrations,
//     updateRegistration,
//     deleteRegistration,
// } from "../../services/registrationService";
// import RegistrationForm from "./RegistrationForm";

// const MyRegistrations = () => {
//     const { user } = useAuth();
//     const [regs, setRegs] = useState([]);
//     const [editing, setEditing] = useState(null);

//     const fetchRegs = async () => {
//         const data = await getMyRegistrations(user.id);
//         setRegs(data);
//     };


//     useEffect(() => {
//         if (user?.id) fetchRegs();
//     }, [user.id]);

//     const handleUpdate = async (id, data) => {
//         await updateRegistration(id, data);
//         setEditing(null);
//         fetchRegs(); // ✅ refresh
//     };

//     const handleDelete = async (id) => {
//         if (confirm("Delete this registration?")) {
//             await deleteRegistration(id);
//             fetchRegs(); // ✅ refresh
//         }
//     };

//     return (
//         <div>
//             <h3>My Registrations</h3>

//             {regs.length === 0 && <p>No registrations found</p>}

//             {regs.map(r => {
//                 if (!r.eventId) return null;

//                 const deadlinePassed =
//                     new Date() > new Date(r.eventId.registrationDeadline);

//                 return (
//                     <div key={r._id} style={{ border: "1px solid #ccc", margin: 10 }}>
//                         <p><b>{r.eventId.title}</b></p>

//                         {!deadlinePassed && (
//                             <>
//                                 <button onClick={() => setEditing(r)}>
//                                     Edit
//                                 </button>

//                                 <button onClick={() => handleDelete(r._id)}>
//                                     Delete
//                                 </button>
//                             </>
//                         )}

//                         {editing?._id === r._id && (
//                             <RegistrationForm
//                                 event={r.eventId}
//                                 initialData={r}
//                                 onSubmit={(data) => handleUpdate(r._id, data)}
//                             />
//                         )}

//                         {deadlinePassed && (
//                             <p style={{ color: "red" }}>
//                                 Registration closed
//                             </p>
//                         )}
//                     </div>
//                 );
//             })}
//         </div>
//     );
// };

// export default MyRegistrations;



// // import { useEffect, useState } from "react";
// // import { useAuth } from "../../context/AuthContext";
// // import {
// //     getMyRegistrations,
// //     updateRegistration,
// //     deleteRegistration,
// // } from "../../services/registrationService";
// // import RegistrationForm from "./RegistrationForm";
// // import { data } from "react-router-dom";

// // const MyRegistrations = () => {
// //     const {user} = useAuth();
// //     const [regs, setRegs] = useState([]);
// //     const [editing, setEditing] = useState(null);

// //     useEffect(() => {
// //         getMyRegistrations(user.id)
// //         .then(res => setRegs(res.data));
// //     }, [user.id]);

// //     return (
// //         <div>
// //             <h2>My Registrations</h2>

// //             {regs.map(r => {
// //                 const deadlinePassed = new Date() > new Date(r.eventId.registrationDeadline);

// //                 return (
// //                     <div key={r._id}>
// //                          <p>{r.eventId.title}</p>

// //                          {!deadlinePassed && (
// //                             <>
// //                                 <button onClick={() => setEditing(r)}>
// //                                     Edit
// //                                 </button>

// //                                 <button onClick={() => deleteRegistration(r._id)}>
// //                                     Delete
// //                                 </button>
// //                             </>
// //                          )}

// //                          {editing?._id === r._id && (
// //                             <RegistrationForm 
// //                                 event={r.eventId}
// //                                 initialData={r}
// //                                 onSubmit={(data) => 
// //                                 updateRegistration(r._id, data)
// //                                 }
// //                             />
// //                          )}
// //                     </div>
// //                 );
// //             })}
// //         </div>
// //     );
// // };

// // export default MyRegistrations;