const express = require('express')
const router = express.Router()
const accounts = require('../models/accounts')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')



//@route POST api/auth/register
//@desc Register User
//@access public
router.post('/api/auth/register', async(req, res) => {
    const { username, password, person_code, role } = req.body
        // Missing username or password
    if (!username || !password || !person_code || !role) {
        return res
            .status(400)
            .json({ success: false, msg: "Some fields are undefined. Try again." })
    }
    try {
        const user = await User.findOne({ username })
        if (user) {
            return res
                .status(400)
                .json({ success: false, msg: "Username already exists" })
        }
        //Hash password
        const hashedPassword = await argon2.hash(password)
        const newUser = new User({ username, password: hashedPassword })
        await newUser.save()


        const accessToken = jwt.sign({ userId: newUser._id }, process.env.ACCESS_TOKEN_SECRET)
        res.json({
            success: true,
            msg: "User Created",
            accessToken
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})


//@route POST api/auth/login
//@desc Login
//@access public

router.post('/api/auth/login', async(req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res
            .status(400)
            .json({ success: false, msg: "Missing username and/or password" })
    }
    try {
        //Check existing user
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(400).json({ success: false, msg: "Incorrect username or password" })
        }

        //Username found
        const passwordValid = await argon2.verify(user.password, password)
        if (!passwordValid) {
            return res.status(400).json({ success: false, msg: "Incorrect username or password" })
        } else {
            const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET)
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