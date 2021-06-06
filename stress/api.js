const http = require('k6/http');

// const baseURL = process.env.BASE_URL || 'http://localhost:3002/';
const baseURL = 'http://localhost:3002/';

export const options = {
  vus: 1000,
  duration: '60s',
};

const idList = [];

for (let i = 9899999; i <= 9900099; i += 1) {
  idList.push(i);
}

const randomID = () => (
  idList[Math.floor(Math.random() * idList.length)]
);

export default () => {
  const result = http.get(`${baseURL}api/about/${randomID()}`, {
    tags: {
      name: 'service-endpoint',
    },
  });

  check(result, {
    '200 status code': (res) => res === 200,
  });
};
