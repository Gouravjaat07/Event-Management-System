import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate, Link, useLocation } from "react-router-dom";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ArrowRight,
  Sparkles,
  Calendar,
  UserPlus
} from "lucide-react";
import Navbar from "../../components/Navbar";

const Login = () => {
    const navigate  = useNavigate();
    const location  = useLocation();
    const { login } = useAuth();
    const [darkMode, setDarkMode]         = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading]       = useState(false);
    const [formData, setFormData]         = useState({ identifier: "", password: "" });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(formData);
            toast.success("Login successful ✅");
            const from = location.state?.from?.pathname || "/";
            navigate(from, { replace: true });
        } catch {
            toast.error("Invalid credentials ❌");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); });

    /* shared input class */
    const inputBase = "w-full py-2.5 md:py-3.5 rounded-lg md:rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-[#0046FF] focus:ring-2 md:focus:ring-4 focus:ring-[#0046FF]/10 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-500 text-sm md:text-base";

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
                    {/* fewer particles on mobile */}
                    {[...Array(12)].map((_, i) => (
                        <motion.div key={i}
                            animate={{ y:[0,-30,0], x:[0,i%2===0?10:-10,0], opacity:[0.2,0.4,0.2] }}
                            transition={{ duration:3+Math.random()*2, repeat:Infinity, delay:Math.random()*2 }}
                            className="absolute w-1.5 h-1.5 md:w-2 md:h-2 rounded-full hidden sm:block"
                            style={{ left:`${Math.random()*100}%`, top:`${Math.random()*100}%`, background: i%2===0 ? '#FF8040' : '#0046FF' }}
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
                                {/* Icon */}
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
                                    Welcome Back
                                </motion.h1>
                                <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}
                                    className="text-white/90 text-center text-xs md:text-sm"
                                >
                                    Sign in to continue to SVSU Events
                                </motion.p>
                            </div>
                        </div>

                        {/* ── Form ── */}
                        <div className="px-4 py-5 md:p-8">
                            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">

                                {/* Email / ID */}
                                <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.5 }}>
                                    <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2">
                                        Email or College ID
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                                            <Mail className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-focus-within:text-[#0046FF] transition-colors" />
                                        </div>
                                        <input type="text" name="identifier" placeholder="Enter your email or ID"
                                            value={formData.identifier} onChange={handleChange} required
                                            className={`${inputBase} pl-9 md:pl-12 pr-3 md:pr-4`}
                                        />
                                    </div>
                                </motion.div>

                                {/* Password */}
                                <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.6 }}>
                                    <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2">
                                        Password
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                                            <Lock className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-focus-within:text-[#0046FF] transition-colors" />
                                        </div>
                                        <input type={showPassword ? "text" : "password"} name="password" placeholder="Enter your password"
                                            value={formData.password} onChange={handleChange} required
                                            className={`${inputBase} pl-9 md:pl-12 pr-10 md:pr-12`}
                                        />
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

                                {/* Remember / Forgot */}
                                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.7 }}
                                    className="flex items-center justify-between"
                                >
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input type="checkbox" className="w-3.5 h-3.5 md:w-4 md:h-4 rounded border-gray-300 text-[#0046FF] focus:ring-[#0046FF] cursor-pointer" />
                                        <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 group-hover:text-[#0046FF] transition-colors">Remember me</span>
                                    </label>
                                    <a href="#" className="text-xs md:text-sm font-semibold text-[#0046FF] hover:text-[#001BB7] transition-colors">Forgot password?</a>
                                </motion.div>

                                {/* Sign In button */}
                                <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.8 }}>
                                    <motion.button type="submit" disabled={isLoading}
                                        whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                                        className="w-full px-4 py-3 md:py-4 rounded-lg md:rounded-xl bg-gradient-to-r from-[#FF8040] to-[#0046FF] hover:from-[#FF8040]/90 hover:to-[#0046FF]/90 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold shadow-lg shadow-[#0046FF]/30 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm md:text-base"
                                    >
                                        {isLoading ? (
                                            <>
                                                <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:"linear" }}
                                                    className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full" />
                                                <span>Signing in...</span>
                                            </>
                                        ) : (
                                            <>
                                                <LogIn className="w-4 h-4 md:w-5 md:h-5" />
                                                <span>Sign In</span>
                                                <motion.div animate={{ x:[0,4,0] }} transition={{ duration:1.5, repeat:Infinity }}>
                                                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                                                </motion.div>
                                            </>
                                        )}
                                    </motion.button>
                                </motion.div>

                                {/* Divider */}
                                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.9 }}
                                    className="relative my-4 md:my-6"
                                >
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300 dark:border-gray-700" />
                                    </div>
                                    <div className="relative flex justify-center text-xs md:text-sm">
                                        <span className="px-3 md:px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-medium">
                                            Don't have an account?
                                        </span>
                                    </div>
                                </motion.div>

                                {/* Register link */}
                                <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:1 }}>
                                    <Link to="/register">
                                        <motion.button type="button" whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                                            className="w-full px-4 py-3 md:py-4 rounded-lg md:rounded-xl border-2 border-[#0046FF] text-[#0046FF] hover:bg-[#0046FF]/5 dark:hover:bg-[#0046FF]/10 font-bold transition-all duration-300 flex items-center justify-center gap-2 text-sm md:text-base"
                                        >
                                            <UserPlus className="w-4 h-4 md:w-5 md:h-5" />
                                            <span>Create New Account</span>
                                        </motion.button>
                                    </Link>
                                </motion.div>
                            </form>
                        </div>

                        {/* Footer */}
                        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.1 }}
                            className="px-4 md:px-8 py-3 md:py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800"
                        >
                            <p className="text-center text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
                                By signing in, you agree to our{' '}
                                <a href="#" className="text-[#0046FF] hover:underline font-semibold">Terms of Service</a>
                                {' '}and{' '}
                                <a href="#" className="text-[#0046FF] hover:underline font-semibold">Privacy Policy</a>
                            </p>
                        </motion.div>
                    </div>

                    {/* Bottom sparkle */}
                    <motion.div initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ delay:1.2 }}
                        className="mt-4 md:mt-6 flex items-center justify-center gap-1.5 md:gap-2 text-xs md:text-sm text-gray-500 dark:text-gray-400"
                    >
                        <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#FF8040]" />
                        <span>Secure and encrypted login</span>
                        <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#0046FF]" />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;


// // Origional Code
// import { useState } from "react";
// import { useAuth } from "../../context/AuthContext";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//     const navigate = useNavigate();
//     const { login } = useAuth();
//     const [formData, setFormData] = useState({
//         identifier: "",
//         password: "",
//     });

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value});
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await login(formData);
//             // toast.success("Login successful ✅");
//             navigate("/");
//             // alert("Login successful");
//         } catch(err) {
//             // alert("Invalid credentials");
//             toast.error("Invalid credentials ❌");
//         }
//     };

//     return (
//         <div>
//             <h2>Login</h2>

//             <form onSubmit={handleSubmit}>
//                 <input
//                     type="text"
//                     name = "identifier"
//                     placeholder="Email or College ID"
//                     value={formData.identifier}
//                     onChange={handleChange}
//                     required 
//                 />

//                 <input 
//                     type="password"
//                     name="password"
//                     placeholder="Password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                 />

//                 <button type="submit">Login</button>
//             </form>
//         </div>
//     );
// };

// export default Login;