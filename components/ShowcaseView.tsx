import React from 'react';
import { useAppContext } from '../context/AppContext';
import { TrophyIcon } from './icons';

const ShowcaseView: React.FC = () => {
  const { state } = useAppContext();
  const { showcasedProjects } = state;

  return (
    <div className="p-6 bg-brand-dark min-h-full">
      <header className="flex items-center mb-6">
        <TrophyIcon className="w-8 h-8 mr-3 text-yellow-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Project Showcase</h1>
          <p className="text-brand-text-secondary">Celebrating the amazing work created by students, shared via their companion agents.</p>
        </div>
      </header>

      {showcasedProjects.length === 0 ? (
        <div className="text-center p-10 bg-brand-gray rounded-lg border border-brand-border">
          <p className="text-brand-text-secondary">No projects have been showcased yet.</p>
          <p className="text-xs text-brand-text-secondary mt-2">Students can choose to showcase their work after completing an activity.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showcasedProjects.slice().reverse().map(project => (
            <div key={project.id} className="bg-brand-gray border border-brand-border rounded-lg p-4 flex flex-col">
              <h2 className="font-bold text-white text-lg mb-2">{project.title}</h2>
              <div className="flex-grow bg-brand-dark rounded p-3 mb-3 overflow-y-auto max-h-60">
                {typeof project.content === 'string' ? (
                  <p className="text-brand-text text-sm whitespace-pre-wrap leading-relaxed">{project.content}</p>
                ) : (
                  <pre className="text-xs text-green-300">{JSON.stringify(project.content, null, 2)}</pre>
                )}
              </div>
              <p className="text-xs text-brand-text-secondary text-right">Created by: <span className="font-mono text-brand-cyan">{project.companionAgentId}</span></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowcaseView;
