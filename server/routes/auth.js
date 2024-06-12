const express = require('express')
const router = express.Router()
const accounts = require('../models/accounts')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

//Login
//Access public
router.post('/api/auth/login', async(req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res
            .status(400)
            .json({ success: false, msg: "Missing username and/or password" })
    }
    try {
        //Check existing user
        const account = await accounts.findOne({ username })
        if (!account) {
            return res
                .status(400)
                .json({ success: false, msg: "Incorrect username or password" })
        }

        //Username found
        const passwordValid = await argon2.verify(account.password, password)
        if (!passwordValid) {
            return res.status(400).json({ success: false, msg: "Incorrect username or password" })
        } else {
            const accessToken = jwt.sign({ userId: account._id }, process.env.ACCESS_TOKEN_SECRET)
            res.json({
                success: true,
                msg: "Login succesfully!",
                accessToken
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})


module.exports = router