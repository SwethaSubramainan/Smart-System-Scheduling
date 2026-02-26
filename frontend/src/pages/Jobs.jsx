import React, { useState, useEffect } from 'react';
import JobForm from '../components/JobForm';
import { fetchJobs } from '../services/api';
import { Briefcase, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadJobs = async () => {
            try {
                const data = await fetchJobs();
                setJobs(data);
            } catch (error) {
                console.error("Failed to load jobs:", error);
            } finally {
                setLoading(false);
            }
        };
        loadJobs();
    }, []);

    const handleAddJob = (newJob) => {
        const jobWithId = { ...newJob, id: Date.now() };
        setJobs([...jobs, jobWithId]);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed': return <CheckCircle2 size={16} className="text-emerald-500" />;
            case 'In Progress': return <Clock size={16} className="text-indigo-500" />;
            default: return <AlertCircle size={16} className="text-amber-500" />;
        }
    };

    const getStatusBadge = (status) => {
        const base = "px-2.5 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 w-max";
        switch (status) {
            case 'Completed': return `${base} bg-emerald-50 text-emerald-700 border border-emerald-200`;
            case 'In Progress': return `${base} bg-indigo-50 text-indigo-700 border border-indigo-200`;
            default: return `${base} bg-amber-50 text-amber-700 border border-amber-200`;
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <Briefcase size={28} className="text-indigo-600" />
                        Job Management
                    </h1>
                    <p className="text-slate-500 mt-1">Manage production jobs and monitor their status.</p>
                </div>
            </div>

            <JobForm onSubmit={handleAddJob} />

            <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-semibold text-slate-800">Current Jobs</h3>
                </div>

                {loading ? (
                    <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                                    <th className="p-4">ID</th>
                                    <th className="p-4">Job Name</th>
                                    <th className="p-4">Assigned Machine</th>
                                    <th className="p-4">Assigned Worker</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {jobs.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-slate-500">No jobs available. Create one above!</td>
                                    </tr>
                                ) : (
                                    jobs.map((job) => (
                                        <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 text-sm text-slate-500 font-mono">#{job.id.toString().substring(0, 4)}</td>
                                            <td className="p-4 font-medium text-slate-800">{job.name}</td>
                                            <td className="p-4 text-sm text-slate-600">{job.machine}</td>
                                            <td className="p-4 text-sm text-slate-600">{job.worker}</td>
                                            <td className="p-4">
                                                <span className={getStatusBadge(job.status)}>
                                                    {getStatusIcon(job.status)}
                                                    {job.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Jobs;
