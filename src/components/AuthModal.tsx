import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Phone, MapPin, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any, token: string) => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;
        if (!data.user) throw new Error('Signup failed. Please try again.');

        // If email confirmation is required, there's no session yet - the
        // profile insert would fail (unauthenticated), so stop here and
        // let the user know to check their email first.
        if (!data.session) {
          setError('Account created! Please check your email to confirm before logging in.');
          setLoading(false);
          return;
        }

        // Store the extra profile details (name, phone, address) linked to this auth user.
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: data.user.id,
            name,
            phone,
            address,
            role: 'customer',
          }]);

        if (profileError) {
          // Don't block login just because the profile row failed to save -
          // log it so it's visible, but let the user in.
          console.error('[Profile Save Error]', profileError.message);
        }

        const user = {
          id: data.user.id,
          name,
          email,
          phone,
          address,
          role: 'customer',
        };

        onAuthSuccess(user, data.session.access_token);
        onClose();
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
        if (!data.user || !data.session) throw new Error('Login failed. Please check your credentials.');

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('[Profile Fetch Error]', profileError.message);
        }

        const user = {
          id: data.user.id,
          name: profile?.name || email.split('@')[0],
          email: data.user.email,
          phone: profile?.phone || '',
          address: profile?.address || '',
          role: profile?.role || 'customer',
        };

        onAuthSuccess(user, data.session.access_token);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-neutral-100 overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 transition-colors text-neutral-500 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-sm">
            🪔
          </div>
          <h2 className="text-xl font-black text-neutral-900 tracking-tight">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-semibold">
            {mode === 'login' 
              ? 'Sign in to access your dashboard, basket, and order history.' 
              : 'Sign up to shop pure groceries with guaranteed home delivery.'}
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-600 text-xs font-bold p-3 rounded-xl border border-rose-100 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {mode === 'signup' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
                key="signup-fields"
              >
                {/* Full Name */}
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      placeholder="Enter 10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email */}
          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl pl-9 pr-10 py-2.5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'signup' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
                key="signup-address"
              >
                {/* Full Delivery Address */}
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Delivery Address</label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none text-neutral-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <textarea
                      required
                      rows={2}
                      placeholder="Flat, building, street name, pincode..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition-colors uppercase tracking-wider mt-2 disabled:bg-neutral-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Register Account'}
          </button>
        </form>

        {/* Switch mode */}
        <div className="text-center mt-4 pt-3 border-t border-neutral-100">
          <p className="text-xs font-semibold text-neutral-500">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-emerald-700 font-extrabold ml-1 hover:underline"
            >
              {mode === 'login' ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
