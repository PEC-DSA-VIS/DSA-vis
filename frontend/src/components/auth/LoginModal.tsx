import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  GraduationCap,
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
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
  Shield,
  KeyRound,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Full-screen slide states inside the modal.
 * `role` = role selection, `student` / `admin` = authentication screens.
 */
type AuthScreen = 'role' | 'student' | 'admin';

/** Horizontal ordering used to decide which direction each screen slides. */
const SCREEN_ORDER: Record<AuthScreen, number> = { role: 0, student: 1, admin: 2 };

/**
 * Decorative brand panel shown beside the Student / Admin forms on desktop.
 * Purely presentational — no auth logic lives here.
 */
const AuthShowcase: React.FC<{ role: 'user' | 'admin' }> = ({ role }) => {
  const isStudent = role === 'user';
  return (
    <div
      className={`hidden md:flex relative w-[38%] shrink-0 flex-col justify-between overflow-hidden p-6 border-r border-aurora-border ${
        isStudent
          ? 'bg-gradient-to-br from-aurora-primary-soft via-white to-[#f4f2ff]'
          : 'bg-gradient-to-br from-aurora-secondary-soft via-white to-[#eef4ff]'
      }`}
    >
      {/* Ambient glow blobs */}
      <div
        className={`pointer-events-none absolute -top-14 -left-12 w-52 h-52 rounded-full blur-3xl ${
          isStudent ? 'bg-aurora-primary/25' : 'bg-aurora-secondary/25'
        }`}
      />
      <div
        className={`pointer-events-none absolute -bottom-16 -right-12 w-56 h-56 rounded-full blur-3xl ${
          isStudent ? 'bg-aurora-primary/15' : 'bg-aurora-secondary/15'
        }`}
      />

      {/* Brand */}
      <div className="relative flex items-center gap-2.5">
        <img src="/aurora-logo.svg" alt="ALGO-Viz" className="w-9 h-9" />
        <div>
          <p className="font-heading text-sm font-extrabold text-aurora-text leading-tight">ALGO-Viz</p>
          <p className="text-[9px] font-mono uppercase tracking-[0.22em] text-aurora-muted">
            {isStudent ? 'Student Suite' : 'Admin Console'}
          </p>
        </div>
      </div>

      {/* Value proposition + product preview */}
      <div className="relative flex-1 flex flex-col justify-center gap-5 py-4">
        <div className="space-y-3">
          <div
            className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${
              isStudent
                ? 'bg-aurora-primary-soft border-aurora-primary/25 text-aurora-primary-ink'
                : 'bg-aurora-secondary-soft border-aurora-secondary/30 text-aurora-secondary-ink'
            }`}
          >
            {isStudent ? <GraduationCap className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div className="space-y-1.5">
            <h3 className="font-heading text-xl font-extrabold text-aurora-text tracking-tight leading-snug">
              {isStudent ? 'Learn algorithms, visually.' : 'One console for your whole campus.'}
            </h3>
            <p className="text-[11.5px] leading-relaxed text-aurora-muted">
              {isStudent
                ? 'Sign in to step through every swap, pointer and decision — built for your campus.'
                : 'Sign in to manage students, sections and results — every access verified with Email OTP.'}
            </p>
          </div>
        </div>

        {/* Feature checklist */}
        <ul className="space-y-2">
          {(isStudent
            ? [
                'Step-by-step algorithm visualizations',
                'Password + Email OTP secured sign-in',
                'Progress tracking across every topic',
              ]
            : [
                'Students, sections & branch management',
                'Email OTP verified admin sign-in',
                'Campus analytics in a single console',
              ]
          ).map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-[11px] text-aurora-text leading-snug">
              <CheckCircle2
                className={`w-3.5 h-3.5 shrink-0 mt-px ${
                  isStudent ? 'text-aurora-primary' : 'text-aurora-secondary'
                }`}
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* Product mockup card */}
        <div className="rounded-2xl bg-white border border-aurora-border shadow-aurora-md overflow-hidden">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-aurora-bg border-b border-aurora-border">
            <span className="w-2 h-2 rounded-full bg-rose-400/80" />
            <span className="w-2 h-2 rounded-full bg-aurora-accent/80" />
            <span className="w-2 h-2 rounded-full bg-aurora-secondary/80" />
            <span className="ml-1.5 text-[9px] font-mono text-aurora-muted">
              {isStudent ? 'two-sum.visualizer' : 'campus.overview'}
            </span>
            <span className="ml-auto inline-flex items-center gap-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-aurora-secondary-soft text-aurora-secondary-ink border border-aurora-secondary/30">
              <span className="w-1.5 h-1.5 rounded-full bg-aurora-secondary animate-pulse" />
              LIVE
            </span>
          </div>

          {isStudent ? (
            <div className="p-3.5 space-y-3">
              <div className="flex gap-1.5">
                {[2, 7, 11, 15].map((v, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-lg py-1.5 text-center font-mono text-[11px] font-bold border ${
                      i < 2
                        ? 'bg-aurora-primary-soft border-aurora-primary/40 text-aurora-primary-ink'
                        : 'bg-aurora-bg border-aurora-border text-aurora-text'
                    }`}
                  >
                    {v}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-aurora-muted">target = 9</span>
                <span className="text-aurora-secondary-ink font-bold">match found</span>
              </div>
              <div className="h-1.5 rounded-full bg-aurora-bg overflow-hidden">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-aurora-primary to-aurora-secondary" />
              </div>
              <p className="font-mono text-[10px] text-aurora-primary-ink">
                <span className="aurora-type-line" style={{ animationDelay: '0s' }}>
                  nums[i] + nums[j] === target
                </span>
                <span className="aurora-caret" />
              </p>
            </div>
          ) : (
            <div className="p-3.5 space-y-3">
              {/* Student verification queue */}
              <div className="rounded-xl border border-aurora-border bg-aurora-bg overflow-hidden">
                <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-aurora-border">
                  <p className="text-[9px] uppercase tracking-wider font-bold text-aurora-muted">
                    Student verification
                  </p>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-aurora-accent-soft text-aurora-accent-ink border border-aurora-accent/30">
                    12 pending
                  </span>
                </div>
                {[
                  { initials: 'AV', name: 'Aarav Verma', meta: 'CSE · 3B', status: 'Verified', ok: true },
                  { initials: 'PS', name: 'Priya Sharma', meta: 'ECE · 1A', status: 'OTP sent', ok: false },
                ].map((row) => (
                  <div
                    key={row.name}
                    className="flex items-center gap-2 px-2.5 py-1.5 border-b border-aurora-border last:border-0"
                  >
                    <span className="w-5 h-5 rounded-full bg-aurora-primary-soft text-aurora-primary-ink flex items-center justify-center text-[8px] font-extrabold shrink-0">
                      {row.initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[9.5px] font-bold text-aurora-text truncate leading-tight">{row.name}</p>
                      <p className="text-[8.5px] text-aurora-muted truncate leading-tight">{row.meta}</p>
                    </div>
                    <span
                      className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${
                        row.ok
                          ? 'bg-aurora-secondary-soft text-aurora-secondary-ink border-aurora-secondary/30'
                          : 'bg-aurora-accent-soft text-aurora-accent-ink border-aurora-accent/30'
                      }`}
                    >
                      {row.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Verified admin identity row */}
              <div className="flex items-center gap-2 rounded-xl border border-aurora-secondary/30 bg-aurora-secondary-soft px-2.5 py-2">
                <span className="w-7 h-7 rounded-full bg-aurora-secondary text-white flex items-center justify-center font-heading text-[10px] font-extrabold shrink-0">
                  RS
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-aurora-text truncate">Dr. R. K. Sharma</p>
                  <p className="text-[9px] text-aurora-muted truncate">College Admin · ADM-COLLEGE-001</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-aurora-secondary-ink shrink-0">
                  <ShieldCheck className="w-3 h-3" />
                  OTP OK
                </span>
              </div>

              <p className="font-mono text-[10px] text-aurora-secondary-ink">
                <span className="aurora-type-line" style={{ animationDelay: '1.5s' }}>
                  await verifyAdminOtp(email)
                </span>
                <span className="aurora-caret" />
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Trust footer */}
      <p className="relative flex items-center gap-1.5 text-[10px] font-mono text-aurora-muted">
        <Lock className="w-3 h-3" />
        {isStudent
          ? 'Password + Email OTP secured access'
          : 'Role-guarded admin access · OTP verified'}
      </p>
    </div>
  );
};

export const LoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    loginModalDefaultRole,
    loginModalDirectOpen,
    closeLoginModal,
    sendOtp,
    loginStudent,
    loginStudentWithPassword,
    loginAdmin,
    loginAdminWithPassword,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');

  // Which full-screen auth view is currently slid into place.
  const [screen, setScreen] = useState<AuthScreen>('role');
  const roleScreenRef = useRef<HTMLDivElement>(null);
  const studentScreenRef = useRef<HTMLDivElement>(null);
  const adminScreenRef = useRef<HTMLDivElement>(null);

  // Student Mode: 'login' (direct password login) or 'signin' (register with OTP + password)
  const [studentMode, setStudentMode] = useState<'login' | 'signin'>('login');

  // Admin Mode: 'login' (direct password login) or 'otp' (register / 2FA OTP verification)
  const [adminMode, setAdminMode] = useState<'login' | 'otp'>('login');

  // Student Direct Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);

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

  // Admin Direct Login Form State
  const [adminLoginIdentifier, setAdminLoginIdentifier] = useState<string>('');
  const [adminLoginPassword, setAdminLoginPassword] = useState<string>('');
  const [showAdminLoginPassword, setShowAdminLoginPassword] = useState<boolean>(false);

  // Admin OTP / Full Registration Form State
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

  // Open the role chooser by default, except for explicit direct role entry points
  // such as the student/admin landing cards.
  useEffect(() => {
    if (isLoginModalOpen) {
      setActiveTab(loginModalDefaultRole);
      if (loginModalDirectOpen) {
        if (loginModalDefaultRole === 'user') {
          setScreen('student');
          setStudentMode('signin');
        } else {
          setScreen('admin');
          setAdminMode('otp');
        }
      } else {
        setScreen('role');
        setStudentMode('login');
        setAdminMode('login');
      }
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [isLoginModalOpen, loginModalDefaultRole, loginModalDirectOpen]);

  // Keep inactive screens out of the tab order / accessibility tree while they slide.
  useEffect(() => {
    const applyInert = (el: HTMLDivElement | null, inactive: boolean) => {
      if (el) (el as HTMLDivElement & { inert?: boolean }).inert = inactive;
    };
    applyInert(roleScreenRef.current, screen !== 'role');
    applyInert(studentScreenRef.current, screen !== 'student');
    applyInert(adminScreenRef.current, screen !== 'admin');
  }, [screen]);

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

  // Handle Admin Direct Login (with Password)
  const handleAdminDirectLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!adminLoginIdentifier.trim()) {
      return setErrorMsg('Please enter your College Admin ID or Admin Email.');
    }
    if (!adminLoginPassword.trim()) {
      return setErrorMsg('Please enter your Admin Password.');
    }

    setIsSubmitting(true);
    const result = await loginAdminWithPassword({
      identifier: adminLoginIdentifier.trim(),
      password: adminLoginPassword,
    });
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMsg(result.message);
    }
  };

  // Handle Admin Login Submit with OTP
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
    setLoginIdentifier('student@college.edu');
    setLoginPassword('Student@123');
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
    setAdminLoginIdentifier('ADM-COLLEGE-001');
    setAdminLoginPassword('Admin@12345');
    setAdminCollegeId('ADM-COLLEGE-001');
    setAdminName('Dr. R. K. Sharma');
    setAdminPassword('Admin@12345');
    setAdminEmail('admin@college.edu');
    setErrorMsg(null);
  };

  // Full-screen slide styles: active screen sits at 0, others wait off-canvas.
  const panelStyle = (key: AuthScreen): React.CSSProperties => {
    const isActive = screen === key;
    const offset = SCREEN_ORDER[key] > SCREEN_ORDER[screen] ? '110%' : '-110%';
    return {
      transform: isActive ? 'translateX(0) scale(1)' : `translateX(${offset}) scale(0.98)`,
      opacity: isActive ? 1 : 0,
      pointerEvents: isActive ? 'auto' : 'none',
    };
  };

  // Jump straight to a role's auth screen (same resets as the old switcher).
  const goToAuth = (role: 'user' | 'admin') => {
    setActiveTab(role);
    setOtpSent(false);
    setErrorMsg(null);
    setSuccessMsg(null);
    setScreen(role === 'user' ? 'student' : 'admin');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[min(90vh,720px)] bg-surface rounded-3xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col">
        {/* Three persistent screens slide horizontally inside this viewport */}
        <div className="relative flex-1 min-h-0">
          {/* ── SCREEN 1: Role Selection ── */}
          <div
            ref={roleScreenRef}
            aria-hidden={screen !== 'role'}
            className="aurora-auth-screen"
            style={panelStyle('role')}
          >
            <div className="flex-1 min-h-0 overflow-y-auto relative">
              {/* Floating decorative code elements */}
              <div className="pointer-events-none select-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <span className="absolute left-[6%] top-[12%] font-mono text-3xl text-aurora-primary/25 aurora-auth-float">{'{ }'}</span>
                <span className="absolute right-[8%] top-[18%] font-mono text-2xl text-aurora-secondary/35 aurora-auth-float" style={{ animationDelay: '1.2s' }}>{'</>'}</span>
                <span className="absolute left-[12%] bottom-[18%] font-mono text-xl text-aurora-primary/20 aurora-auth-float" style={{ animationDelay: '2.4s' }}>{'O(n)'}</span>
                <span className="absolute right-[14%] bottom-[24%] font-mono text-xl text-aurora-accent/40 aurora-auth-float" style={{ animationDelay: '3.2s' }}>{'[ ]'}</span>
                <span className="absolute left-[46%] top-[7%] w-2 h-2 rounded-full bg-aurora-primary/40 aurora-auth-float" style={{ animationDelay: '0.6s' }} />
                <span className="absolute left-[30%] bottom-[10%] w-1.5 h-1.5 rounded-full bg-aurora-secondary/50 aurora-auth-float" style={{ animationDelay: '1.8s' }} />
                <span className="absolute right-[32%] top-[42%] w-1.5 h-1.5 rounded-full bg-aurora-accent/50 aurora-auth-float" style={{ animationDelay: '2.8s' }} />
              </div>

              <div className="relative flex flex-col min-h-full px-6 py-5">
                {/* Brand row + close */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src="/aurora-logo.svg" alt="ALGO-Viz" className="w-10 h-10" />
                    <div>
                      <p className="font-heading text-sm font-extrabold text-aurora-text leading-tight">ALGO-Viz</p>
                      <p className="text-[9px] font-mono uppercase tracking-[0.22em] text-aurora-muted">Aurora Learning</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={closeLoginModal}
                    aria-label="Close authentication"
                    className="w-8 h-8 rounded-full bg-white/90 border border-aurora-border text-aurora-muted hover:text-aurora-text hover:bg-aurora-bg flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Heading */}
                <div className="text-center space-y-2.5 pt-7 pb-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-aurora-primary-soft border border-aurora-primary/25 text-aurora-primary-ink text-[10px] font-mono font-bold uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-aurora-primary animate-pulse" />
                    Verified Sign In
                  </span>
                  <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-aurora-text tracking-tight">
                    Campus Authentication Portal
                  </h1>
                  <p className="text-xs text-aurora-muted max-w-md mx-auto leading-relaxed">
                    Choose how you want to enter ALGO-Viz. Verified Sign In with Password &amp; Email OTP.
                  </p>
                </div>

                {/* Role cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mx-auto pt-6 pb-4">
                  {/* Student / User */}
                  <button
                    type="button"
                    onClick={() => goToAuth('user')}
                    className="group relative text-left rounded-3xl bg-white/90 backdrop-blur-sm border border-aurora-border p-5 shadow-aurora-sm hover:border-aurora-primary/50 hover:shadow-aurora-md hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-primary/40"
                  >
                    <span className="pointer-events-none absolute -right-10 -top-10 w-32 h-32 rounded-full bg-aurora-primary/10 blur-2xl group-hover:bg-aurora-primary/20 transition-colors" />
                    <span className="relative flex w-12 h-12 rounded-2xl bg-aurora-primary-soft border border-aurora-primary/25 text-aurora-primary-ink items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300">
                      <GraduationCap className="w-6 h-6" />
                    </span>
                    <span className="relative block font-heading text-base font-extrabold text-aurora-text mb-1">
                      Student Portal
                    </span>
                    <span className="relative block text-xs text-aurora-muted leading-relaxed mb-3.5">
                      Learn DSA with interactive algorithm visualizations, guided practice and trackable progress.
                    </span>
                    <span className="relative inline-flex items-center gap-1.5 text-[11px] font-bold text-aurora-primary-ink">
                      Continue as Student
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>

                  {/* College Admin */}
                  <button
                    type="button"
                    onClick={() => goToAuth('admin')}
                    className="group relative text-left rounded-3xl bg-white/90 backdrop-blur-sm border border-aurora-border p-5 shadow-aurora-sm hover:border-aurora-secondary/60 hover:shadow-aurora-md hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-secondary/40"
                  >
                    <span className="pointer-events-none absolute -right-10 -top-10 w-32 h-32 rounded-full bg-aurora-secondary/10 blur-2xl group-hover:bg-aurora-secondary/20 transition-colors" />
                    <span className="relative flex w-12 h-12 rounded-2xl bg-aurora-secondary-soft border border-aurora-secondary/30 text-aurora-secondary-ink items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300">
                      <Shield className="w-6 h-6" />
                    </span>
                    <span className="relative block font-heading text-base font-extrabold text-aurora-text mb-1">
                      College Admin
                    </span>
                    <span className="relative block text-xs text-aurora-muted leading-relaxed mb-3.5">
                      Manage campuses, students and platform analytics from one secure console.
                    </span>
                    <span className="relative inline-flex items-center gap-1.5 text-[11px] font-bold text-aurora-secondary-ink">
                      Continue as Admin
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </div>

                <div className="mt-auto pt-4 text-center text-[10px] font-mono text-aurora-muted">
                  Protected by college-verified credentials · Email OTP verification
                </div>
              </div>
            </div>
          </div>

          {/* ── SCREEN 2: Student Authentication ── */}
          <div
            ref={studentScreenRef}
            aria-hidden={screen !== 'student'}
            className="aurora-auth-screen"
            style={panelStyle('student')}
          >
            <div className="flex-1 min-h-0 flex">
              <AuthShowcase role="user" />
              <div className="flex-1 min-h-0 flex flex-col bg-white">
                {/* Screen header: back + role pills + close */}
                <div className="flex items-center justify-between gap-2 px-4 sm:px-5 py-3 border-b border-aurora-border bg-white/90 backdrop-blur shrink-0">
                  <button
                    type="button"
                    onClick={() => setScreen('role')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-bold text-aurora-muted hover:text-aurora-primary-ink hover:bg-aurora-primary-soft transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Switch Role</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1 p-1 rounded-full bg-aurora-bg border border-aurora-border text-[11px]">
                      <button
                        type="button"
                        onClick={() => goToAuth('user')}
                        className={`px-2.5 py-1 rounded-full font-label-md text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          activeTab === 'user'
                            ? 'bg-aurora-primary text-white shadow-sm'
                            : 'text-aurora-muted hover:text-aurora-text'
                        }`}
                      >
                        <GraduationCap className="w-3 h-3" />
                        <span>Student</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => goToAuth('admin')}
                        className={`px-2.5 py-1 rounded-full font-label-md text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          activeTab === 'admin'
                            ? 'bg-aurora-secondary text-white shadow-sm'
                            : 'text-aurora-muted hover:text-aurora-text'
                        }`}
                      >
                        <ShieldCheck className="w-3 h-3" />
                        <span>Admin</span>
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={closeLoginModal}
                      aria-label="Close authentication"
                      className="w-8 h-8 rounded-full text-aurora-muted hover:text-aurora-text hover:bg-aurora-bg border border-aurora-border flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Scrollable form body */}
                <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-5 py-4 space-y-4">
                  {/* Screen heading */}
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-aurora-primary-soft border border-aurora-primary/25 text-aurora-primary-ink flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-heading text-lg font-extrabold text-aurora-text leading-tight">Student Login</h2>
                      <p className="text-[11px] text-aurora-muted">Sign in to your learning dashboard</p>
                    </div>
                  </div>
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

                  <div className="rounded-xl border border-aurora-border bg-aurora-bg px-3 py-2 text-center text-[11px] font-semibold text-aurora-primary-ink">
                    {studentMode === 'login'
                      ? 'You are currently using password login.'
                      : 'You are currently using OTP registration.'}
                  </div>

            <div className="space-y-4">
              {/* MODE 1A: Student Direct Log In Form */}
              {studentMode === 'login' ? (
                <form onSubmit={handleStudentDirectLogin} className="space-y-4">
                  <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20 dark:border-white/10">
                    <span className="font-label-md text-xs text-primary dark:text-cyan-400 font-bold uppercase tracking-wider">
                      Student Account Log In
                    </span>
                    <button
                      type="button"
                      onClick={fillStudentDemo}
                      className="text-[11px] font-medium text-primary dark:text-cyan-400 hover:underline cursor-pointer"
                    >
                      Demo
                    </button>
                  </div>

                  {/* College ID or Email */}
                  <div className="space-y-1">
                    <label className="font-label-sm text-[11px] text-on-surface-variant dark:text-white/70 font-semibold flex items-center gap-1.5">
                      <IdCard className="w-3.5 h-3.5 text-primary" />
                      <span>College ID or Student Email</span>
                    </label>
                    <input
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value.replace(/[<>'"`;()]/g, ''))}
                      placeholder="e.g. COL-2024-CSE-042 or student@college.edu"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 text-xs font-mono text-on-surface dark:text-white placeholder:text-outline-variant focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label className="font-label-sm text-[11px] text-on-surface-variant dark:text-white/70 font-semibold flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-primary" />
                      <span>Student Password</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter your student password"
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

                  {/* Switch to Sign-In with OTP */}
                  <div className="pt-3 border-t border-outline-variant/20 dark:border-white/10 flex flex-col items-center gap-2">
                    <span className="text-[11px] text-on-surface-variant dark:text-white/60">
                      New Student or haven't registered your college email yet?
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
              ) : (
                /* MODE 1B: Student Sign-In / Register with OTP Form */
                <form onSubmit={handleStudentSubmit} className="space-y-3.5">
                  <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="font-label-md text-xs text-on-surface dark:text-white font-bold uppercase tracking-wider">
                        Student Registration / Sign-In
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:text-cyan-400 font-semibold">
                        Email OTP
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={fillStudentDemo}
                      className="text-[11px] font-medium text-primary dark:text-cyan-400 hover:underline cursor-pointer"
                    >
                      Demo
                    </button>
                  </div>

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
                        <span>Section</span>
                      </label>
                      <input
                        type="text"
                        value={studentSection}
                        onChange={(e) => setStudentSection(e.target.value.replace(/[<>'"`;()]/g, ''))}
                        placeholder="e.g. Section A"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 text-xs font-sans text-on-surface dark:text-white placeholder:text-outline-variant focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Branch Selection */}
                  <div className="space-y-1">
                    <label className="font-label-sm text-[11px] text-on-surface-variant dark:text-white/70 font-semibold">
                      Department / Branch
                    </label>
                    <select
                      value={studentBranch}
                      onChange={(e) => setStudentBranch(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low dark:bg-[#11192e] border border-outline-variant/30 dark:border-white/10 text-xs text-on-surface dark:text-white focus:outline-none focus:border-primary"
                    >
                      <option value="Computer Science & Engineering">Computer Science &amp; Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Artificial Intelligence & Data Science">Artificial Intelligence &amp; Data Science</option>
                      <option value="Electronics & Communication">Electronics &amp; Communication</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                    </select>
                  </div>

                  {/* Student Email & Send OTP */}
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
                        className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-white font-label-md text-xs font-bold shrink-0 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
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

                  {/* Set Account Password */}
                  <div className="space-y-1">
                    <label className="font-label-sm text-[11px] text-on-surface-variant dark:text-white/70 font-semibold flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-primary" />
                      <span>Create Account Password (min 6 characters)</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showStudentPassword ? 'text' : 'password'}
                        value={studentPassword}
                        onChange={(e) => setStudentPassword(e.target.value)}
                        placeholder="Choose a secure password"
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
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                        <span>6-Digit Verification Code (OTP)</span>
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
                    <span>Verify Email &amp; Register Student Account</span>
                  </button>

                  {/* Switch back to Log In */}
                  <div className="pt-3 border-t border-outline-variant/20 dark:border-white/10 flex flex-col items-center gap-2">
                    <span className="text-[11px] text-on-surface-variant dark:text-white/60">
                      Already registered your student account?
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setStudentMode('login');
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      className="w-full py-2.5 rounded-xl border border-primary/40 text-primary dark:text-cyan-300 hover:bg-primary/10 font-label-md text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Back to Student Log In</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── SCREEN 3: College Admin Authentication ── */}
          <div
            ref={adminScreenRef}
            aria-hidden={screen !== 'admin'}
            className="aurora-auth-screen"
            style={panelStyle('admin')}
          >
            <div className="flex-1 min-h-0 flex">
              <AuthShowcase role="admin" />
              <div className="flex-1 min-h-0 flex flex-col bg-white">
                {/* Screen header: back + role pills + close */}
                <div className="flex items-center justify-between gap-2 px-4 sm:px-5 py-3 border-b border-aurora-border bg-white/90 backdrop-blur shrink-0">
                  <button
                    type="button"
                    onClick={() => setScreen('role')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-bold text-aurora-muted hover:text-aurora-secondary-ink hover:bg-aurora-secondary-soft transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Switch Role</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1 p-1 rounded-full bg-aurora-bg border border-aurora-border text-[11px]">
                      <button
                        type="button"
                        onClick={() => goToAuth('user')}
                        className={`px-2.5 py-1 rounded-full font-label-md text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          activeTab === 'user'
                            ? 'bg-aurora-primary text-white shadow-sm'
                            : 'text-aurora-muted hover:text-aurora-text'
                        }`}
                      >
                        <GraduationCap className="w-3 h-3" />
                        <span>Student</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => goToAuth('admin')}
                        className={`px-2.5 py-1 rounded-full font-label-md text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          activeTab === 'admin'
                            ? 'bg-aurora-secondary text-white shadow-sm'
                            : 'text-aurora-muted hover:text-aurora-text'
                        }`}
                      >
                        <ShieldCheck className="w-3 h-3" />
                        <span>Admin</span>
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={closeLoginModal}
                      aria-label="Close authentication"
                      className="w-8 h-8 rounded-full text-aurora-muted hover:text-aurora-text hover:bg-aurora-bg border border-aurora-border flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Scrollable form body */}
                <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-5 py-4 space-y-4">
                  {/* Screen heading */}
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-aurora-secondary-soft border border-aurora-secondary/30 text-aurora-secondary-ink flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-heading text-lg font-extrabold text-aurora-text leading-tight">College Admin</h2>
                      <p className="text-[11px] text-aurora-muted">Secure administrative access to your campus</p>
                    </div>
                  </div>

                  {/* Alerts */}
                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs font-medium flex items-start gap-2 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {successMsg && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-medium flex items-start gap-2 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{successMsg}</span>
                    </div>
                  )}

                  <div className="rounded-xl border border-aurora-border bg-aurora-bg px-3 py-2 text-center text-[11px] font-semibold text-aurora-secondary-ink">
                    {adminMode === 'login'
                      ? 'You are currently using password login.'
                      : 'You are currently using OTP verification.'}
                  </div>

            <div className="space-y-4">
              {/* MODE 2A: College Admin Direct Log In Form */}
              {adminMode === 'login' ? (
                <form onSubmit={handleAdminDirectLogin} className="space-y-4">
                  <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20 dark:border-white/10">
                    <span className="font-label-md text-xs text-aurora-primary-ink dark:text-purple-300 font-bold uppercase tracking-wider">
                      Admin Account Log In
                    </span>
                    <button
                      type="button"
                      onClick={fillAdminDemo}
                      className="text-[11px] font-medium text-aurora-primary-ink dark:text-aurora-primary hover:underline cursor-pointer"
                    >
                      Demo
                    </button>
                  </div>

                  {/* Admin Identifier */}
                  <div className="space-y-1">
                    <label className="font-label-sm text-[11px] text-on-surface-variant dark:text-white/70 font-semibold flex items-center gap-1.5">
                      <IdCard className="w-3.5 h-3.5 text-aurora-primary" />
                      <span>College Admin ID or Admin Email</span>
                    </label>
                    <input
                      type="text"
                      value={adminLoginIdentifier}
                      onChange={(e) => setAdminLoginIdentifier(e.target.value.replace(/[<>'"`;()]/g, ''))}
                      placeholder="e.g. ADM-COLLEGE-001 or admin@college.edu"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 text-xs font-mono text-on-surface dark:text-white placeholder:text-outline-variant focus:outline-none focus:border-aurora-primary"
                    />
                  </div>

                  {/* Admin Password */}
                  <div className="space-y-1">
                    <label className="font-label-sm text-[11px] text-on-surface-variant dark:text-white/70 font-semibold flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-aurora-primary" />
                      <span>Admin Password</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showAdminLoginPassword ? 'text' : 'password'}
                        value={adminLoginPassword}
                        onChange={(e) => setAdminLoginPassword(e.target.value)}
                        placeholder="Enter admin password (e.g. Admin@12345)"
                        className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 text-xs font-mono text-on-surface dark:text-white placeholder:text-outline-variant focus:outline-none focus:border-aurora-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminLoginPassword(!showAdminLoginPassword)}
                        className="absolute right-3 top-2.5 text-on-surface-variant hover:text-on-surface cursor-pointer"
                      >
                        {showAdminLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Admin Login Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-3 rounded-2xl bg-aurora-primary hover:opacity-95 text-white font-label-lg text-xs font-bold shadow-aurora-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogIn className="w-4 h-4" />
                    )}
                    <span>Log In as College Admin</span>
                  </button>

                  {/* Switch to OTP Verification */}
                  <div className="pt-3 border-t border-outline-variant/20 dark:border-white/10 flex flex-col items-center gap-2">
                    <span className="text-[11px] text-on-surface-variant dark:text-white/60">
                      Need email OTP verification or first-time setup?
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAdminMode('otp');
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      className="w-full py-2.5 rounded-xl border border-aurora-primary/40 text-aurora-primary-ink dark:text-purple-300 hover:bg-aurora-primary/10 font-label-md text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Admin Email OTP &amp; 2FA Verification</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* MODE 2B: College Admin OTP Verification Form */
                <form onSubmit={handleAdminSubmit} className="space-y-3.5">
                  <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="font-label-md text-xs text-aurora-primary-ink dark:text-purple-300 font-bold uppercase tracking-wider">
                        Admin 2FA / OTP Verification
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-aurora-primary/10 text-aurora-primary-ink dark:text-purple-300 font-semibold border border-aurora-primary/20">
                        Email OTP
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={fillAdminDemo}
                      className="text-[11px] font-medium text-aurora-primary-ink dark:text-aurora-primary hover:underline cursor-pointer"
                    >
                      Demo
                    </button>
                  </div>

                  {/* College ID */}
                  <div className="space-y-1">
                    <label className="font-label-sm text-[11px] text-on-surface-variant dark:text-white/70 font-semibold flex items-center gap-1.5">
                      <IdCard className="w-3.5 h-3.5 text-aurora-primary" />
                      <span>College Admin ID</span>
                    </label>
                    <input
                      type="text"
                      value={adminCollegeId}
                      onChange={(e) => setAdminCollegeId(e.target.value.replace(/[<>'"`;()]/g, ''))}
                      placeholder="e.g. ADM-COLLEGE-001"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 text-xs font-mono text-on-surface dark:text-white placeholder:text-outline-variant focus:outline-none focus:border-aurora-primary"
                    />
                  </div>

                  {/* Admin Name */}
                  <div className="space-y-1">
                    <label className="font-label-sm text-[11px] text-on-surface-variant dark:text-white/70 font-semibold flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-aurora-primary" />
                      <span>Admin Full Name</span>
                    </label>
                    <input
                      type="text"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value.replace(/[<>'"`;()]/g, ''))}
                      placeholder="e.g. Dr. R. K. Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 text-xs font-mono text-on-surface dark:text-white placeholder:text-outline-variant focus:outline-none focus:border-aurora-primary"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label className="font-label-sm text-[11px] text-on-surface-variant dark:text-white/70 font-semibold flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-aurora-primary" />
                      <span>Admin Password</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showAdminPassword ? 'text' : 'password'}
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Enter password (e.g. Admin@12345)"
                        className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 text-xs font-mono text-on-surface dark:text-white placeholder:text-outline-variant focus:outline-none focus:border-aurora-primary"
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
                      <Mail className="w-3.5 h-3.5 text-aurora-primary" />
                      <span>Admin Email (for OTP verification)</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="admin@college.edu"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 text-xs font-mono text-on-surface dark:text-white placeholder:text-outline-variant focus:outline-none focus:border-aurora-primary"
                      />
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isSendingOtp || otpCountdown > 0}
                        className="px-4 py-2 rounded-xl bg-aurora-primary hover:bg-aurora-primary-ink text-white font-label-md text-xs font-bold shrink-0 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
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
                        <ShieldCheck className="w-3.5 h-3.5 text-aurora-primary" />
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
                      className="w-full text-center tracking-[0.4em] font-mono text-base font-bold px-3 py-2.5 rounded-xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 text-on-surface dark:text-white placeholder:text-outline-variant focus:outline-none focus:border-aurora-primary"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-3 rounded-2xl bg-aurora-primary hover:opacity-95 text-white font-label-lg text-xs font-bold shadow-aurora-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                    <span>Verify Email &amp; Access Admin Console</span>
                  </button>

                  {/* Switch back to Direct Login */}
                  <div className="pt-3 border-t border-outline-variant/20 dark:border-white/10 flex flex-col items-center gap-2">
                    <span className="text-[11px] text-on-surface-variant dark:text-white/60">
                      Already verified or want to use your password?
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAdminMode('login');
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      className="w-full py-2.5 rounded-xl border border-aurora-primary/40 text-aurora-primary-ink dark:text-purple-300 hover:bg-aurora-primary/10 font-label-md text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Back to Admin Log In</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
