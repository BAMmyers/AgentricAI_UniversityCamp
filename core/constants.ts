// FIX: Import React to use React.createElement for icons.
import React from 'react';
import { CodeBracketIcon, DocumentTextIcon, EyeIcon, PhotoIcon, SparklesIcon, CommandLineIcon, GlobeAltIcon, DocumentMinusIcon, ClipboardDocumentListIcon, QuestionMarkCircleIcon, UserPlusIcon } from '../components/icons';
import { NodeType, DynamicNodeConfig } from '../types/index';

export const MIN_ZOOM = 0.2;
export const MAX_ZOOM = 2.0;
export const ZOOM_SENSITIVITY = 0.001;

export const DEFAULT_NODE_WIDTH = 250;
export const DEFAULT_NODE_HEIGHT = 150;
export const MIN_NODE_WIDTH = 150;
export const MIN_NODE_HEIGHT = 80;

export const DATA_TYPE_STROKE_COLORS: Record<string, string> = {
    string: '#a7f3d0', // emerald-200
    number: '#bae6fd', // sky-200
    boolean: '#f9a8d4', // pink-300
    image: '#a5b4fc', // indigo-300
    audio: '#d8b4fe', // purple-300
    json: '#fde047', // yellow-300
    any: '#fca5a5', // red-300
};
export const DEFAULT_EDGE_COLOR = '#6b7280'; // gray-500

// FIX: Use React.createElement for all icon components to resolve parsing errors.
export const NODE_CONFIG: Record<NodeType, Omit<DynamicNodeConfig, 'name'>> = {
    textInput: {
        description: "Provides a simple text input field.",
        inputs: [],
        outputs: [{ name: 'text', dataType: 'string', id: 'text-output' }],
        color: 'border-blue-500',
        icon: React.createElement(DocumentTextIcon, { className: "w-4 h-4"}),
        category: 'Input',
        // FIX: Added missing isDynamic property.
        isDynamic: false,
    },
    storyGenerator: {
        description: "Generates a short story from a prompt.",
        inputs: [{ name: 'prompt', dataType: 'string', id: 'prompt-input' }],
        outputs: [{ name: 'story', dataType: 'string', id: 'story-output' }],
        color: 'border-pink-500',
        icon: React.createElement(SparklesIcon, { className: "w-4 h-4"}),
        category: 'Content & Language',
        // FIX: Added missing isDynamic property.
        isDynamic: false,
    },
    jsonExtractor: {
        description: "Extracts a JSON object from text based on a schema.",
        inputs: [{ name: 'text', dataType: 'string', id: 'text-input' }],
        outputs: [{ name: 'json', dataType: 'json', id: 'json-output' }],
        color: 'border-indigo-500',
        icon: React.createElement(CodeBracketIcon, { className: "w-4 h-4"}),
        category: 'Data & Integration',
        // FIX: Added missing isDynamic property.
        isDynamic: false,
    },
    imageGenerator: {
        description: "Generates an image from a text prompt.",
        inputs: [{ name: 'prompt', dataType: 'string', id: 'prompt-input' }],
        outputs: [{ name: 'image', dataType: 'image', id: 'image-output' }],
        color: 'border-teal-500',
        icon: React.createElement(PhotoIcon, { className: "w-4 h-4"}),
        category: 'Content & Language',
        // FIX: Added missing isDynamic property.
        isDynamic: false,
    },
    agentDesigner: {
        description: "Designs a new agent with a name and system instruction.",
        inputs: [{ name: 'task', dataType: 'string', id: 'task-input' }],
        outputs: [{ name: 'agentDefinition', dataType: 'json', id: 'agentDefinition-output' }],
        color: 'border-purple-500',
        icon: React.createElement(UserPlusIcon, { className: "w-4 h-4"}),
        category: 'Development & Code',
        // FIX: Added missing isDynamic property.
        isDynamic: false,
    },
    pythonInterpreter: {
        description: "Executes Python code and returns the result.",
        inputs: [{ name: 'code', dataType: 'string', id: 'code-input' }],
        outputs: [{ name: 'result', dataType: 'string', id: 'result-output' }],
        color: 'border-emerald-500',
        icon: React.createElement(CommandLineIcon, { className: "w-4 h-4"}),
        category: 'Development & Code',
        // FIX: Added missing isDynamic property.
        isDynamic: false,
    },
    quizGenerator: {
        description: "Generates a multiple-choice quiz on a given topic.",
        inputs: [{ name: 'topic', dataType: 'string', id: 'topic-input' }],
        outputs: [{ name: 'quizJson', dataType: 'json', id: 'quizJson-output' }],
        color: 'border-amber-500',
        icon: React.createElement(QuestionMarkCircleIcon, { className: "w-4 h-4"}),
        category: 'Education',
        // FIX: Added missing isDynamic property.
        isDynamic: false,
    },
    lessonPlanner: {
        description: "Designs a lesson plan for an educational objective.",
        inputs: [{ name: 'objective', dataType: 'string', id: 'objective-input' }],
        outputs: [{ name: 'plan', dataType: 'string', id: 'plan-output' }],
        color: 'border-sky-500',
        icon: React.createElement(ClipboardDocumentListIcon, { className: "w-4 h-4"}),
        category: 'Education',
        // FIX: Added missing isDynamic property.
        isDynamic: false,
    },
    textSummarizer: {
        description: "Summarizes a long piece of text.",
        inputs: [{ name: 'text', dataType: 'string', id: 'text-input' }],
        outputs: [{ name: 'summary', dataType: 'string', id: 'summary-output' }],
        color: 'border-orange-500',
        icon: React.createElement(DocumentMinusIcon, { className: "w-4 h-4"}),
        category: 'Content & Language',
        // FIX: Added missing isDynamic property.
        isDynamic: false,
    },
     webSearch: {
        description: "Performs a web search and returns results and sources.",
        inputs: [{ name: 'query', dataType: 'string', id: 'query-input' }],
        outputs: [{ name: 'results', dataType: 'string', id: 'results-output' }, { name: 'sources', dataType: 'json', id: 'sources-output' }],
        color: 'border-cyan-500',
        icon: React.createElement(GlobeAltIcon, { className: "w-4 h-4"}),
        category: 'Data & Integration',
        requiresWebSearch: true,
        // FIX: Added missing isDynamic property.
        isDynamic: false,
    },
    dataDisplay: {
        description: "Displays any data input in a formatted view.",
        inputs: [{ name: 'data', dataType: 'any', id: 'data-input' }],
        outputs: [],
        color: 'border-gray-500',
        icon: React.createElement(EyeIcon, { className: "w-4 h-4"}),
        category: 'Display',
        // FIX: Added missing isDynamic property.
        isDynamic: false,
    },
    imageDisplay: {
        description: "Displays an input image.",
        inputs: [{ name: 'image', dataType: 'image', id: 'image-input' }],
        outputs: [],
        color: 'border-green-500',
        icon: React.createElement(PhotoIcon, { className: "w-4 h-4"}),
        category: 'Display',
        // FIX: Added missing isDynamic property.
        isDynamic: false,
    }
};