'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { 
  Home, Database, Layers, Brain, Shield, Share2, Activity, Zap, 
  AlertTriangle, Cpu, Wifi, Cloud, Lock, TrendingUp, ChevronRight,
  Server, GitBranch, FileText, BarChart3, Radio, Link2, Sparkles,
  Network, Upload, Download, HardDrive, Gauge, Settings, Bot,
  CircuitBoard, Workflow, ShieldCheck, Globe, FileCode, BarChart,
  AlertCircle, CheckCircle, Clock, RefreshCw, Play, Pause, MapPin, Mail,
  CalendarDays, MessageSquare, ListTodo
} from 'lucide-react';

type View = 'dashboard' | 'pipelines' | 'ai-lab' | 'governance' | 'analytics';

interface LogEntry {
  id: number;
  icon: React.ComponentType<any>;
  message: string;
  time: string;
  severity?: 'info' | 'warning' | 'success' | 'error';
}

interface Pipeline {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'processing' | 'error';
  throughput: number;
  latency: number;
  documents: number;
  layer: 'bronze' | 'silver' | 'gold';
}

interface ForemanJob {
  id: number;
  title: string;
  start: string; // e.g. '07:30'
  end: string;   // e.g. '09:45'
  location: string;
  materials: string[];
  dependencies: string[]; // e.g. ['Flaggers','Civil Crew','Bucket Truck']
}

