const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/tasks", auth, async (req, res) => {
  console.log(req.body);
  //const task = new Task(req.body);
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};

  const { completed, sortBy } = req.query;
  let { limit, offset } = req.query;

  limit = isNaN(parseInt(limit)) ? 2 : parseInt(limit);
  offset = isNaN(parseInt(offset)) ? 0 : limit * parseInt(offset);

  if (completed) {
    match.completed = completed === "true";
  }

  if (sortBy) {
    const part = sortBy.split(":");
    sort[part[0]] = part[1] === "desc" ? -1 : 1;
    console.log(sort);
  }

  try {
    //            const tasks = await Task.find(
    //                {
    //                    owner: req.user._id
    //                }
    //            );
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit,
          offset,
          sort
        }
      })
      .execPopulate();

    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  console.log(req.params);
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });
    if (!task) return res.status(404).send({});
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid updates!!!" });

  try {
    //            const task = await Task.findByIdAndUpdate(
    //                _id,
    //                req.body,
    //                {
    //                    new: true,
    //                    runValidators: true
    //                }
    //            );
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });
    if (!task) return res.status(404).send({});
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });
    if (!task) return res.status(404).send({});
    await task.remove();
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
