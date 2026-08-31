import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, Search, ListFilter, HelpCircle } from 'lucide-react';
import { McqItem } from '../types';

interface Props {
  mcqs: McqItem[];
  onUpdateMcqs: (updatedList: McqItem[]) => void;
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
}

export const McqTableEditor: React.FC<Props> = ({
  mcqs,
  onUpdateMcqs,
  selectedIndex,
  onSelectIndex,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<McqItem>>({});

  const filteredMcqs = mcqs.filter((m) =>
    m.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.optionA.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.optionB.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartEdit = (mcq: McqItem) => {
    setEditingId(mcq.id);
    setEditForm({ ...mcq });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    const updated = mcqs.map((m) => (m.id === editingId ? ({ ...m, ...editForm } as McqItem) : m));
    onUpdateMcqs(updated);
    setEditingId(null);
  };

  const handleDelete = (id: string, index: number) => {
    const updated = mcqs.filter((m) => m.id !== id);
    onUpdateMcqs(updated);
    if (selectedIndex >= updated.length) {
      onSelectIndex(Math.max(0, updated.length - 1));
    }
  };

  const handleAddNew = () => {
    const newMcq: McqItem = {
      id: `mcq-manual-${Date.now()}`,
      question: 'Type your new question here...',
      optionA: 'Option 1',
      optionB: 'Option 2',
      optionC: 'Option 3',
      optionD: 'Option 4',
      correctAnswer: 'A',
      category: 'General',
    };
    onUpdateMcqs([...mcqs, newMcq]);
    onSelectIndex(mcqs.length);
    handleStartEdit(newMcq);
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-xs text-slate-100 flex flex-col h-full">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-950 border border-indigo-900 rounded text-indigo-400">
            <ListFilter className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              MCQ Questions ({mcqs.length})
            </h3>
            <p className="text-xs text-slate-400">
              Click any question to view live preview or edit content
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="bg-slate-950 border border-slate-800 rounded pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 w-36 sm:w-48"
            />
          </div>

          <button
            onClick={handleAddNew}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded shadow-xs transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New</span>
          </button>
        </div>
      </div>

      {/* MCQ Scrollable List / Table */}
      <div className="mt-4 overflow-y-auto max-h-[380px] space-y-2 pr-1 custom-scrollbar">
        {filteredMcqs.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <HelpCircle className="w-10 h-10 mx-auto mb-2 text-slate-400" />
            <p className="text-sm font-semibold">No MCQ questions found</p>
            <p className="text-xs mt-1">Upload an Excel spreadsheet or click 'Add New'</p>
          </div>
        ) : (
          filteredMcqs.map((item, idx) => {
            const originalIndex = mcqs.findIndex((m) => m.id === item.id);
            const isSelected = selectedIndex === originalIndex;
            const isEditing = editingId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => onSelectIndex(originalIndex)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-950/70 shadow-xs ring-1 ring-indigo-600'
                    : 'border-slate-800 bg-slate-950/50 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                {isEditing ? (
                  <div className="space-y-3 p-1" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-indigo-400">Edit Question:</span>
                      <button
                        onClick={handleSaveEdit}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white font-semibold text-xs rounded flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Save
                      </button>
                    </div>

                    <input
                      type="text"
                      value={editForm.question || ''}
                      onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                      placeholder="Question"
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={editForm.optionA || ''}
                        onChange={(e) => setEditForm({ ...editForm, optionA: e.target.value })}
                        placeholder="Option A"
                        className="bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={editForm.optionB || ''}
                        onChange={(e) => setEditForm({ ...editForm, optionB: e.target.value })}
                        placeholder="Option B"
                        className="bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={editForm.optionC || ''}
                        onChange={(e) => setEditForm({ ...editForm, optionC: e.target.value })}
                        placeholder="Option C"
                        className="bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={editForm.optionD || ''}
                        onChange={(e) => setEditForm({ ...editForm, optionD: e.target.value })}
                        placeholder="Option D"
                        className="bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="w-6 h-6 rounded bg-indigo-900 text-indigo-400 border border-indigo-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {originalIndex + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate leading-relaxed">
                          {item.question}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate mt-1">
                          A: {item.optionA} | B: {item.optionB} {item.optionC ? `| C: ${item.optionC}` : ''} {item.optionD ? `| D: ${item.optionD}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(item);
                        }}
                        className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id, originalIndex);
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
