import React, { useState } from 'react';
import { Settings, ArrowLeft, HelpCircle } from 'lucide-react';
// Corrected imports to point to the single components.jsx file
import { 
    Sidebar,
    FootprintScreen,
    ValidationScreen,
    ActiveMeasurementScreen, 
    UploadScreen,
    UploadResultsScreen,
    ConfirmationModal 
} from './components/components.jsx';
import { initialDatasets } from './mockData';

export default function App() {
    const [datasets, setDatasets] = useState(initialDatasets);
    const [view, setView] = useState('taskList'); // taskList, uploadScreen, uploadResults, validationScreen, footprint
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [uploadedFileCount, setUploadedFileCount] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [needsValidation, setNeedsValidation] = useState(false);
    const [showValidationHelp, setShowValidationHelp] = useState(false);
    const [showUploadResultsHelp, setShowUploadResultsHelp] = useState(false);
    const [showUploadHelp, setShowUploadHelp] = useState(false);

    const handleUploadClick = () => setView('uploadScreen');

    const handleFilesUploaded = (files) => {
        setUploadedFileCount(files.length);
        
        // Create file objects with review status
        const processedFiles = files.map(file => {
            const needsReview = file.name === 'WeirdDateFormat_London_UK_Office_June2025.pdf' || file.name === 'BlurryScan_Seattle_Office_June2025.pdf';
            return {
                name: file.name,
                needsReview,
                reviewReason: needsReview ? 
                    (file.name.includes('WeirdDateFormat') ? 'Date format unclear' : 'Poor scan quality') : 
                    null
            };
        });
        
        setUploadedFiles(processedFiles);
        setNeedsValidation(processedFiles.some(f => f.needsReview));
        setView('uploadResults');
    };
    
    const handleValidationComplete = () => {
        setShowConfirmation(true);
    };

    const handleUploadResultsContinue = () => {
        if (needsValidation) {
            setView('validationScreen');
        } else {
            setShowConfirmation(true);
        }
    };

    const handleConfirmationClose = () => {
        setShowConfirmation(false);
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
        setView('taskList');
    };
    
    const renderView = () => {
        switch (view) {
            case 'uploadScreen':
                return <UploadScreen onFilesUploaded={handleFilesUploaded} showHelpModal={showUploadHelp} setShowHelpModal={setShowUploadHelp} />;
            case 'uploadResults':
                return <UploadResultsScreen 
                    uploadedFiles={uploadedFiles} 
                    onContinue={handleUploadResultsContinue}
                    showHelpModal={showUploadResultsHelp}
                    setShowHelpModal={setShowUploadResultsHelp}
                />;
            case 'validationScreen':
                return <ValidationScreen onValidationComplete={handleValidationComplete} showHelpModal={showValidationHelp} setShowHelpModal={setShowValidationHelp} />;
            case 'footprint':
                return <FootprintScreen />;
            case 'taskList':
            default:
                return <ActiveMeasurementScreen datasets={datasets} onUploadClick={handleUploadClick} />;
        }
    };

    const renderHeader = () => {
        return (
            <div className="bg-white border-b border-gray-200 flex h-20">
                {/* Sidebar Header */}
                <div className="w-64 bg-[#0f172a] text-white border-b border-gray-700 flex items-center px-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center font-bold">W</div>
                        <span className="text-lg font-semibold">Watershed</span>
                    </div>
                </div>
                
                {/* Main Content Header */}
                <div className="flex-1 bg-white flex items-center">
                    {/* Upload Flow Headers */}
                    {view === 'uploadScreen' && (
                        <div className="w-full px-6 flex items-center justify-between">
                            <div className="flex items-center">
                                <button onClick={() => setView('taskList')} className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <h1 className="text-xl font-semibold text-gray-900 ml-4">Upload Utilities</h1>
                            </div>
                            <button onClick={() => setShowUploadHelp(true)} className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
                                <HelpCircle className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                    {view === 'uploadResults' && (
                        <div className="w-full px-6 flex items-center justify-between">
                            <div className="flex items-center">
                                <button onClick={() => setView('uploadScreen')} className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <h1 className="text-xl font-semibold text-gray-900 ml-4">Upload Results</h1>
                            </div>
                            <button onClick={() => setShowUploadResultsHelp(true)} className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
                                <HelpCircle className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                    {view === 'validationScreen' && (
                        <div className="w-full px-6 flex items-center justify-between">
                            <div className="flex items-center">
                                <button onClick={() => setView('uploadResults')} className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 mr-4">
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div className="flex flex-col justify-center">
                                    <h1 className="text-xl font-semibold text-gray-900">Review {uploadedFiles.filter(f => f.needsReview).length} bills</h1>
                                    <p className="text-sm text-gray-600 mt-1">Our system needs your help to confirm a few values.</p>
                                </div>
                            </div>
                            <button onClick={() => setShowValidationHelp(true)} className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
                                <HelpCircle className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                    
                    {/* Main View Headers */}
                    {view === 'taskList' && (
                        <div className="px-6 flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">2025 measurement</h1>
                        </div>
                    )}
                    {view === 'footprint' && (
                        <div className="px-6 flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">Carbon footprint</h1>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderFooter = () => {
        if (view === 'uploadResults') {
            const successfulFiles = uploadedFiles.filter(f => !f.needsReview);
            const reviewFiles = uploadedFiles.filter(f => f.needsReview);
            
            return (
                <div className="bg-white border-t border-gray-700 flex h-16">
                    {/* Sidebar Footer */}
                    <div className="w-64 bg-[#0f172a] text-white flex items-center justify-between px-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center text-pink-700 font-bold">J</div>
                            <span className="text-sm">Jane</span>
                        </div>
                        <button className="p-1 rounded-full hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
                            <Settings className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                    
                    {/* Main Content Footer */}
                    <div className="flex-1 bg-white flex items-center justify-between px-4">
                        {/* Processing Summary */}
                        <div className="flex items-center space-x-6">
                            {/* Total - differentiated without box */}
                            <div className="text-center">
                                <div className="text-base font-bold text-gray-900">{uploadedFiles.length}</div>
                                <div className="text-xs text-gray-600 font-medium">Total Files</div>
                            </div>
                            
                            {/* Breakdown - using equals pattern */}
                            <div className="flex items-center space-x-3 text-gray-500">
                                <span className="text-sm">=</span>
                                <div className="text-center">
                                    <div className="text-base font-semibold text-green-600">{successfulFiles.length}</div>
                                    <div className="text-xs text-gray-600">Ready</div>
                                </div>
                                <span className="text-sm">+</span>
                                <div className="text-center">
                                    <div className="text-base font-semibold text-amber-600">{reviewFiles.length}</div>
                                    <div className="text-xs text-gray-600">Review</div>
                                </div>
                            </div>
                        </div>
                        
                        {/* CTA Button */}
                        <button
                            onClick={handleUploadResultsContinue}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                        >
                            {reviewFiles.length > 0 ? `Review ${reviewFiles.length} Files` : 'Continue'}
                        </button>
                    </div>
                </div>
            );
        }
        
        // Default sidebar footer for other views
        return (
            <div className="bg-white border-t border-gray-700 flex h-16">
                <div className="w-64 bg-[#0f172a] text-white flex items-center justify-between px-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center text-pink-700 font-bold">J</div>
                        <span className="text-sm">Jane</span>
                    </div>
                    <button className="p-1 rounded-full hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
                        <Settings className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
                <div className="flex-1 bg-white"></div>
            </div>
        );
    };

    return (
        <div className="h-screen w-screen bg-gray-100 flex flex-col font-sans">
            {renderHeader()}
            <div className="flex-1 flex min-h-0">
                <Sidebar view={view} setView={setView} showFooter={false} showHeader={false} />
                <main className="flex-1 overflow-y-auto pb-16">
                    {renderView()}
                </main>
            </div>
            <div className="fixed bottom-0 left-0 right-0">
                {renderFooter()}
            </div>
            {showConfirmation && <ConfirmationModal onClose={handleConfirmationClose} count={uploadedFileCount} />}
        </div>
    );
}



