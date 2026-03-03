import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoTextDark from "@/assets/logo-text-dark.png";

const SESSION_KEY = "prima_intro_seen";

const IntroAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  const finish = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    sessionStorage.setItem(SESSION_KEY, "1");
    setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 600);
  }, [exiting, onComplete]);

  useEffect(() => {
    const timer = setTimeout(finish, 2600);
    return () => clearTimeout(timer);
  }, [finish]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
        style={{ backgroundColor: "#ffffff" }}
        initial={{ opacity: 1 }}
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <motion.img
          src={logoTextDark}
          alt="Prima Dance"
          className="h-20 sm:h-28 md:h-36 mb-5 select-none"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />

        <motion.p
          className="text-[11px] sm:text-xs tracking-[0.35em] uppercase font-light select-none"
          style={{ color: "#a3a3a3" }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.7 }}
        >
          Where Movement Becomes Art
        </motion.p>

        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.6) 50%, transparent 60%)",
          }}
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.8, ease: "easeInOut", delay: 0.9 }}
        />

        <button
          onClick={finish}
          className="absolute bottom-8 right-8 text-[10px] tracking-[0.2em] uppercase transition-colors cursor-pointer select-none"
          style={{ color: "#d4d4d4" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#737373")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#d4d4d4")}
        >
          Skip
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export const shouldShowIntro = () => !sessionStorage.getItem(SESSION_KEY);

export default IntroAnimation;
