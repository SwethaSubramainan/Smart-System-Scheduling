import React, { useState, useEffect } from 'react';
import WorkerForm from '../components/WorkerForm';
import { fetchWorkers, createWorker, deleteWorker } from '../services/api';
import { Users, HardHat, Trash2 } from 'lucide-react';

const statusBadge = (status) => {
    const base = 'px-2.5 py-1 text-xs font-semibold rounded-full';
    if (status === 'Available') return `${base} bg-emerald-50 text-emerald-700 border border-emerald-200`;
    if (status === 'Busy') return `${base} bg-indigo-50 text-indigo-700 border border-indigo-200`;
    return `${base} bg-slate-100 text-slate-600 border border-slate-200`;
};

const Workers = () => {
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadWorkers = async () => {
        try {
            setLoading(true);
            const data = await fetchWorkers();
            setWorkers(data);
        } catch (err) {
            setError('Failed to load workers. Is the backend running?');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadWorkers(); }, []);

    const handleAddWorker = async (newWorker) => {
        try {
            await createWorker(newWorker);
            await loadWorkers();
        } catch (err) {
            alert('Failed to add worker: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this worker?')) return;
        try {
            await deleteWorker(id);
            await loadWorkers();
        } catch (err) {
            alert('Failed to delete: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <Users size={28} className="text-indigo-600" />
                        Workforce Directory
                    </h1>
                    <p className="text-slate-500 mt-1">Manage personnel, track skills, and monitor allocation.</p>
                </div>
            </div>

            <WorkerForm onSubmit={handleAddWorker} />

            {error ? (
                <div className="p-8 text-center text-rose-500 bg-white rounded-xl border border-rose-200">{error}</div>
            ) : loading ? (
                <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {workers.map((worker) => (
                        <div key={worker.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center hover:-translate-y-1 transition-transform relative group">
                            <button onClick={() => handleDelete(worker.id)} className="absolute top-3 right-3 p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100" title="Delete worker">
                                <Trash2 size={16} />
                            </button>
                            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-4 text-indigo-600 shadow-inner">
                                <HardHat size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">{worker.name}</h3>
                            <div className="mt-1 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold uppercase tracking-wider">
                                {worker.skill}
                            </div>
                            <div className="mt-3">
                                <span className={statusBadge(worker.status)}>{worker.status}</span>
                            </div>
                        </div>
                    ))}
                    {workers.length === 0 && (
                        <div className="col-span-full p-8 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
                            No workers are currently registered.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Workers;
