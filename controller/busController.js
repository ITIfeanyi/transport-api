const moment = require("moment");
const dbQuery = require("../db_config/dev/dbQuery");

/**
 * Add A Bus
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */

const addBusDetails = async (req, res) => {
  const { number_plate, manufacture, model, year, capacity } = req.body;
  const created_on = moment(new Date());
  const createBusQuery = `INSERT INTO
          bus(number_plate, manufacturer, model, year, capacity, created_on)
          VALUES($1, $2, $3, $4, $5, $6)
          returning *`;
  const values = [
    number_plate,
    manufacturer,
    model,
    year,
    capacity,
    created_on,
  ];

  try {
    const { rows } = await dbQuery.query(createBusQuery, values);
    const dbResponse = rows[0];

    return res.status(201).send(dbResponse);
  } catch (error) {
    return res.status(400).send("Unable to add bus");
  }
};

/**
 * Get All Buses
 * @param {object} req
 * @param {object} res
 * @returns {object} buses array
 */

const getAllBuses = async (req, res) => {
  const getAllBusQuery = "SELECT * FROM bus ORDER BY id DESC";
  try {
    const { rows } = await dbQuery.query(getAllBusQuery);
    const dbResponse = rows;
    if (dbResponse[0] === undefined) {
      return res.status(404).send("There are no buses");
    }
    return res.status(200).send(dbResponse);
  } catch (error) {
    return res.status(500).send("An error Occured");
  }
};

module.exports = {
  addBusDetails,
  getAllBuses,
};
