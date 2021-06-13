CREATE DATABASE coursera_about;

CREATE SCHEMA about_course;

\c coursera_about;

CREATE TABLE description(
  course_id SERIAL PRIMARY KEY,
  recent_views INT NOT NULL,
  description VARCHAR (3000) NOT NULL,
  learner_career_outcomes TEXT [] NOT NULL,
  metadata TEXT [] NOT NULL,
  what_you_will_learn TEXT [] NOT NULL,
  skills_you_will_gain TEXT [] NOT NULL
);

CREATE USER jrudio WITH ENCRYPTED PASSWORD 'xyz';

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public to jrudio;
