import axios from 'axios';

// Create an Axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// ─── Jobs ────────────────────────────────────────────
export const fetchJobs = async () => {
    const { data } = await api.get('/jobs');
    return data;
};

export const createJob = async (job) => {
    const { data } = await api.post('/jobs', job);
    return data;
};

export const updateJob = async (id, job) => {
    const { data } = await api.put(`/jobs/${id}`, job);
    return data;
};

export const deleteJob = async (id) => {
    const { data } = await api.delete(`/jobs/${id}`);
    return data;
};

// ─── Machines ────────────────────────────────────────
export const fetchMachines = async () => {
    const { data } = await api.get('/machines');
    return data;
};

export const createMachine = async (machine) => {
    const { data } = await api.post('/machines', machine);
    return data;
};

export const updateMachine = async (id, machine) => {
    const { data } = await api.put(`/machines/${id}`, machine);
    return data;
};

export const deleteMachine = async (id) => {
    const { data } = await api.delete(`/machines/${id}`);
    return data;
};

// ─── Workers ─────────────────────────────────────────
export const fetchWorkers = async () => {
    const { data } = await api.get('/workers');
    return data;
};

export const createWorker = async (worker) => {
    const { data } = await api.post('/workers', worker);
    return data;
};

export const updateWorker = async (id, worker) => {
    const { data } = await api.put(`/workers/${id}`, worker);
    return data;
};

export const deleteWorker = async (id) => {
    const { data } = await api.delete(`/workers/${id}`);
    return data;
};

// ─── Schedule & KPIs ─────────────────────────────────
export const fetchSchedules = async () => {
    const { data } = await api.get('/schedule');
    return data;
};

export const generateSchedule = async () => {
    const { data } = await api.post('/schedule/generate');
    return data;
};

export const reportBreakdown = async (machineId) => {
    const { data } = await api.post('/schedule/breakdown', { machineId });
    return data;
};

export const fetchKPIs = async () => {
    const { data } = await api.get('/schedule/kpis');
    return data;
};

export default api;
