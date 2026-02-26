import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const JobForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        priority: 1,
        machine_type_required: '',
        skill_required: '',
        duration_hours: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...formData, priority: Number(formData.priority), duration_hours: Number(formData.duration_hours) });
        setFormData({ name: '', priority: 1, machine_type_required: '', skill_required: '', duration_hours: '' });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Plus size={20} className="text-indigo-600" />
                Add New Job
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Job Name</label>
                        <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. Engine Block Assembly" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                        <select name="priority" value={formData.priority} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white">
                            <option value={1}>Low</option>
                            <option value={2}>Medium</option>
                            <option value={3}>High</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Machine Type Required</label>
                        <select name="machine_type_required" value={formData.machine_type_required} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white">
                            <option value="">Select type...</option>
                            <option value="CNC">CNC</option>
                            <option value="Milling">Milling</option>
                            <option value="Welding">Welding</option>
                            <option value="Assembly">Assembly</option>
                            <option value="Lathe">Lathe</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Skill Required</label>
                        <select name="skill_required" value={formData.skill_required} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white">
                            <option value="">Select skill...</option>
                            <option value="CNC">CNC</option>
                            <option value="Milling">Milling</option>
                            <option value="Welding">Welding</option>
                            <option value="Assembly">Assembly</option>
                            <option value="Lathe">Lathe</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Duration (hours)</label>
                        <input required type="number" min="1" name="duration_hours" value={formData.duration_hours} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. 4" />
                    </div>
                </div>
                <button type="submit" className="w-full md:w-auto px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors focus:ring-4 focus:ring-indigo-100 flex items-center justify-center gap-2 mt-4 ml-auto">
                    Create Job
                </button>
            </form>
        </div>
    );
};

export default JobForm;
