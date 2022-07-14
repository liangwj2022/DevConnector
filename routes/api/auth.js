import dotenv from "dotenv";
dotenv.config();
import express from "express";
import auth from "../../middleware/auth.js";
import User from "../../models/User.js";
import {check, validationResult} from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

// @route GET api/auth
// @desc  Test route
// @access Public
router.get("/", auth, async (req,res) => {
    try {
        //no password displayed
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// @route POST api/auth
// @desc  Authenticate user and get token
// @access Public
router.post("/", [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists()
], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const { email, password } = req.body;

    try {
        //See if user exists
        let user = await User.findOne({email:email});

        if(!user){
            return res.status(400).json({errors:[{msg:"Invalid credentials"}]});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({errors:[{msg:"Invalid credentials"}]});
        }

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

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
    
});


export {router};