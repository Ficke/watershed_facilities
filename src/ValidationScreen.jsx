import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';

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
            <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
                <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-1">
                 <button onClick={() => setIsSelectingMonth(!isSelectingMonth)} className="font-semibold px-2 py-1 hover:bg-gray-100 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">{months[viewDate.getMonth()]}</button>
                 <button onClick={() => setIsSelectingYear(!isSelectingYear)} className="font-semibold px-2 py-1 hover:bg-gray-100 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">{viewDate.getFullYear()}</button>
            </div>
            <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
                 <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
    
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
                            } focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400`}>
                            {day}
                        </button>
                    )
                })}
            </div>
             <div className="mt-2 pt-2 border-t">
                 <button onClick={() => onDateSelect(new Date())} className="w-full text-center text-sm font-semibold text-blue-600 hover:bg-gray-100 p-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">Today</button>
            </div>
        </div>
    );
};


export const ValidationScreen = ({ onValidationComplete }) => {
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
                                                value={bill.value.toLocaleDateString()}
                                                className="block w-full sm:text-sm rounded-md border-yellow-400 border-2 p-2 bg-white cursor-pointer"
                                            />
                                            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                                        </div>
                                        {isCalendarOpen && (
                                             <div className="absolute top-full mt-1 bg-white border rounded-lg shadow-lg z-10">
                                                <Calendar selectedDate={bill.value} onDateSelect={date => { bill.setter(date); setIsCalendarOpen(false);}} />
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
