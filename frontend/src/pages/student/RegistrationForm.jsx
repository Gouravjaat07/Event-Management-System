import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
    X,
    User,
    Users,
    Mail,
    Phone,
    GraduationCap,
    Building2,
    BookOpen,
    IdCard,
    CheckCircle2,
    Sparkles
} from "lucide-react";

const RegistrationForm = ({ event, onSubmit, onClose, initialData }) => {
    const [darkMode, setDarkMode] = useState(false);
    const [collegeName, setCollegeName]   = useState(initialData?.collegeName || "");
    const [course, setCourse]             = useState(initialData?.course || "");
    const [year, setYear]                 = useState(initialData?.year || "");
    const [teamName, setTeamName]         = useState(initialData?.teamName || "");
    const [teamMembers, setTeamMembers]   = useState(initialData?.teamMembers?.join(",") || "");
    const [name, setName]                 = useState(initialData?.name || "");
    const [collegeId, setCollegeId]       = useState(initialData?.collegeId || "");
    const [email, setEmail]               = useState(initialData?.email || "");
    const [contact, setContact]           = useState(initialData?.contact || "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const payload = { collegeName, course, year, contact, email };

        if (event.participationType === "Team") {
            const membersArray = teamMembers.split(",").map(m => m.trim()).filter(m => m);
            if (membersArray.length > event.teamSize) {
                toast.error(`Maximum team size is ${event.teamSize} members`);
                setIsSubmitting(false);
                return;
            }
            payload.teamName    = teamName;
            payload.teamMembers = membersArray;
        } else {
            payload.name      = name;
            payload.collegeId = collegeId;
        }

        try {
            await onSubmit(payload);
            onClose();
        } catch (err) {
            // handled by parent
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (initialData) {
            setCollegeName(initialData.collegeName || "");
            setCourse(initialData.course || "");
            setYear(initialData.year || "");
            setTeamName(initialData.teamName || "");
            setTeamMembers(initialData.teamMembers?.join(",") || "");
            setName(initialData.name || "");
            setCollegeId(initialData.collegeId || "");
            setEmail(initialData.email || "");
            setContact(initialData.contact || "");
        }
    }, [initialData]);


    /* ─── shared style atoms ─── */
    const iconSlot   = "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none";
    const baseInput  = "w-full pl-9 pr-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/80 border-2 border-gray-200 dark:border-gray-600 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm font-medium";
    const fOrange    = "focus:border-[#FF8040] focus:ring-2 focus:ring-[#FF8040]/15";
    const fBlue      = "focus:border-[#0046FF] focus:ring-2 focus:ring-[#0046FF]/15";
    const fNavy      = "focus:border-[#001BB7] focus:ring-2 focus:ring-[#001BB7]/15";
    const labelClass = "block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5";

    return (
        /* flex-col so header + scroll-body + sticky-footer stack correctly */
        <div className="relative flex flex-col" style={{ maxHeight: '92dvh' }}>

            {/* ══ HEADER ══ */}
            <div className="relative flex-shrink-0 px-4 py-3.5 md:px-6 md:py-5 bg-gradient-to-br from-[#FF8040] via-[#0046FF] to-[#001BB7]">
                <motion.div
                    animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                    transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle,white 1px,transparent 1px)', backgroundSize: '18px 18px' }}
                />
                <div className="relative z-10 flex items-center justify-between gap-3">
                    {/* left: icon + title */}
                    <div className="flex items-center gap-2.5 min-w-0">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="flex-shrink-0 p-1.5 md:p-2 rounded-lg bg-white/20 backdrop-blur-sm"
                        >
                            {event.participationType === "Team"
                                ? <Users className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                : <User  className="w-4 h-4 md:w-5 md:h-5 text-white" />
                            }
                        </motion.div>
                        <div className="min-w-0">
                            <h2 className="text-sm md:text-xl font-black text-white leading-tight truncate">
                                {initialData ? "Edit Registration" : `Register — ${event.title}`}
                            </h2>
                            <p className="text-white/80 text-[10px] md:text-xs mt-0.5">
                                {event.participationType === "Team"
                                    ? `Team • Max ${event.teamSize} members`
                                    : "Individual Registration"}
                            </p>
                        </div>
                    </div>
                    {/* close */}
                    <motion.button
                        type="button"
                        onClick={onClose}
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex-shrink-0 p-1.5 md:p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all"
                    >
                        <X className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </motion.button>
                </div>
            </div>

            {/* ══ SCROLLABLE BODY ══ */}
            <div
                className="flex-1 overflow-y-auto px-3 md:px-5 lg:px-6 py-3 md:py-4 space-y-3 md:space-y-4 bg-white dark:bg-gray-900"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#FF8040 transparent' }}
            >
                {/* ── Team-only fields ── */}
                {event.participationType === "Team" && (
                    <>
                        {/* Team Name */}
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
                            <label className={labelClass}>Team Name <span className="text-red-500">*</span></label>
                            <div className="relative group">
                                <div className={iconSlot}><Users className="w-4 h-4 text-gray-400 group-focus-within:text-[#FF8040] transition-colors" /></div>
                                <input type="text" placeholder="Enter your team name" value={teamName}
                                    onChange={e => setTeamName(e.target.value)} required
                                    className={`${baseInput} ${fOrange}`} />
                            </div>
                        </motion.div>

                        {/* Team Members */}
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
                            <label className={labelClass}>Team Members <span className="text-red-500">*</span></label>
                            <div className="relative group">
                                <div className="absolute top-2.5 left-3 pointer-events-none">
                                    <User className="w-4 h-4 text-gray-400 group-focus-within:text-[#FF8040] transition-colors" />
                                </div>
                                <textarea placeholder="Names separated by commas (e.g. John, Jane)" value={teamMembers}
                                    onChange={e => setTeamMembers(e.target.value)} required rows={3}
                                    className={`${baseInput} ${fOrange} resize-none`} />
                            </div>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 ml-0.5">
                                Max {event.teamSize} • Current: {teamMembers.split(",").filter(m => m.trim()).length}
                            </p>
                        </motion.div>
                    </>
                )}

                {/* ── Solo-only fields ── */}
                {event.participationType === "Solo" && (
                    <>
                        {/* Full Name */}
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
                            <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
                            <div className="relative group">
                                <div className={iconSlot}><User className="w-4 h-4 text-gray-400 group-focus-within:text-[#FF8040] transition-colors" /></div>
                                <input type="text" placeholder="Enter your full name" value={name}
                                    onChange={e => setName(e.target.value)} required
                                    className={`${baseInput} ${fOrange}`} />
                            </div>
                        </motion.div>

                        {/* College ID */}
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
                            <label className={labelClass}>College ID</label>
                            <div className="relative group">
                                <div className={iconSlot}><IdCard className="w-4 h-4 text-gray-400 group-focus-within:text-[#FF8040] transition-colors" /></div>
                                <input type="text" placeholder="Enter your college ID" value={collegeId}
                                    onChange={e => setCollegeId(e.target.value)}
                                    className={`${baseInput} ${fOrange}`} />
                            </div>
                        </motion.div>
                    </>
                )}

                {/* ── Common fields ── */}
                {/* Email */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <label className={labelClass}>Email Address <span className="text-red-500">*</span></label>
                    <div className="relative group">
                        <div className={iconSlot}><Mail className="w-4 h-4 text-gray-400 group-focus-within:text-[#0046FF] transition-colors" /></div>
                        <input type="email" placeholder="Enter your email" value={email}
                            onChange={e => setEmail(e.target.value)} required
                            className={`${baseInput} ${fBlue}`} />
                    </div>
                </motion.div>

                {/* Contact */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}>
                    <label className={labelClass}>Contact Number <span className="text-red-500">*</span></label>
                    <div className="relative group">
                        <div className={iconSlot}><Phone className="w-4 h-4 text-gray-400 group-focus-within:text-[#0046FF] transition-colors" /></div>
                        <input type="tel" placeholder="Enter your phone number" value={contact}
                            onChange={e => setContact(e.target.value)} required
                            className={`${baseInput} ${fBlue}`} />
                    </div>
                </motion.div>

                {/* College Name */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
                    <label className={labelClass}>College Name <span className="text-red-500">*</span></label>
                    <div className="relative group">
                        <div className={iconSlot}><Building2 className="w-4 h-4 text-gray-400 group-focus-within:text-[#001BB7] transition-colors" /></div>
                        <input type="text" placeholder="Enter your college name" value={collegeName}
                            onChange={e => setCollegeName(e.target.value)} required
                            className={`${baseInput} ${fNavy}`} />
                    </div>
                </motion.div>

                {/* Course + Year */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
                    className="grid grid-cols-2 gap-2 md:gap-3"
                >
                    {/* Course */}
                    <div>
                        <label className={labelClass}>Course <span className="text-red-500">*</span></label>
                        <div className="relative group">
                            <div className={iconSlot}><BookOpen className="w-3.5 h-3.5 text-gray-400 group-focus-within:text-[#FF8040] transition-colors" /></div>
                            <input type="text" placeholder="B.Tech CSE" value={course}
                                onChange={e => setCourse(e.target.value)} required
                                className={`${baseInput} ${fOrange}`} />
                        </div>
                    </div>
                    {/* Year */}
                    <div>
                        <label className={labelClass}>Year <span className="text-red-500">*</span></label>
                        <div className="relative group">
                            <div className={iconSlot}><GraduationCap className="w-3.5 h-3.5 text-gray-400 group-focus-within:text-[#0046FF] transition-colors" /></div>
                            <select value={year} onChange={e => setYear(e.target.value)} required
                                className={`${baseInput} ${fBlue} appearance-none cursor-pointer`}
                            >
                                <option value="">Year</option>
                                <option value="1st">1st Year</option>
                                <option value="2nd">2nd Year</option>
                                <option value="3rd">3rd Year</option>
                                <option value="4th">4th Year</option>
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* spacer so last field clears sticky footer */}
                <div className="h-1" />
            </div>

            {/* ══ STICKY FOOTER — Cancel + Submit ══ */}
            <div className="flex-shrink-0 flex gap-2 md:gap-3 px-3 md:px-5 lg:px-6 py-3 md:py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                    type="button"
                    onClick={onClose}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-2.5 md:py-3 rounded-lg md:rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold transition-all text-sm md:text-base"
                >
                    Cancel
                </motion.button>

                <motion.button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-gradient-to-r from-[#FF8040] to-[#0046FF] hover:from-[#FF8040]/90 hover:to-[#0046FF]/90 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold shadow-lg shadow-[#FF8040]/25 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-1.5 md:gap-2 text-sm md:text-base"
                >
                    {isSubmitting ? (
                        <>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            />
                            <span>Saving…</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                            {/* long label on md+, short on mobile */}
                            <span className="hidden md:inline">
                                {initialData ? "Save Changes" : "Complete Registration"}
                            </span>
                            <span className="md:hidden">
                                {initialData ? "Save" : "Register"}
                            </span>
                        </>
                    )}
                </motion.button>
            </div>

            {/* confidential note */}
            <div className="flex-shrink-0 flex items-center justify-center gap-1.5 px-4 py-2 bg-gray-50 dark:bg-gray-900/60 border-t border-gray-100 dark:border-gray-800">
                <Sparkles className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] md:text-xs text-gray-400 dark:text-gray-500">All information will be kept confidential</span>
            </div>
        </div>
    );
};

export default RegistrationForm;




// import { useState } from "react";
// import toast from "react-hot-toast";

// const RegistrationForm = ({ event, onSubmit, initialData }) => {
//     // Common fields
//     const [collegeName, setCollegeName] = useState(
//         initialData?.collegeName || ""
//     );
//     const [course, setCourse] = useState(
//         initialData?.course || ""
//     );
//     const [year, setYear] = useState(
//         initialData?.year || ""
//     );

//     // Team fields
//     const [teamName, setTeamName] = useState(
//         initialData?.teamName || ""
//     );
//     const [teamMembers, setTeamMembers] = useState(
//         initialData?.teamMembers?.join(",") || ""
//     );

//     // Solo fields
//     const [name, setName] = useState(initialData?.name || "");
//     const [collegeId, setCollegeId] = useState(
//         initialData?.collegeId || ""
//     );
//     const [email, setEmail] = useState(initialData?.email || "");
//     const [contact, setContact] = useState(
//         initialData?.contact || ""
//     );

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         const payload = {
//             collegeName,
//             course,
//             year,
//         };

//         if (event.participationType === "Team") {
//             payload.teamName = teamName;
//             payload.teamMembers = teamMembers.split(",");
//         } else {
//             payload.name = name;
//             payload.collegeId = collegeId;
//             payload.email = email;
//             payload.contact = contact;
//         }

//         onSubmit(payload);
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <h3>Register for {event.title}</h3>

//             {/* ===== Team Registration ===== */}
//             {event.participationType === "Team" && (
//                 <>
//                     <input
//                         placeholder="Team Name"
//                         value={teamName}
//                         onChange={(e) => setTeamName(e.target.value)}
//                         required
//                     />

//                     <input
//                         placeholder="Team Members (comma separated)"
//                         value={teamMembers}
//                         onChange={(e) =>
//                             setTeamMembers(e.target.value)
//                         }
//                         required
//                     />
//                 </>
//             )}

//             {/* ===== Solo Registration ===== */}
//             {event.participationType === "Solo" && (
//                 <>
//                     <input
//                         placeholder="Full Name"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         required
//                     />

//                     <input
//                         placeholder="College ID"
//                         value={collegeId}
//                         onChange={(e) =>
//                             setCollegeId(e.target.value)
//                         }
//                     />
//                 </>
//             )}

//             {/* ===== Common Fields ===== */}

//              <input
//                 placeholder="Contact Number"
//                 value={contact}
//                 onChange={(e) =>
//                     setContact(e.target.value)
//                 }
//                 required
//             />
            
//             <input
//                 placeholder="College Name"
//                 value={collegeName}
//                 onChange={(e) => setCollegeName(e.target.value)}
//                 required
//             />

//             <input
//                 placeholder="Course"
//                 value={course}
//                 onChange={(e) => setCourse(e.target.value)}
//                 required
//             />

//             <input
//                 placeholder="Year"
//                 value={year}
//                 onChange={(e) => setYear(e.target.value)}
//                 required
//             />

//              <input
//                 placeholder="Email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//             />

//             <button type="submit">Submit</button>
//         </form>
//     );
// };

// export default RegistrationForm;
