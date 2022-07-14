import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/db.js";
import path from "path";
import {router as usersRouter} from "./routes/api/users.js";
import {router as postsRouter} from "./routes/api/posts.js";
import {router as profileRouter} from "./routes/api/profile.js";
import {router as authRouter} from "./routes/api/auth.js";

const app = express();

//Connect database
connectDB();

//Initial middleware: we can use req.body now without importing bodyparser
app.use(express.json());

//Define routes
app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);
app.use("/api/profile", profileRouter);
app.use("/api/auth", authRouter);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));
  
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server started on port " + PORT));
