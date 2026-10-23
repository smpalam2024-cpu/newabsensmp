import React, { useState } from 'react';
import {
  Lock,
  Mail,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  UserCheck,
  ArrowRight,
} from 'lucide-react';
import { User } from '../types';
import {
  loginAdmin,
  getAllUsers,
  setCurrentUser,
} from '../services/storageService';
import { DEFAULT_ADMIN_CREDENTIALS, SCHOOL_INFO } from '../data/initialData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  currentUser: User;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentUser,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showQuickPicker, setShowQuickPicker] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMsg('Harap masukkan Username/Email dan Password.');
      return;
    }

    const result = loginAdmin(identifier, password);
    if (result.success && result.user) {
      setSuccessMsg(`Selamat datang, ${result.user.name}!`);
      setTimeout(() => {
        onLoginSuccess(result.user!);
        onClose();
      }, 500);
    } else {
      setErrorMsg(result.message || 'Login gagal.');
    }
  };

  const handleFillAdminCredentials = () => {
    setIdentifier(DEFAULT_ADMIN_CREDENTIALS.email);
    setPassword(DEFAULT_ADMIN_CREDENTIALS.password);
    setErrorMsg('');
  };

  const handleSwitchUserDirect = (u: User) => {
    setCurrentUser(u);
    onLoginSuccess(u);
    onClose();
  };

  const allUsers = getAllUsers();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition text-white/90 hover:text-white cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <img
              src={SCHOOL_INFO.logoUrl}
              alt="Logo SMP Alam Excellentia"
              className="w-12 h-12 rounded-xl bg-white p-1 object-contain shadow-md shrink-0"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 bg-blue-500/30 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border border-white/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Autentikasi Akun</span>
              </div>
              <h3 className="text-lg font-black tracking-tight mt-1">
                Login {SCHOOL_INFO.appName}
              </h3>
              <p className="text-xs text-blue-100">
                Akses hak kelola data & absensi sekolah
              </p>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Quick Info Box with default admin credentials */}
          <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs text-amber-950 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5 text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Akun Admin Utama yang Tersedia:
              </span>
              <button
                type="button"
                onClick={handleFillAdminCredentials}
                className="text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-white px-2 py-0.5 rounded-lg border border-amber-300 hover:border-blue-400 transition cursor-pointer shadow-2xs"
              >
                Isi Otomatis
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-[11px] bg-white/70 p-2 rounded-xl border border-amber-200/60">
              <div>
                <span className="text-slate-500 font-sans block text-[10px]">Email/User:</span>
                <span className="font-semibold text-slate-800">admin@smpsae.sch.id</span>
              </div>
              <div>
                <span className="text-slate-500 font-sans block text-[10px]">Password:</span>
                <span className="font-semibold text-slate-800">admin123</span>
              </div>
            </div>
            <p className="text-[10px] text-amber-800 leading-relaxed">
              Admin utama dapat mengubah data nama guru/siswa, jadwal jam sesi, kelas, dan tahun pelajaran.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Username / Email Admin
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="admin@smpsae.sch.id"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Masuk Sebagai Admin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick User Switcher Toggle */}
          <div className="pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setShowQuickPicker(!showQuickPicker)}
              className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800 py-1 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{showQuickPicker ? 'Sembunyikan Pilihan Cepat' : 'Atau Ganti Akun Pengguna / Guru Langsung'}</span>
            </button>

            {showQuickPicker && (
              <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                {allUsers.map((u) => {
                  const isCurrent = u.id === currentUser.id;
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleSwitchUserDirect(u)}
                      className={`w-full text-left p-2 rounded-lg text-xs transition flex items-center justify-between cursor-pointer ${
                        isCurrent
                          ? 'bg-blue-100 text-blue-900 font-bold border border-blue-200'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-100'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{u.name}</div>
                        <div className="text-[10px] text-slate-500">{u.roleLabel}</div>
                      </div>
                      {isCurrent ? (
                        <span className="text-[10px] font-bold text-blue-700">Aktif</span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Pilih</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>{SCHOOL_INFO.name}</span>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
