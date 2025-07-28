import React, { useState, useRef, useEffect } from 'react';
import { Home, BarChart2, Briefcase, FileText, ShoppingCart, Settings, ChevronDown, ChevronRight, List, LayoutGrid, Circle, CheckCircle, XCircle, UploadCloud, X, File as FileIcon, LoaderCircle, AlertCircle } from 'lucide-react';

// --- Mock Data ---
const sidebarNavItems = [
  { name: 'Home', icon: Home },
  { name: 'Measurements', icon: BarChart2, active: true, subItems: ['Active measurement'] },
  { name: 'Footprint', icon: Briefcase, subItems: ['Overview', 'Drilldown', 'Change log'] },
  { name: 'Reduction plans', icon: FileText, subItems: ['All plans', '2022 Reduction Plan'] },
  { name: 'Marketplace', icon: ShoppingCart, subItems: ['Explore', 'Clean power', 'Purchases'] },
  { name: 'Reporting', icon: FileText, subItems: ['Reports', 'Program summary'] },
];

const initialDatasets = [
    { name: 'Capital expenses', tasks: [] },
    { name: 'Buildings', tasks: [] },
    { name: 'Cloud usage', tasks: [] },
    { name: 'Cost of revenue', tasks: [] },
    { name: 'Flights', tasks: [
        { id: 1, status: 'To do', description: 'Upload Flights', assignee: 'Unassigned' },
        { id: 2, status: 'To do', description: 'Upload Flights: TripActions', assignee: 'Madeline Pickering' },
        { id: 3, status: 'Blocked', description: 'Process Flights', assignee: 'Watershed expert' },
        { id: 4, status: 'To do', description: 'There is an issue here', assignee: 'Madeline Pickering', issue: true },
    ]},
    { name: 'Hotels', tasks: [] },
    { name: 'Card production', tasks: [] },
    { name: 'Cloud costs', tasks: [] },
    { name: 'Revenue', tasks: [] },
    { name: 'Upstream logistics', tasks: [] },
    {
        name: 'Utilities',
        tasks: [
            { id: 5, status: 'To do', description: 'Upload Utilities: Urjanet', assignee: 'Jane', isInteractive: true }
        ]
    },
    { name: 'Chart of accounts', tasks: [] },
    { name: 'Employees', tasks: [] },
    { name: 'Operating expenses', tasks: [] },
    { name: 'Downstream logistics', tasks: [] },
];


// --- Helper Components ---
const StatusIcon = ({ status }) => {
    switch (status) {
        case 'To do': return <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />;
        case 'Blocked': return <XCircle className="w-4 h-4 text-red-500 fill-red-100 flex-shrink-0" />;
        case 'Done': return <CheckCircle className="w-4 h-4 text-green-500 fill-green-100 flex-shrink-0" />;
        default: return <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />;
    }
};

