import React, { useState } from 'react';
import { Home, BarChart2, Briefcase, FileText, ShoppingCart, Settings, ChevronDown, ChevronRight, MoreHorizontal, Plus, List, LayoutGrid, Circle, CheckCircle, XCircle, Clock, ArrowLeft, MessageSquare } from 'lucide-react';

// Mock Data based on screenshots
const sidebarNavItems = [
  { name: 'Home', icon: Home, subItems: ['Peer benchmarks'] },
  { name: 'Measurements', icon: BarChart2, subItems: ['Active measurement'], active: true },
  { name: 'Footprint', icon: Briefcase, subItems: ['Overview', 'Drilldown', 'Change log'] },
  { name: 'Reduction plans', icon: FileText, subItems: ['All plans', '2022 Reduction Plan'] },
  { name: 'Marketplace', icon: ShoppingCart, subItems: ['Explore', 'Clean power', 'Purchases'] },
  { name: 'Reporting', icon: FileText, subItems: ['Reports', 'Program summary'] },
];

const datasets = [
    { name: 'Capital expenses', tasks: [] },
    { name: 'Buildings', tasks: [] },
    { name: 'Cloud usage', tasks: [] },
    { name: 'Cost of revenue', tasks: [] },
    { name: 'Flights', tasks: [
        { status: 'To do', description: 'Upload Flights', assignee: 'Unassigned' },
        { status: 'To do', description: 'Upload Flights: TripActions', assignee: 'Madeline Pickering' },
        { status: 'Blocked', description: 'Process Flights', assignee: 'Watershed expert' },
        { status: 'To do', description: 'There is an issue here', assignee: 'Madeline Pickering', issue: true },
    ]},
    { name: 'Hotels', tasks: [] },
    { name: 'Card production', tasks: [] },
    { name: 'Cloud costs', tasks: [] },
    { name: 'Revenue', tasks: [] },
    { name: 'Upstream logistics', tasks: [] },
    { name: 'Utilities', tasks: [
      { status: 'To do', description: 'Upload Utilities: Urjanet', assignee: 'Jane' }
    ]},
    { name: 'Chart of accounts', tasks: [] },
    { name: 'Employees', tasks: [] },
    { name: 'Operating expenses', tasks: [] },
    { name: 'Downstream logistics', tasks: [] },
];

const exampleData = [
  { month: '2022-08-01', buildingName: 'Doppler', streetAddress: '2021 7th Ave', city: 'Seattle', state: 'WA', postalCode: '98121', country: 'US' },
  { month: '2022-08-01', buildingName: 'London - Old Street', streetAddress: '1 Old Street', city: 'London', state: '', postalCode: 'EC1V 9LA', country: 'UK' },
];

// Helper Components
const StatusIcon = ({ status }) => {
    switch (status) {
        case 'To do': return <Circle className="w-4 h-4 text-gray-400" />;
        case 'Blocked': return <XCircle className="w-4 h-4 text-red-500 fill-red-100" />;
        case 'Done': return <CheckCircle className="w-4 h-4 text-green-500" />;
        default: return <Circle className="w-4 h-4 text-gray-400" />;
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
            <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-semibold text-sm">
                {name.charAt(0)}
            </div>
            <span>{name}</span>
        </div>
    );
};


