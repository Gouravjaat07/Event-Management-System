import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createEvent, updateEvent } from "../../services/hostEventService";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../styles/CustomDatePicker.css";
import { useTheme } from "../../context/ThemeContext"; // Add import

import {
  Calendar,
  FileText,
  Image as ImageIcon,
  Tag,
  Users,
  Trophy,
  Gift,
  Shield,
  Clock,
  ArrowLeft,
  Save,
  Sparkles,
  Upload,
  X,
  ChevronDown,
  Plus,
  Trash2,
  Phone,
  User,
  Check,
  Code2,
  Zap,
  PartyPopper,
  GraduationCap,
  CalendarDays
} from "lucide-react";
import Navbar from "../../components/Navbar";

const HostEventForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [darkMode, setDarkMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dropdown states
  const [eventTypeOpen, setEventTypeOpen] = useState(false);
  const [participationTypeOpen, setParticipationTypeOpen] = useState(false);

  const [banner, setBanner] = useState(null);
  const [logo, setLogo] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [existingBanner, setExistingBanner] = useState("");
  const [existingLogo, setExistingLogo] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    eventType: "",
    participationType: "Solo",
    teamSize: 1,
    rules: "",
    perks: "",
    prizes: "",
    registrationDeadline: "",
    eventDate: "",
    legalNotice: "",
    coordinators: [{ name: "", contact: "" }],
  });

  const eventTypes = [
    { value: "Hackathon", label: "Hackathon", icon: Code2, gradient: "from-[#FF8040] to-[#0046FF]", emoji: "💻" },
    { value: "Competition", label: "Competition", icon: Trophy, gradient: "from-[#0046FF] to-[#001BB7]", emoji: "🏆" },
    { value: "Fest", label: "Fest", icon: PartyPopper, gradient: "from-[#001BB7] to-[#FF8040]", emoji: "🎉" },
    { value: "Workshop", label: "Workshop", icon: GraduationCap, gradient: "from-[#FF8040] via-[#0046FF] to-[#001BB7]", emoji: "🎓" },
  ];

  const participationTypes = [
    { value: "Solo", label: "Solo Participation", icon: User, gradient: "from-[#0046FF] to-[#001BB7]", emoji: "👤" },
    { value: "Team", label: "Team Participation", icon: Users, gradient: "from-[#FF8040] to-[#0046FF]", emoji: "👥" },
  ];

  useEffect(() => {
    // Scroll to top when component mounts or id changes
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/api/events/${id}`);
        setForm({
          title: data.title || "",
          description: data.description || "",
          eventType: data.eventType || "",
          participationType: data.participationType || "Solo",
          teamSize: data.teamSize || 1,
          rules: data.rules?.join(", ") || "",
          perks: data.perks?.join(", ") || "",
          prizes: data.prizes || "",
          registrationDeadline: data.registrationDeadline?.slice(0, 10) || "",
          eventDate: data.eventDate?.slice(0, 10) || "",
          legalNotice: data.legalNotice || "",
          coordinators: data.coordinators?.length > 0 
            ? data.coordinators 
            : [{ name: "", contact: "" }],
        });
        setExistingBanner(data.banner?.url || "");
        setExistingLogo(data.logo?.url || "");
      } catch (err) {
        toast.error("Failed to load event ❌");
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "participationType" && value === "Solo" ? { teamSize: 1 } : {}),
    }));
  };

  const handleEventTypeSelect = (value) => {
    setForm((prev) => ({ ...prev, eventType: value }));
    setEventTypeOpen(false);
  };

  const handleParticipationTypeSelect = (value) => {
    setForm((prev) => ({
      ...prev,
      participationType: value,
      ...(value === "Solo" ? { teamSize: 1 } : {}),
    }));
    setParticipationTypeOpen(false);
  };

  const handleCoordinatorChange = (index, field, value) => {
    const newCoordinators = [...form.coordinators];
    newCoordinators[index][field] = value;
    setForm((prev) => ({ ...prev, coordinators: newCoordinators }));
  };

  const addCoordinator = () => {
    setForm((prev) => ({
      ...prev,
      coordinators: [...prev.coordinators, { name: "", contact: "" }],
    }));
  };

  const removeCoordinator = (index) => {
    if (form.coordinators.length > 1) {
      const newCoordinators = form.coordinators.filter((_, i) => i !== index);
      setForm((prev) => ({ ...prev, coordinators: newCoordinators }));
    }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'banner') {
          setBanner(file);
          setBannerPreview(reader.result);
          setExistingBanner("");
        } else {
          setLogo(file);
          setLogoPreview(reader.result);
          setExistingLogo("");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (type) => {
    if (type === 'banner') {
      setBanner(null);
      setBannerPreview("");
      setExistingBanner("");
    } else {
      setLogo(null);
      setLogoPreview("");
      setExistingLogo("");
    }
  };

  const cleanArray = (value) =>
    value.split(",").map((v) => v.trim()).filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (key === "rules" || key === "perks") {
        formData.append(key, JSON.stringify(cleanArray(value)));
      } else if (key === "coordinators") {
        const validCoordinators = value.filter(
          coord => coord.name.trim() || coord.contact.trim()
        );
        formData.append(key, JSON.stringify(validCoordinators));
      } else {
        formData.append(key, value);
      }
    });

    if (form.participationType === "Solo") {
      formData.set("teamSize", 1);
    }

    if (banner instanceof File) formData.append("banner", banner);
    if (logo instanceof File) formData.append("logo", logo);


    try {
      if (id) {
        await updateEvent(id, formData);
        toast.success("Event updated successfully 🎉");
      } else {
        await createEvent(formData);
        toast.success("Event created successfully 🚀");
      }
      navigate("/host");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong ❌");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedEventType = eventTypes.find(type => type.value === form.eventType);
  const selectedParticipationType = participationTypes.find(type => type.value === form.participationType);

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

        <div className="relative container mx-auto px-4 py-6 md:py-8 sm:px-6 lg:px-8 max-w-4xl">
          
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

          {/* Form Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#FF8040] to-[#0046FF]">
                  <Calendar className="w-6 md:w-8 h-6 md:h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-[#FF8040] via-[#0046FF] to-[#001BB7] dark:from-[#FF8040] dark:via-[#0046FF] dark:to-[#001BB7] bg-clip-text text-transparent">
                    {id ? "Edit Event" : "Create New Event"}
                  </h1>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                    {id ? "Update your event details" : "Fill in the details to create an amazing event"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 md:space-y-6"
          >
            
            {/* Basic Info Section */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 flex items-center gap-2">
                <FileText className="w-4 md:w-5 h-4 md:h-5 text-[#FF8040]" />
                <span className="text-base md:text-xl">Basic Information</span>
              </h2>

              <div className="space-y-3 md:space-y-4">
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="title"
                    placeholder="Enter event title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-[#FF8040] dark:focus:border-[#FF8040] focus:ring-4 focus:ring-[#FF8040]/10 outline-none transition-all text-sm md:text-base text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    placeholder="Describe your event..."
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-[#0046FF] dark:focus:border-[#0046FF] focus:ring-4 focus:ring-[#0046FF]/10 outline-none transition-all text-sm md:text-base text-gray-900 dark:text-gray-100 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 flex items-center gap-2">
                <ImageIcon className="w-4 md:w-5 h-4 md:h-5 text-[#0046FF]" />
                <span className="text-base md:text-xl">Event Images</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Banner Upload */}
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Event Banner
                  </label>
                  <div className="relative">
                    {(bannerPreview || existingBanner) ? (
                      <div className="relative group">
                        <img
                          src={bannerPreview || existingBanner}
                          alt="Banner"
                          className="w-full h-32 md:h-40 object-cover rounded-lg md:rounded-xl border-2 border-gray-200 dark:border-gray-700"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage('banner')}
                          className="absolute top-2 right-2 p-1.5 md:p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X className="w-3 md:w-4 h-3 md:h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-32 md:h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg md:rounded-xl cursor-pointer hover:border-[#FF8040] dark:hover:border-[#FF8040] transition-all bg-gray-50 dark:bg-gray-800">
                        <Upload className="w-6 md:w-8 h-6 md:h-8 text-gray-400 mb-1 md:mb-2" />
                        <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Upload Banner</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, 'banner')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Event Logo
                  </label>
                  <div className="relative">
                    {(logoPreview || existingLogo) ? (
                      <div className="relative group">
                        <img
                          src={logoPreview || existingLogo}
                          alt="Logo"
                          className="w-full h-32 md:h-40 object-cover rounded-lg md:rounded-xl border-2 border-gray-200 dark:border-gray-700"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage('logo')}
                          className="absolute top-2 right-2 p-1.5 md:p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X className="w-3 md:w-4 h-3 md:h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-32 md:h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg md:rounded-xl cursor-pointer hover:border-[#0046FF] dark:hover:border-[#0046FF] transition-all bg-gray-50 dark:bg-gray-800">
                        <Upload className="w-6 md:w-8 h-6 md:h-8 text-gray-400 mb-1 md:mb-2" />
                        <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Upload Logo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, 'logo')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 flex items-center gap-2">
                <Tag className="w-4 md:w-5 h-4 md:h-5 text-[#001BB7]" />
                <span className="text-base md:text-xl">Event Details</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {/* Event Type Dropdown */}
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Event Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setEventTypeOpen(!eventTypeOpen)}
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-[#FF8040] dark:focus:border-[#FF8040] focus:ring-4 focus:ring-[#FF8040]/10 outline-none transition-all text-left flex items-center justify-between group hover:border-[#FF8040] dark:hover:border-[#FF8040]"
                    >
                      {selectedEventType ? (
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className={`p-1.5 md:p-2 rounded-lg bg-gradient-to-br ${selectedEventType.gradient}`}>
                            <selectedEventType.icon className="w-3 md:w-4 h-3 md:h-4 text-white" />
                          </div>
                          <span className="text-sm md:text-base text-gray-900 dark:text-gray-100 font-medium">
                            {selectedEventType.label}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm md:text-base text-gray-400">Select Event Type</span>
                      )}
                      <motion.div
                        animate={{ rotate: eventTypeOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-4 md:w-5 h-4 md:h-5 text-gray-400 group-hover:text-[#FF8040]" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {eventTypeOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl md:rounded-2xl shadow-2xl overflow-hidden"
                        >
                          {eventTypes.map((type) => (
                            <motion.button
                              key={type.value}
                              type="button"
                              onClick={() => handleEventTypeSelect(type.value)}
                              whileHover={{ backgroundColor: 'rgba(255, 128, 64, 0.1)' }}
                              className="w-full px-3 md:px-4 py-2.5 md:py-3 flex items-center gap-2 md:gap-3 text-left transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                            >
                              <div className={`p-1.5 md:p-2 rounded-lg bg-gradient-to-br ${type.gradient}`}>
                                <type.icon className="w-3 md:w-4 h-3 md:h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm md:text-base text-gray-900 dark:text-gray-100 font-medium">
                                  {type.label}
                                </div>
                              </div>
                              {form.eventType === type.value && (
                                <Check className="w-4 md:w-5 h-4 md:h-5 text-[#FF8040]" />
                              )}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Participation Type Dropdown */}
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Participation Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setParticipationTypeOpen(!participationTypeOpen)}
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-[#0046FF] dark:focus:border-[#0046FF] focus:ring-4 focus:ring-[#0046FF]/10 outline-none transition-all text-left flex items-center justify-between group hover:border-[#0046FF] dark:hover:border-[#0046FF]"
                    >
                      {selectedParticipationType ? (
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className={`p-1.5 md:p-2 rounded-lg bg-gradient-to-br ${selectedParticipationType.gradient}`}>
                            <selectedParticipationType.icon className="w-3 md:w-4 h-3 md:h-4 text-white" />
                          </div>
                          <span className="text-sm md:text-base text-gray-900 dark:text-gray-100 font-medium">
                            {selectedParticipationType.label}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm md:text-base text-gray-400">Select Participation Type</span>
                      )}
                      <motion.div
                        animate={{ rotate: participationTypeOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-4 md:w-5 h-4 md:h-5 text-gray-400 group-hover:text-[#0046FF]" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {participationTypeOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl md:rounded-2xl shadow-2xl overflow-hidden"
                        >
                          {participationTypes.map((type) => (
                            <motion.button
                              key={type.value}
                              type="button"
                              onClick={() => handleParticipationTypeSelect(type.value)}
                              whileHover={{ backgroundColor: 'rgba(0, 70, 255, 0.1)' }}
                              className="w-full px-3 md:px-4 py-2.5 md:py-3 flex items-center gap-2 md:gap-3 text-left transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                            >
                              <div className={`p-1.5 md:p-2 rounded-lg bg-gradient-to-br ${type.gradient}`}>
                                <type.icon className="w-3 md:w-4 h-3 md:h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm md:text-base text-gray-900 dark:text-gray-100 font-medium">
                                  {type.label}
                                </div>
                              </div>
                              {form.participationType === type.value && (
                                <Check className="w-4 md:w-5 h-4 md:h-5 text-[#0046FF]" />
                              )}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Team Size
                  </label>
                  <input
                    name="teamSize"
                    type="number"
                    min={1}
                    disabled={form.participationType === "Solo"}
                    value={form.participationType === "Solo" ? 1 : form.teamSize}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-[#001BB7] dark:focus:border-[#001BB7] focus:ring-4 focus:ring-[#001BB7]/10 outline-none transition-all text-sm md:text-base text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Prizes
                  </label>
                  <input
                    name="prizes"
                    placeholder="e.g., ₹50,000"
                    value={form.prizes}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-[#FF8040] dark:focus:border-[#FF8040] focus:ring-4 focus:ring-[#FF8040]/10 outline-none transition-all text-sm md:text-base text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Event Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={form.eventDate ? new Date(form.eventDate) : null}
                      onChange={(date) => {
                        const formattedDate = date ? date.toISOString().slice(0, 10) : "";
                        setForm((prev) => ({ ...prev, eventDate: formattedDate }));
                      }}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select event date"
                      minDate={new Date()}
                      required
                      className="w-full cursor-pointer px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-[#0046FF] dark:focus:border-[#0046FF] focus:ring-4 focus:ring-[#0046FF]/10 outline-none transition-all text-sm md:text-base text-gray-900 dark:text-gray-100"
                      wrapperClassName="w-full"
                      calendarClassName="custom-calendar"
                    />
                    <CalendarDays className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-[#0046FF] pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Registration Deadline <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={form.registrationDeadline ? new Date(form.registrationDeadline) : null}
                      onChange={(date) => {
                        const formattedDate = date ? date.toISOString().slice(0, 10) : "";
                        setForm((prev) => ({ ...prev, registrationDeadline: formattedDate }));
                      }}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select registration deadline"
                      minDate={new Date()}
                      maxDate={form.eventDate ? new Date(form.eventDate) : null}
                      required
                      className="w-full cursor-pointer px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-[#001BB7] dark:focus:border-[#001BB7] focus:ring-4 focus:ring-[#001BB7]/10 outline-none transition-all text-sm md:text-base text-gray-900 dark:text-gray-100"
                      wrapperClassName="w-full"
                      calendarClassName="custom-calendar"
                    />
                    <CalendarDays className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-[#001BB7] pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Coordinators Section */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4 mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="w-4 md:w-5 h-4 md:h-5 text-[#FF8040]" />
                  <span className="text-base md:text-xl">Event Coordinators</span>
                </h2>
                <motion.button
                  type="button"
                  onClick={addCoordinator}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg md:rounded-xl bg-gradient-to-r from-[#FF8040] to-[#0046FF] hover:from-[#FF8040]/90 hover:to-[#0046FF]/90 text-white text-xs md:text-sm font-semibold shadow-lg shadow-[#FF8040]/30 transition-all"
                >
                  <Plus className="w-3 md:w-4 h-3 md:h-4" />
                  Add Coordinator
                </motion.button>
              </div>

              <div className="space-y-3 md:space-y-4">
                {form.coordinators.map((coordinator, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 gap-3 md:gap-4 p-3 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 border border-gray-200 dark:border-gray-700"
                  >
                    <div>
                      <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <User className="w-3 md:w-4 h-3 md:h-4 text-[#0046FF]" />
                        Coordinator Name
                      </label>
                      <input
                        placeholder="Enter coordinator name"
                        value={coordinator.name}
                        onChange={(e) =>
                          handleCoordinatorChange(index, "name", e.target.value)
                        }
                        className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-[#0046FF] dark:focus:border-[#0046FF] focus:ring-4 focus:ring-[#0046FF]/10 outline-none transition-all text-sm md:text-base text-gray-900 dark:text-gray-100"
                      />
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <Phone className="w-3 md:w-4 h-3 md:h-4 text-[#001BB7]" />
                          Contact
                        </label>
                        <input
                          placeholder="Enter contact number"
                          value={coordinator.contact}
                          onChange={(e) =>
                            handleCoordinatorChange(index, "contact", e.target.value)
                          }
                          className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-[#001BB7] dark:focus:border-[#001BB7] focus:ring-4 focus:ring-[#001BB7]/10 outline-none transition-all text-sm md:text-base text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      {form.coordinators.length > 1 && (
                        <div className="flex items-end">
                          <motion.button
                            type="button"
                            onClick={() => removeCoordinator(index)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2.5 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-br from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg shadow-red-500/30 transition-all"
                          >
                            <Trash2 className="w-4 md:w-5 h-4 md:h-5" />
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 flex items-center gap-2">
                <Sparkles className="w-4 md:w-5 h-4 md:h-5 text-[#0046FF]" />
                <span className="text-base md:text-xl">Additional Information</span>
              </h2>

              <div className="space-y-3 md:space-y-4">
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Rules (comma separated) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="rules"
                    placeholder="Rule 1, Rule 2, Rule 3..."
                    value={form.rules}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-[#FF8040] dark:focus:border-[#FF8040] focus:ring-4 focus:ring-[#FF8040]/10 outline-none transition-all text-sm md:text-base text-gray-900 dark:text-gray-100 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Perks (comma separated) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="perks"
                    placeholder="Perk 1, Perk 2, Perk 3..."
                    value={form.perks}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-[#0046FF] dark:focus:border-[#0046FF] focus:ring-4 focus:ring-[#0046FF]/10 outline-none transition-all text-sm md:text-base text-gray-900 dark:text-gray-100 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Legal Notice <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="legalNotice"
                    placeholder="Terms and conditions..."
                    value={form.legalNotice}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-[#001BB7] dark:focus:border-[#001BB7] focus:ring-4 focus:ring-[#001BB7]/10 outline-none transition-all text-sm md:text-base text-gray-900 dark:text-gray-100 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Link to="/host" className="flex-1 order-2 sm:order-1">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 md:px-6 py-3 md:py-4 rounded-lg md:rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-bold transition-all text-sm md:text-base"
                >
                  Cancel
                </motion.button>
              </Link>
              
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 order-1 sm:order-2 px-4 md:px-6 py-3 md:py-4 rounded-lg md:rounded-xl bg-gradient-to-r from-[#FF8040] to-[#0046FF] hover:from-[#FF8040]/90 hover:to-[#0046FF]/90 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold shadow-lg shadow-[#FF8040]/30 hover:shadow-xl hover:shadow-[#FF8040]/50 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 md:w-5 h-4 md:h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 md:w-5 h-4 md:h-5" />
                    <span>{id ? "Update Event" : "Create Event"}</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default HostEventForm;



// import { useEffect, useState } from "react";
// import { createEvent, updateEvent } from "../../services/hostEventService";
// import { useNavigate, useParams } from "react-router-dom";
// import api from "../../services/api";
// import toast from "react-hot-toast";

// // const hostId = localStorage.getItem("hostId");
// const HostEventForm = ({ event, hostId }) => {
//     const navigate = useNavigate();
//     const { id } = useParams(); // 👈 event id from URL (edit mode)
//     const [banner, setBanner] = useState(null);
//     const [logo, setLogo] = useState(null);
//     const [coordinators, setCoordinators] = useState("");

//     const [form, setForm] = useState({
//         title: "",
//         description: "",
//         eventType: "",
//         participationType: "Solo",
//         teamSize: 1,
//         rules: "",
//         perks: "",
//         prizes: "",
//         registrationDeadline: "",
//         eventDate: "",
//         legalNotice: "",
//         coordinators: "",
//     });


//     // 🔹 Load event ONLY in edit mode
//     useEffect(() => {
//         if (id) {
//             api.get(`/api/events/${id}`).then(res => {
//                 const data = res.data;
//                 setForm({
//                     ...data,
//                     rules: data.rules?.join(",") || "",
//                     perks: data.perks?.join(",") || "",
//                 });
//             });
//         }
//     }, [id]);

//     const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//     // const handleSubmit = async (event) => {
//     //     event.preventDefault();
//     //     const formData = new FormData();

//     //     Object.entries(form).forEach(([key, value]) => {
//     //     if (key === "rules" || key === "perks") {
//     //         formData.append(key, JSON.stringify(value.split(",")));
//     //     } else if (key !== "banner" && key !== "logo") {
//     //         formData.append(key, value);
//     //     }
//     //     });

//     //     // Append images ONLY if user selected new ones
//     //     if (logo instanceof File) {
//     //         formData.append("logo", logo);
//     //     }

//     //     if (banner instanceof File) {
//     //         formData.append("banner", banner);
//     //     }

//     //     try {
//     //         if (id) {
//     //             // ✅ EDIT EVENT
//     //             await updateEvent(id, formData);
//     //             // toast.success("Event updated successfully 🎉");
//     //         } else {
//     //             // ✅ CREATE EVENT
//     //             await createEvent(formData);
//     //             // toast.success("Event created successfully 🚀");
//     //         }

//     //         navigate("/host");
//     //     } catch (err) {
//     //         // alert(err.response?.data?.message || "Something went wrong");
//     //         toast.error(err.response?.data?.message || "Something went wrong ❌");
//     //     }
    
//     // }


//     const handleSubmit = async (event) => {
//       event.preventDefault();

//       const formData = new FormData();

//       Object.entries(form).forEach(([key, value]) => {
//         if (!value) return;

//         if (key === "rules" || key === "perks") {
//           formData.append(key, JSON.stringify(value.split(",").map(v => v.trim())));
//         }

//         else if (key === "coordinators") {
//           const coordinatorsArray = value.split(",").map(c => {
//             const [name, contact] = c.split(":");
//             return {
//               name: name?.trim(),
//               contact: contact?.trim(),
//             };
//           });

//           formData.append("coordinators", JSON.stringify(coordinatorsArray));
//         }

//         else if (key !== "banner" && key !== "logo") {
//           formData.append(key, value);
//         }
//       });

//       // append files only if selected
//       if (logo instanceof File) {
//         formData.append("logo", logo);
//       }

//       if (banner instanceof File) {
//         formData.append("banner", banner);
//       }

//       try {
//         if (id) {
//           await updateEvent(id, formData);
//         } else {
//           await createEvent(formData);
//         }
//         navigate("/host");
//       } catch (err) {
//         toast.error(err.response?.data?.message || "Something went wrong ❌");
//       }
//     };



//     return (
//         <form onSubmit={handleSubmit} >
//             <h2>{id ? "Edit Event": "Create Event"}</h2>

//             <input
//                 name="title"
//                 placeholder="Title"
//                 onChange={handleChange}
//                 value={form.title}
//                 required
//             />
//             <textarea
//                 name="description"
//                 placeholder="Description"
//                 onChange={handleChange}
//                 value={form.description}
//                 required
//             />
//             {/* <input
//                 name="eventType"
//                 placeholder="Hackathon / Fest"
//                 onChange={handleChange}
//                 value={form.eventType}
//             /> */}

//             <input
//                 type="file"
//                 accept="image/*"
//                 onChange={e => setLogo(e.target.files[0])}
//             />

//             <input
//                 type="file"
//                 accept="image/*"
//                 onChange={e => setBanner(e.target.files[0])}
//             />

//             <select
//                 name="eventType"
//                 value={form.eventType}
//                 onChange={handleChange}
//                 required
//             >
//                 <option value="">Select Event Type</option>
//                 <option value="Hackathon">Hackathon</option>
//                 <option value="Competition">Competition</option>
//                 <option value="Fest">Fest</option>
//                 <option value="Workshop">Workshop</option>
//             </select>

//             <select name="participationType" 
//                 value={form.participationType} onChange={handleChange}
//                 required
//             >
//                 <option value="Solo">Solo</option>
//                 <option value="Team">Team</option>
//             </select>

//             <input
//                 name="teamSize" 
//                 type="number" 
//                 onChange={handleChange} 
//                 value={form.teamSize} 
//                 required
//             />
//             <input
//                 name="rules" 
//                 placeholder="Rules (comma separated)" 
//                 onChange={handleChange} 
//                 value={form.rules}
//                 required
//             />
//             <input
//                 name="perks" 
//                 placeholder="Perks (comma separated)" 
//                 onChange={handleChange} 
//                 value={form.perks}
//                 required
//             />
//             <input
//                 name="prizes" 
//                 placeholder="Prizes" 
//                 onChange={handleChange} 
//                 value={form.prizes}
//             />
//             <label htmlFor= "registrationDeadline" required>Registration Deadline: </label>
//             <input type="date" 
//                 name="registrationDeadline" 
//                 onChange={handleChange} 
//                 placeholder="Deadline"
//                 id="registrationDeadline"
//                 value={form.registrationDeadline?.slice(0, 10)}
//                 required
//             />
//             <label htmlFor="eventDate" required>Event Date: </label>
//             <input type="date" 
//                 name="eventDate" 
//                 onChange={handleChange} 
//                 placeholder="Event Date"
//                 id="eventDate"
//                 value={form.eventDate?.slice(0, 10)}
//                 required
//             />

//             <textarea
//               placeholder="Coordinators (Name:Contact, comma separated)"
//               value={coordinators}
//               onChange={(e) => setCoordinators(e.target.value)}
//             />

//             <textarea
//                 name="legalNotice" 
//                 placeholder="Legal Notice" 
//                 onChange={handleChange} 
//                 value={form.legalNotice}
//                 required
//             />

//             <button type="submit">Save Event</button>
//         </form>
//     );
// };


// export default HostEventForm;