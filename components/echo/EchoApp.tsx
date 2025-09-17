import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useCompanionAgentLogic } from '../../hooks/useCompanionAgentLogic';
import { ScheduleItem, ScheduleItemType } from '../../types/index';
import ReadingActivity from './activities/ReadingActivity';
import MathActivity from './activities/MathActivity';
import ArtActivity from './activities/ArtActivity';
import WritingActivity from './activities/WritingActivity';
import MealtimeActivity from './activities/MealtimeActivity';
import FreePlayActivity from './activities/FreePlayActivity';
import CompletionModal from './activities/CompletionModal';
import { FaBookOpen, FaPlus, FaPaintBrush, FaAppleAlt, FaPencilAlt, FaGamepad } from 'react-icons/fa';

const ICONS: Record<ScheduleItemType, React.ReactNode> = {
    reading: <FaBookOpen />,
    math: <FaPlus />,
    art: <FaPaintBrush />,
    mealtime: <FaAppleAlt />,
    writing: <FaPencilAlt />,
    'free-play': <FaGamepad />,
    lecture: <FaBookOpen />,
    custom: <FaBookOpen />,
};

const BORDER_COLORS: Record<ScheduleItemType, string> = {
    reading: 'border-green-400',
    math: 'border-cyan-400',
    art: 'border-pink-400',
    mealtime: 'border-red-400',
    writing: 'border-purple-400',
    'free-play': 'border-orange-400',
    lecture: 'border-yellow-400',
    custom: 'border-gray-400',
};

const ActivityCard: React.FC<{ item: ScheduleItem; onClick: () => void, isActive: boolean }> = ({ item, onClick, isActive }) => {
    const isCompleted = item.status === 'completed';
    return (
        <div
            onClick={!isCompleted ? onClick : undefined}
            className={`
                relative flex flex-col items-center justify-center text-center p-4 rounded-2xl 
                transition-all duration-300 ease-in-out transform
                ${isCompleted ? 'bg-neutral-800 text-neutral-600' : 'bg-neutral-900 text-white cursor-pointer hover:scale-105'}
                border-4 ${isActive ? BORDER_COLORS[item.type] : (isCompleted ? 'border-neutral-800' : 'border-neutral-700 hover:border-neutral-600')}
            `}
            style={{ width: '160px', height: '160px' }}
        >
            {isCompleted && (
                 <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                    <svg className="w-16 h-16" viewBox="0 0 24 24">
                        <circle className="completed-checkmark-circle text-green-500" cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
                        <path className="completed-checkmark-check text-green-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7.5 12l3 3 6-6" />
                    </svg>
                </div>
            )}
            <div className={`text-4xl mb-2 transition-colors ${isCompleted ? 'text-neutral-700' : ''}`}>
                {ICONS[item.type]}
            </div>
            <h3 className="font-bold text-lg">{item.title}</h3>
            <p className="text-sm text-neutral-400">{item.time}</p>
        </div>
    );
};

const EchoApp: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const [activeItem, setActiveItem] = useState<ScheduleItem | null>(null);
    const [showCompletion, setShowCompletion] = useState<ScheduleItem | null>(null);

    useCompanionAgentLogic();

    const activeStudent = useMemo(() => state.students.find(s => s.id === state.activeStudentId), [state.students, state.activeStudentId]);

    const handleFinishActivity = (item: ScheduleItem) => {
        dispatch({
            type: 'LOG_ACTIVITY_COMPLETION',
            payload: {
                studentId: activeStudent!.id,
                scheduleItemId: item.id,
                summary: `Completed "${item.title}"`,
                review: "Great job on this activity!",
            }
        });
        setActiveItem(null);
        setShowCompletion(item);
    };

    const renderActivity = () => {
        if (!activeItem) return null;
        const commonProps = {
            item: activeItem,
            onClose: () => setActiveItem(null),
            onFinish: () => handleFinishActivity(activeItem),
        };

        switch(activeItem.type) {
            case 'reading': return <ReadingActivity {...commonProps} />;
            case 'math': return <MathActivity {...commonProps} />;
            case 'art': return <ArtActivity {...commonProps} />;
            case 'writing': return <WritingActivity {...commonProps} />;
            case 'mealtime': return <MealtimeActivity {...commonProps} />;
            case 'free-play': return <FreePlayActivity {...commonProps} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-full bg-black text-white flex flex-col items-center justify-center p-8 font-sans">
            {renderActivity()}
            {showCompletion && <CompletionModal item={showCompletion} onClose={() => setShowCompletion(null)} />}

            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-green-300">Echo Project Daily Schedule</h1>
                <p className="text-neutral-400 mt-2">A dynamic, adaptive companion for learning and growth.</p>
            </div>
            
            <div className="flex items-center justify-center gap-6">
                {activeStudent?.schedule.map(item => (
                    <ActivityCard key={item.id} item={item} onClick={() => setActiveItem(item)} isActive={activeItem?.id === item.id}/>
                ))}
            </div>
        </div>
    );
};

export default EchoApp;
