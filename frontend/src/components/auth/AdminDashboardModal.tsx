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
  Trophy,
  BarChart3,
  Flame,
  UserCheck,
  UserX,
  Plus,
  Send,
  Clock,
  Sparkles,
  Award,
  AlertCircle,
  FileCode,
  Tag,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StudentUser } from '../../types/auth';

interface ContestItem {
  id: string;
  title: string;
  topic: string;
  branchEligibility: string;
  durationMinutes: number;
  totalPoints: number;
  status: 'live' | 'upcoming' | 'completed';
  createdBy: string;
  questionsCount?: number;
}

interface QuestionItem {
  id: string;
  title: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  statement: string;
  constraints?: string;
  addedBy: string;
}

interface AnalyticsData {
  totalStudents: number;
  branchBreakdown: Record<string, number>;
  regularityStats: {
    regular: number;
    moderate: number;
    timepass: number;
    regularPercentage: number;
    timepassPercentage: number;
  };
  studentsRoster: Array<{
    collegeId: string;
    name: string;
    rollNumber: string;
    branch: string;
    section: string;
    email: string;
    daysActive: number;
    problemsSolved: number;
    contestsAttended: number;
    hoursSpent: number;
    engagementTag: 'regular' | 'moderate' | 'timepass';
    engagementLabel: string;
    streakText: string;
  }>;
}

