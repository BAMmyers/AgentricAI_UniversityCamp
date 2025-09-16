import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { View } from '../App';
import { ArrowUturnLeftIcon, ClipboardDocumentCheckIcon, PlusIcon, TrashIcon, InformationCircleIcon } from './icons';

interface ParentTeacherConsoleProps {
  studentId: string;
  setActiveView: (view: View) => void;
}

const ParentTeacherConsole: React.FC<ParentTeacherConsoleProps> = ({ studentId, setActiveView }) => {
  const { state, dispatch } = useAppContext();
  const student = state.students.find(s => s.id === studentId);
  const agent = state.agents.find(a => a.id === student?.companionAgentId);

  const [parentGoals, setParentGoals] = useState<string[]>([]);
  const [teacherCurriculum, setTeacherCurriculum] = useState<string[]>([]);
  const [newGoal, setNewGoal] = useState('');
  const [newCurriculum, setNewCurriculum] = useState('');

  useEffect(() => {
    if (student) {
      setParentGoals(student.parentGoals);
      setTeacherCurriculum(student.teacherCurriculum);
    }
  }, [student]);

  if (!student || !agent) {
    return (
      <div className="p-6 text-center">
        <p>Could not load data for this student's agent.</p>
        <button onClick={() => setActiveView('student-roster')} className="mt-4 text-brand-secondary">Return to Roster</button>
      </div>
    );
  }
  
  const handleSaveChanges = () => {
    dispatch({
        type: 'UPDATE_STUDENT_GOALS_AND_CURRICULUM',
        payload: {
            studentId,
            parentGoals,
            teacherCurriculum
        }
    });
    alert('Changes saved. The companion agent will now synthesize this new information.');
    setActiveView('student-roster');
  };

  const addGoal = () => {
    if(newGoal.trim()) {
        setParentGoals([...parentGoals, newGoal.trim()]);
        setNewGoal('');
    }
  }

  const removeGoal = (index: number) => {
    setParentGoals(parentGoals.filter((_, i) => i !== index));
  }
  
  const addCurriculum = () => {
      if(newCurriculum.trim()) {
          setTeacherCurriculum([...teacherCurriculum, newCurriculum.trim()]);
          setNewCurriculum('');
      }
  }

  const removeCurriculum = (index: number) => {
      setTeacherCurriculum(teacherCurriculum.filter((_, i) => i !== index));
  }

  return (
    <div className="p-6 bg-brand-dark min-h-full">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Parent & Teacher Console</h1>
          <p className="text-brand-text-secondary">Managing curriculum for: <span className="font-bold text-brand-cyan">{agent.name}</span></p>
        </div>
        <button onClick={() => setActiveView('student-roster')} className="flex items-center gap-2 bg-brand-gray px-4 py-2 rounded-lg hover:bg-brand-light-gray">
            <ArrowUturnLeftIcon className="w-5 h-5" />
            <span className="text-sm">Back to Roster</span>
        </button>
      </header>
      
      <div className="bg-brand-light-gray border border-brand-border rounded-lg p-3 mb-6 flex items-center text-sm">
        <InformationCircleIcon className="w-5 h-5 text-brand-secondary mr-3 flex-shrink-0"/>
        <div>
            <span className="text-brand-text-secondary">This student's unique, anonymous identifier is </span>
            <span className="font-mono text-brand-cyan bg-brand-dark px-2 py-1 rounded">{agent.id}</span>
            <span className="text-brand-text-secondary">. Use this ID to find their work in the Project Showcase.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Inputs */}
        <div className="bg-brand-gray border border-brand-border rounded-lg p-4 space-y-6">
            {/* Parent Goals */}
            <div>
                <h2 className="font-semibold text-white mb-2">Parent Goals</h2>
                <p className="text-xs text-brand-text-secondary mb-3">Define high-level objectives for the agent to consider.</p>
                <div className="space-y-2">
                    {parentGoals.map((goal, index) => (
                        <div key={index} className="flex items-center justify-between bg-brand-light-gray p-2 rounded">
                            <span className="text-sm">{goal}</span>
                            <button onClick={() => removeGoal(index)} className="text-red-500 hover:text-red-400"><TrashIcon className="w-4 h-4"/></button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 mt-3">
                    <input type="text" value={newGoal} onChange={e => setNewGoal(e.target.value)} placeholder="e.g., Spend less time on games" className="flex-grow bg-brand-dark border border-brand-border rounded px-2 py-1 text-sm"/>
                    <button onClick={addGoal} className="bg-brand-primary p-2 rounded"><PlusIcon className="w-4 h-4"/></button>
                </div>
            </div>

            {/* Teacher Curriculum */}
            <div>
                <h2 className="font-semibold text-white mb-2">Teacher Curriculum</h2>
                <p className="text-xs text-brand-text-secondary mb-3">Add specific educational blocks or topics.</p>
                <div className="space-y-2">
                    {teacherCurriculum.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-brand-light-gray p-2 rounded">
                            <span className="text-sm">{item}</span>
                            <button onClick={() => removeCurriculum(index)} className="text-red-500 hover:text-red-400"><TrashIcon className="w-4 h-4"/></button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 mt-3">
                    <input type="text" value={newCurriculum} onChange={e => setNewCurriculum(e.target.value)} placeholder="e.g., Add 'Game Development 101'" className="flex-grow bg-brand-dark border border-brand-border rounded px-2 py-1 text-sm"/>
                    <button onClick={addCurriculum} className="bg-brand-primary p-2 rounded"><PlusIcon className="w-4 h-4"/></button>
                </div>
            </div>
             <button onClick={handleSaveChanges} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Save & Update Agent
            </button>
        </div>

        {/* Right Column: Agent-Curated Log */}
        <div className="bg-brand-gray border border-brand-border rounded-lg p-4">
            <h2 className="font-semibold text-white mb-2 flex items-center gap-2"><ClipboardDocumentCheckIcon className="w-5 h-5 text-brand-cyan"/> Agent-Curated Activity Log</h2>
            <p className="text-xs text-brand-text-secondary mb-4">This is a high-level summary of the student's progress, generated by their companion agent to protect privacy.</p>
            <div className="space-y-3 h-96 overflow-y-auto pr-2">
                {student.activityLog.length > 0 ? student.activityLog.slice().reverse().map(log => (
                    <div key={log.timestamp} className="bg-brand-light-gray p-3 rounded-md">
                        <p className="text-sm text-brand-text">{log.summary}</p>
                        <p className="text-xs text-brand-text-secondary mt-1">{new Date(log.timestamp).toLocaleString()}</p>
                    </div>
                )) : (
                    <p className="text-sm text-brand-text-secondary text-center p-4">No activities completed yet.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ParentTeacherConsole;