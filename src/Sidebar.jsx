import React, { useState } from 'react';
import { Home, BarChart2, Briefcase, FileText, ShoppingCart, Settings } from 'lucide-react';
import { sidebarNavItems } from './mockData';

export const Sidebar = ({ view, setView }) => {
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
                            }} className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                                (item.view === view || isParentActive) ? 'bg-gray-700' : 'hover:bg-gray-700'
                            } focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400`}>
                                <item.icon className="w-5 h-5 mr-3" />
                                <span>{item.name}</span>
                            </button>
                            {item.subItems && expanded === item.name && (
                                <div className="pl-8 mt-1 space-y-1">
                                    {item.subItems.map(subItem => (
                                        <button key={subItem.name || subItem} onClick={() => subItem.view && setView(subItem.view)}
                                         className={`w-full text-left block px-3 py-1.5 rounded-md text-sm transition-colors duration-150 ${
                                             subItem.view === view ? 'text-white' : 'text-gray-300'
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
        </div>
    );
};
