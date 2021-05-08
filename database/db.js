const mongoose = require('mongoose');

if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}

const { Schema } = mongoose;

mongoose.connect(process.env.ABOUT_MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', console.log.bind(console, 'connected!'));

const descriptionSchema = new Schema({
  course_id: { type: Number, required: true },
  recent_views: { type: Number, required: true },
  description: { type: String, required: true },
  learner_career_outcomes: [{
    icon: { type: String, required: true },
    pct: { type: Number, required: true },
    outcome: { type: String, required: true },
  }],
  metadata: [{
    icon: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
  }],
  what_you_will_learn: [{
    type: String,
    required: true,
  }],
  skills_you_will_gain: [{
    type: String,
    required: true,
  }],
});

module.exports = {
  db,
  descriptionSchema,
};
