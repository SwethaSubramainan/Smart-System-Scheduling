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
            desc: 'Running / Total machines'
        },
        {
            title: 'Worker Utilization',
            value: `${workerUtilization}%`,
            icon: <Users className="text-indigo-500" size={24} />,
            color: 'bg-indigo-50',
            desc: 'Busy / Total workers'
        },
        {
            title: 'On-Time Delivery',
            value: `${onTimeDelivery}%`,
            icon: <Clock className="text-emerald-500" size={24} />,
            color: 'bg-emerald-50',
            desc: 'Completed / (Completed + Delayed)'
        },
        {
            title: 'Delayed Jobs',
            value: delayedJobs,
            icon: <AlertTriangle className="text-rose-500" size={24} />,
            color: 'bg-rose-50',
            desc: 'Jobs needing attention'
        }
    ];

    // Pie chart data based on real KPI values
    const usedMachines = machineUtilization;
    const idleMachines = 100 - machineUtilization;
    const pieData = [
        { name: 'Active', value: usedMachines || 1, color: '#6366f1' },
        { name: 'Idle', value: idleMachines || 1, color: '#e2e8f0' },
        { name: 'Delayed', value: delayedJobs || 0, color: '#f43f5e' }
    ].filter(d => d.value > 0);

    // Bar chart based on real values
    const barValues = [
        { label: 'Machine %', value: machineUtilization, color: 'bg-blue-400 hover:bg-blue-600' },
        { label: 'Worker %', value: workerUtilization, color: 'bg-indigo-400 hover:bg-indigo-600' },
        { label: 'On-Time %', value: onTimeDelivery, color: 'bg-emerald-400 hover:bg-emerald-600' },
    ];

    return (
        <div className="space-y-6">
            {/* Top Value Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiCards.map((card, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500">{card.title}</p>
                                <h3 className="text-2xl font-bold text-slate-800 mt-1">{card.value}</h3>
                            </div>
                            <div className={`p-3 rounded-lg ${card.color}`}>
                                {card.icon}
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-slate-400">{card.desc}</div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Resource Utilization</h3>
                    <div className="h-64 flex items-end space-x-6 px-4">
                        {barValues.map((bar, i) => (
                            <div key={i} className="flex-1 flex flex-col justify-end h-full group">
                                <div
                                    className={`${bar.color} rounded-t-md transition-colors relative w-full`}
                                    style={{ height: `${Math.max(bar.value, 5)}%`, minHeight: '8px' }}
                                >
                                    <span className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                                        {bar.value}%
                                    </span>
                                </div>
                                <div className="text-xs text-center text-slate-500 mt-2 font-medium">{bar.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">System Overview</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-4 text-sm mt-2">
                            {pieData.map(d => (
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
