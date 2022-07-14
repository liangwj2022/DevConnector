import dotenv from "dotenv";
dotenv.config();
import express from "express";
import auth from "../../middleware/auth.js";
import Profile from "../../models/Profile.js";
import User from "../../models/User.js";
import Post from "../../models/Post.js";
import axios from "axios";
import { check, validationResult } from "express-validator";

const router = express.Router();

// @route GET api/profile
// @desc  Test route
// @access Public
//router.get("/", (req,res) => res.send("Profile route"));

// @route GET api/profile/me
// @desc  Get current user profile
// @access Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      return res.status(400).json({ msg: "No profile" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// @route POST api/profile
// @desc  create/update user profile
// @access Private
router.post(
  "/",
  [
    auth,
    [
      check("status", "status is required").not().isEmpty(),
      check("skills", "skills are required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    //Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }
    //Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      //Update //new:true -- set the new option to true to return the document after update was applied.
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      } else {
        //create
        profile = new Profile(profileFields);
        await profile.save();
        return res.json(profile);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

// @route GET api/profile
// @desc  Get all user profile
// @access Public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route GET api/profile/user/:user_id
// @desc  Get user profile by user_id
// @access Public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "profile not found" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "profile not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route DELETE api/profile/
// @desc  Delete profile, user and posts
// @access Private

router.delete("/", auth, async (req, res) => {
  try {
    //Remove posts
    await Post.deleteMany({ user: req.user.id });
    //Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //Remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "User Deleled" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, company, location, from, to, current, description } =
      req.body;
    const newExp = { title, company, location, from, to, current, description };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    //Get remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private

router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required").not().isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
      check("fieldofstudy", "Field of study is required").not().isEmpty(),
      check("from", "From date is required and needs to be from the past")
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    //Get remove index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();
    return res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public

router.get("/github/:username", async (req, res) => {
  try {
    const uri = encodeURI(
      `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
    );
    const headers = {
      "user-agent": "node.js",
      Authorization: `token ${process.env.REACT_APP_GITHUBTOKEN}`,
    };
    const gitHubResponse = await axios.get(uri, { headers: headers });
    return res.json(gitHubResponse.data);
  } catch (err) {
    console.error(err);
    return res.status(404).json({ msg: "No Github profile found" });
  }
});

export { router };
