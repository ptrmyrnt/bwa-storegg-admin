const Transaction = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };

      const transaction = await Transaction.find()
        .populate("player")
        .populate("category")
        .populate("voucherTopup")
        .populate("user");

      res.render("admin/transaction/view_transaction", {
        transaction,
        alert,
        username: req.session.user.username,
        title: "Halaman Transaksi",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/transaction");
      console.log("🚀 ~ index: ~ err:", err);
    }
  },
  actionStatus: async (req, res) => {
    try {
      const { _id } = req.params;
      const { status } = req.query;

      await Transaction.findOneAndUpdate({ _id }, { status });

      req.flash("alertMessage", `Berhasil ubah status transaksi.`);
      req.flash("alertStatus", "success");
      res.redirect("/transaction");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/transaction");
      console.log("🚀 ~ index: ~ err:", err);
    }
  },
};
