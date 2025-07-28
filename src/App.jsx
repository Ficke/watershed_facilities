import React, { useState, useRef, useEffect } from 'react';
import { Home, BarChart2, Briefcase, FileText, ShoppingCart, Settings, ChevronDown, ChevronRight, Circle, CheckCircle, XCircle, UploadCloud, X, File as FileIcon, LoaderCircle, AlertCircle, ArrowLeft, Calendar as CalendarIcon, ChevronLeft } from 'lucide-react';

// --- Mock Data ---
const sidebarNavItems = [
  { name: 'Home', icon: Home, view: 'home' },
  { name: 'Measurements', icon: BarChart2, subItems: [{ name: 'Active measurement', view: 'taskList' }] },
  { name: 'Footprint', icon: Briefcase, subItems: [{ name: 'Overview', view: 'footprint' }, { name: 'Drilldown', view: null }, { name: 'Change log', view: null }] },
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
            { id: 5, status: 'To do', description: 'Upload Utilities', assignee: 'Jane', isInteractive: true }
        ]
    },
    { name: 'Chart of accounts', tasks: [] },
    { name: 'Employees', tasks: [] },
    { name: 'Operating expenses', tasks: [] },
    { name: 'Downstream logistics', tasks: [] },
];

const footprintData = {
  labels: ['Jul', 'Oct', '2023', 'Apr', 'Jul'],
  categories: ['Goods & Services', 'Offices', 'Marketing', 'Cloud', 'Employees', 'Travel'],
  colors: {
    'Goods & Services': '#1e3a8a', // indigo-900
    'Offices': '#6ee7b7', // green-300
    'Marketing': '#fde047', // yellow-300
    'Cloud': '#93c5fd', // blue-300
    'Employees': '#fb923c', // orange-400
    'Travel': '#14b8a6', // teal-500
  },
  barData: [
    [20, 30, 15, 25, 20, 35],
    [22, 25, 20, 20, 15, 30],
    [20, 30, 15, 25, 20, 25],
    [18, 28, 18, 22, 18, 24],
    [25, 35, 10, 15, 10, 30],
  ],
  donutData: [
      { category: 'Goods & Services', value: 20 },
      { category: 'Offices', value: 25 },
      { category: 'Marketing', value: 10 },
      { category: 'Cloud', value: 20 },
      { category: 'Employees', value: 15 },
      { category: 'Travel', value: 10 },
  ],
  goodsAndServicesBreakdown: [
      { name: 'Accounting & Legal', value: 97588 },
      { name: 'IT', value: 21739 },
      { name: 'Insurance', value: 10074 },
      { name: 'Personnel Costs', value: 4094 },
  ]
};


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
const Sidebar = ({ view, setView }) => {
    const [expanded, setExpanded] = useState('Measurements');

    return (
        <div className="bg-[#0f172a] text-white w-64 flex-shrink-0 flex flex-col font-sans">
            <div className="p-4 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center font-bold">W</div>
                    <span className="text-lg font-semibold">Watershed</span>
                </div>
            </div>
            <nav className="flex-1 p-2 space-y-1">
                {sidebarNavItems.map((item) => {
                    const isParentActive = item.subItems && item.subItems.some(sub => sub.view === view);
                    return (
                        <div key={item.name}>
                            <button onClick={() => {
                                if (item.view && !item.subItems) setView(item.view);
                                if (item.subItems) setExpanded(item.name === expanded ? null : item.name);
                            }} className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                                (item.view === view || isParentActive) ? 'bg-gray-700' : 'hover:bg-gray-700'
                            }`}>
                                <item.icon className="w-5 h-5 mr-3" />
                                <span>{item.name}</span>
                            </button>
                            {item.subItems && expanded === item.name && (
                                <div className="pl-8 mt-1 space-y-1">
                                    {item.subItems.map(subItem => (
                                        <button key={subItem.name || subItem} onClick={() => subItem.view && setView(subItem.view)}
                                         className={`w-full text-left block px-3 py-1.5 rounded-md text-sm ${
                                             subItem.view === view ? 'text-white' : 'text-gray-300'
                                         } hover:bg-gray-700 hover:text-white`}>
                                            {subItem.name || subItem}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })}
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
};


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

const DonutSegment = ({ percentage, color, radius, startAngle, onClick }) => {
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
      className="cursor-pointer"
    />
  );
};

const DonutChart = ({ data, colors, onCategoryClick }) => {
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
          />
        );
      })}
    </svg>
  );
};


const ExpandableRow = ({ category, value, children }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    return (
        <div className="border-t">
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center">
                    <ChevronDown className={`w-5 h-5 mr-2 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
                    <span className="font-medium">{category}</span>
                </div>
                <span className="font-mono">{value.toLocaleString()} tCO₂e</span>
            </div>
            {isExpanded && <div className="pl-8 pr-4 pb-4">{children}</div>}
        </div>
    )
}

const FootprintScreen = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const maxVal = 120;
    const totalGoodsAndServices = footprintData.goodsAndServicesBreakdown.reduce((sum, item) => sum + item.value, 0);
    
    const handleCategoryClick = (category) => {
        if (category === 'Goods & Services') {
            setSelectedCategory(prev => prev === category ? null : category);
        }
    }

    return (
        <div className="bg-gray-50 h-full p-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-semibold text-gray-900 mb-6">Carbon footprint</h1>
                <div className="grid grid-cols-2 gap-8 border-b pb-6">
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Gross emissions by category</h2>
                        <div className="flex items-center">
                            <DonutChart data={footprintData.donutData} colors={footprintData.colors} onCategoryClick={handleCategoryClick} />
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
                                    <div key={monthIndex} className="flex flex-col-reverse relative">
                                        {monthData.map((value, catIndex) => (
                                            <div key={catIndex} style={{ height: `${(value / maxVal) * 100}%`, backgroundColor: footprintData.colors[footprintData.categories[catIndex]] }}></div>
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
                        <div className="space-y-2">
                            {footprintData.goodsAndServicesBreakdown.map(item => (
                                <div key={item.name} className="flex justify-between items-center text-sm py-1">
                                    <span>{item.name}</span>
                                    <span className="font-mono text-gray-600">{item.value.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </ExpandableRow>
                )}
            </div>
        </div>
    )
}


// --- New Upload Screen ---
const UploadScreen = ({ onBack, onFilesUploaded }) => {
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
                <button onClick={onBack} className="p-2 rounded-md hover:bg-gray-100">
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
                            <button onClick={() => fileInputRef.current.click()} className="font-semibold text-blue-600 hover:underline">
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

// --- New Validation Screen Components ---
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
                    {/* Highlighted Area */}
                    <div className="absolute -left-4 -right-4 top-1/2 -translate-y-1/2 h-8 bg-yellow-300 bg-opacity-50 rounded"></div>
                </div>
            </div>
        </div>
    </div>
);

const Calendar = ({ selectedDate, onDateSelect }) => {
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
    
    const Header = () => (
        <div className="flex justify-between items-center mb-2 px-2">
            <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className="p-1 rounded-full hover:bg-gray-100">
                <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-1">
                 <button onClick={() => setIsSelectingMonth(!isSelectingMonth)} className="font-semibold px-2 py-1 hover:bg-gray-100 rounded-md">{months[viewDate.getMonth()]}</button>
                 <button onClick={() => setIsSelectingYear(!isSelectingYear)} className="font-semibold px-2 py-1 hover:bg-gray-100 rounded-md">{viewDate.getFullYear()}</button>
            </div>
            <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className="p-1 rounded-full hover:bg-gray-100">
                 <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
    
    if (isSelectingMonth) {
        return (
             <div className="grid grid-cols-3 gap-2 p-2">
                 {months.map((month, index) => (
                    <button key={month} onClick={() => { setViewDate(new Date(viewDate.getFullYear(), index, 1)); setIsSelectingMonth(false); }}
                        className="p-2 text-sm rounded-md hover:bg-gray-100">
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
                        className="p-2 text-sm rounded-md hover:bg-gray-100">
                        {year}
                    </button>
                ))}
            </div>
        )
    }


    return (
        <div className="w-64 p-2">
            <Header />
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
                            }`}>
                            {day}
                        </button>
                    )
                })}
            </div>
             <div className="mt-2 pt-2 border-t">
                 <button onClick={() => onDateSelect(new Date())} className="w-full text-center text-sm font-semibold text-blue-600 hover:bg-gray-100 p-2 rounded-md">Today</button>
            </div>
        </div>
    );
};


const ValidationScreen = ({ onValidationComplete }) => {
    const [step, setStep] = useState(0);
    const [kwhValue, setKwhValue] = useState("15,220");
    const [dateValue, setDateValue] = useState(new Date("2025-07-31T00:00:00"));
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

    const currentBill = billsToReview[step];
    
    const handleConfirm = () => {
        if (step < billsToReview.length - 1) {
            setStep(step + 1);
        }
    };

    return (
        <div className="bg-gray-50 h-full flex flex-col">
            <div className="p-6 border-b bg-white">
                <h1 className="text-2xl font-semibold text-gray-900">{`Review ${billsToReview.length} bills`}</h1>
                <p className="text-gray-600 mt-1">Our system needs your help to confirm a few values.</p>
            </div>
            <div className="flex-1 p-8 grid grid-cols-2 gap-8 overflow-y-auto">
                <div className="bg-white border rounded-lg flex items-center justify-center overflow-hidden">
                    <UtilityBillPlaceholder />
                </div>
                <div className="bg-white border rounded-lg p-6 flex flex-col">
                    <h2 className="text-lg font-semibold mb-1">Extracted Data</h2>
                    <p className="text-sm text-gray-600 mb-4">File: {currentBill.id}</p>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">{currentBill.field}</label>
                        <p className="text-xs text-gray-500 mb-2">Please confirm or correct the highlighted value.</p>
                       
                        {currentBill.type === 'text' && (
                             <div className="relative">
                                <input
                                    type="text"
                                    value={currentBill.value}
                                    onChange={(e) => currentBill.setter(e.target.value)}
                                    className="block w-full sm:text-sm rounded-md border-yellow-400 border-2 p-2"
                                />
                            </div>
                        )}
                        
                        {currentBill.type === 'date' && (
                            <div className="relative">
                                <div onClick={() => setIsCalendarOpen(!isCalendarOpen)} className="cursor-pointer">
                                    <input
                                        type="text"
                                        readOnly
                                        value={currentBill.value.toLocaleDateString()}
                                        className="block w-full sm:text-sm rounded-md border-yellow-400 border-2 p-2 bg-white cursor-pointer"
                                    />
                                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                                </div>
                                {isCalendarOpen && (
                                     <div className="absolute top-full mt-1 bg-white border rounded-lg shadow-lg z-10">
                                        <Calendar selectedDate={currentBill.value} onDateSelect={date => { currentBill.setter(date); setIsCalendarOpen(false);}} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {step === 0 && (
                        <button onClick={handleConfirm} className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700">
                             Confirm and Next
                         </button>
                    )}
                </div>
            </div>
            <div className="bg-white p-4 border-t flex justify-end">
                <button
                    onClick={onValidationComplete}
                    disabled={step < billsToReview.length -1}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                    Finish Upload
                </button>
            </div>
        </div>
    );
};

// --- New Confirmation Modal ---
const ConfirmationModal = ({ onClose, count }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload Complete</h2>
            <p className="text-gray-600 mb-6">{`${count} bills successfully processed and added to your footprint.`}</p>
            <button
                onClick={onClose}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700"
            >
                Done
            </button>
        </div>
    </div>
);

// --- Main App Component ---
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

