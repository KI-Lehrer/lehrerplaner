import React, { useState, useRef, useEffect } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { Todo } from '../types';

type CategoryType = Todo['category'];

const CATEGORIES: { key: CategoryType; label: string; colorClass: string }[] = [
  { key: 'korrekturen', label: 'Korrekturen', colorClass: 'bg-error' },
  { key: 'vorbereitung', label: 'Vorbereitung', colorClass: 'bg-primary' },
  { key: 'elternarbeit', label: 'Elternarbeit', colorClass: 'bg-secondary' },
  { key: 'verwaltung', label: 'Verwaltung', colorClass: 'bg-outline' }
];

export default function Aufgaben() {
  const { todos, addTodo, updateTodo, deleteTodo } = usePlanner();

  // Filter state
  const [filterType, setFilterType] = useState<'all' | 'dringend' | 'done'>('all');

  // Modal State for Add/Edit
  const [showDialog, setShowDialog] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState<CategoryType>('korrekturen');
  const [formPriority, setFormPriority] = useState<1 | 2 | 3>(2);
  const [formDate, setFormDate] = useState('');
  const [formClassLabel, setFormClassLabel] = useState('');
  const [formProgress, setFormProgress] = useState(0);

  const dialogRef = useRef<HTMLDialogElement>(null);

  // Trigger modal show
  useEffect(() => {
    if (showDialog && dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, [showDialog]);

  const closeDialog = () => {
    if (dialogRef.current) dialogRef.current.close();
    setShowDialog(false);
    setEditingTodoId(null);
    clearForm();
  };

  const clearForm = () => {
    setFormTitle('');
    setFormDesc('');
    setFormCategory('korrekturen');
    setFormPriority(2);
    setFormDate('');
    setFormClassLabel('');
    setFormProgress(0);
  };

  // Open add dialog
  const handleOpenAdd = () => {
    clearForm();
    setEditingTodoId(null);
    setShowDialog(true);
  };

  // Open edit dialog
  const handleOpenEdit = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setFormTitle(todo.title);
    setFormDesc(todo.description);
    setFormCategory(todo.category);
    setFormPriority(todo.priority);
    setFormDate(todo.date);
    setFormClassLabel(todo.classLabel);
    setFormProgress(todo.progress);
    setShowDialog(true);
  };

  // Save Todo
  const handleSaveTodoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const todoData = {
      title: formTitle.trim(),
      description: formDesc.trim(),
      category: formCategory,
      priority: formPriority,
      date: formDate.trim(),
      classLabel: formClassLabel.trim() || 'Allg',
      progress: formProgress,
      completed: false
    };

    if (editingTodoId) {
      updateTodo(editingTodoId, todoData);
    } else {
      addTodo(todoData);
    }
    closeDialog();
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
          setShowDialog(false);
          setEditingTodoId(null);
        }
      }
    };

    dialog.addEventListener('click', handleClickOutside);
    return () => dialog.removeEventListener('click', handleClickOutside);
  }, [showDialog]);

  // Filter tasks based on selected tab
  const getFilteredTodos = () => {
    let list = todos;
    
    if (filterType === 'dringend') {
      list = list.filter(t => !t.completed && t.priority === 1);
    } else if (filterType === 'done') {
      list = list.filter(t => t.completed);
    } else {
      list = list.filter(t => !t.completed); // default active todos
    }

    return list;
  };

  const filteredList = getFilteredTodos();

  // Quick move category helper
  const handleMoveCategory = (id: string, newCat: CategoryType) => {
    updateTodo(id, { category: newCat });
  };

  return (
    <div className="p-6 md:p-margin-desktop max-w-[1440px] mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-lg">
        <div>
          <span className="text-xs font-bold text-primary tracking-widest uppercase mb-1 block">Planer Board</span>
          <h2 className="font-headline-lg text-3xl font-extrabold text-on-surface">Aufgaben & To-Dos</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Toggles */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button 
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterType === 'all' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Offene Aufgaben
            </button>
            <button 
              onClick={() => setFilterType('dringend')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterType === 'dringend' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Dringend (Prio 1)
            </button>
            <button 
              onClick={() => setFilterType('done')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterType === 'done' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Erledigt
            </button>
          </div>

          <button 
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-2xl bg-primary text-on-primary font-bold hover:bg-primary-fixed hover:text-on-primary-container transition-all text-sm active:scale-95 shadow-md flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[18px]">add</span> Aufgabe erstellen
          </button>
        </div>
      </div>

      {/* Grid of Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter pb-8">
        
        {CATEGORIES.map((cat) => {
          const catTodos = filteredList.filter(t => t.category === cat.key);

          return (
            <div key={cat.key} className="flex flex-col gap-4 min-h-[500px] bg-slate-50/50 p-4 rounded-3xl border border-slate-200/60">
              {/* Column Header */}
              <div className="flex items-center justify-between px-2 mb-2">
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${cat.colorClass}`}></span>
                  <h3 className="font-bold text-on-surface text-base">{cat.label}</h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-on-surface">
                    {catTodos.length}
                  </span>
                </div>
              </div>
              
              {/* Column Tasks list */}
              <div className="space-y-4 flex-1 overflow-y-auto">
                {catTodos.map((todo) => (
                  <div 
                    key={todo.id} 
                    className="bg-white border border-outline-variant p-5 rounded-2xl hover:shadow-md transition-all sheet-shadow relative group cursor-pointer"
                    onClick={() => handleOpenEdit(todo)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-md ${
                        todo.priority === 1 
                          ? 'bg-error/10 text-error' 
                          : todo.priority === 2 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-slate-100 text-slate-500'
                      }`}>
                        Prio {todo.priority}
                      </span>
                      <span className="text-xs font-semibold text-on-surface-variant italic">
                        {todo.date || 'Kein Termin'}
                      </span>
                    </div>

                    <p className={`font-bold text-on-surface mb-2 text-base leading-snug ${todo.completed ? 'line-through text-slate-400' : ''}`}>
                      {todo.title}
                    </p>
                    
                    {todo.description && (
                      <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3 mb-4">
                        {todo.description}
                      </p>
                    )}

                    {todo.progress > 0 && todo.progress < 100 && (
                      <div className="mb-4">
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-primary h-full" style={{ width: `${todo.progress}%` }}></div>
                        </div>
                        <span className="text-[10px] text-on-surface-variant font-bold mt-1 block">{todo.progress}% fertig</span>
                      </div>
                    )}

                    {/* Footer actions on card */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <span className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-xs font-bold text-on-secondary-container border border-white">
                          {todo.classLabel}
                        </span>
                        
                        {/* Completed Checkbox */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateTodo(todo.id, { completed: !todo.completed });
                          }}
                          className={`p-1 rounded-full transition-colors material-symbols-outlined text-[20px] ${
                            todo.completed ? 'text-secondary hover:text-slate-400' : 'text-slate-300 hover:text-secondary'
                          }`}
                          title={todo.completed ? 'Als offen markieren' : 'Als erledigt markieren'}
                        >
                          check_circle
                        </button>
                      </div>

                      <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                        {/* Quick move dropdown selector */}
                        <select
                          className="text-[10px] font-bold bg-slate-100 rounded border-none py-0.5 px-1 outline-none text-slate-600 focus:ring-0"
                          value={todo.category}
                          onChange={(e) => handleMoveCategory(todo.id, e.target.value as CategoryType)}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {CATEGORIES.map(c => (
                            <option key={c.key} value={c.key}>{c.label}</option>
                          ))}
                        </select>

                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEdit(todo);
                          }}
                          className="p-1 hover:bg-slate-100 text-primary rounded flex items-center justify-center"
                          title="Bearbeiten"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Aufgabe wirklich löschen?')) deleteTodo(todo.id);
                          }}
                          className="p-1 hover:bg-error/5 text-error rounded flex items-center justify-center"
                          title="Löschen"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {catTodos.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-100/30 min-h-[160px] text-center">
                    <span className="material-symbols-outlined text-2xl mb-1 text-slate-300">inventory_2</span>
                    <p className="text-[11px] text-slate-400 font-bold">Keine Aufgaben</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
      </div>

      {/* Modal Dialog for Add/Edit Todo */}
      <dialog 
        ref={dialogRef}
        closedby="any" 
        className="m-auto rounded-3xl border border-slate-200 p-6 shadow-xl backdrop:backdrop-blur-sm max-w-sm w-full bg-white outline-none"
        aria-labelledby="todo-dialog-title"
      >
        <form onSubmit={handleSaveTodoSubmit} className="space-y-4">
          <h2 id="todo-dialog-title" className="text-lg font-extrabold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">{editingTodoId ? 'edit' : 'add_task'}</span>
            {editingTodoId ? 'Aufgabe bearbeiten' : 'Neue Aufgabe'}
          </h2>
          
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Titel der Aufgabe</label>
              <input
                type="text"
                placeholder="z.B. Mathetest korrigieren"
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none text-sm font-semibold"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Beschreibung</label>
              <textarea
                placeholder="Details zur Aufgabe..."
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none text-sm font-semibold resize-none"
                rows={3}
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Kategorie</label>
                <select
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none text-sm font-semibold"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as CategoryType)}
                >
                  {CATEGORIES.map(c => (
                    <option key={c.key} value={c.key}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Priorität</label>
                <select
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none text-sm font-semibold"
                  value={formPriority}
                  onChange={(e) => setFormPriority(Number(e.target.value) as any)}
                >
                  <option value={1}>Prio 1 - Hoch</option>
                  <option value={2}>Prio 2 - Mittel</option>
                  <option value={3}>Prio 3 - Niedrig</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Klasse / Label</label>
                <input
                  type="text"
                  placeholder="z.B. 9B, Bio, Allg"
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none text-sm font-semibold"
                  value={formClassLabel}
                  onChange={(e) => setFormClassLabel(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Fälligkeit (z.B. Heute, Fr)</label>
                <input
                  type="text"
                  placeholder="z.B. Fr, 14:00"
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none text-sm font-semibold"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Fortschritt: {formProgress}%</label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                className="w-full accent-primary mt-1"
                value={formProgress}
                onChange={(e) => setFormProgress(Number(e.target.value))}
              />
            </div>
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
