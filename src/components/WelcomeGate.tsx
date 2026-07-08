import { motion, AnimatePresence } from 'motion/react';
import { Wheat, LogIn, UserPlus, ArrowRight } from 'lucide-react';

interface WelcomeGateProps {
  isVisible: boolean;
  onLogin: () => void;
  onSignup: () => void;
  onContinueAsGuest: () => void;
}

export default function WelcomeGate({ isVisible, onLogin, onSignup, onContinueAsGuest }: WelcomeGateProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gradient-to-br from-emerald-950 via-emerald-900 to-neutral-950"
        >
          {/* Ambient grain-field texture accents */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.15, scale: 1 }}
              transition={{ duration: 1.2 }}
              className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-amber-400 blur-3xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.12, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="absolute -bottom-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-emerald-400 blur-3xl"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
          >
            {/* Header band */}
            <div className="relative bg-gradient-to-br from-emerald-700 to-emerald-900 px-8 pt-10 pb-8 text-center overflow-hidden">
              <motion.div
                initial={{ opacity: 0, y: -10, rotate: -8 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20"
              >
                <Wheat className="w-8 h-8 text-amber-300" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="text-2xl font-black text-white tracking-tight"
              >
                Welcome to Annapurna Store
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="text-emerald-100/90 text-sm mt-2 font-medium"
              >
                Sign in for faster checkout, saved addresses, and order tracking
              </motion.p>
            </div>

            {/* Action buttons */}
            <div className="p-6 sm:p-8 space-y-3">
              <motion.button
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.45 }}
                onClick={onLogin}
                className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm py-3.5 rounded-2xl transition-all shadow-lg shadow-emerald-700/20 hover:shadow-emerald-700/30 hover:-translate-y-0.5"
              >
                <LogIn className="w-4 h-4" />
                Log In
              </motion.button>

              <motion.button
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.53 }}
                onClick={onSignup}
                className="w-full flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold text-sm py-3.5 rounded-2xl transition-all border border-emerald-200 dark:border-emerald-800"
              >
                <UserPlus className="w-4 h-4" />
                Create New Account
              </motion.button>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.65 }}
                onClick={onContinueAsGuest}
                className="w-full flex items-center justify-center gap-1.5 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 font-semibold text-xs py-2 transition-colors"
                id="continue-as-guest-btn"
              >
                Continue as Guest
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
