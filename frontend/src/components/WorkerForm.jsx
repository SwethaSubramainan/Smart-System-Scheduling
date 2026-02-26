import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const WorkerForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        skill: '',
        utilization: 0
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...formData, utilization: Number(formData.utilization) });
        setFormData({ name: '', skill: '', utilization: 0 });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Plus size={20} className="text-indigo-600" />
                Add New Worker
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Worker Name</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. John Doe" />
                </div>
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Primary Skill</label>
                    <input required type="text" name="skill" value={formData.skill} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. Welding" />
                </div>
                <button type="submit" className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors h-[42px] whitespace-nowrap">
                    Add Worker
                </button>
            </form>
        </div>
    );
};

export default WorkerForm;
