const http = require('k6/http');
const { generateRecord } = require('../database/seedFunctions');

// const baseURL = process.env.BASE_URL || 'http://localhost:3002/';
const baseURL = 'http://localhost:3002/';

export const options = {
  vus: 1000,
  duration: '60s',
};

export default () => {
  const record = generateRecord();

  const result = http.post(`${baseURL}api/about/new`, {
    body: JSON.stringify(record),
  }, {
    tags: {
      name: 'service-post-endpoint',
    },
  });

  check(result, {
    '200 status code': (res) => res === 200,
  });
};
