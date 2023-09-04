const router = require("express").Router();
const passport = require("passport");
const stories = require("../models/stories");
const { checkAuthentication } = require("../middlewares/auth")
router.get("/add", checkAuthentication, (req, res) => {
    const errs = [];
    res.render("addStory", {
        layout: "dashboard",
        errs: errs,
        image: req.user.user_img,
        name: req.user.displayName,
    })
})
router.get("/", checkAuthentication, async(req, res) => {
    const publicStories = await stories.find({ status: "public" }).populate('user').sort({ createdAt: 'desc' }).lean();
    console.log(publicStories[0])
    res.render("publicStories", {
        layout: "dashboard",
        currentuser: req.user,
        image: req.user.user_img,
        name: req.user.displayName,
        stories: publicStories,
    })
})
router.get("/mine", checkAuthentication, async(req, res) => {
    const storiesall = await stories.find({ user: req.user.id });
    if (storiesall.length > 0) {
        res.render("myStories", {
            layout: "dashboard",
            image: req.user.user_img,
            name: req.user.displayName,
            stories: storiesall
        })
    } else {
        res.render("nostories", {
            layout: "dashboard",
            image: req.user.user_img,
            name: req.user.displayName,
        })
    }

})
router.get("/edit/:id", checkAuthentication, async(req, res) => {
    const errs = [];
    const story = await stories.findById(req.params.id);
    res.render("editStories", {
        layout: "dashboard",
        image: req.user.user_img,
        name: req.user.displayName,
        story: story,
        errs: errs
    })
})
router.get("/delete/:id", checkAuthentication, async(req, res) => {
    const story = await stories.findByIdAndRemove(req.params.id);
    res.redirect("/stories/mine");
})
router.post("/edit/:id", checkAuthentication, async(req, res) => {
    const errs = [];
    const { tittle, body, status } = req.body;
    if (tittle == "" || body == "" || status == "") {
        errs.push("All fields are required !!");
        const story = await stories.findById(req.params.id);
        res.render("editStories", {
            layout: "dashboard",
            image: req.user.user_img,
            name: req.user.displayName,
            story: story,
            errs: errs
        })
    }
    try {
        req.body.user = req.user.id;
        const story = await stories.findByIdAndUpdate(req.params.id, req.body);
        res.redirect("/stories/mine");
    } catch (err) {
        console.error(err)
    }

})
router.get("/:id", checkAuthentication, async(req, res) => {
    try {
        const story = await stories.findById(req.params.id);
        res.render("eachStory", {
            layout: "dashboard",
            image: req.user.user_img,
            name: req.user.displayName,
            story: story
        })
    } catch (err) {
        console.error(err)
    }

})
router.post("/add", checkAuthentication, async(req, res) => {
    const errs = [];
    const { tittle, body, status } = req.body;
    if (tittle == "" || body == "" || status == "") {
        errs.push("All fields are required !!");
        return res.render("addStory", {
            layout: "dashboard",
            image: req.user.user_img,
            name: req.user.displayName,
            errs: errs
        })
    }
    try {
        const user = await stories.findOne({ tittle: tittle })
        if (user) {
            errs.push("This Tittle is already in use");
            return res.render("addStory", {
                layout: "dashboard",
                image: req.user.user_img,
                name: req.user.displayName,
                errs: errs
            })
        } else {
            const story = new stories({
                tittle: tittle,
                status: status,
                body: body,
                user: req.user.id
            })
            stories.create(story);
            res.redirect("/stories/mine");

        }
    } catch (err) {
        console.error(err)
    }

})
module.exports = router