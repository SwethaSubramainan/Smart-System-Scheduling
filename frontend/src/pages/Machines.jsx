import React, { useState, useEffect } from 'react';
import MachineForm from '../components/MachineForm';
import { fetchMachines, createMachine, deleteMachine } from '../services/api';
import { Factory, Power, Settings, AlertCircle, Trash2 } from 'lucide-react';

const Machines = () => {
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadMachines = async () => {
        try {
            setLoading(true);
            const data = await fetchMachines();
            setMachines(data);
        } catch (err) {
            setError('Failed to load machines. Is the backend running?');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadMachines(); }, []);

    const handleAddMachine = async (newMachine) => {
        try {
            await createMachine(newMachine);
            await loadMachines();
        } catch (err) {
            alert('Failed to add machine: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this machine?')) return;
        try {
            await deleteMachine(id);
            await loadMachines();
        } catch (err) {
            alert('Failed to delete: ' + (err.response?.data?.message || err.message));
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Running':
                return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200 flex items-center w-max gap-1"><Power size={14} /> Running</span>;
            case 'Maintenance':
                return <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-semibold border border-rose-200 flex items-center w-max gap-1"><Settings size={14} /> Maintenance</span>;
            case 'Idle':
            default:
                return <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold border border-slate-200 flex items-center w-max gap-1"><AlertCircle size={14} /> Idle</span>;
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <Factory size={28} className="text-indigo-600" />
                        Machine Inventory
                    </h1>
                    <p className="text-slate-500 mt-1">Add, monitor and manage workshop machines.</p>
                </div>
            </div>

            <MachineForm onSubmit={handleAddMachine} />

            {error ? (
                <div className="p-8 text-center text-rose-500 bg-white rounded-xl border border-rose-200">{error}</div>
            ) : loading ? (
                <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {machines.map((machine) => (
                        <div key={machine.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col hover:shadow-md transition-shadow relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-full h-1 ${machine.status === 'Running' ? 'bg-emerald-500' :
                                    machine.status === 'Maintenance' ? 'bg-rose-500' : 'bg-slate-400'
                                }`}></div>

                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">{machine.name}</h3>
                                    <p className="text-sm text-slate-500 mt-0.5">Type: {machine.type}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {getStatusBadge(machine.status)}
                                    <button onClick={() => handleDelete(machine.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete machine">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {machines.length === 0 && (
                        <div className="col-span-full p-8 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
                            No machines registered in the factory floor.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Machines;
