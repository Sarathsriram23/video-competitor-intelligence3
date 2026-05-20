"use client";

import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import { 
  Sparkles, 
  Download, 
  RotateCcw, 
  CheckCircle, 
  Sliders, 
  TrendingUp, 
  Youtube, 
  Key, 
  AlertCircle, 
  Zap, 
  Users, 
  FileVideo, 
  Target, 
  ArrowRight,
  TrendingDown,
  Calendar,
  MessageSquare,
  Award
} from 'lucide-react';
import { ComparativeReport, CompetitorAnalysis } from '../types/report';
import { VideoGrid } from '../components/VideoGrid';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Home() {
  // Navigation / Loading / Data States
  const [mounted, setMounted] = useState(false);
  const [report, setReport] = useState<ComparativeReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // API Key Override (Evaluator direct injection)
  const [apiKeyOverride, setApiKeyOverride] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);

  // Form Inputs
  const [companyName, setCompanyName] = useState('');
  const [competitors, setCompetitors] = useState(['', '', '', '']);

  // Dynamic Loader text steps
  const loadingSteps = [
    "Locating official YouTube handles and checking channel credentials...",
    "Querying subscriber benchmarks and aggregating lifetime stats...",
    "Retrieving recent video streams and analyzing upload cadence...",
    "Executing local stop-word keyword NLP to extract primary themes...",
    "Detecting video formats and comparing engagement interaction metrics...",
    "Synthesizing competitor gaps and compiling editable client PowerPoint..."
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Multi-stage loader timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setLoadingStage(0);
      interval = setInterval(() => {
        setLoadingStage((prev) => {
          if (prev < loadingSteps.length - 1) return prev + 1;
          return prev;
        });
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleCompetitorChange = (index: number, value: string) => {
    const updated = [...competitors];
    updated[index] = value;
    setCompetitors(updated);
  };

  // Pre-fill fields and run Demo instantly
  const handleLoadDemo = async () => {
    setCompanyName("HubSpot");
    const demoComps = ["Salesforce", "monday.com", "Zoho", "Freshworks"];
    setCompetitors(demoComps);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/report/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: "HubSpot",
          competitors: demoComps,
          demo: true
        })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setReport(data.report);
      } else {
        setError(data.message || 'Failed to load demo report.');
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to the backend server. Make sure the backend server is running on port 5000!');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    setError(null);
    setLoading(true);

    const activeCompetitors = competitors.filter(c => c && c.trim() !== '');

    try {
      const response = await fetch(`${API_URL}/api/report/generate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': apiKeyOverride ? `Bearer ${apiKeyOverride}` : '' 
        },
        body: JSON.stringify({
          companyName: companyName.trim(),
          competitors: activeCompetitors,
          demo: apiKeyOverride ? false : undefined // will fall back to server default (demo if no key, live if key is in server config)
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        setReport(data.report);
      } else {
        setError(data.message || 'Failed to generate intelligence report. Try another search or use demo mode.');
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to backend server. Confirm port 5000 is listening and running!');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPPT = async () => {
    if (!report) return;

    try {
      const response = await fetch(`${API_URL}/api/report/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report })
      });

      if (!response.ok) throw new Error('PPT download failed.');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const safeName = report.mainCompany.toLowerCase().replace(/[^a-z0-9]/g, '_');
      link.setAttribute('download', `${safeName}_video_intelligence_report.pptx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Failed to compile PowerPoint deck. Please review connection or backend terminal console.');
    }
  };

  const handleReset = () => {
    setReport(null);
    setCompanyName('');
    setCompetitors(['', '', '', '']);
    setError(null);
  };

  if (!mounted) return null;

  return (
    <div className="flex-1 flex flex-col w-full">
      {/* Header Navigation */}
      <nav className="border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center bg-[#020617]/50 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white border border-indigo-400/20">
            <Youtube className="w-6 h-6" />
          </div>
          <div>
            <span className="font-semibold text-lg tracking-wide text-glow text-white">VIDEO AUDIT PRO</span>
            <span className="text-xs block text-slate-400 -mt-1 font-mono">Competitor Strategy Suite</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="flex items-center gap-2 text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-white/10 px-3 py-1.5 rounded-lg transition-colors font-mono"
          >
            <Key className="w-3.5 h-3.5" />
            {apiKeyOverride ? "API Key Loaded" : "Set API Key"}
          </button>
        </div>
      </nav>

      {/* Floating Key override accordion */}
      {showKeyInput && (
        <div className="max-w-md mx-auto w-full px-6 mt-4 z-40 relative">
          <div className="glass-panel p-4 rounded-xl border border-white/10 shadow-2xl">
            <div className="flex items-start gap-2.5 mb-2">
              <AlertCircle className="w-4 h-4 text-indigo-400 mt-0.5" />
              <p className="text-xs text-slate-300">
                <strong>Live API Mode:</strong> Enter a YouTube Data API v3 key below. If left blank, the app runs in customizable **SaaS Demo Mode** (pre-populated with realistic models).
              </p>
            </div>
            <input 
              type="text"
              placeholder="AIzaSy..."
              value={apiKeyOverride}
              onChange={(e) => setApiKeyOverride(e.target.value)}
              className="w-full bg-[#020617] border border-white/10 text-xs rounded-lg px-3 py-2 text-indigo-300 font-mono focus:outline-none focus:border-indigo-500"
            />
            <div className="flex justify-end mt-2">
              <button 
                onClick={() => setShowKeyInput(false)}
                className="text-[10px] bg-indigo-600 hover:bg-indigo-500 px-2.5 py-1 text-white rounded font-semibold"
              >
                Apply & Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN BODY CONTAINER */}
      <main className="flex-1 flex flex-col items-center justify-start p-6 md:p-12 max-w-7xl mx-auto w-full">
        
        {/* ========================================================
            1. LANDING SETUP / FORM VIEW (No Report Loaded & Not Loading)
            ======================================================== */}
        {!report && !loading && (
          <div className="w-full max-w-4xl flex flex-col items-center py-10 md:py-16">
            
            {/* Title / Hero */}
            <div className="text-center mb-10 md:mb-14">
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 border border-indigo-400/20 px-3 py-1 rounded-full text-xs font-semibold mb-4 tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" /> Industry-Leading Content Intelligence
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4">
                Video <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent">Competitor Intelligence</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
                Analyze subscriber scale, upload consistency, content topics, and formatting gaps across competitors. Instantly generate professional, downloadable client-ready PowerPoint decks.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="w-full max-w-2xl bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3.5 rounded-xl flex items-start gap-3 mb-8">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {/* Config & Audit Box */}
            <div className="w-full max-w-2xl glass-panel p-6 md:p-8 rounded-2xl border border-white/5 shadow-2xl relative">
              
              {/* Highlight background glow */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

              <form onSubmit={handleGenerateReport} className="space-y-6 relative z-10">
                
                {/* Field 1: Primary Company */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Your Company <span className="text-indigo-400">*</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="text"
                      required
                      placeholder="e.g. HubSpot"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-[#020617]/80 border border-white/10 hover:border-indigo-500/50 focus:border-indigo-600 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none transition-all shadow-inner"
                    />
                    <div className="absolute right-3.5 top-3 text-[10px] text-slate-400 font-mono border border-white/10 px-2 py-1 rounded">Primary</div>
                  </div>
                </div>

                {/* Fields 2: Competitors */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-slate-200">
                      Competitor YouTube Channels
                    </label>
                    <span className="text-xs text-slate-400 font-light">Up to 4 competitors</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {competitors.map((comp, idx) => (
                      <div key={idx} className="relative">
                        <input 
                          type="text"
                          placeholder={`Competitor ${idx + 1} (e.g. ${idx===0 ? 'Salesforce' : idx===1 ? 'monday.com' : idx===2 ? 'Zoho' : 'Freshworks'})`}
                          value={comp}
                          onChange={(e) => handleCompetitorChange(idx, e.target.value)}
                          className="w-full bg-[#020617]/50 border border-white/5 hover:border-purple-500/30 focus:border-purple-600 text-slate-200 placeholder-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submissions buttons */}
                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  {/* Real-time search button */}
                  <button
                    type="submit"
                    disabled={!companyName.trim()}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl px-5 py-3.5 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <Zap className="w-4 h-4 text-indigo-300" />
                    <span>Run Competitive Audit</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  {/* Demo load trigger */}
                  <button
                    type="button"
                    onClick={handleLoadDemo}
                    className="bg-slate-800/80 hover:bg-slate-700/80 text-indigo-300 hover:text-indigo-200 border border-indigo-500/20 rounded-xl px-5 py-3.5 transition-all flex items-center justify-center gap-2 font-medium"
                  >
                    <Sliders className="w-4 h-4" />
                    <span>Load Demo Mode</span>
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            2. MULTI-STAGE ANIMATED LOADING VIEW
            ======================================================== */}
        {loading && (
          <div className="w-full max-w-xl flex flex-col items-center justify-center py-20 px-6">
            
            {/* Pulsing visual core */}
            <div className="w-24 h-24 relative mb-10 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500/25 animate-ping" />
              <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-purple-500 animate-spin" />
              <div className="w-14 h-14 rounded-full bg-[#020617] border border-white/10 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
            </div>

            {/* Status display panel */}
            <div className="w-full glass-panel border border-white/5 rounded-2xl p-6 text-center space-y-4">
              <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider font-mono">
                STAGE {loadingStage + 1} OF 6 IN PROGRESS
              </div>
              <h3 className="text-lg font-bold text-white transition-all duration-300">
                {loadingSteps[loadingStage]}
              </h3>
              
              {/* Progress bar */}
              <div className="w-full bg-[#020617] h-2 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500 ease-out" 
                  style={{ width: `${((loadingStage + 1) / loadingSteps.length) * 100}%` }}
                />
              </div>

              <p className="text-xs text-slate-500 italic">
                {loadingStage < 3 ? "Retrieving from YouTube API indexes..." : "Adapting marketing strategies and ranking engines..."}
              </p>
            </div>
          </div>
        )}

        {/* ========================================================
            3. DYNAMIC SAAS REPORT DASHBOARD VIEW
            ======================================================== */}
        {report && !loading && (
          <div className="w-full flex flex-col space-y-8 py-4 animate-fade-in">
            
            {/* Dashboard Sub-Header / Tool Bar */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-gradient-to-r from-white via-blue-50 to-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden shadow-sm">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100/30 rounded-full blur-3xl" />
              
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                    Competitor Audit: {report.mainCompany}
                  </h2>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full ${report.id.includes('demo') ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 'bg-blue-100 text-blue-800 border border-blue-200'}`}>
                    {report.id.includes('demo') ? 'Demo Data Mode' : 'Live YouTube API'}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-2 font-light">
                  Benchmarked against {report.companies.filter(c => c !== report.mainCompany).join(', ')} • Generated {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handleDownloadPPT}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl px-4 py-2.5 flex items-center gap-2 border border-indigo-400/25 transition-all shadow-lg text-glow"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Client PPTX</span>
                </button>

                <button
                  onClick={handleReset}
                  className="bg-slate-800/80 hover:bg-slate-700/80 border border-white/5 text-slate-300 font-semibold text-sm rounded-xl px-4 py-2.5 flex items-center gap-2 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>New Audit</span>
                </button>
              </div>
            </div>

            {/* SECTION 1: EXEC SUMMARY & LEADERBOARD GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Card A: Narrative Situation */}
              <div className="lg:col-span-2 glass-card p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-indigo-400 mb-3">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider font-mono">Executive Summary</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    Video Marketing Situational Narrative
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-light">
                    {report.executiveSummary.narrative}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-4 mt-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono block">Benchmarked Leader</span>
                    <span className="text-sm font-bold text-white truncate block">{report.executiveSummary.leader}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono block">Growth Area</span>
                    <span className="text-sm font-bold text-emerald-400 truncate block">{report.executiveSummary.biggestOpportunity}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono block">Core Weakness</span>
                    <span className="text-sm font-bold text-red-400 truncate block">{report.executiveSummary.weakestArea}</span>
                  </div>
                </div>
              </div>

              {/* Card B: Leaderboard ratings */}
              <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-purple-400 mb-3">
                    <Award className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider font-mono">Benchmark Rankings</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    Leaderboard Scorecard
                  </h3>

                  <div className="space-y-4">
                    {report.leaderboard.map((item) => (
                      <div key={item.companyName} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-300">
                            #{item.rank} {item.companyName} {item.isMainCompany && "(You)"}
                          </span>
                          <span className="font-bold text-indigo-300">{item.score}/100</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${item.isMainCompany ? 'from-indigo-500 to-indigo-400' : 'from-purple-600 to-purple-400'}`}
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 font-mono mt-4 pt-3 border-t border-white/5">
                  Weights: Eng (30%) | Consistency (20%) | Views (20%) | Reach (15%) | Formats (15%)
                </div>
              </div>

            </div>

            {/* SECTION 2: AUDIENCE & CADENCE BENCHMARK CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Subscriber Bar Chart */}
              <div className="glass-panel p-6 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 text-indigo-400 mb-4">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider font-mono">Audience reach</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-4">YouTube Subscriber Count</h3>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={report.analysis}
                      margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="companyName" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis 
                        stroke="#94a3b8" 
                        fontSize={11} 
                        tickLine={false}
                        tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} 
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', border: '2px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                        labelStyle={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}
                        formatter={(value: any) => [parseInt(value).toLocaleString(), 'Subscribers']}
                        contentItemStyle={{ color: '#374151', fontSize: '12px', fontWeight: '500' }}
                      />
                      <Bar dataKey="channelInfo.statistics.subscriberCount" radius={[6, 6, 0, 0]}>
                        {report.analysis.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.isMainCompany ? '#6366f1' : '#a855f7'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Upload Cadence & Consistency */}
              <div className="glass-panel p-6 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 text-purple-400 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider font-mono">cadence auditing</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-4">Consistency Index vs. Volume</h3>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={report.analysis}
                      margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
                      <XAxis dataKey="companyName" stroke="#9ca3af" fontSize={11} tickLine={false} />
                      <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', border: '2px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        labelStyle={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}
                        formatter={(value: any, name: any, props: any) => {
                          if (name === 'metrics.uploadConsistencyScore') {
                            return [`${value}/100`, 'Consistency Index'];
                          }
                          return [`${value} videos/mo`, 'Upload Volume'];
                        }}
                        contentItemStyle={{ color: '#374151', fontSize: '12px', fontWeight: '500' }}
                      />
                      <Bar dataKey="metrics.uploadConsistencyScore" name="Consistency Rating" fill="#a855f7" radius={[6, 6, 0, 0]} barSize={25} />
                      <Bar dataKey="metrics.videosPerMonth" name="Videos Per Month" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={25} />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* SECTION 3: AUDIENCE ENGAGEMENT ANALYSIS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Engagement Rate Column Chart */}
              <div className="lg:col-span-1 glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-indigo-400 mb-3">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider font-mono">audience reaction</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Average Engagement Rate</h3>
                  <p className="text-xs text-slate-400 mb-4 font-light">
                    Measures Likes + Comments divided by Views across recent videos.
                  </p>

                  <div className="h-48 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={report.analysis}>
                        <XAxis dataKey="companyName" stroke="#9ca3af" fontSize={9} tickLine={false} />
                        <YAxis stroke="#9ca3af" fontSize={9} tickLine={false} tickFormatter={(v) => `${v}%`} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#ffffff', border: '2px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                          labelStyle={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}
                          formatter={(v: any) => [`${parseFloat(v).toFixed(2)}%`, 'Engagement']}
                          contentItemStyle={{ color: '#374151', fontSize: '12px', fontWeight: '500' }}
                        />
                        <Bar dataKey="metrics.engagementRate" fill="#6366f1" radius={[4, 4, 0, 0]}>
                          {report.analysis.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.isMainCompany ? '#6366f1' : '#a855f7'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 font-mono border-t border-white/5 pt-3 mt-4">
                  Normal industry standard for B2B tech channels averages 1.5% to 3.0%.
                </div>
              </div>

              {/* Table of Top Performing Videos */}
              <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-indigo-400 mb-4">
                    <FileVideo className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider font-mono">Performance anchors</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-4">Highest Performing Video for Each Competitor</h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-400">
                          <th className="py-2.5 font-bold">Brand</th>
                          <th className="py-2.5 font-bold">Video Title</th>
                          <th className="py-2.5 font-bold text-right">Views</th>
                          <th className="py-2.5 font-bold text-right">Engagement</th>
                          <th className="py-2.5 font-bold text-center">Format</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {report.analysis.map((a) => {
                          const topVideo = [...a.videos].sort((x, y) => y.viewCount - x.viewCount)[0] || { title: 'N/A', viewCount: 0, engagementRate: 0, category: 'N/A' };
                          return (
                            <tr key={a.companyName} className={`hover:bg-white/5 transition-colors ${a.isMainCompany ? 'bg-indigo-500/5' : ''}`}>
                              <td className="py-3 font-semibold text-white">
                                {a.companyName} {a.isMainCompany && "(You)"}
                              </td>
                              <td className="py-3 max-w-xs truncate pr-4 text-slate-300 font-light" title={topVideo.title}>
                                {topVideo.title}
                              </td>
                              <td className="py-3 text-right font-semibold text-slate-200">
                                {topVideo.viewCount.toLocaleString()}
                              </td>
                              <td className="py-3 text-right text-indigo-300 font-mono">
                                {topVideo.engagementRate.toFixed(2)}%
                              </td>
                              <td className="py-3 text-center">
                                <span className="bg-slate-800 text-[10px] px-2 py-0.5 rounded font-mono text-slate-400">
                                  {topVideo.category}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 italic mt-4 pt-3 border-t border-white/5">
                  Reflects the highest views accumulated on a single video within recent uploads playlist.
                </div>
              </div>

            </div>

            {/* SECTION 4: CONTENT TOPICS & GAP ANALYSIS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Primary Content Themes Grid */}
              <div className="lg:col-span-1 glass-card p-6 rounded-2xl">
                <div className="flex items-center gap-2 text-indigo-400 mb-3">
                  <Target className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider font-mono">brand semantic positioning</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-4">Extracted Content Themes</h3>

                <div className="space-y-4">
                  {report.analysis.map((a) => (
                    <div key={a.companyName} className="space-y-1.5">
                      <span className="text-xs font-bold text-slate-400">
                        {a.companyName} {a.isMainCompany && "(You)"}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {a.metrics.topTopics.map((topic) => (
                          <span 
                            key={topic}
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${a.isMainCompany ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' : 'bg-purple-500/10 text-purple-300 border border-purple-500/20'}`}
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competitor Gap Analysis & Blind spots */}
              <div className="lg:col-span-2 glass-card p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 mb-4">
                    <Zap className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider font-mono">market white-space</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Competitor Strategy Blind Spots</h3>
                  <p className="text-xs text-slate-400 mb-5 font-light">
                    We compared topics and formats and identified content sectors that competitors target heavily but your brand lacks.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Untapped Topics */}
                    <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 space-y-3">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 font-mono block">Untapped Keywords</span>
                      <p className="text-[11px] text-slate-400">Competitors cover these themes, but they are missing from your recent titles:</p>
                      
                      <div className="space-y-2">
                        {report.gapAnalysis.untappedTopics.map((topic) => (
                          <div key={topic} className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1.5 rounded-lg">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="text-xs font-bold text-emerald-300">Target query sector: "{topic}"</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Underutilized Formats */}
                    <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 space-y-3">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 font-mono block">Underutilized Formats</span>
                      <p className="text-[11px] text-slate-400">Formats utilized in the wider market but underrepresented (&lt;5% share) on your channel:</p>
                      
                      <div className="space-y-2">
                        {report.gapAnalysis.underutilizedFormats.map((fmt) => (
                          <div key={fmt} className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/25 px-2.5 py-1.5 rounded-lg">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            <span className="text-xs font-bold text-purple-300">Expand format category: {fmt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 italic mt-6 pt-3 border-t border-white/5">
                  Gap analysis is generated algorithmically through cross-channel format distributions and title keyword matrices.
                </div>
              </div>

            </div>

            {/* SECTION 5: ACTIONABLE TACTICAL RECOMMENDATIONS */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-400">
                <Target className="w-4.5 h-4.5" />
                <span className="text-xs font-bold uppercase tracking-wider font-mono">strategic execution guidelines</span>
              </div>
              <h3 className="text-xl font-bold text-white">Dynamic Recommendations & Critical Tasks</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {report.gapAnalysis.recommendations.map((rec, idx) => {
                  const isHigh = rec.impact === 'High';
                  return (
                    <div key={idx} className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-sm font-bold text-white tracking-wide">
                            {rec.title}
                          </h4>
                          <span className={`text-[9px] uppercase font-bold font-mono px-2 py-0.5 rounded shrink-0 ${isHigh ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'}`}>
                            {rec.impact} Impact
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-light leading-relaxed">
                          {rec.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 6: CONTENT SHOWCASE - VIDEOS GRID */}
            <div className="w-full space-y-4">
              <div className="flex items-center gap-2 text-indigo-400">
                <FileVideo className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider font-mono">Featured YouTube Content</span>
              </div>
              <div className="glass-panel p-8 rounded-2xl border border-white/5">
                <VideoGrid analysis={report.analysis} />
              </div>
            </div>

            {/* SECTION 7: ROADMAP & 90-DAY KEY STEPS */}
            <div className="space-y-4 bg-slate-950/40 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center gap-2 text-indigo-400 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider font-mono">Execution Roadmap</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-6">90-Day Video Strategy Timeline</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {/* Stage 1 */}
                <div className="glass-card p-5 rounded-xl border border-white/5 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono bg-indigo-600/30 text-indigo-300 px-2 py-0.5 rounded">01 - 30 DAYS</span>
                    <span className="text-xs font-bold text-white">Foundation & metadata Gaps</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-2 font-light list-disc pl-4">
                    <li>Initialize comprehensive keyword metadata optimization on your channel's existing catalog.</li>
                    <li>Record and script the first 5 high-impact YouTube Shorts based on highest-performing webinars.</li>
                    <li>Launch keyword tag A/B testing on video description conversion links.</li>
                  </ul>
                </div>

                {/* Stage 2 */}
                <div className="glass-card p-5 rounded-xl border border-white/5 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono bg-indigo-600/30 text-indigo-300 px-2 py-0.5 rounded">31 - 60 DAYS</span>
                    <span className="text-xs font-bold text-white">Consistency & Volume Scale</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-2 font-light list-disc pl-4">
                    <li>Deploy a recurring publishing schedule (e.g. weekly Tuesday uploads).</li>
                    <li>Begin targeted content series addressing the untapped topics identified in this competitor intelligence.</li>
                    <li>Integrate interactive community poll posts to boost organic algorithmic recommendation loops.</li>
                  </ul>
                </div>

                {/* Stage 3 */}
                <div className="glass-card p-5 rounded-xl border border-white/5 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono bg-indigo-600/30 text-indigo-300 px-2 py-0.5 rounded">61 - 90 DAYS</span>
                    <span className="text-xs font-bold text-white">Conversion & Lead redirection</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-2 font-light list-disc pl-4">
                    <li>Analyze month-one Shorts CTR and lead attribution ratios.</li>
                    <li>Run second-phase competitive audits against minor niche creators.</li>
                    <li>Expand backlink hooks to redirect organic audience views to lead-generating landing pages.</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 px-6 mt-12 bg-slate-950/20 text-center">
        <span className="text-xs text-slate-500 font-mono">
          Competitor Strategy & Content Audit Suite © 2026. Made with TailwindCSS & Recharts.
        </span>
      </footer>
    </div>
  );
}
