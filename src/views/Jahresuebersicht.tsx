import React from 'react';

export default function Jahresuebersicht() {
  return (
    <div className="p-md md:p-margin-desktop max-w-[1440px] mx-auto space-y-lg w-full">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-2">
        <div>
          <span className="text-xs font-bold text-primary tracking-widest uppercase mb-1 block">Kalender</span>
          <h1 className="font-display-lg text-3xl font-extrabold text-on-surface">Jahresübersicht 2023/24</h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">Ein Überblick über das gesamte Schuljahr, Ferien und Prüfungstermine.</p>
        </div>
      </header>

      <section className="flex flex-wrap gap-md py-4 border-y border-outline-variant mb-6">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-md bg-emerald-500"></span>
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Ferien</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-md bg-amber-500"></span>
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Prüfungen</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-md bg-primary"></span>
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Konferenzen</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-md bg-rose-500"></span>
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Feiertage</span>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-md">
        {/* August 2023 */}
        <article className="bg-white border border-outline-variant p-6 rounded-3xl shadow-sm hover:border-slate-300 transition-all duration-200">
          <header className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-primary text-base">August 2023</h3>
            <span className="material-symbols-outlined text-outline cursor-pointer hover:bg-slate-100 p-1 rounded-xl transition-all">more_vert</span>
          </header>
          <div className="grid grid-cols-7 gap-1 mb-2">
            <div className="text-center text-[11px] font-bold text-on-surface-variant py-1">M</div>
            <div className="text-center text-[11px] font-bold text-on-surface-variant py-1">D</div>
            <div className="text-center text-[11px] font-bold text-on-surface-variant py-1">M</div>
            <div className="text-center text-[11px] font-bold text-on-surface-variant py-1">D</div>
            <div className="text-center text-[11px] font-bold text-on-surface-variant py-1">F</div>
            <div className="text-center text-[11px] font-bold text-error py-1">S</div>
            <div className="text-center text-[11px] font-bold text-error py-1">S</div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-xs">
            <div className="py-1"></div>
            <div className="py-1 text-center text-on-surface-variant font-medium">1</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">2</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">3</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">4</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">5</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">6</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">7</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">8</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">9</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">10</div>
            <div className="py-1 text-center text-emerald-800 bg-emerald-50 rounded-lg font-bold transition-transform hover:scale-110 cursor-pointer">11</div>
            <div className="py-1 text-center text-emerald-800 bg-emerald-50 rounded-lg font-bold transition-transform hover:scale-110 cursor-pointer">12</div>
            <div className="py-1 text-center text-emerald-800 bg-emerald-50 rounded-lg font-bold transition-transform hover:scale-110 cursor-pointer">13</div>
            <div className="py-1 text-center text-emerald-800 bg-emerald-50 rounded-lg font-bold transition-transform hover:scale-110 cursor-pointer">14</div>
            <div className="py-1 text-center text-emerald-800 bg-emerald-50 rounded-lg font-bold transition-transform hover:scale-110 cursor-pointer">15</div>
            <div className="py-1 text-center text-emerald-800 bg-emerald-50 rounded-lg font-bold transition-transform hover:scale-110 cursor-pointer">16</div>
            <div className="py-1 text-center text-emerald-800 bg-emerald-50 rounded-lg font-bold transition-transform hover:scale-110 cursor-pointer">17</div>
            <div className="py-1 text-center text-emerald-800 bg-emerald-50 rounded-lg font-bold transition-transform hover:scale-110 cursor-pointer">18</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">19</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">20</div>
            <div className="py-1 text-center font-extrabold text-primary bg-primary/10 rounded-lg relative">
              21<span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full"></span>
            </div>
            <div className="py-1 text-center text-on-surface-variant font-medium">22</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">23</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">24</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">25</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">26</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">27</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">28</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">29</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">30</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">31</div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-xs">
              <span className="w-2 h-2 rounded bg-emerald-500"></span>
              <p className="text-[11px] font-semibold text-on-surface-variant">11.-18. Sommerferien Ende</p>
            </div>
            <div className="flex items-center gap-xs">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <p className="text-[11px] font-semibold text-on-surface-variant">21. Schuljahresbeginn</p>
            </div>
          </div>
        </article>

        {/* Oktober 2023 */}
        <article className="bg-white border border-outline-variant p-6 rounded-3xl shadow-sm hover:border-slate-300 transition-all duration-200">
          <header className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-primary text-base">Oktober 2023</h3>
            <span className="material-symbols-outlined text-outline cursor-pointer hover:bg-slate-100 p-1 rounded-xl transition-all">more_vert</span>
          </header>
          <div className="grid grid-cols-7 gap-1 mb-2">
            <div className="text-center text-[11px] font-bold text-on-surface-variant py-1">M</div>
            <div className="text-center text-[11px] font-bold text-on-surface-variant py-1">D</div>
            <div className="text-center text-[11px] font-bold text-on-surface-variant py-1">M</div>
            <div className="text-center text-[11px] font-bold text-on-surface-variant py-1">D</div>
            <div className="text-center text-[11px] font-bold text-on-surface-variant py-1">F</div>
            <div className="text-center text-[11px] font-bold text-error py-1">S</div>
            <div className="text-center text-[11px] font-bold text-error py-1">S</div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-xs">
            <div className="py-1"></div><div className="py-1"></div><div className="py-1"></div><div className="py-1"></div><div className="py-1"></div><div className="py-1"></div>
            <div className="py-1 text-center text-on-surface-variant font-medium">1</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">2</div>
            <div className="py-1 text-center font-extrabold text-[#991b1b] bg-rose-50 rounded-lg">3</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">4</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">5</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">6</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">7</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">8</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">9</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">10</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">11</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">12</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">13</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">14</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">15</div>
            <div className="py-1 text-center text-emerald-800 bg-emerald-50 rounded-lg font-bold">16</div>
            <div className="py-1 text-center text-emerald-800 bg-emerald-50 rounded-lg font-bold">17</div>
            <div className="py-1 text-center text-emerald-800 bg-emerald-50 rounded-lg font-bold">18</div>
            <div className="py-1 text-center text-emerald-800 bg-emerald-50 rounded-lg font-bold">19</div>
            <div className="py-1 text-center text-emerald-800 bg-emerald-50 rounded-lg font-bold">20</div>
            <div className="py-1 text-center text-emerald-800 bg-emerald-50 rounded-lg font-bold">21</div>
            <div className="py-1 text-center text-emerald-800 bg-emerald-50 rounded-lg font-bold">22</div>
            <div className="py-1 text-center text-emerald-800 bg-emerald-50 rounded-lg font-bold">23</div>
            <div className="py-1 text-center text-emerald-800 bg-emerald-50 rounded-lg font-bold">24</div>
            <div className="py-1 text-center text-emerald-800 bg-emerald-50 rounded-lg font-bold">25</div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-xs">
              <span className="w-2 h-2 rounded bg-rose-500"></span>
              <p className="text-[11px] font-semibold text-on-surface-variant">3. Tag der dt. Einheit</p>
            </div>
            <div className="flex items-center gap-xs">
              <span className="w-2 h-2 rounded bg-emerald-500"></span>
              <p className="text-[11px] font-semibold text-on-surface-variant">16.-27. Herbstferien</p>
            </div>
          </div>
        </article>

        {/* Dezember 2023 */}
        <article className="bg-white border border-outline-variant p-6 rounded-3xl shadow-sm hover:border-slate-300 transition-all duration-200">
          <header className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-primary text-base">Dezember 2023</h3>
            <span className="material-symbols-outlined text-outline cursor-pointer hover:bg-slate-100 p-1 rounded-xl transition-all">more_vert</span>
          </header>
          <div className="grid grid-cols-7 gap-1 mb-2">
            <div className="text-center text-[11px] font-bold text-on-surface-variant py-1">M</div>
            <div className="text-center text-[11px] font-bold text-on-surface-variant py-1">D</div>
            <div className="text-center text-[11px] font-bold text-on-surface-variant py-1">M</div>
            <div className="text-center text-[11px] font-bold text-on-surface-variant py-1">D</div>
            <div className="text-center text-[11px] font-bold text-on-surface-variant py-1">F</div>
            <div className="text-center text-[11px] font-bold text-error py-1">S</div>
            <div className="text-center text-[11px] font-bold text-error py-1">S</div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-xs">
            <div className="py-1"></div><div className="py-1"></div><div className="py-1"></div><div className="py-1"></div>
            <div className="py-1 text-center font-medium text-on-surface-variant">1</div>
            <div className="py-1 text-center font-medium text-on-surface-variant">2</div>
            <div className="py-1 text-center font-medium text-on-surface-variant">3</div>
            <div className="py-1 text-center font-medium text-on-surface-variant">4</div>
            <div className="py-1 text-center font-medium text-on-surface-variant">5</div>
            <div className="py-1 text-center font-medium text-on-surface-variant">6</div>
            <div className="py-1 text-center font-medium text-on-surface-variant">7</div>
            <div className="py-1 text-center font-medium text-on-surface-variant">8</div>
            <div className="py-1 text-center font-medium text-on-surface-variant">9</div>
            <div className="py-1 text-center font-medium text-on-surface-variant">10</div>
            <div className="py-1 text-center font-medium text-on-surface-variant">11</div>
            <div className="py-1 text-center font-medium text-on-surface-variant">12</div>
            <div className="py-1 text-center font-medium text-on-surface-variant">13</div>
            <div className="py-1 text-center font-medium text-on-surface-variant">14</div>
            <div className="py-1 text-center font-medium text-on-surface-variant">15</div>
            <div className="py-1 text-center font-medium text-on-surface-variant">16</div>
            <div className="py-1 text-center font-medium text-on-surface-variant">17</div>
            <div className="py-1 text-center font-medium text-on-surface-variant">18</div>
            <div className="py-1 text-center font-medium text-on-surface-variant">19</div>
            <div className="py-1 text-center font-medium text-on-surface-variant">20</div>
            <div className="py-1 text-center text-emerald-800 bg-emerald-50 rounded-lg font-bold">21</div>
            <div className="py-1 text-center text-emerald-800 bg-emerald-50 rounded-lg font-bold">22</div>
            <div className="py-1 text-center text-emerald-800 bg-emerald-50 rounded-lg font-bold">23</div>
            <div className="py-1 text-center text-emerald-800 bg-emerald-50 rounded-lg font-bold">24</div>
            <div className="py-1 text-center font-bold text-[#991b1b] bg-rose-50 rounded-lg">25</div>
            <div className="py-1 text-center font-bold text-[#991b1b] bg-rose-50 rounded-lg">26</div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-xs">
               <span className="w-2 h-2 rounded bg-emerald-500"></span>
              <p className="text-[11px] font-semibold text-on-surface-variant">21.-31. Weihnachtsferien</p>
            </div>
            <div className="flex items-center gap-xs">
              <span className="w-2 h-2 rounded bg-rose-500"></span>
              <p className="text-[11px] font-semibold text-on-surface-variant">25. & 26. Weihnachten</p>
            </div>
          </div>
        </article>

        {/* Januar 2024 */}
        <article className="bg-white border border-outline-variant p-6 rounded-3xl shadow-sm hover:border-slate-300 transition-all duration-200">
          <header className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-primary text-base">Januar 2024</h3>
            <span className="material-symbols-outlined text-outline cursor-pointer hover:bg-slate-100 p-1 rounded-xl transition-all">more_vert</span>
          </header>
          <div className="grid grid-cols-7 gap-1 mb-2">
            <div className="text-center text-[11px] font-bold text-on-surface-variant py-1">M</div>
            <div className="text-center text-[11px] font-bold text-on-surface-variant py-1">D</div>
            <div className="text-center text-[11px] font-bold text-on-surface-variant py-1">M</div>
            <div className="text-center text-[11px] font-bold text-on-surface-variant py-1">D</div>
            <div className="text-center text-[11px] font-bold text-on-surface-variant py-1">F</div>
            <div className="text-center text-[11px] font-bold text-error py-1">S</div>
            <div className="text-center text-[11px] font-bold text-error py-1">S</div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-xs">
            <div className="py-1 text-center font-bold text-[#991b1b] bg-rose-50 rounded-lg">1</div>
            <div className="py-1 text-center text-emerald-800 bg-emerald-50 rounded-lg font-bold">2</div>
            <div className="py-1 text-center text-emerald-800 bg-emerald-50 rounded-lg font-bold">3</div>
            <div className="py-1 text-center text-emerald-800 bg-emerald-50 rounded-lg font-bold">4</div>
            <div className="py-1 text-center text-emerald-800 bg-emerald-50 rounded-lg font-bold">5</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">6</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">7</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">8</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">9</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">10</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">11</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">12</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">13</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">14</div>
            <div className="py-1 text-center bg-primary text-white rounded-lg font-extrabold flex items-center justify-center">15</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">16</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">17</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">18</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">19</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">20</div>
            <div className="py-1 text-center text-on-surface-variant font-medium">21</div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-xs">
              <span className="w-2 h-2 rounded bg-rose-500"></span>
              <p className="text-[11px] font-semibold text-on-surface-variant">1. Neujahr</p>
            </div>
            <div className="flex items-center gap-xs">
              <span className="w-2 h-2 rounded bg-primary"></span>
              <p className="text-[11px] font-semibold text-on-surface-variant">15. Notenschluss</p>
            </div>
          </div>
        </article>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-md mt-6">
        <div className="md:col-span-2 bg-[#f8fafc] border border-outline-variant rounded-3xl p-6 flex flex-col gap-4">
          <h3 className="font-extrabold text-primary text-base">Wichtige Prüfungstermine</h3>
          <div className="space-y-sm">
            <div className="flex items-center justify-between p-4 bg-white border border-outline-variant rounded-2xl hover:border-primary transition-all cursor-pointer shadow-sm active:scale-99">
              <div className="flex items-center gap-md">
                <div className="w-14 h-14 flex flex-col items-center justify-center bg-amber-500 rounded-2xl text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Mai</span>
                  <span className="font-bold text-lg leading-none mt-1">12</span>
                </div>
                <div>
                  <p className="font-bold text-sm text-on-surface">Abitur Mathematik</p>
                  <p className="text-xs text-on-surface-variant mt-1 font-medium">Schriftliche Prüfung, 09:00 Uhr</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline">chevron_right</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white border border-outline-variant rounded-2xl hover:border-primary transition-all cursor-pointer shadow-sm active:scale-99">
              <div className="flex items-center gap-md">
                <div className="w-14 h-14 flex flex-col items-center justify-center bg-amber-500 rounded-2xl text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Jun</span>
                  <span className="font-bold text-lg leading-none mt-1">04</span>
                </div>
                <div>
                  <p className="font-bold text-sm text-on-surface">Mündliche Prüfungen</p>
                  <p className="text-xs text-on-surface-variant mt-1 font-medium">Prüfungsphase 10. Klasse</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline">chevron_right</span>
            </div>
          </div>
        </div>

        <div className="bg-primary text-on-primary rounded-3xl p-6 flex flex-col relative overflow-hidden h-full">
          <div className="z-10 flex-1">
            <h3 className="text-base font-extrabold mb-1">Statistik Schuljahr</h3>
            <div className="space-y-6 mt-6">
              <div>
                <div className="flex justify-between text-xs mb-2 font-bold">
                  <span className="tracking-wide">Unterrichtstage</span>
                  <span>145 / 180</span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-white/80 h-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2 font-bold">
                  <span className="tracking-wide">Projekte abgeschlossen</span>
                  <span>12 / 15</span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-white/80 h-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
