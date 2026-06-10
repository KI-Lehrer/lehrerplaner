import React from 'react';

export default function Wochenuebersicht() {
  return (
    <div className="p-margin-mobile md:px-margin-desktop py-lg w-full max-w-[1440px] mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-md">
        <div>
          <span className="text-xs font-bold text-primary tracking-widest uppercase mb-1 block">Wochenplaner</span>
          <h1 className="font-display-lg text-3xl font-extrabold text-on-surface">Wochenübersicht</h1>
          <p className="font-body-md text-on-surface-variant italic mt-1 bg-primary/5 px-3 py-1 rounded-full inline-block">KW 42 • 16. Oktober – 22. Oktober 2023</p>
        </div>
        <div className="flex gap-sm">
          <button className="bg-white text-on-surface-variant px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 border border-outline-variant hover:bg-slate-50 transition-colors text-sm shadow-sm active:scale-95">
            <span className="material-symbols-outlined text-[20px] text-primary">chevron_left</span> Vorherige
          </button>
          <button className="bg-white text-on-surface-variant px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 border border-outline-variant hover:bg-slate-50 transition-colors text-sm shadow-sm active:scale-95">
            Nächste <span className="material-symbols-outlined text-[20px] text-primary">chevron_right</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-gutter items-stretch">
        
        {/* Montag */}
        <article className="bg-white border border-outline-variant rounded-3xl shadow-sm flex flex-col h-[740px] hover:border-slate-300 transition-all duration-200">
          <header className="p-5 border-b border-outline-variant bg-slate-50 rounded-t-3xl shrink-0">
            <h4 className="text-lg font-extrabold text-primary">Montag</h4>
            <span className="text-xs font-bold text-on-surface-variant mt-1 block">16. Oktober</span>
          </header>
          <div className="p-4 flex-1 flex flex-col gap-3 overflow-y-auto w-full">
            
            <div className="h-40 p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl flex flex-col justify-between shrink-0">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">08:20 - BS</span>
                <p className="font-semibold text-sm text-emerald-900 mt-1">Bewegung und Sport</p>
              </div>
              <div className="mt-auto pt-2 border-t border-emerald-200/50">
                <p className="text-[10px] italic text-emerald-700/70">Zirkeltraining vorbereitet</p>
              </div>
            </div>
            
            <div className="h-40 p-3 bg-slate-50 border-l-4 border-slate-400 rounded-r-xl flex flex-col justify-between shrink-0">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">09:10 - X</span>
                <p className="font-semibold text-sm text-on-surface mt-1">Unterricht</p>
              </div>
              <div className="mt-auto pt-2 border-t border-slate-200/50">
                <p className="text-[10px] italic text-on-surface-variant/70">Notizen...</p>
              </div>
            </div>

            <div className="h-40 p-3 bg-indigo-50 border-l-4 border-primary rounded-r-xl flex flex-col justify-between shrink-0">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">10:15 - F</span>
                <p className="font-semibold text-sm text-primary mt-1">Französisch</p>
              </div>
              <div className="mt-auto pt-2 border-t border-indigo-200/50">
                <p className="text-[10px] italic text-primary/70">Vokabeltest schreiben</p>
              </div>
            </div>

            <div className="h-40 p-3 bg-pink-50 border-l-4 border-pink-400 rounded-r-xl flex flex-col justify-between shrink-0">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-pink-700 uppercase tracking-widest">13:30 - Chor</span>
                <p className="font-semibold text-sm text-pink-900 mt-1">Chor</p>
              </div>
              <div className="mt-auto pt-2 border-t border-pink-200/50">
                <p className="text-[10px] italic text-pink-700/70">Stimmübungen</p>
              </div>
            </div>

            <textarea 
              className="w-full notebook-input border-none focus:ring-0 font-body-md text-xs italic text-on-surface-variant flex-1 min-h-[160px] resize-none outline-none mt-2 bg-transparent" 
              placeholder="Zusätzliche Notizen für Montag..."
            ></textarea>
          </div>
        </article>

        {/* Dienstag */}
        <article className="bg-white border border-outline-variant rounded-3xl shadow-sm flex flex-col h-[740px] hover:border-slate-300 transition-all duration-200">
          <header className="p-5 border-b border-outline-variant bg-slate-50 rounded-t-3xl shrink-0">
            <h4 className="text-lg font-extrabold text-primary">Dienstag</h4>
            <span className="text-xs font-bold text-on-surface-variant mt-1 block">17. Oktober</span>
          </header>
          <div className="p-5 flex-1 h-full">
            <textarea 
              className="w-full notebook-input border-none focus:ring-0 font-body-md text-sm italic text-on-surface-variant h-full resize-none outline-none bg-transparent" 
              placeholder="Notizen für Dienstag eintragen..."
            ></textarea>
          </div>
        </article>

        {/* Mittwoch */}
        <article className="bg-white border border-outline-variant rounded-3xl shadow-sm flex flex-col h-[740px] hover:border-slate-300 transition-all duration-200">
          <header className="p-5 border-b border-outline-variant bg-slate-50 rounded-t-3xl shrink-0">
            <h4 className="text-lg font-extrabold text-primary">Mittwoch</h4>
            <span className="text-xs font-bold text-on-surface-variant mt-1 block">18. Oktober</span>
          </header>
          <div className="p-5 flex-1 h-full">
            <textarea 
              className="w-full notebook-input border-none focus:ring-0 font-body-md text-sm italic text-on-surface-variant h-full resize-none outline-none bg-transparent" 
              placeholder="Wichtigste Themen heute..."
            ></textarea>
          </div>
        </article>

        {/* Donnerstag */}
        <article className="bg-white border border-outline-variant rounded-3xl shadow-sm flex flex-col h-[740px] hover:border-slate-300 transition-all duration-200">
          <header className="p-5 border-b border-outline-variant bg-slate-50 rounded-t-3xl shrink-0">
            <h4 className="text-lg font-extrabold text-primary">Donnerstag</h4>
            <span className="text-xs font-bold text-on-surface-variant mt-1 block">19. Oktober</span>
          </header>
          <div className="p-5 flex-1 h-full">
            <textarea 
              className="w-full notebook-input border-none focus:ring-0 font-body-md text-sm italic text-on-surface-variant h-full resize-none outline-none bg-transparent" 
              placeholder="Notizen für Donnerstag eintragen..."
            ></textarea>
          </div>
        </article>

        {/* Freitag */}
        <article className="bg-white border border-outline-variant rounded-3xl shadow-sm flex flex-col h-[740px] hover:border-slate-300 transition-all duration-200">
          <header className="p-5 border-b border-outline-variant bg-slate-50 rounded-t-3xl shrink-0">
            <h4 className="text-lg font-extrabold text-primary">Freitag</h4>
            <span className="text-xs font-bold text-on-surface-variant mt-1 block">20. Oktober</span>
          </header>
          <div className="p-5 flex-1 h-full">
            <textarea 
              className="w-full notebook-input border-none focus:ring-0 font-body-md text-sm italic text-on-surface-variant h-full resize-none outline-none bg-transparent" 
              placeholder="Wochenabschluss & Reflexion..."
            ></textarea>
          </div>
        </article>
        
      </div>
    </div>
  );
}
