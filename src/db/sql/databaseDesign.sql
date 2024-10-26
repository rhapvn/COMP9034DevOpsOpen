DROP TABLE IF EXISTS disposal_logs;
DROP TABLE IF EXISTS chemical_assigning;
DROP TABLE IF EXISTS experiments;
DROP TABLE IF EXISTS stock;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS chemical_data;
DROP TABLE IF EXISTS storage_locations;
DROP TABLE IF EXISTS laboratories;
DROP TABLE IF EXISTS research_centres;
DROP TABLE IF EXISTS institutes;
DROP TABLE IF EXISTS members;

DROP TYPE IF EXISTS experiment_status_enum;
DROP TYPE IF EXISTS user_status_enum;
DROP TYPE IF EXISTS user_role_enum;
DROP TYPE IF EXISTS place_tag_enum;

CREATE TYPE place_tag_enum AS ENUM ('institute', 'researchCentre', 'laboratory');
CREATE TYPE user_role_enum AS ENUM ('admin', 'researcher', 'supervisor', 'approver', 'storage');
CREATE TYPE user_status_enum AS ENUM ('active', 'locked', 'deactivated');
CREATE TYPE experiment_status_enum AS ENUM ('saved', 'submitted', 'escalated', 'approved', 'procured', 'rejected', 'withdrawn');

CREATE TABLE institutes (
  id          serial       PRIMARY KEY,
  name        varchar(255) NOT NULL,
  address     text,
  is_deleted  boolean      NOT NULL DEFAULT false
);

CREATE TABLE research_centres (
  id          serial       PRIMARY KEY,
  name        varchar(255) NOT NULL,
  address     text,
  is_deleted  boolean      NOT NULL DEFAULT false,
  institute_id integer     REFERENCES institutes(id) ON DELETE RESTRICT
);

CREATE TABLE laboratories (
  id          serial        PRIMARY KEY,
  name        varchar(255)  NOT NULL,
  address     text,
  is_deleted  boolean       NOT NULL DEFAULT false,
  centre_id   integer       REFERENCES research_centres(id) ON DELETE RESTRICT
);

CREATE TABLE storage_locations (
  storage_id   serial       PRIMARY KEY,
  storage_name varchar(255) NOT NULL,
  place_tag    place_tag_enum NOT NULL,
  place_tag_id integer      NOT NULL,
  capacity     integer      NOT NULL DEFAULT 0,
  equipment    text,
  is_deleted   boolean      NOT NULL DEFAULT false
);

CREATE TABLE chemical_data (
  chemical_id     serial        PRIMARY KEY,
  common_name     varchar(255)  NOT NULL,
  systematic_name varchar(255)  NOT NULL,
  risk_level      integer       NOT NULL DEFAULT 1, -- 1 -> 5
  expiry_period   integer,
  is_deleted      boolean       NOT NULL DEFAULT false
);

CREATE TABLE users (
  user_id          serial           PRIMARY KEY,
  first_name       varchar(255)     NOT NULL,
  last_name        varchar(255),
  phone            varchar(50)      NOT NULL,
  email            varchar(255)     NOT NULL UNIQUE,
  role            user_role_enum   NOT NULL DEFAULT 'researcher',
  status           user_status_enum NOT NULL DEFAULT 'active',
  profile_img      text,
  created_by       integer          NOT NULL,
  created_time     timestamp        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_update_by   integer,
  last_update_time timestamp,
  place_tag        place_tag_enum   NOT NULL,
  place_tag_id     integer          NOT NULL,
  username         varchar(255)     NOT NULL UNIQUE,  -- Only for dev purpose
  password         varchar(255)     NOT NULL          -- Only for dev purpose
);

CREATE TABLE stock (
  stock_id         serial     PRIMARY KEY,
  storage_id       integer    REFERENCES storage_locations(storage_id) ON DELETE RESTRICT,
  chemical_id      integer    REFERENCES chemical_data(chemical_id) ON DELETE RESTRICT,
  quantity         integer    NOT NULL,
  expiry_date      timestamp  NOT NULL,
  last_updated_by  integer    REFERENCES users(user_id) ON DELETE RESTRICT,
  last_updated_time timestamp NOT NULL,
  is_occupied      boolean    NOT NULL DEFAULT false -- true: it is reserved by a user (experiment), otherwise it is false
);

CREATE TABLE experiments (
  experiment_id            serial     PRIMARY KEY,
  experiment_details       text       NOT NULL,
  is_risk_assessment_done  boolean    NOT NULL, --true: assessment is properly done on paper.
  highest_risk_level       integer    NOT NULL,
  status                   experiment_status_enum NOT NULL,
  last_saved_date          timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  submission_date          timestamp,
  submitted_user_id        integer    REFERENCES users(user_id) ON DELETE RESTRICT, -- New
  place_tag_id             integer    NOT NULL, -- New
  experiment_end_date      timestamp,
  first_approver_id        integer    REFERENCES users(user_id) ON DELETE RESTRICT,
  first_approval_time      timestamp,
  first_approver_comments  text,
  second_approver_id       integer    REFERENCES users(user_id) ON DELETE RESTRICT,
  second_approval_time     timestamp,
  second_approver_comments text,
  stock_control_id         integer    REFERENCES users(user_id) ON DELETE RESTRICT,
  stock_control_checked_time timestamp,
  stock_control_comments   text
);

CREATE TABLE chemical_assigning (
  id            serial    PRIMARY KEY,
  experiment_id integer   REFERENCES experiments(experiment_id) ON DELETE RESTRICT,
  chemical_id   integer   REFERENCES chemical_data(chemical_id) ON DELETE RESTRICT,
  stock_id      integer   REFERENCES stock(stock_id) ON DELETE RESTRICT,
  quantity      integer   NOT NULL
);

CREATE TABLE disposal_logs (
  disposal_id   serial    PRIMARY KEY,
  chemical_id   integer   REFERENCES chemical_data(chemical_id),
  stock_id      integer   REFERENCES stock(stock_id),
  disposal_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  confirm_by    integer   REFERENCES users(user_id)  ON DELETE RESTRICT
);

DROP TABLE IF EXISTS members;

--Dev purpose
CREATE TABLE members (
  user_id     serial      PRIMARY KEY,
  username    varchar(50) NOT NULL UNIQUE,
  full_name   varchar(100),
  email       varchar(100) NOT NULL UNIQUE,
  created_at  timestamp   DEFAULT CURRENT_TIMESTAMP,
  updated_at  timestamp   DEFAULT CURRENT_TIMESTAMP
);






