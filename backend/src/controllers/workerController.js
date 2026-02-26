const db = require('../config/db');

// Get all workers
exports.getAllWorkers = async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT * FROM workers');
        res.status(200).json(rows);
    } catch (error) {
        next(error);
    }
};

// Get single worker
exports.getWorkerById = async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT * FROM workers WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Worker not found' });
        res.status(200).json(rows[0]);
    } catch (error) {
        next(error);
    }
};

// Create worker
exports.createWorker = async (req, res, next) => {
    try {
        const { name, skill, status } = req.body;
        if (!name || !skill) return res.status(400).json({ message: 'Name and skill required' });

        const [result] = await db.query(
            'INSERT INTO workers (name, skill, status) VALUES (?, ?, ?)',
            [name, skill, status || 'Available']
        );
        res.status(201).json({ id: result.insertId, message: 'Worker added successfully' });
    } catch (error) {
        next(error);
    }
};

// Update worker status
exports.updateWorkerStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        if (!status) return res.status(400).json({ message: 'Status is required' });

        const [result] = await db.query(
            'UPDATE workers SET status = ? WHERE id = ?',
            [status, req.params.id]
        );

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Worker not found' });
        res.status(200).json({ message: 'Worker status updated' });
    } catch (error) {
        next(error);
    }
};

// Update worker (full details)
exports.updateWorker = async (req, res, next) => {
    try {
        const { name, skill, status } = req.body;
        if (!name || !skill) return res.status(400).json({ message: 'Name and skill required' });

        const [result] = await db.query(
            'UPDATE workers SET name = ?, skill = ?, status = ? WHERE id = ?',
            [name, skill, status || 'Available', req.params.id]
        );

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Worker not found' });
        res.status(200).json({ message: 'Worker updated successfully' });
    } catch (error) {
        next(error);
    }
};

// Delete worker
exports.deleteWorker = async (req, res, next) => {
    try {
        const [result] = await db.query('DELETE FROM workers WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Worker not found' });
        res.status(200).json({ message: 'Worker deleted successfully' });
    } catch (error) {
        next(error);
    }
};
