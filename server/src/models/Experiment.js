const mongoose = require('mongoose');

const ToolSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['chemical', 'heater', 'shaker'], required: true },
}, { _id: false });

const TubeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  initial_volume: { type: Number, min: 0, max: 100, default: 0 },
  initial_color: { type: String, default: '#E8F4FA' },
}, { _id: false });

const StepSchema = new mongoose.Schema({
  step_order: { type: Number, required: true },
  action: { type: String, enum: ['inject', 'heat', 'shake', 'pour'], required: true },
  required_tool: { type: String, required: true },
  target: { type: String, required: true },
  success_ui_update: {
    colorCode: { type: String, required: true },
    addedVolume: { type: Number, min: 0, max: 100, default: 0 },
    effect: { type: String, enum: ['none', 'bubbles', 'precipitate', 'cloudy'], default: 'none' },
    colorSequence: { type: [String], default: undefined },
  },
  error_message: { type: String, required: true },
}, { _id: false });

const ReferenceTubeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  volume: { type: Number, min: 0, max: 100, default: 50 },
  color: { type: String, default: '#E8F4FA' },
}, { _id: false });

const ExperimentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tools: { type: [ToolSchema], required: true },
  tubes: { type: [TubeSchema], required: true },
  reference_tube: { type: ReferenceTubeSchema, required: true },
  steps: { type: [StepSchema], required: true },
});

module.exports = mongoose.model('Experiment', ExperimentSchema, 'Experiments');
