const Nominal = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };

      const nominal = await Nominal.find({
        coinName: { $not: { $regex: /_/ } },
      });

      res.render("admin/nominal/view_nominal", {
        nominal,
        alert,
        username: req.session.user.username,
        title: "Halaman Nominal",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);
      res.redirect("/nominal");
      console.log("🚀 ~ index: ~ error:", error);
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render("admin/nominal/create", {
        username: req.session.user.username,
        title: "Halaman Tambah Nominal",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);
      res.redirect("/nominal");
      console.log("🚀 ~ index: ~ error:", error);
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { _id } = req.params;

      let nominal = await Nominal.findOne({ _id });

      res.render("admin/nominal/edit", {
        nominal,
        username: req.session.user.username,
        title: "Halaman Ubah Nominal",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);
      res.redirect("/nominal");
      console.log("🚀 ~ index: ~ error:", error);
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { coinName, coinQuantity, price } = req.body;

      let nominal = await Nominal({ coinName, coinQuantity, price });
      await nominal.save();

      req.flash("alertMessage", "Berhasil tambah nominal");
      req.flash("alertStatus", "success");

      res.redirect("/nominal");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);
      res.redirect("/nominal");
      console.log("🚀 ~ index: ~ error:", error);
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { coinName, coinQuantity, price } = req.body;
      const { _id } = req.params;

      await Nominal.findOneAndUpdate(
        { _id },
        { coinName, coinQuantity, price }
      );

      req.flash("alertMessage", "Berhasil ubah nominal");
      req.flash("alertStatus", "success");

      res.redirect("/nominal");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);
      res.redirect("/nominal");
      console.log("🚀 ~ index: ~ error:", error);
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { _id } = req.params;

      await Nominal.findOneAndDelete({ _id });

      req.flash("alertMessage", "Berhasil hapus nominal");
      req.flash("alertStatus", "success");

      res.redirect("/nominal");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);
      res.redirect("/nominal");
      console.log("🚀 ~ index: ~ error:", error);
    }
  },
};
