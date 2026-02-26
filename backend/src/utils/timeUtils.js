/**
 * Adds the specified number of hours to a date object
 * @param {Date} date - Source Date
 * @param {number} hours - Hours to add
 * @returns {Date} New Date object
 */
exports.addHoursToDate = (date, hours) => {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
};
