import React from 'react';

export default function Aufgaben() {
  return (
    <div className="p-6 md:p-margin-desktop max-w-[1440px] mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-lg">
        <div>
          <span className="text-xs font-bold text-primary tracking-widest uppercase mb-1 block">Planer Board</span>
          <h2 className="font-headline-lg text-3xl font-extrabold text-on-surface">Aufgaben & To-Dos</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="px-5 py-2.5 rounded-2xl bg-primary text-on-primary font-bold hover:bg-primary-fixed hover:text-on-primary-container transition-all text-sm active:scale-95 shadow-sm">Alle Aufgaben</button>
          <button className="px-5 py-2.5 rounded-2xl border border-outline-variant text-on-surface-variant hover:bg-surface-container font-semibold transition-all text-sm active:scale-95 bg-white">Dringend</button>
          <button className="px-5 py-2.5 rounded-2xl border border-outline-variant text-on-surface-variant hover:bg-surface-container font-semibold transition-all text-sm active:scale-95 bg-white">Diese Woche</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter overflow-x-auto pb-8">
        
        {/* Kolumne: Korrekturen */}
        <div className="flex flex-col gap-4 min-h-[500px] bg-slate-50/50 p-4 rounded-3xl border border-slate-200">
          <div className="flex items-center justify-between px-2 mb-2">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-error"></span>
              <h3 className="font-bold text-on-surface text-base">Korrekturen</h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-on-surface">3</span>
            </div>
            <button className="text-on-surface-variant hover:bg-surface-container p-1 rounded-xl transition-colors">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white border border-outline-variant p-5 rounded-2xl hover:shadow-md transition-all cursor-grab active:cursor-grabbing sheet-shadow">
              <div className="flex items-start justify-between mb-3">
                <span className="bg-error/10 text-error text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-md">Prio 1</span>
                <span className="text-xs font-semibold text-on-surface-variant italic">Heute</span>
              </div>
              <p className="font-semibold text-on-surface mb-2 text-base leading-snug">Mathetest Klasse 9b korrigieren</p>
              <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2 mb-4">28 Arbeiten, Schwerpunkt: Lineare Gleichungssysteme.</p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-xs font-bold text-on-secondary-container border border-white">9B</div>
                <div className="flex items-center gap-1.5 text-on-surface-variant pt-1">
                  <span className="material-symbols-outlined text-[18px]">attachment</span>
                  <span className="text-xs font-bold">2</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-outline-variant p-5 rounded-2xl hover:shadow-md transition-all cursor-grab active:cursor-grabbing sheet-shadow">
              <div className="flex items-start justify-between mb-3">
                <span className="bg-primary/10 text-primary text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-md">Prio 2</span>
                <span className="text-xs font-semibold text-on-surface-variant">Fr, 14:00</span>
              </div>
              <p className="font-semibold text-on-surface mb-1 text-base leading-snug">Diktat Kl. 5a</p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-primary h-full" style={{ width: '45%' }}></div>
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-[11px] text-on-surface-variant font-bold">45% fertig</span>
                <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
              </div>
            </div>
          </div>
        </div>

        {/* Kolumne: Vorbereitung */}
        <div className="flex flex-col gap-4 min-h-[500px] bg-slate-50/50 p-4 rounded-3xl border border-slate-200">
          <div className="flex items-center justify-between px-2 mb-2">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
              <h3 className="font-bold text-on-surface text-base">Vorbereitung</h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-on-surface">2</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white border border-outline-variant p-5 rounded-2xl hover:shadow-md transition-all cursor-grab active:cursor-grabbing sheet-shadow">
              <div className="flex items-start justify-between mb-3">
                <span className="bg-tertiary-fixed text-on-tertiary-fixed text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-md">Bio</span>
                <span className="text-xs font-semibold text-on-surface-variant">Mo, 08:00</span>
              </div>
              <p className="font-semibold text-on-surface mb-2 text-base leading-snug">Stationenlernen Zellbiologie</p>
              <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">Materialien laminieren und QR-Codes drucken.</p>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">link</span>
                <span className="text-xs text-primary font-bold underline cursor-pointer truncate">Planung_Zelle_V3.pdf</span>
              </div>
            </div>
          </div>
        </div>

        {/* Kolumne: Elternarbeit */}
        <div className="flex flex-col gap-4 min-h-[500px] bg-slate-50/50 p-4 rounded-3xl border border-slate-200">
          <div className="flex items-center justify-between px-2 mb-2">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
              <h3 className="font-bold text-on-surface text-base">Elternkonf</h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-on-surface">1</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white border border-outline-variant p-5 rounded-2xl hover:shadow-md transition-all cursor-grab active:cursor-grabbing sheet-shadow relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-error"></div>
              <div className="flex items-start justify-between mb-3 pl-1">
                <span className="bg-slate-100 text-on-surface-variant text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-md">Anruf</span>
                <span className="text-xs font-bold text-error">Überfällig</span>
              </div>
              <p className="font-semibold text-on-surface mb-2 text-base leading-snug pl-1">Rückmeldung Fam. Müller</p>
              <p className="text-xs text-on-surface-variant mb-5 leading-relaxed pl-1">Wegen Klassenfahrt-Anmeldung und Allergien.</p>
              <div className="pl-1">
                <button className="w-full bg-slate-50 hover:bg-slate-100 py-2.5 rounded-xl text-xs text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center gap-2 font-bold border border-slate-200 active:scale-95">
                  <span className="material-symbols-outlined text-[18px] text-primary">call</span>
                  Jetzt anrufen
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Kolumne: Verwaltung */}
        <div className="flex flex-col gap-4 min-h-[500px] bg-slate-50/50 p-4 rounded-3xl border border-slate-200">
          <div className="flex items-center justify-between px-2 mb-2">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-outline"></span>
              <h3 className="font-bold text-on-surface text-base">Verwaltung</h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-on-surface">0</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center py-xl border-2 border-dashed border-slate-200 rounded-3xl bg-slate-100/30 h-[280px]">
            <span className="material-symbols-outlined text-3xl mb-2 text-outline">inventory_2</span>
            <p className="text-xs text-outline font-bold">Keine offenen Aufgaben</p>
          </div>
        </div>
        
      </div>
    </div>
  );
}
