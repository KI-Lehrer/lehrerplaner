import React, { useState } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { TimetableRow, TimetableCell, LessonPlan } from '../types';

export default function Tagesuebersicht() {
  const { 
    schoolInfo, 
    timetableData, 
    quickNotes, 
    updateQuickNotes, 
    appointments, 
    addAppointment, 
    deleteAppointment,
    lessonPlans,
    saveLessonPlan,
    getSubjectInfo
  } = usePlanner();

  // Selected date state (default to today, format YYYY-MM-DD)
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  // Appointment Form
  const [showAppForm, setShowAppForm] = useState(false);
  const [appTime, setAppTime] = useState('08:00');
  const [appText, setAppText] = useState('');
  const [appType, setAppType] = useState<'krankheit' | 'besprechung' | 'konferenz' | 'sonstiges'>('sonstiges');

  const selectedDate = new Date(selectedDateStr);
  const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  const dayKeys: { [key: number]: { a: keyof TimetableRow, b: keyof TimetableRow, label: string } } = {
    1: { a: 'mondayA', b: 'mondayB', label: 'Montag' },
    2: { a: 'tuesdayA', b: 'tuesdayB', label: 'Dienstag' },
    3: { a: 'wednesdayA', b: 'wednesdayB', label: 'Mittwoch' },
    4: { a: 'thursdayA', b: 'thursdayB', label: 'Donnerstag' },
    5: { a: 'fridayA', b: 'fridayB', label: 'Freitag' }
  };

  // Switch Day helpers
  const handlePrevDay = () => {
    const d = new Date(selectedDateStr);
    d.setDate(d.getDate() - 1);
    setSelectedDateStr(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDateStr);
    d.setDate(d.getDate() + 1);
    setSelectedDateStr(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setSelectedDateStr(new Date().toISOString().split('T')[0]);
  };

  // Add Appointment
  const handleAddAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appText.trim()) return;
    addAppointment({
      time: appTime,
      text: appText.trim(),
      type: appType
    });
    setAppText('');
    setShowAppForm(false);
  };

  // Format Date for header
  const formatDateHeader = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('de-CH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Retrieve lesson plans or empty defaults
  const getPlan = (idx: number): LessonPlan => {
    const key = `${selectedDateStr}_${idx}`;
    return lessonPlans[key] || { topic: '', homework: '', materials: '', notes: '' };
  };

  const handlePlanChange = (idx: number, field: keyof LessonPlan, val: string) => {
    const key = `${selectedDateStr}_${idx}`;
    const current = getPlan(idx);
    saveLessonPlan(selectedDateStr, idx, {
      ...current,
      [field]: val
    });
  };

  // List of lessons for the active day
  const lessonsForDay: { rowIndex: number, time: string, cellA: TimetableCell, cellB: TimetableCell }[] = [];
  
  if (!isWeekend && dayKeys[dayOfWeek]) {
    const keys = dayKeys[dayOfWeek];
    timetableData.forEach((row, rowIndex) => {
      const cellA = row[keys.a] as TimetableCell;
      const cellB = row[keys.b] as TimetableCell;
      if (cellA.subject || cellB.subject) {
        lessonsForDay.push({
          rowIndex,
          time: row.time,
          cellA,
          cellB
        });
      }
    });
  }

  // Get status class for appointment types
  const getAppTypeBadge = (type: string) => {
    switch (type) {
      case 'krankheit': return 'bg-red-50 text-red-700 border border-red-200';
      case 'besprechung': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'konferenz': return 'bg-amber-50 text-amber-700 border border-amber-200';
      default: return 'bg-slate-50 text-slate-700 border border-slate-200';
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-lg w-full space-y-gutter">
      
      {/* Date Navigation & Heading */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md">
        <div>
          <span className="font-label-md text-xs font-extrabold text-primary bg-primary/10 px-3 py-1.5 rounded-full mb-2 inline-block">Heutige Übersicht</span>
          <h1 className="font-display-lg text-3xl font-extrabold text-on-surface mt-1 mb-1">
            {formatDateHeader(selectedDateStr)}
          </h1>
          <p className="font-body-lg text-sm text-on-surface-variant">
            Klasse {schoolInfo.class} • {schoolInfo.name} • {isWeekend ? 'Wochenende (Kein Unterricht)' : `${lessonsForDay.length} Lektionen geplant`}
          </p>
        </div>

        {/* Date Selector and Nav */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button 
            onClick={handlePrevDay}
            className="p-2.5 bg-white border border-outline-variant text-on-surface-variant hover:bg-slate-50 rounded-xl transition-all active:scale-95 shadow-xs flex items-center justify-center"
            title="Vorheriger Tag"
          >
            <span className="material-symbols-outlined text-[20px] text-primary">chevron_left</span>
          </button>
          
          <input 
            type="date" 
            className="px-4 py-2 bg-white border border-outline-variant text-on-surface text-sm font-semibold rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
            value={selectedDateStr}
            onChange={(e) => setSelectedDateStr(e.target.value)}
          />

          <button 
            onClick={handleToday}
            className="px-4 py-2 bg-white border border-outline-variant text-primary font-bold text-sm hover:bg-slate-50 rounded-xl transition-all active:scale-95 shadow-xs"
          >
            Heute
          </button>

          <button 
            onClick={handleNextDay}
            className="p-2.5 bg-white border border-outline-variant text-on-surface-variant hover:bg-slate-50 rounded-xl transition-all active:scale-95 shadow-xs flex items-center justify-center"
            title="Nächster Tag"
          >
            <span className="material-symbols-outlined text-[20px] text-primary">chevron_right</span>
          </button>
        </div>
      </header>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        
        {/* Left Bento Column (appointments, notes) */}
        <div className="md:col-span-4 flex flex-col gap-gutter">
          
          {/* Important appointments */}
          <section className="bg-white border border-outline-variant rounded-3xl p-6 shadow-sm hover:border-slate-300 transition-colors">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-title-md text-title-md text-on-surface flex items-center gap-2 font-bold">
                <span className="material-symbols-outlined text-primary">priority_high</span>
                Wichtige Termine
              </h3>
              <button 
                onClick={() => setShowAppForm(!showAppForm)}
                className="text-xs text-primary font-extrabold hover:underline flex items-center gap-0.5 bg-primary/5 px-2 py-1 rounded-lg"
              >
                <span className="material-symbols-outlined text-[14px]">add</span> {showAppForm ? 'Schließen' : 'Neu'}
              </button>
            </div>

            {showAppForm && (
              <form onSubmit={handleAddAppSubmit} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Uhrzeit</label>
                    <input 
                      type="time" 
                      className="w-full px-2 py-1 bg-white border border-slate-200 text-xs font-semibold rounded-lg"
                      value={appTime}
                      onChange={(e) => setAppTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Typ</label>
                    <select
                      className="w-full px-2 py-1 bg-white border border-slate-200 text-xs font-semibold rounded-lg"
                      value={appType}
                      onChange={(e: any) => setAppType(e.target.value)}
                    >
                      <option value="sonstiges">Sonstiges</option>
                      <option value="krankheit">Krankheit</option>
                      <option value="besprechung">Besprechung</option>
                      <option value="konferenz">Konferenz</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Beschreibung</label>
                  <input 
                    type="text" 
                    placeholder="z.B. Krankheits-Abmeldungen..."
                    className="w-full px-2 py-1 bg-white border border-slate-200 text-xs font-semibold rounded-lg"
                    value={appText}
                    onChange={(e) => setAppText(e.target.value)}
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-primary text-white font-bold py-1.5 rounded-lg text-xs hover:opacity-90 transition-opacity"
                >
                  Termin hinzufügen
                </button>
              </form>
            )}

            <ul className="space-y-4">
              {appointments.map((app) => (
                <li key={app.id} className="flex gap-4 items-start justify-between group">
                  <div className="flex gap-3 items-start">
                    <div className={`px-2.5 py-1 rounded-xl font-bold text-[11px] font-mono shrink-0 ${getAppTypeBadge(app.type)}`}>
                      {app.time}
                    </div>
                    <div>
                      <p className="font-label-md text-sm font-semibold text-on-surface">{app.text}</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5 capitalize flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px] text-primary">notifications</span> {app.type}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteAppointment(app.id)}
                    className="p-1 text-slate-400 hover:text-error rounded hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity material-symbols-outlined text-[16px]"
                    title="Termin löschen"
                  >
                    delete
                  </button>
                </li>
              ))}
              {appointments.length === 0 && (
                <p className="text-xs text-on-surface-variant italic py-4 text-center">Keine Termine für heute eingetragen.</p>
              )}
            </ul>
          </section>

          {/* Quick Notes */}
          <section className="bg-white border border-outline-variant rounded-3xl p-6 shadow-sm hover:border-slate-300 transition-colors">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-title-md text-title-md text-on-surface flex items-center gap-1.5 font-bold">
                <span className="material-symbols-outlined text-primary">edit_note</span>
                Quick-Notes
              </h3>
              <span className="text-[10px] uppercase font-bold text-outline">Entwurf</span>
            </div>
            <textarea 
              className="w-full min-h-[140px] p-2 font-body-md text-sm text-on-surface-variant border-none bg-transparent focus:ring-0 resize-none outline-none notebook-input" 
              placeholder="Was gibt es heute sonst noch zu beachten? Notizen hier eintragen..."
              value={quickNotes}
              onChange={(e) => updateQuickNotes(e.target.value)}
            ></textarea>
          </section>

          {/* Visual Quote Banner */}
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

        {/* Right Bento Column: Active interactive Lessons */}
        <div className="md:col-span-8 flex flex-col gap-gutter">
          
          {!isWeekend ? (
            lessonsForDay.map((lesson) => {
              const plan = getPlan(lesson.rowIndex);
              
              // Handle cell mapping
              // If only A or only B is scheduled, or both
              const hasA = lesson.cellA.subject;
              const hasB = lesson.cellB.subject;
              const cellsToRender = [];
              if (hasA) cellsToRender.push({ cell: lesson.cellA, suffix: hasB ? ' (Gruppe A)' : '' });
              if (hasB) cellsToRender.push({ cell: lesson.cellB, suffix: hasA ? ' (Gruppe B)' : '' });
              
              return cellsToRender.map(({ cell, suffix }, cellIndex) => {
                const det = getSubjectInfo(cell.subject);
                const uniqueLessonIndex = lesson.rowIndex * 10 + cellIndex; // Unique identifier for each list cell plan
                const activePlan = getPlan(uniqueLessonIndex);
                
                return (
                  <article 
                    key={`${lesson.rowIndex}-${cellIndex}`} 
                    className="bg-white border border-outline-variant rounded-3xl overflow-hidden shadow-sm hover:border-slate-300 transition-all duration-200"
                  >
                    <header className={`px-6 py-4 flex justify-between items-center border-b border-outline-variant/60 ${det.bgClass}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold font-mono ${det.borderClass.replace('border-', 'bg-')}`}>
                          {lesson.rowIndex + 1}
                        </div>
                        <span className={`font-label-md text-sm font-bold uppercase tracking-wider ${det.colorClass} ml-2`}>
                          {cell.subject} — Klasse {schoolInfo.class}{suffix}
                        </span>
                      </div>
                      <span className="px-3 py-1 bg-white border border-outline-variant rounded-full text-xs font-bold text-on-surface">
                        {lesson.time}
                      </span>
                    </header>
                    
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Thema der Stunde</label>
                          <input 
                            className="w-full py-2 bg-transparent text-on-surface font-semibold text-sm border-b border-outline-variant focus:border-primary border-t-0 border-l-0 border-r-0 focus:ring-0 transition-colors outline-none" 
                            type="text" 
                            placeholder="Unterrichtsthema eintragen..."
                            value={activePlan.topic}
                            onChange={(e) => handlePlanChange(uniqueLessonIndex, 'topic', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 mt-2">Lehrperson & Raum</label>
                          <div className="flex flex-wrap gap-2">
                            <span className="bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-semibold text-on-surface flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px] text-primary">person</span> 
                              {det.teacherName} ({cell.teacherCode})
                            </span>
                            <span className="bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-semibold text-on-surface flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px] text-primary">room</span> 
                              {det.room}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Hausaufgaben</label>
                          <input 
                            className="w-full py-2 bg-transparent text-on-surface text-sm border-b border-outline-variant focus:border-primary border-t-0 border-l-0 border-r-0 focus:ring-0 transition-colors outline-none" 
                            type="text" 
                            placeholder="Hausaufgaben eintragen..."
                            value={activePlan.homework}
                            onChange={(e) => handlePlanChange(uniqueLessonIndex, 'homework', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 mt-2">Mitzubringen / Notizen</label>
                          <textarea 
                            className="w-full py-2 min-h-[70px] text-sm border-b border-outline-variant focus:border-primary border-t-0 border-l-0 border-r-0 bg-transparent focus:ring-0 transition-colors resize-none outline-none" 
                            placeholder="Benötigte Materialien oder Reflexion eintragen..."
                            value={activePlan.materials}
                            onChange={(e) => handlePlanChange(uniqueLessonIndex, 'materials', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </article>
                );
              });
            })
          ) : (
            <div className="flex flex-col items-center justify-center p-12 bg-white border border-outline-variant rounded-3xl min-h-[300px] text-center shadow-sm">
              <span className="material-symbols-outlined text-5xl text-outline mb-4">weekend</span>
              <h3 className="font-title-md text-lg font-bold text-on-surface mb-2">Wochenende</h3>
              <p className="text-sm text-on-surface-variant max-w-sm">
                Am Wochenende findet kein regulärer Unterricht statt. Wähle ein anderes Datum in der Leiste oben aus, um Unterrichtsstunden zu planen.
              </p>
            </div>
          )}

          {lessonsForDay.length === 0 && !isWeekend && (
            <div className="flex flex-col items-center justify-center p-12 bg-white border border-outline-variant rounded-3xl min-h-[300px] text-center shadow-sm">
              <span className="material-symbols-outlined text-5xl text-outline mb-4">calendar_today</span>
              <h3 className="font-title-md text-lg font-bold text-on-surface mb-2">Kein Unterricht geplant</h3>
              <p className="text-sm text-on-surface-variant max-w-sm">
                Für diesen Wochentag sind keine Lektionen im Stundenplan hinterlegt. Du kannst deinen Stundenplan im Stundenplan-Tab konfigurieren.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
