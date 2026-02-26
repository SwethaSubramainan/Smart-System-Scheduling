import axios from 'axios';

// Create an Axios instance
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Replace with your actual backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Mocked functions for hackathon readiness
// In a real scenario, these would call endpoints like api.get('/jobs')

export const fetchJobs = async () => {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => resolve([
            { id: 1, name: 'Job A', status: 'In Progress', machine: 'Machine 1', worker: 'Alice' },
            { id: 2, name: 'Job B', status: 'Pending', machine: 'Machine 2', worker: 'Bob' },
        ]), 500);
    });
};

export const fetchMachines = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve([
            { id: 1, name: 'Machine 1', status: 'Running', utilization: 85 },
            { id: 2, name: 'Machine 2', status: 'Idle', utilization: 0 },
            { id: 3, name: 'Machine 3', status: 'Maintenance', utilization: 0 },
        ]), 500);
    });
};

export const fetchWorkers = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve([
            { id: 1, name: 'Alice', skill: 'Welding', utilization: 90 },
            { id: 2, name: 'Bob', skill: 'Assembly', utilization: 75 },
        ]), 500);
    });
};

export const fetchKPIs = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({
            machineUtilization: 75,
            workerUtilization: 80,
            onTimeDelivery: 92,
            delayedJobs: 3
        }), 500);
    });
};

export default api;
