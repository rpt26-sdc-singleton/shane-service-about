const mongoose = require('mongoose');
const { descriptionSchema } = require('./db');

const Description = mongoose.model('Description', descriptionSchema);
module.exports = {
  getOne: (id) => (
    new Promise((resolve, reject) => {
      if (!id) {
        reject(new Error('id is required'));
      } else if (Number.isNaN(id)) {
        reject(new Error('id must be of type number'));
      }

      Description.findOne({ course_id: id }, (err, doc) => {
        if (err) {
          reject(err);
        } else {
          resolve(doc);
        }
      });
    })
  ),
  getLatestListing: async () => (
    new Promise((resolve, reject) => {
      Description.find({})
        .select({ course_id: 1 })
        .sort({ course_id: -1 })
        .limit(1)
        .exec((err, listing) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(listing[0]);
        });
    })
  ),
  createListing: async function createListing(listingInfo = {}) {
    const listing = new Description(listingInfo);
    const latestListing = await this.getLatestListing();

    if (!latestListing) {
      throw new Error('could not find the latest listing');
    }

    listing.course_id = latestListing.course_id + 1;

    await listing.save();

    return listing;
  },
};
