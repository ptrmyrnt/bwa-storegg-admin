const Payment = require("./model");
const Bank = require("../bank/model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };

      const payment = await Payment.find().populate("banks");

      res.render("admin/payment/view_payment", {
        payment,
        alert,
        username: req.session.user.username,
        title: "Halaman Metode Pembayaran",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
      console.log("🚀 ~ index: ~ err:", err);
    }
  },
  viewCreate: async (req, res) => {
    try {
      const banks = await Bank.find();

      res.render("admin/payment/create", {
        banks,
        username: req.session.user.username,
        title: "Halaman Tambah Metode Pembayaran",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
      console.log("🚀 ~ index: ~ err:", err);
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { _id } = req.params;

      const payment = await Payment.findOne({ _id }).populate("banks");
      const banks = await Bank.find();

      res.render("admin/payment/edit", {
        payment,
        banks,
        username: req.session.user.username,
        title: "Halaman Ubah Metode Pembayaran",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
      console.log("🚀 ~ index: ~ err:", err);
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { type, banks } = req.body;

      const payment = await Payment({ type, banks });
      await payment.save();

      req.flash("alertMessage", "Berhasil tambah data pembayaran.");
      req.flash("alertStatus", "success");

      res.redirect("/payment");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
      console.log("🚀 ~ index: ~ err:", err);
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { _id } = req.params;
      const { type, banks } = req.body;

      await Payment.findOneAndUpdate({ _id }, { type, banks });

      req.flash("alertMessage", "Berhasil ubah data pembayaran.");
      req.flash("alertStatus", "success");

      res.redirect("/payment");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
      console.log("🚀 ~ index: ~ err:", err);
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { _id } = req.params;

      await Payment.findOneAndDelete({ _id });

      req.flash("alertMessage", "Berhasil hapus data pembayaran.");
      req.flash("alertStatus", "success");

      res.redirect("/payment");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
      console.log("🚀 ~ index: ~ err:", err);
    }
  },
  actionStatus: async (req, res) => {
    try {
      const { _id } = req.params;

      const payment = await Payment.findOne({ _id });

      const status = payment.status === "Y" ? "N" : "Y";

      await Payment.findOneAndUpdate({ _id }, { status });

      req.flash("alertMessage", "Berhasil ubah data status pembayaran.");
      req.flash("alertStatus", "success");

      res.redirect("/payment");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
      console.log("🚀 ~ index: ~ err:", err);
    }
  },
};
