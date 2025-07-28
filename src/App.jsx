import React, { useState } from 'react';
import { Sidebar } from './components/components';
import { ActiveMeasurementScreen } from './components/components';
import { UploadScreen } from './components/components';
import { ValidationScreen } from './components/components';
import { FootprintScreen } from './components/components';
import { ConfirmationModal } from './components/components';
import { initialDatasets } from './mockData';

export default function App() {
    const [datasets, setDatasets] = useState(initialDatasets);
    const [view, setView] = useState('taskList'); // taskList, uploadScreen, validationScreen, footprint
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [uploadedFileCount, setUploadedFileCount] = useState(0);

    const handleUploadClick = () => setView('uploadScreen');

    const handleFilesUploaded = (files) => {
        setUploadedFileCount(files.length);
        const needsValidation = files.some(f => f.name === 'WeirdDateFormat_London_UK_Office_June2025.pdf' || f.name === 'BlurryScan_Seattle_Office_June2025.pdf');

        if (needsValidation) {
            setView('validationScreen');
        } else {
            setShowConfirmation(true);
        }
    };
    
    const handleValidationComplete = () => {
        setShowConfirmation(true);
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
                return <UploadScreen onBack={() => setView('taskList')} onFilesUploaded={handleFilesUploaded} />;
            case 'validationScreen':
                return <ValidationScreen onValidationComplete={handleValidationComplete} />;
            case 'footprint':
                return <FootprintScreen />;
            case 'taskList':
            default:
                return <ActiveMeasurementScreen datasets={datasets} onUploadClick={handleUploadClick} />;
        }
    };

    return (
        <div className="h-screen w-screen bg-gray-100 flex font-sans">
            <Sidebar view={view} setView={setView} />
            <main className="flex-1 overflow-y-auto">
                {renderView()}
            </main>
            {showConfirmation && <ConfirmationModal onClose={handleConfirmationClose} count={uploadedFileCount} />}
        </div>
    );
}