const AssigneePill = ({ name }) => {
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


// --- Main UI Components ---
const Sidebar = () => (
    <div className="bg-[#0f172a] text-white w-64 flex-shrink-0 flex flex-col font-sans">
        <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center font-bold">W</div>
                <span className="text-lg font-semibold">Watershed</span>
            </div>
        </div>
        <nav className="flex-1 p-2 space-y-1">
            {sidebarNavItems.map((item) => (
                <div key={item.name}>
                    <a href="#" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${item.active ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                        <item.icon className="w-5 h-5 mr-3" />
                        <span>{item.name}</span>
                    </a>
                    {item.active && item.subItems && (
                        <div className="pl-8 mt-1 space-y-1">
                            {item.subItems.map(subItem => (
                                <a key={subItem} href="#" className="block px-3 py-1.5 rounded-md text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                                    {subItem}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center text-pink-700 font-bold">J</div>
                    <span className="text-sm">Jane</span>
                </div>
                <Settings className="w-5 h-5 text-gray-400" />
            </div>
        </div>
    </div>
);

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

const ActiveMeasurementScreen = ({ datasets, onUploadClick }) => (
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

// --- Enhanced Upload Modal with Multi-file Drag & Drop ---
const UploadModal = ({ onClose, onUploadComplete }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadState, setUploadState] = useState('idle');
    const [fileStatuses, setFileStatuses] = useState({});
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (selectedFiles.length > 0 && uploadState === 'idle') {
            setUploadState('confirming');
        } else if (selectedFiles.length === 0 && uploadState === 'confirming') {
            setUploadState('idle');
        }
    }, [selectedFiles, uploadState]);


    const handleFileSelect = (files) => {
        const newFiles = Array.from(files).filter(file =>
            (file.type === 'application/pdf' || file.type.startsWith('image/')) &&
            !selectedFiles.some(f => f.name === file.name && f.size === file.size)
        );
        setSelectedFiles(prev => [...prev, ...newFiles]);
    };

    const handleFileChange = (event) => {
        if (event.target.files) {
            handleFileSelect(event.target.files);
            event.target.value = null; // Reset for same file selection
        }
    };

    const handleBrowseClick = () => {
        fileInputRef.current.click();
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        if (event.dataTransfer.files) {
            handleFileSelect(event.dataTransfer.files);
        }
    };

    const removeFile = (fileToRemove) => {
        setSelectedFiles(prev => prev.filter(file => file !== fileToRemove));
    };
    
    const handleUpload = () => {
        setUploadState('processing');
        const initialStatuses = selectedFiles.reduce((acc, file) => {
            acc[file.name] = { progress: 0, status: 'processing' };
            return acc;
        }, {});
        setFileStatuses(initialStatuses);
    
        const totalFiles = selectedFiles.length;
        let filesProcessed = 0;
    
        selectedFiles.forEach(file => {
            const interval = setInterval(() => {
                setFileStatuses(prev => {
                    const currentProgress = prev[file.name]?.progress ?? 0;
                    if (currentProgress >= 100) {
                        clearInterval(interval);
                        
                        const newStatus = 'success'; // Always succeed for the prototype
                        
                        if ((prev[file.name]?.status) !== 'success') {
                            filesProcessed++;
                        }
                        
                        if (filesProcessed === totalFiles) {
                           setUploadState('processed');
                           onUploadComplete();
                        }
                        
                        return {
                            ...prev,
                            [file.name]: { ...prev[file.name], progress: 100, status: newStatus }
                        };
                    }
                    return {
                        ...prev,
                        [file.name]: { ...prev[file.name], progress: (currentProgress + 10) }
                    };
                });
            }, 100 + Math.random() * 200); // Varied speed
        });
    };

    const renderContent = () => {
        const mainContentClasses = `flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`;

        if (uploadState === 'processing' || uploadState === 'processed') {
            return (
                <>
                    <div className="p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            {uploadState === 'processing' ? 'Processing uploads...' : 'Finished uploads'}
                        </h4>
                        <div className="space-y-3">
                            {selectedFiles.map(file => (
                                <FileProgressItem 
                                    key={file.name} 
                                    file={file} 
                                    progress={fileStatuses[file.name]?.progress ?? 0}
                                    status={fileStatuses[file.name]?.status ?? 'processing'}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 disabled:bg-blue-300"
                            disabled={uploadState === 'processing'}
                        >
                            Done
                        </button>
                    </div>
                </>
            );
        }

        return (
             <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                {selectedFiles.length > 0 && (
                     <div className="p-6 max-h-60 overflow-y-auto">
                        <div className="space-y-2">
                             {selectedFiles.map((file) => (
                                <div key={file.name} className="flex items-center p-2 border rounded-lg bg-gray-50">
                                    <FileIcon className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
                                    <div className="flex-grow min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                                    </div>
                                    <button onClick={() => removeFile(file)} className="p-1 text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                 <div className="p-4">
                     <div className={mainContentClasses}>
                         <UploadCloud className="h-8 w-8 text-gray-400" />
                         <p className="mt-2 text-gray-600">
                             Drag and drop files or{' '}
                             <button onClick={handleBrowseClick} className="font-semibold text-blue-600 hover:underline">
                                 browse
                             </button>
                         </p>
                         <p className="text-xs text-gray-500 mt-1">PDF, JPG, or PNG files are accepted.</p>
                     </div>
                 </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end">
                    <button onClick={handleUpload} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700" disabled={selectedFiles.length === 0}>
                        {`Upload ${selectedFiles.length} file${selectedFiles.length === 1 ? '' : 's'}`}
                    </button>
                </div>
                 <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.jpg,.jpeg,.png" multiple />
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-medium text-gray-900">Upload Utilities</h3>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

const FileProgressItem = ({ file, progress, status }) => {
    const getStatusIcon = () => {
        switch (status) {
            case 'processing': return <LoaderCircle className="w-5 h-5 text-blue-500 animate-spin flex-shrink-0" />;
            case 'success': return <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />;
            case 'error': return <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />;
            default: return null;
        }
    };

    return (
        <div>
            <div className="flex items-center space-x-3">
                {getStatusIcon()}
                <span className={`flex-grow text-sm truncate ${status === 'error' ? 'text-red-600' : 'text-gray-800'}`}>{file.name}</span>
                {status === 'error' && <span className="text-sm text-red-600 flex-shrink-0">Could not read file</span>}
            </div>
             <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5">
                <div 
                    className={`h-1.5 rounded-full transition-all duration-150 ${status === 'success' ? 'bg-green-500' : 'bg-blue-600'}`}
                    style={{ width: `${progress}%` }}>
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---
export default function App() {
    const [datasets, setDatasets] = useState(initialDatasets);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleUploadComplete = () => {
        const updatedDatasets = datasets.map(dataset => {
            if (dataset.name === 'Utilities') {
                return {
                    ...dataset,
                    tasks: dataset.tasks.map(task =>
                        task.isInteractive ? { ...task, status: 'Done' } : task
                    )
                };
            }
            return dataset;
        });
        setDatasets(updatedDatasets);
    };

    return (
        <div className="h-screen w-screen bg-gray-100 flex font-sans">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                <ActiveMeasurementScreen datasets={datasets} onUploadClick={() => setIsModalOpen(true)} />
            </main>
            {isModalOpen && <UploadModal onClose={() => setIsModalOpen(false)} onUploadComplete={handleUploadComplete} />}
        </div>
    );
}
