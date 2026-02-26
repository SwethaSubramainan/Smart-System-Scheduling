import React, { useEffect, useState } from 'react';
import KPIDashboard from '../components/KPIDashboard';
import { fetchKPIs } from '../services/api';

const Dashboard = () => {
    const [kpis, setKpis] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchKPIs();
                setKpis(data);
            } catch (error) {
                console.error("Failed to fetch KPIs:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Overview</h1>
                <p className="text-slate-500 mt-1">Real-time metrics and manufacturing KPIs.</p>
            </div>

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
