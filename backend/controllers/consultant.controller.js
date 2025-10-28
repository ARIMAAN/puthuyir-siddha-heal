const Consultant = require('../models/Consultant');

// @desc    Get all consultants
// @route   GET /api/consultants
// @access  Public
exports.getConsultants = async (req, res) => {
  try {
    const consultants = await Consultant.find({});
    res.json(consultants);
  } catch (error) {
    console.error('Error fetching consultants:', error);
    res.status(500).json({ error: 'Failed to fetch consultants' });
  }
};
