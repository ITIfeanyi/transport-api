const pool = require("./pool");
const debug = require("debug")("dbConnection");
pool.on("connect", () => {
  console.log("connected to the database");
});

const createUserTable = () => {
  const userCreateQuery = `CREATE TABLE IF NOT EXISTS users
  (id SERIAL PRIMARY KEY, 
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_on DATE NOT NULL
    )`;
  pool
    .query(userCreateQuery)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

const createBusTable = () => {
  const busCreateQuery = `CREATE TABLE IF NOT EXISTS bus
  (id SERIAL PRIMARY KEY,
    number_plate VARCHAR(20) NOT NULL,
    manufacturer VARCHAR(20) NOT NULL,
    model VARCHAR (50) NOT NULL,
    year VARCHAR(10) NOT NULL,
    created_on DATE NOT NULL)`;

  pool
    .query(busCreateQuery)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

const createTripTable = () => {
  const tripCreateQuery = `CREATE TABLE IF NOT EXISTS trip
      (id SERIAL PRIMARY KEY, 
        origin VARCHAR (100) NOT NULL,
        destination VARCHAR(100) NOT NULL,
        trip_date DATE NOT NULL,
        fare float NOT NULL,
        status float DEFAULT(1.00),
        created_on DATE NOT NULL)`;
  pool
    .query(tripCreateQuery)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};
const createBookingTable = () => {
  const bookCreateQuery = `CREATE TABLE IF NOT EXISTS booking(
      id SERIAL,
      trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      bus_id INTEGER REFERENCES bus(id) ON DELETE CASCADE,
      trip_date DATE,
      seat_number INTEGER unique,
      first_name  VARCHAR(50) NOT NULL,
      last_name VARCHAR(50) NOT NULL,
      email VARCHAR(50) NOT NULL,
      created_on DATE NOT NULL,
      PRIMARY KEY (id, trip_id, user_id))`;

  pool
    .query(bookCreateQuery)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

const dropUserTable = () => {
  const userDropQuery = `DROP TABLE IF EXISTS users`;
  pool
    .query(userDropQuery)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

const dropBusTable = () => {
  const busDropQuery = `DROP TABLE IF EXISTS bus`;
  pool
    .query(busDropQuery)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

const dropTripTable = () => {
  const tripDropQuery = `DROP TABLE IF EXISTS trip`;
  pool
    .query(tripDropQuery)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

const dropBookingTable = () => {
  const bookingDropQuery = `DROP TABLE IF EXISTS booking`;
  pool
    .query(bookingDropQuery)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

const createAllTables = () => {
  createUserTable(), createBusTable(), createTripTable(), createBookingTable();
};

const dropAllTables = () => {
  dropUserTable(), dropBusTable(), dropTripTable(), dropBookingTable();
};

pool.on("remove", () => {
  console.log("clients removed");
  process.exit(0);
});

module.exports = {
  createAllTables,
  dropAllTables,
};

require("make-runnable");
