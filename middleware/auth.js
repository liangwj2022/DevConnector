import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";


function auth(req,res,next){
    //Get token from header
    const token = req.header("x-auth-token");

    //check if no token
    if(!token){
        return res.status(401).json({msg: "no token, authorization denied"});
    }

    //Verify token
    try {
        const decoded = jwt.verify(token, process.env.REACT_APP_JWTSECRET);

        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({msg: "token not valid"});
    }
}

export default auth;