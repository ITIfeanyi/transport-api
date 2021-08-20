const verifyToken = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(400).send("Token not provided");
  }

  try {
    const decoded = jwt.verify(token, "jesu");
    req.user = {
      email: decoded.email,
      user_id: decoded.user_id,
      is_admin: decoded.is_admin,
      first_name: decoded.first_name,
      last_name: decoded.last_name,
    };
    next();
  } catch (error) {
    return res.status(400).send("Authentication Failed");
  }
};

module.exports = verifyToken;
