const User = require("../models/user");

//using the async await
exports.getUsers = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const limit = 5;
  const offset = limit*(currentPage - 1);
  try{
    const result = await User.findAndCountAll({
        limit,
        offset,
    });
    res.json(result);
  }
  catch(err) {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
  }
}

exports.createUser = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    res.status(201)
        .json({
            message: "User created successfully",
            user: {
                id: 1,
                name,
                email,
            },
    });
}