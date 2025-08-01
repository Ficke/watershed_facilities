import React, { useState, useRef } from 'react';
import { ArrowLeft, UploadCloud, LoaderCircle, Calendar as CalendarIcon, ChevronDown, ChevronRight, ChevronLeft, Circle, CheckCircle, XCircle, X, Home, BarChart2, Briefcase, FileText, ShoppingCart, Settings, AlertTriangle, FileCheck } from 'lucide-react';

const iconComponents = {
    Home,
    BarChart2,
    Briefcase,
    FileText,
    ShoppingCart,
    Settings
};
import { sidebarNavItems, footprintData } from '../mockData';

// --- Helper Components ---
export const StatusIcon = ({ status }) => {
    switch (status) {
        case 'To do': return <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />;
        case 'Blocked': return <XCircle className="w-4 h-4 text-red-500 fill-red-100 flex-shrink-0" />;
        case 'Done': return <CheckCircle className="w-4 h-4 text-green-500 fill-green-100 flex-shrink-0" />;
        default: return <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />;
    }
};

export const AssigneePill = ({ name }) => {
    if (name === 'Unassigned') {
        return <span className="text-gray-500">{name}</span>;
    }
    if (name === 'Watershed expert') {
        return (
            <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>{name}</span>
            </div>
        );
    }
    return (
        <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-semibold text-sm flex-shrink-0">
                {name.charAt(0)}
            </div>
            <span>{name}</span>
        </div>
    );
};


// --- Screen Components ---

