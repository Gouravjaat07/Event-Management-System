import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Users, Target, Lightbulb, Heart, Code, Palette,
  Award, Mail, Linkedin, Github, Send, MessageSquare,
  CheckCircle, Star, Rocket, Shield, Zap, BookOpen, ChevronRight,
  Database, Server, Layout, Lock, Cloud, FileCode, Layers, ChevronDown
} from "lucide-react";
import Navbar from "../../components/Navbar";
import { useTheme } from "../../context/ThemeContext";
import { submitFeedback } from "../../services/feedbackService";
import toast from "react-hot-toast";

// ══════════════════════════════════════════════════════════
// TEAM MEMBER CARD
// ══════════════════════════════════════════════════════════
const TeamMemberCard = ({ member, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.15 }}
    whileHover={{ y: -8, scale: 1.02 }}
    className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-500 overflow-hidden"
  >
    {/* Gradient overlay on hover */}
    <motion.div
      className="absolute inset-0 bg-gradient-to-br from-[#FF8040]/5 to-[#0046FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
    />

    <div className="relative">
      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-[#FF8040] to-[#0046FF] p-1 shadow-xl"
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-top md:object-center"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-5xl font-black text-slate-700 dark:text-slate-300">
                  {member.initials}
                </div>
              )}
            </div>
          </motion.div>
          {/* Role badge */}
          <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#FF8040] to-[#0046FF] text-white text-xs font-bold shadow-lg">
            {member.badge}
          </div>
        </div>
      </div>

      {/* Name & Role */}
      <div className="text-center mb-4">
        <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-2">
          {member.name}
        </h3>
        <p className="text-sm md:text-base text-[#0046FF] dark:text-[#FF8040] font-semibold mb-1">
          {member.role}
        </p>
        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
          {member.specialization}
        </p>
      </div>

      {/* Bio */}
      <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 text-center leading-relaxed mb-6">
        {member.bio}
      </p>

      {/* Tech Stack Tags */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {member.skills.map((skill, i) => (
          <span
            key={i}
            className="px-3 py-1 rounded-full bg-gradient-to-r from-[#FF8040]/10 to-[#0046FF]/10 dark:from-[#FF8040]/20 dark:to-[#0046FF]/20 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-[#0046FF]/20"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Social Links */}
      <div className="flex gap-3 justify-center">
        {member.linkedin && (
          <motion.a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-600 text-blue-600 hover:text-white transition-all shadow-md group/link"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </motion.a>
        )}
        {member.github && (
          <motion.a
            href={member.github}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.15, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-white transition-all shadow-md"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </motion.a>
        )}
        {member.email && (
          <motion.a
            href={`mailto:${member.email}`}
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-xl bg-gradient-to-r from-[#FF8040]/10 to-[#0046FF]/10 hover:from-[#FF8040] hover:to-[#0046FF] text-slate-700 dark:text-slate-300 hover:text-white transition-all shadow-md"
            aria-label="Email"
          >
            <Mail className="w-5 h-5" />
          </motion.a>
        )}
      </div>
    </div>
  </motion.div>
);

// ══════════════════════════════════════════════════════════
// CUSTOM DROPDOWN COMPONENT
// ══════════════════════════════════════════════════════════
const CustomDropdown = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      {/* Dropdown Button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 hover:border-[#0046FF] dark:hover:border-[#FF8040] focus:border-[#0046FF] dark:focus:border-[#FF8040] outline-none transition-all text-left flex items-center justify-between group"
      >
        <span className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-medium">
          <span className="text-lg">{selectedOption?.icon}</span>
          <span>{selectedOption?.label}</span>
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-[#0046FF] dark:group-hover:text-[#FF8040] transition-colors" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown List */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute z-20 w-full mt-2 py-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden"
            >
              {options.map((option, index) => (
                <motion.button
                  key={option.value}
                  type="button"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    onChange({ target: { name: 'category', value: option.value } });
                    setIsOpen(false);
                  }}
                  whileHover={{ backgroundColor: 'rgba(0, 70, 255, 0.05)' }}
                  className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-all ${
                    value === option.value
                      ? 'bg-gradient-to-r from-[#FF8040]/10 to-[#0046FF]/10 dark:from-[#FF8040]/20 dark:to-[#0046FF]/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <span className="text-xl">{option.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">
                      {option.label}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {option.description}
                    </p>
                  </div>
                  {value === option.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF8040] to-[#0046FF]"
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// FEEDBACK FORM
// ══════════════════════════════════════════════════════════
const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "suggestion",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryOptions = [
    { 
      value: "suggestion", 
      icon: "💡", 
      label: "Suggestion",
      description: "Share your ideas with us"
    },
    { 
      value: "bug", 
      icon: "🐛", 
      label: "Bug Report",
      description: "Report technical issues"
    },
    { 
      value: "feature", 
      icon: "✨", 
      label: "Feature Request",
      description: "Request new functionality"
    },
    { 
      value: "feedback", 
      icon: "💬", 
      label: "General Feedback",
      description: "Share your thoughts"
    },
    { 
      value: "other", 
      icon: "📌", 
      label: "Other",
      description: "Anything else"
    },
  ];

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    await submitFeedback(formData);

    toast.success("Feedback sent successfully 🎉");
    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      category: "suggestion",
      message: "",
    });

  } catch (error) {
    toast.error(
      error.response?.data?.message || "Something went wrong ❌"
    );
  }

  setIsSubmitting(false);
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 lg:p-10 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF8040]/5 via-transparent to-[#0046FF]/5 pointer-events-none" />

      <div className="relative">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF8040]/10 to-[#0046FF]/10 dark:from-[#FF8040]/20 dark:to-[#0046FF]/20 border border-[#FF8040]/20 mb-4"
          >
            <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-[#FF8040]" />
            <span className="text-sm md:text-base font-bold text-slate-700 dark:text-slate-300">
              Share Your Feedback
            </span>
          </motion.div>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-3">
            Help Us{" "}
            <span className="bg-gradient-to-r from-[#FF8040] to-[#0046FF] bg-clip-text text-transparent">
              Improve
            </span>
          </h3>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Have ideas, suggestions, or found a bug? We'd love to hear from you!
          </p>
        </div>

        {/* Form */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus:border-[#0046FF] dark:focus:border-[#FF8040] outline-none transition-all text-slate-800 dark:text-slate-100"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus:border-[#0046FF] dark:focus:border-[#FF8040] outline-none transition-all text-slate-800 dark:text-slate-100"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Category - Custom Premium Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Category *
              </label>
              <CustomDropdown
                value={formData.category}
                onChange={handleChange}
                options={categoryOptions}
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Your Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus:border-[#0046FF] dark:focus:border-[#FF8040] outline-none transition-all text-slate-800 dark:text-slate-100 resize-none"
                placeholder="Tell us what's on your mind..."
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-[#FF8040] to-[#0046FF] text-white font-bold shadow-lg hover:shadow-xl transition-all text-base md:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Feedback
                </>
              )}
            </motion.button>
          </form>
        ) : (
          // Success Message
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mb-6"
            >
              <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </motion.div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-3">
              Thank You! 🎉
            </h3>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 text-center">
              Your feedback has been received. We appreciate your input!
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// ══════════════════════════════════════════════════════════
// MAIN ABOUT COMPONENT
// ══════════════════════════════════════════════════════════
const About = () => {
  const { darkMode } = useTheme();

  // Team Data
  const teamMembers = [
    {
      name: "Gourav",
      role: "Full Stack Developer",
      specialization: "Backend Architecture Lead",
      initials: "GR",
      badge: "Dev",
      bio: "Architected the entire backend infrastructure, implemented authentication systems, and optimized database performance for seamless event management.",
      skills: ["Node.js", "Express", "MongoDB", "JWT", "REST APIs"],
      linkedin: "https://www.linkedin.com/in/gourav-jaat/",
      github: "https://github.com/Gouravjaat07",
      image: "/Gourav_IMG_.png",
    },
    {
      name: "Aditya Sharma",
      role: "Frontend Developer",
      specialization: "UI/UX Integration Specialist",
      initials: "AS",
      badge: "Dev",
      bio: "Crafted responsive and intuitive user interfaces, integrated frontend with backend APIs, and ensured pixel-perfect design implementations.",
      skills: ["React", "Tailwind CSS", "Framer Motion", "API Integration"],
      linkedin: "https://www.linkedin.com/in/aditya-sharma-8b2aa9244/",
      github: "https://github.com/unknnown001",
      image: "/Aditya_Sharma.jpeg",
    },
  ];

  const coordinator = {
    name: "Ms. Ritu Rana",
    role: "Project Coordinator",
    specialization: "Academic Mentor & Guide",
    initials: "RR",
    badge: "Guide",
    bio: "Provided invaluable guidance and mentorship throughout the project development. Her expertise and support were instrumental in shaping this platform.",
    skills: ["Mentorship", "Project Management", "Academic Guidance"],
    linkedin: "https://www.linkedin.com/in/ritu-rana-08826756/",
    email: "ritu.rana@svsu.ac.in",
    image: "/RR-SVSU.jpeg",
  };

  // Features Data
  const features = [
    {
      icon: Shield,
      title: "Secure Authentication",
      description: "Role-based access control with JWT tokens ensuring data security",
      color: "#FF8040",
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Create teams, manage members, and collaborate on events seamlessly",
      color: "#0046FF",
    },
    {
      icon: Zap,
      title: "Real-Time Updates",
      description: "Instant notifications via email and automated deadline reminders",
      color: "#a855f7",
    },
    {
      icon: BookOpen,
      title: "Easy Event Creation",
      description: "Intuitive interface for hosts to create and manage campus events",
      color: "#ec4899",
    },
  ];

  const techStack = [
    { 
      name: "MongoDB", 
      icon: Database,
      color: "from-green-500 to-green-600",
      description: "NoSQL Database"
    },
    { 
      name: "Express.js", 
      icon: Server,
      color: "from-slate-600 to-slate-700",
      description: "Backend Framework"
    },
    { 
      name: "React.js", 
      icon: Layout,
      color: "from-blue-400 to-blue-600",
      description: "Frontend Library"
    },
    { 
      name: "Node.js", 
      icon: Server,
      color: "from-green-600 to-green-700",
      description: "Runtime Environment"
    },
    { 
      name: "JWT", 
      icon: Lock,
      color: "from-purple-500 to-purple-600",
      description: "Authentication"
    },
    { 
      name: "Cloudinary", 
      icon: Cloud,
      color: "from-blue-400 to-indigo-500",
      description: "Media Storage"
    },
    { 
      name: "Nodemailer", 
      icon: Mail,
      color: "from-red-500 to-pink-600",
      description: "Email Service"
    },
    { 
      name: "Tailwind CSS", 
      icon: Palette,
      color: "from-cyan-400 to-blue-500",
      description: "Styling Framework"
    },
    { 
      name: "Framer Motion", 
      icon: Zap,
      color: "from-pink-500 to-purple-600",
      description: "Animations"
    },
    { 
      name: "REST API", 
      icon: Layers,
      color: "from-orange-500 to-red-600",
      description: "Architecture"
    },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark bg-slate-900" : "bg-[#F5F1DC]"}`}>
      <Navbar />

      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 md:w-96 h-80 md:h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle,#FF8040 0%,#FF804000 70%)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 md:w-96 h-80 md:h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle,#0046FF 0%,#0046FF00 70%)" }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.2, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* Main Content */}
      <div className="relative pt-20 md:pt-28 pb-12 md:pb-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 md:mb-20"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-full bg-gradient-to-r from-[#FF8040]/10 to-[#0046FF]/10 dark:from-[#FF8040]/20 dark:to-[#0046FF]/20 border-2 border-[#FF8040]/30 mb-6 shadow-lg"
            >
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-[#FF8040]" />
              <span className="text-sm md:text-base font-bold bg-gradient-to-r from-[#FF8040] to-[#0046FF] bg-clip-text text-transparent">
                About Our Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight px-4"
            >
              <span className="bg-gradient-to-r from-[#FF8040] via-[#0046FF] to-[#001BB7] bg-clip-text text-transparent">
                Event Management
              </span>
              <br />
              <span className="text-slate-800 dark:text-white">Reimagined</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base sm:text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed px-4"
            >
              A comprehensive full-stack solution designed to{" "}
              <span className="font-bold text-slate-800 dark:text-white">
                simplify and digitize
              </span>{" "}
              the entire event management ecosystem within campus life
            </motion.p>
          </motion.div>

          {/* Project Coordinator - FIRST */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 md:mb-24"
          >
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF8040]/10 to-[#0046FF]/10 border border-[#FF8040]/20 mb-4"
              >
                <Award className="w-4 h-4 md:w-5 md:h-5 text-[#FF8040]" />
                <span className="text-sm md:text-base font-bold text-slate-700 dark:text-slate-300">
                  Academic Guidance
                </span>
              </motion.div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-4">
                Under the Guidance of
              </h2>
            </div>

            <div className="max-w-2xl mx-auto">
              <TeamMemberCard member={coordinator} index={0} />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-center"
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF8040]/10 to-[#0046FF]/10 border border-[#FF8040]/20">
                <Heart className="w-5 h-5 text-[#FF8040] fill-[#FF8040]" />
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium">
                  We sincerely thank{" "}
                  <span className="font-bold text-slate-800 dark:text-white">Ms. Ritu Rana Mam</span> for her
                  invaluable support and mentorship
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Development Team - Second */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 md:mb-24"
          >
            <div className="text-center mb-10 md:mb-14">
              <motion.div
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF8040]/10 to-[#0046FF]/10 border border-[#0046FF]/20 mb-4"
              >
                <Users className="w-4 h-4 md:w-5 md:h-5 text-[#0046FF]" />
                <span className="text-sm md:text-base font-bold text-slate-700 dark:text-slate-300">
                  Development Team
                </span>
              </motion.div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-4">
                Meet the{" "}
                <span className="bg-gradient-to-r from-[#FF8040] to-[#0046FF] bg-clip-text text-transparent">
                  Creators
                </span>
              </h2>
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Passionate developers committed to revolutionizing campus event management
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
              {teamMembers.map((member, index) => (
                <TeamMemberCard key={index} member={member} index={index} />
              ))}
            </div>
          </motion.div>

          {/* Purpose Section - THIRD */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 md:mb-24"
          >
            <div className="text-center mb-10 md:mb-14">
              <motion.div
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF8040]/10 to-[#0046FF]/10 border border-[#0046FF]/20 mb-4"
              >
                <Target className="w-4 h-4 md:w-5 md:h-5 text-[#0046FF]" />
                <span className="text-sm md:text-base font-bold text-slate-700 dark:text-slate-300">
                  Our Mission
                </span>
              </motion.div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-4">
                Why We Built{" "}
                <span className="bg-gradient-to-r from-[#FF8040] to-[#0046FF] bg-clip-text text-transparent">
                  This Platform
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-500"
                >
                  <div
                    className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <feature.icon className="w-7 h-7 md:w-8 md:h-8" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tech Stack - FOURTH with better design */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 md:mb-24"
          >
            <div className="text-center mb-10 md:mb-14">
              <motion.div
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF8040]/10 to-[#0046FF]/10 border border-[#FF8040]/20 mb-4"
              >
                <Code className="w-4 h-4 md:w-5 md:h-5 text-[#FF8040]" />
                <span className="text-sm md:text-base font-bold text-slate-700 dark:text-slate-300">
                  Technology Stack
                </span>
              </motion.div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-4">
                Built With Modern{" "}
                <span className="bg-gradient-to-r from-[#FF8040] to-[#0046FF] bg-clip-text text-transparent">
                  Technologies
                </span>
              </h2>
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Powered by industry-leading tools and frameworks
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {techStack.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-500 overflow-hidden"
                >
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <div className="relative text-center">
                    {/* Icon */}
                    <div className={`w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${tech.color} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                      <tech.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                    </div>
                    
                    {/* Name */}
                    <h3 className="text-sm md:text-base font-bold text-slate-800 dark:text-white mb-1">
                      {tech.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {tech.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* MERN Stack Highlight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-10 md:mt-12 text-center"
            >
              <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-[#FF8040]/10 via-[#0046FF]/10 to-[#001BB7]/10 border-2 border-[#0046FF]/20 backdrop-blur-sm">
                <Rocket className="w-6 h-6 text-[#FF8040]" />
                <p className="text-base md:text-lg font-bold text-slate-800 dark:text-white">
                  Full-Stack MERN Application
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Feedback Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <FeedbackForm />
          </motion.div>

        </div>
      </div>

      {/* Footer */}
      <footer className="relative mt-16 md:mt-24 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 text-white overflow-hidden">
        <div className="relative h-1 bg-gradient-to-r from-[#FF8040] via-[#0046FF] to-[#001BB7]" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF8040] to-[#0046FF] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#FF8040] to-[#0046FF] bg-clip-text text-transparent">
                SVSU Events
              </h3>
            </div>
            <p className="text-slate-400 text-sm md:text-base mb-4">
              Empowering campus life through technology
            </p>
            <p className="text-slate-500 text-xs md:text-sm flex items-center justify-center gap-2">
              © 2026 SVSU Events. Crafted with
              <Heart className="w-4 h-4 text-[#FF8040] fill-[#FF8040]" />
              for students
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;