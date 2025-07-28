import React, { useState, useRef } from 'react';
import { ArrowLeft, UploadCloud, LoaderCircle, Calendar as CalendarIcon, ChevronDown, ChevronRight, Circle, CheckCircle, XCircle, X } from 'lucide-react';

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
    const TaskItem = ({ task, onUploadClick }) => {
        const isInteractive = task.isInteractive;
        const itemClasses = `flex items-center space-x-4 py-2 px-4 rounded-md ${isInteractive ? 'hover:bg-gray-50 cursor-pointer' : ''}`;

        return (
            <div className={itemClasses} onClick={isInteractive ? onUploadClick : undefined}>
                <StatusIcon status={task.status} />
                <span className="flex-grow text-sm text-gray-800 truncate">
                    {task.issue && <span className="text-red-600 mr-2">!</span>}
                    {task.description}
                </span>
                <div className="flex items-center space-x-2 text-sm text-gray-600 flex-shrink-0">
                    <AssigneePill name={task.assignee} />
                    <ChevronDown className="w-4 h-4" />
                </div>
            </div>
        );
    };

    const DatasetItem = ({ dataset, onUploadClick }) => {
        const [isExpanded, setIsExpanded] = useState(dataset.tasks.length > 0);

        return (
            <div className="border-b last:border-b-0">
                <div className="flex items-center p-2 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? <ChevronDown className="w-5 h-5 text-gray-600" /> : <ChevronRight className="w-5 h-5 text-gray-600" />}
                    <span className="ml-2 font-medium text-gray-800">{dataset.name}</span>
                </div>
                {isExpanded && (
                    <div className="pb-2 pl-4 pr-2">
                        {dataset.tasks.map((task) => (
                            <TaskItem key={task.id} task={task} onUploadClick={onUploadClick} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white h-full">
            <div className="p-6 border-b">
                <h1 className="text-2xl font-semibold text-gray-900">2022 measurement</h1>
            </div>
            <div className="p-6">
                <h2 className="text-lg font-semibold mb-2">Datasets</h2>
                <div className="bg-white border rounded-lg">
                    {datasets.map(d => <DatasetItem key={d.name} dataset={d} onUploadClick={onUploadClick} />)}
                </div>
            </div>
        </div>
    );
}

export const UploadScreen = ({ onBack, onFilesUploaded }) => {
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
            <div className="p-4 border-b flex items-center">
                <button onClick={onBack} className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-semibold text-gray-900 ml-4">Upload Utilities</h1>
            </div>
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
