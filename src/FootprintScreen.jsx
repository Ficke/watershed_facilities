import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { footprintData } from './mockData';

const DonutSegment = ({ percentage, color, radius, startAngle, onMouseEnter, onMouseLeave, onClick }) => {
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
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="cursor-pointer transition-opacity duration-200"
    />
  );
};

const DonutChart = ({ data, colors, onCategoryClick, onHover }) => {
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
            onMouseEnter={() => onHover(item)}
            onMouseLeave={() => onHover(null)}
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

export const FootprintScreen = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [hovered, setHovered] = useState(null);
    const maxVal = 120;
    const totalGoodsAndServices = footprintData.goodsAndServicesBreakdown.reduce((sum, item) => sum + item.value, 0);
    
    const handleCategoryClick = (category) => {
        if (category === 'Goods & Services') {
            setSelectedCategory(prev => prev === category ? null : category);
        }
    }

    return (
        <div className="bg-gray-50 h-full p-8">
            <div className="bg-white p-8 rounded-lg shadow-lg relative">
                <h1 className="text-3xl font-semibold text-gray-900 mb-6">Carbon footprint</h1>
                <div className="grid grid-cols-2 gap-8 border-b pb-6">
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Gross emissions by category</h2>
                        <div className="flex items-center">
                            <div className="relative">
                                <DonutChart data={footprintData.donutData} colors={footprintData.colors} onCategoryClick={handleCategoryClick} onHover={setHovered} />
                                {hovered && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold">{hovered.value}%</div>
                                            <div className="text-sm text-gray-500">{hovered.category}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
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
                                    <div key={monthIndex} className="flex flex-col-reverse relative group">
                                        {monthData.map((value, catIndex) => (
                                            <div key={catIndex} style={{ height: `${(value / maxVal) * 100}%`, backgroundColor: footprintData.colors[footprintData.categories[catIndex]] }} className="transition-opacity duration-200 group-hover:opacity-75"></div>
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
