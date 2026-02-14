import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-paper selection:bg-ink selection:text-paper">
      
      {/* Decorative Crosshair Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-full h-px bg-ink/10"></div>
        <div className="absolute top-0 left-1/2 w-px h-full bg-ink/10"></div>
        {/* Corners */}
        <div className="absolute top-10 left-10 w-4 h-4 border-t border-l border-ink"></div>
        <div className="absolute top-10 right-10 w-4 h-4 border-t border-r border-ink"></div>
        <div className="absolute bottom-10 left-10 w-4 h-4 border-b border-l border-ink"></div>
        <div className="absolute bottom-10 right-10 w-4 h-4 border-b border-r border-ink"></div>
      </div>

      {/* Central Control Module */}
      <div className="z-10 text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-black tracking-[0.3em] uppercase">Legal_Archive</h1>
          <p className="text-[10px] font-mono text-ghost tracking-widest uppercase">
            System_v1.0 // Judicial_Data_Refinement
          </p>
        </div>

        <div className="relative inline-block group">
          {/* Decorative offset box for that "blueprint" depth */}
          <div className="absolute inset-0 border border-ink translate-x-1 translate-y-1 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform"></div>
          
          <Link 
            href="/evaluate"
            className="relative block bg-surface border border-ink px-12 py-4 text-xs font-bold tracking-[0.2em] hover:bg-ink hover:text-paper transition-colors duration-300"
          >
            START_EVALUATION
          </Link>
        </div>

        <div className="pt-12 grid grid-cols-3 gap-8 opacity-40 text-[9px] font-mono uppercase">
          <div className="space-y-1">
            <span className="block text-ghost">Database</span>
            <span className="text-ink">Supabase_Cloud</span>
          </div>
          <div className="space-y-1">
            <span className="block text-ghost">Terminal</span>
            <span className="text-ink">Next_JS_15</span>
          </div>
          <div className="space-y-1">
            <span className="block text-ghost">Status</span>
            <span className="text-ink">Ready_For_Input</span>
          </div>
        </div>
      </div>
    </main>
  );
}