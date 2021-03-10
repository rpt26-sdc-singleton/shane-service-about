const mongoose = require('mongoose');
const { descriptionSchema } = require('./db');

const Description = mongoose.model('Description', descriptionSchema);

module.exports = {
  getOne: async (id) => {
    console.log('ID', id);
    Description.findOne({ course_id: id }, (err, doc) => {
      if (err) {
        throw err;
      } else {
        console.log(doc);
        return doc;
      }
    });
  },
};
