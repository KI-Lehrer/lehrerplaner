import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  SchoolInfo, Teacher, PupilGroup, TimetableRow, TimetableCell, 
  SubjectDetails, Todo, LessonPlan, CalendarEvent, Appointment 
} from '../types';

interface PlannerContextType {
  schoolInfo: SchoolInfo;
  updateSchoolInfo: (info: SchoolInfo) => void;
  teachers: Teacher[];
  addTeacher: (teacher: Teacher) => void;
  updateTeacher: (oldCode: string, teacher: Teacher) => void;
  deleteTeacher: (code: string) => void;
  groups: PupilGroup[];
  updateGroups: (groups: PupilGroup[]) => void;
  subjects: SubjectDetails[];
  addSubject: (subject: SubjectDetails) => void;
  updateSubject: (oldName: string, subject: SubjectDetails) => void;
  deleteSubject: (name: string) => void;
  getSubjectInfo: (name: string) => SubjectDetails;
  timetableData: TimetableRow[];
  updateTimetableCell: (rowIndex: number, dayKey: keyof TimetableRow, cell: TimetableCell) => void;
  updateTimetableRowTime: (rowIndex: number, newTime: string) => void;
  todos: Todo[];
  addTodo: (todo: Omit<Todo, 'id'>) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  quickNotes: string;
  updateQuickNotes: (text: string) => void;
  appointments: Appointment[];
  addAppointment: (app: Omit<Appointment, 'id'>) => void;
  deleteAppointment: (id: string) => void;
  calendarEvents: CalendarEvent[];
  setCalendarEvent: (date: string, type: CalendarEvent['type'] | null, text: string) => void;
  lessonPlans: Record<string, LessonPlan>;
  saveLessonPlan: (date: string, lessonIndex: number, plan: LessonPlan) => void;
  resetAllData: () => void;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

// Static Default Data
const DEFAULT_SCHOOL_INFO: SchoolInfo = {
  class: '6B',
  level: 'Zyklus 2 – Mittelstufe 2',
  year: '2026/2027',
  name: 'Schule Suhr',
  address: 'Tramstrasse 20, 5034 Suhr',
  notice: 'Bei Krankheitsfall bitte bis 07:00 Uhr abmelden. Besten Dank.'
};

const DEFAULT_TEACHERS: Teacher[] = [
  { code: 'KLP', subject: 'Klassenlehrperson / Regelunterricht (X)', name: 'Sascha Lüscher', email: 'sascha.luescher@schule-suhr.ch' },
  { code: 'BS', subject: 'Bewegung und Sport', name: 'Philipp Achermann', email: 'philipp.achermann@schule-suhr.ch' },
  { code: 'E', subject: 'Englisch', name: 'Milena Jevric', email: 'milena.jevric@schule-suhr.ch' },
  { code: 'F', subject: 'Französisch', name: 'Romane Segal', email: 'romane.segal@schule-suhr.ch' },
  { code: 'MU', subject: 'Musik', name: 'Sarah Schmid', email: 'sarah.schmid@schule-suhr.ch' },
  { code: 'TTG', subject: 'Textiles Werken / Gestalten', name: 'Laura Bisang', email: 'Laura.bisang@schule-suhr.ch' },
  { code: 'SHP', subject: 'Schulischer Heilpädagoge', name: 'Andreas Sager', email: 'andreas.sager@schule-suhr.ch' }
];

const DEFAULT_GROUPS: PupilGroup[] = [
  {
    name: 'Gruppe A',
    members: ['Hamza', 'Bitanya', 'Sophia', 'Serenay', 'Danin', 'Nicolas', 'Julian', 'Lia']
  },
  {
    name: 'Gruppe B',
    members: ['Eric', 'Rebecca', 'Aya', 'Chriss', 'Adele', 'Lorian', 'Sarah', 'Tim', 'Erdi']
  }
];

const DEFAULT_SUBJECTS: SubjectDetails[] = [
  {
    subject: 'BS',
    teacher: 'BS',
    teacherName: 'Philipp Achermann',
    room: 'Turnhalle',
    colorClass: 'text-emerald-900',
    borderClass: 'border-emerald-500',
    bgClass: 'bg-emerald-50'
  },
  {
    subject: 'F',
    teacher: 'F',
    teacherName: 'Romane Segal',
    room: 'Zimmer 104',
    colorClass: 'text-indigo-900',
    borderClass: 'border-indigo-500',
    bgClass: 'bg-indigo-50'
  },
  {
    subject: 'E',
    teacher: 'E',
    teacherName: 'Milena Jevric',
    room: 'Zimmer 108',
    colorClass: 'text-sky-900',
    borderClass: 'border-sky-500',
    bgClass: 'bg-sky-50'
  },
  {
    subject: 'MU',
    teacher: 'MU',
    teacherName: 'Sarah Schmid',
    room: 'Musikzimmer',
    colorClass: 'text-amber-900',
    borderClass: 'border-amber-500',
    bgClass: 'bg-amber-50'
  },
  {
    subject: 'TTG',
    teacher: 'TTG',
    teacherName: 'Laura Bisang',
    room: 'TTG-Werkraum',
    colorClass: 'text-orange-900',
    borderClass: 'border-orange-500',
    bgClass: 'bg-orange-50'
  },
  {
    subject: 'Chor',
    teacher: 'MU',
    teacherName: 'Sarah Schmid',
    room: 'Aula O',
    colorClass: 'text-pink-900',
    borderClass: 'border-pink-500',
    bgClass: 'bg-pink-50'
  },
  {
    subject: 'X',
    teacher: 'KLP',
    teacherName: 'Sascha Lüscher',
    room: 'Klassenzimmer 6B',
    colorClass: 'text-slate-900',
    borderClass: 'border-slate-500',
    bgClass: 'bg-slate-50'
  },
  {
    subject: 'X / Pool',
    teacher: 'KLP',
    teacherName: 'Sascha Lüscher',
    room: 'Klassenzimmer 6B',
    colorClass: 'text-slate-900',
    borderClass: 'border-slate-500',
    bgClass: 'bg-slate-50'
  }
];

const DEFAULT_TIMETABLE_DATA: TimetableRow[] = [
  {
    time: '07:30–08:15',
    mondayA: { subject: '', teacherCode: '' },
    mondayB: { subject: '', teacherCode: '' },
    tuesdayA: { subject: 'F', teacherCode: 'F' },
    tuesdayB: { subject: '', teacherCode: '' },
    wednesdayA: { subject: 'X', teacherCode: 'KLP' },
    wednesdayB: { subject: '', teacherCode: '' },
    thursdayA: { subject: '', teacherCode: '' },
    thursdayB: { subject: '', teacherCode: '' },
    fridayA: { subject: 'X', teacherCode: 'KLP' },
    fridayB: { subject: '', teacherCode: '' }
  },
  {
    time: '08:20–09:05',
    mondayA: { subject: 'BS', teacherCode: 'BS' },
    mondayB: { subject: '', teacherCode: '' },
    tuesdayA: { subject: 'X', teacherCode: 'KLP' },
    tuesdayB: { subject: '', teacherCode: '' },
    wednesdayA: { subject: 'X', teacherCode: 'KLP' },
    wednesdayB: { subject: '', teacherCode: '' },
    thursdayA: { subject: 'X', teacherCode: 'KLP' },
    thursdayB: { subject: 'E', teacherCode: 'E' },
    fridayA: { subject: 'X', teacherCode: 'KLP' },
    fridayB: { subject: '', teacherCode: '' }
  },
  {
    time: '09:10–09:55',
    mondayA: { subject: 'X', teacherCode: 'KLP' },
    mondayB: { subject: '', teacherCode: '' },
    tuesdayA: { subject: 'X', teacherCode: 'KLP' },
    tuesdayB: { subject: '', teacherCode: '' },
    wednesdayA: { subject: 'X', teacherCode: 'KLP' },
    wednesdayB: { subject: '', teacherCode: '' },
    thursdayA: { subject: 'MU', teacherCode: 'MU' },
    thursdayB: { subject: '', teacherCode: '' },
    fridayA: { subject: 'X', teacherCode: 'KLP' },
    fridayB: { subject: '', teacherCode: '' }
  },
  {
    time: '10:15–11:00',
    mondayA: { subject: 'F', teacherCode: 'F' },
    mondayB: { subject: '', teacherCode: '' },
    tuesdayA: { subject: 'BS', teacherCode: 'BS' },
    tuesdayB: { subject: '', teacherCode: '' },
    wednesdayA: { subject: 'E', teacherCode: 'E' },
    wednesdayB: { subject: '', teacherCode: '' },
    thursdayA: { subject: 'E', teacherCode: 'E' },
    thursdayB: { subject: 'X', teacherCode: 'KLP' },
    fridayA: { subject: 'X', teacherCode: 'KLP' },
    fridayB: { subject: '', teacherCode: '' }
  },
  {
    time: '11:05–11:50',
    mondayA: { subject: 'X', teacherCode: 'KLP' },
    mondayB: { subject: '', teacherCode: '' },
    tuesdayA: { subject: 'X', teacherCode: 'KLP' },
    tuesdayB: { subject: '', teacherCode: '' },
    wednesdayA: { subject: 'X / Pool', teacherCode: 'KLP' },
    wednesdayB: { subject: '', teacherCode: '' },
    thursdayA: { subject: 'X', teacherCode: 'KLP' },
    thursdayB: { subject: '', teacherCode: '' },
    fridayA: { subject: 'X', teacherCode: 'KLP' },
    fridayB: { subject: '', teacherCode: '' }
  },
  {
    time: '13:30–14:15',
    mondayA: { subject: 'Chor', teacherCode: 'MU' },
    mondayB: { subject: '', teacherCode: '' },
    tuesdayA: { subject: 'TTG', teacherCode: 'TTG' },
    tuesdayB: { subject: '', teacherCode: '' },
    wednesdayA: { subject: '', teacherCode: '' },
    wednesdayB: { subject: '', teacherCode: '' },
    thursdayA: { subject: 'BS', teacherCode: 'BS' },
    thursdayB: { subject: '', teacherCode: '' },
    fridayA: { subject: '', teacherCode: '' },
    fridayB: { subject: '', teacherCode: '' }
  },
  {
    time: '14:20–15:05',
    mondayA: { subject: 'X / Pool', teacherCode: 'KLP' },
    mondayB: { subject: '', teacherCode: '' },
    tuesdayA: { subject: 'TTG', teacherCode: 'TTG' },
    tuesdayB: { subject: '', teacherCode: '' },
    wednesdayA: { subject: '', teacherCode: '' },
    wednesdayB: { subject: '', teacherCode: '' },
    thursdayA: { subject: 'X', teacherCode: 'KLP' },
    thursdayB: { subject: 'F', teacherCode: 'F' },
    fridayA: { subject: '', teacherCode: '' },
    fridayB: { subject: '', teacherCode: '' }
  },
  {
    time: '15:20–16:05',
    mondayA: { subject: '', teacherCode: '' },
    mondayB: { subject: '', teacherCode: '' },
    tuesdayA: { subject: '', teacherCode: '' },
    tuesdayB: { subject: '', teacherCode: '' },
    wednesdayA: { subject: '', teacherCode: '' },
    wednesdayB: { subject: '', teacherCode: '' },
    thursdayA: { subject: 'F', teacherCode: 'F' },
    thursdayB: { subject: 'X', teacherCode: 'KLP' },
    fridayA: { subject: '', teacherCode: '' },
    fridayB: { subject: '', teacherCode: '' }
  }
];

const DEFAULT_TODOS: Todo[] = [
  {
    id: '1',
    title: 'Mathetest Klasse 9b korrigieren',
    description: '28 Arbeiten, Schwerpunkt: Lineare Gleichungssysteme.',
    category: 'korrekturen',
    priority: 1,
    date: 'Heute',
    progress: 0,
    classLabel: '9B',
    completed: false
  },
  {
    id: '2',
    title: 'Diktat Kl. 5a',
    description: 'Diktat zum Thema Groß-/Kleinschreibung.',
    category: 'korrekturen',
    priority: 2,
    date: 'Fr, 14:00',
    progress: 45,
    classLabel: '5A',
    completed: false
  },
  {
    id: '3',
    title: 'Stationenlernen Zellbiologie',
    description: 'Materialien laminieren und QR-Codes drucken.',
    category: 'vorbereitung',
    priority: 2,
    date: 'Mo, 08:00',
    progress: 0,
    classLabel: 'Bio',
    completed: false
  },
  {
    id: '4',
    title: 'Rückmeldung Fam. Müller',
    description: 'Wegen Klassenfahrt-Anmeldung und Allergien.',
    category: 'elternarbeit',
    priority: 1,
    date: 'Überfällig',
    progress: 0,
    classLabel: 'Anruf',
    completed: false
  },
  {
    id: '5',
    title: 'Absenzenkontrolle Suhr',
    description: 'Tägliche Absenzen im Schulportal erfassen.',
    category: 'verwaltung',
    priority: 1,
    date: 'Bis 08:30 Uhr',
    progress: 0,
    classLabel: 'Schule',
    completed: false
  },
  {
    id: '6',
    title: 'TTG Absprachen (Laura)',
    description: 'Gruppen-Material für Holzbearbeitung bereitstellen',
    category: 'vorbereitung',
    priority: 3,
    date: '',
    progress: 0,
    classLabel: 'TTG',
    completed: false
  }
];

const DEFAULT_APPOINTMENTS: Appointment[] = [
  { id: '1', time: '07:00', text: 'Krankheits-Abmeldungen (Limit für Suhr Eltern)', type: 'krankheit' },
  { id: '2', time: '11:50', text: 'Pool-Stunden Absprache (Team-Besprechung)', type: 'besprechung' }
];

const DEFAULT_CALENDAR_EVENTS: CalendarEvent[] = [
  { date: '2026-08-11', type: 'ferien', text: 'Sommerferien Ende' },
  { date: '2026-08-12', type: 'ferien', text: 'Sommerferien Ende' },
  { date: '2026-08-13', type: 'ferien', text: 'Sommerferien Ende' },
  { date: '2026-08-14', type: 'ferien', text: 'Sommerferien Ende' },
  { date: '2026-08-15', type: 'ferien', text: 'Sommerferien Ende' },
  { date: '2026-08-16', type: 'ferien', text: 'Sommerferien Ende' },
  { date: '2026-08-17', type: 'ferien', text: 'Sommerferien Ende' },
  { date: '2026-08-18', type: 'ferien', text: 'Sommerferien Ende' },
  { date: '2026-08-21', type: 'konferenz', text: 'Schuljahresbeginn' },
  { date: '2026-10-03', type: 'feiertag', text: 'Tag der dt. Einheit' },
  { date: '2026-10-16', type: 'ferien', text: 'Herbstferien' },
  { date: '2026-10-17', type: 'ferien', text: 'Herbstferien' },
  { date: '2026-10-18', type: 'ferien', text: 'Herbstferien' },
  { date: '2026-10-19', type: 'ferien', text: 'Herbstferien' },
  { date: '2026-10-20', type: 'ferien', text: 'Herbstferien' },
  { date: '2026-10-21', type: 'ferien', text: 'Herbstferien' },
  { date: '2026-10-22', type: 'ferien', text: 'Herbstferien' },
  { date: '2026-10-23', type: 'ferien', text: 'Herbstferien' },
  { date: '2026-10-24', type: 'ferien', text: 'Herbstferien' },
  { date: '2026-10-25', type: 'ferien', text: 'Herbstferien' },
  { date: '2026-12-21', type: 'ferien', text: 'Weihnachtsferien' },
  { date: '2026-12-22', type: 'ferien', text: 'Weihnachtsferien' },
  { date: '2026-12-23', type: 'ferien', text: 'Weihnachtsferien' },
  { date: '2026-12-24', type: 'ferien', text: 'Weihnachtsferien' },
  { date: '2026-12-25', type: 'feiertag', text: 'Weihnachten' },
  { date: '2026-12-26', type: 'feiertag', text: 'Weihnachten' },
  { date: '2027-01-01', type: 'feiertag', text: 'Neujahr' },
  { date: '2027-01-02', type: 'ferien', text: 'Weihnachtsferien' },
  { date: '2027-01-03', type: 'ferien', text: 'Weihnachtsferien' },
  { date: '2027-01-04', type: 'ferien', text: 'Weihnachtsferien' },
  { date: '2027-01-05', type: 'ferien', text: 'Weihnachtsferien' },
  { date: '2027-01-15', type: 'pruefung', text: 'Notenschluss' }
];

export const PlannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(() => {
    const saved = localStorage.getItem('lp_school_info');
    return saved ? JSON.parse(saved) : DEFAULT_SCHOOL_INFO;
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('lp_teachers');
    return saved ? JSON.parse(saved) : DEFAULT_TEACHERS;
  });

