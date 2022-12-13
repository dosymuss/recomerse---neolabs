const express = require("express");
const mongoose = require("mongoose");
const app = express();
const User = require("./models/user");
const bcrypt = require("bcrypt");
const usersRoutes = require("./routes/usersRoute");
const productsRoutes = require("./routes/productsRoute");
const cartRoutes = require("./routes/cartRoutes")
const { body, validationResult } = require("express-validator");

app.use(express.json());

// applying MongoDB
app.use("/users", usersRoutes);
app.use("/products", productsRoutes);
app.use("/carts", cartRoutes)
//-- Register method
app.post(
  "/register",
  body("email").isEmail().withMessage("Wrong format of email"),
  body("password")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must contain min 8, max 16 characters"),
  body("name").trim().notEmpty().withMessage("This field is cannot be empty"),
  async (req, res) => {
    try {
      //Destructuring method
      const { email, password, age, name } = req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json({ errors: errors.array() });
      }

      const candidate = await User.findOne({ email });

      if (candidate) {
        return res
          .status(400)
          .json({ message: "User with such email already exists" });
      }
      const hashPassword = bcrypt.hashSync(password, 10);

      // Method with "creating new instance"
      // const user = new User({
      // email: req.body.email,
      // password: req.body.password,
      // age: req.body.age,
      // })
      const user = new User({
        email,
        age,
        name,
        password: hashPassword,
      });

      await user.save();

      res.json({ message: "You have successfully registered" });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ message: "Something went wrong. Try again" });
    }
  }
);

//-- Login method
app.post(
  "/login",
  body("email").trim().notEmpty(),
  body("password").trim().notEmpty(),
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json({ errors: errors.array() });
      }

      const candidate = await User.findOne({ email });

      if (!candidate) {
        return res.status(400).json({ message: "Wrong email or password" });
      }

      const isSamePass = bcrypt.compareSync(password, candidate.password);

      if (!isSamePass) {
        return res.status(400).json({ message: "Wrong email or password" });
      }
      return res.json(candidate);
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ message: "Something went wrong. Try again" });
    }
  }
);

//--Delete Method
// app.delete("/users/:userid", (req, res) => {
//   const data = fs.readFileSync(__dirname + "/users.json", {
//     encoding: "utf-8",
//   });
//   const users = JSON.parse(data);
//   const { id } = req.params;
//   let filteredUser = users.filter((item) => {
//     item.id !== +id;
//   });
//   const newData = JSON.stringify(filteredUser, undefined, 2);
//   res.json(filteredUser);
// });

const init = async () => {
  const MONGO_URL =
  "mongodb+srv://dastan:sZscX0PNP2h71wl9@cluster0.vl86hch.mongodb.net/?retryWrites=true&w=majority";
  await mongoose.connect(MONGO_URL);

  app.listen(3000, () => {
    console.log("SERVER HAS BEEN STARTED ON 3000");
  });
};

init();
