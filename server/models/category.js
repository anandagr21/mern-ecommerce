const moongoose = require("mongoose");
const { ObjectId } = moongoose.Schema;

const categorySchema = new moongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Category name is required",
      minlength: [2, "Too short"],
      maxlength: [32, "Too long"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = moongoose.model("Category", categorySchema);
