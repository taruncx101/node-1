exports.getUsers = (req, res, next) => {
    res.status(200)
        .json({
        users: [
            {
                name: 'tarun',
                email: 'tarun@gmail.com'
            }
        ],
        total: 1
    })
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