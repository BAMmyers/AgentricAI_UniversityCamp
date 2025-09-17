import React from 'react';
import { NodeData } from '../../types/index';
import { CpuIcon, CheckCircleIcon, XCircleIcon } from '../icons';

interface NodeComponentProps {
    node: NodeData;
    executeNode: (nodeId: string) => void;
    updateNodeInternalState: (nodeId: string, dataChanges: any) => void;
    onCloseNode: (nodeId: string) => void;
    isHighlighted: boolean;
    activeDrawingToolNodeId: string | null;
    setActiveDrawingToolNodeId: (nodeId: string | null) => void;
    appMode: 'studio' | 'sandbox' | 'echo';
    onRequestReview: (nodeId: string) => void;
}

const NodeComponent: React.FC<NodeComponentProps> = ({ node, executeNode, updateNodeInternalState, onCloseNode, isHighlighted }) => {
    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateNodeInternalState(node.id, { text: e.target.value });
    };

    return (
        <div
            id={node.id}
            className={`draggable-node absolute bg-brand-gray border-2 rounded-md flex flex-col select-none transition-all duration-200 ${node.color} ${isHighlighted ? 'shadow-lg shadow-yellow-400/50 scale-105' : ''}`}
            style={{ width: `${node.currentWidth || 250}px`, top: node.position.y, left: node.position.x, cursor: 'grab' }}
        >
            <div className="node-header bg-brand-light-gray p-2 rounded-t-md text-white font-bold text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">{node.icon}<span>{node.title}</span></div>
                 <div>
                    {node.status === 'running' && <CpuIcon className="w-4 h-4 text-yellow-400 animate-spin" />}
                    {node.status === 'success' && <CheckCircleIcon className="w-4 h-4 text-green-400"/>}
                    {node.status === 'error' && <XCircleIcon className="w-4 h-4 text-red-400" />}
                 </div>
            </div>
            <div className="p-2 relative min-h-[80px]">
                {/* Ports would be rendered here */}
                 {node.type === 'textInput' && (
                    <textarea 
                        defaultValue={node.data?.text || ''} 
                        onChange={handleContentChange}
                        className="bg-brand-dark border border-brand-border rounded px-2 py-1 w-full text-sm h-16 resize-none" 
                    />
                )}
                {node.type === 'dataDisplay' && (
                    <pre className="text-xs p-2 bg-brand-dark rounded text-green-300 overflow-auto max-h-40">
                        {JSON.stringify(node.data?.data, null, 2) || 'No data'}
                    </pre>
                )}
            </div>
        </div>
    );
};

export default NodeComponent;
