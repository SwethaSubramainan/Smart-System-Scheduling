import React from 'react';
import { Gantt, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";

const GanttChart = ({ tasks }) => {
    if (!tasks || tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                <div className="text-slate-400 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <p className="text-slate-500 font-medium tracking-wide">No scheduled tasks to display.</p>
                <p className="text-sm text-slate-400 mt-1">Click "Generate Schedule" to create assignments.</p>
            </div>
        );
    }

    // Backend schedule format: { id, start_time, end_time, job_name, job_status, machine_name, worker_name }
    const ganttTasks = tasks.map((t, idx) => {
        const start = new Date(t.start_time || t.startDate || new Date());
        let end = new Date(t.end_time || t.endDate || new Date());
        // Ensure end > start (at least 1 hour apart)
        if (end <= start) {
            end = new Date(start.getTime() + 3600000);
        }

        const name = t.job_name
            ? `${t.job_name} → ${t.machine_name} (${t.worker_name})`
            : t.name || `Task ${idx + 1}`;

        const status = t.job_status || t.status || 'Pending';

        return {
            start,
            end,
            name,
            id: t.id ? t.id.toString() : `task-${idx}`,
            type: 'task',
            progress: status === 'Completed' ? 100 : status === 'In Progress' ? 50 : 0,
            isDisabled: false,
            styles: {
                progressColor: status === 'Completed' ? '#10b981' : status === 'Delayed' ? '#f43f5e' : '#6366f1',
                progressSelectedColor: '#4f46e5',
                backgroundColor: status === 'Delayed' ? '#fecdd3' : '#e0e7ff',
                backgroundSelectedColor: '#c7d2fe'
            }
        };
    });

    return (
        <div className="gantt-container bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800">Production Schedule ({tasks.length} tasks)</h3>
            </div>
            <div className="p-2 overflow-x-auto w-full">
                <Gantt
                    tasks={ganttTasks}
                    viewMode={ViewMode.Hour}
                    listCellWidth="200px"
                    columnWidth={40}
                    barBackgroundColor="#e0e7ff"
                    barBackgroundSelectedColor="#c7d2fe"
                    projectProgressColor="#a78bfa"
                    projectProgressSelectedColor="#8b5cf6"
                    fontFamily="'Inter', sans-serif"
                    fontSize="12"
                />
            </div>
        </div>
    );
};

export default GanttChart;
