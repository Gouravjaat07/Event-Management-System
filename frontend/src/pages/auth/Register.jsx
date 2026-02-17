import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext"; // Add import


import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  ArrowRight,
  Sparkles,
  Calendar,
  User,
  IdCard,
  LogIn,
  GraduationCap,
  Users
} from "lucide-react";
import Navbar from "../../components/Navbar";

const Register = () => {
    const navigate      = useNavigate();
    const { register }  = useAuth();
    const [darkMode, setDarkMode]         = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading]       = useState(false);
    const [formData, setFormData]         = useState({
        name: "", email: "", collegeId: "", password: "", role: "student",
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await register(formData);
            toast.success("Registration successful ✅");
            navigate("/");
        } catch (err) {
            toast.error("Registration Invalid ❌");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); });

    const roleOptions = [
        { value:"student",  label:"Student",    icon:GraduationCap, description:"Attend & discover events", color:"from-[#0046FF] to-[#001BB7]" },
        { value:"host",     label:"Event Host",  icon:Users,         description:"Create & manage events",   color:"from-[#FF8040] to-[#0046FF]" },
    ];

    /* shared input style */
    const inputBase = "w-full py-2.5 md:py-3 rounded-lg md:rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-[#0046FF] focus:ring-2 md:focus:ring-4 focus:ring-[#0046FF]/10 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-500 text-sm md:text-base";
    const labelClass = "block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2";
    const iconSlot   = "absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none";

    return (
        <div className={darkMode ? 'dark' : ''}>
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

            <div className="min-h-screen bg-[#F5F1DC] dark:bg-slate-900 transition-colors duration-500 flex items-center justify-center px-3 py-8 md:px-4 md:py-12">

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
                    {[...Array(12)].map((_, i) => (
                        <motion.div key={i}
                            animate={{ y:[0,-30,0], x:[0,i%2===0?10:-10,0], opacity:[0.2,0.4,0.2] }}
                            transition={{ duration:3+Math.random()*2, repeat:Infinity, delay:Math.random()*2 }}
                            className="absolute w-1.5 h-1.5 md:w-2 md:h-2 rounded-full hidden sm:block"
                            style={{ left:`${Math.random()*100}%`, top:`${Math.random()*100}%`, background:i%2===0?'#FF8040':'#0046FF' }}
                        />
                    ))}
                </div>

                {/* Card wrapper */}
                <motion.div
                    initial={{ opacity:0, y:20 }}
                    animate={{ opacity:1, y:0 }}
                    transition={{ duration:0.5 }}
                    className="relative w-full max-w-sm md:max-w-md z-10"
                >
                    {/* Glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#FF8040] via-[#0046FF] to-[#001BB7] rounded-2xl md:rounded-3xl blur-2xl opacity-20 dark:opacity-30 animate-pulse" />

                    {/* Main card */}
                    <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">

                        {/* ── Header ── */}
                        <div className="relative px-5 pt-6 pb-5 md:p-8 md:pb-6 bg-gradient-to-br from-[#FF8040] via-[#0046FF] to-[#001BB7]">
                            <motion.div
                                animate={{ backgroundPosition:['0% 0%','100% 100%'] }}
                                transition={{ duration:10, repeat:Infinity, repeatType:"reverse" }}
                                className="absolute inset-0 opacity-20 pointer-events-none"
                                style={{ backgroundImage:'radial-gradient(circle,white 1px,transparent 1px)', backgroundSize:'18px 18px' }}
                            />
                            <div className="relative z-10">
                                <motion.div initial={{ scale:0, rotate:-180 }} animate={{ scale:1, rotate:0 }} transition={{ duration:0.5, delay:0.2 }}
                                    className="flex justify-center mb-3 md:mb-4"
                                >
                                    <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-xl">
                                        <motion.div animate={{ rotate:360 }} transition={{ duration:20, repeat:Infinity, ease:"linear" }}>
                                            <Calendar className="w-7 h-7 md:w-10 md:h-10 text-white" />
                                        </motion.div>
                                    </div>
                                </motion.div>
                                <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
                                    className="text-2xl md:text-3xl font-black text-white text-center mb-1.5 md:mb-2"
                                >
                                    Join SVSU Events
                                </motion.h1>
                                <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}
                                    className="text-white/90 text-center text-xs md:text-sm"
                                >
                                    Create your account and start exploring
                                </motion.p>
                            </div>
                        </div>

                        {/* ── Form ── */}
                        <div className="px-4 py-5 md:p-8">
                            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">

                                {/* Full Name */}
                                <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.5 }}>
                                    <label className={labelClass}>Full Name</label>
                                    <div className="relative group">
                                        <div className={iconSlot}><User className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-focus-within:text-[#0046FF] transition-colors" /></div>
                                        <input type="text" name="name" placeholder="Enter your full name"
                                            value={formData.name} onChange={handleChange} required
                                            className={`${inputBase} pl-9 md:pl-12 pr-3 md:pr-4`} />
                                    </div>
                                </motion.div>

                                {/* Email */}
                                <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.6 }}>
                                    <label className={labelClass}>Email Address</label>
                                    <div className="relative group">
                                        <div className={iconSlot}><Mail className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-focus-within:text-[#0046FF] transition-colors" /></div>
                                        <input type="email" name="email" placeholder="Enter your email"
                                            value={formData.email} onChange={handleChange} required
                                            className={`${inputBase} pl-9 md:pl-12 pr-3 md:pr-4`} />
                                    </div>
                                </motion.div>

                                {/* College ID */}
                                <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.7 }}>
                                    <label className={labelClass}>College ID</label>
                                    <div className="relative group">
                                        <div className={iconSlot}><IdCard className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-focus-within:text-[#0046FF] transition-colors" /></div>
                                        <input type="text" name="collegeId" placeholder="Enter your college ID"
                                            value={formData.collegeId} onChange={handleChange} required
                                            className={`${inputBase} pl-9 md:pl-12 pr-3 md:pr-4`} />
                                    </div>
                                </motion.div>

                                {/* Password */}
                                <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.8 }}>
                                    <label className={labelClass}>Password</label>
                                    <div className="relative group">
                                        <div className={iconSlot}><Lock className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-focus-within:text-[#0046FF] transition-colors" /></div>
                                        <input type={showPassword ? "text" : "password"} name="password" placeholder="Create a strong password"
                                            value={formData.password} onChange={handleChange} required
                                            className={`${inputBase} pl-9 md:pl-12 pr-10 md:pr-12`} />
                                        <motion.button type="button" whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 md:pr-4 flex items-center"
                                        >
                                            {showPassword
                                                ? <EyeOff className="w-4 h-4 md:w-5 md:h-5 text-gray-400 hover:text-[#0046FF] transition-colors" />
                                                : <Eye    className="w-4 h-4 md:w-5 md:h-5 text-gray-400 hover:text-[#0046FF] transition-colors" />}
                                        </motion.button>
                                    </div>
                                </motion.div>

                                {/* Role Selection */}
                                <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.9 }}>
                                    <label className={labelClass}>I want to join as</label>
                                    <div className="grid grid-cols-2 gap-2 md:gap-3">
                                        {roleOptions.map((option, index) => {
                                            const Icon = option.icon;
                                            const selected = formData.role === option.value;
                                            return (
                                                <motion.label key={option.value}
                                                    whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                                                    initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                                                    transition={{ delay:0.9 + index * 0.1 }}
                                                    className={`relative cursor-pointer rounded-lg md:rounded-xl p-3 md:p-4 border-2 transition-all duration-300 ${
                                                        selected
                                                            ? 'border-[#0046FF] bg-[#0046FF]/5 dark:bg-[#0046FF]/10 shadow-lg shadow-[#0046FF]/20'
                                                            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-[#0046FF]/50'
                                                    }`}
                                                >
                                                    <input type="radio" name="role" value={option.value}
                                                        checked={selected} onChange={handleChange} className="sr-only" />
                                                    <div className="flex flex-col items-center text-center gap-1.5 md:gap-2">
                                                        <motion.div
                                                            animate={selected ? { rotate:360 } : {}}
                                                            transition={{ duration:0.6 }}
                                                            className={`p-1.5 md:p-2 rounded-md md:rounded-lg bg-gradient-to-br ${option.color}`}
                                                        >
                                                            <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                                        </motion.div>
                                                        <div>
                                                            <p className={`text-xs md:text-sm font-bold ${selected ? 'text-[#0046FF]' : 'text-gray-700 dark:text-gray-300'}`}>
                                                                {option.label}
                                                            </p>
                                                            <p className="text-[9px] md:text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">
                                                                {option.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {selected && (
                                                        <motion.div layoutId="roleSelected"
                                                            className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-4 h-4 md:w-5 md:h-5 bg-[#0046FF] rounded-full flex items-center justify-center"
                                                        >
                                                            <motion.svg initial={{ scale:0 }} animate={{ scale:1 }}
                                                                className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </motion.svg>
                                                        </motion.div>
                                                    )}
                                                </motion.label>
                                            );
                                        })}
                                    </div>
                                </motion.div>

                                {/* Create Account button */}
                                <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.1 }} className="pt-1 md:pt-2">
                                    <motion.button type="submit" disabled={isLoading}
                                        whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                                        className="w-full px-4 py-3 md:py-4 rounded-lg md:rounded-xl bg-gradient-to-r from-[#FF8040] to-[#0046FF] hover:from-[#FF8040]/90 hover:to-[#0046FF]/90 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold shadow-lg shadow-[#0046FF]/30 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm md:text-base"
                                    >
                                        {isLoading ? (
                                            <>
                                                <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:"linear" }}
                                                    className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full" />
                                                <span>Creating Account...</span>
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="w-4 h-4 md:w-5 md:h-5" />
                                                <span>Create Account</span>
                                                <motion.div animate={{ x:[0,4,0] }} transition={{ duration:1.5, repeat:Infinity }}>
                                                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                                                </motion.div>
                                            </>
                                        )}
                                    </motion.button>
                                </motion.div>

                                {/* Divider */}
                                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.2 }}
                                    className="relative my-3 md:my-6"
                                >
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300 dark:border-gray-700" />
                                    </div>
                                    <div className="relative flex justify-center text-xs md:text-sm">
                                        <span className="px-3 md:px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-medium">
                                            Already have an account?
                                        </span>
                                    </div>
                                </motion.div>

                                {/* Login link */}
                                <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.3 }}>
                                    <Link to="/login">
                                        <motion.button type="button" whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                                            className="w-full px-4 py-3 md:py-4 rounded-lg md:rounded-xl border-2 border-[#0046FF] text-[#0046FF] hover:bg-[#0046FF]/5 dark:hover:bg-[#0046FF]/10 font-bold transition-all duration-300 flex items-center justify-center gap-2 text-sm md:text-base"
                                        >
                                            <LogIn className="w-4 h-4 md:w-5 md:h-5" />
                                            <span>Sign In Instead</span>
                                        </motion.button>
                                    </Link>
                                </motion.div>
                            </form>
                        </div>

                        {/* Footer */}
                        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.4 }}
                            className="px-4 md:px-8 py-3 md:py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800"
                        >
                            <p className="text-center text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
                                By creating an account, you agree to our{' '}
                                <a href="#" className="text-[#0046FF] hover:underline font-semibold">Terms of Service</a>
                                {' '}and{' '}
                                <a href="#" className="text-[#0046FF] hover:underline font-semibold">Privacy Policy</a>
                            </p>
                        </motion.div>
                    </div>

                    {/* Bottom sparkle */}
                    <motion.div initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ delay:1.5 }}
                        className="mt-4 md:mt-6 flex items-center justify-center gap-1.5 md:gap-2 text-xs md:text-sm text-gray-500 dark:text-gray-400"
                    >
                        <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#FF8040]" />
                        <span>Join thousands of event enthusiasts</span>
                        <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#0046FF]" />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;


