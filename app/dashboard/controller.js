const Transaction = require("../transaction/model");
const Voucher = require("../voucher/model");
const Category = require("../category/model");
const Player = require("../player/model");

module.exports = {
  index: async (req, res) => {
    try {
      const transaction = await Transaction.countDocuments();
      const voucher = await Voucher.countDocuments({
        name: { $not: { $regex: /_/ } },
      });
      const category = await Category.countDocuments({
        name: { $not: { $regex: /_/ } },
      });
      const player = await Player.countDocuments();

      res.render("index", {
        username: req.session.user.username,
        title: "Halaman Dashboard",
        count: {
          transaction,
          voucher,
          category,
          player,
        },
      });
    } catch (err) {
      console.log("🚀 ~ index: ~ err:", err);
    }
  },
};
