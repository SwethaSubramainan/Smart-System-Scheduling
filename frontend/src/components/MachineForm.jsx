import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const MachineForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        status: 'Idle'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({ name: '', type: '', status: 'Idle' });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Plus size={20} className="text-indigo-600" />
                Add New Machine
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Machine Name</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. CNC Lathe Alpha" />
                </div>
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Machine Type</label>
                    <select name="type" value={formData.type} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white">
                        <option value="">Select type...</option>
                        <option value="CNC">CNC</option>
                        <option value="Milling">Milling</option>
                        <option value="Welding">Welding</option>
                        <option value="Assembly">Assembly</option>
                        <option value="Lathe">Lathe</option>
                    </select>
                </div>
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white">
                        <option value="Idle">Idle</option>
                        <option value="Running">Running</option>
                        <option value="Maintenance">Maintenance</option>
                    </select>
                </div>
                <button type="submit" className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors h-[42px] whitespace-nowrap">
                    Add Machine
                </button>
            </form>
        </div>
    );
};

export default MachineForm;
