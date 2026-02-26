import React, { useState, useEffect } from 'react';
import MachineForm from '../components/MachineForm';
import { fetchMachines } from '../services/api';
import { Factory, Power, Settings, AlertCircle } from 'lucide-react';

const Machines = () => {
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMachines = async () => {
            try {
                const data = await fetchMachines();
                setMachines(data);
            } catch (error) {
                console.error("Failed to load machines:", error);
            } finally {
                setLoading(false);
            }
        };
        loadMachines();
    }, []);

    const handleAddMachine = (newMachine) => {
        const machineWithId = { ...newMachine, id: Date.now() };
        setMachines([...machines, machineWithId]);
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

            {loading ? (
                <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {machines.map((machine) => (
                        <div key={machine.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col hover:shadow-md transition-shadow relative overflow-hidden">
                            {/* Top border color line based on status */}
                            <div className={`absolute top-0 left-0 w-full h-1 ${machine.status === 'Running' ? 'bg-emerald-500' :
                                    machine.status === 'Maintenance' ? 'bg-rose-500' : 'bg-slate-400'
                                }`}></div>

                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-slate-800">{machine.name}</h3>
                                {getStatusBadge(machine.status)}
                            </div>

                            <div className="mt-auto">
                                <div className="flex justify-between text-sm text-slate-500 mb-1 mt-6">
                                    <span>Utilization</span>
                                    <span className="font-semibold">{machine.utilization}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-500 ${machine.utilization > 80 ? 'bg-emerald-500' :
                                                machine.utilization > 50 ? 'bg-indigo-500' : 'bg-slate-400'
                                            }`}
                                        style={{ width: `${machine.utilization}%` }}
                                    ></div>
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
