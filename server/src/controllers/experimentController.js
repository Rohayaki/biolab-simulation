
const mongoose = require('mongoose');
const Experiment = require('../models/Experiment');

// GET /experiments
exports.getExperiments = async (req, res) => {
  try {
    const list = await Experiment.find(
      {},
      '_id title description'
    );

    return res.status(200).json(list);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

// GET /experiments/:id
exports.getExperimentById = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra ID hợp lệ
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: 'ID không hợp lệ'
      });
    }

    // Tìm thí nghiệm theo ID
    const experiment = await Experiment.findById(id);

    if (!experiment) {
      return res.status(404).json({
        message: 'Không tìm thấy thí nghiệm'
      });
    }

    return res.status(200).json(experiment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};
