const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: Number,
  // products:{
  //   type: Schema.Types.ObjectId,
  //   ref: "Product",
  //   required: true,
  // }
});

module.exports = model("User", userSchema);
