const db = require('../config/db');

// Get all jobs
exports.getAllJobs = async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT * FROM jobs ORDER BY priority DESC, created_at ASC');
        res.status(200).json(rows);
    } catch (error) {
        next(error);
    }
};

// Get single job by ID
exports.getJobById = async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT * FROM jobs WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        next(error);
    }
};

// Create a new job
exports.createJob = async (req, res, next) => {
    try {
        const { name, priority, machine_type_required, skill_required, duration_hours } = req.body;

        if (!name || !machine_type_required || !skill_required || !duration_hours) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const [result] = await db.query(
            'INSERT INTO jobs (name, priority, machine_type_required, skill_required, duration_hours) VALUES (?, ?, ?, ?, ?)',
            [name, priority || 1, machine_type_required, skill_required, duration_hours]
        );

        res.status(201).json({ id: result.insertId, message: 'Job created successfully' });
    } catch (error) {
        next(error);
    }
};

// Update a job
exports.updateJob = async (req, res, next) => {
    try {
        const { name, priority, machine_type_required, skill_required, duration_hours, status } = req.body;

        if (!name || !machine_type_required || !skill_required || !duration_hours) {
            return res.status(400).json({ message: 'All required fields are needed' });
        }

        const [result] = await db.query(
            'UPDATE jobs SET name = ?, priority = ?, machine_type_required = ?, skill_required = ?, duration_hours = ?, status = ? WHERE id = ?',
            [name, priority || 1, machine_type_required, skill_required, duration_hours, status || 'Pending', req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json({ message: 'Job updated successfully' });
    } catch (error) {
        next(error);
    }
};

// Delete a job
exports.deleteJob = async (req, res, next) => {
    try {
        const [result] = await db.query('DELETE FROM jobs WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        next(error);
    }
};
