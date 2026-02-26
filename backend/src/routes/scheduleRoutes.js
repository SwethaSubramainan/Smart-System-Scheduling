const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.get('/', scheduleController.getSchedules);
router.get('/kpis', scheduleController.getKPIs);
router.post('/generate', scheduleController.generateSchedule);
router.post('/breakdown', scheduleController.handleBreakdown);

module.exports = router;
