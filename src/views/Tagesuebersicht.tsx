import React from 'react';

export default function Tagesuebersicht() {
  return (
    <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-lg w-full">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-md">
        <div>
          <span className="font-label-md text-xs font-extrabold text-primary bg-primary/10 px-3 py-1.5 rounded-full mb-2 inline-block">Heutige Übersicht</span>
          <h1 className="font-display-lg text-4xl font-extrabold text-on-surface mt-1 mb-1">Dienstag, 10. Juni 2026</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Schultag 112 • Lehrperson Sascha Lüscher • Klasse 6B</p>
        </div>
        <div className="flex gap-sm w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-2.5 border border-primary text-primary rounded-2xl font-bold bg-white hover:bg-primary/5 transition-all text-sm active:scale-95 shadow-sm">Exportieren</button>
          <button className="flex-1 md:flex-none px-6 py-2.5 bg-primary text-on-primary rounded-2xl font-bold hover:bg-primary-fixed hover:text-on-primary-container transition-all text-sm active:scale-95 shadow-md">Speichern</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        
        {/* Left Side Bento Column */}
        <div className="md:col-span-4 flex flex-col gap-gutter">
          
          {/* Important appointments */}
          <section className="bg-white border border-outline-variant rounded-3xl p-6 shadow-sm hover:border-slate-300 transition-colors">
            <h3 className="font-title-md text-title-md text-on-surface mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">priority_high</span>
              Wichtige Termine
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-4 items-start">
                <div className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1.5 rounded-xl font-bold text-xs font-mono">07:00</div>
                <div>
                  <p className="font-label-md text-sm font-semibold text-on-surface">Krankheits-Abmeldungen</p>
                  <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">notifications</span> Limit für Suhr Eltern
                  </p>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-xl font-bold text-xs font-mono">11:50</div>
                <div>
                  <p className="font-label-md text-sm font-semibold text-on-surface">Pool-Stunden Absprache</p>
                  <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">groups</span> Team-Besprechung
                  </p>
                </div>
              </li>
            </ul>
          </section>

          {/* Quick Notes Grid-Box */}
          <section className="bg-white border border-outline-variant rounded-3xl p-6 shadow-sm hover:border-slate-300 transition-colors">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-title-md text-title-md text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary">edit_note</span>
                Quick-Notes
              </h3>
              <span className="text-[10px] uppercase font-bold text-outline">Entwurf</span>
            </div>
            <textarea 
              className="w-full min-h-[140px] p-2 font-body-md text-sm text-on-surface-variant border-none bg-transparent focus:ring-0 resize-none outline-none notebook-input" 
              placeholder="Was gibt es heute sonst noch zu beachten? Notizen hier eintragen..."
            ></textarea>
          </section>

          {/* Quote / Visual Card */}
          <div className="relative overflow-hidden rounded-3xl h-48 group cursor-pointer shadow-md">
            <img 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              alt="Workspace"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5jjcctsxIq0XCEAwnyRN8EP3_vCjFFx6vNElCltjOOBKdTKdFwW6OFBZy6dGtQX8ZeNDoh22R-WOu5sWnrv2FX8a87EDvompQA_F32FCVqQ8mF2z8FrElTILwKuw-FnIYw3fDOfJTFPhkOakhxjfJoc7cjV9bH5Xz-OAEpWvUzEFPlHQq19sdLCQeWcHtYroGiYZmStoZt5MIbUYn7B8SifuR3ILTRYQY4UxeAHjkQzmWJRcYDqAAWIV3rLsY5ttrTPd93B2CIA"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent flex items-end p-6">
              <p className="text-white font-medium text-sm italic leading-relaxed">"Bildung ist der Pass für die Zukunft, denn das Morgen gehört denen, die sich heute darauf vorbereiten."</p>
            </div>
          </div>
        </div>

        {/* Right Side Bento Column: Active interactive Lessons */}
        <div className="md:col-span-8 flex flex-col gap-gutter">
          
          {/* Hour 1 */}
          <article className="bg-white border border-outline-variant rounded-3xl overflow-hidden shadow-sm hover:border-slate-300 transition-all duration-200">
            <header className="bg-primary/5 px-6 py-4 flex justify-between items-center border-b border-outline-variant/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold font-mono">1</div>
                <span className="font-label-md text-sm font-bold uppercase tracking-wider text-primary ml-2">Französisch — Klasse 6B (Gruppe A)</span>
              </div>
              <span className="px-3 py-1 bg-white border border-outline-variant rounded-full text-xs font-bold text-on-surface">07:30 - 08:15</span>
            </header>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Thema der Stunde</label>
                  <input className="w-full py-2 bg-transparent text-on-surface font-semibold text-sm border-b border-outline-variant focus:border-primary border-t-0 border-l-0 border-r-0 focus:ring-0 transition-colors outline-none" type="text" defaultValue="Introduction: Vocabulaire Unité 2" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 mt-2">Lehrperson & Raum</label>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-semibold text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-primary">person</span> Romane Segal
                    </span>
                    <span className="bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-semibold text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-primary">room</span> Zimmer 104
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Hausaufgaben</label>
                  <input className="w-full py-2 bg-transparent text-on-surface text-sm border-b border-outline-variant focus:border-primary border-t-0 border-l-0 border-r-0 focus:ring-0 transition-colors outline-none" type="text" defaultValue="Vocabulaire page 12-14 ins Heft übertragen" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 mt-2">Mitzubringen</label>
                  <textarea className="w-full py-2 min-h-[70px] text-sm border-b border-outline-variant focus:border-primary border-t-0 border-l-0 border-r-0 bg-transparent focus:ring-0 transition-colors resize-none outline-none" defaultValue="Dis donc! Kursbuch, Voci-Heft, Farbstifte."></textarea>
                </div>
              </div>
            </div>
          </article>

          {/* Hour 2 */}
          <article className="bg-white border border-outline-variant rounded-3xl overflow-hidden shadow-sm hover:border-slate-300 transition-all duration-200">
            <header className="bg-tertiary-fixed/40 px-6 py-4 flex justify-between items-center border-b border-outline-variant/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center text-white text-xs font-bold font-mono">2</div>
                <span className="font-label-md text-sm font-bold uppercase tracking-wider text-tertiary ml-2">Regelunterricht (X) — Klasse 6B</span>
              </div>
              <span className="px-3 py-1 bg-white border border-outline-variant rounded-full text-xs font-bold text-on-surface">08:20 - 09:05</span>
            </header>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Thema der Stunde</label>
                  <input className="w-full py-2 bg-transparent text-on-surface font-semibold text-sm border-b border-outline-variant focus:border-primary border-t-0 border-l-0 border-r-0 focus:ring-0 transition-colors outline-none" type="text" defaultValue="Geometrie: Winkelberechnungen an Dreiecken" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 mt-2">Lehrperson & Raum</label>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-semibold text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-tertiary">person</span> Sascha Lüscher
                    </span>
                    <span className="bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-semibold text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-tertiary">room</span> Zimmer 6B
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Hausaufgaben</label>
                  <input className="w-full py-2 bg-transparent text-on-surface text-sm border-b border-outline-variant focus:border-primary border-t-0 border-l-0 border-r-0 focus:ring-0 transition-colors outline-none" type="text" defaultValue="Arbeitsblatt 14: Winkel berechnen" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 mt-2">Notizen / Reflexion</label>
                  <textarea className="w-full py-2 min-h-[70px] text-sm border-b border-outline-variant focus:border-primary border-t-0 border-l-0 border-r-0 bg-transparent focus:ring-0 transition-colors resize-none outline-none" placeholder="Wie lief die Charaktererschließung? Lernerfolge eintragen..."></textarea>
                </div>
              </div>
            </div>
          </article>

        </div>
      </div>
    </div>
  );
}
