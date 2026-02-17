import { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Users, Calendar, Clock, Search, Eye, EyeOff, Tag, Award } from 'lucide-react';
import { getAllEventsAdmin, deleteEventAdmin } from "../../services/adminService";
import AdminRegistrations from "./AdminRegistrations";



// ── Skeleton ──
const SkeletonCard = ({ index }) => (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: index * 0.1 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl md:rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse"
    >
        <div className="p-4 md:p-6 space-y-3 md:space-y-4">
            <div className="h-5 md:h-6 bg-g ray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-3 md:h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="h-3 md:h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="flex gap-2 mt-3 md:mt-4">
                <div className="h-8 md:h-10 bg-gray-200 dark:bg-gray-700 rounded-lg md:rounded-xl flex-1" />
                <div className="h-8 md:h-10 bg-gray-200 dark:bg-gray-700 rounded-lg md:rounded-xl w-20 md:w-24" />
            </div>
        </div>
    </motion.div>
);

// ── Empty state ──
const EmptyState = () => (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
        className="col-span-full flex flex-col items-center justify-center py-12 md:py-20 px-4"
    >
        <motion.div
            animate={{ rotate:[0,10,-10,10,0], scale:[1,1.1,1] }}
            transition={{ duration:2, repeat:Infinity, repeatDelay:3 }}
            className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-[#FF8040]/20 to-[#0046FF]/20 flex items-center justify-center mb-4 md:mb-6"
        >
            <Calendar className="w-8 h-8 md:w-12 md:h-12 text-[#0046FF]" />
        </motion.div>
        <h3 className="text-lg md:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">No Events Yet</h3>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 text-center max-w-md">
            No events have been created yet. Events will appear here once they are added.
        </p>
    </motion.div>
);

// ── Event type badge ──
const EventTypeBadge = ({ type }) => {
    const colors = {
        Hackathon:   'from-purple-500 to-pink-500',
        Competition: 'from-red-500 to-orange-500',
        Fest:        'from-green-500 to-teal-500',
        Workshop:    'from-blue-500 to-cyan-500'
    };
    return (
        <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-gradient-to-r ${colors[type] || 'from-gray-500 to-gray-600'} text-white text-[10px] md:text-xs font-bold shadow`}>
            {type}
        </span>
    );
};

// ── Main component ──
const AdminEvents = ({ onDelete }) => {
    const [darkMode, setDarkMode] = useState(false);
    const [events, setEvents]           = useState([]);
    const [loading, setLoading]         = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleting, setDeleting]       = useState(null);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const data = await getAllEventsAdmin();
            setEvents(data);
        } catch (err) {
            console.error("Failed to fetch events:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchEvents(); }, []);

    const deleteEvent = async (id) => {
        if (!window.confirm("Delete this event permanently? This cannot be undone.")) return;
        try {
            setDeleting(id);
            await deleteEventAdmin(id);
            await fetchEvents();
            if (selectedEvent?._id === id) setSelectedEvent(null);
            if (onDelete) onDelete();
        } catch {
            alert("Failed to delete event.");
        } finally {
            setDeleting(null);
        }
    };

    const filteredEvents = events.filter(e =>
        e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.hostId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.eventType?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-3 md:space-y-5 lg:space-y-6">

            {/* Section header */}
            <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
            >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
                    <div>
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-black bg-gradient-to-r from-[#FF8040] via-[#0046FF] to-[#001BB7] bg-clip-text text-transparent mb-1 md:mb-2">
                            Event Management
                        </h2>
                        <p className="text-xs md:text-sm lg:text-base text-gray-600 dark:text-gray-400">
                            View, manage and monitor all events across the platform
                        </p>
                    </div>
                    <div className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl bg-gradient-to-r from-[#FF8040] to-[#0046FF] text-white font-bold shadow text-sm md:text-base flex-shrink-0">
                        {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'}
                    </div>
                </div>
            </motion.div>

            {/* Search */}
            <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
                className="relative"
            >
                <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search events by title, host, or type…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 md:pl-12 pr-4 py-3 md:py-4 rounded-lg md:rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-2 border-gray-200 dark:border-gray-700 focus:border-[#FF8040] dark:focus:border-[#FF8040] focus:ring-2 md:focus:ring-4 focus:ring-[#FF8040]/10 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-500 shadow-sm text-sm md:text-base"
                />
            </motion.div>

            {/* Content */}
            {loading ? (
                <div className="grid grid-cols-1 gap-3 md:gap-4">
                    {[...Array(3)].map((_, i) => <SkeletonCard key={i} index={i} />)}
                </div>
            ) : filteredEvents.length === 0 ? (
                <EmptyState />
            ) : (
                <motion.div layout className="grid grid-cols-1 gap-4 md:gap-5 lg:gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredEvents.map((event, index) => (
                            <motion.div
                                key={event._id}
                                layout
                                initial={{ opacity:0, y:20 }}
                                animate={{ opacity:1, y:0 }}
                                exit={{ opacity:0, scale:0.95 }}
                                transition={{ delay: index * 0.04, layout:{ duration:0.3 } }}
                                whileHover={{ y:-3 }}
                                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl md:rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-[#FF8040] dark:hover:border-[#FF8040] shadow-lg hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="p-4 md:p-5 lg:p-6">

                                    {/* Event header row */}
                                    <div className="flex items-start justify-between gap-3 md:gap-4 mb-3 md:mb-4">
                                        <div className="flex-1 min-w-0">
                                            {/* Title + badge */}
                                            <div className="flex flex-wrap items-center gap-2 mb-2 md:mb-3">
                                                <h3 className="text-base md:text-xl lg:text-2xl font-black text-gray-900 dark:text-white leading-tight">
                                                    {event.title}
                                                </h3>
                                                {event.eventType && <EventTypeBadge type={event.eventType} />}
                                            </div>

                                            {/* Host + registrations */}
                                            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm">
                                                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                                    <div className="p-1 md:p-1.5 rounded-md bg-[#0046FF]/10">
                                                        <Users className="w-3 h-3 md:w-4 md:h-4 text-[#0046FF]" />
                                                    </div>
                                                    <span>Host: <span className="font-bold text-gray-900 dark:text-white">{event.hostId?.name || "N/A"}</span></span>
                                                </div>
                                                {event.registrations && (
                                                    <div className="flex items-center gap-1 px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 font-semibold text-[10px] md:text-xs">
                                                        <Award className="w-3 h-3 md:w-4 md:h-4" />
                                                        {event.registrations.length} Registered
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action buttons — stacked on xs, row on sm+ */}
                                        <div className="flex flex-col sm:flex-row gap-1.5 md:gap-2 flex-shrink-0">
                                            <motion.button
                                                whileHover={{ scale:1.05, y:-1 }}
                                                whileTap={{ scale:0.95 }}
                                                onClick={() => setSelectedEvent(selectedEvent?._id === event._id ? null : event)}
                                                className={`flex items-center justify-center gap-1 md:gap-2 px-3 py-1.5 md:px-5 md:py-2.5 rounded-lg md:rounded-xl font-bold transition-all text-xs md:text-sm shadow ${
                                                    selectedEvent?._id === event._id
                                                        ? 'bg-gradient-to-r from-[#FF8040] to-[#0046FF] text-white'
                                                        : 'bg-white dark:bg-gray-700 text-[#0046FF] border-2 border-[#0046FF] hover:bg-[#0046FF] hover:text-white dark:hover:bg-[#0046FF]'
                                                }`}
                                            >
                                                {selectedEvent?._id === event._id
                                                    ? <><EyeOff className="w-3.5 h-3.5 md:w-4 md:h-4" /><span className="hidden sm:inline">Hide</span></>
                                                    : <><Eye     className="w-3.5 h-3.5 md:w-4 md:h-4" /><span className="hidden sm:inline">View</span></>}
                                            </motion.button>

                                            <motion.button
                                                whileHover={{ scale:1.05, y:-1 }}
                                                whileTap={{ scale:0.95 }}
                                                onClick={() => deleteEvent(event._id)}
                                                disabled={deleting === event._id}
                                                className="flex items-center justify-center gap-1 md:gap-2 px-3 py-1.5 md:px-5 md:py-2.5 rounded-lg md:rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold transition-all text-xs md:text-sm shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                <span className="hidden sm:inline">{deleting === event._id ? 'Deleting…' : 'Delete'}</span>
                                            </motion.button>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {event.description && (
                                        <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2 leading-relaxed">
                                            {event.description}
                                        </p>
                                    )}

                                    {/* Meta pills */}
                                    <div className="flex flex-wrap gap-2 md:gap-3 text-xs md:text-sm">
                                        {event.eventDate && (
                                            <div className="flex items-center gap-1 md:gap-1.5 px-2 py-1 md:px-3 md:py-1.5 rounded-md md:rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400">
                                                <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                                                <span className="font-semibold text-[10px] md:text-xs">
                                                    {new Date(event.eventDate).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                                                </span>
                                            </div>
                                        )}
                                        {event.participationType && (
                                            <div className="flex items-center gap-1 md:gap-1.5 px-2 py-1 md:px-3 md:py-1.5 rounded-md md:rounded-lg bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400">
                                                <Tag className="w-3 h-3 md:w-4 md:h-4" />
                                                <span className="font-semibold text-[10px] md:text-xs">{event.participationType}</span>
                                            </div>
                                        )}
                                        {event.prizes && (
                                            <div className="flex items-center gap-1 md:gap-1.5 px-2 py-1 md:px-3 md:py-1.5 rounded-md md:rounded-lg bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400">
                                                <Award className="w-3 h-3 md:w-4 md:h-4" />
                                                <span className="font-semibold text-[10px] md:text-xs">{event.prizes}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Registrations accordion */}
                                    <AnimatePresence>
                                        {selectedEvent?._id === event._id && (
                                            <motion.div
                                                initial={{ opacity:0, height:0 }}
                                                animate={{ opacity:1, height:'auto' }}
                                                exit={{ opacity:0, height:0 }}
                                                transition={{ duration:0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="mt-4 md:mt-5 lg:mt-6 pt-4 md:pt-5 lg:pt-6 border-t-2 border-gray-200 dark:border-gray-700">
                                                    <AdminRegistrations event={selectedEvent} />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
};

export default AdminEvents;



// Origional code
// import { useEffect, useState } from "react";
// import {
//     getAllEventsAdmin,
//     deleteEventAdmin,
// } from "../../services/adminService";
// import AdminRegistrations from "./AdminRegistrations";

// const AdminEvents = () => {
//     const [events, setEvents] = useState([]);
//     const [selectedEvent, setSelectedEvent] = useState(null);

//     const fetchEvents = async () => {
//         const data = await getAllEventsAdmin();
//         setEvents(data);
//     };

//     useEffect(() => {
//         fetchEvents();
//     }, []);

//     const deleteEvent = async (id) => {
//         if(!window.confirm("Delete this event permanently ?")) return;
//         await deleteEventAdmin(id);
//         fetchEvents();
//     };


//     return (
//         <div>
//             <h2>All Events</h2>

//             {events.map((e) => (
//                 <div key={e._id} style={{ border: "1px solid #ccc", margin: 10 }} >
//                     <p><b>{e.title}</b></p>
//                     <p>
//                         <b>Host Name:</b> {e.hostId?.name || "N/A"}
//                     </p>
//                     {/* <p>
//                         <b>Host Email:</b> {e.hostId?.email || "N/A"}
//                     </p>
//                     <p>
//                         <b>Host ID:</b> {e.hostId?._id}
//                     </p> */}


//                     <button onClick={() => setSelectedEvent(e)}>
//                         View Registrations
//                     </button>

//                     <button onClick={() => deleteEvent(e._id)}>
//                         Deleted Event
//                     </button>

//                     {selectedEvent?._id === e._id && (
//                         <AdminRegistrations event={selectedEvent} />
//                     )}

//                 </div>
//             ))}
//         </div>
//     );
// };


// export default AdminEvents;