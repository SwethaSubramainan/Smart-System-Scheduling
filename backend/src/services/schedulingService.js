const db = require('../config/db');
const { addHoursToDate } = require('../utils/timeUtils');

/**
 * Generate a new schedule
 * Simple logic:
 * 1. Get all pending jobs ordered by priority (highest first)
 * 2. Get available machines and workers
 * 3. Assign job to the first matching machine and worker
 * 4. Update statuses and create schedule record
 */
exports.generateSchedule = async () => {
    const client = await db.connect();
    try {
        await client.query('BEGIN');

        // Fetch pending jobs
        const { rows: jobs } = await client.query(
            "SELECT * FROM jobs WHERE status = 'Pending' ORDER BY priority DESC"
        );

        if (jobs.length === 0) {
            await client.query('COMMIT');
            return { message: 'No pending jobs to schedule', count: 0 };
        }

        let scheduledCount = 0;

        // We will keep a local map of availability to avoid frequent reads in the loop
        const { rows: availableMachines } = await client.query(
            "SELECT * FROM machines WHERE status = 'Idle'"
        );
        const { rows: availableWorkers } = await client.query(
            "SELECT * FROM workers WHERE status = 'Available'"
        );

        for (const job of jobs) {
            // Find matching machine
            const machineIndex = availableMachines.findIndex(m => m.type === job.machine_type_required);
            // Find matching worker
            const workerIndex = availableWorkers.findIndex(w => w.skill === job.skill_required);

            if (machineIndex !== -1 && workerIndex !== -1) {
                const machine = availableMachines[machineIndex];
                const worker = availableWorkers[workerIndex];

                const startTime = new Date();
                const endTime = addHoursToDate(startTime, job.duration_hours);

                // Insert Schedule Record
                await client.query(
                    'INSERT INTO schedules (job_id, machine_id, worker_id, start_time, end_time) VALUES ($1, $2, $3, $4, $5)',
                    [job.id, machine.id, worker.id, startTime, endTime]
                );

                // Update Job Status
                await client.query(
                    "UPDATE jobs SET status = 'In Progress' WHERE id = $1",
                    [job.id]
                );

                // Update Machine Status
                await client.query(
                    "UPDATE machines SET status = 'Running' WHERE id = $1",
                    [machine.id]
                );

                // Update Worker Status
                await client.query(
                    "UPDATE workers SET status = 'Busy' WHERE id = $1",
                    [worker.id]
                );

                // Remove from available local arrays so they aren't assigned again in this run
                availableMachines.splice(machineIndex, 1);
                availableWorkers.splice(workerIndex, 1);

                scheduledCount++;
            }
        }

        await client.query('COMMIT');
        return { message: 'Scheduling complete', jobsScheduled: scheduledCount };

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

/**
 * Handle a Machine Breakdown
 * Revert affected jobs to pending, mark machine as maintenance, free up workers
 */
exports.handleMachineBreakdown = async (machineId) => {
    const client = await db.connect();
    try {
        await client.query('BEGIN');

        // 1. Mark machine as Maintenance
        await client.query("UPDATE machines SET status = 'Maintenance' WHERE id = $1", [machineId]);

        // 2. Find active schedules on this machine
        const { rows: schedules } = await client.query(`
      SELECT s.id as schedule_id, s.job_id, s.worker_id 
      FROM schedules s 
      JOIN jobs j ON s.job_id = j.id
      WHERE s.machine_id = $1 AND j.status = 'In Progress'
    `, [machineId]);

        // 3. For each affected schedule: return job to queue, free worker
        for (const schedule of schedules) {
            // Revert Job to 'Delayed'
            await client.query("UPDATE jobs SET status = 'Delayed' WHERE id = $1", [schedule.job_id]);

            // Free worker
            await client.query("UPDATE workers SET status = 'Available' WHERE id = $1", [schedule.worker_id]);

            // Remove or mark schedule as interrupted (for simplicity we will delete the broken schedule)
            await client.query('DELETE FROM schedules WHERE id = $1', [schedule.schedule_id]);
        }

        await client.query('COMMIT');
        return {
            message: 'Breakdown processed. Affected jobs reverted to Delayed state and workers freed.',
            jobsAffected: schedules.length
        };

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

/**
 * Fetch KPIs Server Side
 */
exports.getDashboardKPIs = async () => {
    try {
        // 1. Machine Utilization
        const { rows: [{ total_machines }] } = await db.query('SELECT COUNT(*) as total_machines FROM machines');
        const { rows: [{ running_machines }] } = await db.query("SELECT COUNT(*) as running_machines FROM machines WHERE status = 'Running'");
        const machineUtilization = total_machines > 0 ? Math.round((running_machines / total_machines) * 100) : 0;

        // 2. Worker Utilization
        const { rows: [{ total_workers }] } = await db.query('SELECT COUNT(*) as total_workers FROM workers');
        const { rows: [{ busy_workers }] } = await db.query("SELECT COUNT(*) as busy_workers FROM workers WHERE status = 'Busy'");
        const workerUtilization = total_workers > 0 ? Math.round((busy_workers / total_workers) * 100) : 0;

        // 3. On-time delivery rate
        const { rows: [{ completed_jobs }] } = await db.query("SELECT COUNT(*) as completed_jobs FROM jobs WHERE status = 'Completed'");
        const { rows: [{ delayed_count }] } = await db.query("SELECT COUNT(*) as delayed_count FROM jobs WHERE status = 'Delayed'");

        // Total jobs that have had an outcome
        const totalFinished = completed_jobs + delayed_count;
        const onTimeDelivery = totalFinished > 0 ? Math.round((completed_jobs / totalFinished) * 100) : 100;

        return {
            machineUtilization,
            workerUtilization,
            onTimeDelivery,
            delayedJobs: delayed_count
        };
    } catch (error) {
        throw error;
    }
};