export const ActiveMeasurementScreen = ({ datasets, onUploadClick }) => {
    const [activeView, setActiveView] = useState('tasks'); // 'tasks', 'timeline', or 'conversations'
    const [showConversationPanel, setShowConversationPanel] = useState(false);
    const [conversations] = useState([]); // Store conversations

    // Enhanced status badge component
    const StatusBadge = ({ status }) => {
        const getBadgeStyle = (status) => {
            switch (status) {
                case 'Needs response':
                    return 'bg-red-50 text-red-700 border-red-200';
                case 'Needs upload':
                    return 'bg-orange-50 text-orange-700 border-orange-200';
                case 'Processing':
                    return 'bg-blue-50 text-blue-700 border-blue-200';
                case 'Ready for footprint':
                    return 'bg-green-50 text-green-700 border-green-200';
                default:
                    return 'bg-gray-50 text-gray-700 border-gray-200';
            }
        };

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getBadgeStyle(status)}`}>
                {status}
            </span>
        );
    };

    const TaskItem = ({ task, onUploadClick }) => {
        const isInteractive = task.isInteractive;
        const itemClasses = `flex items-center py-3 px-4 hover:bg-gray-50 ${isInteractive ? 'cursor-pointer' : ''}`;

        return (
            <div className={itemClasses} onClick={isInteractive && !task.hasStartButton ? onUploadClick : undefined}>
                {/* Status Icon */}
                <div className="w-6 flex justify-center mr-4">
                    <StatusIcon status={task.status} />
                </div>
                
                {/* Task Description */}
                <div className="flex-1 text-sm text-gray-900 mr-4">
                    {task.issue && <span className="text-red-600 mr-2">!</span>}
                    {task.description}
                </div>
                
                {/* Assignee (Center) */}
                <div className="flex-1 flex justify-center mr-4">
                    <AssigneePill name={task.assignee} />
                </div>
                
                {/* Action Button or Status (Right) */}
                <div className="flex-shrink-0 w-24 flex justify-end">
                    {task.hasStartButton ? (
                        <button 
                            onClick={onUploadClick}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                        >
                            <span>Start</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    ) : task.hasRespondButton ? (
                        <button 
                            onClick={() => console.log('Respond clicked')}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                        >
                            <span>Respond</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    ) : (
                        <span className="text-sm text-gray-500">-</span>
                    )}
                </div>
            </div>
        );
    };

    const DatasetItem = ({ dataset, onUploadClick }) => {
        const [isExpanded, setIsExpanded] = useState(dataset.tasks.length > 0);

        return (
            <div className="border-b last:border-b-0">
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50" onClick={() => setIsExpanded(!isExpanded)}>
                    <div className="flex items-center">
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-500 mr-3" /> : <ChevronRight className="w-4 h-4 text-gray-500 mr-3" />}
                        <span className="font-medium text-gray-900 text-sm">{dataset.name}</span>
                    </div>
                    {dataset.statusBadge && <StatusBadge status={dataset.statusBadge} />}
                </div>
                {isExpanded && (
                    <div className="bg-gray-50">
                        {dataset.tasks.map((task) => (
                            <TaskItem key={task.id} task={task} onUploadClick={onUploadClick} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const ConversationsView = () => {
        return (
            <div className="bg-white h-full flex">
                {/* Main conversations area */}
                <div className="flex-1 p-6">
                    {conversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
                            <p className="text-sm text-gray-500 mb-6">Start a conversation to get help with your data or ask questions about your footprint.</p>
                            <button
                                onClick={() => setShowConversationPanel(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            >
                                Ask a question
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Future: List of conversations */}
                            <p className="text-gray-500">Conversations will appear here...</p>
                        </div>
                    )}
                </div>

                {/* Ask a question button (always visible in top right) */}
                <div className="absolute top-4 right-6">
                    <button
                        onClick={() => setShowConversationPanel(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                        Ask a question
                    </button>
                </div>
            </div>
        );
    };

    const TimelineView = () => {
        return (
            <div className="bg-white h-full relative">
                {/* Ask a question button for Timeline view */}
                <div className="absolute top-6 right-6 z-10">
                    <button
                        onClick={() => setShowConversationPanel(true)}
                        className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                        Ask a question
                    </button>
                </div>
                
                <div className="p-6 max-w-6xl">
                    {/* Goal Banner */}
                    <div className="flex items-center mb-8 rounded-lg overflow-hidden border border-gray-200">
                        {/* Left section - Goal text on gray background */}
                        <div className="bg-gray-100 px-4 py-3 flex-1">
                            <div className="text-sm text-gray-700 font-medium">
                                Your goal is to understand the biggest emitters in your footprint
                            </div>
                        </div>
                        
                        {/* Right section - Status on green background */}
                        <div className="bg-green-100 px-4 py-3 flex items-center space-x-3">
                            <div className="text-sm text-green-800">
                                You're on track to meet your Apr 24 target.
                            </div>
                            <button 
                                onClick={() => setActiveView('tasks')}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                                See tasks →
                            </button>
                        </div>
                    </div>

                    {/* Gantt Chart Timeline */}
                    <div className="relative">
                        {/* Month Headers */}
                        <div className="grid grid-cols-12 gap-0 mb-2 text-xs text-gray-500 font-medium">
                            <div className="col-span-3"></div> {/* Space for task names */}
                            <div className="col-span-3 text-center border-l border-gray-200 py-2">Mar</div>
                            <div className="col-span-3 text-center border-l border-gray-200 py-2">Apr</div>
                            <div className="col-span-3 text-center border-l border-gray-200 py-2">May</div>
                        </div>

                        {/* Today marker line */}
                        <div className="absolute left-1/2 top-8 bottom-0 w-px bg-red-400 z-10">
                            <div className="absolute -top-6 -left-4 text-xs text-red-600 font-medium">Today</div>
                        </div>

                        {/* Target marker */}
                        <div className="absolute right-8 top-8 bottom-0 w-px bg-blue-400 z-10">
                            <div className="absolute -top-6 -left-6 text-xs text-blue-600 font-medium">Target</div>
                        </div>

                        {/* Timeline Grid */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            {/* Data Collection Row */}
                            <div className="grid grid-cols-12 gap-0 border-b border-gray-200">
                                <div className="col-span-3 p-4 bg-gray-50 border-r border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        <span className="text-sm font-medium text-gray-900">Data collection</span>
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1">On track</div>
                                </div>
                                <div className="col-span-9 relative p-2">
                                    {/* Data collection bar - spans from start to middle */}
                                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 h-6 bg-blue-500 rounded" style={{width: '45%'}}>
                                        <div className="h-full flex items-center justify-center text-xs text-white font-medium">
                                            Data collection
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Data Review & Processing Row */}
                            <div className="grid grid-cols-12 gap-0 border-b border-gray-200">
                                <div className="col-span-3 p-4 bg-gray-50 border-r border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                        <span className="text-sm font-medium text-gray-900">Data review & processing</span>
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1">Watershed is processing your data</div>
                                </div>
                                <div className="col-span-9 relative p-2">
                                    {/* Processing bar - spans middle section */}
                                    <div className="absolute left-1/3 top-1/2 transform -translate-y-1/2 h-6 bg-blue-400 rounded" style={{width: '35%'}}>
                                        <div className="h-full flex items-center justify-center text-xs text-white font-medium">
                                            Processing
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footprint Review Row */}
                            <div className="grid grid-cols-12 gap-0">
                                <div className="col-span-3 p-4 bg-gray-50 border-r border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                        <span className="text-sm font-medium text-gray-900">Footprint review</span>
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1">Not started</div>
                                </div>
                                <div className="col-span-9 relative p-2">
                                    {/* Footprint review bar - future section */}
                                    <div className="absolute right-8 top-1/2 transform -translate-y-1/2 h-6 bg-gray-300 rounded" style={{width: '25%'}}>
                                        <div className="h-full flex items-center justify-center text-xs text-gray-600 font-medium">
                                            Review
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const ConversationPanel = () => {
        const [message, setMessage] = useState('');

        const handleSendMessage = () => {
            if (message.trim()) {
                // Mock sending message (would integrate with backend)
                console.log('Sending message:', message);
                setMessage('');
                setShowConversationPanel(false);
                // Could add to conversations list here
            }
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
                <div className="bg-white w-96 h-full shadow-xl flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Ask a question</h3>
                        <button
                            onClick={() => setShowConversationPanel(false)}
                            className="p-1 rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 flex flex-col">
                        <div className="flex-1 flex flex-col items-center justify-center text-center mb-6">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-500">
                                Ask questions about your data, get help with measurements, or request guidance on your carbon footprint.
                            </p>
                        </div>

                        {/* Message Input */}
                        <div className="space-y-3">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your question here..."
                                className="w-full h-24 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.metaKey) {
                                        handleSendMessage();
                                    }
                                }}
                            />
                            <div className="flex justify-between items-center">
                                <p className="text-xs text-gray-400">Press ⌘+Enter to send</p>
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!message.trim()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white h-full">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <div className="px-6">
                    <div className="flex space-x-8">
                        <button
                            onClick={() => setActiveView('timeline')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeView === 'timeline'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Timeline
                        </button>
                        <button
                            onClick={() => setActiveView('tasks')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeView === 'tasks'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Tasks
                        </button>
                        <button
                            onClick={() => setActiveView('conversations')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeView === 'conversations'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Conversations ({conversations.length})
                        </button>
                    </div>
                </div>
            </div>

            {/* View Content */}
            {activeView === 'timeline' ? (
                <TimelineView />
            ) : activeView === 'conversations' ? (
                <ConversationsView />
            ) : (
                <div className="p-6">
                    {/* Tasks View Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                            <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
                                <span>List</span>
                            </button>
                            <button className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                                <span>Board</span>
                            </button>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <span>By dataset</span>
                                <ChevronDown className="w-4 h-4" />
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <span>All datasets</span>
                                <ChevronDown className="w-4 h-4" />
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <span>All assignees</span>
                                <ChevronDown className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setShowConversationPanel(true)}
                                className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            >
                                Ask a question
                            </button>
                            <button className="text-sm text-blue-600 hover:text-blue-700">
                                Notify assignees...
                            </button>
                            <button className="text-sm text-gray-500 hover:text-gray-700">
                                Manage sources
                                <ChevronDown className="w-4 h-4 inline ml-1" />
                            </button>
                        </div>
                    </div>

                    {/* Datasets List */}
                    <div className="bg-white border border-gray-200 rounded-lg">
                        {datasets.map(d => <DatasetItem key={d.name} dataset={d} onUploadClick={onUploadClick} />)}
                    </div>
                </div>
            )}
            
            {/* Conversation Panel */}
            {showConversationPanel && <ConversationPanel />}
        </div>
    );
}

export const UploadScreen = ({ onFilesUploaded }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = (files) => {
        if (files.length === 0) return;
        setIsProcessing(true);
        setTimeout(() => {
            onFilesUploaded(Array.from(files));
        }, 2000);
    };

    const handleFileChange = (event) => {
        if (event.target.files) {
            handleFileSelect(event.target.files);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) {
            handleFileSelect(e.dataTransfer.files);
        }
    };

    return (
        <div className="bg-white h-full flex flex-col">
            <div className="flex-1 p-8 flex flex-col items-center justify-center" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                {isProcessing ? (
                    <div className="flex flex-col items-center">
                        <LoaderCircle className="w-12 h-12 text-blue-600 animate-spin" />
                        <p className="mt-4 text-lg text-gray-600">Processing files...</p>
                        <p className="text-sm text-gray-500">This may take a few moments.</p>
                    </div>
                ) : (
                    <div className={`w-full max-w-2xl h-80 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${
                        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}>
                        <UploadCloud className="h-16 w-16 text-gray-400" />
                        <p className="mt-4 text-xl text-gray-600">
                            Drag and drop files or{' '}
                            <button onClick={() => fileInputRef.current.click()} className="font-semibold text-blue-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded">
                                browse
                            </button>
                        </p>
                        <p className="text-sm text-gray-500 mt-2">PDF, JPG, or PNG files are accepted.</p>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
                    </div>
                )}
            </div>
        </div>
    );
};

