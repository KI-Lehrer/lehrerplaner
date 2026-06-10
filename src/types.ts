export type ViewTab = 'dashboard' | 'stundenplan' | 'jahresuebersicht' | 'wochenuebersicht' | 'tagesuebersicht' | 'aufgaben' | 'einstellungen';

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
  subject: string;
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

export interface SchoolInfo {
  class: string;
  level: string;
  year: string;
  name: string;
  address: string;
  notice: string;
}

export interface SubjectDetails {
  subject: string;
  teacher: string;
  teacherName: string;
  room: string;
  colorClass: string;
  borderClass: string;
  bgClass: string;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  category: 'korrekturen' | 'vorbereitung' | 'elternarbeit' | 'verwaltung';
  priority: 1 | 2 | 3;
  date: string;
  progress: number;
  classLabel: string;
  completed?: boolean;
}

export interface LessonPlan {
  topic: string;
  homework: string;
  materials: string;
  notes: string;
}

export interface CalendarEvent {
  date: string; // YYYY-MM-DD
  type: 'ferien' | 'pruefung' | 'konferenz' | 'feiertag';
  text: string;
}

export interface Appointment {
  id: string;
  time: string;
  text: string;
  type: 'krankheit' | 'besprechung' | 'konferenz' | 'sonstiges';
}
