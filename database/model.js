const format = require('pg-format');
const { db } = require('./db');

const helpers = {
  serializeDBArray(databaseArr = []) {
    let str = '{';

    for (let i = 0; i < databaseArr.length; i++) {
      str += `"${encodeURIComponent(JSON.stringify(databaseArr[i]))}"`;

      if (i !== databaseArr.length - 1) {
        str += ',';
      }
    }

    str += '}';

    return str;
  },
  serializeRecord(record = {}) {
    const recordCopy = Object.assign(record);

    const keys = Object.keys(recordCopy);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (key === 'learner_career_outcomes'
        || key === 'metadata') {
        recordCopy[key] = this.serializeDBArray(recordCopy);
      }
    }

    return recordCopy;
  },
  deserializeRecord(record = {}) {
    const objCopy = Object.assign(record);

    const keys = Object.keys(objCopy);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (key === 'learner_career_outcomes'
        || key === 'metadata') {
        console.log(objCopy[key]);
        objCopy[key] = this.deserializeDBArray(objCopy[key]);
      }
    }

    return objCopy;
  },
  deserializeDBArray(databaseArr = []) {
    const arrCopy = databaseArr.slice();

    for (let i = 0; i < arrCopy.length; i++) {
      const element = arrCopy[i];

      if (typeof element === 'string') {
        // Go uses '+' in their version of encodeURIComponent
        // Javascript's decodeURIComponent doesn't decode this, so we must replace '+'s with ' '
        const str = decodeURIComponent(element);
        const strWithSpaces = str.replace(/\+/g, ' ');

        arrCopy[i] = JSON.parse(strWithSpaces);
      }
    }

    return arrCopy;
  },
};

module.exports = {
  getOne: (id) => {
    if (!id) {
      throw new Error('id is required');
    } else if (Number.isNaN(id)) {
      throw new Error('id must be of type number');
    }

    const query = format('select * from %I where course_id=%L', 'description', id);

    return db.query(query)
      .then((res) => {
        if (res.rows.length < 1) {
          throw new Error('not found');
        }

        return helpers.deserializeRecord(res.rows[0]);
      });
  },
  // createListing: async function createListing(listingInfo = {}) {
  //   const listing = new Description(listingInfo);

  //   if (listing.course_id === undefined || listing.course_id === 0) {
  //     const latestListing = await this.getLatestListing();

  //     if (!latestListing) {
  //       throw new Error('could not find the latest listing');
  //     }

  //     listing.course_id = latestListing.course_id + 1;
  //   }

  //   await listing.save();

  //   return listing;
  // },
  // isValidListing: (listingInfo = {}) => (
  //   new Promise((resolve) => {
  //     new Description(listingInfo)
  //       .validate((err) => {
  //         if (err) {
  //           console.log(err);
  //           resolve(false);
  //         } else {
  //           resolve(true);
  //         }
  //       });
  //   })
  // ),
  // removeListing: async (id) => {
  //   if (!id) {
  //     throw new Error('id is required');
  //   } else if (Number.isNaN(id)) {
  //     throw new Error('id must be of type number');
  //   }

  //   await Description.deleteOne({
  //     course_id: id,
  //   });
  // },
  // updateListing: async (id, listingInfo = {}) => (
  //   new Promise((resolve, reject) => {
  //     Description.findOneAndUpdate({ course_id: id }, listingInfo, (err) => {
  //       if (err) {
  //         reject(err);
  //         return;
  //       }

  //       resolve(true);
  //     });
  //   })
  // ),
};
