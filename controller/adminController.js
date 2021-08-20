const moment = require("moment");
const dbQuery = require("../db_config/dev/dbQuery");

const createAdmin = async (req, res) => {
  const { email, first_name, last_name, password } = req.body;
  const { is_admin } = req.user;
  const isAdmin = true;
  const created_on = moment(new Date());
  console.log(created_on);
  if (!is_admin === false) {
    return res
      .status(400)
      .send("Sorry You are unauthorized to make a user an admin");
  }
  const createUserQuery = `INSERT INTO users(
      email, first_name, last_name, password, is_admin,created_on)
      VALUES($1, $2, $3, $4, $5, $6) returning *`;
  const values = [email, first_name, last_name, password, isAdmin, created_on];
  try {
    const { rows } = await dbQuery.query(createUserQuery, values);
    const dbResponse = rows[0];
    return res.status(200).json(dbResponse);
  } catch (error) {
    res.status(500).json(error);
  }
};

/**
 * Update A User to Admin
 * @param {object} req
 * @param {object} res
 * @returns {object} updated user
 */

const updateUserAdmin = async (req, res) => {
  const { id } = req.params;
  const { isAdmin } = req.body;
  const { is_admin } = req.user;
  if (!is_admin === true) {
    return res
      .status(400)
      .json("Sorry You are unauthorized to make a user an admin");
  }
  if (isAdmin === "") {
    return res.status(400).send("Admin Status is needed");
  }
  const findUserQuery = "SELECT * FROM users WHERE id=$1";
  const updateUser = "UPDATE users SET is_admin=$1 WHERE id=$2";

  try {
    const { rows } = await dbQuery.query(findUserQuery, [id]);
    const dbResponse = rows[0];
    if (!dbResponse) {
      return res.status(404).send("User Cannot be found");
    }
    const values = [isAdmin, id];
    const response = await dbQuery.query(updateUser, values);
    const dbResult = response.rows[0];
    return res.status(200).send(dbResult);
  } catch (error) {
    return res.status(500).send("Operation was not successful");
  }
};

module.exports = {
  createAdmin,
  updateUserAdmin,
};
