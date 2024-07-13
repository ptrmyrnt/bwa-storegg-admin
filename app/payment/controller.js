const Payment = require("./model");
const Bank = require("../bank/model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };

      const payment = await Payment.find().populate("banks");

      res.render("admin/payment/view_payment", { payment, alert });
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

      res.render("admin/payment/create", { banks });
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
};