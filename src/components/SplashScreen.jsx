import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SplashScreen = ({ onDone }) => {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setHide(true), 2200);
    const doneTimer = setTimeout(() => {
      onDone && onDone();
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      {!hide && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#F8FFF8]"
        >
          {/* Background glow */}
          <div className="absolute w-[420px] h-[420px] rounded-full bg-[#81C784]/20 blur-3xl" />

          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="relative flex items-center gap-4"
          >
            {/* Animated cart */}
            <motion.div
              initial={{ x: -80, opacity: 0, rotate: -15 }}
              animate={{ x: 0, opacity: 1, rotate: 0 }}
              transition={{
                duration: 1,
                ease: "easeOut",
              }}
              className="relative"
            >
              {/* Cart bounce */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-[#2E7D32]"
              >
                <svg
                  width="72"
                  height="72"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1.2" />
                  <circle cx="20" cy="21" r="1.2" />
                  <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
                </svg>
              </motion.div>

              {/* Floating leaf */}
              <motion.div
                animate={{
                  rotate: [0, 8, -8, 0],
                  y: [0, -4, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-2 -right-2 text-[#81C784]"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z" />
                  <path d="M2 21c0-3 1.8-5.3 5-6 2.5-.5 5-2 6-3" />
                </svg>
              </motion.div>
            </motion.div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 1,
                delay: 0.2,
                ease: "easeOut",
              }}
              className="flex flex-col"
            >
              <h1
                className="text-5xl md:text-6xl font-black tracking-tight"
                style={{
                  fontFamily: "sans-serif",
                  background:
                    "linear-gradient(90deg, #2E7D32 0%, #81C784 55%, #795548 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                FreshCart
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 0.8 }}
                className="mt-1 text-sm tracking-[0.3em] text-[#6B8E6E] uppercase"
              >
                Fresh • Organic • Fast
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;