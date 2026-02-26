import React from 'react';
import { Gantt, ViewMode } from 'gantt-task-react';
// import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";

const GanttChart = ({ tasks }) => {
    // Map our generic job objects to gantt-task-react objects if necessary
    // Expected structure for Task:
    // { start: Date, end: Date, name: string, id: string, type: 'task' | 'milestone' | 'project', progress: number, isDisabled: boolean, styles: { progressColor, progressSelectedColor } }

    if (!tasks || tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                <div className="text-slate-400 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <p className="text-slate-500 font-medium tracking-wide">No scheduled tasks found to display Gantt chart.</p>
                <p className="text-sm text-slate-400 mt-1">Please add jobs to see the schedule.</p>
            </div>
        );
    }

    // Format task data to required Gantt format
    const ganttTasks = tasks.map((t, idx) => ({
        start: new Date(t.startDate || new Date()),
        end: new Date(t.endDate || new Date(new Date().setDate(new Date().getDate() + 1))),
        name: `${t.name} (${t.machine})`,
        id: t.id ? t.id.toString() : `task-${idx}`,
        type: 'task',
        progress: t.status === 'Completed' ? 100 : t.status === 'In Progress' ? 50 : 0,
        isDisabled: false,
        styles: {
            progressColor: t.status === 'Completed' ? '#10b981' : '#6366f1',
            progressSelectedColor: '#4f46e5'
        }
    }));

    return (
        <div className="gantt-container bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800">Production Schedule</h3>
            </div>
            <div className="p-2 overflow-x-auto w-full">
                <Gantt
                    tasks={ganttTasks}
                    viewMode={ViewMode.Day}
                    listCellWidth="155px"
                    columnWidth={60}
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
