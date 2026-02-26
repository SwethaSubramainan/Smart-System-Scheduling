const db = require('../config/db');

// Get all machines
exports.getAllMachines = async (req, res, next) => {
    try {
        const { rows } = await db.query('SELECT * FROM machines');
        res.status(200).json(rows);
    } catch (error) {
        next(error);
    }
};

// Get single machine
exports.getMachineById = async (req, res, next) => {
    try {
        const { rows } = await db.query('SELECT * FROM machines WHERE id = $1', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Machine not found' });
        res.status(200).json(rows[0]);
    } catch (error) {
        next(error);
    }
};

// Create machine
exports.createMachine = async (req, res, next) => {
    try {
        const { name, type, status } = req.body;
        if (!name || !type) return res.status(400).json({ message: 'Name and type required' });

        const { rows } = await db.query(
            'INSERT INTO machines (name, type, status) VALUES ($1, $2, $3) RETURNING id',
            [name, type, status || 'Idle']
        );
        res.status(201).json({ id: rows[0].id, message: 'Machine added successfully' });
    } catch (error) {
        next(error);
    }
};

// Update machine status
exports.updateMachineStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        if (!status) return res.status(400).json({ message: 'Status is required' });

        const result = await db.query(
            'UPDATE machines SET status = $1 WHERE id = $2',
            [status, req.params.id]
        );

        if (result.rowCount === 0) return res.status(404).json({ message: 'Machine not found' });
        res.status(200).json({ message: 'Machine status updated' });
    } catch (error) {
        next(error);
    }
};

// Update machine (full details)
exports.updateMachine = async (req, res, next) => {
    try {
        const { name, type, status } = req.body;
        if (!name || !type) return res.status(400).json({ message: 'Name and type required' });

        const result = await db.query(
            'UPDATE machines SET name = $1, type = $2, status = $3 WHERE id = $4',
            [name, type, status || 'Idle', req.params.id]
        );

        if (result.rowCount === 0) return res.status(404).json({ message: 'Machine not found' });
        res.status(200).json({ message: 'Machine updated successfully' });
    } catch (error) {
        next(error);
    }
};

// Delete machine
exports.deleteMachine = async (req, res, next) => {
    try {
        const result = await db.query('DELETE FROM machines WHERE id = $1', [req.params.id]);
        if (result.rowCount === 0) return res.status(404).json({ message: 'Machine not found' });
        res.status(200).json({ message: 'Machine deleted successfully' });
    } catch (error) {
        next(error);
    }
};