// import { useState } from "react";
// import { useAuth } from "../../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// const Register = () => {
//     const navigate = useNavigate();
//     const { register } = useAuth();

//     const [formData, setFormData] = useState({
//         name: "",
//         email: "",
//         collegeId: "",
//         password: "",
//         role: "student",
//     });

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value});
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await register(formData);
//             toast.success("Registration successful ✅");
//             navigate("/");
//             // alert("Registration successful");
//         } catch(err) {
//             toast.success("Regisration failed ❌");
//         }
//     };

//     return (
//         <div>
//             <h2>Register</h2>

//             <form onSubmit={handleSubmit}>
//                 <input
//                 name="name"
//                 placeholder="Name"
//                 onChange={handleChange}
//                 required
//                 />

//                 <input 
//                 name="email"
//                 placeholder="Email"
//                 onChange={handleChange}
//                 required
//                 />

//                 <input
//                 name="collegeId"
//                 placeholder="College ID"
//                 onChange={handleChange}
//                 required
//                 />

//                 <input
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 onChange={handleChange}
//                 required
//                 />

//                 <select name="role" onChange={handleChange} required>
//                     <option>Select any one</option>
//                     <option value="student">Student</option>
//                     <option value="host">Host</option>
//                 </select>

//                 <button type="submit">Register</button>
//             </form>
//         </div>
//     );
// };

