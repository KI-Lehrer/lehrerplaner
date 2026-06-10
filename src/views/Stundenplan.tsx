import React, { useState, useRef, useEffect } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { TimetableRow, TimetableCell, Teacher } from '../types';

type FilterType = 'all' | 'groupA' | 'groupB';

export default function Stundenplan() {
  const { 
    schoolInfo, 
    teachers, 
    groups, 
    subjects, 
    timetableData, 
    updateTimetableCell,
    updateTimetableRowTime,
    getSubjectInfo
  } = usePlanner();

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

  // Editing state for cells
  const [editState, setEditState] = useState<{ rowIndex: number, dayKey: keyof TimetableRow, cell: TimetableCell } | null>(null);
  
  // Modal fields
  const [formSubject, setFormSubject] = useState('');
  const [formTeacher, setFormTeacher] = useState('');
  const [formRoom, setFormRoom] = useState('');

  // Editing state for lesson row times
  const [editTimeState, setEditTimeState] = useState<{ rowIndex: number, time: string } | null>(null);

  // Dialog ref
  const dialogRef = useRef<HTMLDialogElement>(null);
  const timeDialogRef = useRef<HTMLDialogElement>(null);

  // Open modal on cell click
  const handleCellClick = (rowIndex: number, dayKey: keyof TimetableRow, cell: TimetableCell) => {
    setEditState({ rowIndex, dayKey, cell });
    setFormSubject(cell.subject || '');
    setFormTeacher(cell.teacherCode || '');
    setFormRoom(cell.room || '');
  };

  // Trigger browser native modal show
  useEffect(() => {
    if (editState && dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, [editState]);

  useEffect(() => {
    if (editTimeState && timeDialogRef.current) {
      timeDialogRef.current.showModal();
    }
  }, [editTimeState]);

  // Handle subject change to autofill teacher & room
  const handleSubjectChange = (subjName: string) => {
    setFormSubject(subjName);
    const foundSub = subjects.find(s => s.subject.toUpperCase() === subjName.toUpperCase());
    if (foundSub) {
      setFormTeacher(foundSub.teacher || '');
      setFormRoom(foundSub.room || '');
    }
  };

  // Close cell modal
  const closeCellModal = () => {
    if (dialogRef.current) dialogRef.current.close();
    setEditState(null);
  };

  // Close time modal
  const closeTimeModal = () => {
    if (timeDialogRef.current) timeDialogRef.current.close();
    setEditTimeState(null);
  };

  // Save cell edit
  const handleSaveCell = (e: React.FormEvent) => {
    e.preventDefault();
    if (editState) {
      updateTimetableCell(editState.rowIndex, editState.dayKey, {
        subject: formSubject,
        teacherCode: formTeacher,
        room: formRoom
      });
      closeCellModal();
    }
  };

  // Clear cell
  const handleClearCell = () => {
    if (editState) {
      updateTimetableCell(editState.rowIndex, editState.dayKey, {
        subject: '',
        teacherCode: '',
        room: ''
      });
      closeCellModal();
    }
  };

  // Save row time edit
  const handleSaveTime = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTimeState) {
      updateTimetableRowTime(editTimeState.rowIndex, editTimeState.time);
      closeTimeModal();
    }
  };

  // Setup click-outside fallback listeners for dialogs (as per guidelines)
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
          setEditState(null);
        }
      }
    };

    dialog.addEventListener('click', handleClickOutside);
    return () => dialog.removeEventListener('click', handleClickOutside);
  }, [editState]);

  useEffect(() => {
    const timeDialog = timeDialogRef.current;
    if (!timeDialog) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (event.target === timeDialog) {
        const rect = timeDialog.getBoundingClientRect();
        const isDialogContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        if (!isDialogContent) {
          timeDialog.close();
          setEditTimeState(null);
        }
      }
    };

    timeDialog.addEventListener('click', handleClickOutside);
    return () => timeDialog.removeEventListener('click', handleClickOutside);
  }, [editTimeState]);

  return (
    <div className="p-margin-mobile md:px-margin-desktop py-lg w-full max-w-[1440px] mx-auto min-h-screen space-y-8">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md border-b border-outline-variant pb-6 mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-primary tracking-widest uppercase block">Stundenplan</span>
            <span className="bg-primary/10 text-primary text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">Klasse {schoolInfo.class}</span>
          </div>
          <h1 className="font-display-lg text-3xl font-extrabold text-on-surface mt-1">{schoolInfo.name}</h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1.5 font-medium flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
            {schoolInfo.address} • Schuljahr {schoolInfo.year} ({schoolInfo.level})
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => window.print()}
            className="px-5 py-2.5 bg-white border border-outline-variant text-on-surface-variant rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all text-sm active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">print</span> Drucken
          </button>
        </div>
      </div>

      {/* Notice Alert Banner */}
      {schoolInfo.notice && (
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
          <span className="material-symbols-outlined text-amber-600">info</span>
          <div className="text-sm font-semibold text-amber-900">
            <span className="font-extrabold uppercase text-xs tracking-wider bg-amber-200/50 px-1.5 py-0.5 rounded mr-1">Hinweis:</span>
            {schoolInfo.notice}
          </div>
        </div>
      )}

      {/* Filter Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/80 p-3 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-500 text-[18px]">filter_list</span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ansicht filtern:</span>
        </div>
        <div className="flex bg-slate-200/60 p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeFilter === 'all' ? 'bg-primary text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Gesamtansicht (A & B)
          </button>
          <button
            onClick={() => setActiveFilter('groupA')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeFilter === 'groupA' ? 'bg-primary text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Nur Gruppe A
          </button>
          <button
            onClick={() => setActiveFilter('groupB')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeFilter === 'groupB' ? 'bg-primary text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Nur Gruppe B
          </button>
        </div>
      </div>

      {/* Interactive Instructions Alert */}
      <div className="bg-sky-50 border-l-4 border-sky-400 rounded-2xl p-4 flex items-center gap-3">
        <span className="material-symbols-outlined text-sky-600">info</span>
        <div className="text-xs font-bold text-sky-900">
          <span className="font-extrabold uppercase text-[10px] tracking-wider bg-sky-200/50 px-1.5 py-0.5 rounded mr-1">Tipp:</span>
          Klicke auf eine Zelle im Stundenplan, um das Fach zu bearbeiten. Klicke auf die Lektionszeiten ganz links, um die Uhrzeiten anzupassen.
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="p-4 text-center font-bold text-xs text-slate-500 uppercase tracking-wider border-r border-slate-200/60 w-[110px]">
                  Zeit
                </th>
                
                {/* Monday */}
                <th className="p-4 text-center font-extrabold text-sm text-primary uppercase tracking-wider border-r border-slate-200/60" colSpan={activeFilter === 'all' ? 2 : 1}>
                  Montag
                  {activeFilter === 'all' && (
                    <div className="flex gap-1 text-[9px] mt-1 font-bold justify-center text-slate-400">
                      <span className="w-full bg-slate-200/60 py-0.5 rounded">A</span>
                      <span className="w-full bg-slate-200/60 py-0.5 rounded">B</span>
                    </div>
                  )}
                </th>
                
                {/* Tuesday */}
                <th className="p-4 text-center font-extrabold text-sm text-primary uppercase tracking-wider border-r border-slate-200/60" colSpan={activeFilter === 'all' ? 2 : 1}>
                  Dienstag
                  {activeFilter === 'all' && (
                    <div className="flex gap-1 text-[9px] mt-1 font-bold justify-center text-slate-400">
                      <span className="w-full bg-slate-200/60 py-0.5 rounded">A</span>
                      <span className="w-full bg-slate-200/60 py-0.5 rounded">B</span>
                    </div>
                  )}
                </th>

                {/* Wednesday */}
                <th className="p-4 text-center font-extrabold text-sm text-primary uppercase tracking-wider border-r border-slate-200/60" colSpan={activeFilter === 'all' ? 2 : 1}>
                  Mittwoch
                  {activeFilter === 'all' && (
                    <div className="flex gap-1 text-[9px] mt-1 font-bold justify-center text-slate-400">
                      <span className="w-full bg-slate-200/60 py-0.5 rounded">A</span>
                      <span className="w-full bg-slate-200/60 py-0.5 rounded">B</span>
                    </div>
                  )}
                </th>

                {/* Thursday */}
                <th className="p-4 text-center font-extrabold text-sm text-primary uppercase tracking-wider border-r border-slate-200/60" colSpan={activeFilter === 'all' ? 2 : 1}>
                  Donnerstag
                  {activeFilter === 'all' && (
                    <div className="flex gap-1 text-[9px] mt-1 font-bold justify-center text-slate-400">
                      <span className="w-full bg-slate-200/60 py-0.5 rounded">A</span>
                      <span className="w-full bg-slate-200/60 py-0.5 rounded">B</span>
                    </div>
                  )}
                </th>

                {/* Friday */}
                <th className="p-4 text-center font-extrabold text-sm text-primary uppercase tracking-wider" colSpan={activeFilter === 'all' ? 2 : 1}>
                  Freitag
                  {activeFilter === 'all' && (
                    <div className="flex gap-1 text-[9px] mt-1 font-bold justify-center text-slate-400">
                      <span className="w-full bg-slate-200/60 py-0.5 rounded">A</span>
                      <span className="w-full bg-slate-200/60 py-0.5 rounded">B</span>
                    </div>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {timetableData.map((row, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  <tr className="border-b border-slate-200/65 hover:bg-slate-50/30 transition-colors">
                    {/* Time Slot column - Editable */}
                    <td 
                      onClick={() => setEditTimeState({ rowIndex, time: row.time })}
                      className="p-3 text-center border-r border-slate-200/60 font-medium text-xs text-slate-500 bg-slate-50/40 cursor-pointer hover:bg-slate-200/50 transition-colors"
                      title="Uhrzeit bearbeiten"
                    >
                      <div className="font-extrabold text-slate-700">{rowIndex + 1}. Lektion</div>
                      <div className="font-mono text-[10px] mt-1 bg-slate-100 px-1.5 py-0.5 rounded hover:bg-primary hover:text-white transition-colors">{row.time}</div>
                    </td>

                    {/* Monday Cell(s) */}
                    {activeFilter === 'all' ? (
                      <>
                        <Cell cell={row.mondayA} onClick={() => handleCellClick(rowIndex, 'mondayA', row.mondayA)} getSubjectInfo={getSubjectInfo} />
                        <Cell cell={row.mondayB} onClick={() => handleCellClick(rowIndex, 'mondayB', row.mondayB)} getSubjectInfo={getSubjectInfo} />
                      </>
                    ) : activeFilter === 'groupA' ? (
                      <Cell cell={row.mondayA} onClick={() => handleCellClick(rowIndex, 'mondayA', row.mondayA)} getSubjectInfo={getSubjectInfo} />
                    ) : (
                      <Cell cell={row.mondayB} onClick={() => handleCellClick(rowIndex, 'mondayB', row.mondayB)} getSubjectInfo={getSubjectInfo} />
                    )}

                    {/* Tuesday Cell(s) */}
                    {activeFilter === 'all' ? (
                      <>
                        <Cell cell={row.tuesdayA} onClick={() => handleCellClick(rowIndex, 'tuesdayA', row.tuesdayA)} getSubjectInfo={getSubjectInfo} />
                        <Cell cell={row.tuesdayB} onClick={() => handleCellClick(rowIndex, 'tuesdayB', row.tuesdayB)} getSubjectInfo={getSubjectInfo} />
                      </>
                    ) : activeFilter === 'groupA' ? (
                      <Cell cell={row.tuesdayA} onClick={() => handleCellClick(rowIndex, 'tuesdayA', row.tuesdayA)} getSubjectInfo={getSubjectInfo} />
                    ) : (
                      <Cell cell={row.tuesdayB} onClick={() => handleCellClick(rowIndex, 'tuesdayB', row.tuesdayB)} getSubjectInfo={getSubjectInfo} />
                    )}

                    {/* Wednesday Cell(s) */}
                    {activeFilter === 'all' ? (
                      <>
                        <Cell cell={row.wednesdayA} onClick={() => handleCellClick(rowIndex, 'wednesdayA', row.wednesdayA)} getSubjectInfo={getSubjectInfo} />
                        <Cell cell={row.wednesdayB} onClick={() => handleCellClick(rowIndex, 'wednesdayB', row.wednesdayB)} getSubjectInfo={getSubjectInfo} />
                      </>
                    ) : activeFilter === 'groupA' ? (
                      <Cell cell={row.wednesdayA} onClick={() => handleCellClick(rowIndex, 'wednesdayA', row.wednesdayA)} getSubjectInfo={getSubjectInfo} />
                    ) : (
                      <Cell cell={row.wednesdayB} onClick={() => handleCellClick(rowIndex, 'wednesdayB', row.wednesdayB)} getSubjectInfo={getSubjectInfo} />
                    )}

                    {/* Thursday Cell(s) */}
                    {activeFilter === 'all' ? (
                      <>
                        <Cell cell={row.thursdayA} onClick={() => handleCellClick(rowIndex, 'thursdayA', row.thursdayA)} getSubjectInfo={getSubjectInfo} />
                        <Cell cell={row.thursdayB} onClick={() => handleCellClick(rowIndex, 'thursdayB', row.thursdayB)} getSubjectInfo={getSubjectInfo} />
                      </>
                    ) : activeFilter === 'groupA' ? (
                      <Cell cell={row.thursdayA} onClick={() => handleCellClick(rowIndex, 'thursdayA', row.thursdayA)} getSubjectInfo={getSubjectInfo} />
                    ) : (
                      <Cell cell={row.thursdayB} onClick={() => handleCellClick(rowIndex, 'thursdayB', row.thursdayB)} getSubjectInfo={getSubjectInfo} />
                    )}

                    {/* Friday Cell(s) */}
                    {activeFilter === 'all' ? (
                      <>
                        <Cell cell={row.fridayA} onClick={() => handleCellClick(rowIndex, 'fridayA', row.fridayA)} getSubjectInfo={getSubjectInfo} />
                        <Cell cell={row.fridayB} onClick={() => handleCellClick(rowIndex, 'fridayB', row.fridayB)} getSubjectInfo={getSubjectInfo} />
                      </>
                    ) : activeFilter === 'groupA' ? (
                      <Cell cell={row.fridayA} onClick={() => handleCellClick(rowIndex, 'fridayA', row.fridayA)} getSubjectInfo={getSubjectInfo} />
                    ) : (
                      <Cell cell={row.fridayB} onClick={() => handleCellClick(rowIndex, 'fridayB', row.fridayB)} getSubjectInfo={getSubjectInfo} />
                    )}
                  </tr>

                  {/* Inject break rows */}
                  {rowIndex === 2 && (
                    <tr className="bg-slate-100/70 border-b border-slate-200">
                      <td className="p-2 text-center text-[10px] uppercase tracking-widest text-primary font-bold bg-slate-100 border-r border-slate-200">
                        Pause
                      </td>
                      <td className="p-2 text-center text-[11px] font-bold text-slate-500 italic" colSpan={activeFilter === 'all' ? 10 : 5}>
                        ☕ Grosse Pause (09:55 – 10:15 Uhr)
                      </td>
                    </tr>
                  )}
                  {rowIndex === 4 && (
                    <tr className="bg-slate-100/70 border-b border-slate-200">
                      <td className="p-2 text-center text-[10px] uppercase tracking-widest text-primary font-bold bg-slate-100 border-r border-slate-200">
                        Mittag
                      </td>
                      <td className="p-2 text-center text-[11px] font-bold text-slate-500 italic" colSpan={activeFilter === 'all' ? 10 : 5}>
                        🍱 Mittagspause (11:50 – 13:30 Uhr)
                      </td>
                    </tr>
                  )}
                  {rowIndex === 6 && (
                    <tr className="bg-slate-100/70 border-b border-slate-200">
                      <td className="p-2 text-center text-[10px] uppercase tracking-widest text-primary font-bold bg-slate-100 border-r border-slate-200">
                        Pause
                      </td>
                      <td className="p-2 text-center text-[11px] font-bold text-slate-500 italic" colSpan={activeFilter === 'all' ? 10 : 5}>
                        🥛 Kurzpause (15:05 – 15:20 Uhr)
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Teachers Contacts & Class Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter font-sans">
        
        {/* Left Card: Teachers Contacts */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">diversity_3</span>
              Lehrpersonen & Kontakt
            </h3>
            <span className="text-[10px] uppercase font-bold text-slate-400">{schoolInfo.name}</span>
          </div>
          
          <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto pr-1">
            {teachers.map((teacher) => (
              <div 
                key={teacher.code}
                onClick={() => setSelectedTeacher(selectedTeacher === teacher.code ? null : teacher.code)}
                className={`py-3 flex items-start justify-between cursor-pointer hover:bg-slate-50 px-2 rounded-xl transition-all ${selectedTeacher === teacher.code ? 'bg-primary/5 border border-primary/20' : ''}`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono uppercase">
                      {teacher.code}
                    </span>
                    <span className="font-bold text-sm text-on-surface">{teacher.name}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-400">{teacher.subject}</p>
                </div>
                
                <div className="text-right">
                  <a 
                    href={`mailto:${teacher.email}`}
                    className="text-xs text-primary font-bold hover:underline flex items-center gap-1 bg-primary/5 px-2.5 py-1 rounded-xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="material-symbols-outlined text-[14px]">mail</span>
                    Senden
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Class Groups & Students */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">groups</span>
              Klasseneinteilung (Gruppen)
            </h3>
            <span className="text-[10px] uppercase font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded">{schoolInfo.class}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-1">
            {groups.map((grp) => (
              <div key={grp.name} className="border border-slate-100 bg-slate-50/50 p-4 rounded-2xl flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-primary border-b border-primary/20 pb-1.5 flex justify-between items-center">
                    <span>{grp.name}</span>
                    <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-mono">{grp.members.length} Schüler</span>
                  </h4>
                  <ul className="mt-3 space-y-2.5">
                    {grp.members.map((member, i) => (
                      <li key={i} className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                        {member}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Dialog for Editing Timetable Cell */}
      <dialog 
        ref={dialogRef}
        closedby="any" 
        className="m-auto rounded-3xl border border-slate-200 p-6 shadow-xl backdrop:backdrop-blur-sm max-w-sm w-full bg-white outline-none"
        aria-labelledby="cell-editor-title"
      >
        <form onSubmit={handleSaveCell} className="space-y-4">
          <h2 id="cell-editor-title" className="text-lg font-extrabold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">edit</span>
            Lektion bearbeiten
          </h2>
          <p className="text-xs text-slate-500 font-semibold">
            Konfiguriere Fach, Lehrperson und Zimmer für diesen Zeitslot.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Fach auswählen</label>
              <select
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none text-sm font-semibold"
                value={formSubject}
                onChange={(e) => handleSubjectChange(e.target.value)}
              >
                <option value="">-- Freistunde / Leer --</option>
                {subjects.map((s) => (
                  <option key={s.subject} value={s.subject}>{s.subject}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Lehrkraft (Kürzel)</label>
              <select
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none text-sm font-semibold"
                value={formTeacher}
                onChange={(e) => setFormTeacher(e.target.value)}
              >
                <option value="">Keine Lehrkraft</option>
                {teachers.map((t) => (
                  <option key={t.code} value={t.code}>{t.name} ({t.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Zimmer / Raum</label>
              <input
                type="text"
                placeholder="z.B. Zimmer 108"
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none text-sm font-semibold"
                value={formRoom}
                onChange={(e) => setFormRoom(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleClearCell}
              className="flex-1 px-4 py-2 border border-error text-error rounded-xl text-xs font-bold hover:bg-error/5 transition-colors"
            >
              Lektion leeren
            </button>
            <button
              type="button"
              onClick={closeCellModal}
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

      {/* Dialog for Editing Lesson Time */}
      <dialog 
        ref={timeDialogRef}
        closedby="any" 
        className="m-auto rounded-3xl border border-slate-200 p-6 shadow-xl backdrop:backdrop-blur-sm max-w-xs w-full bg-white outline-none"
        aria-labelledby="time-editor-title"
      >
        <form onSubmit={handleSaveTime} className="space-y-4">
          <h2 id="time-editor-title" className="text-lg font-extrabold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">schedule</span>
            Zeit anpassen
          </h2>
          <p className="text-xs text-slate-500 font-semibold">
            Passe das Zeitfenster für diese Lektion an.
          </p>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Zeitfenster (z.B. 08:20–09:05)</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none text-sm font-semibold font-mono"
              value={editTimeState?.time || ''}
              onChange={(e) => setEditTimeState(prev => prev ? { ...prev, time: e.target.value } : null)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeTimeModal}
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

// Singular Cell representing a single lesson
interface CellProps {
  cell: TimetableCell;
  onClick: () => void;
  getSubjectInfo: (name: string) => any;
}

function Cell({ cell, onClick, getSubjectInfo }: CellProps) {
  if (!cell.subject) {
    return (
      <td 
        onClick={onClick}
        className="p-2 border-r border-slate-200/60 relative bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgNDAgTDIwIDIwIE0yMCAyMCBMNDAgMCBNMCAyMCBMMjAgMCBNMjAgNDAgTDQwIDIwIiBzdHJva2U9IiNmMThmMmYiIiNzdHJva2Utd2lkdGg9IjAuNyIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==')] overflow-hidden opacity-45 hover:opacity-80 transition-opacity cursor-pointer min-h-[90px]"
        title="Lektion eintragen..."
      />
    );
  }

  const { colorClass, borderClass, bgClass, room, teacherName } = getSubjectInfo(cell.subject);

  return (
    <td className="p-1.5 border-r border-slate-200/60 min-w-[70px]">
      <div 
        onClick={onClick}
        className={`rounded-xl border-l-4 ${borderClass} ${bgClass} p-2 flex flex-col justify-between hover:scale-[1.03] transition-all duration-150 cursor-pointer shadow-xs min-h-[84px] h-full`}
        title="Details bearbeiten..."
      >
        <div className="flex flex-col">
          <span className={`font-extrabold text-[13px] ${colorClass}`}>{cell.subject}</span>
          <span className="text-[10px] text-slate-500 font-semibold truncate" title={teacherName}>{teacherName}</span>
        </div>
        <span className="text-[9px] font-bold text-slate-400 self-end uppercase tracking-wider">{cell.room || room || '-'}</span>
      </div>
    </td>
  );
}
