export interface Teacher {
  code: string;
  subject: string;
  name: string;
  email: string;
}

export interface PupilGroup {
  name: string;
  members: string[];
}

export interface TimetableCell {
  subject: string; // e.g. "BS", "X", "F", "E", "TTG", "MU", "Chor", "X / Pool", ""
  teacherCode: string;
  room?: string;
}

export interface TimetableRow {
  time: string;
  mondayA: TimetableCell;
  mondayB: TimetableCell;
  tuesdayA: TimetableCell;
  tuesdayB: TimetableCell;
  wednesdayA: TimetableCell;
  wednesdayB: TimetableCell;
  thursdayA: TimetableCell;
  thursdayB: TimetableCell;
  fridayA: TimetableCell;
  fridayB: TimetableCell;
}

export const SCHOOL_INFO = {
  class: '6B',
  level: 'Zyklus 2 – Mittelstufe 2',
  year: '2026/2027',
  name: 'Schule Suhr',
  address: 'Tramstrasse 20, 5034 Suhr',
  notice: 'Bei Krankheitsfall bitte bis 07:00 Uhr abmelden. Besten Dank.'
};

export const TEACHERS: Teacher[] = [
  { code: 'KLP', subject: 'Klassenlehrperson / Regelunterricht (X)', name: 'Sascha Lüscher', email: 'sascha.luescher@schule-suhr.ch' },
  { code: 'BS', subject: 'Bewegung und Sport', name: 'Philipp Achermann', email: 'philipp.achermann@schule-suhr.ch' },
  { code: 'E', subject: 'Englisch', name: 'Milena Jevric', email: 'milena.jevric@schule-suhr.ch' },
  { code: 'F', subject: 'Französisch', name: 'Romane Segal', email: 'romane.segal@schule-suhr.ch' },
  { code: 'MU', subject: 'Musik', name: 'Sarah Schmid', email: 'sarah.schmid@schule-suhr.ch' },
  { code: 'TTG', subject: 'Textiles Werken / Gestalten', name: 'Laura Bisang', email: 'Laura.bisang@schule-suhr.ch' },
  { code: 'SHP', subject: 'Schulischer Heilpädagoge', name: 'Andreas Sager', email: 'andreas.sager@schule-suhr.ch' }
];

export const GROUPS: PupilGroup[] = [
  {
    name: 'Gruppe A',
    members: ['Hamza', 'Bitanya', 'Sophia', 'Serenay', 'Danin', 'Nicolas', 'Julian', 'Lia']
  },
  {
    name: 'Gruppe B',
    members: ['Eric', 'Rebecca', 'Aya', 'Chriss', 'Adele', 'Lorian', 'Sarah', 'Tim', 'Erdi']
  }
];

// Helper to get room and teacher by subject code
export function getSubjectDetails(subject: string): { teacher: string; teacherName: string; room: string; colorClass: string; borderClass: string; bgClass: string } {
  const norm = subject.trim().toUpperCase();
  
  if (norm.startsWith('BS')) {
    return {
      teacher: 'BS',
      teacherName: 'Philipp Achermann',
      room: 'Turnhalle',
      colorClass: 'text-emerald-900',
      borderClass: 'border-emerald-500',
      bgClass: 'bg-emerald-50'
    };
  }
  if (norm.startsWith('F')) {
    return {
      teacher: 'Romane Segal',
      teacherName: 'Romane Segal',
      room: 'Zimmer 104',
      colorClass: 'text-indigo-900',
      borderClass: 'border-indigo-500',
      bgClass: 'bg-indigo-50'
    };
  }
  if (norm.startsWith('E')) {
    return {
      teacher: 'Milena Jevric',
      teacherName: 'Milena Jevric',
      room: 'Zimmer 108',
      colorClass: 'text-sky-900',
      borderClass: 'border-sky-500',
      bgClass: 'bg-sky-50'
    };
  }
  if (norm.startsWith('MU')) {
    return {
      teacher: 'Sarah Schmid',
      teacherName: 'Sarah Schmid',
      room: 'Musikzimmer',
      colorClass: 'text-amber-900',
      borderClass: 'border-amber-500',
      bgClass: 'bg-amber-50'
    };
  }
  if (norm.startsWith('TTG')) {
    return {
      teacher: 'Laura Bisang',
      teacherName: 'Laura Bisang',
      room: 'TTG-Werkraum',
      colorClass: 'text-orange-900',
      borderClass: 'border-orange-500',
      bgClass: 'bg-orange-50'
    };
  }
  if (norm.startsWith('CHOR')) {
    return {
      teacher: 'Sarah Schmid',
      teacherName: 'Sarah Schmid',
      room: 'Aula O',
      colorClass: 'text-pink-900',
      borderClass: 'border-pink-500',
      bgClass: 'bg-pink-50'
    };
  }
  if (norm.startsWith('X')) {
    return {
      teacher: 'Sascha Lüscher',
      teacherName: 'Sascha Lüscher',
      room: 'Klassenzimmer 6B',
      colorClass: 'text-slate-900',
      borderClass: 'border-slate-500',
      bgClass: 'bg-slate-50'
    };
  }
  
  return {
    teacher: '-',
    teacherName: '-',
    room: '-',
    colorClass: 'text-gray-900',
    borderClass: 'border-gray-300',
    bgClass: 'bg-gray-50'
  };
}

export const TIMETABLE_DATA: TimetableRow[] = [
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
