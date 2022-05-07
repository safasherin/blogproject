const express = require("express");
const cors = require('cors');

const app = express();
const dotenv = require("dotenv");
require('dotenv').config(); const mongoose = require("mongoose");
const expressFormData = require('express-form-data');
const authroute = require("./Routes/auth.js");
const usersroute = require("./Routes/users.js");
const postsroute = require("./Routes/posts.js");

const User = require('./Models/User.js');
dotenv.config();

// Import passport for authentication
const passport = require('passport');


// Configure express to read body in HTTP
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Also tell express to read HTTP form data
app.use(expressFormData.parse());
app.use(cors());


// Import for JWT strategy
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const fileUpload = require('express-fileupload');

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

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
}
)
    .then(
        console.log("Connected to mongo")
    )
    .catch((err) =>
        console.log(err));

app.use("/auth",
    authroute);
app.use("/users",
    usersroute);
app.use("/posts", postsroute);

app.use(fileUpload())
passportJwt(passport)

app.listen(
    process.env.PORT || 3005, () => {
        console.log("Connected to localhost: 3005");
    }
)