exports.getUsers = (req, res, next) => {
    res.json({
        users: [
            {
                name: 'tarun',
                email: 'tarun@gmail.com'
            }
        ],
        total: 1
    })
}