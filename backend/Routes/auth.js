const router = require("express").Router();
const User = require("../Models/User.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const { cloudinary } = require('../utils/cloudinary.js');
const jwtSecret = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            res.status(201).json("Sorry, Email id already exist")
        }
        const salt = await bcrypt.genSalt(11);
        const hashedpassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            "username": req.body.username,
            "email": req.body.email,
            "password": hashedpassword,
        });

        if (req.files.profilePic) {
            const result = await cloudinary.uploader.upload(req.files["profilePic"].path);
            newUser.profilePic = result.url
            newUser.cloudinary_id = result.public_id
        }
        const user_callback = await newUser.save();
        res.status(200).json(user_callback)
    } catch (error) {
        res.status(500).json(error)
    }
}
)


// login

router.post("/login",
    async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            !user && res.status(400).json("Sorry. Wrong email or password");

            const isMatch = await bcrypt.compare(req.body.password, user.password);
            !isMatch && res.status(400).json("Sorry. Wrong email or password");

            const payload = {
                id: user.id
            }
            await jwt
                .sign(
                    payload,
                    jwtSecret,
                    (err, jsonwebtoken) => {
                        res.status(200).json({ user, jsonwebtoken })

                    }
                )
        } catch (err) {
            res.status(500).json(err);

        }
    }
)

module.exports = router;