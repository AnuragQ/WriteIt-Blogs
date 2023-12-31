const express = require("express");
const BlogPost = require("../models/BlogPost");
const router = express.Router();

router.get("/signup", (req, res) => {
    res.render("auth/signup");
})

router.get("/login", (req, res) => {
    res.render("auth/login");
})

module.exports = router;