export const AdminDashboardModal: React.FC = () => {
  const { user, token, isAdmin, isAdminDashboardOpen, closeAdminDashboard } = useAuth();

  // Active Admin View Tab
  const [activeTab, setActiveTab] = useState<'contests' | 'analytics' | 'regularity' | 'questions'>('contests');

  // Contests State
  const [contests, setContests] = useState<ContestItem[]>([]);
  const [selectedContestForResults, setSelectedContestForResults] = useState<string | null>(null);
  const [contestResults, setContestResults] = useState<any[]>([]);
  const [isOrganizingContest, setIsOrganizingContest] = useState(false);
  const [newContestTitle, setNewContestTitle] = useState('');
  const [newContestTopic, setNewContestTopic] = useState('Dynamic Programming & Graphs');
  const [newContestBranch, setNewContestBranch] = useState('ALL');
  const [newContestDuration, setNewContestDuration] = useState('90');
  const [newContestPoints, setNewContestPoints] = useState('300');

  // Analytics & Regularity State
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [regularityFilter, setRegularityFilter] = useState<'all' | 'regular' | 'moderate' | 'timepass'>('all');
  const [branchFilter, setBranchFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Questions Bank State
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQTitle, setNewQTitle] = useState('');
  const [newQTopic, setNewQTopic] = useState('Dynamic Programming');
  const [newQDifficulty, setNewQDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [newQPoints, setNewQPoints] = useState('100');
  const [newQStatement, setNewQStatement] = useState('');
  const [newQConstraints, setNewQConstraints] = useState('');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Fetch Admin Data
  const fetchAdminData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      // 1. Fetch Contests
      const contestRes = await fetch('/api/contests');
      if (contestRes.ok) {
        const cData = await contestRes.json();
        if (cData.contests) setContests(cData.contests);
      }

      // 2. Fetch Analytics (Branch Breakdown + Regularity)
      const analyticsRes = await fetch('/api/admin/analytics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (analyticsRes.ok) {
        const aData = await analyticsRes.json();
        if (aData.analytics) setAnalytics(aData.analytics);
      }

      // 3. Fetch Questions Bank
      const qRes = await fetch('/api/admin/questions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (qRes.ok) {
        const qData = await qRes.json();
        if (qData.questions) setQuestions(qData.questions);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminDashboardOpen && isAdmin && token) {
      fetchAdminData();
    }
  }, [isAdminDashboardOpen, isAdmin, token]);

  if (!isAdminDashboardOpen || !isAdmin) return null;

  // View Results for Contest
  const handleViewResults = async (contestId: string) => {
    setSelectedContestForResults(contestId);
    try {
      const resp = await fetch(`/api/contests/${contestId}/leaderboard`);
      if (resp.ok) {
        const data = await resp.json();
        if (data.leaderboard) setContestResults(data.leaderboard);
      }
    } catch (e) {
      console.error('Failed to load contest leaderboard:', e);
    }
  };

  // Organize New Contest Submit
  const handleCreateContest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContestTitle.trim()) return;

    try {
      const resp = await fetch('/api/admin/contests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newContestTitle.trim(),
          topic: newContestTopic,
          branchEligibility: newContestBranch,
          durationMinutes: parseInt(newContestDuration, 10) || 90,
          totalPoints: parseInt(newContestPoints, 10) || 300,
          status: 'live',
          questions: [
            {
              id: `q-${Date.now()}-1`,
              title: `${newContestTopic} Invariant Challenge`,
              topic: newContestTopic,
              difficulty: 'Medium',
              points: 100,
              statement: `Optimize algorithmic invariants for ${newContestTopic} with strict bounds.`,
              constraints: '1 <= N <= 10^5',
              sampleInput: 'Input test array',
              sampleOutput: 'Optimal result',
            },
          ],
        }),
      });

      if (resp.ok) {
        setActionSuccessMsg(`Contest "${newContestTitle}" organized and published successfully!`);
        setIsOrganizingContest(false);
        setNewContestTitle('');
        fetchAdminData();
        setTimeout(() => setActionSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error('Error organizing contest:', err);
    }
  };

  // Add Question / Topic Submit
  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQTitle.trim() || !newQStatement.trim()) return;

    try {
      const resp = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newQTitle.trim(),
          topic: newQTopic,
          difficulty: newQDifficulty,
          points: parseInt(newQPoints, 10) || 100,
          statement: newQStatement.trim(),
          constraints: newQConstraints.trim() || 'Standard time limit 1.0s, memory 256MB',
        }),
      });

      if (resp.ok) {
        setActionSuccessMsg(`Question "${newQTitle}" added to curriculum question bank!`);
        setIsAddingQuestion(false);
        setNewQTitle('');
        setNewQStatement('');
        setNewQConstraints('');
        fetchAdminData();
        setTimeout(() => setActionSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error('Error adding question:', err);
    }
  };

  // Filtered Roster for Regularity Tab
  const filteredStudents = (analytics?.studentsRoster || []).filter((s) => {
    const matchesRegularity = regularityFilter === 'all' || s.engagementTag === regularityFilter;
    const matchesBranch = branchFilter === 'ALL' || s.branch === branchFilter;
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.collegeId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRegularity && matchesBranch && matchesSearch;
  });

  // Export Results / Roster to CSV
  const exportRosterCSV = () => {
    const headers = 'College ID,Name,Roll Number,Branch,Section,Status,Days Active,Problems Solved,Contests Attended\n';
    const rows = filteredStudents
      .map(
        (s) =>
          `"${s.collegeId}","${s.name}","${s.rollNumber}","${s.branch}","${s.section}","${s.engagementLabel}","${s.daysActive}","${s.problemsSolved}","${s.contestsAttended}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Student_Regularity_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-6xl h-[92vh] bg-surface dark:bg-[#0c1222] rounded-3xl shadow-2xl border border-outline-variant/30 dark:border-white/10 overflow-hidden flex flex-col">
        {/* Header Strip */}
        <div className="px-6 py-4 bg-surface-container-low dark:bg-white/5 border-b border-outline-variant/20 dark:border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/20 text-purple-600 dark:text-purple-300 flex items-center justify-center border border-purple-500/30 font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-sm text-base font-extrabold text-on-surface dark:text-white">
                  College Administration &amp; Examination Console
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-600/20 text-purple-600 dark:text-purple-300 border border-purple-500/30">
                  HEAD ADMIN
                </span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant dark:text-white/60">
                {(user as any)?.name} · College ID: {user?.collegeId} · Connected to MongoDB Atlas
              </p>
            </div>
          </div>

          <button
            onClick={closeAdminDashboard}
            className="w-8 h-8 rounded-full hover:bg-surface-container dark:hover:bg-white/10 text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Notification Alert */}
        {actionSuccessMsg && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 font-mono text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* Executive Tab Navigation Switcher */}
        <div className="px-6 py-3 bg-surface-container-lowest dark:bg-transparent border-b border-outline-variant/20 dark:border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-1 bg-surface-container-low dark:bg-black/40 rounded-2xl border border-outline-variant/20 dark:border-white/10">
            <button
              onClick={() => setActiveTab('contests')}
              className={`py-2 px-3 rounded-xl font-label-md text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'contests'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-on-surface-variant dark:text-white/70 hover:text-on-surface'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Contests &amp; Results</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-3 rounded-xl font-label-md text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-on-surface-variant dark:text-white/70 hover:text-on-surface'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Branch Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('regularity')}
              className={`py-2 px-3 rounded-xl font-label-md text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'regularity'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-on-surface-variant dark:text-white/70 hover:text-on-surface'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Regularity Tracker</span>
            </button>

            <button
              onClick={() => setActiveTab('questions')}
              className={`py-2 px-3 rounded-xl font-label-md text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'questions'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-on-surface-variant dark:text-white/70 hover:text-on-surface'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Questions &amp; Topics</span>
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6">
          {/* ================= TAB 1: CONTESTS ORGANIZER & RESULTS ================= */}
          {activeTab === 'contests' && (
            <div className="space-y-6">
              {/* Header Action Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/20 dark:border-white/10">
                <div>
                  <h3 className="font-headline-sm text-base font-bold text-on-surface dark:text-white flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>Campus Competitive Programming Contests</span>
                  </h3>
                  <p className="font-body-sm text-xs text-on-surface-variant dark:text-white/60">
                    Schedule live challenges, attach problem sets, and review student rank scorecards.
                  </p>
                </div>

                <button
                  onClick={() => setIsOrganizingContest(!isOrganizingContest)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-label-md text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isOrganizingContest ? 'Close Form' : 'Organize New Contest'}</span>
                </button>
              </div>

              {/* Form to Organize New Contest */}
              {isOrganizingContest && (
                <form
                  onSubmit={handleCreateContest}
                  className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-[#10182f] border border-purple-500/40 shadow-lg space-y-4 animate-in fade-in"
                >
                  <h4 className="font-label-lg text-sm font-bold text-purple-600 dark:text-purple-300">
                    Create &amp; Publish Campus Contest
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-on-surface-variant dark:text-white/70">
                        Contest Title
                      </label>
                      <input
                        type="text"
                        value={newContestTitle}
                        onChange={(e) => setNewContestTitle(e.target.value)}
                        placeholder="e.g. Inter-Branch CodeSprint: Trees & Dynamic Programming"
                        className="w-full px-3.5 py-2 rounded-xl bg-surface-container dark:bg-black/30 border border-outline-variant/30 dark:border-white/10 text-xs font-mono text-on-surface dark:text-white outline-none focus:border-purple-500"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-on-surface-variant dark:text-white/70">
                        Primary Topic Focus
                      </label>
                      <input
                        type="text"
                        value={newContestTopic}
                        onChange={(e) => setNewContestTopic(e.target.value)}
                        placeholder="e.g. Arrays, Trees, Dynamic Programming"
                        className="w-full px-3.5 py-2 rounded-xl bg-surface-container dark:bg-black/30 border border-outline-variant/30 dark:border-white/10 text-xs font-mono text-on-surface dark:text-white outline-none focus:border-purple-500"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-on-surface-variant dark:text-white/70">
                        Branch Eligibility
                      </label>
                      <select
                        value={newContestBranch}
                        onChange={(e) => setNewContestBranch(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-surface-container dark:bg-[#131d33] border border-outline-variant/30 dark:border-white/10 text-xs text-on-surface dark:text-white outline-none"
                      >
                        <option value="ALL">All Engineering Branches (Open Campus)</option>
                        <option value="Computer Science & Engineering">CSE Department Only</option>
                        <option value="Information Technology">IT Department Only</option>
                        <option value="Artificial Intelligence & ML">AI / ML Department Only</option>
                        <option value="Electronics & Communication">ECE Department Only</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-on-surface-variant dark:text-white/70">
                          Duration (Minutes)
                        </label>
                        <input
                          type="number"
                          value={newContestDuration}
                          onChange={(e) => setNewContestDuration(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-surface-container dark:bg-black/30 border border-outline-variant/30 dark:border-white/10 text-xs font-mono text-on-surface dark:text-white outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-on-surface-variant dark:text-white/70">
                          Total Points
                        </label>
                        <input
                          type="number"
                          value={newContestPoints}
                          onChange={(e) => setNewContestPoints(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-surface-container dark:bg-black/30 border border-outline-variant/30 dark:border-white/10 text-xs font-mono text-on-surface dark:text-white outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-label-md text-xs font-bold transition-all cursor-pointer shadow-md"
                  >
                    Publish Contest Live
                  </button>
                </form>
              )}

              {/* Contests Table */}
              <div className="overflow-x-auto rounded-2xl border border-outline-variant/20 dark:border-white/10">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-surface-container-low dark:bg-white/5 text-on-surface-variant dark:text-white/60 text-[11px] uppercase tracking-wider border-b border-outline-variant/20 dark:border-white/10">
                    <tr>
                      <th className="p-3.5">Contest Title</th>
                      <th className="p-3.5">Topic Focus</th>
                      <th className="p-3.5">Eligibility</th>
                      <th className="p-3.5">Duration</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10 dark:divide-white/5">
                    {contests.map((c) => (
                      <tr key={c.id} className="hover:bg-surface-container-lowest dark:hover:bg-white/[0.02]">
                        <td className="p-3.5 font-bold text-on-surface dark:text-white">
                          {c.title}
                        </td>
                        <td className="p-3.5 text-primary dark:text-cyan-300 font-semibold">
                          {c.topic}
                        </td>
                        <td className="p-3.5 text-on-surface-variant dark:text-white/80">
                          {c.branchEligibility}
                        </td>
                        <td className="p-3.5 text-on-surface-variant dark:text-white/70">
                          {c.durationMinutes} mins
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              c.status === 'live'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : c.status === 'upcoming'
                                ? 'bg-purple-500/20 text-purple-400'
                                : 'bg-white/10 text-white/60'
                            }`}
                          >
                            {c.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <button
                            onClick={() => handleViewResults(c.id)}
                            className="px-3 py-1 rounded-lg bg-surface-container dark:bg-white/10 hover:bg-purple-600 hover:text-white text-on-surface dark:text-white text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            View Standings / Result
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Selected Contest Results View */}
              {selectedContestForResults && (
                <div className="p-5 rounded-2xl bg-surface-container-low dark:bg-white/5 border border-purple-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-headline-sm text-sm font-bold text-on-surface dark:text-white">
                        Contest Submissions &amp; Rank Standings ({contestResults.length} Submissions)
                      </h4>
                      <p className="text-[11px] text-on-surface-variant dark:text-white/60 font-mono">
                        Contest ID: {selectedContestForResults}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedContestForResults(null)}
                      className="text-xs text-on-surface-variant hover:text-on-surface cursor-pointer"
                    >
                      Close Standings
                    </button>
                  </div>

                  {contestResults.length === 0 ? (
                    <div className="text-center py-6 text-xs text-on-surface-variant">
                      No student submissions recorded yet for this contest.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-white/10">
                      <table className="w-full text-left font-mono text-xs">
                        <thead className="bg-black/30 text-white/60 text-[10px] uppercase">
                          <tr>
                            <th className="p-2.5">Rank</th>
                            <th className="p-2.5">Student Name</th>
                            <th className="p-2.5">Roll Number</th>
                            <th className="p-2.5">Branch</th>
                            <th className="p-2.5">Score</th>
                            <th className="p-2.5">Penalty Time</th>
                            <th className="p-2.5">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {contestResults.map((sub, idx) => (
                            <tr key={idx} className="hover:bg-white/5">
                              <td className="p-2.5 font-bold text-amber-400">#{sub.rank || idx + 1}</td>
                              <td className="p-2.5 font-bold text-white">{sub.name}</td>
                              <td className="p-2.5 text-cyan-300">{sub.rollNumber}</td>
                              <td className="p-2.5 text-white/80">{sub.branch}</td>
                              <td className="p-2.5 font-bold text-emerald-400">{sub.score} Pts</td>
                              <td className="p-2.5 text-white/70">{sub.penaltyTime}</td>
                              <td className="p-2.5 text-xs text-emerald-400">{sub.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 2: BRANCH-WISE ANALYTICS ================= */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/20 dark:border-white/10">
                <h3 className="font-headline-sm text-base font-bold text-on-surface dark:text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span>Branch-Wise Student Enrollment &amp; Attendance Breakdown</span>
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant dark:text-white/60">
                  Track how many engineering students are active across every college department.
                </p>
              </div>

              {/* Branch Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(analytics?.branchBreakdown || {}).map(([branch, count]) => {
                  const total = analytics?.totalStudents || 1;
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div
                      key={branch}
                      className="p-4 rounded-2xl bg-surface-container-lowest dark:bg-[#0f172a] border border-outline-variant/30 dark:border-white/10 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-on-surface dark:text-white truncate max-w-[160px]">
                          {branch}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-purple-600/20 text-purple-400 font-mono text-[10px] font-bold">
                          {pct}%
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between">
                        <span className="font-headline-sm text-2xl font-black text-on-surface dark:text-white">
                          {count}
                        </span>
                        <span className="text-xs text-on-surface-variant dark:text-white/60 font-mono">
                          students
                        </span>
                      </div>

                      {/* Visual Progress Bar */}
                      <div className="w-full h-2 bg-surface-container dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all"
                          style={{ width: `${Math.max(pct, 6)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= TAB 3: STUDENT REGULARITY TRACKER ================= */}
          {activeTab === 'regularity' && (
            <div className="space-y-6">
              {/* Engagement Metric Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. Regular Achievers */}
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                      Regular Achievers (Active)
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-headline-sm text-2xl font-black text-on-surface dark:text-white">
                        {analytics?.regularityStats.regular || 0}
                      </span>
                      <span className="text-xs font-mono text-emerald-400">
                        ({analytics?.regularityStats.regularPercentage || 0}% of campus)
                      </span>
                    </div>
                    <span className="text-[10px] text-on-surface-variant dark:text-white/60">
                      Daily coding, active streaks &amp; contest attempts
                    </span>
                  </div>
                </div>

                {/* 2. Moderate */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                      Moderate / Occasional
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-headline-sm text-2xl font-black text-on-surface dark:text-white">
                        {analytics?.regularityStats.moderate || 0}
                      </span>
                    </div>
                    <span className="text-[10px] text-on-surface-variant dark:text-white/60">
                      1-2 sessions/week, moderate practice
                    </span>
                  </div>
                </div>

                {/* 3. Timepass / Inactive */}
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                    <UserX className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-rose-400 font-bold uppercase tracking-wider block">
                      Timepass / Inactive (Ghost)
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-headline-sm text-2xl font-black text-on-surface dark:text-white">
                        {analytics?.regularityStats.timepass || 0}
                      </span>
                      <span className="text-xs font-mono text-rose-400">
                        ({analytics?.regularityStats.timepassPercentage || 0}%)
                      </span>
                    </div>
                    <span className="text-[10px] text-on-surface-variant dark:text-white/60">
                      0 problems solved, &lt;2 mins spent, no contests
                    </span>
                  </div>
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/20 dark:border-white/10">
                {/* Regularity Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <button
                    onClick={() => setRegularityFilter('all')}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                      regularityFilter === 'all'
                        ? 'bg-purple-600 text-white'
                        : 'text-on-surface-variant dark:text-white/70 hover:text-on-surface'
                    }`}
                  >
                    All Students ({analytics?.studentsRoster.length || 0})
                  </button>
                  <button
                    onClick={() => setRegularityFilter('regular')}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                      regularityFilter === 'regular'
                        ? 'bg-emerald-600 text-white'
                        : 'text-on-surface-variant dark:text-white/70 hover:text-on-surface'
                    }`}
                  >
                    🟢 Regular Only ({analytics?.regularityStats.regular || 0})
                  </button>
                  <button
                    onClick={() => setRegularityFilter('moderate')}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                      regularityFilter === 'moderate'
                        ? 'bg-amber-600 text-white'
                        : 'text-on-surface-variant dark:text-white/70 hover:text-on-surface'
                    }`}
                  >
                    🟡 Moderate
                  </button>
                  <button
                    onClick={() => setRegularityFilter('timepass')}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                      regularityFilter === 'timepass'
                        ? 'bg-rose-600 text-white'
                        : 'text-on-surface-variant dark:text-white/70 hover:text-on-surface'
                    }`}
                  >
                    🔴 Timepass / Inactive ({analytics?.regularityStats.timepass || 0})
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Branch Filter */}
                  <select
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                    className="text-xs font-mono px-3 py-1.5 rounded-xl bg-surface-container dark:bg-[#131d33] border border-outline-variant/30 dark:border-white/10 text-on-surface dark:text-white outline-none cursor-pointer"
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

                  <button
                    onClick={exportRosterCSV}
                    className="px-3 py-1.5 rounded-xl bg-surface-container dark:bg-white/10 hover:bg-surface-container-high text-xs font-mono font-semibold text-on-surface dark:text-white flex items-center gap-1.5 cursor-pointer border border-outline-variant/20 dark:border-white/10"
                    title="Export Regularity CSV"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Student Roster Table with Regularity Badges */}
              <div className="overflow-x-auto rounded-2xl border border-outline-variant/20 dark:border-white/10">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-surface-container-low dark:bg-white/5 text-on-surface-variant dark:text-white/60 text-[11px] uppercase tracking-wider border-b border-outline-variant/20 dark:border-white/10">
                    <tr>
                      <th className="p-3.5">Student</th>
                      <th className="p-3.5">Roll Number</th>
                      <th className="p-3.5">Branch &amp; Sec</th>
                      <th className="p-3.5">Engagement Status</th>
                      <th className="p-3.5">Active Days</th>
                      <th className="p-3.5">Problems Solved</th>
                      <th className="p-3.5">Practice Hours</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10 dark:divide-white/5">
                    {filteredStudents.map((s, idx) => (
                      <tr key={idx} className="hover:bg-surface-container-lowest dark:hover:bg-white/[0.02]">
                        <td className="p-3.5">
                          <span className="font-bold text-on-surface dark:text-white block">{s.name}</span>
                          <span className="text-[10px] text-outline-variant">{s.collegeId}</span>
                        </td>
                        <td className="p-3.5 font-bold text-primary dark:text-cyan-300">{s.rollNumber}</td>
                        <td className="p-3.5 text-on-surface-variant dark:text-white/80">
                          {s.branch} · {s.section}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                              s.engagementTag === 'regular'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : s.engagementTag === 'moderate'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            }`}
                          >
                            <span>{s.engagementLabel}</span>
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-on-surface dark:text-white">{s.daysActive} days</td>
                        <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                          {s.problemsSolved} Solved
                        </td>
                        <td className="p-3.5 text-on-surface-variant dark:text-white/70">{s.hoursSpent} hrs</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= TAB 4: QUESTIONS & TOPIC BANK ================= */}
          {activeTab === 'questions' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/20 dark:border-white/10">
                <div>
                  <h3 className="font-headline-sm text-base font-bold text-on-surface dark:text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    <span>Curriculum Question &amp; Topic Bank</span>
                  </h3>
                  <p className="font-body-sm text-xs text-on-surface-variant dark:text-white/60">
                    Add new custom DSA problems and topic nodes for college exams &amp; contest challenges.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddingQuestion(!isAddingQuestion)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-label-md text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAddingQuestion ? 'Close Form' : 'Add New Question'}</span>
                </button>
              </div>

              {/* Add Question Form */}
              {isAddingQuestion && (
                <form
                  onSubmit={handleAddQuestion}
                  className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-[#10182f] border border-purple-500/40 space-y-4 animate-in fade-in"
                >
                  <h4 className="font-label-lg text-sm font-bold text-purple-600 dark:text-purple-300">
                    Add Question to Bank
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-on-surface-variant dark:text-white/70">
                        Problem Title
                      </label>
                      <input
                        type="text"
                        value={newQTitle}
                        onChange={(e) => setNewQTitle(e.target.value)}
                        placeholder="e.g. Invert Binary Tree Invariant"
                        className="w-full px-3 py-2 rounded-xl bg-surface-container dark:bg-black/30 border border-outline-variant/30 dark:border-white/10 text-xs font-mono text-on-surface dark:text-white outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-on-surface-variant dark:text-white/70">
                        Topic Name
                      </label>
                      <input
                        type="text"
                        value={newQTopic}
                        onChange={(e) => setNewQTopic(e.target.value)}
                        placeholder="e.g. Dynamic Programming, Trees, Graphs"
                        className="w-full px-3 py-2 rounded-xl bg-surface-container dark:bg-black/30 border border-outline-variant/30 dark:border-white/10 text-xs font-mono text-on-surface dark:text-white outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-on-surface-variant dark:text-white/70">
                          Difficulty
                        </label>
                        <select
                          value={newQDifficulty}
                          onChange={(e) => setNewQDifficulty(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-surface-container dark:bg-[#131d33] border border-outline-variant/30 dark:border-white/10 text-xs text-on-surface dark:text-white outline-none"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-on-surface-variant dark:text-white/70">
                          Points
                        </label>
                        <input
                          type="number"
                          value={newQPoints}
                          onChange={(e) => setNewQPoints(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-surface-container dark:bg-black/30 border border-outline-variant/30 dark:border-white/10 text-xs font-mono text-on-surface dark:text-white outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-on-surface-variant dark:text-white/70">
                      Problem Statement
                    </label>
                    <textarea
                      value={newQStatement}
                      onChange={(e) => setNewQStatement(e.target.value)}
                      placeholder="Enter formal problem description, inputs, and expected output behavior..."
                      rows={3}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container dark:bg-black/30 border border-outline-variant/30 dark:border-white/10 text-xs font-mono text-on-surface dark:text-white outline-none resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-label-md text-xs font-bold transition-all cursor-pointer"
                  >
                    Save Question to Repository
                  </button>
                </form>
              )}

              {/* Questions List Table */}
              <div className="overflow-x-auto rounded-2xl border border-outline-variant/20 dark:border-white/10">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-surface-container-low dark:bg-white/5 text-on-surface-variant dark:text-white/60 text-[11px] uppercase tracking-wider border-b border-outline-variant/20 dark:border-white/10">
                    <tr>
                      <th className="p-3.5">Title</th>
                      <th className="p-3.5">Topic</th>
                      <th className="p-3.5">Difficulty</th>
                      <th className="p-3.5">Points</th>
                      <th className="p-3.5">Author</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10 dark:divide-white/5">
                    {questions.map((q) => (
                      <tr key={q.id} className="hover:bg-surface-container-lowest dark:hover:bg-white/[0.02]">
                        <td className="p-3.5 font-bold text-on-surface dark:text-white">{q.title}</td>
                        <td className="p-3.5 text-primary dark:text-cyan-300 font-semibold">{q.topic}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              q.difficulty === 'Easy'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : q.difficulty === 'Medium'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {q.difficulty}
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-on-surface dark:text-white">{q.points} Pts</td>
                        <td className="p-3.5 text-on-surface-variant dark:text-white/70">{q.addedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
