"use client";

import React, { useState } from "react";
import LoginForm from "@/components/LoginForm";
import { Sparkles, LogOut, Award, BookOpen } from "lucide-react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
    setIsAuthenticated(true);
  };

  // IF NOT SIGNED IN -> SHOW LOGIN FORM
  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  // IF SIGNED IN -> SHOW MAIN WEB APPLICATION
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* App Navbar */}
      <header className="h-16 border-b border-slate-800 px-8 flex items-center justify-between bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <h1 className="text-base font-extrabold tracking-wider">VERAXION KNOWLEDGEHUB</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-xs font-black">{userEmail.split("@")[0].toUpperCase()}</p>
            <p className="text-[10px] text-cyan-400">{userEmail}</p>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-all cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Web App Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-black">Welcome to Veraxion KnowledgeHub!</h2>
          <p className="text-xs text-slate-400 mt-1">
            You are signed in as <span className="text-cyan-400 font-bold">{userEmail}</span>.
          </p>
        </div>

        {/* Dashboard Grid Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            <h3 className="font-bold text-sm">Assigned Courses</h3>
            <p className="text-xs text-slate-400">Access mandatory corporate compliance and training modules.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
            <Award className="w-6 h-6 text-emerald-400" />
            <h3 className="font-bold text-sm">Certifications</h3>
            <p className="text-xs text-slate-400">View and download completed course certificates.</p>
          </div>
        </div>
      </main>
    </div>
  );
}