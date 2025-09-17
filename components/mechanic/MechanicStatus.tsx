import React, { useState, useEffect } from 'react';
import { mechanicService } from '../../services/mechanicService';
import { BeakerIcon } from '../icons';

const MechanicStatus: React.FC = () => {
    const [bugCount, setBugCount] = useState(0);

    useEffect(() => {
        const subscription = mechanicService.bugs$.subscribe(bugs => {
            const unacknowledgedBugs = bugs.filter(b => !b.isAcknowledged);
            setBugCount(unacknowledgedBugs.length);
        });
        return () => subscription.unsubscribe();
    }, []);

    if (bugCount === 0) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button className="bg-red-600 text-white rounded-full h-12 w-12 flex items-center justify-center shadow-lg">
                <BeakerIcon className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{bugCount}</span>
            </button>
        </div>
    );
};

export default MechanicStatus;
