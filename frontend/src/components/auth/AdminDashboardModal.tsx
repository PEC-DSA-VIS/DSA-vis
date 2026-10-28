import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  GraduationCap,
  Users,
  Search,
  Filter,
  Download,
  Building2,
  Mail,
  CheckCircle2,
  IdCard,
  BookOpen,
  Calendar,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StudentUser } from '../../types/auth';

export const AdminDashboardModal: React.FC = () => {
  const { user, token, isAdmin, isAdminDashboardOpen, closeAdminDashboard, logout } = useAuth();
  const [students, setStudents] = useState<StudentUser[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [branchFilter, setBranchFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isAdminDashboardOpen || !isAdmin || !token) return;

    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const resp = await fetch('/api/auth/admin/students', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resp.ok) {
          const data = await resp.json();
          if (data.students) setStudents(data.students);
        }
      } catch (err) {
        console.error('Failed to load students roster:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [isAdminDashboardOpen, isAdmin, token]);

  if (!isAdminDashboardOpen || !isAdmin) return null;

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.collegeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.section.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = branchFilter === 'ALL' || s.branch === branchFilter;
    return matchesSearch && matchesBranch;
  });

  const exportCSV = () => {
    const headers = 'College ID,Roll Number,Branch,Section,Email,Verified,Registered At\n';
    const rows = filteredStudents
      .map(
        (s) =>
          `"${s.collegeId}","${s.rollNumber}","${s.branch}","${s.section}","${s.email}","${
            s.isEmailVerified ? 'Yes' : 'No'
          }","${s.createdAt || ''}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Students_Roster_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-surface dark:bg-[#0c1222] rounded-3xl shadow-2xl border border-outline-variant/30 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container-low dark:bg-white/5 border-b border-outline-variant/20 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-600 dark:text-purple-300 flex items-center justify-center border border-purple-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-sm text-base font-extrabold text-on-surface dark:text-white">
                  College Admin Console
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-600/20 text-purple-600 dark:text-purple-300 border border-purple-500/30">
                  VERIFIED ADMIN
                </span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant dark:text-white/60">
                {(user as any)?.name} · College ID: {user?.collegeId} · {user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="px-3.5 py-1.5 rounded-xl bg-surface-container dark:bg-white/10 hover:bg-surface-container-high text-xs font-mono font-semibold text-on-surface dark:text-white flex items-center gap-1.5 transition-colors cursor-pointer border border-outline-variant/20 dark:border-white/10"
              title="Export filtered student roster to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={closeAdminDashboard}
              className="w-8 h-8 rounded-full hover:bg-surface-container dark:hover:bg-white/10 text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="p-6 bg-surface-container-lowest dark:bg-transparent border-b border-outline-variant/20 dark:border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/20 dark:border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-on-surface-variant dark:text-white/60 uppercase font-semibold block">
                Enrolled Students
              </span>
              <span className="font-headline-sm text-xl font-extrabold text-on-surface dark:text-white">
                {students.length}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/20 dark:border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-on-surface-variant dark:text-white/60 uppercase font-semibold block">
                Active Branches
              </span>
              <span className="font-headline-sm text-xl font-extrabold text-on-surface dark:text-white">
                {new Set(students.map((s) => s.branch)).size || 1}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/20 dark:border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-on-surface-variant dark:text-white/60 uppercase font-semibold block">
                OTP Verified
              </span>
              <span className="font-headline-sm text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                100%
              </span>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 bg-surface-container-low dark:bg-white/5 border-b border-outline-variant/20 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-sm bg-surface dark:bg-black/40 px-3 py-1.5 rounded-xl border border-outline-variant/30 dark:border-white/10">
            <Search className="w-4 h-4 text-outline" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Roll No, College ID, Section..."
              className="w-full bg-transparent text-xs font-mono text-on-surface dark:text-white outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-outline" />
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl bg-surface dark:bg-[#131d33] border border-outline-variant/30 dark:border-white/10 text-on-surface dark:text-white outline-none cursor-pointer"
            >
              <option value="ALL">All Branches</option>
              <option value="Computer Science & Engineering">CSE</option>
              <option value="Information Technology">IT</option>
              <option value="Artificial Intelligence & ML">AI/ML</option>
              <option value="Data Science & Engineering">Data Science</option>
              <option value="Electronics & Communication">ECE</option>
              <option value="Electrical Engineering">EE</option>
              <option value="Mechanical Engineering">ME</option>
              <option value="Civil Engineering">CE</option>
            </select>
          </div>
        </div>

        {/* Students Roster Table */}
        <div className="p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="text-center py-12 text-xs font-mono text-on-surface-variant">
              Loading enrolled students roster...
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <GraduationCap className="w-10 h-10 mx-auto text-outline" />
              <p className="font-headline-sm text-sm font-bold text-on-surface dark:text-white">
                No students found
              </p>
              <p className="font-body-sm text-xs text-on-surface-variant dark:text-white/60">
                Students will appear here once they log in and verify their college ID and email.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-outline-variant/20 dark:border-white/10">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-surface-container-low dark:bg-white/5 text-on-surface-variant dark:text-white/60 text-[11px] uppercase tracking-wider border-b border-outline-variant/20 dark:border-white/10">
                  <tr>
                    <th className="p-3.5">College ID</th>
                    <th className="p-3.5">Roll Number</th>
                    <th className="p-3.5">Branch</th>
                    <th className="p-3.5">Section</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 dark:divide-white/5">
                  {filteredStudents.map((s, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-surface-container-lowest dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-3.5 font-bold text-primary dark:text-cyan-300">
                        {s.collegeId}
                      </td>
                      <td className="p-3.5 font-bold text-on-surface dark:text-white">
                        {s.rollNumber}
                      </td>
                      <td className="p-3.5 text-on-surface-variant dark:text-white/80">
                        {s.branch}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-md bg-surface-container dark:bg-white/10 text-on-surface dark:text-white text-[10px] font-bold">
                          {s.section}
                        </span>
                      </td>
                      <td className="p-3.5 text-on-surface-variant dark:text-white/70">
                        {s.email}
                      </td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verified</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
