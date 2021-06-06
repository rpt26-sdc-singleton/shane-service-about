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
        recordCopy[key] = this.serializeDBArray(recordCopy[key]);
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
        arrCopy[i] = JSON.parse(element);
      }
    }

    return arrCopy;
  },
};

module.exports = {
  getOne: async (id) => {
    if (!id) {
      throw new Error('id is required');
    } else if (Number.isNaN(id)) {
      throw new Error('id must be of type number');
    }

    const query = format('select * from %I where course_id=%L', 'description', id);

    const result = await db.query(query);

    if (result.rows.length < 1) {
      throw new Error('not found');
    }

    return helpers.deserializeRecord(result.rows[0]);
  },
  createListing: function createListing(listingInfo = {}) {
    const listingCopy = helpers.serializeRecord(listingInfo);

    const query = 'insert into description(recent_views,description,learner_career_outcomes,metadata,what_you_will_learn,skills_you_will_gain) values($1,$2,$3,$4,$5,$6)';

    return db.query(query, [
      listingCopy.recent_views,
      listingCopy.description,
      listingCopy.learner_career_outcomes,
      listingCopy.metadata,
      listingCopy.what_you_will_learn,
      listingCopy.skills_you_will_gain])
      .then((result) => result)
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
  removeListing: (id) => {
    if (!id) {
      throw new Error('id is required');
    } else if (Number.isNaN(id)) {
      throw new Error('id must be of type number');
    }

    const query = format('delete from description where course_id=%L', id);

    return db.query(query)
      .then((result) => result.rowCount)
      .catch((err) => {
        throw err;
      });
  },
  updateListing: async (id, listingInfo = {}) => {
    if (Number.isNaN(id)) {
      throw new Error('id must be of type number');
    }

    if (!listingInfo) {
      throw new Error('must have a field to update');
    }

    const queryValues = [];
    let queryBuilder = '';

    const keys = Object.keys(listingInfo);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      queryBuilder += `${key}=%L`;

      if (i !== (keys.length - 1)) {
        queryBuilder += ',';
      }

      queryValues.push(listingInfo[key]);
    }

    if (!queryBuilder) {
      throw new Error('failed to build query based off of listingInfo');
    }

    const query = format(`update description set ${queryBuilder} where course_id=%L`, queryValues, id);

    return db.query(query)
      .then((result) => result.rowCount)
      .catch((err) => {
        throw err;
      });
  },
};
