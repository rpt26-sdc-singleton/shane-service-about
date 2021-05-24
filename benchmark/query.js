const { generateRecord } = require('../database/seedFunctions');
const {
  createListing,
  removeListing,
  getOne,
  updateListing,
} = require('../database/model');

require('dotenv').config();

(async () => {
  // start timers
  const id = {
    create: 10000015,
    fetch: 9875434,
    update: 9002799,
    delete: 9333690,
  };

  const newRecord = generateRecord(id.create);
  const createLabel = `created listing ${id.create} in`;
  const fetchLabel = `fetched listing ${id.fetch} in`;
  const updateLabel = `updated listing ${id.update} in`;
  const deleteLabel = `deleted listing ${id.delete} in`;

  console.time(createLabel);

  // create listing
  await createListing(newRecord);

  // end create's timer
  console.timeEnd(createLabel);

  // fetch listing
  console.time(fetchLabel);

  await getOne(id.fetch);

  // end fetch's timer
  console.timeEnd(fetchLabel);

  // update listing
  console.time(updateLabel);

  await updateListing(id.update, {
    recent_views: 777,
  });

  // end update's timer
  console.timeEnd(updateLabel);

  // delete listing
  console.time(deleteLabel);

  await removeListing(id.delete);

  // end delete's timer
  console.timeEnd(deleteLabel);
})();
