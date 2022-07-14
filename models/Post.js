import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    text: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    //be liked by other users
    likes: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
          }
        }
    ],
    comments: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
          },
          text: {
            type: String,
            required: true
          },
          name: {
            type: String
          },
          avatar: {
            type: String
          },
          date: {
            type: Date,
            default: Date.now
          }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

const Post = mongoose.model("post", postSchema);

export default Post;