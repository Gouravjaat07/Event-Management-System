import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllEvents } from "../../services/eventService";
import { deleteEvent } from "../../services/hostEventService";
import { useNavigate } from "react-router-dom";

import {
  PlusCircle,
  Calendar,
  Users,
  Trophy,
  TrendingUp,
  Edit3,
  Trash2,
  Eye,
  UserCheck,
  Sparkles,
  BarChart3,
  Clock,
  Tag
} from "lucide-react";
import Navbar from "../../components/Navbar";
import toast from "react-hot-toast";

const HostDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    const fetchHostEvents = async () => {
      try {
        const allEvents = await getAllEvents();
        const hostEvents = allEvents.filter(
          (event) => event.hostId === user.id || event.hostId?._id === user.id
        );
        setEvents(hostEvents);
      } catch (error) {
        toast.error("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchHostEvents();
  }, [user]);

  const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(eventId);
        setEvents(events.filter((e) => e._id !== eventId));
        toast.success("Event deleted successfully");
      } catch (error) {
        toast.error("Failed to delete event");
      }
    }
  };

  // Calculate stats
  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => new Date(e.eventDate) > new Date()).length;
  const totalRegistrations = events.reduce((sum, e) => sum + (e.registrations?.length || 0), 0);

  const stats = [
    {
      label: "Total Events",
      value: totalEvents,
      icon: Calendar,
      bgColor: "bg-[#FF8040]/10 dark:bg-[#FF8040]/20",
      iconColor: "text-[#FF8040]"
    },
    {
      label: "Upcoming",
      value: upcomingEvents,
      icon: Clock,
      bgColor: "bg-[#0046FF]/10 dark:bg-[#0046FF]/20",
      iconColor: "text-[#0046FF]"
    },
    {
      label: "Registrations",
      value: totalRegistrations,
      icon: Users,
      bgColor: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400"
    },
    {
      label: "Success Rate",
      value: "95%",
      icon: TrendingUp,
      bgColor: "bg-[#001BB7]/10 dark:bg-[#001BB7]/20",
      iconColor: "text-[#001BB7]"
    }
  ];

  const getEventTypeColor = (type) => {
    const colors = {
      'Hackathon': 'from-[#FF8040] to-[#0046FF]',
      'Competition': 'from-[#0046FF] to-[#001BB7]',
      'Fest': 'from-[#001BB7] to-[#FF8040]',
      'Workshop': 'from-[#FF8040] via-[#0046FF] to-[#001BB7]'
    };
    return colors[type] || 'from-[#FF8040] to-[#0046FF]';
  };

  // Get random color for event card variety
  const getRandomEventColor = (index) => {
    const colorVariants = [
      'from-[#FF8040] to-[#FF8040]/80',           // Orange
      'from-[#0046FF] to-[#0046FF]/80',           // Bright Blue
      'from-[#001BB7] to-[#001BB7]/80',           // Deep Blue
      'from-[#FF8040] to-[#0046FF]',              // Orange to Blue
      'from-[#0046FF] to-[#001BB7]',              // Blue gradient
      'from-[#001BB7] to-[#FF8040]',              // Deep Blue to Orange
      'from-[#FF8040] via-[#0046FF] to-[#001BB7]', // Triple gradient
    ];
    return colorVariants[index % colorVariants.length];
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

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <div className="min-h-screen bg-[#F5F1DC] dark:bg-slate-900 transition-colors duration-300">
        
        {/* Background Blobs - Like StudentDashboard */}
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
          
          {/* Welcome Header - Responsive */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4 md:mb-6 lg:mb-8"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl md:rounded-2xl lg:rounded-3xl p-4 md:p-6 lg:p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
              <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-4 md:gap-6">
                
                {/* Avatar & Text */}
                <div className="flex items-center gap-3 md:gap-5 lg:gap-6 w-full md:w-auto">
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
                      {user?.name?.charAt(0).toUpperCase() || 'H'}
                    </span>
                  </motion.div>

                  <div className="flex-1 min-w-0">
                    <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black bg-gradient-to-r from-[#FF8040] via-[#0046FF] to-[#001BB7] bg-clip-text text-transparent mb-1 leading-tight">
                      Host Dashboard
                    </h1>
                    <p className="text-xs md:text-sm lg:text-base text-gray-600 dark:text-gray-400">
                      Welcome back, {user?.name?.split(' ')[0] || 'Host'}! Manage your events here.
                    </p>
                  </div>
                </div>

                {/* Create Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/host/create")}
                  className="w-full md:w-auto px-4 py-2.5 md:px-5 md:py-3 lg:px-6 lg:py-4 rounded-lg md:rounded-xl bg-gradient-to-r from-[#FF8040] to-[#0046FF] hover:from-[#FF8040]/90 hover:to-[#0046FF]/90 text-white font-bold shadow-lg shadow-[#FF8040]/30 hover:shadow-xl hover:shadow-[#FF8040]/50 transition-all flex items-center justify-center gap-1.5 md:gap-2 text-sm md:text-base flex-shrink-0"
                >
                  <PlusCircle className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Create New Event</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid - Like StudentDashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6 mb-4 md:mb-6 lg:mb-8"
          >
            {stats.map((stat, index) => {
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

          {/* Events List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-5 lg:mb-6">
              <div className="p-1.5 md:p-2 rounded-lg bg-[#FF8040]/10 dark:bg-[#FF8040]/20">
                <Calendar className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-[#FF8040]" />
              </div>
              <h2 className="text-lg md:text-xl lg:text-2xl font-black text-gray-900 dark:text-white">
                Your Events
              </h2>
            </div>

            {events.length === 0 ? (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl md:rounded-2xl p-8 md:p-10 lg:p-12 border border-gray-200 dark:border-gray-700 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-gradient-to-br from-[#FF8040]/20 to-[#0046FF]/20 dark:from-[#FF8040]/10 dark:to-[#0046FF]/10 flex items-center justify-center mb-4 md:mb-6">
                  <Calendar className="w-8 h-8 md:w-10 md:h-10 text-[#FF8040]" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2">
                  No Events Created Yet
                </h3>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4 md:mb-6">
                  Start creating amazing events for your audience!
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/host/create")}
                  className="px-5 py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-[#FF8040] to-[#0046FF] text-white rounded-lg md:rounded-xl font-semibold shadow-lg inline-flex items-center gap-2 text-sm md:text-base"
                >
                  <PlusCircle className="w-4 h-4 md:w-5 md:h-5" />
                  Create Your First Event
                </motion.button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {events.map((event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 + index * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {/* Event Header */}
                    <div className={`relative p-4 md:p-5 lg:p-6 bg-gradient-to-r ${getRandomEventColor(index)}`}>
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-base md:text-lg lg:text-xl font-black text-white flex-1 pr-3 md:pr-4 leading-tight">
                            {event.title}
                          </h3>
                          <div className="px-2.5 py-1 md:px-3 md:py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex-shrink-0">
                            <span className="text-[9px] md:text-xs font-bold text-white uppercase">
                              {event.eventType}
                            </span>
                          </div>
                        </div>
                        <p className="text-white/90 text-xs md:text-sm line-clamp-2">
                          {event.description}
                        </p>
                      </div>
                    </div>

                    {/* Event Info */}
                    <div className="p-4 md:p-5 lg:p-6">
                      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                        <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm">
                          <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300 truncate">
                            {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm">
                          <Tag className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300 truncate">
                            {event.participationType}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm">
                          <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300 truncate">
                            {event.registrations?.length || "Go"} Registered
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm">
                          <Trophy className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300 truncate">
                            {event.prizes || 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-1.5 md:gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate(`/host/event/${event._id}`)}
                          className="px-3 py-2 md:px-4 md:py-2.5 rounded-md md:rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 font-semibold text-xs md:text-sm flex items-center justify-center gap-1.5 md:gap-2 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          <span className="hidden sm:inline">View</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate(`/host/edit/${event._id}`)}
                          className="px-3 py-2 md:px-4 md:py-2.5 rounded-md md:rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 font-semibold text-xs md:text-sm flex items-center justify-center gap-1.5 md:gap-2 transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          <span className="hidden sm:inline">Edit</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate(`/host/event/${event._id}/registrations`)}
                          className="px-3 py-2 md:px-4 md:py-2.5 rounded-md md:rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 font-semibold text-xs md:text-sm flex items-center justify-center gap-1.5 md:gap-2 transition-all"
                        >
                          <UserCheck className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          <span className="hidden sm:inline">Regs</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleDelete(event._id)}
                          className="px-3 py-2 md:px-4 md:py-2.5 rounded-md md:rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 font-semibold text-xs md:text-sm flex items-center justify-center gap-1.5 md:gap-2 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          <span className="hidden sm:inline">Delete</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Footer - Like StudentDashboard */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 md:mt-8 flex items-center justify-center gap-1.5 md:gap-2 text-xs md:text-sm text-gray-500 dark:text-gray-400"
          >
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
            <span>Keep creating amazing events!</span>
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;




// import { useAuth } from "../../context/AuthContext";
// import { useEffect, useState, useContext } from "react";
// import { getAllEvents } from "../../services/eventService";
// import EventRegistrations from "./EventRegistrations";
// import { useNavigate } from "react-router-dom";
// import { getHostEvents, deleteEvent } from "../../services/hostEventService";


// const HostDashboard = () => {
//     const { user, logout } = useAuth();
//     const navigate = useNavigate();
//     const [events, setEvents] = useState([]);
//     const [selectedEvent, setSelectedEvent] = useState(null);
//     const [loading, setLoading] = useState(true);

//     // useEffect(() => {
//     //     const fetch = async () => {
//     //         const data = await getAllEvents();
//     //         setEvents(data);
//     //     };
//     // }, []);

//     useEffect(() => {
//         const fetchHostEvents = async () => {
//             try {
//                 const allEvents = await getAllEvents();

//                 // Filter events created by this host
//                 const hostEvents = allEvents.filter(
//                     (event) => event.hostId === user.id
//                 );

//                 setEvents(hostEvents);
//             } catch(error) {
//                 console.error("Failed to fetch events", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if(user?.id) {
//             fetchHostEvents();
//         }
//     }, [user]);

//     if(loading) {
//         return <p>Loading your events...</p>;
//     }
//     return (
//         <div>
//             <h2>Host Dashboard</h2>
//             <p>Welcome, {user.name} </p>

//             <h3>Your Events</h3>

//             {events.length === 0 && (
//                 <p>No events created by you yet</p>
//             )}

//       <button onClick={() => navigate("/host/create")}>
//         Create New Event
//       </button>

//         {events.map(event => (
//         <div key={event._id}>
//             <h4>{event.title}</h4>

//             <button onClick={() => navigate(`/host/edit/${event._id}`)}>
//             Edit
//             </button>

//             <button onClick={() => deleteEvent(event._id)}>
//             Delete
//             </button>

//             <button onClick={() => navigate(`/host/event/${event._id}`)}>
//             View Details
//             </button>
//         </div>
//         ))}

//             {events.map((e) => (
//                 <div key={e._id} 
//                     style={{
//                         border: "1px solid #ccc",
//                         margin: 10,
//                         padding: 10,
//                     }}
//                 >
//                     <p><b>{e.title}</b></p>
//                     <button onClick={() => setSelectedEvent(e)}>
//                         View Registrations
//                     </button>
//                 </div>
//             ))}

//             {selectedEvent && (
//                 <EventRegistrations event={selectedEvent} />
//             )}

//             <button onClick={logout}>Logout</button>
//         </div>
//     );
// };

// export default HostDashboard;