export const UploadResultsScreen = ({ uploadedFiles }) => {
    const successfulFiles = uploadedFiles.filter(f => !f.needsReview);
    const reviewFiles = uploadedFiles.filter(f => f.needsReview);
    
    return (
        <div className="bg-white h-full flex flex-col">            
            <div className="flex-1 p-8">
                <div className="max-w-4xl mx-auto h-full flex flex-col">
                    <div className="mb-6">
                        <div className="flex items-center mb-4">
                            <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900">Upload Complete</h2>
                                <p className="text-gray-600">{uploadedFiles.length} files processed successfully</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
                        {/* Successfully Processed */}
                        <div className="bg-green-50 border border-green-200 rounded-lg flex flex-col min-h-0">
                            <div className="p-4 border-b border-green-200">
                                <div className="flex items-center mb-2">
                                    <FileCheck className="w-5 h-5 text-green-600 mr-2" />
                                    <h3 className="text-lg font-semibold text-green-900">
                                        Ready to Process ({successfulFiles.length})
                                    </h3>
                                </div>
                                <p className="text-green-700 text-sm">
                                    These files were read successfully and are ready for carbon footprint calculation.
                                </p>
                            </div>
                            <div className="flex-1 p-4 overflow-y-auto">
                                <div className="space-y-2">
                                    {successfulFiles.map((file, index) => (
                                        <div key={index} className="flex items-center bg-white p-2 rounded-md border">
                                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-gray-900 text-sm truncate">
                                                    {file.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    All data extracted successfully
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Needs Review */}
                        {reviewFiles.length > 0 && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg flex flex-col min-h-0">
                                <div className="p-4 border-b border-amber-200">
                                    <div className="flex items-center mb-2">
                                        <AlertTriangle className="w-5 h-5 text-amber-600 mr-2" />
                                        <h3 className="text-lg font-semibold text-amber-900">
                                            Needs Review ({reviewFiles.length})
                                        </h3>
                                    </div>
                                    <p className="text-amber-700 text-sm">
                                        These files require manual review to confirm extracted data before processing.
                                    </p>
                                </div>
                                <div className="flex-1 p-4 overflow-y-auto">
                                    <div className="space-y-2">
                                        {reviewFiles.map((file, index) => (
                                            <div key={index} className="flex items-center bg-white p-2 rounded-md border">
                                                <AlertTriangle className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-medium text-gray-900 text-sm truncate">
                                                        {file.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {file.reviewReason}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export const ConfirmationModal = ({ onClose, count }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload Complete</h2>
            <p className="text-gray-600 mb-6">{`${count} bills successfully processed and added to your footprint.`}</p>
            <button
                onClick={onClose}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
            >
                Done
            </button>
        </div>
    </div>
);

export const Sidebar = ({ view, setView, showFooter = true, showHeader = true }) => {
    const [expanded, setExpanded] = useState('Measurements');

    return (
        <div className="bg-[#0f172a] text-white w-64 flex-shrink-0 flex flex-col font-sans">
            {showHeader && (
                <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center font-bold">W</div>
                        <span className="text-lg font-semibold">Watershed</span>
                    </div>
                </div>
            )}
            <nav className="flex-1 p-2 space-y-1">
                {sidebarNavItems.map((item) => {
                    const isParentActive = item.subItems && item.subItems.some(sub => sub.view === view);
                    const IconComponent = iconComponents[item.icon];
                    return (
                        <div key={item.name}>
                            <button onClick={() => {
                                if (item.view && !item.subItems) setView(item.view);
                                if (item.subItems) {
                                    setExpanded(item.name === expanded ? null : item.name);
                                    // Navigate to first sub-item if it has a view
                                    const firstSubItem = item.subItems.find(sub => sub.view);
                                    if (firstSubItem) {
                                        setView(firstSubItem.view);
                                    }
                                }
                            }} className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                                (item.view === view || isParentActive) ? 'bg-gray-700' : 'hover:bg-gray-700'
                            } focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400`}>
                                <IconComponent className="w-5 h-5 mr-3" />
                                <span>{item.name}</span>
                            </button>
                            {item.subItems && expanded === item.name && (
                                <div className="pl-8 mt-1 space-y-1">
                                    {item.subItems.map(subItem => (
                                        <button key={subItem.name || subItem} onClick={() => subItem.view && setView(subItem.view)}
                                         className={`w-full text-left block px-3 py-1.5 rounded-md text-sm transition-colors duration-150 ${
                                             subItem.view === view ? 'bg-gray-700 text-white' : 'text-gray-300'
                                         } hover:bg-gray-700 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400`}>
                                            {subItem.name || subItem}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })}
            </nav>
            {showFooter && (
                <div className="p-4 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center text-pink-700 font-bold">J</div>
                            <span className="text-sm">Jane</span>
                        </div>
                        <button className="p-1 rounded-full hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
                            <Settings className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const DonutSegment = ({ percentage, color, radius, startAngle, onMouseEnter, onMouseLeave, onClick }) => {
  const endAngle = startAngle + percentage * 360;

  const getCoords = (angle) => {
    const radians = (angle - 90) * Math.PI / 180;
    return [
      100 + radius * Math.cos(radians),
      100 + radius * Math.sin(radians)
    ];
  };

  const [startX, startY] = getCoords(startAngle);
  const [endX, endY] = getCoords(endAngle);

  const largeArcFlag = percentage > 0.5 ? 1 : 0;

  const pathData = [
    `M ${startX} ${startY}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`
  ].join(' ');

  return (
    <path
      d={pathData}
      fill="transparent"
      stroke={color}
      strokeWidth="30"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="cursor-pointer transition-opacity duration-200"
    />
  );
};

const DonutChart = ({ data, colors, onCategoryClick, onHover }) => {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  let cumulativePercentage = 0;

  return (
    <svg width="200" height="200" viewBox="0 0 200 200">
      {data.map((item, index) => {
        const percentage = item.value / total;
        const startAngle = cumulativePercentage * 360;
        cumulativePercentage += percentage;

        return (
          <DonutSegment
            key={index}
            percentage={percentage}
            color={colors[item.category]}
            radius={80}
            startAngle={startAngle}
            onClick={() => onCategoryClick(item.category)}
            onMouseEnter={() => onHover(item)}
            onMouseLeave={() => onHover(null)}
          />
        );
      })}
    </svg>
  );
};

const ExpandableRow = ({ category, value, children }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    return (
        <div className="border-t border-gray-200">
            <div className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center">
                    <ChevronDown className={`w-5 h-5 mr-3 text-gray-500 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
                    <span className="font-medium text-gray-900">{category}</span>
                </div>
                <span className="font-mono text-gray-900">{value.toLocaleString()} <span className="text-gray-500">tCO₂e</span></span>
            </div>
            {isExpanded && <div className="pl-12 pr-6 pb-6 bg-gray-50">{children}</div>}
        </div>
    )
}

export const FootprintScreen = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [hovered, setHovered] = useState(null);
    const maxVal = 120;
    const totalGoodsAndServices = footprintData.goodsAndServicesBreakdown.reduce((sum, item) => sum + item.value, 0);
    
    const handleCategoryClick = (category) => {
        if (category === 'Goods & Services') {
            setSelectedCategory(prev => prev === category ? null : category);
        }
    }

    return (
        <div className="bg-gray-50 h-full p-8">
            <div className="bg-white p-8 rounded-lg shadow-lg relative">
                <div className="grid grid-cols-2 gap-8 border-b pb-6">
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Gross emissions by category</h2>
                        <div className="flex items-center">
                            <div className="relative">
                                <DonutChart data={footprintData.donutData} colors={footprintData.colors} onCategoryClick={handleCategoryClick} onHover={setHovered} />
                                {hovered && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold">{hovered.value}%</div>
                                            <div className="text-sm text-gray-500">{hovered.category}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="ml-8">
                                {footprintData.categories.map(cat => (
                                    <div key={cat} onClick={() => handleCategoryClick(cat)} className={`flex items-center mb-2 p-1 rounded-md ${cat === 'Goods & Services' ? 'cursor-pointer hover:bg-gray-100' : ''} ${selectedCategory === cat ? 'bg-gray-100' : ''}`}>
                                        <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: footprintData.colors[cat]}}></div>
                                        <span className="text-sm">{cat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Gross emissions over time</h2>
                        <div className="flex">
                            <div className="flex flex-col justify-between text-right text-sm text-gray-500 pr-4" style={{ height: '200px' }}>
                               <span>{maxVal}</span>
                               <span>{maxVal * 0.5}</span>
                               <span>0</span>
                            </div>
                            <div className="flex-1 grid grid-cols-5 gap-4 border-l border-gray-200 pl-4" style={{ height: '200px' }}>
                                {footprintData.barData.map((monthData, monthIndex) => (
                                    <div key={monthIndex} className="flex flex-col-reverse relative group">
                                        {monthData.map((value, catIndex) => (
                                            <div key={catIndex} style={{ height: `${(value / maxVal) * 100}%`, backgroundColor: footprintData.colors[footprintData.categories[catIndex]] }} className="transition-opacity duration-200 group-hover:opacity-75"></div>
                                        ))}
                                        <span className="absolute -bottom-6 text-center w-full text-sm text-gray-600">{footprintData.labels[monthIndex]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {selectedCategory === 'Goods & Services' && (
                    <ExpandableRow category="Goods & Services" value={totalGoodsAndServices}>
                        <div className="space-y-4">
                            {footprintData.goodsAndServicesBreakdown.map(item => (
                                <div key={item.name} className="flex justify-between items-center py-2">
                                    <span className="text-gray-900">{item.name}</span>
                                    <span className="font-mono text-gray-900">{item.value.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </ExpandableRow>
                )}
            </div>
        </div>
    )
}

const UtilityBillPlaceholder = () => (
    <div className="w-full h-full bg-gray-100 rounded-lg p-8 flex items-center justify-center">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 transform scale-110">
            <div className="flex justify-between items-center mb-6">
                <div className="w-10 h-10 bg-blue-500 rounded-full"></div>
                <div className="w-28 h-5 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <hr className="my-6 border-t-2"/>
                <div className="space-y-4 relative">
                    <div className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                    </div>
                    <div className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="absolute -left-4 -right-4 top-1/2 -translate-y-1/2 h-8 bg-yellow-300 bg-opacity-50 rounded"></div>
                </div>
            </div>
        </div>
    </div>
);

const CalendarHeader = ({ viewDate, setViewDate, setIsSelectingMonth, setIsSelectingYear, months }) => (
    <div className="flex justify-between items-center mb-2 px-2">
        <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
            <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-1">
             <button onClick={() => setIsSelectingMonth(prev => !prev)} className="font-semibold px-2 py-1 hover:bg-gray-100 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">{months[viewDate.getMonth()]}</button>
             <button onClick={() => setIsSelectingYear(prev => !prev)} className="font-semibold px-2 py-1 hover:bg-gray-100 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">{viewDate.getFullYear()}</button>
        </div>
        <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
             <ChevronRight className="w-5 h-5" />
        </button>
    </div>
);

export const Calendar = ({ selectedDate, onDateSelect }) => {
    const [viewDate, setViewDate] = useState(selectedDate || new Date());
    const [isSelectingMonth, setIsSelectingMonth] = useState(false);
    const [isSelectingYear, setIsSelectingYear] = useState(false);

    const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

    const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();

    const handleDateClick = (day) => {
        onDateSelect(new Date(viewDate.getFullYear(), viewDate.getMonth(), day));
    };
    
    if (isSelectingMonth) {
        return (
             <div className="grid grid-cols-3 gap-2 p-2">
                 {months.map((month, index) => (
                    <button key={month} onClick={() => { setViewDate(new Date(viewDate.getFullYear(), index, 1)); setIsSelectingMonth(false); }}
                        className="p-2 text-sm rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
                        {month}
                    </button>
                ))}
            </div>
        )
    }
    
    if (isSelectingYear) {
        return (
            <div className="grid grid-cols-4 gap-2 p-2">
                {years.map((year) => (
                    <button key={year} onClick={() => { setViewDate(new Date(year, viewDate.getMonth(), 1)); setIsSelectingYear(false); }}
                        className="p-2 text-sm rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
                        {year}
                    </button>
                ))}
            </div>
        )
    }


    return (
        <div className="w-64 p-2">
            <CalendarHeader 
                viewDate={viewDate} 
                setViewDate={setViewDate} 
                setIsSelectingMonth={setIsSelectingMonth} 
                setIsSelectingYear={setIsSelectingYear} 
                months={months} 
                years={years} 
            />
            {isSelectingMonth ? (
                <div className="grid grid-cols-3 gap-2 p-2">
                    {months.map((month, index) => (
                        <button key={month} onClick={() => { setViewDate(new Date(viewDate.getFullYear(), index, 1)); setIsSelectingMonth(false); }}
                            className="p-2 text-sm rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
                            {month}
                        </button>
                    ))}
                </div>
            ) : isSelectingYear ? (
                <div className="grid grid-cols-4 gap-2 p-2">
                    {years.map((year) => (
                        <button key={year} onClick={() => { setViewDate(new Date(year, viewDate.getMonth(), 1)); setIsSelectingYear(false); }}
                            className="p-2 text-sm rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
                            {year}
                        </button>
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
                        {daysOfWeek.map(day => <div key={day}>{day}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {Array(firstDayOfMonth).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
                        {Array(daysInMonth).fill(null).map((_, i) => {
                            const day = i + 1;
                            const isSelected = selectedDate && day === selectedDate.getDate() && viewDate.getMonth() === selectedDate.getMonth() && viewDate.getFullYear() === selectedDate.getFullYear();
                            const isToday = day === new Date().getDate() && viewDate.getMonth() === new Date().getMonth() && viewDate.getFullYear() === new Date().getFullYear();
                            
                            return (
                                <button key={day} onClick={() => handleDateClick(day)}
                                    className={`h-8 w-8 text-sm rounded-full transition-colors ${
                                        isSelected ? 'bg-blue-600 text-white font-semibold' :
                                        isToday ? 'bg-gray-200' : 'hover:bg-gray-100'
                                    } focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400`}>
                                    {day}
                                </button>
                            )
                        })}
                    </div>
                     <div className="mt-2 pt-2 border-t">
                         <button onClick={() => onDateSelect(new Date())} className="w-full text-center text-sm font-semibold text-blue-600 hover:bg-gray-100 p-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">Today</button>
                    </div>
                </>
            )}
        </div>
    );
};


export const ValidationScreen = ({ onValidationComplete }) => {
    const [step, setStep] = useState(0);
    const [kwhValue, setKwhValue] = useState("15,220");
    const [dateValue, setDateValue] = useState("2025/07/31");
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const billsToReview = [
        {
            id: 'BlurryScan_Seattle_Office_June2025.pdf',
            field: 'Electricity Usage (kWh)',
            value: kwhValue,
            setter: setKwhValue,
            type: 'text'
        },
        {
            id: 'WeirdDateFormat_London_UK_Office_June2025.pdf',
            field: 'Billing Period End Date',
            value: dateValue,
            setter: setDateValue,
            type: 'date'
        }
    ];

    
    const handleConfirm = () => {
        if (step < billsToReview.length - 1) {
            setStep(step + 1);
        }
    };

    return (
        <div className="bg-gray-50 h-full flex flex-col">
            <div className="flex-1 p-8 grid grid-cols-2 gap-8 overflow-y-auto">
                <div className="bg-white border rounded-lg flex items-center justify-center overflow-hidden">
                    <UtilityBillPlaceholder />
                </div>
                <div className="bg-white border rounded-lg p-6 flex flex-col">
                    <div className="relative flex-1">
                        {billsToReview.map((bill, index) => (
                            <div key={bill.id} className={`transition-all duration-300 ease-in-out ${step === index ? 'opacity-100' : 'opacity-0 absolute'}`}>
                                <h2 className="text-lg font-semibold mb-1">Extracted Data</h2>
                                <p className="text-sm text-gray-600 mb-4">File: {bill.id}</p>
                                <label className="block text-sm font-medium text-gray-700">{bill.field}</label>
                                <p className="text-xs text-gray-500 mb-2">Please confirm or correct the highlighted value.</p>
                               
                                {bill.type === 'text' && (
                                     <div className="relative">
                                        <input
                                            type="text"
                                            value={bill.value}
                                            onChange={(e) => bill.setter(e.target.value)}
                                            className="block w-full sm:text-sm rounded-md border-yellow-400 border-2 p-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                )}
                                
                                {bill.type === 'date' && (
                                    <div className="relative">
                                        <div onClick={() => setIsCalendarOpen(!isCalendarOpen)} className="cursor-pointer">
                                            <input
                                                type="text"
                                                readOnly
                                                value={new Date(bill.value).toLocaleDateString()}
                                                className="block w-full sm:text-sm rounded-md border-yellow-400 border-2 p-2 bg-white cursor-pointer"
                                            />
                                            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                                        </div>
                                        {isCalendarOpen && (
                                             <div className="absolute top-full mt-1 bg-white border rounded-lg shadow-lg z-10">
                                                <Calendar selectedDate={new Date(bill.value)} onDateSelect={date => { bill.setter(date); setIsCalendarOpen(false);}} />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {step === 0 && (
                        <button onClick={handleConfirm} className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500">
                             Confirm and Next
                         </button>
                    )}
                </div>
            </div>
            <div className="bg-white p-4 border-t flex justify-end">
                <button
                    onClick={onValidationComplete}
                    disabled={step < billsToReview.length -1}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                >
                    Finish Upload
                </button>
            </div>
        </div>
    );
};