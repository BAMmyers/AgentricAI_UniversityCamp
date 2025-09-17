import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { BookOpenIcon, PlusIcon, TrashIcon } from './icons';
import { CurriculumItem, CoreSubject } from '../types/index';

const subjects: CoreSubject[] = ['Math', 'Reading', 'Science', 'History', 'Language Arts', 'Geography'];

const CurriculumManagerView: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const [newItem, setNewItem] = useState<{ [key in CoreSubject]?: { title: string, content: string } }>({});

    const handleAddItem = (subject: CoreSubject) => {
        const itemData = newItem[subject];
        if (itemData && itemData.title.trim() && itemData.content.trim()) {
            const newItemPayload: CurriculumItem = {
                id: `curr-${Date.now()}`,
                subject,
                title: itemData.title.trim(),
                content: itemData.content.trim(),
            };
            dispatch({ type: 'ADD_CURRICULUM_ITEM', payload: newItemPayload });
            setNewItem(prev => ({ ...prev, [subject]: { title: '', content: '' } }));
            dispatch({ type: 'SHOW_TOAST', payload: { message: `Added "${newItemPayload.title}" to ${subject}.`, type: 'success' } });
        } else {
            dispatch({ type: 'SHOW_TOAST', payload: { message: 'Title and content cannot be empty.', type: 'error' } });
        }
    };

    const handleRemoveItem = (id: string) => {
        dispatch({ type: 'REMOVE_CURRICULUM_ITEM', payload: id });
    };
    
    const handleInputChange = (subject: CoreSubject, field: 'title' | 'content', value: string) => {
        setNewItem(prev => ({
            ...prev,
            [subject]: {
                ...(prev[subject] || { title: '', content: '' }),
                [field]: value,
            },
        }));
    };

    return (
        <div className="p-6 bg-brand-dark min-h-full">
            <header className="flex items-center mb-6">
                <BookOpenIcon className="w-8 h-8 mr-3 text-brand-cyan" />
                <div>
                    <h1 className="text-2xl font-bold text-white">Curriculum Manager</h1>
                    <p className="text-brand-text-secondary">Manage the central library of educational content for all companion agents.</p>
                </div>
            </header>

            <div className="space-y-8">
                {subjects.map(subject => {
                    const subjectItems = state.curriculum?.filter(item => item.subject === subject) || [];
                    const currentNewItem = newItem[subject] || { title: '', content: '' };
                    return (
                        <div key={subject} className="bg-brand-gray border border-brand-border rounded-lg p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-white">{subject}</h2>
                                <span className="text-sm font-semibold bg-brand-light-gray border border-brand-border px-3 py-1 rounded-md text-brand-cyan">{subjectItems.length} Lessons</span>
                            </div>
                            <div className="space-y-2 mb-4">
                                {subjectItems.length > 0 ? (
                                    subjectItems.map(item => (
                                        <div key={item.id} className="flex items-start justify-between bg-brand-light-gray p-3 rounded">
                                            <div>
                                                <h3 className="font-bold text-brand-text">{item.title}</h3>
                                                <p className="text-sm text-brand-text-secondary mt-1 whitespace-pre-wrap">{item.content}</p>
                                            </div>
                                            <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-400 flex-shrink-0 ml-4">
                                                <TrashIcon className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-brand-text-secondary italic">No curriculum items for this subject yet.</p>
                                )}
                            </div>
                            <div className="border-t border-brand-border pt-4">
                                <h3 className="text-sm font-semibold text-white mb-2">Add New Lesson</h3>
                                <div className="flex gap-2 items-start">
                                    <input
                                        type="text"
                                        value={currentNewItem.title}
                                        onChange={e => handleInputChange(subject, 'title', e.target.value)}
                                        placeholder="Lesson Title"
                                        className="w-1/3 bg-brand-dark border border-brand-border rounded px-2 py-1 text-sm"
                                    />
                                    <textarea
                                        value={currentNewItem.content}
                                        onChange={e => handleInputChange(subject, 'content', e.target.value)}
                                        placeholder="Lesson content or key points..."
                                        rows={1}
                                        className="flex-grow bg-brand-dark border border-brand-border rounded px-2 py-1 text-sm resize-y"
                                    />
                                    <button onClick={() => handleAddItem(subject)} className="bg-brand-primary p-2 rounded flex-shrink-0">
                                        <PlusIcon className="w-4 h-4"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CurriculumManagerView;