// export default Register;




// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { motion, AnimatePresence } from "framer-motion";

// // ----------------------
// // Validation Schema
// // ----------------------
// const registerSchema = z
//   .object({
//     name: z.string().min(2, "Full name is required"),
//     email: z.string().email("Invalid email address"),
//     password: z.string().min(6, "Password must be at least 6 characters"),
//     confirmPassword: z.string(),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"],
//   });

// // ----------------------
// // Floating Input Component
// // ----------------------
// const FloatingInput = ({ label, type, register, error }) => {
//   return (
//     <div className="relative w-full">
//       <input
//         type={type}
//         {...register}
//         placeholder=" "
//         className={`peer w-full rounded-2xl border bg-white/20 px-4 pt-6 pb-2 text-gray-800 backdrop-blur-md outline-none transition-all
//         focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/30
//         ${error ? "border-red-400" : "border-gray-300"}`}
//       />
//       <label
//         className="absolute left-4 top-2 text-sm text-gray-500 transition-all
//         peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
//         peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600"
//       >
//         {label}
//       </label>

//       <AnimatePresence>
//         {error && (
//           <motion.p
//             initial={{ opacity: 0, y: -4 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0 }}
//             className="mt-1 text-sm text-red-500"
//           >
//             {error.message}
//           </motion.p>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// // ----------------------
// // Main Register Page
// // ----------------------
// const Register = () => {
//   const [success, setSuccess] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     reset,
//   } = useForm({
//     resolver: zodResolver(registerSchema),
//   });

