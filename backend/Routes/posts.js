const router = require("express").Router();
const Post = require("../Models/Post.js");
const cloudinary = require('cloudinary').v2;
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



//create

router.post("/add",
    passport.authenticate('jwt', { session: false }),

    async (req, res) => {

        if (req.user.username === req.body.username) {

            // console.log(req.body.desc)
            try {
                const newPost = new Post({
                    "title": req.body.title,
                    "desc": req.body.desc,
                    "username": req.body.username,
                    "author": req.body.author,
                });

                const theFiles = Object.values(req.files);
                if (theFiles.length > 0) {
                    await cloudinary.uploader.upload(
                        theFiles[0].path,
                        (cloudinaryErr, cloudinaryResult) => {
                            if (cloudinaryErr) {
                                console.log(cloudinaryErr)
                            }
                            else {
                                newPost.photo = cloudinaryResult.url
                            }
                        }
                    )
                }
                const post = await newPost.save();
                res.status(200).json(post);
                // console.log(newPost) 
            }
            catch (err) {
                res.status(500).json(err);
            }
        } else { res.status(400).json("Unauthorised user.") }
    }
)












//update

router.put("/:id",
    passport.authenticate('jwt', { session: false }),

    async (req, res) => {

        try {
            const post = await Post.findById(req.params.id);
            if (post.username === req.body.username) {

                try {
                    const updatedPost = await Post.findByIdAndUpdate(req.params.id,
                        { $set: req.body },
                        { new: true }
                    );
                    res.status(200).json(updatedPost);

                } catch (err) {
                    res.status(500).json(err);
                }

            }
            else {
                res.status(401).json("You can update only your post ");
            }
        } catch (err) {
            res.status(501).json(err);
        }


    });


//delete

router.delete("/:id",
    passport.authenticate('jwt', { session: false }),

    async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            if (post.username === req.body.username) {
                // console.log(post)
                // console.log(post.username)
                // console.log(req.body.username, "2")
                try {
                    await post.delete();
                    res.status(200).json("Deleted!!!");
                } catch (err) {
                    res.status(500).json(err);
                }
            } else {
                res.status(401).json("You only can delete your post");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    }
);



// Get Post

router.get("/:id",
    async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);

            res.status(200).json(post);
        } catch (err) {
            res.status(500).json(err);
        }


    })



// Get All Posts by searching

router.get("/",
    async (req, res) => {
        const username = req.query.user;
        const catname = req.query.cat;

        try {
            let posts;
            if (username) {
                posts = await Post.find({ username });
            }

            else {
                posts = await Post.find();

                res.status(200).json(posts);
            }
        } catch (err) {
            res.status(500).json(err);
        }
    })







module.exports = router;