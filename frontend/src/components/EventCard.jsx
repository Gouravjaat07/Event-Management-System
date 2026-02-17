import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';


// ==================== REFINED EVENT CARD WITH SUBTLE HOVER EFFECTS ====================
const EventCard = ({ event, index = 0, onViewDetails }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get event type color (SVSU palette: Orange and Blue theme)
  const getTypeColor = (type) => {
    const colors = {
      workshop: { 
        gradient: 'from-orange-500 to-orange-600',
        badge: 'bg-orange-500',
        icon: 'bg-orange-50 dark:bg-orange-900/20',
        iconColor: 'text-orange-600 dark:text-orange-400',
        button: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
        shadow: 'shadow-orange-500/20',
        accentColor: 'orange'
      },
      competition: { 
        gradient: 'from-blue-500 to-blue-600',
        badge: 'bg-blue-500',
        icon: 'bg-blue-50 dark:bg-blue-900/20',
        iconColor: 'text-blue-600 dark:text-blue-400',
        button: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
        shadow: 'shadow-blue-500/20',
        accentColor: 'blue'
      },
      fest: { 
        gradient: 'from-purple-500 to-purple-600',
        badge: 'bg-gradient-to-r from-orange-500 to-blue-600',
        icon: 'bg-purple-50 dark:bg-purple-900/20',
        iconColor: 'text-purple-600 dark:text-purple-400',
        button: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
        shadow: 'shadow-purple-500/20',
        accentColor: 'purple'
      },
      hackathon: { 
        gradient: 'from-indigo-500 to-indigo-600',
        badge: 'bg-indigo-500',
        icon: 'bg-indigo-50 dark:bg-indigo-900/20',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        button: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700',
        shadow: 'shadow-indigo-500/20',
        accentColor: 'indigo'
      },
      seminar: { 
        gradient: 'from-teal-500 to-teal-600',
        badge: 'bg-teal-500',
        icon: 'bg-teal-50 dark:bg-teal-900/20',
        iconColor: 'text-teal-600 dark:text-teal-400',
        button: 'from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700',
        shadow: 'shadow-teal-500/20',
        accentColor: 'teal'
      },
      default: { 
        gradient: 'from-orange-500 to-blue-600',
        badge: 'bg-gradient-to-r from-orange-500 to-blue-600',
        icon: 'bg-slate-50 dark:bg-slate-800/50',
        iconColor: 'text-slate-600 dark:text-slate-400',
        button: 'from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700',
        shadow: 'shadow-orange-500/20',
        accentColor: 'orange'
      }
    };
    return colors[type?.toLowerCase()] || colors.default;
  };

  const typeColor = getTypeColor(event.eventType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.08,
        ease: "easeOut"
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative w-full h-full"
    >
      {/* Subtle Outer Glow on Hover - Very Minimal */}
      <motion.div
        className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 via-blue-500/20 to-orange-500/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ zIndex: -1 }}
      />

      {/* Main Card */}
      <motion.div 
        className="relative h-full bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-slate-200 dark:border-slate-700 transition-all duration-500"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        
        {/* Banner Image */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600">
          {event.banner?.url ? (
            <>
              {/* Banner Image - Subtle Zoom */}
              <motion.img
                src={event.banner.url}
                alt={event.title}
                className="w-full h-full object-cover"
                animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />

              {/* Gradient Overlay - Slightly Darker on Hover */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
                animate={isHovered ? { opacity: 0.95 } : { opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </>
          ) : (
            /* Fallback Gradient Banner */
            <motion.div 
              className={`w-full h-full bg-gradient-to-br ${typeColor.gradient} flex items-center justify-center`}
              animate={isHovered ? { scale: 1.02 } : { scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Sparkles className="w-16 h-16 text-white/70" />
            </motion.div>
          )}
          
          {/* Event Type Badge - Subtle Scale on Card Hover */}
          {event.eventType && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.3 }}
              className="absolute top-4 right-4"
            >
              <div className={`px-3 py-1.5 rounded-full ${typeColor.badge} backdrop-blur-sm border border-white/30 shadow-lg`}>
                <span className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  {event.eventType}
                </span>
              </div>
            </motion.div>
          )}

          {/* Logo - Subtle Scale on Card Hover */}
          {event.logo?.url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: isHovered ? 1.05 : 1 
              }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-4 left-4"
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-white shadow-xl bg-white">
                <img
                  src={event.logo.url}
                  alt="Event Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-4">
          
          {/* Event Title - Subtle Color Shift on Hover */}
          <motion.h3 
            className={`text-xl font-bold bg-gradient-to-r ${typeColor.gradient} bg-clip-text text-transparent leading-tight line-clamp-2`}
            animate={isHovered ? { scale: 1.01 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {event.title}
          </motion.h3>

          {/* Description */}
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
            {event.description || 'Join us for an exciting event filled with learning and networking opportunities!'}
          </p>

          {/* Event Details - Subtle Slide on Row Hover */}
          <div className="space-y-2.5 pt-2">
            {/* Date */}
            <motion.div 
              className="flex items-center gap-3 text-slate-700 dark:text-slate-300"
              whileHover={{ x: 3 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`p-2 rounded-lg ${typeColor.icon} transition-all duration-200 group-hover:scale-105`}>
                <Calendar className={`w-4 h-4 ${typeColor.iconColor}`} />
              </div>
              <span className="text-sm font-semibold">
                {new Date(event.eventDate).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </motion.div>

            {/* Location */}
            {event.location && (
              <motion.div 
                className="flex items-center gap-3 text-slate-700 dark:text-slate-300"
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 transition-all duration-200 group-hover:scale-105">
                  <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium line-clamp-1">
                  {event.location}
                </span>
              </motion.div>
            )}

            {/* Additional Info */}
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-medium">{event.duration || '2 hours'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span className="font-medium">{event.attendees || '120'} attending</span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div
            onClick={() =>
              onViewDetails ? onViewDetails(event) : null
            }
            className="block"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full mt-6 px-6 py-3.5 rounded-xl bg-gradient-to-r ${typeColor.button} text-white font-semibold shadow-lg ${typeColor.shadow} hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden`}
            >
              {/* Subtle Shine Effect on Button Hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: '-100%' }}
                animate={isHovered ? { x: '200%' } : { x: '-100%' }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
              
              <span className="relative">View Details</span>
              <motion.div
                className="relative"
                animate={isHovered ? { x: 4 } : { x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Border Accent on Hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl ring-2 ring-transparent pointer-events-none"
          animate={isHovered ? { 
            ringColor: 'rgba(249, 115, 22, 0.2)'
          } : { 
            ringColor: 'transparent' 
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default EventCard;



// // Origional Code
// import { Link } from "react-router-dom";

// const EventCard = ({ event }) => {
//     return (
//         <div style={{border: "1px solid #ccc", padding: 16, margin: 10}} >
//             <h3>{event.title}</h3>
//             <p>{event.description}</p>

//              {event.logo?.url && (
//                 <img
//                     src={event.logo?.url}
//                     alt="logo"
//                     style={{ width: 80, height: 80 }}
//                 />
//             )}

//             {event.banner?.url && (
//                 <img
//                     src={event.banner?.url}
//                     alt="banner"
//                     style={{ width: "100%", height: 200, objectFit: "cover" }}
//                 />
//             )}

//             <p><b>Type:</b> {event.eventType}</p>
//             <p><b>Date:</b> {new Date(event.eventDate).toDateString()} </p>

//             <Link to={`/events/${event._id}`} >View Details</Link>
//         </div>
//     );
// };

// export default EventCard;