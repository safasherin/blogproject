const router = require("express").Router();
const User = require("../Models/User.js");
const bcrypt = require("bcrypt");
const Post = require("../Models/Post.js");
const { cloudinary } = require('../utils/cloudinary.js');
require('dotenv').config();

// Import passport for authentication
const passport = require('passport');
// Import for JWT strategy
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwtSecret = process.env.JWT_SECRET;
const passportJwtConfig = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret
}
const passportJwt = async (passport) => {
    await passport.use(
        new JwtStrategy(
            passportJwtConfig,
            (jwt_payload, done) => {
                User.findById({ _id: jwt_payload.id },
                    (err, user) => {
                        if (err) {
                            return done(err, false);
                        }
                        if (user) {
                            return done(null, user);
                        } else {
                            return done(null, false);
                        }
                    }
                );
                // console.log(jwt_payload)
            }
        )
    )
}
passportJwt(passport);


//update

router.put("/:id",
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        try {
            if (req.body.userId === req.params.id) {
                // console.log(req.body)
                let user = await User.findById(req.params.id);
                // console.log(1)
                let updateUserInfo = {}
                // console.log(req.body)
                if (req.body.password) {
                    const salt = await bcrypt.genSalt(10);
                    const updatedPassword = await bcrypt.hash(req.body.password, salt);
                    updateUserInfo.password = updatedPassword
                    // console.log(1, updateUserInfo)
                }
                if (req.body.username) {
                    updateUserInfo.username = req.body.username
                    // console.log(2, updateUserInfo)
                }
                // console.log(6, req.files)
                if (req.files.profilePic) {
                    // console.log("here 1")
                    // console.log(user)
                    if (user.cloudinary_id) {
                        await cloudinary.uploader.destroy(user.cloudinary_id);
                    }

                    // console.log("here 2")
                    const result = await cloudinary.uploader.upload(req.files["profilePic"].path);
                    // console.log(4, result)
                    updateUserInfo.profilePic = result.url
                    updateUserInfo.cloudinary_id = result.public_id
                    // console.log(3, updateUserInfo)

                }
                // console.log(5)
                const updatedUser = await User.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: updateUserInfo,
                    },
                    { new: true }
                    //to see the updatedUser in postman
                );
                // console.log(updatedUser)
                res.status(200).json(updatedUser);

            } else {
                res.status(201).json("You can only update your own account!!")
            }

        } catch (error) {
            res.status(501).json(error)
        }


    }
)



//delete

router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        if (req.body.userId === req.params.id) {

            const user = await User.findById(req.params.id);
            await Post.deleteMany({ username: user.username })
                .then(() => {
                    // res.status(200).json("Posts Deleted!!!");
                    User
                        .findByIdAndDelete(req.params.id)
                        .then(() => {
                            res.status(200).json("Delete success!!")
                        })
                        .catch((error) => {
                            res.status(500).json("error deleting user", error)
                        }
                        )
                })
                .catch((error) => {
                    res.status(500).json("error deleting post", error)
                })
        } else {
            res.status(401).json("You only can delete your account");
        }
    }
);


//searchUser

router.post("/search-user", async (req, res) => {
    try {
        let userPattern = new RegExp("^" + req.body.query)
        User.find({ username: { $regex: userPattern } })
        const { password, ...others } = user._doc;
        res.status(200).json(others)
    }
    catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;