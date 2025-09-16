import React from 'react';
import { ToolDefinition } from '../types/index';
// FIX: Changed JSX to React.createElement to be valid in a .ts file.
import { DocumentMagnifyingGlassIcon, BookOpenIcon, CommandLineIcon, GlobeAltIcon, ArrowPathIcon } from '../components/icons';

export const AVAILABLE_TOOLS: ToolDefinition[] = [
    {
        id: 'archival_memory_search',
        name: 'Archival Memory Search',
        description: 'Search through long-term, archival memory.',
        icon: React.createElement(DocumentMagnifyingGlassIcon, { className: "w-5 h-5" }),
        settings: [
            { key: 'searchDepth', label: 'Search Depth', type: 'number', defaultValue: 3 }
        ]
    },
    {
        id: 'core_memory_append',
        name: 'Core Memory Append',
        description: 'Append new information to core memory.',
        icon: React.createElement(BookOpenIcon, { className: "w-5 h-5" })
    },
    {
        id: 'conversation_search',
        name: 'Conversation Search',
        description: 'Search through the current conversation history.',
        icon: React.createElement(ArrowPathIcon, { className: "w-5 h-5" })
    },
    {
        id: 'run_code',
        name: 'Run Code (Python)',
        description: 'Execute Python code in a sandboxed environment.',
        icon: React.createElement(CommandLineIcon, { className: "w-5 h-5" }),
        settings: [
            { key: 'timeout', label: 'Timeout (ms)', type: 'number', defaultValue: 5000 }
        ]
    },
    {
        id: 'fetch_webpage',
        name: 'Fetch Webpage',
        description: 'Fetches the content of a public webpage.',
        icon: React.createElement(GlobeAltIcon, { className: "w-5 h-5" }),
        settings: [
            { key: 'userAgent', label: 'User-Agent', type: 'string', defaultValue: 'AgentricAI-Web-Bot/1.0' },
            { key: 'allowRedirects', label: 'Allow Redirects', type: 'boolean', defaultValue: true }
        ]
    },
];