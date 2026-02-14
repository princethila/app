"use client";

export default function ExtractionReport({ data }: { data: any }) {
  if (!data) return <div className="p-8 italic text-ghost">LOADING_EXTRACTION_DATA...</div>;

  return (
    <aside className="w-1/3 border-l border-ink !bg-surface flex flex-col h-full overflow-hidden">
      {/* Report Header */}
      <div className="p-4 border-b border-ink bg-paper flex justify-between items-center">
        <span className="font-bold">EXTRACTION_REPORT // ID: {data.case_number || "PENDING"}</span>
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-ink rounded-full animate-pulse"></div>
          <span className="text-[9px]">LIVE_VALIDATION</span>
        </div>
      </div>

      {/* Scrollable Report Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
        
        {/* 1. TOP_LEVEL_META */}
        <section className="grid grid-cols-2 gap-px bg-ink border border-ink">
          <MetaBox label="JUDGEMENT_DATE" value={data.date || "NULL"} />
          <MetaBox label="CITATION" value={data.case_number || "NULL"} />
        </section>

        {/* 2. EXTRACTED_SECTIONS (Facts, Issues, etc.) */}
        <section className="space-y-4 pb-20">
          <h3 className="text-[10px] font-black border-b border-ink pb-1">02_FIPAC_SUMMARY</h3>
          {Object.entries(data.sections || {}).map(([key, value]) => (
            <ContentBlock key={key} title={key} text={value as string} />
          ))}
        </section>

        {/* 3. LEGAL_ENTITIES (Coram & Parties) */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black border-b border-ink pb-1">03_LEGAL_ENTITIES</h3>
          
          <div className="border border-ink p-3 space-y-4">
            <EntityGroup label="CORAM / JUDGES" items={data.coram} />
            <div className="h-px bg-ink/10" />
            <EntityGroup label="APPLICANTS" items={data.parties?.applicants} />
            <div className="h-px bg-ink/10" />
            <EntityGroup label="RESPONDENTS" items={data.parties?.respondents} />
          </div>
        </section>

        {/* 4. TAXONOMY_MAPPING (Tags) */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black border-b border-ink pb-1">04_TAXONOMY_MAPPING</h3>
          <div className="border border-ink p-3 bg-paper/50 space-y-3">
             <div className="flex justify-between">
                <span className="text-ghost text-[9px]">LVL_1:</span>
                <span className="font-bold">{data.tags?.level_1}</span>
             </div>
             <div className="flex justify-between border-t border-ink/10 pt-2">
                <span className="text-ghost text-[9px]">LVL_2:</span>
                <span className="font-bold">{data.tags?.level_2}</span>
             </div>
             <div className="flex flex-wrap gap-2 pt-2">
                {data.tags?.level_3?.map((tag: string, i: number) => (
                  <span key={i} className="text-[8px] border border-ink px-2 py-0.5 bg-white">#{tag}</span>
                ))}
             </div>
          </div>
        </section>

        
      </div>
    </aside>
  );
}

/* --- SUB-COMPONENTS FOR CLEANER CODE --- */

function MetaBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface p-3">
      <span className="block text-[8px] text-ghost mb-1">{label}</span>
      <span className="text-[11px] font-bold truncate">{value}</span>
    </div>
  );
}

function EntityGroup({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <span className="block text-[8px] text-ghost mb-2">{label}</span>
      {items && items.length > 0 ? (
        <ul className="space-y-1">
          {items.map((item, i) => (
            <li key={i} className="text-[10px] flex items-center gap-2">
              <span className="w-1 h-1 bg-ink" /> {item}
            </li>
          ))}
        </ul>
      ) : (
        <span className="text-[10px] italic text-ghost/50">NO_DATA_EXTRACTED</span>
      )}
    </div>
  );
}

function ContentBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="border border-ink group">
      <div className="bg-ink text-paper text-[9px] px-2 py-1 flex justify-between items-center">
        <span>SECTION_{title.toUpperCase()}</span>
        <span className="opacity-0 group-hover:opacity-100 cursor-pointer underline">FLAG_ERROR</span>
      </div>
      <div className="p-3 text-[11px] normal-case font-sans leading-relaxed bg-white h-32 overflow-y-auto custom-scrollbar">
        {text}
      </div>
    </div>
  );
}