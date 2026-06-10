import React, { useState, useRef, useEffect } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { CalendarEvent } from '../types';

export default function Jahresuebersicht() {
  const { schoolInfo, calendarEvents, setCalendarEvent } = usePlanner();

  // Parse school year
  const parts = schoolInfo.year.split('/');
  const startYear = parts[0] ? parseInt(parts[0].trim()) : 2026;
  const endYear = parts[1] ? parseInt(parts[1].trim()) : startYear + 1;

  // Month sequence of school year: Aug, Sep, Oct, Nov, Dec (startYear) -> Jan, Feb, Mar, Apr, May, Jun, Jul (endYear)
  const schoolMonths = [
    { name: 'August', index: 7, year: startYear },
    { name: 'September', index: 8, year: startYear },
    { name: 'Oktober', index: 9, year: startYear },
    { name: 'November', index: 10, year: startYear },
    { name: 'Dezember', index: 11, year: startYear },
    { name: 'Januar', index: 0, year: endYear },
    { name: 'Februar', index: 1, year: endYear },
    { name: 'März', index: 2, year: endYear },
    { name: 'April', index: 3, year: endYear },
    { name: 'Mai', index: 4, year: endYear },
    { name: 'Juni', index: 5, year: endYear },
    { name: 'Juli', index: 6, year: endYear }
  ];

  // Helper to format ISO Date string YYYY-MM-DD local
  const toISODateStr = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper to generate calendar days
  const getDaysInMonth = (year: number, monthIndex: number) => {
    const date = new Date(year, monthIndex, 1);
    const days: (Date | null)[] = [];
    
    // Day of week (0 = Sun, 1 = Mon, ..., 6 = Sat)
    // Convert to 1 = Mon, ..., 7 = Sun
    let startDay = date.getDay();
    if (startDay === 0) startDay = 7;
    
    // Fill lead-in days
    for (let i = 1; i < startDay; i++) {
      days.push(null);
    }
    
    const totalDays = new Date(year, monthIndex + 1, 0).getDate();
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, monthIndex, i));
    }
    
    return days;
  };

  // Edit Event state
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [formType, setFormType] = useState<CalendarEvent['type'] | 'none'>('none');
  const [formText, setFormText] = useState('');

  const dialogRef = useRef<HTMLDialogElement>(null);

  // Open modal
  const handleDayClick = (date: Date) => {
    const dateStr = toISODateStr(date);
    setSelectedDateStr(dateStr);
    
    const existing = calendarEvents.find(e => e.date === dateStr);
    if (existing) {
      setFormType(existing.type);
      setFormText(existing.text);
    } else {
      setFormType('none');
      setFormText('');
    }
  };

  useEffect(() => {
    if (selectedDateStr && dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, [selectedDateStr]);

  const closeDialog = () => {
    if (dialogRef.current) dialogRef.current.close();
    setSelectedDateStr(null);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDateStr) {
      if (formType === 'none') {
        setCalendarEvent(selectedDateStr, null, '');
      } else {
        setCalendarEvent(selectedDateStr, formType, formText.trim() || 'Termin');
      }
      closeDialog();
    }
  };

  // Click outside listener for fallback (guidelines)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (event.target === dialog) {
        const rect = dialog.getBoundingClientRect();
        const isDialogContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        if (!isDialogContent) {
          dialog.close();
          setSelectedDateStr(null);
        }
      }
    };

    dialog.addEventListener('click', handleClickOutside);
    return () => dialog.removeEventListener('click', handleClickOutside);
  }, [selectedDateStr]);

  // Style mapping for event types
  const getEventClass = (type?: string) => {
    switch (type) {
      case 'ferien': return 'bg-emerald-500 text-white font-extrabold rounded-lg hover:scale-110 cursor-pointer transition-transform';
      case 'pruefung': return 'bg-amber-500 text-white font-extrabold rounded-lg hover:scale-110 cursor-pointer transition-transform';
      case 'konferenz': return 'bg-primary text-white font-extrabold rounded-lg hover:scale-110 cursor-pointer transition-transform';
      case 'feiertag': return 'bg-rose-500 text-white font-extrabold rounded-lg hover:scale-110 cursor-pointer transition-transform';
      default: return 'text-on-surface-variant hover:bg-slate-100 rounded-lg cursor-pointer transition-all hover:scale-110';
    }
  };

  // List of exams
  const examEvents = calendarEvents
    .filter(e => e.type === 'pruefung')
    .sort((a, b) => a.date.localeCompare(b.date));

  // Compute school stats
  const totalHolidays = calendarEvents.filter(e => e.type === 'ferien').length;
  const totalExams = examEvents.length;
  const totalConferences = calendarEvents.filter(e => e.type === 'konferenz').length;

  return (
    <div className="p-md md:p-margin-desktop max-w-[1440px] mx-auto space-y-lg w-full">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-2">
        <div>
          <span className="text-xs font-bold text-primary tracking-widest uppercase mb-1 block">Schulkalender</span>
          <h1 className="font-display-lg text-3xl font-extrabold text-on-surface">Jahresübersicht {schoolInfo.year}</h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Klicke auf einen Tag im Kalender, um Ferien, Prüfungstermine, Konferenzen oder Feiertage einzutragen.
          </p>
        </div>
      </header>

      {/* Legend */}
      <section className="flex flex-wrap gap-md py-4 border-y border-outline-variant mb-6">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-md bg-emerald-500"></span>
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Ferien ({totalHolidays} Tage)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-md bg-amber-500"></span>
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Prüfungen ({totalExams})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-md bg-primary"></span>
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Konferenzen ({totalConferences})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-md bg-rose-500"></span>
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Feiertage</span>
        </div>
      </section>

      {/* Months Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-md">
        {schoolMonths.map((m) => {
          const days = getDaysInMonth(m.year, m.index);
          return (
            <article key={`${m.name}-${m.year}`} className="bg-white border border-outline-variant p-5 rounded-3xl shadow-sm hover:border-slate-300 transition-all duration-200">
              <header className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-primary text-sm">{m.name} {m.year}</h3>
              </header>
              
              {/* Day abbreviations */}
              <div className="grid grid-cols-7 gap-1 mb-1.5 text-center">
                {['M', 'D', 'M', 'D', 'F', 'S', 'S'].map((d, idx) => (
                  <div key={idx} className={`text-[10px] font-bold py-0.5 ${idx >= 5 ? 'text-error/70' : 'text-slate-400'}`}>{d}</div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1 text-xs text-center font-medium">
                {days.map((day, idx) => {
                  if (day === null) {
                    return <div key={`empty-${idx}`} className="py-1"></div>;
                  }

                  const dateStr = toISODateStr(day);
                  const event = calendarEvents.find(e => e.date === dateStr);
                  const isSunOrSat = day.getDay() === 0 || day.getDay() === 6;

                  return (
                    <div
                      key={dateStr}
                      onClick={() => handleDayClick(day)}
                      className={`py-1 flex items-center justify-center font-bold relative min-h-[26px] ${getEventClass(event?.type)} ${isSunOrSat && !event ? 'text-error bg-slate-50/50 rounded-lg' : ''}`}
                      title={event ? `${event.text} (${event.type})` : dateStr}
                    >
                      {day.getDate()}
                      {event && (
                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
                      )}
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>

      {/* Dynamic stats & upcoming exams */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-md mt-6">
        {/* Upcoming exams */}
        <div className="md:col-span-2 bg-[#f8fafc] border border-outline-variant rounded-3xl p-6 flex flex-col gap-4">
          <h3 className="font-extrabold text-primary text-base">Eingetragene Prüfungstermine</h3>
          <div className="space-y-sm max-h-[280px] overflow-y-auto pr-1">
            {examEvents.map((e) => {
              const d = new Date(e.date);
              const mName = d.toLocaleString('de-CH', { month: 'short' });
              return (
                <div 
                  key={e.date} 
                  onClick={() => handleDayClick(d)}
                  className="flex items-center justify-between p-4 bg-white border border-outline-variant rounded-2xl hover:border-primary transition-all cursor-pointer shadow-sm active:scale-99"
                >
                  <div className="flex items-center gap-md">
                    <div className="w-12 h-12 flex flex-col items-center justify-center bg-amber-500 rounded-xl text-white">
                      <span className="text-[9px] font-bold uppercase tracking-wider">{mName}</span>
                      <span className="font-bold text-base leading-none mt-0.5">{d.getDate()}</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-on-surface">{e.text}</p>
                      <p className="text-[10px] text-on-surface-variant mt-1 font-semibold">{e.date}</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline">edit</span>
                </div>
              );
            })}
            {examEvents.length === 0 && (
              <p className="text-xs text-on-surface-variant italic py-6 text-center">Keine Prüfungstermine eingetragen.</p>
            )}
          </div>
        </div>

        {/* Calendar stats */}
        <div className="bg-primary text-on-primary rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden min-h-[200px]">
          <div className="z-10 flex-1">
            <h3 className="text-base font-extrabold mb-1">Jahresstatistik</h3>
            <div className="space-y-6 mt-6">
              <div>
                <div className="flex justify-between text-xs mb-2 font-bold">
                  <span className="tracking-wide">Ferientage eingetragen</span>
                  <span>{totalHolidays} Tage</span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-white/80 h-full" style={{ width: `${Math.min(100, (totalHolidays / 50) * 100)}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2 font-bold">
                  <span className="tracking-wide">Konferenzen & Prüfungen</span>
                  <span>{totalConferences + totalExams} Events</span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-white/80 h-full" style={{ width: `${Math.min(100, ((totalConferences + totalExams) / 20) * 100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative background blob */}
          <div className="absolute right-0 bottom-0 text-white/5 select-none pointer-events-none translate-x-4 translate-y-4">
            <span className="material-symbols-outlined text-[100px]">insights</span>
          </div>
        </div>
      </section>

      {/* Dialog for Calendar Day Click */}
      <dialog
        ref={dialogRef}
        closedby="any"
        className="rounded-3xl border border-slate-200 p-6 shadow-xl backdrop:backdrop-blur-xs max-w-sm w-full bg-white outline-none"
        aria-labelledby="calendar-editor-title"
      >
        <form onSubmit={handleSaveEvent} className="space-y-4">
          <h2 id="calendar-editor-title" className="text-lg font-extrabold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">edit_calendar</span>
            Termin eintragen
          </h2>
          <p className="text-xs text-slate-500 font-semibold">
            Datum: <span className="font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">{selectedDateStr}</span>
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Event-Kategorie</label>
              <select
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none text-sm font-semibold"
                value={formType}
                onChange={(e) => setFormType(e.target.value as any)}
              >
                <option value="none">-- Kein Event / Frei --</option>
                <option value="ferien">Ferien</option>
                <option value="pruefung">Prüfung</option>
                <option value="konferenz">Konferenz</option>
                <option value="feiertag">Feiertag</option>
              </select>
            </div>

            {formType !== 'none' && (
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Ereignis-Beschreibung</label>
                <input
                  type="text"
                  placeholder="z.B. Abitur Mathematik, Herbstferien..."
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none text-sm font-semibold"
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeDialog}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity"
            >
              Speichern
            </button>
          </div>
        </form>
      </dialog>

    </div>
  );
}
