const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid!!!");
        }
      }
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes("password"))
          throw Error(
            'Password must not contain any case variant of the word "password"!!!'
          );
      }
    },
    age: {
      type: Number,
      default: 18,
      validate(value) {
        if (value < 0) throw new Error("Age must be a positive number!!!");
      }
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ],
    avatar: {
      type: Buffer
    }
  },
  {
    timestamps: true
  }
);

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner"
});

userSchema.methods.generateAuthToken = async function() {
  const token = jwt.sign(
    {
      _id: this._id.toString()
    },
    "verysecure"
  );
  this.tokens = this.tokens.concat({ token });
  this.save();
  return token;
};

userSchema.methods.toJSON = function() {
  const userObject = this.toObject();

  ["avatar", "password", "tokens"].forEach((field) => delete userObject[field]);
  return userObject;
};

userSchema.statics.findByCredentials = async ({ email, password }) => {
  const user = await User.findOne({ email });
  console.log(user);
  if (!user) throw new Error("Login failed1!!!");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Login failed2!!!");

  return user;
};

userSchema.pre("save", async function(next) {
  console.log("inside userSchema.pre...");
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
    console.log("after password hashing...");
  }
  next();
});

userSchema.pre("remove", async function(next) {
  await Task.deleteMany({
    owner: this._id
  });
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
