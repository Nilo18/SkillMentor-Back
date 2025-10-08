function ping(req, res, next) {
    try {
        return res.status(200).send('Wake up.')
    } catch (err) {
        console.log("Couldn't ping the server: ", err)
    }
}

module.exports = ping