// Main Components
const Sidebar = ({ onNavigate }) => (
    <div className="bg-[#0f172a] text-white w-64 flex-shrink-0 flex flex-col">
        <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center font-bold">W</div>
                <span className="text-lg font-semibold">Watershed</span>
            </div>
        </div>
        <nav className="flex-1 p-2 space-y-1">
            {sidebarNavItems.map((item) => (
                <div key={item.name}>
                    <a href="#" onClick={() => item.name === 'Measurements' && onNavigate('active_measurement')} className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${item.active ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
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
                <Settings className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
        </div>
    </div>
);

const TaskItem = ({ task, onNavigate }) => (
    <div className="grid grid-cols-[auto,1fr,auto] items-center gap-x-4 py-2 px-4 hover:bg-gray-50 rounded-md">
        <StatusIcon status={task.status} />
        <a href="#" onClick={(e) => { e.preventDefault(); if (task.description.includes('Urjanet')) onNavigate('utilities_urjanet'); }} className="text-sm text-gray-800 hover:underline">
            {task.issue && <span className="text-red-600 mr-2">!</span>}
            {task.description}
        </a>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
            <AssigneePill name={task.assignee} />
            <ChevronDown className="w-4 h-4" />
        </div>
    </div>
);

const DatasetItem = ({ dataset, onNavigate }) => {
    const [isExpanded, setIsExpanded] = useState(dataset.tasks.length > 0);

    return (
        <div className="border-b">
            <div 
                className="flex items-center p-2 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                <span className="ml-2 font-medium text-gray-800">{dataset.name}</span>
            </div>
            {isExpanded && (
                <div className="pb-2">
                    {dataset.tasks.map((task, index) => (
                        <TaskItem key={index} task={task} onNavigate={onNavigate} />
                    ))}
                </div>
            )}
        </div>
    );
};

const ActiveMeasurementScreen = ({ onNavigate }) => (
    <div>
        <div className="p-6 border-b">
            <h1 className="text-2xl font-semibold text-gray-900">2022 measurement</h1>
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-1">
                    <button className="px-3 py-1.5 bg-white border rounded-md shadow-sm flex items-center space-x-2 text-sm">
                        <List className="w-4 h-4" /> <span>List</span>
                    </button>
                    <button className="px-3 py-1.5 bg-gray-50 text-gray-600 border border-transparent rounded-md flex items-center space-x-2 text-sm hover:bg-gray-100">
                        <LayoutGrid className="w-4 h-4" /> <span>Board</span>
                    </button>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                        <span>By dataset</span> <ChevronDown className="w-4 h-4" />
                    </button>
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                        <span>All statuses</span> <ChevronDown className="w-4 h-4" />
                    </button>
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                        <span>All assignees</span> <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
        <div className="p-6">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">Datasets</h2>
                <div>
                    <button className="text-sm text-blue-600 hover:underline px-2">Expand</button>
                    <button className="text-sm text-blue-600 hover:underline px-2">Collapse</button>
                </div>
            </div>
            <div className="bg-white border rounded-lg">
                {datasets.map(d => <DatasetItem key={d.name} dataset={d} onNavigate={onNavigate} />)}
            </div>
        </div>
    </div>
);

const UtilitiesUrjanetScreen = ({ onNavigate }) => (
    <div className="p-6">
        <button onClick={() => onNavigate('active_measurement')} className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Active measurement
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">Utilities / Urjanet</h1>
        <div className="border-b mt-4">
            <nav className="flex space-x-6">
                <a href="#" className="py-2 border-b-2 border-blue-600 text-sm font-medium text-blue-600">Data</a>
                <a href="#" className="py-2 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700">Settings</a>
            </nav>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-8">
            <div className="col-span-2">
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">Data needed <span className="font-semibold text-gray-800">Jan-Dec 2021</span></p>
                    <div className="flex items-center space-x-2">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 flex items-center">
                            Upload data <ArrowLeft className="w-4 h-4 ml-2 transform rotate-180" />
                        </button>
                        <button className="px-4 py-2 bg-white border rounded-md shadow-sm text-sm font-semibold hover:bg-gray-50">
                            Download template
                        </button>
                        <button className="px-2 py-2 bg-white border rounded-md shadow-sm hover:bg-gray-50">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="mt-6 text-sm text-gray-600 leading-relaxed">
                    We need utilities data for your buildings. Once we have that, we can estimate emissions from your electricity, natural gas and clean power usage.
                </div>

                <div className="mt-8 space-y-6">
                    <div className="border rounded-lg">
                        <div className="p-4 font-medium text-gray-800 flex justify-between items-center cursor-pointer">
                            General instructions
                            <ChevronDown className="w-5 h-5 transform rotate-180" />
                        </div>
                        <div className="p-4 border-t text-sm text-gray-600 space-y-4">
                            <p>1. Identify how you log or track your utilities data. This could be in a company-specific tracking system, or in past utility bills. If you don't have information for all buildings, we will still be able to estimate emissions!</p>
                            <p>2. Confirm that the utility data you submit is in CSV or Excel format.</p>
                            <p>3. Now you're ready to upload to Watershed. Click "Upload data" and follow the steps.</p>
                        </div>
                    </div>
                    <div className="border rounded-lg">
                        <div className="p-4 font-medium text-gray-800 flex justify-between items-center cursor-pointer">
                            Required data formatting
                            <ChevronDown className="w-5 h-5 transform rotate-180" />
                        </div>
                         <div className="p-4 border-t text-sm text-gray-600 space-y-4">
                            <p>Provide utilities data for each building when possible so we can accurately calculate your carbon emissions based on specific electricity, natural gas and clean power usage.</p>
                            <p>Carbon Accounting calculates emissions for missing utilities data by using building square footage, so make sure to leave missing utilities data blank rather than 0.</p>
                        </div>
                    </div>
                </div>
                
                <div className="mt-8">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-gray-800">Example data</h3>
                        <button className="text-sm text-blue-600 font-medium hover:underline">Download template</button>
                    </div>
                    <div className="overflow-x-auto border rounded-lg">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    {Object.keys(exampleData[0]).map(key => (
                                        <th key={key} className="p-3 text-left font-medium text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {exampleData.map((row, i) => (
                                    <tr key={i} className="border-t">
                                        {Object.values(row).map((val, j) => (
                                            <td key={j} className="p-3 text-gray-700">{val}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
            <div className="col-span-1">
                <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-800">Conversations (0)</h3>
                    <button className="text-sm text-blue-600 font-medium hover:underline">Ask a question</button>
                </div>
                <div className="mt-6 border rounded-lg h-64 flex flex-col items-center justify-center text-center text-gray-500 bg-gray-50">
                    <MessageSquare className="w-10 h-10 mb-2 text-gray-400" />
                    <p className="font-medium">No conversations yet</p>
                    <p className="text-xs">Ask a question to get help from the Watershed team.</p>
                </div>
            </div>
        </div>
    </div>
);


export default function App() {
    const [currentPage, setCurrentPage] = useState('active_measurement');

    const handleNavigation = (page) => {
        setCurrentPage(page);
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'active_measurement':
                return <ActiveMeasurementScreen onNavigate={handleNavigation} />;
            case 'utilities_urjanet':
                return <UtilitiesUrjanetScreen onNavigate={handleNavigation} />;
            default:
                return <ActiveMeasurementScreen onNavigate={handleNavigation} />;
        }
    };

    return (
        <div className="h-screen w-screen bg-gray-50 flex font-sans">
            <Sidebar onNavigate={handleNavigation} />
            <main className="flex-1 overflow-y-auto">
                {renderPage()}
            </main>
        </div>
    );
}