const mongoose = require('mongoose');
const { descriptionSchema } = require('./db');

const Description = mongoose.model('Description', descriptionSchema);

module.exports = {
  getOne: (id) => (
    new Promise((resolve, reject) => {
      Description.findOne({ course_id: id }, (err, doc) => {
        if (err) {
          reject(err);
        } else {
          resolve(doc);
        }
      });
    })
  ),
};
