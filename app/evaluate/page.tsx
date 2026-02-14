"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ExtractionReport from '../components/extractionReport';


export default function EvaluatePage() {
    const [file, setFile] = useState<any>(null);
    const [userName, setUserName] = useState("");
    const [sessionId, setSessionId] = useState<string>("");
    const [ratings, setRatings] = useState<any>({});
    const [comment, setComment] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [displaySessionId, setDisplaySessionId] = useState<string>("");
    const [status, setStatus] = useState<'IDLE' | 'SUBMITTING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [lastError, setLastError] = useState<string | null>(null);
    

    useEffect(() => {
        const id = Math.random().toString(36).substr(2, 9);
        const displayId = Math.random().toString(36).substr(2, 5);
        setSessionId(id);
        setDisplaySessionId(displayId);
        fetchNext();
    }, []);

    const fetchNext = async () => {
        const res = await fetch('/api/evaluate');
        const data = await res.json();
        setFile(data.content);
    };

    const skipCurrent = async () => {
        setRatings({});
        setComment("");
        await fetchNext();
    };

    // console.log("Ratings state:", ratings, comment);

    const submitEval = async () => {
    setStatus('SUBMITTING');
    setLastError(null);

    try {
        const payload = {
            userName,
            sessionId,
            fileName: file?.citation || 'UNKNOWN_FILE', // Safety fallback
            ratings,
            comment,
        };

        const res = await fetch('/api/evaluate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await res.json();

        if (!res.ok) {
            throw new Error(result.error || `SERVER_ERROR_${res.status}`);
        }

        // Success Path
        setStatus('SUCCESS');
        setTimeout(() => setStatus('IDLE'), 3000); // Clear after 3s
        
        setComment("");
        fetchNext(); // Move to next file

    } catch (err: any) {
        console.error("SUBMISSION_FAILED:", err);
        setStatus('ERROR');
        setLastError(err.message);
    }
};

  if (!file) return <div className="bg-background h-screen flex items-center justify-center text-accent">Initializing Archive...</div>;
  return (
    
    <div className="min-h-screen text-[11px] uppercase tracking-wider text-text-main">
        {/* SESSION_ACCESS_GATE OVERLAY */}
{!isAuthorized && (
  <div className="fixed inset-0 z-[100] bg-paper flex items-center justify-center p-6">
    {/* Background Grid - to keep it consistent */}
    <div className="absolute inset-0 pointer-events-none opacity-20" 
         style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0px)', backgroundSize: '24px 24px' }} />
    
    <div className="w-full max-w-md bg-surface border-2 border-ink p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative z-10">
      <div className="mb-8 border-b border-ink pb-2">
        <h1 className="text-sm font-black tracking-[0.2em]">SYSTEM_ACCESS_TERMINAL</h1>
        <p className="text-[9px] text-ghost mt-1">LEGAL_ARCHIVE_V1 // AUTHORIZATION_REQUIRED</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold block">RESEARCHER_IDENTIFIER :</label>
          <input 
            type="text"
            autoFocus
            className="w-full bg-paper border border-ink p-3 outline-none focus:bg-white transition-colors font-mono uppercase text-xs"
            placeholder="INPUT_NAME_HERE..."
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && userName.trim() && setIsAuthorized(true)}
          />
        </div>

        <div className="bg-paper/50 p-4 border border-dashed border-ink/30">
          <p className="text-[9px] leading-relaxed text-ghost">
            NOTICE: BY INITIALIZING THIS SESSION, YOU ACKNOWLEDGE THAT ALL EVALUATIONS 
            WILL BE RECORDED UNDER THE IDENTITY PROVIDED ABOVE FOR RESEARCH PURPOSES.
          </p>
        </div>

        <button 
          disabled={!userName.trim()}
          onClick={() => setIsAuthorized(true)}
          className={`w-full py-3 font-bold transition-all border border-ink ${
            userName.trim() 
            ? 'bg-ink text-paper hover:invert cursor-pointer' 
            : 'bg-paper text-ghost cursor-not-allowed opacity-50'
          }`}
        >
          INITIALIZE_SESSION &gt;&gt;
        </button>
      </div>

      <div className="mt-8 pt-4 border-t border-ink/10 flex justify-between text-[8px] text-ghost font-mono">
        <span>LOC: {Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
        <span>UTC: {new Date().toISOString().split('T')[0]}</span>
      </div>
    </div>
  </div>
)}

      {/* Top Status Bar */}
      <header className="border-b border-border-thin p-2 flex justify-between items-center bg-background">
        <div>ENGINE: LEGAL_ARCHIVE_V1 // STATUS: OK // SESSION: {displaySessionId}</div>
        <div className="flex gap-4">
          <span>PATH: ROOT &gt; JUDGMENTS &gt; EVALUATION_MODE</span>
          <button onClick={skipCurrent} className="bg-gray-600 text-white px-4 py-0.5 hover:invert transition-all">SKIP</button>
          <button onClick={submitEval} className="bg-black text-white px-4 py-0.5 hover:invert transition-all">SUBMIT_DATA</button>
        </div>
      </header>

      <main className="flex h-[calc(100vh-33px)]">
        {/* Left Sidebar: Controls (Like ARCHIVE_PARAMS in your screenshot) */}
        <aside className="w-64 border-r border-border-thin p-4 space-y-8 bg-background">
          <section>
            <h2 className="border-b border-border-thin mb-4 pb-1 font-bold">EVAL_PARAMETERS</h2>
            <div className="space-y-4">
              <ArchivalSlider 
                label="TEXT_CLARITY" 
                // Changed || to ?? to allow 0 (LOW) to be a valid value
                value={ratings.text_clarity ?? 0.5} 
                onChange={(v) => setRatings({...ratings, text_clarity: v})}
                />
                <ArchivalSlider 
                label="ENTITY_EXTRACTION" 
                value={ratings.entity_extraction ?? 0.5}
                onChange={(v) => setRatings({...ratings, entity_extraction: v})}
                />
                <ArchivalSlider 
                label="TAG_RELEVANCE" 
                value={ratings.tag_relevance ?? 0.5}
                onChange={(v) => setRatings({...ratings, tag_relevance: v})}
                />
              <textarea 
                   className="w-full bg-background border border-border-thin p-2 normal-case h-32 outline-none focus:bg-white"
                   placeholder="Enter evaluation notes..."
                   value={comment}
                   onChange={(e) => setComment(e.target.value)}
                 />
            </div>
          </section>
          <div className="mt-auto border-t border-ink pt-4">
    <div className={`p-2 border ${
        status === 'ERROR' ? 'border-red-500 bg-red-50' : 
        status === 'SUCCESS' ? 'border-green-600 bg-green-50' : 
        'border-ink bg-paper'
    } transition-colors`}>
        <div className="flex justify-between items-center mb-1">
            <span className="text-[8px] font-bold">SYSTEM_LOG</span>
            <div className={`w-1.5 h-1.5 rounded-full ${
                status === 'SUBMITTING' ? 'bg-amber-500 animate-pulse' :
                status === 'SUCCESS' ? 'bg-green-600' :
                status === 'ERROR' ? 'bg-red-500' : 'bg-ghost'
            }`} />
        </div>
        
        <p className={`text-[9px] font-mono leading-none ${
            status === 'ERROR' ? 'text-red-600' : 'text-ink'
        }`}>
            {status === 'IDLE' && "> STANDBY"}
            {status === 'SUBMITTING' && "> UPLOADING_DATA..."}
            {status === 'SUCCESS' && "> DATA_CAPTURED_OK"}
            {status === 'ERROR' && `> ERR: ${lastError || "CRITICAL_FAIL"}`}
        </p>
    </div>
</div>
          

        </aside>
        {/* Center: Full Text (Source View) */}
        <section className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto border border-border-thin p-8 bg-panel shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-lg font-bold mb-6 underline">{file?.case_name || "UNKNOWN"}</h1>
            <p className="normal-case leading-relaxed font-sans text-sm">
              {/* This is where the judgment text goes. Keep it font-sans for readability against the mono UI */}
              {file?.full_text || "No content available"}
            </p>
          </div>
        </section>

        <ExtractionReport data={file}/>
      </main>
    </div>
  );
}

function ArchivalSlider({ label, value, onChange }: { label: string, value?: number, onChange?: (val: number) => void }) {
  const val = value ?? 0.5;
  const getLabel = (v: number) => v === 0 ? 'LOW' : v === 0.5 ? 'MED' : 'HIGH';
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[9px]"><span>{label}</span> <span>{getLabel(val)}</span></div>
      <div className="flex gap-1">
        {[0, 0.5, 1].map((v) => (
          <button
            key={v}
            onClick={() => onChange?.(v)}
            className={`flex-1 py-1 border border-black text-[9px] ${
              val === v ? 'bg-black text-white' : 'bg-white text-black'
            } hover:invert transition-colors`}
          >
            {v === 0 ? 'L' : v === 0.5 ? 'M' : 'H'}
          </button>
        ))}
      </div>
    </div>
  );
}

function DataMetric({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="font-bold w-24">{value}</span>
      <div className="flex-1 h-2 border border-black relative">
        <div className="absolute inset-y-0 left-0 bg-black" style={{ width: '70%' }}></div>
      </div>
      <span className="text-[9px] text-text-muted">{label}</span>
    </div>
  );
}