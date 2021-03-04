const mongoose = require('mongoose');

const { Schema } = mongoose;

mongoose.connect('mongodb://localhost:27017/about', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('connected', () => {
  console.log('connected!');
});

const descriptionSchema = new Schema({
  course_id: Number,
  recent_views: Number,
  description: String,
  learner_career_outcomes: [{ icon: String, pct: Number, outcome: String }],
  metadata: [{ icon: String, title: String, subtitle: String }],
  what_you_will_learn: [String],
  skills_you_will_gain: [String],
});

module.exports = {
  db,
  descriptionSchema,
};
