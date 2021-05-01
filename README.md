# Service - About

<!-- [![Coverage Status](https://coveralls.io/repos/github/Ingenuity-rpt26/shane-service-about/badge.svg?branch=setup)](https://coveralls.io/github/Ingenuity-rpt26/shane-service-about?branch=setup)
[![Build Status](https://www.travis-ci.com/Ingenuity-rpt26/shane-service-about.svg?branch=main)](https://www.travis-ci.com/Ingenuity-rpt26/shane-service-about) -->

> Coursera About Service
> Contains a description of the course, along with some strategic goals and possible outcomes of taking the course.
>
> [View the sample on Coursera under "About this Course"](https://www.coursera.org/learn/machine-learning)

## Related Projects

  - https://github.com/rpt26-sdc-singleton/jrudio-proxy
  - https://github.com/rpt26-sdc-singleton/alex-reviews
  - https://github.com/rpt26-sdc-singleton/jason-titleBanner-service
  - https://github.com/rpt26-sdc-singleton/jsmithInstructorsService

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
1. [API](#api-routes)

## Usage

> From within the `db` directory, run `seedRunner.js` to seed the database and wait for it to complete.
> Run `npm build` to build the webpack bundle
> Run `npm server-dev` to start the server. Server runs on port 3002.

## Requirements

An `nvmrc` file is included if using [nvm](https://github.com/creationix/nvm).

- Node 6.13.0
- etc

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install -g webpack
npm install
```

## API Routes

#### GET `/api/about/:id`

- returns [json payload](./database/sampleDB.json)

#### POST `/api/about/:id`

- Creates a new listing that takes no input on the body
- returns a 201 if successful

#### PUT `/api/about/:id`

- Accepts fields in the request body to mutate the listing at requested id
- returns a 200 status code on success

#### DELETE `/api/about/:id`

- returns a 200 status code on successful deletion

