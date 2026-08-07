"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  BookOpen,
  FileCheck,
  Award,
  Clock,
  CheckCircle2,
  Sparkles,
  X,
  Sun,
  Moon,
  ExternalLink,
  ChevronDown,
  History,
  ClipboardList,
  Share2,
  Plus,
  ShieldCheck,
  Download,
  Users,
  Check,
  LogOut,
  TrendingUp,
  GraduationCap,
  Bell,
  Tag,
  AlertCircle,
  Send,
  FileText,
  DollarSign,
  Briefcase,
  BarChart3,
  Mail,
  Upload,
  Lock,
  ArrowRight,
  ArrowLeft,
  Building2,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";

// --- TYPES & INTERFACES ---
type Role = "Manager" | "Resource" | "HR Executive";

interface SystemUser {
  id: string;
  name: string;
  role: Role;
  email: string;
  department: string;
}

interface Course {
  id: string;
  title: string;
  category: "Internship" | "Compliance" | "Skill Enhancement";
  pricingType: "Paid" | "Unpaid / Free";
  costAmount?: string;
  dueDate: string;
  isOverdue?: boolean;
  progress: number;
  status: "Not Started" | "In Progress" | "Completed";
  description: string;
  instructor: string;
  duration: string;
  platform: string;
  externalUrl?: string;
  certificateAvailable: boolean;
}

interface HubItem {
  id: string;
  title: string;
  author: string;
  type: "Video" | "Document" | "Presentation";
  url: string;
  fileSize?: string;
  likes: number;
  tags: string[];
  date: string;
}

interface ApprovalRequest {
  id: string;
  employeeName: string;
  courseTitle: string;
  type: string;
  submittedDate: string;
  status: "Approved" | "Pending Manager Approval" | "Under Review" | "Rejected";
  approver: string;
  cost: string;
  justification: string;
  estimatedHours: string;
  platform: string;
  externalUrl?: string;
}

interface ResourceProgress {
  id: string;
  name: string;
  email: string;
  department: string;
  isIntern: boolean;
  coursesAssigned: number;
  coursesCompleted: number;
  inProgressCourses: number;
  overdueCourses: number;
  totalLearnedHours: number;
  lastActive: string;
}

interface SystemNotification {
  id: string;
  type: "Overdue Alert" | "Course Assigned" | "Approval Update" | "Announcement";
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  emailSent: boolean;
}

