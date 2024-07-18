const Player = require("./model");
const Voucher = require("../voucher/model");

module.exports = {
  landingPage: async (req, res) => {
    try {
      const voucher = await Voucher.find({
        name: { $not: { $regex: /_/ } },
      })
        .select("_id name status category thumbnail")
        .populate("category");

      res.status(200).json({ data: voucher });
    } catch (error) {
      console.log("🚀 ~ landingPage: ~ error:", error);
      res
        .status(500)
        .json({ message: error.message || `Internal Server Error` });
    }
  },
  detailPage: async (req, res) => {
    try {
      const { _id } = req.params;

      const voucher = await Voucher.findOne({ _id })
        .populate("category")
        .populate("nominals")
        .populate("user", "_id name phoneNumber");

      if (!voucher) {
        return res.status(404).json({ message: "Voucher is not found!" });
      }

      res.status(200).json({ data: voucher });
    } catch (error) {
      console.log("🚀 ~ detailPage: ~ error:", error);
      res
        .status(500)
        .json({ message: error.message || `Internal Server Error` });
    }
  },
};
