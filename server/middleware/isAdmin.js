const accounts = require("../models/accounts")

const isAdmin = async(req, res, next) => {
    const account = await accounts.findOne({ _id: req.userId })
    const role = account.role
    if (role !== "AD") {
        return res
            .status(403)
            .json({ success: true, msg: "User not authorised" })
    }
    next()
}

module.exports = isAdmin