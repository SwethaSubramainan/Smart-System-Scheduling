import React from 'react';
import { Activity, Users, Clock, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const KPIDashboard = ({ kpis }) => {
    if (!kpis) return <div className="animate-pulse flex space-x-4 bg-white h-32 rounded-xl border border-slate-100"></div>;

    const { machineUtilization, workerUtilization, onTimeDelivery, delayedJobs } = kpis;

    const kpiCards = [
        {
            title: 'Machine Utilization',
            value: `${machineUtilization}%`,
            icon: <Activity className="text-blue-500" size={24} />,
            color: 'bg-blue-50',
            trend: '+2.5%'
        },
        {
            title: 'Worker Utilization',
            value: `${workerUtilization}%`,
            icon: <Users className="text-indigo-500" size={24} />,
            color: 'bg-indigo-50',
            trend: '+1.2%'
        },
        {
            title: 'On-Time Delivery',
            value: `${onTimeDelivery}%`,
            icon: <Clock className="text-emerald-500" size={24} />,
            color: 'bg-emerald-50',
            trend: '+5.4%'
        },
        {
            title: 'Delayed Jobs',
            value: delayedJobs,
            icon: <AlertTriangle className="text-rose-500" size={24} />,
            color: 'bg-rose-50',
            trend: '-2'
        }
    ];

    // Quick pie chart data for simple rendering
    const data = [
        { name: 'Completed', value: 400, color: '#10b981' }, // emerald-500
        { name: 'In Progress', value: 300, color: '#6366f1' }, // indigo-500
        { name: 'Delayed', value: delayedJobs * 10, color: '#f43f5e' } // rose-500
    ];

    return (
        <div className="space-y-6">
            {/* Top Value Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiCards.map((card, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flexitems-center justify-between hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500">{card.title}</p>
                                <h3 className="text-2xl font-bold text-slate-800 mt-1">{card.value}</h3>
                            </div>
                            <div className={`p-3 rounded-lg ${card.color}`}>
                                {card.icon}
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className={card.trend.startsWith('+') ? 'text-emerald-600 font-medium' : 'text-emerald-600 font-medium'}>
                                {card.trend}
                            </span>
                            <span className="text-slate-400 ml-2">vs last week</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Utilization Trends</h3>
                    <div className="h-64 flex items-end space-x-2">
                        {/* Very simple mocked bar chart area for hackathon */}
                        {[45, 60, 75, 50, 80, 95, 85].map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col justify-end group">
                                <div
                                    className="bg-indigo-100 hover:bg-indigo-500 rounded-t-sm transition-colors relative"
                                    style={{ height: `${val}%` }}
                                >
                                    <span className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded">
                                        {val}%
                                    </span>
                                </div>
                                <div className="text-xs text-center text-slate-400 mt-2">Day {i + 1}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Job Status Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-4 text-sm mt-2">
                            {data.map(d => (
                                <div key={d.name} className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                                    <span className="text-slate-600">{d.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KPIDashboard;
