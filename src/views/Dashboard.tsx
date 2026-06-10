import React, { useEffect, useState } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { TimetableRow, TimetableCell, Todo } from '../types';

export default function Dashboard() {
  const { schoolInfo, timetableData, todos, updateTodo, quickNotes, updateQuickNotes, getSubjectInfo } = usePlanner();

  // Determine current day of the week
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  // Map JS day to our timetable keys
  const dayKeys: { [key: number]: { a: keyof TimetableRow, b: keyof TimetableRow, label: string } } = {
    1: { a: 'mondayA', b: 'mondayB', label: 'Montag' },
    2: { a: 'tuesdayA', b: 'tuesdayB', label: 'Dienstag' },
    3: { a: 'wednesdayA', b: 'wednesdayB', label: 'Mittwoch' },
    4: { a: 'thursdayA', b: 'thursdayB', label: 'Donnerstag' },
    5: { a: 'fridayA', b: 'fridayB', label: 'Freitag' }
  };

  // If weekend, display Monday as default dashboard day structure
  const activeDayIndex = isWeekend ? 1 : dayOfWeek;
  const currentDayInfo = dayKeys[activeDayIndex];

  // Parse time to minutes to find active lesson
  const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();

  // Helper to parse time slot string (e.g. "08:20–09:05") into minutes
  const parseTimeSlot = (timeStr: string) => {
    // replace en-dash or hyphen
    const cleanStr = timeStr.replace('–', '-');
    const [start, end] = cleanStr.split('-');
    if (!start || !end) return { startMin: 0, endMin: 0 };
    
    const [sH, sM] = start.trim().split(':').map(Number);
    const [eH, eM] = end.trim().split(':').map(Number);

    return {
      startMin: sH * 60 + sM,
      endMin: eH * 60 + eM
    };
  };

  // Find current and remaining lessons
  let currentLessonIndex = -1;
  let currentLessonCell: TimetableCell | null = null;
  let currentLessonTime = '';
  const todaysLessons: { cell: TimetableCell, time: string, index: number }[] = [];

  timetableData.forEach((row, idx) => {
    const cellA = row[currentDayInfo.a] as TimetableCell;
    const cellB = row[currentDayInfo.b] as TimetableCell;
    
    // Choose group A or B, if both exist, prefer Rule/A
    const activeCell = cellA.subject ? cellA : cellB;
    if (activeCell.subject) {
      todaysLessons.push({ cell: activeCell, time: row.time, index: idx });
      
      const { startMin, endMin } = parseTimeSlot(row.time);
      if (currentMinutes >= startMin && currentMinutes <= endMin) {
        currentLessonIndex = idx;
        currentLessonCell = activeCell;
        currentLessonTime = row.time;
      }
    }
  });

  // Fallback for current active lesson if outside school hours
  if (currentLessonIndex === -1 && todaysLessons.length > 0) {
    // Find next upcoming lesson
    const nextLesson = todaysLessons.find(l => {
      const { startMin } = parseTimeSlot(l.time);
      return currentMinutes < startMin;
    });

    if (nextLesson) {
      currentLessonIndex = nextLesson.index;
      currentLessonCell = nextLesson.cell;
      currentLessonTime = nextLesson.time;
    } else {
      // End of school day, default to first lesson
      currentLessonIndex = todaysLessons[0].index;
      currentLessonCell = todaysLessons[0].cell;
      currentLessonTime = todaysLessons[0].time;
    }
  }

  // Remaining lessons today (occurring after the current time)
  const remainingLessons = todaysLessons.filter(l => {
    const { startMin } = parseTimeSlot(l.time);
    const { startMin: currStartMin } = currentLessonTime ? parseTimeSlot(currentLessonTime) : { startMin: 0 };
    return startMin > currStartMin;
  });

  const subjectInfo = currentLessonCell ? getSubjectInfo(currentLessonCell.subject) : null;

  // Filter priorities: Prio 1, incomplete
  const priorities = todos
    .filter(t => !t.completed && t.priority === 1)
    .slice(0, 3);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-CH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getDayGreeting = () => {
    const hours = currentDate.getHours();
    if (hours < 11) return 'Guten Morgen';
    if (hours < 18) return 'Guten Tag';
    return 'Guten Abend';
  };

  return (
    <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-lg w-full space-y-gutter">
      {/* Upper header section */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
          <div>
            <span className="text-xs font-bold text-primary tracking-widest uppercase mb-1 block">Lehrplaner Dashboard</span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">
              {getDayGreeting()}, Herr Lüscher
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              {formatDate(currentDate)} • Klasse {schoolInfo.class} • {schoolInfo.name}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-white border border-outline-variant rounded-full text-sm font-semibold text-on-surface shadow-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
              Schuljahr {schoolInfo.year}
            </div>
          </div>
        </div>
      </section>

      {/* Main Bento Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
        
        {/* Main Highlight Card - Active Lesson */}
        <div className="md:col-span-3 bg-primary rounded-3xl p-8 text-white flex flex-col justify-between shadow-lg relative overflow-hidden bento-glow-indigo min-h-[320px]">
          <div className="relative z-10">
            <span className="px-3 py-1 bg-white/20 rounded-full text-[11px] font-bold uppercase tracking-wider mb-5 inline-block">
              {currentMinutes > (currentLessonTime ? parseTimeSlot(currentLessonTime).endMin : 0) ? 'Nächste Lektion' : 'Aktuelle Lektion'}
            </span>
            {currentLessonCell ? (
              <>
                <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
                  {currentLessonCell.subject} — Klasse {schoolInfo.class}
                  <br />
                  {subjectInfo?.subject === 'X' ? 'Regelunterricht (KLP)' : subjectInfo?.teacherName}
                </h2>
                <p className="mt-4 text-primary-fixed/80 max-w-[512px] font-body-md text-body-md">
                  Fach: {subjectInfo?.subject} • Lehrperson: {subjectInfo?.teacherName} • Raum: {subjectInfo?.room}
                  {schoolInfo.notice && <span className="block mt-2 text-xs italic text-white/75">{schoolInfo.notice}</span>}
                </p>
              </>
            ) : (
              <>
                <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Kein Unterricht</h2>
                <p className="mt-4 text-primary-fixed/80 max-w-[512px] font-body-md text-body-md">
                  Für den heutigen Tag ist kein planmäßiger Unterricht eingetragen oder Schulschluss ist bereits erreicht.
                </p>
              </>
            )}
          </div>
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10 pt-5 mt-6">
            <div className="flex items-center gap-md">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[20px] text-primary-fixed">room</span>
                <span className="font-label-md text-white">{subjectInfo?.room || 'Zimmer -'}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[20px] text-primary-fixed">schedule</span>
                <span className="font-label-md text-white">{currentLessonTime || '00:00 - 00:00'}</span>
              </div>
            </div>
            <div className="text-xs font-bold uppercase tracking-wider bg-white/15 px-3 py-1.5 rounded-xl text-white">
              {isWeekend ? 'Wochenende' : currentDayInfo.label}
            </div>
          </div>
          {/* Decorative background visual blob */}
          <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-40"></div>
        </div>

        {/* Metric Card 1: Month/Temp */}
        <div className="bg-white border border-outline-variant rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:border-slate-300 transition-colors">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 bg-secondary-container rounded-xl flex items-center justify-center text-on-secondary-container">
              <span className="material-symbols-outlined">device_thermostat</span>
            </div>
            <span className="text-xs font-bold text-on-secondary-container bg-secondary-container px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {currentDate.toLocaleString('de-CH', { month: 'short' })}
            </span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-on-surface">Planer</div>
            <div className="text-sm text-on-surface-variant font-semibold mt-1">Lokal & persistent</div>
          </div>
        </div>

        {/* Metric Card 2: Lessons scheduled today */}
        <div className="bg-tertiary-fixed border border-outline-variant/40 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 bg-white/70 rounded-xl flex items-center justify-center text-on-tertiary-fixed-variant">
              <span className="material-symbols-outlined">menu_book</span>
            </div>
            <span className="text-xs font-bold text-on-tertiary-fixed-variant bg-white/55 px-2.5 py-0.5 rounded-full">Soll</span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-on-tertiary-fixed-variant">
              {todaysLessons.length} Lektionen
            </div>
            <div className="text-sm text-on-tertiary-fixed-variant/90 font-semibold mt-1">
              für {isWeekend ? 'Montag' : currentDayInfo.label} geplant
            </div>
          </div>
        </div>

        {/* Remaining Lessons list */}
        <div className="md:col-span-2 bg-white border border-outline-variant rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-title-md text-title-md text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">schedule</span>
                Verbleibender Tag ({isWeekend ? 'Vorschau Mo' : currentDayInfo.label})
              </h3>
              <span className="text-xs font-mono text-on-surface-variant uppercase tracking-wider font-bold bg-surface-container px-2 py-0.5 rounded">
                {schoolInfo.class}
              </span>
            </div>
            
            <div className="space-y-3 max-h-[190px] overflow-y-auto pr-1">
              {remainingLessons.map((item, idx) => {
                const det = getSubjectInfo(item.cell.subject);
                return (
                  <div key={idx} className="flex items-center gap-md p-3 rounded-2xl border border-outline-variant hover:bg-surface-container-low transition-colors group">
                    <div className="text-center min-w-[50px]">
                      <p className="font-label-sm text-on-surface-variant text-[11px] font-bold">{item.time.split('–')[0]}</p>
                      <p className="text-[10px] text-primary font-extrabold">{item.index + 1}. Lekt</p>
                    </div>
                    <div className={`w-1 self-stretch rounded-full ${det.borderClass.replace('border-', 'bg-')}`}></div>
                    <div className="flex-grow">
                      <p className="font-label-md text-on-surface text-sm font-bold leading-tight">{item.cell.subject} — {det.teacherName}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">Raum: {det.room}</p>
                    </div>
                  </div>
                );
              })}
              {remainingLessons.length === 0 && (
                <p className="text-xs text-on-surface-variant italic py-4 text-center">Keine weiteren Lektionen für heute.</p>
              )}
            </div>
          </div>
        </div>

        {/* Priorities card */}
        <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Wichtig</span>
              <span className="material-symbols-outlined text-amber-400">notifications_active</span>
            </div>
            <h3 className="font-title-md text-title-md text-white mb-4">Top Prioritäten</h3>
            
            <div className="space-y-3.5">
              {priorities.map((p) => (
                <label key={p.id} className="flex items-start gap-3 cursor-pointer group">
                  <input 
                    className="mt-1 rounded border-slate-700 bg-slate-800 text-primary focus:ring-primary focus:ring-offset-slate-900 h-4 w-4 transition-all" 
                    type="checkbox"
                    checked={p.completed || false}
                    onChange={() => updateTodo(p.id, { completed: true })}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-100 group-hover:text-primary transition-colors line-clamp-1">{p.title}</span>
                    <span className="text-[10px] text-slate-400 font-bold mt-0.5">{p.date || 'Kein Termin'} • {p.classLabel}</span>
                  </div>
                </label>
              ))}
              {priorities.length === 0 && (
                <p className="text-xs text-slate-400 italic py-4">Keine dringenden Aufgaben ausstehend.</p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400 italic">
            {todos.filter(t => !t.completed).length} Aufgaben verbleibend
          </div>
        </div>

        {/* Quick Notes Textarea */}
        <div className="col-span-1 md:col-span-4 bg-white border border-outline-variant rounded-3xl p-6 shadow-sm hover:border-slate-300 transition-colors">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-title-md text-title-md text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary">edit_note</span>
              Globale Schnellnotizen
            </h3>
            <span className="text-[10px] uppercase font-bold text-outline">Wird automatisch gespeichert</span>
          </div>
          <textarea 
            className="w-full min-h-[120px] p-3 font-body-md text-sm text-on-surface-variant border border-dashed border-slate-200 hover:border-slate-300 focus:border-primary rounded-2xl bg-slate-50/30 resize-none outline-none focus:ring-0 transition-colors" 
            placeholder="Was gibt es heute sonst noch zu beachten? Notizen hier eintragen..."
            value={quickNotes}
            onChange={(e) => updateQuickNotes(e.target.value)}
          />
        </div>

        {/* Large Decorative Quote Bento */}
        <div className="col-span-1 md:col-span-4 bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden flex items-center min-h-[160px] shadow-md">
          <div className="relative z-10 max-w-2xl">
            <p className="font-body-lg text-lg italic mb-3 text-slate-100 leading-relaxed font-semibold">
              "Bildung ist die mächtigste Waffe, die man verwenden kann, um die Welt zu verändern."
            </p>
            <p className="font-label-md text-primary-fixed uppercase tracking-widest text-[11px]">
              — Nelson Mandela
            </p>
          </div>
          <div className="absolute right-6 bottom-0 text-white/5 select-none pointer-events-none">
            <span className="material-symbols-outlined text-[140px]">format_quote</span>
          </div>
        </div>

      </div>
    </div>
  );
}
