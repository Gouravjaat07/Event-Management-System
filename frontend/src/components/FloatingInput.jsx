import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const FloatingInput = ({ label, type, icon: Icon, register, error }) => {
  return (
    <div className="relative w-full">
      {Icon && (
        <Icon
          size={18}
          className="absolute left-4 top-5 text-white/60 transition peer-focus:text-cyan-400"
        />
      )}

      <input
        type={type}
        {...register}
        placeholder=" "
        className={clsx(
          "peer w-full rounded-2xl border bg-white/15 px-11 pt-6 pb-2 text-white backdrop-blur-lg outline-none transition-all",
          "focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400",
          error ? "border-red-400" : "border-white/30"
        )}
      />

      <label
        className="absolute left-11 top-2 text-sm text-white/70 transition-all
        peer-placeholder-shown:top-5 peer-placeholder-shown:text-base
        peer-focus:top-2 peer-focus:text-sm peer-focus:text-cyan-300"
      >
        {label}
      </label>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1 text-sm text-red-400"
          >
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingInput;
