const jwt = require ('jsonwebtoken')

function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
        return res.status(401).send("No token provided.")
    }

    jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err) {
            console.log("Error during JWT authentication: " + err)
            return res.status(401).send("Invalid token format.")
        }

        next()
    })
}

module.exports = authenticate