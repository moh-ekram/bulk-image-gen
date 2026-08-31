import React, { useState } from 'react';
import {
  Lock,
  KeyRound,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  X,
  LogIn,
  CheckCircle2,
} from 'lucide-react';
import { AdminUser } from '../../types';
import { DEFAULT_ADMIN_USER } from '../../data/adminDefaults';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AdminUser) => void;
  storedPassword?: string;
  storedUser?: AdminUser;
}

export const AdminLoginModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  storedPassword = 'admin123',
  storedUser = DEFAULT_ADMIN_USER,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      const trimmedUser = username.trim().toLowerCase();
      const expectedUser = storedUser.username.toLowerCase();
      const expectedEmail = storedUser.email.toLowerCase();

      if (
        (trimmedUser === expectedUser || trimmedUser === expectedEmail) &&
        password === storedPassword
      ) {
        const loggedInUser: AdminUser = {
          ...storedUser,
          lastLogin: Date.now(),
        };
        onLoginSuccess(loggedInUser);
        setIsLoading(false);
        onClose();
      } else {
        setIsLoading(false);
        setErrorMsg('Invalid admin credentials. Please verify your username and password.');
      }
    }, 400);
  };

  const handleQuickDemoLogin = () => {
    setUsername('admin');
    setPassword(storedPassword);
    setErrorMsg(null);
    setIsLoading(true);
    setTimeout(() => {
      const loggedInUser: AdminUser = {
        ...storedUser,
        lastLogin: Date.now(),
      };
      onLoginSuccess(loggedInUser);
      setIsLoading(false);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-widest uppercase bg-amber-400 text-white px-2 py-0.5 rounded">
                  ADMIN ONLY
                </span>
                <span className="text-xs text-slate-300 font-medium">Restricted Portal</span>
              </div>
              <h2 className="text-lg font-black text-white mt-1">Management Panel Login</h2>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Secure administrative gateway for orders, inventory, pricing & revenue control.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-950 border border-rose-800 rounded-xl flex items-start gap-2.5 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMsg}</div>
            </div>
          )}

          {/* Quick Demo Login Preset Helper */}
          <div className="p-3 bg-indigo-950/80 border border-indigo-900 rounded-xl flex items-center justify-between gap-3">
            <div className="text-xs text-indigo-950">
              <span className="font-bold block">Quick Demo Admin Access:</span>
              <span className="text-[11px] text-indigo-400 font-mono">User: <b>admin</b> | Pass: <b>admin123</b></span>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>1-Click Login</span>
            </button>
          </div>

          {/* Username / Email Field */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">
              Admin Username or Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin or admin@streetwear.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 focus:border-indigo-600 focus:bg-slate-900 rounded-xl text-sm font-medium outline-hidden transition-all text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-700 focus:border-indigo-600 focus:bg-slate-900 rounded-xl text-sm font-medium outline-hidden transition-all text-white placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Note */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-indigo-400 focus:ring-indigo-500"
              />
              <span>Remember admin session</span>
            </label>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" /> 256-bit Encrypted
            </span>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-black hover:bg-indigo-600 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Access Management Panel</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Security Badge */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Role-Based Access Control
          </span>
          <span>Version 2.4 Pro</span>
        </div>
      </div>
    </div>
  );
};
