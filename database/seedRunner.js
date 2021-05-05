// Combined into a single file here to make testing more consistent
// Allows testing the seed functions without the database

// const mongoose = require('mongoose');
const { /* seedDatabase, */ generateRecords } = require('./seedFunctions');
// const { descriptionSchema } = require('./db.js');
console.log(generateRecords(1e7));

// const Description = mongoose.model('Description', descriptionSchema);

// seedDatabase(Description);
