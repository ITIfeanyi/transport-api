const moment = require("moment");
const dbQuery = require("../db_config/dev/dbQuery");

/**
 * Create A Trip
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */

const createTrip = async (req, res) => {
  const { bus_id, origin, destination, trip_date, fare } = req.body;

  const { is_admin } = req.user;
  if (!is_admin === true) {
    errorMessage.error = "Sorry You are unauthorized to create a trip";
    return res.status(status.bad).send(errorMessage);
  }

  const created_on = moment(new Date());

  const createTripQuery = `INSERT INTO
            trip(bus_id, origin, destination, trip_date, fare, created_on)
            VALUES($1, $2, $3, $4, $5, $6)
            returning *`;
  const values = [bus_id, origin, destination, trip_date, fare, created_on];

  try {
    const { rows } = await dbQuery.query(createTripQuery, values);
    const dbResponse = rows[0];
    return res.status(201).send(dbResponse);
  } catch (error) {
    return res.status(500).send("Unable to create trip");
  }
};

/**
 * Get All Trips
 * @param {object} req
 * @param {object} res
 * @returns {object} trips array
 */
const getAllTrips = async (req, res) => {
  const getAllTripsQuery = "SELECT * FROM trip ORDER BY id DESC";
  try {
    const { rows } = await dbQuery.query(getAllTripsQuery);
    const dbResponse = rows;
    if (!dbResponse[0]) {
      errorMessage.error = "There are no trips";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = "Operation was not successful";
    return res.status(status.error).send(errorMessage);
  }
};

/**
 * Get All Trips
 * @param {object} req
 * @param {object} res
 * @returns {object} trips array
 */
const getAllTrips = async (req, res) => {
  const getAllTripsQuery = "SELECT * FROM trip ORDER BY id DESC";
  try {
    const { rows } = await dbQuery.query(getAllTripsQuery);
    const dbResponse = rows;
    if (!dbResponse[0]) {
      return res.status(404).send("There are no trips");
    }

    return res.status(200).send(dbResponse);
  } catch (error) {
    return res.status(500).send("Operation was not successful");
  }
};

/**
 * cancel A Trip
 * @param {object} req
 * @param {object} res
 * @returns {void} return Trip cancelled successfully
 */
const cancelTrip = async (req, res) => {
  const { tripId } = req.params;
  const { is_admin } = req.user;
  const { cancelled } = trip_statuses;
  if (!is_admin === true) {
    return res.status(400).send("Sorry You are unauthorized to cancel a trip");
  }
  const cancelTripQuery = "UPDATE trip SET status=$1 WHERE id=$2 returning *";
  const values = [cancelled, tripId];
  try {
    const { rows } = await dbQuery.query(cancelTripQuery, values);
    const dbResponse = rows[0];
    if (!dbResponse) {
      return res.status(404).send("There is no trip with that id");
    }
    return res.status(200).send("Trip cancelled successfully");
  } catch (error) {
    return res.status(status.error).send("Operation was not successful");
  }
};

/**
 * filter trips by origin
 * @param {object} req
 * @param {object} res
 * @returns {object} returned trips
 */
const filterTripByOrigin = async (req, res) => {
  const { origin } = req.query;

  const findTripQuery = "SELECT * FROM trip WHERE origin=$1 ORDER BY id DESC";
  try {
    const { rows } = await dbQuery.query(findTripQuery, [origin]);
    const dbResponse = rows;
    if (!dbResponse[0]) {
      return res.status(404).send("No Trips with that origin");
    }
    return res.status(200).send(dbResponse);
  } catch (error) {
    return res.status(500).send("Operation was not successful");
  }
};

/**
 * filter trips by destination
 * @param {object} req
 * @param {object} res
 * @returns {object} returned trips
 */
const filterTripByDestination = async (req, res) => {
  const { destination } = req.query;

  const findTripQuery =
    "SELECT * FROM trip WHERE destination=$1 ORDER BY id DESC";
  try {
    const { rows } = await dbQuery.query(findTripQuery, [destination]);
    const dbResponse = rows;
    if (!dbResponse[0]) {
      return res.status(404).send("No Trips with that destination");
    }
    return res.status(200).send(dbResponse);
  } catch (error) {
    return res.status(500).send("Operation was not successful");
  }
};
module.exports = {
  createTrip,
  getAllTrips,
  cancelTrip,
  filterTripByOrigin,
  filterTripByDestination,
};
