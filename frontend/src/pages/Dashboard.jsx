import React, { useEffect, useState } from 'react';
import KPIDashboard from '../components/KPIDashboard';
import { fetchKPIs } from '../services/api';

const Dashboard = () => {
    const [kpis, setKpis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchKPIs();
            setKpis(data);
        } catch (err) {
            console.error("Failed to fetch KPIs:", err);
            setError('Could not load dashboard data. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    return (
        <div className="animate-fade-in">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Overview</h1>
                    <p className="text-slate-500 mt-1">Real-time metrics and manufacturing KPIs.</p>
                </div>
                <button onClick={loadData} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                    Refresh
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">{error}</div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <KPIDashboard kpis={kpis} />
            )}
        </div>
    );
};

export default Dashboard;
