import React, { useState } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { TimetableRow, TimetableCell } from '../types';

export default function Wochenuebersicht() {
  const { timetableData, lessonPlans, saveLessonPlan, getSubjectInfo } = usePlanner();

  // Active date which determines the current week
  const [activeDate, setActiveDate] = useState<Date>(() => {
    const today = new Date();
    // Default to Monday of current week
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(today.setDate(diff));
  });

  // Shift weeks helper
  const handlePrevWeek = () => {
    const d = new Date(activeDate);
    d.setDate(d.getDate() - 7);
    setActiveDate(d);
  };

  const handleNextWeek = () => {
    const d = new Date(activeDate);
    d.setDate(d.getDate() + 7);
    setActiveDate(d);
  };

  // Helper to format ISO Date string YYYY-MM-DD
  const toISODateStr = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Helper to get Date for day index of current week (0 = Mon, 1 = Tue, ..., 4 = Fri)
  const getDateOfDay = (index: number) => {
    const d = new Date(activeDate);
    d.setDate(d.getDate() + index);
    return d;
  };

  // Helper to get Kalenderwoche (KW) number
  const getWeekNumber = (d: Date) => {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  // Formatted start and end of week (e.g. "16. Oktober – 22. Oktober 2023")
  const getWeekRangeLabel = () => {
    const start = getDateOfDay(0);
    const end = getDateOfDay(4);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    const endOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return `${start.toLocaleDateString('de-CH', options)} – ${end.toLocaleDateString('de-CH', endOptions)}`;
  };

  // Get active lessons for a weekday index (1 = Mon, 2 = Tue, ..., 5 = Fri)
  const getLessonsForDay = (dayIndex: number) => {
    // dayIndex mapping
    const dayKeys: { [key: number]: { a: keyof TimetableRow, b: keyof TimetableRow } } = {
      1: { a: 'mondayA', b: 'mondayB' },
      2: { a: 'tuesdayA', b: 'tuesdayB' },
      3: { a: 'wednesdayA', b: 'wednesdayB' },
      4: { a: 'thursdayA', b: 'thursdayB' },
      5: { a: 'fridayA', b: 'fridayB' }
    };

    const keys = dayKeys[dayIndex];
    const lessons: { rowIndex: number, time: string, cell: TimetableCell, cellIndex: number }[] = [];
    
    if (keys) {
      timetableData.forEach((row, rowIndex) => {
        const cellA = row[keys.a] as TimetableCell;
        const cellB = row[keys.b] as TimetableCell;
        
        if (cellA.subject) {
          lessons.push({ rowIndex, time: row.time, cell: cellA, cellIndex: 0 });
        }
        if (cellB.subject) {
          lessons.push({ rowIndex, time: row.time, cell: cellB, cellIndex: 1 });
        }
      });
    }

    return lessons;
  };

  // Handle saving day-specific text notes
  const getDayNotes = (dateStr: string) => {
    return lessonPlans[`${dateStr}_notes`]?.notes || '';
  };

  const handleDayNotesChange = (dateStr: string, text: string) => {
    const current = lessonPlans[`${dateStr}_notes`] || { topic: '', homework: '', materials: '', notes: '' };
    saveLessonPlan(`${dateStr}_notes`, 99, {
      ...current,
      notes: text
    });
  };

  const weekdays = [
    { label: 'Montag', index: 1 },
    { label: 'Dienstag', index: 2 },
    { label: 'Mittwoch', index: 3 },
    { label: 'Donnerstag', index: 4 },
    { label: 'Freitag', index: 5 }
  ];

  return (
    <div className="p-margin-mobile md:px-margin-desktop py-lg w-full max-w-[1440px] mx-auto min-h-screen">
      
      {/* Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-md">
        <div>
          <span className="text-xs font-bold text-primary tracking-widest uppercase mb-1 block">Wochenplaner</span>
          <h1 className="font-display-lg text-3xl font-extrabold text-on-surface">Wochenübersicht</h1>
          <p className="font-body-md text-on-surface-variant italic mt-1 bg-primary/5 px-3 py-1 rounded-full inline-block">
            KW {getWeekNumber(activeDate)} • {getWeekRangeLabel()}
          </p>
        </div>
        <div className="flex gap-sm">
          <button 
            onClick={handlePrevWeek}
            className="bg-white text-on-surface-variant px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 border border-outline-variant hover:bg-slate-50 transition-colors text-sm shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px] text-primary">chevron_left</span> Vorherige
          </button>
          <button 
            onClick={handleNextWeek}
            className="bg-white text-on-surface-variant px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 border border-outline-variant hover:bg-slate-50 transition-colors text-sm shadow-sm active:scale-95"
          >
            Nächste <span className="material-symbols-outlined text-[20px] text-primary">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Week Grid (5 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-gutter items-stretch">
        
        {weekdays.map((day, idx) => {
          const date = getDateOfDay(idx);
          const dateStr = toISODateStr(date);
          const lessons = getLessonsForDay(day.index);
          const formattedDateLabel = date.toLocaleDateString('de-CH', { day: 'numeric', month: 'short' });

          return (
            <article key={day.label} className="bg-white border border-outline-variant rounded-3xl shadow-sm flex flex-col h-[780px] hover:border-slate-300 transition-all duration-200">
              <header className="p-5 border-b border-outline-variant bg-slate-50 rounded-t-3xl shrink-0">
                <h4 className="text-lg font-extrabold text-primary">{day.label}</h4>
                <span className="text-xs font-bold text-on-surface-variant mt-1 block">{formattedDateLabel}</span>
              </header>
              
              <div className="p-4 flex-1 flex flex-col gap-3 overflow-y-auto w-full">
                
                {lessons.map(({ rowIndex, time, cell, cellIndex }) => {
                  const det = getSubjectInfo(cell.subject);
                  
                  // Lookup lesson topic from lessonPlans using same key convention as Tagesuebersicht
                  const uniqueLessonIndex = rowIndex * 10 + cellIndex;
                  const lessonPlanKey = `${dateStr}_${uniqueLessonIndex}`;
                  const plan = lessonPlans[lessonPlanKey];
                  const topic = plan?.topic || '';
                  const homework = plan?.homework || '';

                  return (
                    <div 
                      key={`${rowIndex}-${cellIndex}`} 
                      className={`p-3 border-l-4 ${det.borderClass} ${det.bgClass} rounded-r-xl flex flex-col justify-between shrink-0 hover:scale-[1.02] transition-transform cursor-pointer`}
                      title={`Klasse ${cell.subject} • ${det.room}`}
                    >
                      <div className="flex flex-col">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${det.colorClass}`}>
                          {time.split('–')[0]} - {cell.subject}
                        </span>
                        <p className={`font-semibold text-sm ${det.colorClass} mt-1 truncate`}>
                          {topic || 'Unterrichtsthema ergänzen...'}
                        </p>
                      </div>
                      
                      {(homework || det.room) && (
                        <div className="mt-2 pt-2 border-t border-slate-200/40 text-[9px] text-slate-500 font-medium">
                          {homework ? `📖 HW: ${homework}` : `📍 Raum: ${det.room}`}
                        </div>
                      )}
                    </div>
                  );
                })}

                {lessons.length === 0 && (
                  <div className="py-8 text-center text-xs text-outline italic">
                    Kein Unterricht
                  </div>
                )}

                {/* Day notes at bottom */}
                <div className="mt-auto pt-3 border-t border-slate-100 flex flex-col gap-1 w-full">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Notizen</span>
                  <textarea 
                    className="w-full notebook-input border-none focus:ring-0 font-body-md text-xs italic text-on-surface-variant min-h-[140px] resize-none outline-none bg-transparent" 
                    placeholder={`${day.label} Notizen eintragen...`}
                    value={getDayNotes(dateStr)}
                    onChange={(e) => handleDayNotesChange(dateStr, e.target.value)}
                  />
                </div>
              </div>
            </article>
          );
        })}
        
      </div>
    </div>
  );
}
