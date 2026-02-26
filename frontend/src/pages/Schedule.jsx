import React, { useState, useEffect } from 'react';
import GanttChart from '../components/GanttChart';
import KPIDashboard from '../components/KPIDashboard';
import { fetchJobs, fetchKPIs } from '../services/api';
import { CalendarClock, Play } from 'lucide-react';

const Schedule = () => {
    const [jobs, setJobs] = useState([]);
    const [kpis, setKpis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [jobsData, kpisData] = await Promise.all([fetchJobs(), fetchKPIs()]);

                // Add dates to job data specifically for the Gantt Chart 
                // In a real app, the backend would provide accurate standard start/end dates.
                const jobsWithDates = jobsData.map((job, index) => {
                    const start = new Date();
                    start.setDate(start.getDate() + index); // Stagger tasks
                    const end = new Date(start);
                    end.setDate(start.getDate() + 2); // 2 days duration
                    return { ...job, startDate: start, endDate: end };
                });

                setJobs(jobsWithDates);
                setKpis(kpisData);
            } catch (error) {
                console.error("Failed to load schedule data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleGenerateSchedule = () => {
        setGenerating(true);
        // Simulate complex scheduling algorithm
        setTimeout(() => {
            setGenerating(false);
            // Let's just shuffle dates or status for demonstration
            const updatedJobs = jobs.map(job => ({
                ...job,
                status: Math.random() > 0.5 ? 'In Progress' : 'Pending'
            }));
            setJobs(updatedJobs);
            setKpis({
                ...kpis,
                machineUtilization: Math.floor(Math.random() * 20) + 80, // Improve utilization after scheduling
                onTimeDelivery: Math.floor(Math.random() * 5) + 95
            });
        }, 1500);
    };

    return (
        <div className="animate-fade-in">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <CalendarClock size={28} className="text-indigo-600" />
                        Master Schedule
                    </h1>
                    <p className="text-slate-500 mt-1">AI-assisted resource allocation and timeline visualization.</p>
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

            {loading ? (
                <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div></div>
            ) : (
                <div className="space-y-8">
                    {/* Gantt Chart Section */}
                    <GanttChart tasks={jobs} />

                    {/* Real-time Impact Section */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Projected Impact</h2>
                        <KPIDashboard kpis={kpis} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Schedule;