export default function VeraxionApp() {
  // --- AUTHENTICATION STATES ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginStep, setLoginStep] = useState<"email" | "password" | "authenticating">("email");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Active Signed-in User State
  const [currentUser, setCurrentUser] = useState<SystemUser>({
    id: "u-veraxion",
    name: "User",
    role: "HR Executive",
    email: "",
    department: "Veraxion Corporate",
  });

  // --- LMS APP STATES ---
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentScreen, setCurrentScreen] = useState<
    "dashboard" | "profile" | "history" | "approvals" | "hub" | "manager_approvals" | "hr_dashboard"
  >("dashboard");

  const [categoryFilter, setCategoryFilter] = useState<"All" | "Internship" | "Compliance" | "Skill Enhancement">("All");
  const [activeStatFilter, setActiveStatFilter] = useState<"All" | "In Progress" | "Completed" | "Overdue">("All");
  const [isHomeDropdownOpen, setIsHomeDropdownOpen] = useState(false);
  const homeDropdownRef = useRef<HTMLDivElement>(null);

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState<SystemNotification[]>([
    {
      id: "notif-1",
      type: "Overdue Alert",
      title: "Missed Due Date: Compliance Training",
      message: "An automated email notification has been sent regarding overdue compliance courses.",
      date: "Today at 09:00 AM",
      isRead: false,
      emailSent: true,
    },
    {
      id: "notif-2",
      type: "Announcement",
      title: "New Internship Track 2026 Launched",
      message: "All interns must complete the mandatory 'Full-Stack Software Internship Track'.",
      date: "Yesterday",
      isRead: true,
      emailSent: true,
    },
  ]);

  const [certificateModalData, setCertificateModalData] = useState<{
    courseTitle: string;
    issueDate: string;
    recipientName: string;
  } | null>(null);

  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>([
    {
      id: "REQ-2026-104",
      employeeName: "Jake (Intern)",
      courseTitle: "Coursera: Machine Learning Specialization",
      type: "External Paid Course",
      submittedDate: "July 24, 2026",
      status: "Pending Manager Approval",
      approver: "Joseph (Manager)",
      cost: "$49 / month",
      justification: "Deep learning model optimizations required for internship project deliverables.",
      estimatedHours: "40 Hours",
      platform: "Coursera",
    },
  ]);

  const [hubItems, setHubItems] = useState<HubItem[]>([
    {
      id: "item-1",
      title: "Microservices Architecture & System Design Demos",
      author: "Alex Vance",
      type: "Video",
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      likes: 42,
      tags: ["Microservices", "Architecture"],
      date: "July 12, 2026",
    },
    {
      id: "item-2",
      title: "Veraxion Internship Guidelines & Milestone Playbook 2026",
      author: "Sarah Jenkins (HR)",
      type: "Document",
      url: "#",
      fileSize: "2.4 MB (PDF)",
      likes: 115,
      tags: ["Internship", "Policy", "Documentation"],
      date: "August 01, 2026",
    },
  ]);

  const [courses] = useState<Course[]>([
    {
      id: "c-intern-1",
      title: "Veraxion Software Engineering Internship Onboarding & Capstone",
      category: "Internship",
      pricingType: "Unpaid / Free",
      dueDate: "Aug 30, 2026",
      progress: 70,
      status: "In Progress",
      platform: "Veraxion Hub",
      certificateAvailable: true,
      instructor: "Senior Engineering Mentors",
      duration: "40 Hours",
      description: "Official internship development track covering git workflows, code reviews, and API integrations.",
    },
    {
      id: "c1",
      title: "Veraxion Corporate Integrity, Ethics & Security 2026",
      category: "Compliance",
      pricingType: "Unpaid / Free",
      dueDate: "June 15, 2026",
      isOverdue: true,
      progress: 0,
      status: "Not Started",
      platform: "Veraxion",
      certificateAvailable: true,
      instructor: "Corporate HR & Legal",
      duration: "2.5 Hours",
      description: "Mandatory annual compliance training applicable to all Veraxion colleagues, interns, and managers.",
    },
    {
      id: "c-python-1",
      title: "Python 3 Masterclass: From Beginner to Advanced Data Science",
      category: "Skill Enhancement",
      pricingType: "Paid",
      costAmount: "$49.00 USD",
      dueDate: "Nov 30, 2026",
      progress: 100,
      status: "Completed",
      platform: "Coursera",
      certificateAvailable: true,
      instructor: "Jose Portilla",
      duration: "22 Hours",
      description: "Learn Python fundamentals, object-oriented programming, NumPy, Pandas, and automation scripts.",
    },
  ]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (homeDropdownRef.current && !homeDropdownRef.current.contains(event.target as Node)) {
        setIsHomeDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- LOGIN HANDLERS ---
  const handleEmailNext = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const trimmed = emailInput.trim().toLowerCase();
    if (!trimmed) {
      setLoginError("Please enter your Veraxion work email.");
      return;
    }

    if (!trimmed.endsWith("@veraxion.com")) {
      setLoginError("Please enter a valid @veraxion.com email address.");
      return;
    }

    setIsLoginLoading(true);
    setTimeout(() => {
      setIsLoginLoading(false);
      setLoginStep("password");
    }, 500);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!passwordInput) {
      setLoginError("Please enter your password.");
      return;
    }

    setIsLoginLoading(true);
    setLoginStep("authenticating");

    setTimeout(() => {
      setIsLoginLoading(false);

      const rawName = emailInput.split("@")[0].replace(/[._]/g, " ");
      const formattedName = rawName
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      setCurrentUser({
        id: `u-${Math.floor(Math.random() * 1000)}`,
        name: formattedName || "Veraxion Colleague",
        role: "HR Executive",
        email: emailInput.toLowerCase(),
        department: "Veraxion Engineering & Operations",
      });

      setIsAuthenticated(true);
    }, 1200);
  };

  // --- LMS APPLICATION INTERFACE ---
  const themeClasses = isDarkMode ? "bg-[#0f172a] text-slate-100" : "bg-slate-50 text-slate-900";
  const cardClasses = isDarkMode
    ? "bg-slate-900/80 border-slate-800 text-slate-100 shadow-lg"
    : "bg-white border-slate-200 text-slate-800 shadow-sm";
  const headerClasses = isDarkMode ? "bg-slate-900/90 border-slate-800" : "bg-white/90 border-slate-200 shadow-sm";

  // --- 1. SIGN IN SCREEN (MICROSOFT SSO) ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col justify-between relative overflow-hidden select-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <header className="p-6 flex items-center justify-between z-10 max-w-7xl w-full mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              {/* UPDATED HEADER TITLE */}
              <h1 className="text-sm font-black tracking-widest uppercase">VERAXION KNOWLEDGEHUB</h1>
              <p className="text-[10px] text-slate-400 font-bold tracking-wider">ENTERPRISE LEARNING PORTAL</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-full backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Microsoft Entra ID Protected</span>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4 z-10">
          <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-5">
              <div className="flex items-center space-x-2">
                <div className="grid grid-cols-2 gap-0.5 w-5 h-5 shrink-0">
                  <div className="bg-[#f25022] rounded-[1px]" />
                  <div className="bg-[#7fba00] rounded-[1px]" />
                  <div className="bg-[#00a4ef] rounded-[1px]" />
                  <div className="bg-[#ffb900] rounded-[1px]" />
                </div>
                <span className="text-sm font-bold text-slate-300 tracking-tight">Microsoft</span>
              </div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">SINGLE SIGN-ON</span>
            </div>

            {loginStep === "email" && (
              <form onSubmit={handleEmailNext} className="space-y-5 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <h2 className="text-xl font-black text-white">Sign in</h2>
                  <p className="text-xs text-slate-400">
                    Use your organizational Veraxion email address to access your training courses.
                  </p>
                </div>

                {loginError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">Work Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="username@veraxion.com"
                      autoFocus
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    />
                    <Building2 className="w-4 h-4 text-slate-600 absolute right-3.5 top-3.5" />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoginLoading}
                    className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-500/20 flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {loginStep === "password" && (
              <form onSubmit={handlePasswordSubmit} className="space-y-5 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginStep("email");
                      setLoginError("");
                    }}
                    className="flex items-center space-x-2 text-xs font-bold text-cyan-400 hover:underline"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[260px]">{emailInput}</span>
                  </button>
                  <h2 className="text-xl font-black text-white">Enter password</h2>
                </div>

                {loginError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Enter password"
                      autoFocus
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-10 py-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setLoginStep("email")}
                    className="px-4 py-2 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-bold rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-500/20 flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <span>Sign in</span>
                    <Lock className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {loginStep === "authenticating" && (
              <div className="py-8 text-center space-y-4 animate-in fade-in duration-200">
                <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto" />
                <div>
                  <h3 className="text-sm font-bold text-white">Verifying credentials</h3>
                  <p className="text-xs text-slate-400 mt-1">Connecting to Microsoft Entra SSO for {emailInput}...</p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center space-x-1">
                <KeyRound className="w-3 h-3 text-slate-600" />
                <span>Veraxion Federated Auth v4.2</span>
              </span>
            </div>
          </div>
        </main>

        <footer className="p-6 text-center text-xs text-slate-500 z-10">
          <p>© 2026 Veraxion Technologies Inc. All Rights Reserved.</p>
        </footer>
      </div>
    );
  }

  // --- 2. AUTHENTICATED APPLICATION DASHBOARD ---
  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-300 antialiased ${themeClasses}`}>
      {/* HEADER */}
      <header className={`h-16 border-b px-8 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md ${headerClasses}`}>
        <div className="flex items-center space-x-6">
          <div className="cursor-pointer flex items-center space-x-3 group" onClick={() => setCurrentScreen("dashboard")}>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            {/* UPDATED APP NAVBAR TITLE */}
            <h1 className="text-base font-extrabold tracking-wider">VERAXION KNOWLEDGEHUB</h1>
          </div>
        </div>

        {/* TOP RIGHT NAVIGATION */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-xl border transition-all ${
              isDarkMode
                ? "bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700"
                : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <nav className="flex items-center space-x-3 text-xs font-bold tracking-wider">
            <button
              onClick={() => setCurrentScreen("dashboard")}
              className={`py-1.5 px-3 rounded-xl border transition-all ${
                currentScreen === "dashboard"
                  ? "bg-cyan-500 text-white border-cyan-500"
                  : "border-slate-200 dark:border-slate-800 hover:text-cyan-500"
              }`}
            >
              HOME
            </button>
            <button
              onClick={() => setCurrentScreen("hr_dashboard")}
              className={`py-1.5 px-3 rounded-xl border transition-all ${
                currentScreen === "hr_dashboard"
                  ? "bg-purple-600 text-white border-purple-600"
                  : "border-purple-500/40 text-purple-500 hover:bg-purple-500/10"
              }`}
            >
              HR DASHBOARD
            </button>
            <button
              onClick={() => setCurrentScreen("hub")}
              className={`py-1.5 px-3 rounded-xl border transition-all ${
                currentScreen === "hub"
                  ? "bg-cyan-600 text-white border-cyan-600"
                  : "border-slate-200 dark:border-slate-800 hover:text-cyan-500"
              }`}
            >
              HUB & MATERIALS
            </button>
          </nav>

          <div className="flex items-center space-x-3 border-l pl-4 border-slate-300 dark:border-slate-800">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black leading-tight">{currentUser.name}</p>
              <p className="text-[10px] text-cyan-500 font-bold">{currentUser.email}</p>
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30 transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* APP MAIN CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-8 space-y-8">
        {currentScreen === "dashboard" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 border-slate-200 dark:border-slate-800">
              <div>
                {/* UPDATED PAGE WELCOME HEADING */}
                <h2 className="text-2xl font-black tracking-tight">Veraxion KnowledgeHub</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Welcome back, {currentUser.name}! — Internship Programs & Corporate Compliance
                </p>
              </div>
            </div>

            {/* COURSES LIST */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className={`rounded-3xl border p-6 flex flex-col justify-between ${cardClasses}`}>
                  <div className="space-y-4">
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full border bg-cyan-500/10 text-cyan-400 border-cyan-500/30 uppercase">
                      {course.category}
                    </span>
                    <h4 className="font-bold text-sm leading-snug">{course.title}</h4>
                    <p className="text-xs text-slate-400">{course.description}</p>
                  </div>
                  <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <span className="text-xs text-slate-400">{course.platform}</span>
                    <button
                      onClick={() => setCertificateModalData({ courseTitle: course.title, issueDate: "August 2026", recipientName: currentUser.name })}
                      className="px-3.5 py-1.5 bg-cyan-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentScreen === "hr_dashboard" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h2 className="text-2xl font-black">HR Executive Overview</h2>
            <div className={`p-6 rounded-3xl border ${cardClasses}`}>
              <p className="text-xs font-bold text-slate-400 uppercase">Total Active Employees & Interns</p>
              <h3 className="text-3xl font-black mt-2">24 Resources</h3>
            </div>
          </div>
        )}

        {currentScreen === "hub" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h2 className="text-2xl font-black">Veraxion Hub Materials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hubItems.map((item) => (
                <div key={item.id} className={`p-6 rounded-3xl border space-y-2 ${cardClasses}`}>
                  <h4 className="font-bold text-sm">{item.title}</h4>
                  <p className="text-xs text-slate-400">Type: {item.type} • Uploaded by {item.author}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* CERTIFICATE MODAL */}
      {certificateModalData && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-3xl p-6 border shadow-2xl space-y-4 text-center ${cardClasses}`}>
            <Award className="w-12 h-12 text-amber-500 mx-auto" />
            <h2 className="text-lg font-black">Certificate of Completion</h2>
            <p className="text-xs text-slate-400">Awarded to {certificateModalData.recipientName}</p>
            <p className="text-sm font-bold text-cyan-500">{certificateModalData.courseTitle}</p>
            <button
              onClick={() => setCertificateModalData(null)}
              className="px-4 py-2 bg-cyan-500 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}