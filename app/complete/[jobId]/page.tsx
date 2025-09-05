"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, CheckCircle, MapPin, FileText } from "lucide-react";

const sampleJobs: Record<string, { title: string; location: string }> = {
  "1": { title: "Pole Replacement • Sector 3", location: "45.5120, -122.6580" },
  "2": { title: "Transformer Swap • Oak Ridge", location: "45.5199, -122.6740" },
  "3": { title: "Line Inspection • Substation 7", location: "45.5301, -122.6802" },
};

export default function CompleteJobPage({ params }: { params: { jobId: string } }) {
  const { jobId } = params;
  const job = useMemo(() => sampleJobs[jobId] ?? { title: `Job #${jobId}`, location: "Unknown" }, [jobId]);

  const [asBuilt, setAsBuilt] = useState(false);
  const [photos, setPhotos] = useState(false);
  const [siteClean, setSiteClean] = useState(false);
  const [materialsReconciled, setMaterialsReconciled] = useState(false);
  const [designType, setDesignType] = useState<"built" | "redlines" | "bluelines" | null>(null);
  const [photoCount, setPhotoCount] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisMsg, setAnalysisMsg] = useState<string | null>(null);
  const [finalMsg, setFinalMsg] = useState<string | null>(null);

  const runAnalysis = () => {
    setAnalyzing(true);
    setAnalysisMsg(null);
    setTimeout(() => {
      const hasDesignChanges = designType === "redlines" || designType === "bluelines";
      const needsGoBack = hasDesignChanges || !asBuilt || !photos || !siteClean || !materialsReconciled || photoCount === 0;
      setAnalyzing(false);
      setAnalysisMsg(needsGoBack ? "Needs Go-Back: discrepancies found against spec items." : "Meets Spec: all checks passed.");
    }, 1200);
  };

  const finalize = (andStageNext: boolean) => {
    setFinalMsg(andStageNext ? "Finalized. Staging next job, sending pin, opening tailboard…" : "Finalized this package.");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white">
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white">
            <ChevronLeft className="w-4 h-4" /> Back
          </Link>
          <span className="text-[11px] text-gray-500">Job #{jobId}</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-medium flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-300" /> Complete Package</h1>
              <p className="text-[12px] text-gray-400 mt-1">{job.title}</p>
            </div>
            <div className="text-right text-[11px] text-gray-500 inline-flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {job.location}</div>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-black/50 p-4">
              <h2 className="text-xs uppercase tracking-wider text-gray-400">Checklist</h2>
              <div className="mt-2 space-y-2 text-sm text-gray-300">
                <label className="flex items-center gap-2"><input type="checkbox" checked={asBuilt} onChange={(e) => setAsBuilt(e.target.checked)} /> As-built captured</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={photos} onChange={(e) => setPhotos(e.target.checked)} /> Photos uploaded</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={siteClean} onChange={(e) => setSiteClean(e.target.checked)} /> Site clean</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={materialsReconciled} onChange={(e) => setMaterialsReconciled(e.target.checked)} /> Materials reconciled</label>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/50 p-4">
              <h2 className="text-xs uppercase tracking-wider text-gray-400">Build Design & Photos</h2>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                <button
                  onClick={() => setDesignType("built")}
                  className={`px-2 py-1 rounded-md border ${designType === 'built' ? 'bg-emerald-500/10 border-emerald-400/30 text-emerald-200' : 'bg-white/5 border-white/10 text-gray-300'}`}
                >Built as Designed</button>
                <button
                  onClick={() => setDesignType("redlines")}
                  className={`px-2 py-1 rounded-md border ${designType === 'redlines' ? 'bg-amber-500/10 border-amber-400/30 text-amber-200' : 'bg-white/5 border-white/10 text-gray-300'}`}
                >Redlines</button>
                <button
                  onClick={() => setDesignType("bluelines")}
                  className={`px-2 py-1 rounded-md border ${designType === 'bluelines' ? 'bg-blue-500/10 border-blue-400/30 text-blue-200' : 'bg-white/5 border-white/10 text-gray-300'}`}
                >Bluelines</button>
              </div>
              <div className="mt-3">
                <label className="text-[11px] text-gray-400">Upload Photos</label>
                <input type="file" multiple className="mt-1 block w-full text-[11px] text-gray-300" onChange={(e) => setPhotoCount(e.target.files ? e.target.files.length : 0)} />
                {photoCount > 0 && <p className="mt-1 text-[11px] text-gray-500">{photoCount} photo(s) selected</p>}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button onClick={runAnalysis} className="px-3 py-1.5 rounded-lg text-xs border border-cyan-400/30 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20">
              {analyzing ? 'Analyzing…' : 'Analyze Photos vs Spec'}
            </button>
            {analysisMsg && <span className={`text-[11px] ${analysisMsg.startsWith('Needs') ? 'text-amber-300' : 'text-emerald-300'}`}>{analysisMsg}</span>}
          </div>

          <div className="mt-5 flex items-center justify-between">
            <Link href="/" className="px-3 py-1.5 rounded-lg text-xs border border-white/10 text-gray-300 hover:bg-white/5">Back</Link>
            <div className="flex items-center gap-2">
              <button onClick={() => finalize(false)} className="px-3 py-1.5 rounded-lg text-xs border border-cyan-400/30 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20">Finalize Package</button>
              <button onClick={() => finalize(true)} className="px-3 py-1.5 rounded-lg text-xs border border-purple-400/30 text-purple-200 bg-purple-500/10 hover:bg-purple-500/20">Finalize & Stage Next Job</button>
            </div>
          </div>

          {finalMsg && (
            <div className="mt-3 text-[12px] text-gray-400">
              {finalMsg} Return to Home to continue the flow.
            </div>
          )}

          <div className="mt-6 rounded-xl border border-white/10 bg-black/50 p-4 text-[12px] text-gray-500">
            <div className="flex items-center gap-2 mb-2"><FileText className="w-4 h-4 text-cyan-300" /> Tailboard & Timesheet</div>
            Tailboard will be auto-populated and timesheet started when you open it from the job card on Home.
          </div>
        </div>
      </div>
    </main>
  );
}
