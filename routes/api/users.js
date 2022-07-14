import dotenv from "dotenv";
dotenv.config();
import express from "express";
import {check, validationResult} from "express-validator";
import gravatar from "gravatar";
import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();


// @route GET api/users
// @desc  Test route
// @access Public
router.get("/", (req,res) => res.send("Users route"));

// @route POST api/users
// @desc  Register users
// @access Public
router.post("/", [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please enter a password with 6 or more characters").isLength({min:6})
], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const { name, email, password } = req.body;

    try {
        //See if user exists
        let userExisted = await User.findOne({email:email});

        if(userExisted){
            return res.status(400).json({errors:[{msg:"User already exists"}]});
        }
        //Get user avatar
        const avatar = gravatar.url(email, {
            s:"200",
            r:"pg",
            d:"mm"
        });

        let user = new User({
            name: name,
            email: email,
            avatar: avatar,
            password: password
        });

        //Encrypt password
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();
        //Return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        };
        jwt.sign(payload, process.env.REACT_APP_JWTSECRET,
        {expiresIn:360000}, 
        (err,token) => {
            if(err) throw err;
            res.json({token});
        });

        //res.send("Users registed!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
    
});

export {router};
