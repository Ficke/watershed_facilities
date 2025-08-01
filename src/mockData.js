export const sidebarNavItems = [
  { name: 'Home', icon: 'Home', view: 'home' },
  { name: 'Measurements', icon: 'BarChart2', subItems: [{ name: 'Active measurement', view: 'taskList' }] },
  { name: 'Footprint', icon: 'Briefcase', subItems: [{ name: 'Overview', view: 'footprint' }, { name: 'Drilldown', view: null }, { name: 'Change log', view: null }] },
  { name: 'Reduction plans', icon: 'FileText', subItems: ['All plans', '2022 Reduction Plan'] },
  { name: 'Marketplace', icon: 'ShoppingCart', subItems: ['Explore', 'Clean power', 'Purchases'] },
  { name: 'Reporting', icon: 'FileText', subItems: ['Reports', 'Program summary'] },
];

export const initialDatasets = [
    { name: 'Capital expenses', tasks: [], statusBadge: 'Needs mapping' },
    { name: 'Buildings', tasks: [], statusBadge: 'Needs response' },
    { name: 'Cloud usage', tasks: [], statusBadge: 'Needs response' },
    { name: 'Cost of revenue', tasks: [], statusBadge: 'Needs response' },
    { name: 'Flights', tasks: [
        { id: 1, status: 'To do', description: 'Upload Flights', assignee: 'Unassigned', hasStartButton: true },
        { id: 2, status: 'To do', description: 'Upload Flights: TripActions', assignee: 'Madeline Pickering', hasRespondButton: true },
        { id: 3, status: 'Blocked', description: 'Process Flights', assignee: 'Watershed expert' },
        { id: 4, status: 'To do', description: 'There is an issue here', assignee: 'Madeline Pickering', issue: true, hasRespondButton: true },
    ], statusBadge: 'Needs response'},
    { name: 'Hotels', tasks: [], statusBadge: 'Needs response' },
    { name: 'Card production', tasks: [], statusBadge: 'Needs upload' },
    { name: 'Cloud costs', tasks: [], statusBadge: 'Needs upload' },
    { name: 'Revenue', tasks: [], statusBadge: 'Needs upload' },
    { name: 'Upstream logistics', tasks: [], statusBadge: 'Needs upload' },
    {
        name: 'Utilities',
        tasks: [
            { id: 5, status: 'To do', description: 'Upload Utilities', assignee: 'Jane', isInteractive: true, hasStartButton: true }
        ],
        statusBadge: 'Needs upload'
    },
    { name: 'Chart of accounts', tasks: [], statusBadge: 'Processing' },
    { name: 'Employees', tasks: [], statusBadge: 'Processing' },
    { name: 'Operating expenses', tasks: [], statusBadge: 'Processing' },
    { name: 'Downstream logistics', tasks: [], statusBadge: 'Ready for footprint' },
];

export const footprintData = {
  labels: ['Jul', 'Oct', '2023', 'Apr', 'Jul'],
  categories: ['Goods & Services', 'Offices', 'Marketing', 'Cloud', 'Employees', 'Travel'],
  colors: {
    'Goods & Services': '#1e3a8a',
    'Offices': '#3b82f6',
    'Marketing': '#60a5fa',
    'Cloud': '#93c5fd',
    'Employees': '#bfdbfe',
    'Travel': '#dbeafe',
  },
  barData: [
    [50, 30, 15, 25, 20, 35],
    [48, 25, 20, 20, 15, 30],
    [45, 30, 15, 25, 20, 25],
    [52, 28, 18, 22, 18, 24],
    [55, 35, 10, 15, 10, 30],
  ],
  donutData: [
      { category: 'Goods & Services', value: 50 },
      { category: 'Offices', value: 20 },
      { category: 'Marketing', value: 8 },
      { category: 'Cloud', value: 12 },
      { category: 'Employees', value: 6 },
      { category: 'Travel', value: 4 },
  ],
  goodsAndServicesBreakdown: [
      { name: 'Accounting & Legal', value: 97588 },
      { name: 'IT', value: 21739 },
      { name: 'Insurance', value: 10074 },
      { name: 'Personnel Costs', value: 47803 },
  ]
};