//   const onSubmit = async (data) => {
//     await new Promise((res) => setTimeout(res, 1500)); // fake API delay
//     setSuccess(true);
//     reset();

//     setTimeout(() => setSuccess(false), 2500);
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 px-4">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.6 }}
//         className="w-full max-w-lg rounded-3xl bg-white/20 p-10 shadow-2xl backdrop-blur-xl border border-white/30"
//       >
//         <motion.h1
//           initial={{ y: -20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           className="mb-2 text-center text-4xl font-extrabold text-white drop-shadow-lg"
//         >
//           Register Now ✨
//         </motion.h1>
//         <motion.p
//           initial={{ y: -10, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           className="mb-8 text-center text-white/80"
//         >
//           Join us and start your amazing journey 🚀
//         </motion.p>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           <FloatingInput
//             label="Full Name"
//             type="text"
//             register={register("name")}
//             error={errors.name}
//           />

//           <FloatingInput
//             label="Email Address"
//             type="email"
//             register={register("email")}
//             error={errors.email}
//           />

//           <FloatingInput
//             label="Password"
//             type="password"
//             register={register("password")}
//             error={errors.password}
//           />

//           <FloatingInput
//             label="Confirm Password"
//             type="password"
//             register={register("confirmPassword")}
//             error={errors.confirmPassword}
//           />

//           <motion.button
//             whileHover={{ scale: 1.03 }}
//             whileTap={{ scale: 0.97 }}
//             disabled={isSubmitting}
//             className="relative w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 py-3 font-semibold text-white shadow-lg transition disabled:opacity-60"
//           >
//             {isSubmitting ? "Creating account..." : "Register"}
//           </motion.button>
//         </form>

//         <AnimatePresence>
//           {success && (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0 }}
//               className="mt-6 rounded-2xl bg-green-500/20 p-4 text-center text-green-700 font-medium"
//             >
//               🎉 Registration successful!
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>
//     </div>
//   );
// };

// export default Register;
