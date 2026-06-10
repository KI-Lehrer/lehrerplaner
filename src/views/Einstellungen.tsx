import React, { useState } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { Teacher, SubjectDetails, SchoolInfo, PupilGroup } from '../types';

type SettingsTab = 'schulinfo' | 'lehrer' | 'gruppen' | 'faecher' | 'daten';

export default function Einstellungen() {
  const {
    schoolInfo, updateSchoolInfo,
    teachers, addTeacher, updateTeacher, deleteTeacher,
    groups, updateGroups,
    subjects, addSubject, updateSubject, deleteSubject,
    resetAllData
  } = usePlanner();

  const [activeSubTab, setActiveSubTab] = useState<SettingsTab>('schulinfo');

  // Local Form States
  // 1. SchoolInfo
  const [infoForm, setInfoForm] = useState<SchoolInfo>({ ...schoolInfo });
  // 2. Teacher Form
  const [teacherForm, setTeacherForm] = useState<Teacher>({ code: '', name: '', subject: '', email: '' });
  const [editingTeacherCode, setEditingTeacherCode] = useState<string | null>(null);
  // 3. Pupil
  const [newPupilName, setNewPupilName] = useState('');
  const [targetGroup, setTargetGroup] = useState('Gruppe A');
  // 4. Subject Form
  const [subjectForm, setSubjectForm] = useState<SubjectDetails>({
    subject: '', teacher: '', teacherName: '', room: '',
    colorClass: 'text-slate-900', borderClass: 'border-slate-500', bgClass: 'bg-slate-50'
  });
  const [editingSubjectName, setEditingSubjectName] = useState<string | null>(null);

  // Colors mapping for subject configuration
  const COLOR_SCHEMES = [
    { label: 'Indigo / Blau', color: 'text-indigo-900', border: 'border-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Emerald / Grün', color: 'text-emerald-900', border: 'border-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Sky / Hellblau', color: 'text-sky-900', border: 'border-sky-500', bg: 'bg-sky-50' },
    { label: 'Amber / Gelb', color: 'text-amber-900', border: 'border-amber-500', bg: 'bg-amber-50' },
    { label: 'Orange', color: 'text-orange-900', border: 'border-orange-500', bg: 'bg-orange-50' },
    { label: 'Pink / Rosa', color: 'text-pink-900', border: 'border-pink-500', bg: 'bg-pink-50' },
    { label: 'Slate / Dunkelgrau', color: 'text-slate-900', border: 'border-slate-500', bg: 'bg-slate-50' }
  ];

  // Save SchoolInfo
  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolInfo(infoForm);
    alert('Schulinformationen erfolgreich gespeichert!');
  };

  // Add/Edit Teacher
  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherForm.code || !teacherForm.name) {
      alert('Kürzel und Name sind Pflichtfelder!');
      return;
    }

    if (editingTeacherCode) {
      updateTeacher(editingTeacherCode, teacherForm);
      setEditingTeacherCode(null);
    } else {
      if (teachers.some(t => t.code === teacherForm.code)) {
        alert('Ein Lehrer mit diesem Kürzel existiert bereits!');
        return;
      }
      addTeacher(teacherForm);
    }
    setTeacherForm({ code: '', name: '', subject: '', email: '' });
  };

  const handleEditTeacherClick = (t: Teacher) => {
    setEditingTeacherCode(t.code);
    setTeacherForm({ ...t });
  };

  // Pupil Management
  const handleAddPupil = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPupilName.trim()) return;
    
    const updated = groups.map(g => {
      if (g.name === targetGroup) {
        return { ...g, members: [...g.members, newPupilName.trim()].sort() };
      }
      return g;
    });
    updateGroups(updated);
    setNewPupilName('');
  };

  const handleDeletePupil = (groupName: string, name: string) => {
    const updated = groups.map(g => {
      if (g.name === groupName) {
        return { ...g, members: g.members.filter(m => m !== name) };
      }
      return g;
    });
    updateGroups(updated);
  };

  const handleMovePupil = (student: string, fromGroup: string) => {
    const toGroup = fromGroup === 'Gruppe A' ? 'Gruppe B' : 'Gruppe A';
    const updated = groups.map(g => {
      if (g.name === fromGroup) {
        return { ...g, members: g.members.filter(m => m !== student) };
      }
      if (g.name === toGroup) {
        return { ...g, members: [...g.members, student].sort() };
      }
      return g;
    });
    updateGroups(updated);
  };

  // Subject Management
  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectForm.subject) {
      alert('Fachname ist erforderlich!');
      return;
    }

    // Auto-resolve teacher name based on code
    const matchingTeacher = teachers.find(t => t.code === subjectForm.teacher);
    const resolvedSubject = {
      ...subjectForm,
      teacherName: matchingTeacher ? matchingTeacher.name : '-'
    };

    if (editingSubjectName) {
      updateSubject(editingSubjectName, resolvedSubject);
      setEditingSubjectName(null);
    } else {
      if (subjects.some(s => s.subject.toUpperCase() === resolvedSubject.subject.toUpperCase())) {
        alert('Dieses Fach existiert bereits!');
        return;
      }
      addSubject(resolvedSubject);
    }
    setSubjectForm({
      subject: '', teacher: '', teacherName: '', room: '',
      colorClass: 'text-slate-900', borderClass: 'border-slate-500', bgClass: 'bg-slate-50'
    });
  };

  const handleEditSubjectClick = (s: SubjectDetails) => {
    setEditingSubjectName(s.subject);
    setSubjectForm({ ...s });
  };

  // JSON Import/Export
  const handleExportData = () => {
    const data: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('lp_')) {
        data[key] = JSON.parse(localStorage.getItem(key) || '{}');
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LehrerPlaner_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        Object.keys(parsed).forEach(key => {
          if (key.startsWith('lp_')) {
            localStorage.setItem(key, JSON.stringify(parsed[key]));
          }
        });
        alert('Daten erfolgreich importiert! Die Seite wird neu geladen.');
        window.location.reload();
      } catch (err) {
        alert('Ungültiges Backup-Format. Import fehlgeschlagen.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-margin-mobile md:px-margin-desktop py-lg w-full max-w-[1440px] mx-auto min-h-screen space-y-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md border-b border-outline-variant pb-6">
        <div>
          <span className="text-xs font-bold text-primary tracking-widest uppercase block">System & Einstellungen</span>
          <h1 className="font-display-lg text-3xl font-extrabold text-on-surface mt-1">Konfiguration</h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1.5">
            Passe deine Schulinformationen, Lehrer, Gruppen und Fächer an. Alle Änderungen werden direkt in deinem Browser gespeichert.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 bg-slate-50/50 p-2 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveSubTab('schulinfo')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-all ${activeSubTab === 'schulinfo' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <span className="material-symbols-outlined text-[20px]">school</span>
            Schulinformationen
          </button>
          <button
            onClick={() => setActiveSubTab('lehrer')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-all ${activeSubTab === 'lehrer' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <span className="material-symbols-outlined text-[20px]">diversity_3</span>
            Lehrpersonen
          </button>
          <button
            onClick={() => setActiveSubTab('gruppen')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-all ${activeSubTab === 'gruppen' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <span className="material-symbols-outlined text-[20px]">groups</span>
            Klassengruppen
          </button>
          <button
            onClick={() => setActiveSubTab('faecher')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-all ${activeSubTab === 'faecher' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <span className="material-symbols-outlined text-[20px]">menu_book</span>
            Fächer & Räume
          </button>
          <button
            onClick={() => setActiveSubTab('daten')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-all ${activeSubTab === 'daten' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <span className="material-symbols-outlined text-[20px]">database</span>
            Daten verwalten
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
          
          {/* Tab 1: Schulinfo */}
          {activeSubTab === 'schulinfo' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">school</span>
                  Schul- und Klassendetails
                </h2>
                <p className="text-xs text-on-surface-variant mt-1">Hier konfigurierst du die angezeigten Schulmetadaten auf dem Dashboard und Stundenplan.</p>
              </div>

              <form onSubmit={handleSaveInfo} className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Klassenname (z.B. 6B)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold"
                      value={infoForm.class}
                      onChange={e => setInfoForm({ ...infoForm, class: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Schuljahr</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold"
                      value={infoForm.year}
                      onChange={e => setInfoForm({ ...infoForm, year: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Stufe / Zyklus</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold"
                    value={infoForm.level}
                    onChange={e => setInfoForm({ ...infoForm, level: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Schulhaus Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold"
                    value={infoForm.name}
                    onChange={e => setInfoForm({ ...infoForm, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Adresse</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold"
                    value={infoForm.address}
                    onChange={e => setInfoForm({ ...infoForm, address: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Wichtiger Hinweis (z.B. Absenzen-Frist)</label>
                  <textarea
                    rows={2}
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold resize-none"
                    value={infoForm.notice}
                    onChange={e => setInfoForm({ ...infoForm, notice: e.target.value })}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm shadow-md"
                  >
                    Speichern
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 2: Lehrpersonen */}
          {activeSubTab === 'lehrer' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-extrabold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">diversity_3</span>
                  Lehrpersonen verwalten
                </h2>
                <p className="text-xs text-on-surface-variant mt-1">Ergänze Kollegen oder passe Kontaktdaten an.</p>
              </div>

              {/* Form Add/Edit */}
              <form onSubmit={handleSaveTeacher} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Lehrer-Kürzel</label>
                  <input
                    type="text"
                    disabled={editingTeacherCode !== null}
                    placeholder="z.B. KLP, BS"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 outline-none text-sm font-semibold disabled:bg-slate-200/50"
                    value={teacherForm.code}
                    onChange={e => setTeacherForm({ ...teacherForm, code: e.target.value.toUpperCase() })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Name</label>
                  <input
                    type="text"
                    placeholder="z.B. Sascha Lüscher"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 outline-none text-sm font-semibold"
                    value={teacherForm.name}
                    onChange={e => setTeacherForm({ ...teacherForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Hauptfach / Funktion</label>
                  <input
                    type="text"
                    placeholder="z.B. Französisch"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 outline-none text-sm font-semibold"
                    value={teacherForm.subject}
                    onChange={e => setTeacherForm({ ...teacherForm, subject: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">E-Mail</label>
                  <input
                    type="email"
                    placeholder="lehrer@schule.ch"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 outline-none text-sm font-semibold"
                    value={teacherForm.email}
                    onChange={e => setTeacherForm({ ...teacherForm, email: e.target.value })}
                  />
                </div>

                <div className="md:col-span-4 flex justify-end gap-2 pt-2">
                  {editingTeacherCode && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTeacherCode(null);
                        setTeacherForm({ code: '', name: '', subject: '', email: '' });
                      }}
                      className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-100"
                    >
                      Abbrechen
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl text-xs shadow-sm hover:opacity-90 active:scale-95"
                  >
                    {editingTeacherCode ? 'Lehrperson aktualisieren' : 'Lehrperson hinzufügen'}
                  </button>
                </div>
              </form>

              {/* List */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Kürzel</th>
                      <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                      <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Fach / Rolle</th>
                      <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider">E-Mail</th>
                      <th className="p-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {teachers.map(t => (
                      <tr key={t.code} className="hover:bg-slate-50/50">
                        <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-xs font-bold">{t.code}</span></td>
                        <td className="p-3 font-bold text-on-surface">{t.name}</td>
                        <td className="p-3 text-slate-500 text-xs">{t.subject}</td>
                        <td className="p-3 text-slate-500 text-xs">{t.email}</td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={() => handleEditTeacherClick(t)}
                            className="p-1.5 text-primary hover:bg-primary/5 rounded-lg transition-colors material-symbols-outlined text-[18px]"
                            title="Bearbeiten"
                          >
                            edit
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Möchtest du ${t.name} wirklich löschen?`)) {
                                deleteTeacher(t.code);
                              }
                            }}
                            className="p-1.5 text-error hover:bg-error/5 rounded-lg transition-colors material-symbols-outlined text-[18px]"
                            title="Löschen"
                          >
                            delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Gruppen */}
          {activeSubTab === 'gruppen' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">groups</span>
                  Schülerklasseneinteilungen (Gruppen)
                </h2>
                <p className="text-xs text-on-surface-variant mt-1">Füge Schüler zu den Gruppen A und B hinzu oder verschiebe sie.</p>
              </div>

              {/* Form to add pupil */}
              <form onSubmit={handleAddPupil} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Schüler Name</label>
                  <input
                    type="text"
                    placeholder="z.B. Julian Lüscher"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 outline-none text-sm font-semibold"
                    value={newPupilName}
                    onChange={e => setNewPupilName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Gruppe</label>
                  <select
                    className="px-3 py-2 bg-white rounded-xl border border-slate-200 outline-none text-sm font-semibold"
                    value={targetGroup}
                    onChange={e => setTargetGroup(e.target.value)}
                  >
                    <option value="Gruppe A">Gruppe A</option>
                    <option value="Gruppe B">Gruppe B</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white font-bold rounded-xl text-xs hover:opacity-90 active:scale-95 transition-all shadow-sm"
                >
                  Schüler hinzufügen
                </button>
              </form>

              {/* Groups Lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {groups.map(g => (
                  <div key={g.name} className="border border-slate-200 rounded-2xl p-5 bg-slate-50/20">
                    <h3 className="text-base font-extrabold text-primary border-b border-slate-100 pb-2 mb-3 flex justify-between items-center">
                      <span>{g.name}</span>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{g.members.length} Schüler</span>
                    </h3>
                    <ul className="space-y-2">
                      {g.members.map((member, i) => (
                        <li key={i} className="flex justify-between items-center bg-white border border-slate-100 px-3 py-2 rounded-xl text-xs font-semibold hover:border-slate-300 transition-colors">
                          <span className="text-on-surface">{member}</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleMovePupil(member, g.name)}
                              className="p-1 hover:bg-slate-100 rounded text-primary material-symbols-outlined text-[16px]"
                              title={g.name === 'Gruppe A' ? 'Zu Gruppe B verschieben' : 'Zu Gruppe A verschieben'}
                            >
                              swap_horiz
                            </button>
                            <button
                              onClick={() => handleDeletePupil(g.name, member)}
                              className="p-1 hover:bg-error/5 text-error rounded material-symbols-outlined text-[16px]"
                              title="Löschen"
                            >
                              close
                            </button>
                          </div>
                        </li>
                      ))}
                      {g.members.length === 0 && (
                        <p className="text-xs text-outline italic text-center py-4">Keine Schüler in dieser Gruppe.</p>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Fächer */}
          {activeSubTab === 'faecher' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-extrabold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">menu_book</span>
                  Fächer & Farben
                </h2>
                <p className="text-xs text-on-surface-variant mt-1">Bearbeite Standardräume, Lehrpersonen und Farbthemen für deine Stundenplanzellen.</p>
              </div>

              {/* Form Add/Edit */}
              <form onSubmit={handleSaveSubject} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Fach-Code (z.B. BS, F, E)</label>
                    <input
                      type="text"
                      disabled={editingSubjectName !== null}
                      placeholder="z.B. MA"
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 outline-none text-sm font-semibold disabled:bg-slate-200/50"
                      value={subjectForm.subject}
                      onChange={e => setSubjectForm({ ...subjectForm, subject: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Standardraum</label>
                    <input
                      type="text"
                      placeholder="z.B. Zimmer 104"
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 outline-none text-sm font-semibold"
                      value={subjectForm.room}
                      onChange={e => setSubjectForm({ ...subjectForm, room: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Standard-Lehrer</label>
                    <select
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 outline-none text-sm font-semibold"
                      value={subjectForm.teacher}
                      onChange={e => setSubjectForm({ ...subjectForm, teacher: e.target.value })}
                    >
                      <option value="">Keine Zuweisung</option>
                      {teachers.map(t => (
                        <option key={t.code} value={t.code}>{t.name} ({t.code})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Farbschema</label>
                    <select
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 outline-none text-sm font-semibold"
                      value={COLOR_SCHEMES.findIndex(c => c.color === subjectForm.colorClass)}
                      onChange={e => {
                        const scheme = COLOR_SCHEMES[parseInt(e.target.value)];
                        if (scheme) {
                          setSubjectForm({
                            ...subjectForm,
                            colorClass: scheme.color,
                            borderClass: scheme.border,
                            bgClass: scheme.bg
                          });
                        }
                      }}
                    >
                      {COLOR_SCHEMES.map((c, idx) => (
                        <option key={idx} value={idx}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  {editingSubjectName && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSubjectName(null);
                        setSubjectForm({
                          subject: '', teacher: '', teacherName: '', room: '',
                          colorClass: 'text-slate-900', borderClass: 'border-slate-500', bgClass: 'bg-slate-50'
                        });
                      }}
                      className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-100"
                    >
                      Abbrechen
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl text-xs shadow-sm hover:opacity-90 active:scale-95"
                  >
                    {editingSubjectName ? 'Fach aktualisieren' : 'Fach hinzufügen'}
                  </button>
                </div>
              </form>

              {/* List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {subjects.map(s => (
                  <div key={s.subject} className={`border-l-4 ${s.borderClass} ${s.bgClass} p-4 rounded-xl border border-slate-200/50 flex flex-col justify-between hover:shadow-sm transition-shadow`}>
                    <div className="space-y-1">
                      <div className="flex justify-between items-start">
                        <span className={`font-extrabold text-base ${s.colorClass}`}>{s.subject}</span>
                        <div className="space-x-1">
                          <button
                            onClick={() => handleEditSubjectClick(s)}
                            className="p-1 text-primary hover:bg-white/50 rounded material-symbols-outlined text-[16px]"
                          >
                            edit
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Fach ${s.subject} wirklich löschen?`)) {
                                deleteSubject(s.subject);
                              }
                            }}
                            className="p-1 text-error hover:bg-white/50 rounded material-symbols-outlined text-[16px]"
                          >
                            delete
                          </button>
                        </div>
                      </div>
                      <p className="text-xs font-bold text-slate-700">Raum: <span className="font-semibold text-slate-500">{s.room || '-'}</span></p>
                      <p className="text-xs font-bold text-slate-700">Lehrer: <span className="font-semibold text-slate-500">{s.teacherName || '-'} ({s.teacher})</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: Daten */}
          {activeSubTab === 'daten' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-extrabold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">database</span>
                  Daten Backup & Systemsteuerung
                </h2>
                <p className="text-xs text-on-surface-variant mt-1">Hier kannst du all deine Planer-Daten sichern, wiederherstellen oder komplett zurücksetzen.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Backup export/import */}
                <div className="border border-slate-200 p-6 rounded-2xl bg-slate-50/50 space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-800">Sichern & Wiederherstellen</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Sichere deine Daten regelmäßig. Du kannst eine Backup-Datei exportieren und sie später auf jedem beliebigen Browser/Gerät wieder importieren.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={handleExportData}
                      className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl text-xs hover:opacity-90 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">download</span>
                      Backup exportieren
                    </button>
                    <label className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-100 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer text-center">
                      <span className="material-symbols-outlined text-[16px]">upload</span>
                      Backup einlesen
                      <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={handleImportData}
                      />
                    </label>
                  </div>
                </div>

                {/* Reset Database */}
                <div className="border border-error/20 p-6 rounded-2xl bg-error/5 space-y-4">
                  <h3 className="text-sm font-extrabold text-error">Gefahrenbereich</h3>
                  <p className="text-xs text-error/80 leading-relaxed">
                    Setze alle deine Stundenpläne, Notizen, Schülergruppen und Konfigurationen auf den Auslieferungszustand zurück.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={resetAllData}
                      className="px-5 py-2.5 bg-error text-white font-bold rounded-xl text-xs hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                      Alles zurücksetzen
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