  const [groups, setGroups] = useState<PupilGroup[]>(() => {
    const saved = localStorage.getItem('lp_groups');
    return saved ? JSON.parse(saved) : DEFAULT_GROUPS;
  });

  const [subjects, setSubjects] = useState<SubjectDetails[]>(() => {
    const saved = localStorage.getItem('lp_subjects');
    return saved ? JSON.parse(saved) : DEFAULT_SUBJECTS;
  });

  const [timetableData, setTimetableData] = useState<TimetableRow[]>(() => {
    const saved = localStorage.getItem('lp_timetable_data');
    return saved ? JSON.parse(saved) : DEFAULT_TIMETABLE_DATA;
  });

  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('lp_todos');
    return saved ? JSON.parse(saved) : DEFAULT_TODOS;
  });

  const [quickNotes, setQuickNotesState] = useState<string>(() => {
    const saved = localStorage.getItem('lp_quick_notes');
    return saved ? JSON.parse(saved) : 'Was gibt es heute sonst noch zu beachten? Notizen hier eintragen...';
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('lp_appointments');
    return saved ? JSON.parse(saved) : DEFAULT_APPOINTMENTS;
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('lp_calendar_events');
    return saved ? JSON.parse(saved) : DEFAULT_CALENDAR_EVENTS;
  });

  const [lessonPlans, setLessonPlans] = useState<Record<string, LessonPlan>>(() => {
    const saved = localStorage.getItem('lp_lesson_plans');
    return saved ? JSON.parse(saved) : {};
  });

  // Persist states to LocalStorage
  useEffect(() => {
    localStorage.setItem('lp_school_info', JSON.stringify(schoolInfo));
  }, [schoolInfo]);

  useEffect(() => {
    localStorage.setItem('lp_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('lp_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('lp_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('lp_timetable_data', JSON.stringify(timetableData));
  }, [timetableData]);

  useEffect(() => {
    localStorage.setItem('lp_todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('lp_quick_notes', JSON.stringify(quickNotes));
  }, [quickNotes]);

  useEffect(() => {
    localStorage.setItem('lp_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('lp_calendar_events', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem('lp_lesson_plans', JSON.stringify(lessonPlans));
  }, [lessonPlans]);

  // Handler Functions
  const updateSchoolInfo = (info: SchoolInfo) => {
    setSchoolInfo(info);
  };

  const addTeacher = (teacher: Teacher) => {
    setTeachers(prev => [...prev.filter(t => t.code !== teacher.code), teacher]);
  };

  const updateTeacher = (oldCode: string, teacher: Teacher) => {
    setTeachers(prev => {
      const updated = prev.map(t => t.code === oldCode ? teacher : t);
      // Also update timetable data teacherCode if code changed
      if (oldCode !== teacher.code) {
        setTimetableData(prevTimetable => {
          return prevTimetable.map(row => {
            const keys: (keyof TimetableRow)[] = [
              'mondayA', 'mondayB', 'tuesdayA', 'tuesdayB', 'wednesdayA', 'wednesdayB', 
              'thursdayA', 'thursdayB', 'fridayA', 'fridayB'
            ];
            const updatedRow = { ...row };
            keys.forEach(k => {
              const cell = updatedRow[k] as TimetableCell;
              if (cell && cell.teacherCode === oldCode) {
                updatedRow[k] = { ...cell, teacherCode: teacher.code };
              }
            });
            return updatedRow;
          });
        });
      }
      return updated;
    });
  };

  const deleteTeacher = (code: string) => {
    setTeachers(prev => prev.filter(t => t.code !== code));
  };

  const updateGroups = (newGroups: PupilGroup[]) => {
    setGroups(newGroups);
  };

  const addSubject = (subject: SubjectDetails) => {
    setSubjects(prev => [...prev.filter(s => s.subject.toUpperCase() !== subject.subject.toUpperCase()), subject]);
  };

  const updateSubject = (oldName: string, subject: SubjectDetails) => {
    setSubjects(prev => {
      const updated = prev.map(s => s.subject.toUpperCase() === oldName.toUpperCase() ? subject : s);
      // Also update timetable if subject name changed
      if (oldName.toUpperCase() !== subject.subject.toUpperCase()) {
        setTimetableData(prevTimetable => {
          return prevTimetable.map(row => {
            const keys: (keyof TimetableRow)[] = [
              'mondayA', 'mondayB', 'tuesdayA', 'tuesdayB', 'wednesdayA', 'wednesdayB', 
              'thursdayA', 'thursdayB', 'fridayA', 'fridayB'
            ];
            const updatedRow = { ...row };
            keys.forEach(k => {
              const cell = updatedRow[k] as TimetableCell;
              if (cell && cell.subject.toUpperCase() === oldName.toUpperCase()) {
                updatedRow[k] = { ...cell, subject: subject.subject };
              }
            });
            return updatedRow;
          });
        });
      }
      return updated;
    });
  };

  const deleteSubject = (name: string) => {
    setSubjects(prev => prev.filter(s => s.subject.toUpperCase() !== name.toUpperCase()));
  };

  const getSubjectInfo = (name: string): SubjectDetails => {
    const norm = name.trim().toUpperCase();
    const found = subjects.find(s => s.subject.toUpperCase() === norm || norm.startsWith(s.subject.toUpperCase()));
    if (found) return found;

    // Resolve details using matching defaults or general fallback
    // Try to find default values for teachers
    const matchedTeacher = teachers.find(t => t.code === norm || t.subject.toUpperCase().includes(norm));
    
    return {
      subject: name,
      teacher: matchedTeacher ? matchedTeacher.code : '-',
      teacherName: matchedTeacher ? matchedTeacher.name : '-',
      room: '-',
      colorClass: 'text-gray-900',
      borderClass: 'border-gray-300',
      bgClass: 'bg-gray-50'
    };
  };

  const updateTimetableCell = (rowIndex: number, dayKey: keyof TimetableRow, cell: TimetableCell) => {
    setTimetableData(prev => {
      const updated = [...prev];
      updated[rowIndex] = {
        ...updated[rowIndex],
        [dayKey]: cell
      };
      return updated;
    });
  };

  const updateTimetableRowTime = (rowIndex: number, newTime: string) => {
    setTimetableData(prev => {
      const updated = [...prev];
      updated[rowIndex] = {
        ...updated[rowIndex],
        time: newTime
      };
      return updated;
    });
  };

  const addTodo = (todo: Omit<Todo, 'id'>) => {
    const newTodo: Todo = {
      ...todo,
      id: Math.random().toString(36).substring(2, 9)
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const updateQuickNotes = (text: string) => {
    setQuickNotesState(text);
  };

  const addAppointment = (app: Omit<Appointment, 'id'>) => {
    const newApp: Appointment = {
      ...app,
      id: Math.random().toString(36).substring(2, 9)
    };
    setAppointments(prev => [...prev, newApp]);
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const setCalendarEvent = (date: string, type: CalendarEvent['type'] | null, text: string) => {
    setCalendarEvents(prev => {
      const filtered = prev.filter(e => e.date !== date);
      if (type === null) {
        return filtered;
      }
      return [...filtered, { date, type, text }];
    });
  };

  const saveLessonPlan = (date: string, lessonIndex: number, plan: LessonPlan) => {
    setLessonPlans(prev => ({
      ...prev,
      [`${date}_${lessonIndex}`]: plan
    }));
  };

  const resetAllData = () => {
    if (window.confirm('Möchtest du wirklich alle Daten auf die Standardwerte zurücksetzen? Alle manuellen Änderungen gehen verloren.')) {
      setSchoolInfo(DEFAULT_SCHOOL_INFO);
      setTeachers(DEFAULT_TEACHERS);
      setGroups(DEFAULT_GROUPS);
      setSubjects(DEFAULT_SUBJECTS);
      setTimetableData(DEFAULT_TIMETABLE_DATA);
      setTodos(DEFAULT_TODOS);
      setQuickNotesState('Was gibt es heute sonst noch zu beachten? Notizen hier eintragen...');
      setAppointments(DEFAULT_APPOINTMENTS);
      setCalendarEvents(DEFAULT_CALENDAR_EVENTS);
      setLessonPlans({});
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <PlannerContext.Provider value={{
      schoolInfo, updateSchoolInfo,
      teachers, addTeacher, updateTeacher, deleteTeacher,
      groups, updateGroups,
      subjects, addSubject, updateSubject, deleteSubject, getSubjectInfo,
      timetableData, updateTimetableCell, updateTimetableRowTime,
      todos, addTodo, updateTodo, deleteTodo,
      quickNotes, updateQuickNotes,
      appointments, addAppointment, deleteAppointment,
      calendarEvents, setCalendarEvent,
      lessonPlans, saveLessonPlan,
      resetAllData
    }}>
      {children}
    </PlannerContext.Provider>
  );
};

export const usePlanner = () => {
  const context = useContext(PlannerContext);
  if (context === undefined) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
};
