const Category = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const categories = await Category.find();

      res.render("admin/category/view_category", { categories });
    } catch (err) {
      console.log("🚀 ~ index: ~ err:", err);
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render("admin/category/create");
    } catch (err) {
      console.log("🚀 ~ viewCreate: ~ err:", err);
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { name } = req.body;

      let category = await Category({ name });
      await category.save();

      res.redirect("/category");
    } catch (error) {
      console.log("🚀 ~ actionCreate: ~ error:", error);
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findOne({ _id: id });

      res.render(`admin/category/edit`, { category });
    } catch (error) {
      console.log("🚀 ~ viewEdit: ~ error:", error);
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      await Category.findOneAndUpdate(
        {
          _id: id,
        },
        { name }
      );

      res.redirect("/category");
    } catch (error) {
      console.log("🚀 ~ actionEdit: ~ error:", error);
    }
  },
};
