const Category = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };

      const categories = await Category.find();

      res.render("admin/category/view_category", {
        categories,
        alert,
        username: req.session.user.username,
        title: "Halaman Kategori",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
      console.log("🚀 ~ index: ~ err:", err);
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render("admin/category/create", {
        username: req.session.user.username,
        title: "Halaman Tambah Kategori",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
      console.log("🚀 ~ viewCreate: ~ err:", err);
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { name } = req.body;

      let category = await Category({ name });
      await category.save();

      req.flash("alertMessage", "Berhasil tambah kategori.");
      req.flash("alertStatus", "success");

      res.redirect("/category");
    } catch (error) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
      console.log("🚀 ~ actionCreate: ~ error:", error);
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findOne({ _id: id });

      res.render(`admin/category/edit`, {
        category,
        username: req.session.user.username,
        title: "Halaman Ubah Kategori",
      });
    } catch (error) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
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

      req.flash("alertMessage", "Berhasil ubah kategori.");
      req.flash("alertStatus", "success");

      res.redirect("/category");
    } catch (error) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
      console.log("🚀 ~ actionEdit: ~ error:", error);
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      await Category.findOneAndDelete({
        _id: id,
      });

      req.flash("alertMessage", "Berhasil hapus kategori.");
      req.flash("alertStatus", "success");

      res.redirect("/category");
    } catch (error) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
      console.log("🚀 ~ actionDelete: ~ error:", error);
    }
  },
};
