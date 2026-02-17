import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getEventRegistrations } from "../../services/hostService";
import { getEventById } from "../../services/eventService";
import { exportToExcel } from "../../utils/exportExcel";
import { exportToPDF } from "../../utils/exportPDF";
import { getCertificate } from "../../services/certificateService";
import { useTheme } from "../../context/ThemeContext"; // Add import


import {
  ArrowLeft,
  Download,
  FileSpreadsheet,
  FileText,
  User,
  Mail,
  Phone,
  Building2,
  BookOpen,
  Users,
  Award,
  Calendar,
  Sparkles,
  UserCheck,
  Tag,
  GraduationCap
} from "lucide-react";
import Navbar from "../../components/Navbar";
import toast from "react-hot-toast";

const EventRegistrations = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issuingCert, setIssuingCert] = useState(null);

  useEffect(() => {
    // Scroll to top when component mounts or id changes
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    const fetchData = async () => {
      try {
        const [eventData, regsData] = await Promise.all([
          getEventById(eventId),
          getEventRegistrations(eventId)
        ]);
        setEvent(eventData);
        setRegistrations(regsData);
      } catch (error) {
        toast.error("Failed to load registrations");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) fetchData();
  }, [eventId]);

  const handleExportExcel = () => {
    try {
      exportToExcel(registrations, event.title);
      toast.success("Excel file downloaded! 📊");
    } catch (error) {
      toast.error("Failed to export Excel");
    }
  };

  const handleExportPDF = () => {
    try {
      exportToPDF(registrations, event.title);
      toast.success("PDF file downloaded! 📄");
    } catch (error) {
      toast.error("Failed to export PDF");
    }
  };

  const issueCertificate = async (userId, userName) => {
    setIssuingCert(userId);
    try {
      await getCertificate({
        userId,
        eventId: event._id,
      });
      toast.success(`Certificate issued to ${userName}! 🎓`);
    } catch (error) {
      toast.error("Already issued or error occurred");
    } finally {
      setIssuingCert(null);
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
            className="w-12 md:w-16 h-12 md:h-16 border-4 border-[#FF8040] border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="min-h-screen bg-[#F5F1DC] dark:bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">Event not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <div className="min-h-screen bg-[#F5F1DC] dark:bg-slate-900 transition-colors duration-500">
        
        {/* Animated Background */}
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

        <div className="relative container mx-auto px-4 py-6 md:py-8 sm:px-6 lg:px-8 max-w-7xl">
          
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-4 md:mb-6"
          >
            <Link to="/host">
              <motion.button
                whileHover={{ x: -4 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#FF8040] dark:hover:border-[#FF8040] transition-all text-sm md:text-base"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">Back to Dashboard</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
                <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                  <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 flex-shrink-0">
                    <UserCheck className="w-6 md:w-8 h-6 md:h-8 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-xl md:text-3xl font-black bg-gradient-to-r from-[#FF8040] via-[#0046FF] to-[#001BB7] dark:from-[#FF8040] dark:via-[#0046FF] dark:to-[#001BB7] bg-clip-text text-transparent mb-1 truncate">
                      {event.title}
                    </h1>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Users className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0" />
                      <span>{registrations.length} Total Registrations</span>
                    </p>
                  </div>
                </div>

                {/* Export Buttons */}
                <div className="flex gap-2 md:gap-3 w-full md:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleExportExcel}
                    className="flex-1 md:flex-none px-3 md:px-5 py-2 md:py-3 rounded-lg md:rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/50 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    <FileSpreadsheet className="w-4 md:w-5 h-4 md:h-5" />
                    <span>Excel</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleExportPDF}
                    className="flex-1 md:flex-none px-3 md:px-5 py-2 md:py-3 rounded-lg md:rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/50 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    <FileText className="w-4 md:w-5 h-4 md:h-5" />
                    <span>PDF</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Registrations List */}
          {registrations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl md:rounded-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700 text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="w-16 md:w-20 h-16 md:h-20 mx-auto rounded-full bg-gradient-to-br from-[#FF8040]/20 to-[#0046FF]/20 dark:from-[#FF8040]/10 dark:to-[#0046FF]/10 flex items-center justify-center mb-4 md:mb-6"
              >
                <Users className="w-8 md:w-10 h-8 md:h-10 text-[#0046FF]" />
              </motion.div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2">
                No Registrations Yet
              </h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                No one has registered for this event yet.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              {registrations.map((reg, index) => {
                const isTeam = reg.teamName;
                
                return (
                  <motion.div
                    key={reg._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {/* Registration Header */}
                    <div className={`p-4 md:p-6 bg-gradient-to-r ${isTeam ? 'from-purple-500 to-pink-500' : 'from-[#0046FF] to-[#001BB7]'}`}>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
                        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                          <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/40 flex-shrink-0">
                            {isTeam ? (
                              <Users className="w-5 md:w-6 h-5 md:h-6 text-white" />
                            ) : (
                              <User className="w-5 md:w-6 h-5 md:h-6 text-white" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-base md:text-xl font-black text-white truncate">
                              {isTeam ? reg.teamName : reg.userId?.name || 'N/A'}
                            </h3>
                            <p className="text-white/80 text-xs md:text-sm">
                              {isTeam ? 'Team Registration' : 'Solo Registration'}
                            </p>
                          </div>
                        </div>

                        {/* Certificate Button */}
                        {/* <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => issueCertificate(reg.userId?._id, reg.userId?.name)}
                          disabled={issuingCert === reg.userId?._id}
                          className="w-full sm:w-auto px-3 md:px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/40 text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm"
                        >
                          {issuingCert === reg.userId?._id ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-3 md:w-4 h-3 md:h-4 border-2 border-white border-t-transparent rounded-full"
                              />
                              <span>Issuing...</span>
                            </>
                          ) : (
                            <>
                              <Award className="w-3 md:w-4 h-3 md:h-4" />
                              <span>Issue Certificate</span>
                            </>
                          )}
                        </motion.button> */}
                      </div>
                    </div>

                    {/* Registration Details */}
                    <div className="p-4 md:p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                        
                        {/* Contact Person */}
                        <div className="p-3 md:p-4 rounded-lg md:rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center gap-2 mb-1 md:mb-2">
                            <User className="w-3 md:w-4 h-3 md:h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-[10px] md:text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">
                              {isTeam ? 'Team Leader' : 'Participant'}
                            </span>
                          </div>
                          <p className="text-xs md:text-sm font-bold text-gray-900 dark:text-white truncate">
                            {reg.name || reg.userId?.name || 'N/A'}
                          </p>
                        </div>

                        {/* Email */}
                        <div className="p-3 md:p-4 rounded-lg md:rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                          <div className="flex items-center gap-2 mb-1 md:mb-2">
                            <Mail className="w-3 md:w-4 h-3 md:h-4 text-green-600 dark:text-green-400" />
                            <span className="text-[10px] md:text-xs font-semibold text-green-600 dark:text-green-400 uppercase">Email</span>
                          </div>
                          <p className="text-xs md:text-sm font-bold text-gray-900 dark:text-white truncate">
                            {reg.email || reg.userId?.email || 'N/A'}
                          </p>
                        </div>

                        {/* Phone */}
                        <div className="p-3 md:p-4 rounded-lg md:rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                          <div className="flex items-center gap-2 mb-1 md:mb-2">
                            <Phone className="w-3 md:w-4 h-3 md:h-4 text-orange-600 dark:text-orange-400" />
                            <span className="text-[10px] md:text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase">Contact</span>
                          </div>
                          <p className="text-xs md:text-sm font-bold text-gray-900 dark:text-white">
                            {reg.contact || 'N/A'}
                          </p>
                        </div>

                        {/* College */}
                        <div className="p-3 md:p-4 rounded-lg md:rounded-xl bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800">
                          <div className="flex items-center gap-2 mb-1 md:mb-2">
                            <Building2 className="w-3 md:w-4 h-3 md:h-4 text-pink-600 dark:text-pink-400" />
                            <span className="text-[10px] md:text-xs font-semibold text-pink-600 dark:text-pink-400 uppercase">College</span>
                          </div>
                          <p className="text-xs md:text-sm font-bold text-gray-900 dark:text-white truncate">
                            {reg.collegeName || 'N/A'}
                          </p>
                        </div>

                        {/* Course */}
                        <div className="p-3 md:p-4 rounded-lg md:rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800">
                          <div className="flex items-center gap-2 mb-1 md:mb-2">
                            <BookOpen className="w-3 md:w-4 h-3 md:h-4 text-violet-600 dark:text-violet-400" />
                            <span className="text-[10px] md:text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase">Course</span>
                          </div>
                          <p className="text-xs md:text-sm font-bold text-gray-900 dark:text-white">
                            {reg.course || 'N/A'}
                          </p>
                        </div>

                        {/* Year */}
                        <div className="p-3 md:p-4 rounded-lg md:rounded-xl bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800">
                          <div className="flex items-center gap-2 mb-1 md:mb-2">
                            <GraduationCap className="w-3 md:w-4 h-3 md:h-4 text-cyan-600 dark:text-cyan-400" />
                            <span className="text-[10px] md:text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase">Year</span>
                          </div>
                          <p className="text-xs md:text-sm font-bold text-gray-900 dark:text-white">
                            {reg.year || 'N/A'}
                          </p>
                        </div>

                        {/* Team Members (if team) */}
                        {isTeam && reg.teamMembers && reg.teamMembers.length > 0 && (
                          <div className="sm:col-span-2 lg:col-span-3 p-3 md:p-4 rounded-lg md:rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                            <div className="flex items-center gap-2 mb-2 md:mb-3">
                              <Users className="w-3 md:w-4 h-3 md:h-4 text-purple-600 dark:text-purple-400" />
                              <span className="text-[10px] md:text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase">
                                Team Members ({reg.teamMembers.length})
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 md:gap-2">
                              {reg.teamMembers.map((member, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 md:px-3 py-1 md:py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700 text-xs md:text-sm font-semibold text-gray-900 dark:text-white"
                                >
                                  {member}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* College ID (if solo) */}
                        {!isTeam && reg.collegeId && (
                          <div className="p-3 md:p-4 rounded-lg md:rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                            <div className="flex items-center gap-2 mb-1 md:mb-2">
                              <Tag className="w-3 md:w-4 h-3 md:h-4 text-indigo-600 dark:text-indigo-400" />
                              <span className="text-[10px] md:text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase">College ID</span>
                            </div>
                            <p className="text-xs md:text-sm font-bold text-gray-900 dark:text-white">
                              {reg.collegeId}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 md:mt-8 flex items-center justify-center gap-2 text-xs md:text-sm text-gray-500 dark:text-gray-400"
          >
            <Sparkles className="w-3 md:w-4 h-3 md:h-4" />
            <span>Manage your event registrations efficiently</span>
            <Sparkles className="w-3 md:w-4 h-3 md:h-4" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrations;




// // Origional file
// import { useEffect, useState } from "react";
// import { getEventRegistrations } from "../../services/hostService";
// import { exportToExcel } from "../../utils/exportExcel";
// import { exportToPDF } from "../../utils/exportPDF";
// import {  getCertificate } from "../../services/certificateService";

// const EventRegistrations = ({ event }) => {
//     const [registrations, setRegistrations] = useState([]);

//     useEffect(() => {
//         const fetch = async () => {
//             const data = await getEventRegistrations(event._id);
//             setRegistrations(data);
//         };

//         fetch();
//     }, [event._id]);

//     const issueCertificate = async (userId) => {
//         try {
//             await getCertificate({
//                 userId,
//                 eventId: event._id,
//             })
//         } catch {
//             alert("Already issued or error");
//         }
//     };
    

//     return (
//         <div>
//             <h3>{event.title} - Registrations</h3>

//             <button onClick={() => exportToExcel(registrations, event.title)}>
//                 Export Excel
//             </button>

//             <button onClick={() => exportToPDF(registrations, event.title)} >
//                 Export PDF
//             </button>

//             <hr />

//             {registrations.map((r) => (
//                 <div key={r._id} style={{border: "1px solid #ccc", margin: 6}}>
//                     <p><b>{r.userId.name}</b>({r.userId.email})</p>
//                     <p>Team: {r.teamName || "Solo"}</p>

//                     <button onClick={() => issueCertificate(r.userId._id)} disabled>
//                         Issue Certificate
//                     </button>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default EventRegistrations;