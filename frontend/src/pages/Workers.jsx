import React, { useState, useEffect } from 'react';
import WorkerForm from '../components/WorkerForm';
import { fetchWorkers } from '../services/api';
import { Users, HardHat, TrendingUp } from 'lucide-react';

const Workers = () => {
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadWorkers = async () => {
            try {
                const data = await fetchWorkers();
                setWorkers(data);
            } catch (error) {
                console.error("Failed to load workers:", error);
            } finally {
                setLoading(false);
            }
        };
        loadWorkers();
    }, []);

    const handleAddWorker = (newWorker) => {
        const workerWithId = { ...newWorker, id: Date.now() };
        setWorkers([...workers, workerWithId]);
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

            {loading ? (
                <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {workers.map((worker) => (
                        <div key={worker.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center hover:-translate-y-1 transition-transform relative group">
                            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-4 text-indigo-600 shadow-inner">
                                <HardHat size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">{worker.name}</h3>
                            <div className="mt-1 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold uppercase tracking-wider">
                                {worker.skill}
                            </div>

                            <div className="w-full mt-6 pt-4 border-t border-slate-100">
                                <div className="flex justify-between items-center text-sm text-slate-500 mb-2">
                                    <span className="flex items-center gap-1"><TrendingUp size={14} /> Utilization</span>
                                    <span className="font-semibold text-slate-700">{worker.utilization}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5">
                                    <div
                                        className={`h-1.5 rounded-full transition-all duration-500 ${worker.utilization > 85 ? 'bg-amber-500' :
                                                worker.utilization > 40 ? 'bg-indigo-500' : 'bg-emerald-500'
                                            }`}
                                        style={{ width: `${worker.utilization}%` }}
                                    ></div>
                                </div>
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
