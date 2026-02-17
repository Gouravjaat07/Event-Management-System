import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getMyProfile, updateMyProfile } from "../../services/userService";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";

import {
  User,
  Mail,
  Lock,
  Shield,
  IdCard,
  Save,
  Edit3,
  CheckCircle,
  Sparkles,
  Eye,
  EyeOff
} from "lucide-react";

const Profile = () => {
  const [darkMode, setDarkMode]     = useState(false);
  const [user, setUser]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [updating, setUpdating]     = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setUser(data);
        setForm({ name: data.name, email: data.email, password: "" });
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await updateMyProfile(form);
      toast.success("Profile Updated Successfully! ✅");
      const updatedData = await getMyProfile();
      setUser(updatedData);
      setForm({ ...form, password: "" });
    } catch {
      toast.error("Failed to update profile ❌");
    } finally {
      setUpdating(false);
    }
  };

  /* role → accent color mapping so the card feels personalised */
  const roleColor = {
    admin:   { bg: "from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30", border: "border-red-200 dark:border-red-800", icon: "from-red-500 to-orange-500", text: "text-red-700 dark:text-red-400" },
    host:    { bg: "from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",   border: "border-blue-200 dark:border-blue-800", icon: "from-[#0046FF] to-[#001BB7]", text: "text-[#0046FF]" },
    student: { bg: "from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30", border: "border-purple-200 dark:border-purple-800", icon: "from-purple-500 to-pink-500", text: "text-purple-700 dark:text-purple-400" },
  };
  const rc = roleColor[user?.role] || roleColor.student;

  /* ── Loading spinner ── */
  if (loading) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="min-h-screen bg-[#F5F1DC] dark:bg-slate-900 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 md:w-14 md:h-14 border-[3px] md:border-4 border-[#FF8040] border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  /* shared input style */
  const inputBase = "w-full py-2.5 md:py-3 pr-4 rounded-lg md:rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 outline-none transition-all text-gray-900 dark:text-gray-100 text-sm md:text-base placeholder-gray-400 dark:placeholder-gray-500";

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
          {/* floating particles – fewer on mobile via CSS hidden */}
          {[...Array(5)].map((_, i) => (
            <motion.div key={i}
              animate={{ y:[0,-30,0], x:[0,i%2===0?12:-12,0], opacity:[0.3,0.6,0.3] }}
              transition={{ duration:3+i, repeat:Infinity, delay:i*0.5 }}
              className="absolute w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#FF8040] hidden sm:block"
              style={{ left:`${20+i*15}%`, top:`${30+i*10}%` }}
            />
          ))}
        </div>

        {/* ── Page content ── */}
        <div className="relative container mx-auto px-3 py-4 md:px-4 md:py-6 lg:px-8 lg:py-8 max-w-4xl">

          {/* ── Hero header card ── */}
          <motion.div
            initial={{ opacity:0, y:-20 }}
            animate={{ opacity:1, y:0 }}
            className="mb-4 md:mb-6 lg:mb-8"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl md:rounded-2xl lg:rounded-3xl p-4 md:p-6 lg:p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
              <div className="flex items-center gap-3 md:gap-5 lg:gap-6">

                {/* Avatar */}
                <motion.div
                  whileHover={{ rotate:360, scale:1.1 }}
                  transition={{ duration:0.5 }}
                  className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-[#FF8040] to-[#0046FF] flex items-center justify-center text-white font-bold text-lg md:text-2xl lg:text-3xl shadow-lg"
                >
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </motion.div>

                {/* Title */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-[#FF8040] via-[#0046FF] to-[#001BB7] bg-clip-text text-transparent mb-0.5 md:mb-2 leading-tight">
                    My Profile
                  </h1>
                  <p className="text-xs md:text-sm lg:text-base text-gray-600 dark:text-gray-400">
                    Manage your account information
                  </p>
                </div>

                {/* Sparkle – hidden on xs */}
                <motion.div
                  animate={{ rotate:[0,10,-10,0] }}
                  transition={{ duration:2, repeat:Infinity, repeatDelay:3 }}
                  className="hidden sm:block flex-shrink-0"
                >
                  <Sparkles className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-[#FF8040]" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* ── Two-column layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-5 lg:gap-6">

            {/* ── LEFT: Account Details sidebar ── */}
            <motion.div
              initial={{ opacity:0, x:-20 }}
              animate={{ opacity:1, x:0 }}
              transition={{ delay:0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 border border-gray-200 dark:border-gray-700 shadow-lg lg:sticky lg:top-24">

                <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4 lg:mb-6 flex items-center gap-1.5 md:gap-2">
                  <Shield className="w-4 h-4 md:w-5 md:h-5 text-[#0046FF]" />
                  Account Details
                </h3>

                <div className="space-y-2.5 md:space-y-3 lg:space-y-4">

                  {/* Role tile — colour adapts per role */}
                  <motion.div whileHover={{ x:4 }}
                    className={`p-3 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-r ${rc.bg} border ${rc.border}`}
                  >
                    <div className="flex items-center gap-2 md:gap-3 mb-1.5 md:mb-2">
                      <div className={`p-1.5 md:p-2 rounded-md md:rounded-lg bg-gradient-to-br ${rc.icon}`}>
                        <Shield className="w-3 h-3 md:w-4 md:h-4 text-white" />
                      </div>
                      <p className="text-[9px] md:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</p>
                    </div>
                    <p className={`text-sm md:text-base lg:text-lg font-bold capitalize ${rc.text}`}>
                      {user?.role || "N/A"}
                    </p>
                  </motion.div>

                  {/* College ID */}
                  <motion.div whileHover={{ x:4 }}
                    className="p-3 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-800"
                  >
                    <div className="flex items-center gap-2 md:gap-3 mb-1.5 md:mb-2">
                      <div className="p-1.5 md:p-2 rounded-md md:rounded-lg bg-gradient-to-br from-[#0046FF] to-[#001BB7]">
                        <IdCard className="w-3 h-3 md:w-4 md:h-4 text-white" />
                      </div>
                      <p className="text-[9px] md:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">College ID</p>
                    </div>
                    <p className="text-sm md:text-base lg:text-lg font-bold text-gray-900 dark:text-white">
                      {user?.collegeId || "Not Set"}
                    </p>
                  </motion.div>

                  {/* Status */}
                  <motion.div whileHover={{ scale:1.02 }}
                    className="p-3 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600 dark:text-green-400" />
                    <span className="text-xs md:text-sm font-bold text-green-700 dark:text-green-400">Account Active</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* ── RIGHT: Edit form ── */}
            <motion.div
              initial={{ opacity:0, x:20 }}
              animate={{ opacity:1, x:0 }}
              transition={{ delay:0.3 }}
              className="lg:col-span-2"
            >
              <form onSubmit={handleSubmit}>
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 border border-gray-200 dark:border-gray-700 shadow-lg">

                  <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-3 md:mb-5 lg:mb-6 flex items-center gap-1.5 md:gap-2">
                    <Edit3 className="w-4 h-4 md:w-5 md:h-5 text-[#FF8040]" />
                    Edit Profile
                  </h3>

                  <div className="space-y-3 md:space-y-4 lg:space-y-5">

                    {/* Full Name */}
                    <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}>
                      <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                      <div className="relative group">
                        <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 p-1.5 md:p-2 rounded-md md:rounded-lg bg-[#FF8040]/10 group-focus-within:bg-[#FF8040]/20 transition-colors">
                          <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#FF8040]" />
                        </div>
                        <input
                          type="text" name="name" value={form.name} onChange={handleChange} required
                          placeholder="Enter your full name"
                          className={`${inputBase} pl-10 md:pl-14 focus:border-[#FF8040] focus:ring-2 md:focus:ring-4 focus:ring-[#FF8040]/10`}
                        />
                      </div>
                    </motion.div>

                    {/* Email */}
                    <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}>
                      <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                      <div className="relative group">
                        <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 p-1.5 md:p-2 rounded-md md:rounded-lg bg-[#0046FF]/10 group-focus-within:bg-[#0046FF]/20 transition-colors">
                          <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#0046FF]" />
                        </div>
                        <input
                          type="email" name="email" value={form.email} onChange={handleChange} required
                          placeholder="Enter your email"
                          className={`${inputBase} pl-10 md:pl-14 focus:border-[#0046FF] focus:ring-2 md:focus:ring-4 focus:ring-[#0046FF]/10`}
                        />
                      </div>
                    </motion.div>

                    {/* Password */}
                    <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 }}>
                      <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        New Password <span className="font-normal text-gray-400">(Optional)</span>
                      </label>
                      <div className="relative group">
                        <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 p-1.5 md:p-2 rounded-md md:rounded-lg bg-[#001BB7]/10 group-focus-within:bg-[#001BB7]/20 transition-colors">
                          <Lock className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#001BB7]" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange}
                          placeholder="Enter new password"
                          className={`${inputBase} pl-10 md:pl-14 pr-10 md:pr-12 focus:border-[#001BB7] focus:ring-2 md:focus:ring-4 focus:ring-[#001BB7]/10`}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#001BB7] transition-colors"
                        >
                          {showPassword
                            ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" />
                            : <Eye     className="w-4 h-4 md:w-5 md:h-5" />}
                        </button>
                      </div>
                      <p className="mt-1.5 text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
                        Leave blank to keep current password
                      </p>
                    </motion.div>

                    {/* Submit */}
                    <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.7 }} className="pt-2 md:pt-3">
                      <motion.button
                        type="submit" disabled={updating}
                        whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                        className="w-full px-4 py-3 md:py-3.5 lg:py-4 rounded-lg md:rounded-xl bg-gradient-to-r from-[#FF8040] to-[#0046FF] hover:from-[#FF8040]/90 hover:to-[#0046FF]/90 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold shadow-lg shadow-[#FF8040]/30 hover:shadow-xl hover:shadow-[#FF8040]/50 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                      >
                        {updating ? (
                          <>
                            <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:"linear" }}
                              className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full" />
                            <span>Updating...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 md:w-5 md:h-5" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  </div>
                </div>
              </form>

              {/* Security note */}
              <motion.div
                initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.8 }}
                className="mt-3 md:mt-4 lg:mt-6 bg-blue-50 dark:bg-blue-950/30 backdrop-blur-xl rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-5 border border-blue-200 dark:border-blue-800"
              >
                <div className="flex items-start gap-2 md:gap-3">
                  <div className="p-1.5 md:p-2 rounded-md md:rounded-lg bg-blue-500 flex-shrink-0">
                    <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xs md:text-sm font-bold text-blue-900 dark:text-blue-300 mb-0.5 md:mb-1">Profile Security</h4>
                    <p className="text-[10px] md:text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                      Your account information is encrypted and secure. Role and College ID cannot be changed for security purposes.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Footer note */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.9 }}
            className="mt-4 md:mt-6 lg:mt-8 flex items-center justify-center gap-1.5 md:gap-2 text-xs md:text-sm text-gray-500 dark:text-gray-400"
          >
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
            <span>Keep your profile updated!</span>
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;