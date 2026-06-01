import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

function getRedirectTarget() {
  try {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    if (!redirect) return '/';
    const decoded = decodeURIComponent(redirect);
    // Only allow same-origin redirects.
    const url = new URL(decoded, window.location.origin);
    if (url.origin !== window.location.origin) return '/';
    // Never bounce back to the login page itself.
    if (url.pathname.startsWith('/login')) return '/';
    return url.pathname + url.search + url.hash;
  } catch {
    return '/';
  }
}

export default function Login() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isSignup = mode === 'signup';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    if (isSignup && password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (isSignup && !fullName.trim()) {
      setError('Please enter your name.');
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        await signup({ email: email.trim(), password, name: fullName.trim() });
      } else {
        await login({ email: email.trim(), password });
      }
      window.location.assign(getRedirectTarget());
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(isSignup ? 'signin' : 'signup');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#0A192F] flex flex-col">
      {/* Top bar */}
      <div className="px-4 sm:px-6 py-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white font-body text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to 1Market
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Brand */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#00D4FF] flex items-center justify-center">
              <span className="text-[#0A192F] font-bold text-sm">1</span>
            </div>
            <span className="font-heading font-bold text-white text-lg">1Market</span>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-[#0A192F] px-6 py-5">
              <h1 className="font-heading font-bold text-xl text-white">
                {isSignup ? 'Create your account' : 'Welcome back'}
              </h1>
              <p className="font-body text-xs text-white/50 mt-1">
                {isSignup
                  ? 'Join free to buy, sell, and rate across the Philippines.'
                  : 'Sign in to access deals and manage your account.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              {isSignup && (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="fullName" className="font-body text-xs font-semibold text-[#0A192F]/70">
                    Full name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A192F]/30" />
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Juan Dela Cruz"
                      autoComplete="name"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#0A192F]/15 font-body text-sm text-[#0A192F] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="font-body text-xs font-semibold text-[#0A192F]/70">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A192F]/30" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#0A192F]/15 font-body text-sm text-[#0A192F] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="font-body text-xs font-semibold text-[#0A192F]/70">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A192F]/30" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isSignup ? 'At least 8 characters' : 'Your password'}
                    autoComplete={isSignup ? 'new-password' : 'current-password'}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#0A192F]/15 font-body text-sm text-[#0A192F] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  />
                </div>
              </div>

              {error && (
                <p className="font-body text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#0A192F] hover:bg-[#2563EB] text-white rounded-xl font-body font-semibold text-sm transition-colors disabled:opacity-50"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSignup ? 'Create account' : 'Sign in'}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[#0A192F]/40">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="font-body text-[10px]">Secured by Neon Auth</span>
              </div>
            </form>

            <div className="px-6 pb-6 -mt-2 text-center">
              <p className="font-body text-xs text-[#0A192F]/50">
                {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-[#2563EB] font-semibold hover:underline"
                >
                  {isSignup ? 'Sign in' : 'Sign up free'}
                </button>
              </p>
            </div>
          </div>

          <p className="font-body text-[10px] text-white/30 text-center mt-4 leading-relaxed">
            By continuing you agree to our{' '}
            <Link to="/privacy-policy" className="text-[#00D4FF]/70 underline">
              Privacy Policy
            </Link>
            . Compliant with the Philippine Data Privacy Act of 2012.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
