import React, { useState, useEffect } from 'react';
import GanttChart from '../components/GanttChart';
import KPIDashboard from '../components/KPIDashboard';
import { fetchSchedules, fetchKPIs, fetchMachines, generateSchedule as apiGenerateSchedule, reportBreakdown } from '../services/api';
import { CalendarClock, Play, AlertTriangle } from 'lucide-react';

const Schedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [kpis, setKpis] = useState(null);
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [message, setMessage] = useState(null);
    const [breakdownId, setBreakdownId] = useState('');

    const loadData = async () => {
        try {
            setLoading(true);
            const [schedData, kpisData, machinesData] = await Promise.all([
                fetchSchedules(),
                fetchKPIs(),
                fetchMachines()
            ]);
            setSchedules(schedData);
            setKpis(kpisData);
            setMachines(machinesData);
        } catch (error) {
            console.error("Failed to load schedule data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleGenerateSchedule = async () => {
        setGenerating(true);
        setMessage(null);
        try {
            const result = await apiGenerateSchedule();
            setMessage({ type: 'success', text: `${result.message} (${result.jobsScheduled ?? 0} jobs scheduled)` });
            await loadData();
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed: ' + (err.response?.data?.message || err.message) });
        } finally {
            setGenerating(false);
        }
    };

    const handleBreakdown = async () => {
        if (!breakdownId) return alert('Select a machine first');
        setMessage(null);
        try {
            const result = await reportBreakdown(Number(breakdownId));
            setMessage({ type: 'success', text: `${result.message} (${result.jobsAffected} jobs affected)` });
            setBreakdownId('');
            await loadData();
        } catch (err) {
            setMessage({ type: 'error', text: 'Breakdown report failed: ' + (err.response?.data?.message || err.message) });
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <CalendarClock size={28} className="text-indigo-600" />
                        Master Schedule
                    </h1>
                    <p className="text-slate-500 mt-1">Smart resource allocation and timeline visualization.</p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    {/* Breakdown Reporting */}
                    <div className="flex items-center gap-2">
                        <select value={breakdownId} onChange={e => setBreakdownId(e.target.value)} className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-rose-400 outline-none">
                            <option value="">Select machine...</option>
                            {machines.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                        <button onClick={handleBreakdown} className="px-4 py-2.5 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition-colors shadow-sm flex items-center gap-2 text-sm">
                            <AlertTriangle size={16} /> Report Breakdown
                        </button>
                    </div>

                    <button
                        onClick={handleGenerateSchedule}
                        disabled={generating || loading}
                        className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {generating ? (
                            <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div> Optimizing...</>
                        ) : (
                            <><Play size={18} /> Generate Schedule</>
                        )}
                    </button>
                </div>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-lg border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                    {message.text}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div></div>
            ) : (
                <div className="space-y-8">
                    <GanttChart tasks={schedules} />

                    <div>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Real-time KPIs</h2>
                        <KPIDashboard kpis={kpis} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Schedule;
