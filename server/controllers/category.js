const Category = require("../models/category");
const Product = require("../models/product");
const Sub = require("../models/subCategory");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await new Category({
      name: name,
      slug: slugify(name),
    }).save();
    res.json(category);
  } catch (error) {
    console.log(error);
    res.status(400).send("Create category failed");
  }
};

exports.list = async (req, res) => {
  const category = await Category.find({}).sort({ createdAt: -1 }).exec();
  res.json(category);
};

exports.read = async (req, res) => {
  let category = await Category.findOne({ slug: req.params.slug }).exec();
  // res.json(category);
  const products = await Product.find({ category: category }).populate('category').exec()

  res.json({ category, products })
};

exports.update = async (req, res) => {
  const { name } = req.body;
  try {
    const updated = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name: name, slug: slugify(name) },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    console.log(error);
    res.status(400).send("Update category failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);
  } catch (error) {
    console.log(error);
    res.status(400).send("Delete category failed");
  }
};

exports.getSubs = async (req, res) => {
  Sub.find({ parent: req.params._id }).then((subs, err) => {
    if (err) {
      console.log(err);
    }

    res.json(subs);
  });
};
