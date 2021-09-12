const moongoose = require("mongoose");
const { ObjectId } = moongoose.Schema;

const subCategorySchema = new moongoose.Schema({
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
  parent: {
    type: ObjectId,
    ref: "Category",
    required: true,
  },
},
  { timestamps: true }
);

module.exports = moongoose.model("SubCategory", subCategorySchema);
