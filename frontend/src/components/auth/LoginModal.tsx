import React, { useState, useEffect } from 'react';
import {
  X,
  GraduationCap,
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  IdCard,
  Building2,
  BookOpen,
  Send,
  Loader2,
  User,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    loginModalDefaultRole,
    closeLoginModal,
    sendOtp,
    loginStudent,
    loginStudentWithPassword,
    loginAdmin,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');

  // Student Mode: 'signin' (register with OTP + password) or 'login' (direct password login)
  const [studentMode, setStudentMode] = useState<'signin' | 'login'>('signin');

  // Student Sign-In / Registration Form State
  const [studentName, setStudentName] = useState<string>('');
  const [studentCollegeId, setStudentCollegeId] = useState<string>('');
  const [studentRollNo, setStudentRollNo] = useState<string>('');
  const [studentBranch, setStudentBranch] = useState<string>('Computer Science & Engineering');
  const [studentSection, setStudentSection] = useState<string>('Section A');
  const [studentEmail, setStudentEmail] = useState<string>('');
  const [studentPassword, setStudentPassword] = useState<string>('');
  const [showStudentPassword, setShowStudentPassword] = useState<boolean>(false);
  const [studentOtp, setStudentOtp] = useState<string>('');

  // Student Direct Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);

  // Admin Form State
  const [adminCollegeId, setAdminCollegeId] = useState<string>('');
  const [adminName, setAdminName] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [showAdminPassword, setShowAdminPassword] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [adminOtp, setAdminOtp] = useState<string>('');

  // UI Flow & Validation State
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCountdown, setOtpCountdown] = useState<number>(0);
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync tab with default role prop
  useEffect(() => {
    if (isLoginModalOpen) {
      setActiveTab(loginModalDefaultRole);
      setStudentMode('signin');
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [isLoginModalOpen, loginModalDefaultRole]);

  // OTP Countdown Timer
  useEffect(() => {
    if (otpCountdown <= 0) return;
    const timer = setInterval(() => {
      setOtpCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [otpCountdown]);

  if (!isLoginModalOpen) return null;

  // Handle Send OTP
  const handleSendOtp = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    const email = activeTab === 'user' ? studentEmail.trim() : adminEmail.trim();
    const collegeId = activeTab === 'user' ? studentCollegeId.trim() : adminCollegeId.trim();

    if (!collegeId) {
      setErrorMsg('Please enter your College ID first.');
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please enter a valid email address to receive OTP.');
      return;
    }

    setIsSendingOtp(true);
    const result = await sendOtp({
      email,
      role: activeTab,
      collegeId,
    });
    setIsSendingOtp(false);

    if (result.success) {
      setOtpSent(true);
      setOtpCountdown(60);
      setSuccessMsg(result.message);
      if (result.devOtp) {
        if (activeTab === 'user') setStudentOtp(result.devOtp);
        else setAdminOtp(result.devOtp);
      }
    } else {
      setErrorMsg(result.message);
    }
  };

  // Handle Student Sign-In / Registration Submit (with OTP & Password)
  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!studentName.trim()) return setErrorMsg('Name of Student is required.');
    if (!studentCollegeId.trim()) return setErrorMsg('College ID is required.');
    if (!studentRollNo.trim()) return setErrorMsg('Roll Number is required.');
    if (!studentBranch) return setErrorMsg('Please select your Branch.');
    if (!studentSection.trim()) return setErrorMsg('Section Name is required.');
    if (!studentEmail.trim()) return setErrorMsg('Email is required.');
    if (!studentPassword.trim()) return setErrorMsg('Password is required.');
    if (studentPassword.length < 6) return setErrorMsg('Password must be at least 6 characters.');
    if (!studentOtp.trim()) return setErrorMsg('Please enter the 6-digit OTP sent to your email.');

    setIsSubmitting(true);
    const result = await loginStudent({
      name: studentName.trim(),
      collegeId: studentCollegeId.trim().toUpperCase(),
      rollNumber: studentRollNo.trim().toUpperCase(),
      branch: studentBranch,
      section: studentSection.trim(),
      email: studentEmail.trim().toLowerCase(),
      password: studentPassword,
      otp: studentOtp.trim(),
    });
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMsg(result.message);
    }
  };

  // Handle Student Direct Login (with Password)
  const handleStudentDirectLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!loginIdentifier.trim()) return setErrorMsg('Please enter your College ID or Email.');
    if (!loginPassword.trim()) return setErrorMsg('Please enter your Password.');

    setIsSubmitting(true);
    const result = await loginStudentWithPassword({
      identifier: loginIdentifier.trim(),
      password: loginPassword,
    });
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMsg(result.message);
    }
  };

  // Handle Admin Login Submit
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!adminCollegeId.trim()) return setErrorMsg('College ID is required.');
    if (!adminName.trim()) return setErrorMsg('Admin Full Name is required.');
    if (!adminPassword) return setErrorMsg('Password is required.');
    if (!adminEmail.trim()) return setErrorMsg('Admin Email is required.');
    if (!adminOtp.trim()) return setErrorMsg('Please enter the 6-digit OTP sent to your email.');

    setIsSubmitting(true);
    const result = await loginAdmin({
      collegeId: adminCollegeId.trim().toUpperCase(),
      name: adminName.trim(),
      password: adminPassword,
      email: adminEmail.trim().toLowerCase(),
      otp: adminOtp.trim(),
    });
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMsg(result.message);
    }
  };

  // Quick Demo Autofills
  const fillStudentDemo = () => {
    setStudentName('Rahul Sharma');
    setStudentCollegeId('COL-2024-CSE-042');
    setStudentRollNo('21CS042');
    setStudentBranch('Computer Science & Engineering');
    setStudentSection('Section A');
    setStudentEmail('student@college.edu');
    setStudentPassword('Student@123');
    setErrorMsg(null);
  };

  const fillAdminDemo = () => {
    setAdminCollegeId('ADM-COLLEGE-001');
    setAdminName('Dr. R. K. Sharma');
    setAdminPassword('Admin@12345');
    setAdminEmail('admin@college.edu');
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-surface dark:bg-[#0c1222] rounded-3xl shadow-2xl border border-outline-variant/30 dark:border-white/10 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-surface-container-low dark:bg-white/5 border-b border-outline-variant/20 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 dark:bg-purple-900/40 text-primary dark:text-purple-300 flex items-center justify-center font-bold">
              {activeTab === 'user' ? <GraduationCap className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="font-headline-sm text-sm sm:text-base font-extrabold text-on-surface dark:text-white">
                Campus Authentication Portal
              </h2>
              <p className="font-body-sm text-[11px] text-on-surface-variant dark:text-white/60">
                Verified Sign In with Email OTP &amp; Password
              </p>
            </div>
          </div>
          <button
            onClick={closeLoginModal}
            className="w-8 h-8 rounded-full hover:bg-surface-container dark:hover:bg-white/10 text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role Segmented Switcher */}
        <div className="p-4 bg-surface-container-lowest dark:bg-transparent border-b border-outline-variant/20 dark:border-white/5">
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-surface-container-low dark:bg-black/40 rounded-2xl border border-outline-variant/20 dark:border-white/10">
            <button
              type="button"
              onClick={() => {
                setActiveTab('user');
                setOtpSent(false);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 px-3 rounded-xl font-label-md text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'user'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-on-surface-variant dark:text-white/70 hover:text-on-surface'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student / User</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('admin');
                setOtpSent(false);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 px-3 rounded-xl font-label-md text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-on-surface-variant dark:text-white/70 hover:text-on-surface'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>College Admin</span>
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Alerts */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: Student Flow (Sign-In or Direct Login) */}
          {activeTab === 'user' && (
            <div className="space-y-4">
              {/* Mode Toggle Header: Sign-In with OTP vs Login with Password */}
              <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <span className="font-label-md text-xs text-on-surface dark:text-white font-bold uppercase tracking-wider">
                    {studentMode === 'signin' ? 'Student Registration / Sign-In' : 'Student Account Log In'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:text-cyan-400 font-semibold">
                    {studentMode === 'signin' ? 'Email OTP' : 'Password'}
                  </span>
                </div>
                {studentMode === 'signin' && (
                  <button
                    type="button"
                    onClick={fillStudentDemo}
                    className="text-[11px] font-mono text-primary dark:text-cyan-400 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>⚡ Quick Demo</span>
                  </button>
                )}
              </div>

              {/* MODE A: Student Sign-In / Register Form */}
              {studentMode === 'signin' ? (
                <form onSubmit={handleStudentSubmit} className="space-y-3.5">
                  {/* Name of Student */}
                  <div className="space-y-1">
                    <label className="font-label-sm text-[11px] text-on-surface-variant dark:text-white/70 font-semibold flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-primary" />
                      <span>Name of Student</span>
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value.replace(/[<>'"`;()]/g, ''))}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 text-xs font-sans text-on-surface dark:text-white placeholder:text-outline-variant focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* College ID */}
                  <div className="space-y-1">
                    <label className="font-label-sm text-[11px] text-on-surface-variant dark:text-white/70 font-semibold flex items-center gap-1.5">
                      <IdCard className="w-3.5 h-3.5 text-primary" />
                      <span>College ID</span>
                    </label>
                    <input
                      type="text"
                      value={studentCollegeId}
                      onChange={(e) => setStudentCollegeId(e.target.value.replace(/[<>'"`;()]/g, ''))}
                      placeholder="e.g. COL-2024-CSE-042"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 text-xs font-mono text-on-surface dark:text-white placeholder:text-outline-variant focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Roll Number & Section */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-label-sm text-[11px] text-on-surface-variant dark:text-white/70 font-semibold flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-primary" />
                        <span>Roll Number</span>
                      </label>
                      <input
                        type="text"
                        value={studentRollNo}
                        onChange={(e) => setStudentRollNo(e.target.value.replace(/[<>'"`;()]/g, ''))}
                        placeholder="e.g. 21CS042"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 text-xs font-mono text-on-surface dark:text-white placeholder:text-outline-variant focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-label-sm text-[11px] text-on-surface-variant dark:text-white/70 font-semibold flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-primary" />
                        <span>Section Name</span>
                      </label>
                      <input
                        type="text"
                        value={studentSection}
                        onChange={(e) => setStudentSection(e.target.value.replace(/[<>'"`;()]/g, ''))}
                        placeholder="e.g. Section A"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 text-xs font-mono text-on-surface dark:text-white placeholder:text-outline-variant focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Branch Selection */}
                  <div className="space-y-1">
                    <label className="font-label-sm text-[11px] text-on-surface-variant dark:text-white/70 font-semibold">
                      Branch / Specialization
                    </label>
                    <select
                      value={studentBranch}
                      onChange={(e) => setStudentBranch(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low dark:bg-[#131d33] border border-outline-variant/30 dark:border-white/10 text-xs text-on-surface dark:text-white focus:outline-none focus:border-primary"
                    >
                      <option value="Computer Science & Engineering">Computer Science &amp; Engineering (CSE)</option>
                      <option value="Information Technology">Information Technology (IT)</option>
                      <option value="Artificial Intelligence & ML">Artificial Intelligence &amp; ML (AI/ML)</option>
                      <option value="Data Science & Engineering">Data Science &amp; Engineering</option>
                      <option value="Electronics & Communication">Electronics &amp; Communication (ECE)</option>
                      <option value="Electrical Engineering">Electrical Engineering (EE)</option>
                      <option value="Mechanical Engineering">Mechanical Engineering (ME)</option>
                      <option value="Civil Engineering">Civil Engineering (CE)</option>
                    </select>
                  </div>

                  {/* College Email & Send OTP Button */}
                  <div className="space-y-1">
                    <label className="font-label-sm text-[11px] text-on-surface-variant dark:text-white/70 font-semibold flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-primary" />
                      <span>College Email (for OTP verification)</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        placeholder="student@college.edu"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 text-xs font-mono text-on-surface dark:text-white placeholder:text-outline-variant focus:outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isSendingOtp || otpCountdown > 0}
                        className="px-4 py-2 rounded-xl bg-primary-container text-white font-label-md text-xs font-bold shrink-0 hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                      >
                        {isSendingOtp ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        <span>{otpCountdown > 0 ? `${otpCountdown}s` : 'Send OTP'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Password Column */}
                  <div className="space-y-1">
                    <label className="font-label-sm text-[11px] text-on-surface-variant dark:text-white/70 font-semibold flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-primary" />
                      <span>Create Account Password</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showStudentPassword ? 'text' : 'password'}
                        value={studentPassword}
                        onChange={(e) => setStudentPassword(e.target.value)}
                        placeholder="Create a password (min 6 characters)"
                        className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 text-xs font-mono text-on-surface dark:text-white placeholder:text-outline-variant focus:outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowStudentPassword(!showStudentPassword)}
                        className="absolute right-3 top-2.5 text-on-surface-variant hover:text-on-surface cursor-pointer"
                      >
                        {showStudentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* 6-Digit OTP Box */}
                  <div className="space-y-1 pt-1">
                    <label className="font-label-sm text-[11px] text-on-surface-variant dark:text-white/70 font-semibold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-primary" />
                        <span>6-Digit Verification OTP</span>
                      </span>
                      {otpSent && (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                          OTP dispatched (valid 5 mins)
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={studentOtp}
                      onChange={(e) => setStudentOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="Enter 6-digit OTP code"
                      className="w-full text-center tracking-[0.4em] font-mono text-base font-bold px-3 py-2.5 rounded-xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 text-on-surface dark:text-white placeholder:text-outline-variant focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-primary to-primary-container hover:opacity-95 text-white font-label-lg text-xs font-bold shadow-lg shadow-primary/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    <span>Verify Email &amp; Complete Student Sign In</span>
                  </button>

                  {/* Login Button Under Submit */}
                  <div className="pt-3 border-t border-outline-variant/20 dark:border-white/10 flex flex-col items-center gap-2">
                    <span className="text-[11px] text-on-surface-variant dark:text-white/60">
                      Already have an account?
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setStudentMode('login');
                        setErrorMsg(null);
                        setSuccessMsg(null);
                        if (studentEmail || studentCollegeId) {
                          setLoginIdentifier(studentCollegeId || studentEmail);
                        }
                      }}
                      className="w-full py-2.5 rounded-xl border border-primary/40 text-primary dark:text-cyan-300 hover:bg-primary/10 font-label-md text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Log In with Password</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* MODE B: Student Direct Login Form */
                <form onSubmit={handleStudentDirectLogin} className="space-y-3.5">
                  {/* College ID or Email */}
                  <div className="space-y-1">
                    <label className="font-label-sm text-[11px] text-on-surface-variant dark:text-white/70 font-semibold flex items-center gap-1.5">
                      <IdCard className="w-3.5 h-3.5 text-primary" />
                      <span>College ID or Email</span>
                    </label>
                    <input
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. COL-2024-CSE-042 or student@college.edu"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 text-xs font-mono text-on-surface dark:text-white placeholder:text-outline-variant focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label className="font-label-sm text-[11px] text-on-surface-variant dark:text-white/70 font-semibold flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-primary" />
                      <span>Password</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 text-xs font-mono text-on-surface dark:text-white placeholder:text-outline-variant focus:outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-2.5 text-on-surface-variant hover:text-on-surface cursor-pointer"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Login Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-primary to-primary-container hover:opacity-95 text-white font-label-lg text-xs font-bold shadow-lg shadow-primary/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogIn className="w-4 h-4" />
                    )}
                    <span>Log In to Student Account</span>
                  </button>

                  {/* Switch back to Sign-In with OTP */}
                  <div className="pt-3 border-t border-outline-variant/20 dark:border-white/10 flex flex-col items-center gap-2">
                    <span className="text-[11px] text-on-surface-variant dark:text-white/60">
                      New Student or need to set up account?
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setStudentMode('signin');
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      className="w-full py-2.5 rounded-xl border border-primary/40 text-primary dark:text-cyan-300 hover:bg-primary/10 font-label-md text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>New Student Sign In with OTP</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: College Admin Login Form */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-xs text-purple-600 dark:text-purple-300 font-bold uppercase tracking-wider">
                  Admin Credentials
                </span>
                <button
                  type="button"
                  onClick={fillAdminDemo}
                  className="text-[11px] font-mono text-purple-600 dark:text-purple-400 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>⚡ Quick Admin Demo</span>
                </button>
              </div>

              {/* College ID */}
              <div className="space-y-1">
                <label className="font-label-sm text-[11px] text-on-surface-variant dark:text-white/70 font-semibold flex items-center gap-1.5">
                  <IdCard className="w-3.5 h-3.5 text-purple-500" />
                  <span>College Admin ID</span>
                </label>
                <input
                  type="text"
                  value={adminCollegeId}
                  onChange={(e) => setAdminCollegeId(e.target.value.replace(/[<>'"`;()]/g, ''))}
                  placeholder="e.g. ADM-COLLEGE-001"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 text-xs font-mono text-on-surface dark:text-white placeholder:text-outline-variant focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Admin Name */}
              <div className="space-y-1">
                <label className="font-label-sm text-[11px] text-on-surface-variant dark:text-white/70 font-semibold flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-purple-500" />
                  <span>Admin Full Name</span>
                </label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value.replace(/[<>'"`;()]/g, ''))}
                  placeholder="e.g. Dr. R. K. Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 text-xs font-mono text-on-surface dark:text-white placeholder:text-outline-variant focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="font-label-sm text-[11px] text-on-surface-variant dark:text-white/70 font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-purple-500" />
                  <span>Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter password (e.g. Admin@12345)"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 text-xs font-mono text-on-surface dark:text-white placeholder:text-outline-variant focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 top-2.5 text-on-surface-variant hover:text-on-surface cursor-pointer"
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Admin Email & Send OTP */}
              <div className="space-y-1">
                <label className="font-label-sm text-[11px] text-on-surface-variant dark:text-white/70 font-semibold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-purple-500" />
                  <span>Admin Email (for OTP verification)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@college.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 text-xs font-mono text-on-surface dark:text-white placeholder:text-outline-variant focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp || otpCountdown > 0}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-label-md text-xs font-bold shrink-0 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    {isSendingOtp ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                    <span>{otpCountdown > 0 ? `${otpCountdown}s` : 'Send OTP'}</span>
                  </button>
                </div>
              </div>

              {/* 6-Digit OTP Box */}
              <div className="space-y-1 pt-1">
                <label className="font-label-sm text-[11px] text-on-surface-variant dark:text-white/70 font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
                    <span>6-Digit Admin Verification OTP</span>
                  </span>
                  {otpSent && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      OTP active (valid for 5 mins)
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={adminOtp}
                  onChange={(e) => setAdminOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Enter 6-digit OTP code"
                  className="w-full text-center tracking-[0.4em] font-mono text-base font-bold px-3 py-2.5 rounded-xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 text-on-surface dark:text-white placeholder:text-outline-variant focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-label-lg text-xs font-bold shadow-lg shadow-purple-900/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                <span>Verify Email &amp; Access Admin Console</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};