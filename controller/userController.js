const moment = require("moment");
const dbQuery = require("../db_config/dev/dbQuery");

/**
 * Create A User
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */

const createUser = async (req, res) => {
  const { email, first_name, last_name, password } = req.body;

  const created_on = moment(new Date());
  const createUserQuery = `INSERT INTO
      users(email, first_name, last_name, password, created_on)
      VALUES($1, $2, $3, $4, $5)
      returning *`;
  const values = [email, first_name, last_name, password, created_on];

  try {
    const { rows } = await dbQuery.query(createUserQuery, values);
    const dbResponse = rows[0];
    return res.status(201).send(dbResponse);
  } catch (error) {
    return res.status(500).send("Operation was not successful");
  }
};

/**
 * Signin
 * @param {object} req
 * @param {object} res
 * @returns {object} user object
 */

const siginUser = async (req, res) => {
  const { email, password } = req.body;

  const signinUserQuery = "SELECT * FROM users WHERE email = $1";
  try {
    const { rows } = await dbQuery.query(signinUserQuery, [email]);
    const dbResponse = rows[0];
    if (!dbResponse) {
      errorMessage.error = "User with this email does not exist";
      return res.status(404).send("User with this email does not exist");
    }
    if (!comparePassword(dbResponse.password, password)) {
      return res.status(400).send("The password you provided is incorrect");
    }
    return res.status(200).send(dbResponse);
  } catch (error) {
    return res.status(500).send("Operation was not successful");
  }
};

module.exports = {
  createUser,
  siginUser,
};