// Card Component - Updated
const Card = ({ children, variant = 'glass', glow = false, className = '' }: { children: React.ReactNode; variant?: 'glass' | 'gradient' | 'neon' | 'danger'; glow?: boolean; className?: string }) => {
  const baseClasses = "relative rounded-2xl p-6 transition-all duration-500 overflow-hidden";
  
  const variants = {
    glass: "bg-white/[0.02] backdrop-blur-xl border border-white/[0.05]",
    gradient: "bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-white/[0.08]",
    neon: "bg-black/40 backdrop-blur-xl border border-cyan-400/30 shadow-[0_0_20px_rgba(0,212,255,0.15)]",
    danger: "bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 border border-orange-500/30"
  };
  
  return (
    <div className={`${baseClasses} ${variants[variant]} ${glow ? 'shadow-[0_8px_32px_rgba(0,212,255,0.15)]' : ''} hover:shadow-[0_12px_48px_rgba(0,212,255,0.2)] hover:border-white/[0.1] hover:-translate-y-0.5 group ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      {children}
    </div>
  );
};

// ToggleSwitch Component
const ToggleSwitch = ({ label, initialChecked, onChange }: { label: string; initialChecked: boolean; onChange: (checked: boolean) => void }) => {
  const [isChecked, setIsChecked] = useState(initialChecked);
  
  const handleToggle = () => {
    const newState = !isChecked;
    setIsChecked(newState);
    onChange(newState);
  };
  
  return (
    <div className="flex items-center justify-between group">
      <span className="text-sm font-light text-gray-300 group-hover:text-white transition-colors duration-300">{label}</span>
      <button
        onClick={handleToggle}
        className={`relative w-14 h-7 rounded-full transition-all duration-500 ${
          isChecked 
            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_20px_rgba(0,212,255,0.4)]' 
            : 'bg-gray-700/50 hover:bg-gray-600/50'
        }`}
      >
        <span className={`absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-all duration-500 ${
          isChecked ? 'translate-x-7 shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'shadow-md'
        }`} />
        <span className={`absolute right-2 top-1.5 text-[9px] font-bold tracking-wider transition-opacity duration-300 ${
          isChecked ? 'opacity-100 text-white' : 'opacity-0'
        }`}>ON</span>
        <span className={`absolute left-2 top-1.5 text-[9px] font-bold tracking-wider transition-opacity duration-300 ${
          !isChecked ? 'opacity-100 text-gray-400' : 'opacity-0'
        }`}>OFF</span>
      </button>
    </div>
  );
};

const HomeView = ({ isAiActive, userName = 'Tony', logs = [] }: { isAiActive: boolean; userName?: string; logs?: LogEntry[] }) => {
  // Foreman Day Flow state
  const [tab, setTab] = useState<'calendar' | 'today'>('calendar');
  const today = useMemo(() => new Date(), []);
  const last30Days = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return d;
    });
  }, []);

  const jobsToday: ForemanJob[] = useMemo(() => [
    {
      id: 1,
      title: 'Pole Replacement • Sector 3',
      start: '07:30',
      end: '09:45',
      location: '45.5120, -122.6580',
      materials: ['Pole 45ft Composite', 'Crossarm Kit', 'Hardware Set A'],
      dependencies: ['Flaggers', 'Bucket Truck']
    },
    {
      id: 2,
      title: 'Transformer Swap • Oak Ridge',
      start: '10:15',
      end: '12:00',
      location: '45.5199, -122.6740',
      materials: ['25kVA Transformer', 'Grounding Kit', 'Lugs Set'],
      dependencies: ['Civil Crew']
    },
    {
      id: 3,
      title: 'Line Inspection • Substation 7',
      start: '13:00',
      end: '15:30',
      location: '45.5301, -122.6802',
      materials: ['Inspection Forms', 'Seal Tags'],
      dependencies: ['Drone', 'Thermal Camera']
    }
  ], []);

  // Helpers for ordering and progression
  const parseTimeToMinutes = (t: string) => {
    const [hh, mm] = t.split(':').map(Number);
    return (hh || 0) * 60 + (mm || 0);
  };
  const sortedJobsToday = useMemo(() => {
    return [...jobsToday].sort((a, b) => parseTimeToMinutes(a.start) - parseTimeToMinutes(b.start));
  }, [jobsToday]);
  const getNextJobId = (currentId: number): number | null => {
    const idx = sortedJobsToday.findIndex(j => j.id === currentId);
    if (idx === -1) return null;
    const next = sortedJobsToday[idx + 1];
    return next ? next.id : null;
  };

  // Derived/material staging
  const [staged, setStaged] = useState(false);
  const stagedMaterials = useMemo(() => {
    const set = new Set<string>();
    jobsToday.forEach(j => j.materials.forEach(m => set.add(m)));
    return Array.from(set);
  }, [jobsToday]);

  // Per-job actions
  const [pinSent, setPinSent] = useState<number[]>([]);
  const [timesheetStarted, setTimesheetStarted] = useState<number[]>([]);
  const [tailboardOpen, setTailboardOpen] = useState<number | null>(null);
  const [completedJobs, setCompletedJobs] = useState<number[]>([]);
  const [hazardNotes, setHazardNotes] = useState<Record<number, string>>({});
  const [packageOpen, setPackageOpen] = useState<number | null>(null);
  const [designChange, setDesignChange] = useState<Record<number, boolean>>({});
  const [jobDetailOpen, setJobDetailOpen] = useState<number | null>(null);
  const [jobPhotos, setJobPhotos] = useState<Record<number, number>>({});
  const [analyzing, setAnalyzing] = useState<Record<number, boolean>>({});
  const [analysisMsg, setAnalysisMsg] = useState<Record<number, string | null>>({});
  const [checklist, setChecklist] = useState<Record<number, { asBuilt: boolean; photos: boolean; siteClean: boolean; materialsReconciled: boolean }>>({});
  const [completeJobId, setCompleteJobId] = useState<number | null>(null);
  const currentJob = useMemo(() => {
    if (completeJobId == null) return null;
    return sortedJobsToday.find(j => j.id === completeJobId) || null;
  }, [sortedJobsToday, completeJobId]);

  const onStageAll = () => {
    setStaged(true);
  };
  const onSendToCrew = () => {
    // mock send
    // no-op aside from a slight visual cue handled in UI
  };
  const onSendPin = (id: number) => {
    setPinSent(prev => prev.includes(id) ? prev : [...prev, id]);
  };
  const onOpenTailboard = (id: number) => {
    setTailboardOpen(id);
    if (!timesheetStarted.includes(id)) setTimesheetStarted(prev => [...prev, id]);
  };
  const onCompletePackage = (id: number, hadDesignChanges: boolean) => {
    // mock: mark complete; NEXA would autofill docs and analyze photos
    if (!completedJobs.includes(id)) setCompletedJobs(prev => [...prev, id]);
  };

  // NEW: Live clock for "Current Time" card
  const [currentTime, setCurrentTime] = useState<string>(() => new Date().toLocaleString());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleString()), 1000);
    return () => clearInterval(timer);
  }, []);

  // NEW: To Do list (from API). Items NEXA cannot handle are flagged as canAiHandle=false
  type Todo = { id:number; title:string; due?:string; canAiHandle:boolean; done?:boolean };
  const [todos, setTodos] = useState<Todo[]>([]);
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch('/api/todos', { cache: 'no-store' });
        if (res.ok) {
          const data: Todo[] = await res.json();
          if (isMounted) setTodos(data);
        } else {
          // fallback seed
          if (isMounted) setTodos([
            { id: 1, title: 'Approve Crew A timesheets', due: 'Today 5:00 PM', canAiHandle: false, done: false },
            { id: 2, title: 'Confirm weekend outage window with Dispatch', due: 'Tomorrow 9:00 AM', canAiHandle: false, done: false },
            { id: 3, title: 'Email supplier about transformer lead times', due: 'Mon 10:30 AM', canAiHandle: true, done: false },
          ]);
        }
      } catch {
        // offline fallback
        if (isMounted) setTodos([
          { id: 1, title: 'Approve Crew A timesheets', due: 'Today 5:00 PM', canAiHandle: false, done: false },
          { id: 2, title: 'Confirm weekend outage window with Dispatch', due: 'Tomorrow 9:00 AM', canAiHandle: false, done: false },
          { id: 3, title: 'Email supplier about transformer lead times', due: 'Mon 10:30 AM', canAiHandle: true, done: false },
        ]);
      }
    })();
    return () => { isMounted = false };
  }, []);

  // NEW: Overlays state
  const [designOpen, setDesignOpen] = useState(false);
  const [commsOpen, setCommsOpen] = useState(false);
  const [todoOpen, setTodoOpen] = useState(false);

  // Nexa Design (mock O-Calc) state
  const [designDesc, setDesignDesc] = useState('');
  const [designFiles, setDesignFiles] = useState<number>(0);
  const [designGenerating, setDesignGenerating] = useState(false);
  const [designResult, setDesignResult] = useState<{ title:string; materials:string[] } | null>(null);

  // Messaging / Nexa Field state
  const [commsTab, setCommsTab] = useState<'message'|'nexa'>('message');
  const [dmThread, setDmThread] = useState<Array<{from:'me'|'lori'|'dispatch'; text:string; time:string}>>([
    { from:'lori', text:'Can you confirm Exhibit B sent?', time:'08:12' },
    { from:'me', text:'Sent. See thread with Documents.', time:'08:15' },
  ]);
  const [dmInput, setDmInput] = useState('');
  const [nexaChat, setNexaChat] = useState<Array<{from:'me'|'nexa'; text:string; time:string}>>([
    { from:'nexa', text:'Hi Tony, how can I help? I can fetch forms, specs, or answer utility questions.', time:'Now' }
  ]);
  const [nexaInput, setNexaInput] = useState('');

  return (
  <div className="space-y-4">
    {/* Welcome Card with animated gradient */}
    <Card variant="gradient" glow={true}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-light tracking-wide text-white mb-1">Welcome back, <span className="font-medium text-cyan-400">{userName}</span></h3>
          <p className="text-sm text-gray-400 font-light">System optimal • All sectors operational</p>
        </div>
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 bg-cyan-500 rounded-full blur-xl opacity-50 animate-pulse" />
          <div className="relative w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center">
            <Zap className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    </Card>

    {/* Nexa Pillars: Design, Messaging/Nexa Field, To Do */}
    <div className="grid grid-cols-3 gap-3">
      {/* Nexa Design */}
      <button onClick={() => { setDesignOpen(true); setDesignResult(null); }} className="relative p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl backdrop-blur-xl border border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,212,255,0.25)] group">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
        <CircuitBoard className="w-6 h-6 text-cyan-300 mx-auto mb-2" />
        <p className="text-[10px] uppercase tracking-wider text-gray-300">Nexa Design</p>
        <p className="text-[10px] text-gray-500 mt-1">O-Calc demo: upload circuit + describe</p>
      </button>

      {/* Messaging / Nexa Field */}
      <button onClick={() => setCommsOpen(true)} className="relative p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl backdrop-blur-xl border border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,0,160,0.25)] group">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
        <MessageSquare className="w-6 h-6 text-purple-300 mx-auto mb-2" />
        <p className="text-[10px] uppercase tracking-wider text-gray-300">Message / Nexa Field</p>
        <p className="text-[10px] text-gray-500 mt-1">DM coworkers or ask the AI assistant</p>
      </button>

      {/* To Do List */}
      <button onClick={() => setTodoOpen(true)} className="relative p-4 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-xl backdrop-blur-xl border border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,136,0.25)] group">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
        <ListTodo className="w-6 h-6 text-emerald-300 mx-auto mb-2" />
        <p className="text-[10px] uppercase tracking-wider text-gray-300">To Do</p>
        <p className="text-[10px] text-gray-500 mt-1">Human tasks from Outlook</p>
      </button>
    </div>

    {/* AI Status with cyberpunk aesthetics */}
    <Card variant="glass" glow={isAiActive}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`absolute inset-0 ${isAiActive ? 'bg-green-500' : 'bg-gray-500'} rounded-lg blur-xl opacity-30`} />
            <div className={`relative w-10 h-10 ${isAiActive ? 'bg-gradient-to-br from-green-400 to-emerald-600' : 'bg-gradient-to-br from-gray-400 to-gray-600'} rounded-lg flex items-center justify-center`}>
              <Activity className={`w-5 h-5 text-white ${isAiActive ? 'animate-pulse' : ''}`} />
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400">NEXA Field AI</p>
            <p className={`text-sm font-light ${isAiActive ? 'text-green-400' : 'text-gray-500'}`}>
              {isAiActive ? 'Neural Network Active' : 'Manual Override'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 mb-1">Neural Activity</p>
          <div className="flex gap-1 mt-1">
            <div className={`w-1 h-3 ${isAiActive ? 'bg-green-400' : 'bg-gray-600'} ${isAiActive ? 'animate-pulse' : ''}`} />
            <div className={`w-1 h-3 ${isAiActive ? 'bg-green-400 animation-delay-100' : 'bg-gray-600'} ${isAiActive ? 'animate-pulse' : ''}`} />
            <div className={`w-1 h-3 ${isAiActive ? 'bg-green-400 animation-delay-200' : 'bg-gray-600'} ${isAiActive ? 'animate-pulse' : ''}`} />
          </div>
        </div>
      </div>
    </Card>

    {/* Critical Alert with holographic warning */}
    

    {/* Mini Activity Feed (last 3) */}
    <Card variant="glass">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs uppercase tracking-[0.25em] text-cyan-400">Activity Feed</h3>
        <span className="text-[10px] text-gray-500">Recent</span>
      </div>
      {logs.length === 0 ? (
        <p className="text-xs text-gray-500">No recent activity.</p>
      ) : (
        <div className="space-y-2">
          {logs.slice(0, 3).map((l) => (
            <div key={l.id} className="flex items-start gap-2 p-2 rounded-lg hover:bg-white/[0.03] transition-colors">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/30 rounded blur opacity-20" />
                <div className="relative w-6 h-6 bg-gradient-to-br from-cyan-400/30 to-blue-600/30 rounded flex items-center justify-center">
                  <l.icon className="w-3.5 h-3.5 text-cyan-300" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-[12px] text-gray-300 leading-snug">{l.message}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{l.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>

    {/* Overlays */}
    {designOpen && (
      <div className="fixed inset-0 z-40">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDesignOpen(false)} />
        <div className="absolute inset-3 md:inset-20 rounded-2xl border border-white/10 bg-black/90 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div>
              <h3 className="text-sm text-white font-medium">Nexa Design • O-Calc Demo</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Upload a circuit map and describe the planned work</p>
            </div>
            <button onClick={() => setDesignOpen(false)} className="px-3 py-1.5 rounded-lg text-xs border border-white/10 text-gray-300 hover:bg-white/5">Close</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <Card variant="glass" className="p-4">
              <label className="text-[12px] text-gray-400">Circuit Map (image or PDF)</label>
              <input type="file" multiple className="mt-2 block w-full text-[11px] text-gray-300" onChange={(e) => setDesignFiles(e.target.files ? e.target.files.length : 0)} />
              {designFiles > 0 && <p className="mt-1 text-[11px] text-gray-500">{designFiles} file(s) selected</p>}
              <label className="text-[12px] text-gray-400 mt-4 block">Brief Description</label>
              <textarea value={designDesc} onChange={(e)=>setDesignDesc(e.target.value)} rows={4} className="mt-2 w-full rounded-md bg-white/5 border border-white/10 text-sm text-gray-200 p-2 outline-none focus:ring-1 focus:ring-cyan-400" placeholder="e.g., Replace 2 poles, add mid-span transformer, reroute secondary..." />
              <div className="mt-3 flex items-center gap-2">
                <button onClick={async () => {
                  try {
                    setDesignGenerating(true);
                    setDesignResult(null);
                    const res = await fetch('/api/design', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ description: designDesc })
                    });
                    if (res.ok) {
                      const data = await res.json();
                      setDesignResult({ title: data.title || 'Engineered Design v1', materials: data.materials || [] });
                    } else {
                      // fallback mock
                      setDesignResult({
                        title: 'Engineered Design v1',
                        materials: [
                          '2x Class 2 Wood Pole, 45 ft',
                          '1x 25 kVA Pole-mount Transformer',
                          '180 ft #2 ACSR Conductor',
                          '6x Insulators, Polymer',
                          'Grounding kit + hardware set'
                        ]
                      });
                    }
                  } catch (e) {
                    setDesignResult({
                      title: 'Engineered Design v1',
                      materials: [
                        '2x Class 2 Wood Pole, 45 ft',
                        '1x 25 kVA Pole-mount Transformer',
                        '180 ft #2 ACSR Conductor',
                        '6x Insulators, Polymer',
                        'Grounding kit + hardware set'
                      ]
                    });
                  } finally {
                    setDesignGenerating(false);
                  }
                }} className="px-3 py-1.5 rounded-lg text-xs border border-cyan-400/30 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 inline-flex items-center gap-1"><Sparkles className="w-3 h-3"/>Generate</button>
                {designGenerating && <span className="text-[11px] text-gray-400">Generating…</span>}
              </div>
            </Card>
            {designResult && (
              <Card variant="glass" className="p-4">
                <h4 className="text-xs uppercase tracking-wider text-gray-400">{designResult.title}</h4>
                <ul className="mt-2 list-disc list-inside text-sm text-gray-300 space-y-1">
                  {designResult.materials.map((m)=> <li key={m}>{m}</li>)}
                </ul>
                <p className="text-[11px] text-gray-500 mt-3">This is a demo. O-Calc integration can be wired to generate structural calcs and BOM.</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    )}

    {commsOpen && (
      <div className="fixed inset-0 z-40">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setCommsOpen(false)} />
        <div className="absolute inset-3 md:inset-20 rounded-2xl border border-white/10 bg-black/90 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <button onClick={()=>setCommsTab('message')} className={`px-3 py-1.5 rounded-lg text-xs border ${commsTab==='message' ? 'border-purple-400/40 text-purple-200 bg-purple-500/10' : 'border-white/10 text-gray-300 hover:bg-white/5'}`}>Message</button>
              <button onClick={()=>setCommsTab('nexa')} className={`px-3 py-1.5 rounded-lg text-xs border ${commsTab==='nexa' ? 'border-cyan-400/40 text-cyan-200 bg-cyan-500/10' : 'border-white/10 text-gray-300 hover:bg-white/5'}`}>Nexa Field</button>
            </div>
            <button onClick={() => setCommsOpen(false)} className="px-3 py-1.5 rounded-lg text-xs border border-white/10 text-gray-300 hover:bg-white/5">Close</button>
          </div>

          {/* Message tab */}
          {commsTab==='message' && (
            <div className="flex-1 p-4 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-2">
                {dmThread.map((m, idx)=> (
                  <div key={idx} className={`flex ${m.from==='me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${m.from==='me' ? 'bg-cyan-500/10 text-cyan-100 border border-cyan-400/30' : 'bg-white/5 text-gray-200 border border-white/10'}`}>
                      <p>{m.text}</p>
                      <p className="text-[10px] text-gray-500 mt-1">{m.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <input value={dmInput} onChange={(e)=>setDmInput(e.target.value)} placeholder="Message coworker…" className="flex-1 rounded-md bg-white/5 border border-white/10 text-sm text-gray-200 p-2 outline-none focus:ring-1 focus:ring-purple-400" />
                <button onClick={() => { if (!dmInput.trim()) return; setDmThread(prev=>[...prev, {from:'me', text:dmInput.trim(), time:'Now'}]); setDmInput(''); }} className="px-3 py-1.5 rounded-lg text-xs border border-purple-400/30 text-purple-200 bg-purple-500/10 hover:bg-purple-500/20">Send</button>
              </div>
            </div>
          )}

          {/* Nexa Field tab */}
          {commsTab==='nexa' && (
            <div className="flex-1 p-4 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-2">
                {nexaChat.map((m, idx)=> (
                  <div key={idx} className={`flex ${m.from==='me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${m.from==='me' ? 'bg-cyan-500/10 text-cyan-100 border border-cyan-400/30' : 'bg-white/5 text-gray-200 border border-white/10'}`}>
                      <p>{m.text}</p>
                      <p className="text-[10px] text-gray-500 mt-1">{m.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <input value={nexaInput} onChange={(e)=>setNexaInput(e.target.value)} placeholder="Ask Nexa… (forms, specs, circuit questions)" className="flex-1 rounded-md bg-white/5 border border-white/10 text-sm text-gray-200 p-2 outline-none focus:ring-1 focus:ring-cyan-400" />
                <button onClick={() => { if (!nexaInput.trim()) return; const q=nexaInput.trim(); setNexaChat(prev=>[...prev, {from:'me', text:q, time:'Now'}]); setNexaInput(''); setTimeout(()=> setNexaChat(prev=>[...prev, {from:'nexa', text:'Here you go: I can fetch the form or answer spec references. (demo response)', time:'Now'}]), 800); }} className="px-3 py-1.5 rounded-lg text-xs border border-cyan-400/30 text-cyan-200 bg-cyan-500/10 hover:bg-cyan-500/20">Send</button>
              </div>
            </div>
          )}
        </div>
      </div>
    )}

    {todoOpen && (
      <div className="fixed inset-0 z-40">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setTodoOpen(false)} />
        <div className="absolute inset-3 md:inset-20 rounded-2xl border border-white/10 bg-black/90 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-sm text-white font-medium">To Do – Human Tasks</h3>
            <button onClick={() => setTodoOpen(false)} className="px-3 py-1.5 rounded-lg text-xs border border-white/10 text-gray-300 hover:bg-white/5">Close</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {todos.filter(t=>!t.canAiHandle).map(t => (
              <label key={t.id} className="flex items-start gap-2 text-sm text-gray-300 bg-white/5 border border-white/10 rounded-lg p-3">
                <input type="checkbox" checked={!!t.done} onChange={async (e)=> {
                  const newDone = e.target.checked;
                  setTodos(prev=> prev.map(x=> x.id===t.id ? {...x, done:newDone} : x));
                  try {
                    await fetch(`/api/todos/${t.id}` , {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ done: newDone })
                    });
                  } catch {}
                }} className="mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`${t.done ? 'line-through text-gray-500' : ''}`}>{t.title}</span>
                    <div className="flex items-center gap-2">
                      {t.due && <span className="text-[10px] text-gray-500">{t.due}</span>}
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-400/20">Needs human</span>
                    </div>
                  </div>
                </div>
              </label>
            ))}
            {todos.filter(t=>!t.canAiHandle).length===0 && (
              <p className="text-xs text-gray-500">Nothing left. You’re all clear.</p>
            )}
          </div>
          <div className="p-4 border-t border-white/10 flex items-center gap-2">
            <input placeholder="New task…" className="flex-1 rounded-md bg-white/5 border border-white/10 text-sm text-gray-200 p-2 outline-none focus:ring-1 focus:ring-emerald-400" onKeyDown={async (e)=>{
              if (e.key==='Enter') {
                const v=(e.target as HTMLInputElement).value.trim();
                if (!v) return;
                try {
                  const res = await fetch('/api/todos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: v, canAiHandle: false })
                  });
                  if (res.ok) {
                    const created: Todo = await res.json();
                    setTodos(prev=> [...prev, created]);
                    (e.target as HTMLInputElement).value='';
                  } else {
                    // fallback local add
                    setTodos(prev=> [...prev, { id: Date.now(), title:v, canAiHandle:false, done:false }]);
                    (e.target as HTMLInputElement).value='';
                  }
                } catch {
                  setTodos(prev=> [...prev, { id: Date.now(), title:v, canAiHandle:false, done:false }]);
                  (e.target as HTMLInputElement).value='';
                }
              }
            }} />
            <button onClick={()=> setTodoOpen(false)} className="px-3 py-1.5 rounded-lg text-xs border border-emerald-400/30 text-emerald-200 bg-emerald-500/10 hover:bg-emerald-500/20">Done</button>
          </div>
        </div>
      </div>
    )}

    {/* Foreman Day Flow */}
    <Card variant="glass">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs uppercase tracking-[0.25em] text-cyan-400">Field Schedule</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setTab('calendar')}
            className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${tab === 'calendar' ? 'bg-white/10 border-white/20 text-white' : 'bg-black/30 border-white/10 text-gray-400 hover:bg-white/5'}`}
          >Calendar</button>
          <button
            onClick={() => setTab('today')}
            className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${tab === 'today' ? 'bg-cyan-500/10 border-cyan-400/30 text-cyan-300' : 'bg-black/30 border-white/10 text-gray-400 hover:bg-white/5'}`}
          >Today</button>
        </div>
      </div>

      {tab === 'calendar' ? (
        <div>
          <div className="grid grid-cols-6 gap-2">
            {last30Days.map((d, idx) => {
              const isToday = d.toDateString() === today.toDateString();
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setTab('today')}
                  className={`rounded-lg p-3 text-center border focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-colors ${isToday ? 'border-cyan-400/40 bg-cyan-500/5 text-cyan-200' : 'border-white/10 bg-white/0 text-gray-400 hover:bg-white/5'}`}
                  title={isToday ? 'Go to Today' : 'View Today flow'}
                >
                  <p className="text-[10px] uppercase tracking-wider">{d.toLocaleDateString(undefined, { month: 'short' })}</p>
                  <p className="text-sm mt-1">{d.getDate()}</p>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-gray-500 mt-3">Tip: switch to the Today tab to stage materials and brief the crew.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Bulk actions */}
          <div className="flex items-center gap-2">
            <button onClick={onStageAll} className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${staged ? 'bg-green-500/10 border-green-400/30 text-green-300' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'}`}>Stage Materials</button>
            <button onClick={onSendToCrew} className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${staged ? 'bg-blue-500/10 border-blue-400/30 text-blue-300 hover:bg-blue-500/20' : 'bg-black/30 border-white/10 text-gray-500 cursor-not-allowed'}`} disabled={!staged}>
              <Share2 className="w-4 h-4 inline mr-1" /> Send to Crew
            </button>
          </div>

          {staged && (
            <div className="mt-2 p-3 rounded-lg bg-green-500/5 border border-green-400/20 text-green-200 text-xs">
              Staged {stagedMaterials.length} unique materials for today's jobs.
            </div>
          )}

          {/* Jobs list */}
          <div className="space-y-3">
            {sortedJobsToday.map(job => (
              <div key={job.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm text-white font-medium">{job.title}</h4>
                    <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-1">
                      <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {job.start} – {job.end}</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {job.dependencies.map(dep => (
                        <span key={dep} className="px-2 py-0.5 rounded-md text-[10px] bg-purple-500/10 text-purple-200 border border-purple-400/20">{dep}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    {timesheetStarted.includes(job.id) && (
                      <span className="text-[10px] text-emerald-300">Timesheet started</span>
                    )}
                    {completedJobs.includes(job.id) && (
                      <div className="text-[10px] text-cyan-300">Package complete</div>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button onClick={() => setJobDetailOpen(jobDetailOpen === job.id ? null : job.id)} className="px-3 py-1.5 rounded-lg text-xs border border-white/10 text-gray-300 hover:bg-white/5">{jobDetailOpen === job.id ? 'Hide' : 'View'}</button>
                  <button onClick={() => onSendPin(job.id)} className={`px-3 py-1.5 rounded-lg text-xs border transition-all inline-flex items-center gap-1 ${pinSent.includes(job.id) ? 'bg-amber-500/10 border-amber-400/30 text-amber-200' : 'border-white/10 text-gray-300 hover:bg-white/5'}`}>
                    <MapPin className="w-3 h-3" /> {pinSent.includes(job.id) ? 'Pin Sent' : 'Send Pin'}
                  </button>
                  <button onClick={() => onOpenTailboard(job.id)} className="px-3 py-1.5 rounded-lg text-xs border border-blue-400/30 text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 inline-flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Tailboard
                  </button>
                  {!completedJobs.includes(job.id) ? (
                    <Link href={`/complete/${job.id}`} className="px-3 py-1.5 rounded-lg text-xs border border-emerald-400/30 text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 inline-flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Complete Package
                    </Link>
                  ) : null}
                </div>

                {/* Job Detail Panel: Material Sheet, Drawing, Spec */}
                {jobDetailOpen === job.id && (
                  <div className="mt-3 grid grid-cols-1 gap-3">
                    <Card variant="glass" className="p-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs uppercase tracking-wider text-gray-400">Material Sheet</h5>
                        <Link href={`/docs/${job.id}/material-sheet`} className="px-2 py-1 rounded-md text-[11px] border border-white/10 text-gray-300 hover:bg-white/5">Download PDF</Link>
                      </div>
                      <ul className="mt-2 text-xs text-gray-300 list-disc list-inside space-y-1">
                        {job.materials.map((m) => (
                          <li key={m}>{m}</li>
                        ))}
                      </ul>
                    </Card>
                    <Card variant="glass" className="p-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs uppercase tracking-wider text-gray-400">Construction Drawing</h5>
                        <Link href={`/docs/${job.id}/drawing`} className="px-2 py-1 rounded-md text-[11px] border border-white/10 text-gray-300 hover:bg-white/5">Open</Link>
                      </div>
                      <div className="mt-2 h-28 rounded-md bg-white/[0.03] border border-white/10 flex items-center justify-center text-[11px] text-gray-500">
                        Drawing preview placeholder
                      </div>
                    </Card>
                    <Card variant="glass" className="p-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs uppercase tracking-wider text-gray-400">Spec</h5>
                        <Link href={`/docs/${job.id}/spec`} className="px-2 py-1 rounded-md text-[11px] border border-white/10 text-gray-300 hover:bg-white/5">View Spec</Link>
                      </div>
                      <p className="mt-2 text-xs text-gray-400">Spec summary: installation torque, conductor clearances, grounding method, inspection criteria.</p>
                    </Card>
                  </div>
                )}

                {/* Package Completion Panel (inline) – retained but hidden when overlay is used */}
                {packageOpen === job.id && !completedJobs.includes(job.id) && completeJobId === null && (
                  <div className="mt-3 p-3 rounded-lg bg-black/40 border border-white/10">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-gray-400">Checklist</p>
                        <div className="mt-2 space-y-1 text-gray-300">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={!!checklist[job.id]?.asBuilt}
                              onChange={(e) => setChecklist(prev => ({ ...prev, [job.id]: { ...(prev[job.id] || { asBuilt:false, photos:false, siteClean:false, materialsReconciled:false }), asBuilt: e.target.checked } }))}
                            />
                            <span>As-built captured</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={!!checklist[job.id]?.photos}
                              onChange={(e) => setChecklist(prev => ({ ...prev, [job.id]: { ...(prev[job.id] || { asBuilt:false, photos:false, siteClean:false, materialsReconciled:false }), photos: e.target.checked } }))}
                            />
                            <span>Photos uploaded</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={!!checklist[job.id]?.siteClean}
                              onChange={(e) => setChecklist(prev => ({ ...prev, [job.id]: { ...(prev[job.id] || { asBuilt:false, photos:false, siteClean:false, materialsReconciled:false }), siteClean: e.target.checked } }))}
                            />
                            <span>Site clean</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={!!checklist[job.id]?.materialsReconciled}
                              onChange={(e) => setChecklist(prev => ({ ...prev, [job.id]: { ...(prev[job.id] || { asBuilt:false, photos:false, siteClean:false, materialsReconciled:false }), materialsReconciled: e.target.checked } }))}
                            />
                            <span>Materials reconciled</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400">Design Changes</p>
                        <div className="mt-1 flex gap-2">
                          <button onClick={() => setDesignChange(prev => ({ ...prev, [job.id]: true }))} className={`px-2 py-1 rounded-md border text-[11px] ${designChange[job.id] ? 'bg-amber-500/10 border-amber-400/30 text-amber-200' : 'bg-white/5 border-white/10 text-gray-300'}`}>Redlines/Bluelines: Yes</button>
                          <button onClick={() => setDesignChange(prev => ({ ...prev, [job.id]: false }))} className={`px-2 py-1 rounded-md border text-[11px] ${designChange[job.id] === false ? 'bg-emerald-500/10 border-emerald-400/30 text-emerald-200' : 'bg-white/5 border-white/10 text-gray-300'}`}>No</button>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1">NEXA will autofill documents accordingly.</p>
                        <div className="mt-3">
                          <label className="text-[11px] text-gray-400">Upload Photos</label>
                          <input
                            type="file"
                            multiple
                            className="mt-1 block w-full text-[11px] text-gray-300"
                            onChange={(e) => {
                              const count = e.target.files ? e.target.files.length : 0;
                              setJobPhotos(prev => ({ ...prev, [job.id]: count }));
                            }}
                          />
                          {jobPhotos[job.id] ? (
                            <p className="mt-1 text-[11px] text-gray-500">{jobPhotos[job.id]} photo(s) selected</p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => {
                          // Mock analysis: if any checklist item missing, or designChange true, or no photos -> needs go-back
                          setAnalyzing(prev => ({ ...prev, [job.id]: true }));
                          setAnalysisMsg(prev => ({ ...prev, [job.id]: null }));
                          setTimeout(() => {
                            const cl = checklist[job.id] || { asBuilt:false, photos:false, siteClean:false, materialsReconciled:false };
                            const needsGoBack = designChange[job.id] || !cl.asBuilt || !cl.photos || !cl.siteClean || !cl.materialsReconciled || !(jobPhotos[job.id] && jobPhotos[job.id] > 0);
                            setAnalyzing(prev => ({ ...prev, [job.id]: false }));
                            setAnalysisMsg(prev => ({ ...prev, [job.id]: needsGoBack ? 'Needs Go-Back: discrepancies found against spec items.' : 'Meets Spec: all checks passed.' }));
                          }, 1200);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs border border-cyan-400/30 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20"
                      >
                        {analyzing[job.id] ? 'Analyzing…' : 'Analyze Photos vs Spec'}
                      </button>
                      {analysisMsg[job.id] && (
                        <span className={`text-[11px] ${analysisMsg[job.id]?.startsWith('Needs') ? 'text-amber-300' : 'text-emerald-300'}`}>{analysisMsg[job.id]}</span>
                      )}
                      <button onClick={() => onCompletePackage(job.id, !!designChange[job.id])} className="px-3 py-1.5 rounded-lg text-xs border border-cyan-400/30 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20">Finalize Package</button>
                      <button onClick={() => {
                        onCompletePackage(job.id, !!designChange[job.id]);
                        const nextId = getNextJobId(job.id);
                        setStaged(true);
                        if (nextId) {
                          onSendPin(nextId);
                          onOpenTailboard(nextId);
                        }
                        setPackageOpen(null);
                      }} className="px-3 py-1.5 rounded-lg text-xs border border-purple-400/30 text-purple-200 bg-purple-500/10 hover:bg-purple-500/20">Finalize & Stage Next Job</button>
                      <span className="text-[11px] text-gray-500">NEXA analyzes photos for go-backs and populates timesheet.</span>
                    </div>
                  </div>
                )}

                {/* Tailboard form (mock) */}
                {tailboardOpen === job.id && (
                  <div className="mt-3 p-3 rounded-lg bg-black/40 border border-white/10">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-gray-400">Crew</p>
                        <p className="text-gray-300">Auto-populated</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Location</p>
                        <p className="text-gray-300">{job.location}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Materials</p>
                        <p className="text-gray-300">{job.materials.join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Dependencies</p>
                        <p className="text-gray-300">{job.dependencies.join(', ')}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="text-[11px] text-gray-400">Hazards & Safety Notes</label>
                      <textarea
                        className="mt-1 w-full rounded-md bg-black/50 border border-white/10 p-2 text-xs text-gray-200"
                        rows={3}
                        placeholder="e.g., traffic control, weather, energized equipment"
                        value={hazardNotes[job.id] || ''}
                        onChange={(e) => setHazardNotes(prev => ({ ...prev, [job.id]: e.target.value }))}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>

    {/* Completion Overlay (within content area) */}
    {completeJobId !== null && currentJob && (
      <div className="absolute inset-0 z-20">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        {/* Panel */}
        <div className="absolute inset-3 rounded-2xl border border-white/10 bg-black/90 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div>
              <h3 className="text-sm text-white font-medium">Complete Package</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">{currentJob.title}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setCompleteJobId(null)} className="px-3 py-1.5 rounded-lg text-xs border border-white/10 text-gray-300 hover:bg-white/5">Back</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Checklist & Design Changes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Card variant="glass" className="p-4">
                <h4 className="text-xs uppercase tracking-wider text-gray-400">Checklist</h4>
                <div className="mt-2 space-y-2 text-gray-300 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!checklist[currentJob.id]?.asBuilt}
                      onChange={(e) => setChecklist(prev => ({ ...prev, [currentJob.id]: { ...(prev[currentJob.id] || { asBuilt:false, photos:false, siteClean:false, materialsReconciled:false }), asBuilt: e.target.checked } }))}
                    />
                    <span>As-built captured</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!checklist[currentJob.id]?.photos}
                      onChange={(e) => setChecklist(prev => ({ ...prev, [currentJob.id]: { ...(prev[currentJob.id] || { asBuilt:false, photos:false, siteClean:false, materialsReconciled:false }), photos: e.target.checked } }))}
                    />
                    <span>Photos uploaded</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!checklist[currentJob.id]?.siteClean}
                      onChange={(e) => setChecklist(prev => ({ ...prev, [currentJob.id]: { ...(prev[currentJob.id] || { asBuilt:false, photos:false, siteClean:false, materialsReconciled:false }), siteClean: e.target.checked } }))}
                    />
                    <span>Site clean</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!checklist[currentJob.id]?.materialsReconciled}
                      onChange={(e) => setChecklist(prev => ({ ...prev, [currentJob.id]: { ...(prev[currentJob.id] || { asBuilt:false, photos:false, siteClean:false, materialsReconciled:false }), materialsReconciled: e.target.checked } }))}
                    />
                    <span>Materials reconciled</span>
                  </label>
                </div>
              </Card>

              <Card variant="glass" className="p-4">
                <h4 className="text-xs uppercase tracking-wider text-gray-400">Design Changes & Photos</h4>
                <div className="mt-2">
                  <div className="flex gap-2">
                    <button onClick={() => setDesignChange(prev => ({ ...prev, [currentJob.id]: true }))} className={`px-2 py-1 rounded-md border text-[11px] ${designChange[currentJob.id] ? 'bg-amber-500/10 border-amber-400/30 text-amber-200' : 'bg-white/5 border-white/10 text-gray-300'}`}>Redlines/Bluelines: Yes</button>
                    <button onClick={() => setDesignChange(prev => ({ ...prev, [currentJob.id]: false }))} className={`px-2 py-1 rounded-md border text-[11px] ${designChange[currentJob.id] === false ? 'bg-emerald-500/10 border-emerald-400/30 text-emerald-200' : 'bg-white/5 border-white/10 text-gray-300'}`}>No</button>
                  </div>
                  <div className="mt-3">
                    <label className="text-[11px] text-gray-400">Upload Photos</label>
                    <input
                      type="file"
                      multiple
                      className="mt-1 block w-full text-[11px] text-gray-300"
                      onChange={(e) => {
                        const count = e.target.files ? e.target.files.length : 0;
                        setJobPhotos(prev => ({ ...prev, [currentJob.id]: count }));
                      }}
                    />
                    {jobPhotos[currentJob.id] ? (
                      <p className="mt-1 text-[11px] text-gray-500">{jobPhotos[currentJob.id]} photo(s) selected</p>
                    ) : null}
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setAnalyzing(prev => ({ ...prev, [currentJob.id]: true }));
                  setAnalysisMsg(prev => ({ ...prev, [currentJob.id]: null }));
                  setTimeout(() => {
                    const cl = checklist[currentJob.id] || { asBuilt:false, photos:false, siteClean:false, materialsReconciled:false };
                    const needsGoBack = designChange[currentJob.id] || !cl.asBuilt || !cl.photos || !cl.siteClean || !cl.materialsReconciled || !(jobPhotos[currentJob.id] && jobPhotos[currentJob.id] > 0);
                    setAnalyzing(prev => ({ ...prev, [currentJob.id]: false }));
                    setAnalysisMsg(prev => ({ ...prev, [currentJob.id]: needsGoBack ? 'Needs Go-Back: discrepancies found against spec items.' : 'Meets Spec: all checks passed.' }));
                  }, 1200);
                }}
                className="px-3 py-1.5 rounded-lg text-xs border border-cyan-400/30 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20"
              >
                {analyzing[currentJob.id] ? 'Analyzing…' : 'Analyze Photos vs Spec'}
              </button>
              {analysisMsg[currentJob.id] && (
                <span className={`text-[11px] ${analysisMsg[currentJob.id]?.startsWith('Needs') ? 'text-amber-300' : 'text-emerald-300'}`}>{analysisMsg[currentJob.id]}</span>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-white/10 flex items-center justify-between">
            <button onClick={() => setCompleteJobId(null)} className="px-3 py-1.5 rounded-lg text-xs border border-white/10 text-gray-300 hover:bg-white/5">Back</button>
            <div className="flex items-center gap-2">
              <button onClick={() => {
                onCompletePackage(currentJob.id, !!designChange[currentJob.id]);
                setCompleteJobId(null);
              }} className="px-3 py-1.5 rounded-lg text-xs border border-cyan-400/30 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20">Finalize Package</button>
              <button onClick={() => {
                onCompletePackage(currentJob.id, !!designChange[currentJob.id]);
                const nextId = getNextJobId(currentJob.id);
                setStaged(true);
                if (nextId) {
                  onSendPin(nextId);
                  onOpenTailboard(nextId);
                }
                setCompleteJobId(null);
              }} className="px-3 py-1.5 rounded-lg text-xs border border-purple-400/30 text-purple-200 bg-purple-500/10 hover:bg-purple-500/20">Finalize & Stage Next Job</button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

// PipelinesView – Ingestion pipeline visualization & controls (Foreman)
const PipelinesView = () => {
  const [running, setRunning] = useState(true);
  const [throughput, setThroughput] = useState(1200); // docs/min
  const [latency, setLatency] = useState(220); // ms
  const [queueDepth, setQueueDepth] = useState(340); // items

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setThroughput((t) => Math.max(200, Math.min(5000, Math.round(t + (Math.random() - 0.5) * 150))));
      setLatency((l) => Math.max(50, Math.min(1200, Math.round(l + (Math.random() - 0.5) * 30))));
      setQueueDepth((q) => Math.max(0, Math.round(q + (Math.random() - 0.4) * 50)));
    }, 1500);
    return () => clearInterval(id);
  }, [running]);

  const pct = (value: number, max: number) => `${Math.min(100, Math.round((value / max) * 100))}%`;

  return (
    <div className="space-y-4">
      <Card variant="gradient" glow>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs uppercase tracking-[0.3em] text-cyan-300">Ingestion Pipeline</h3>
            <p className="text-sm text-gray-400 mt-1 font-light">Streaming field data into Bronze storage</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRunning((r) => !r)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-300 border ${
                running
                  ? 'bg-green-500/10 text-green-300 border-green-400/30 hover:bg-green-500/20'
                  : 'bg-gray-700/40 text-gray-300 border-white/10 hover:bg-gray-600/40'
              }`}
            >
              {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {running ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={() => {
                // quick resync action
                setQueueDepth((q) => Math.max(0, q - 50));
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-300 border bg-blue-500/10 text-blue-300 border-blue-400/30 hover:bg-blue-500/20"
              title="Sync Now"
            >
              <RefreshCw className="w-4 h-4" /> Sync
            </button>
          </div>
        </div>
      </Card>

      <Card variant="glass">
        <div className="flex items-center justify-center gap-3 text-gray-400">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-cyan-300" />
            <span className="text-xs">Sources</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-purple-300" />
            <span className="text-xs">Stream</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-blue-300" />
            <span className="text-xs">Ingest</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-300" />
            <span className="text-xs">Bronze</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-amber-300" />
            <span className="text-xs">Staging</span>
          </div>
        </div>
      </Card>

      <Card variant="glass">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">Throughput</p>
            <p className="text-sm text-gray-300 mt-1">{throughput} docs/min</p>
            <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: pct(throughput, 5000) }} />
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">Latency</p>
            <p className="text-sm text-gray-300 mt-1">{latency} ms</p>
            <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-green-600" style={{ width: pct(1200 - latency, 1200) }} />
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">Queue</p>
            <p className="text-sm text-gray-300 mt-1">{queueDepth}</p>
            <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-500" style={{ width: pct(queueDepth, 2000) }} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const SettingsView = ({ isAiActive, onAiToggle }: { isAiActive: boolean, onAiToggle: (isChecked: boolean) => void }) => (
    <div className="space-y-4">
        <Card variant="glass">
            <h3 className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-medium mb-4">AUTOMATION CONTROL</h3>
            <ToggleSwitch label="Full AI Automation" initialChecked={isAiActive} onChange={onAiToggle} />
            <p className="text-xs text-gray-400 mt-3 font-light leading-relaxed">Neural network will autonomously manage routine operations and predictive maintenance protocols.</p>
        </Card>
        <Card variant="glass">
            <h3 className="text-xs uppercase tracking-[0.2em] text-purple-400 font-medium mb-4">OFFLINE PROTOCOLS</h3>
            <ToggleSwitch label="Manual Task Override" initialChecked={true} onChange={() => {}} />
            <p className="text-xs text-gray-400 mt-3 font-light leading-relaxed">Local cache synchronization for zero-connectivity operational continuity.</p>
        </Card>
    </div>
);

const NexaFieldView = ({ logs }: { logs: LogEntry[] }) => (
    <div className="space-y-3">
        {logs.length === 0 ? (
            <div className="text-center pt-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full mb-4">
                    <Bot className="w-10 h-10 text-cyan-400/50" />
                </div>
                <p className="text-gray-500 text-sm">No AI activity yet</p>
                <p className="text-gray-600 text-xs mt-1">Neural network will log operations here</p>
            </div>
        ) : (
            logs.map((log) => (
                <Card key={log.id} variant="glass" className="p-4 hover:bg-white/[0.03] transition-all duration-300">
                    <div className="flex items-start gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-cyan-500 rounded blur-lg opacity-30" />
                            <div className="relative w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded flex items-center justify-center">
                                <log.icon className="w-4 h-4 text-white" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-300 font-light">{log.message}</p>
                            <p className="text-[10px] text-gray-500 mt-1">{log.time}</p>
                        </div>
                    </div>
                </Card>
            ))
        )}
    </div>
);

const PlaceholderView = ({ title }: { title: string }) => (
  <div className="text-center py-20">
    <p className="text-gray-500">{title} view is under construction.</p>
  </div>
);

function MobileApp() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isAiActive, setIsAiActive] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [unreadLogs, setUnreadLogs] = useState(0);

  // Register service worker for basic PWA caching (optional offline)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('serviceWorker' in navigator) {
      const register = () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.warn('SW registration failed', err);
        });
      };
      if (document.readyState === 'complete') {
        register();
      } else {
        // @ts-ignore: EventListenerOptions may not include 'once' in older TS lib
        window.addEventListener('load', register, { once: true });
      }
    }
  }, []);

  useEffect(() => {
    if (!isAiActive) return;
    const samples: Array<{ icon: React.ComponentType<any>; message: string }> = [
      { icon: Mail, message: 'Lori emailed requesting Exhibit B form.' },
      { icon: FileText, message: 'Exhibit B form staged to Documents.' },
      { icon: CheckCircle, message: 'Exhibit B sent to Lori — task complete.' },
      { icon: AlertTriangle, message: 'Transformer outage window within 2 hours of go‑back time.' },
      { icon: Share2, message: 'Crew A notified about updated schedule.' },
      { icon: MapPin, message: 'Pin drop sent for Oak Ridge job site.' },
      { icon: Clock, message: 'Timesheet started for “Pole Replacement • Sector 3”.' },
      { icon: FileText, message: 'Tailboard pre-filled for Transformer Swap — awaiting hazards.' },
      { icon: FileText, message: 'Material pick sheet generated for today’s jobs.' },
      { icon: CheckCircle, message: 'Flaggers confirmed for Sector 3 at 07:00.' },
    ];

    const interval = setInterval(() => {
      const sample = samples[Math.floor(Math.random() * samples.length)];
      const newLog: LogEntry = {
        id: Date.now(),
        icon: sample.icon,
        message: sample.message,
        time: new Date().toLocaleTimeString(),
      };
      setLogs(prev => [newLog, ...prev]);
      if (activeView !== 'ai-lab') {
        setUnreadLogs(prev => prev + 1);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isAiActive, activeView]);

  const handleViewChange = (view: View) => {
    console.log('Changing view to:', view);
    if (view === 'ai-lab') {
      setUnreadLogs(0);
    }
    setActiveView(view);
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <HomeView isAiActive={isAiActive} userName="Tony" logs={logs} />;
      case 'pipelines':
        return <PipelinesView />;
      case 'ai-lab':
        return <NexaFieldView logs={logs} />;
      case 'governance':
        return <PlaceholderView title="Governance" />;
      case 'analytics':
        return <SettingsView isAiActive={isAiActive} onAiToggle={setIsAiActive} />;
      default:
        return <HomeView isAiActive={isAiActive} userName="Tony" logs={logs} />;
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-950 to-black overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-200" />
        <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vmin] h-[60vmin] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-2xl animate-[pulse_6s_ease-in-out_infinite] pointer-events-none will-change-transform -z-10" />
      </div>
      
      <div className="relative z-10 w-full max-w-md md:h-[800px] h-[100dvh] bg-black/50 backdrop-blur-2xl md:rounded-[40px] rounded-none shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:border border-transparent md:border-white/[0.02]">
        {/* Device frame with gradient border */}
        <div className="absolute inset-0 md:rounded-[40px] rounded-none bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 p-[1px] hidden md:block">
          <div className="w-full h-full bg-black/90 md:rounded-[39px] rounded-none" />
        </div>
        
        <div className="relative flex flex-col h-full">
        {/* Header with glassmorphism */}
        <header className="flex items-center justify-between p-5 flex-shrink-0 backdrop-blur-xl bg-gradient-to-r from-black/60 via-gray-900/60 to-black/60 border-b border-white/[0.05]">
          <h1 className="text-2xl font-extralight tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">NEXA</h1>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isAiActive ? 'bg-green-400 shadow-[0_0_10px_rgba(0,255,0,0.5)]' : 'bg-gray-600'} ${isAiActive ? 'animate-pulse' : ''}`} />
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">v2.0</span>
          </div>
        </header>

        {/* Main Content Area with cinematic fade */}
        <div className="flex-grow p-5 overflow-y-auto relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-cyan-500/50" />
            <h2 className="text-xs uppercase tracking-[0.3em] text-cyan-400/80 font-light">{activeView}</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-cyan-500/50" />
          </div>
          {renderView()}
        </div>

        {/* Bottom Navigation with neon glow */}
        <nav className="flex justify-around items-center p-3 flex-shrink-0 backdrop-blur-xl bg-gradient-to-t from-black/80 to-transparent border-t border-white/[0.05]">
          <button 
            onClick={() => handleViewChange('dashboard')} 
            className={`relative flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${activeView === 'dashboard' ? 'bg-cyan-500/10' : 'hover:bg-white/[0.02]'}`}
          >
            <Home size={22} className={activeView === 'dashboard' ? 'text-cyan-400' : 'text-gray-500'} />
            <span className={`text-[10px] mt-1.5 uppercase tracking-wider font-light ${activeView === 'dashboard' ? 'text-cyan-400' : 'text-gray-500'}`}>Dash</span>
            {activeView === 'dashboard' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-cyan-400 rounded-full" />}
          </button>
          
          <button 
            onClick={() => handleViewChange('pipelines')} 
            className={`relative flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${activeView === 'pipelines' ? 'bg-purple-500/10' : 'hover:bg-white/[0.02]'}`}
          >
            <Layers size={22} className={activeView === 'pipelines' ? 'text-purple-400' : 'text-gray-500'} />
            <span className={`text-[10px] mt-1.5 uppercase tracking-wider font-light ${activeView === 'pipelines' ? 'text-purple-400' : 'text-gray-500'}`}>Pipes</span>
            {activeView === 'pipelines' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-purple-400 rounded-full" />}
          </button>
          
          <button 
            onClick={() => handleViewChange('ai-lab')} 
            className={`relative flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${activeView === 'ai-lab' ? 'bg-green-500/10' : 'hover:bg-white/[0.02]'}`}
          >
            {unreadLogs > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white text-[9px] font-medium flex items-center justify-center animate-pulse shadow-[0_0_10px_rgba(255,0,0,0.5)]">
                {unreadLogs}
              </span>
            )}
            <Brain size={22} className={activeView === 'ai-lab' ? 'text-green-400' : 'text-gray-500'} />
            <span className={`text-[10px] mt-1.5 uppercase tracking-wider font-light ${activeView === 'ai-lab' ? 'text-green-400' : 'text-gray-500'}`}>AI Lab</span>
            {activeView === 'ai-lab' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-green-400 rounded-full" />}
          </button>
          
          <button 
            onClick={() => handleViewChange('governance')} 
            className={`relative flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${activeView === 'governance' ? 'bg-amber-500/10' : 'hover:bg-white/[0.02]'}`}
          >
            <Shield size={22} className={activeView === 'governance' ? 'text-amber-400' : 'text-gray-500'} />
            <span className={`text-[10px] mt-1.5 uppercase tracking-wider font-light ${activeView === 'governance' ? 'text-amber-400' : 'text-gray-500'}`}>Gov</span>
            {activeView === 'governance' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-amber-400 rounded-full" />}
          </button>
          
          <button 
            onClick={() => handleViewChange('analytics')} 
            className={`relative flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${activeView === 'analytics' ? 'bg-pink-500/10' : 'hover:bg-white/[0.02]'}`}
          >
            <BarChart3 size={22} className={activeView === 'analytics' ? 'text-pink-400' : 'text-gray-500'} />
            <span className={`text-[10px] mt-1.5 uppercase tracking-wider font-light ${activeView === 'analytics' ? 'text-pink-400' : 'text-gray-500'}`}>Stats</span>
            {activeView === 'analytics' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-pink-400 rounded-full" />}
          </button>
        </nav>
        </div>
      </div>
    </main>
  );
}

export default MobileApp;
