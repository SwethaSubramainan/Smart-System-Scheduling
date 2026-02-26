const schedulingService = require('../services/schedulingService');
const db = require('../config/db');

// Trigger Schedule Generation
exports.generateSchedule = async (req, res, next) => {
    try {
        const result = await schedulingService.generateSchedule();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// Trigger Breakdown Handling
exports.handleBreakdown = async (req, res, next) => {
    try {
        const { machineId } = req.body;
        if (!machineId) {
            return res.status(400).json({ message: 'Machine ID is required' });
        }
        const result = await schedulingService.handleMachineBreakdown(machineId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// Fetch KPIs
exports.getKPIs = async (req, res, next) => {
    try {
        const kpis = await schedulingService.getDashboardKPIs();
        res.status(200).json(kpis);
    } catch (error) {
        next(error);
    }
};

// Get All Schedules Data points for Gantt Chart visualization
exports.getSchedules = async (req, res, next) => {
    try {
        const query = `
      SELECT s.id, s.start_time, s.end_time, 
             j.name as job_name, j.status as job_status, 
             m.name as machine_name, w.name as worker_name
      FROM schedules s
      JOIN jobs j ON s.job_id = j.id
      JOIN machines m ON s.machine_id = m.id
      JOIN workers w ON s.worker_id = w.id
    `;
        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (error) {
        next(error);
    }
};
