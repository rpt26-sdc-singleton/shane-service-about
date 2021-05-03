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

    if (listing.course_id === undefined || listing.course_id === 0) {
      const latestListing = await this.getLatestListing();

      if (!latestListing) {
        throw new Error('could not find the latest listing');
      }

      listing.course_id = latestListing.course_id + 1;
    }

    await listing.save();

    return listing;
  },
  isValidListing: (listingInfo = {}) => (
    new Promise((resolve) => {
      new Description(listingInfo)
        .validate((err) => {
          if (err) {
            console.log(err);
            resolve(false);
          } else {
            resolve(true);
          }
        });
    })
  ),
  removeListing: async (id) => {
    if (!id) {
      throw new Error('id is required');
    } else if (Number.isNaN(id)) {
      throw new Error('id must be of type number');
    }

    await Description.deleteOne({
      course_id: id,
    });
  },
  updateListing: async (id, listingInfo = {}) => (
    new Promise((resolve, reject) => {
      Description.findOneAndUpdate({ course_id: id }, listingInfo, (err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(true);
      });
    })
  ),
};
