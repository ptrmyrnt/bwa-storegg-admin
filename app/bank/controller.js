const Bank = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };

      const bank = await Bank.find();

      res.render("admin/bank/view_bank", {
        bank,
        alert,
        username: req.session.user.username,
        title: "Halaman Bank",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
      console.log("🚀 ~ index: ~ err:", err);
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render("admin/bank/create", {
        username: req.session.user.username,
        title: "Halaman Tambah Bank",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
      console.log("🚀 ~ index: ~ err:", err);
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { _id } = req.params;

      const bank = await Bank.findOne({ _id });

      res.render("admin/bank/edit", {
        bank,
        username: req.session.user.username,
        title: "Halaman Ubah Bank",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
      console.log("🚀 ~ index: ~ err:", err);
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { bankName, name, noRekening } = req.body;

      const bank = await Bank({ bankName, name, noRekening });
      await bank.save();

      req.flash("alertMessage", "Berhasil tambah data bank.");
      req.flash("alertStatus", "success");

      res.redirect("/bank");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
      console.log("🚀 ~ index: ~ err:", err);
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { _id } = req.params;
      const { bankName, name, noRekening } = req.body;

      await Bank.findOneAndUpdate({ _id }, { bankName, name, noRekening });

      req.flash("alertMessage", "Berhasil ubah data bank.");
      req.flash("alertStatus", "success");

      res.redirect("/bank");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
      console.log("🚀 ~ index: ~ err:", err);
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { _id } = req.params;

      await Bank.findOneAndDelete({ _id });

      req.flash("alertMessage", "Berhasil hapus data bank.");
      req.flash("alertStatus", "success");

      res.redirect("/bank");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
      console.log("🚀 ~ index: ~ err:", err);
    }
  },
};
