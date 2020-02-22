const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");

const router = express.Router();

const upload = multer({
  //dest: 'avatars',
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/.(jpe?g|png)$/)) {
      return cb(new Error("Please upload a .jp(e)g or .png file!!!"));
    }
    cb(undefined, true);
  }
});

//const errorMiddleware = (req, res, next) => {
//    throw new Error('Some error...');
//};

router.post(
  "/users/me/avatar",
  auth,
  //errorMiddleware,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

    req.user.avatar = buffer;
    // req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send({});
  },
  (error, req, res, next) => {
    res.status(400).send({
      error: error.message
    });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  try {
    await req.user.save();
    res.send({});
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get(
  "/users/:id/avatar",
  //auth,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user || !user.avatar) throw new Error();

      res.set("Content-Type", "image/png");
      res.send(user.avatar);
    } catch (error) {
      res.status(404).send(error);
    }
  }
);

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send({
      user: req.user,
      token: req.user.tokens
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send({
      user: req.user,
      token: req.user.tokens
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/users", async (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/users/me", auth, async (req, res) => {
  try {
    console.log("this user:", req.user._id);
    console.log("this token:", req.token);
    const user = await User.findById(req.user._id);
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/users/me", auth, async (req, res) => {
  const allowedUpdates = ["name", "email", "password", "age"];
  const updates = Object.keys(req.body);

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation)
    return res.status(400).send({
      error: "Invalid updates!!!"
    });

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    console.log("ready to save updates...");
    await req.user.save();
    console.log("just saved updates...");
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
