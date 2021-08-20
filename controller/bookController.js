const moment = require("moment");
const dbQuery = require("../db_config/dev/dbQuery");
/**
 * Add A Booking
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
const createBooking = async (req, res) => {
  const { trip_id, bus_id, trip_date, seat_number } = req.body;

  const { first_name, last_name, user_id, email } = req.user;
  const created_on = moment(new Date());

  if (!trip_id) {
    return res.status(400).send("Trip is required");
  }
  const createBookingQuery = `INSERT INTO
            booking(user_id, trip_id, bus_id, trip_date, seat_number, first_name, last_name, email, created_on)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
            returning *`;
  const values = [
    user_id,
    trip_id,
    bus_id,
    trip_date,
    seat_number,
    first_name,
    last_name,
    email,
    created_on,
  ];

  try {
    const { rows } = await dbQuery.query(createBookingQuery, values);
    const dbResponse = rows[0];
    return res.status(201).send(dbResponse);
  } catch (error) {
    if (error.routine === "_bt_check_unique") {
      return res.status(status.conflict).send("Seat Number is taken already");
    }
    return res.status(500).send("Unable to create booking");
  }
};

/**
 * Get All Bookings
 * @param {object} req
 * @param {object} res
 * @returns {object} buses array
 */
const getAllBookings = async (req, res) => {
  const { is_admin, user_id } = req.user;
  if (!is_admin === true) {
    const getAllBookingsQuery = "SELECT * FROM booking WHERE user_id = $1";
    try {
      const { rows } = await dbQuery.query(getAllBookingsQuery, [user_id]);
      const dbResponse = rows;
      if (dbResponse[0] === undefined) {
        return res.status(404).send("You have no bookings");
      }
      return res.status(200).send(dbResponse);
    } catch (error) {
      return res.status(500).send("An error Occured");
    }
  }
  const getAllBookingsQuery = "SELECT * FROM booking ORDER BY id DESC";
  try {
    const { rows } = await dbQuery.query(getAllBookingsQuery);
    const dbResponse = rows;
    if (dbResponse[0] === undefined) {
      return res.status(400).send("There are no bookings");
    }
    return res.status(200).send(dbResponse);
  } catch (error) {
    return res.status(500).send("An error Occured");
  }
};

/**
 * Delete A Booking
 * @param {object} req
 * @param {object} res
 * @returns {void} return response booking deleted successfully
 */
const deleteBooking = async (req, res) => {
  const { bookingId } = req.params;
  const { user_id } = req.user;
  const deleteBookingQuery =
    "DELETE FROM booking WHERE id=$1 AND user_id = $2 returning *";
  try {
    const { rows } = await dbQuery.query(deleteBookingQuery, [
      bookingId,
      user_id,
    ]);
    const dbResponse = rows[0];
    if (!dbResponse) {
      return res.status(404).send("You have no booking with that id");
    }
    return res.status(200).send("Booking deleted successfully");
  } catch (error) {
    return res.status(500).send(error);
  }
};

/**
 * Update A User to Admin
 * @param {object} req
 * @param {object} res
 * @returns {object} updated user
 */
const updateBookingSeat = async (req, res) => {
  const { bookingId } = req.params;
  const { seat_number } = req.body;

  const { user_id } = req.user;

  if (empty(seat_number)) {
    return res.status(400).send("Seat Number is needed");
  }
  const findBookingQuery = "SELECT * FROM booking WHERE id=$1";
  const updateBooking = `UPDATE booking
          SET seat_number=$1 WHERE user_id=$2 AND id=$3 returning *`;
  try {
    const { rows } = await dbQuery.query(findBookingQuery, [bookingId]);
    const dbResponse = rows[0];
    if (!dbResponse) {
      return res.status(404).send("Booking Cannot be found");
    }
    const values = [seat_number, user_id, bookingId];
    const response = await dbQuery.query(updateBooking, values);
    const dbResult = response.rows[0];

    return res.status(200).send(dbResult);
  } catch (error) {
    if (error.routine === "_bt_check_unique") {
      errorMessage.error = "Seat Number is taken already";
      return res.status(400).send(errorMessage);
    }
    errorMessage.error = "Operation was not successful";
    return res.status(500).send("Operation was not successful");
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  deleteBooking,
  updateBookingSeat,
};
