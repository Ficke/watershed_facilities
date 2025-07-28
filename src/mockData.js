import { Home, BarChart2, Briefcase, FileText, ShoppingCart, Settings } from 'lucide-react';

export const sidebarNavItems = [
  { name: 'Home', icon: Home, view: 'home' },
  { name: 'Measurements', icon: BarChart2, subItems: [{ name: 'Active measurement', view: 'taskList' }] },
  { name: 'Footprint', icon: Briefcase, subItems: [{ name: 'Overview', view: 'footprint' }, { name: 'Drilldown', view: null }, { name: 'Change log', view: null }] },
  { name: 'Reduction plans', icon: FileText, subItems: ['All plans', '2022 Reduction Plan'] },
  { name: 'Marketplace', icon: ShoppingCart, subItems: ['Explore', 'Clean power', 'Purchases'] },
  { name: 'Reporting', icon: FileText, subItems: ['Reports', 'Program summary'] },
];

export const initialDatasets = [
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

export const footprintData = {
  labels: ['Jul', 'Oct', '2023', 'Apr', 'Jul'],
  categories: ['Goods & Services', 'Offices', 'Marketing', 'Cloud', 'Employees', 'Travel'],
  colors: {
    'Goods & Services': '#1e3a8a',
    'Offices': '#6ee7b7',
    'Marketing': '#fde047',
    'Cloud': '#93c5fd',
    'Employees': '#fb923c',
    'Travel': '#14b8a6',
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
