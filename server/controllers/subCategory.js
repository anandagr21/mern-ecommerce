const SubCategory = require("../models/subCategory");
const Product = require("../models/product");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const subCategory = await new SubCategory({
      name: name,
      parent: parent,
      slug: slugify(name),
    }).save();
    res.json(subCategory);
  } catch (error) {
    console.log(error);
    res.status(400).send("Create sub category failed");
  }
};

exports.list = async (req, res) => {
  const subCategory = await SubCategory.find({}).sort({ createdAt: -1 }).exec();
  res.json(subCategory);
};

exports.read = async (req, res) => {
  let subCategory = await SubCategory.findOne({ slug: req.params.slug }).exec();
  const products = await Product.find({ subs: subCategory }).populate("category").exec()
  res.json({ subCategory, products });
};

exports.update = async (req, res) => {
  const { name, parent } = req.body;
  try {
    const updated = await SubCategory.findOneAndUpdate(
      { slug: req.params.slug },
      { name: name, parent, slug: slugify(name) },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    console.log(error);
    res.status(400).send("Update sub category failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await SubCategory.findOneAndDelete({
      slug: req.params.slug,
    });
    res.json(deleted);
  } catch (error) {
    console.log(error);
    res.status(400).send("Delete sub category failed");
  }
};
