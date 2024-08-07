const Voucher = require("../voucher/model");
const Category = require("../category/model");
const Nominal = require("../nominal/model");
const Payment = require("../payment/model");
const Bank = require("../bank/model");
const Transaction = require("../transaction/model");

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
  category: async (req, res) => {
    try {
      const data = await Category.find({
        name: { $not: { $regex: /_/ } },
      });

      res.status(200).json({ data });
    } catch (error) {
      console.log("🚀 ~ detailPage: ~ error:", error);
      res
        .status(500)
        .json({ message: error.message || `Internal Server Error` });
    }
  },
  checkout: async (req, res) => {
    try {
      const { accountUser, name, nominal, voucher, payment, bank } = req.body;

      const res_voucher = await Voucher.findOne({ _id: voucher })
        .select("name category _id thumbnail user")
        .populate("category")
        .populate("user");

      if (!res_voucher)
        return res.status(404).json({ message: "Voucher not found!" });

      const res_nominal = await Nominal.findOne({ _id: nominal });

      if (!res_nominal)
        return res.status(404).json({ message: "Nominal not found!" });

      const res_payment = await Payment.findOne({ _id: payment });

      if (!res_payment)
        return res.status(404).json({ message: "Payment not found!" });

      const res_bank = await Bank.findOne({ _id: bank });

      if (!res_bank)
        return res.status(404).json({ message: "Bank not found!" });

      let tax = (11 / 100) * res_nominal._doc.price;
      let value = res_nominal._doc.price + tax;

      const payload = {
        historyVoucherTopup: {
          gameName: res_voucher._doc.name,
          category: res_voucher._doc.category
            ? res_voucher._doc.category.name
            : "",
          thumbnail: res_voucher._doc.thumbnail,
          coinName: res_nominal._doc.coinName,
          coinQuantity: res_nominal._doc.coinQuantity,
          price: res_nominal._doc.price,
        },
        historyPayment: {
          name: res_bank._doc.name,
          type: res_payment._doc.type,
          bankName: res_bank._doc.bankName,
          noRekening: res_bank._doc.noRekening,
        },
        name,
        accountUser,
        tax,
        value,
        voucherTopup: res_voucher._doc._id,
        player: req.player._id,
        historyUser: {
          name: res_voucher._doc.user?.name,
          phoneNumber: res_voucher._doc.user?.phoneNumber,
        },
        category: res_voucher._doc.category?._id,
        user: res_voucher._doc.user?._id,
      };

      const transaction = new Transaction(payload);
      await transaction.save();

      res.status(201).json({ data: transaction });
    } catch (error) {
      console.log("🚀 ~ checkout: ~ error:", error);
      res
        .status(500)
        .json({ message: error.message || `Internal Server Error` });
    }
  },
  history: async (req, res) => {
    try {
      const { status = "" } = req.query;

      let criteria = {};

      if (status.length) {
        criteria = {
          ...criteria,
          status: { $regex: `${status}`, $options: "i" },
        };
      }

      if (req.player._id) {
        criteria = {
          ...criteria,
          player: req.player._id,
        };
      }

      const history = await Transaction.find(criteria);

      let total = await Transaction.aggregate([
        { $match: criteria },
        {
          $group: {
            _id: null,
            value: { $sum: "$value" },
          },
        },
      ]);

      res.status(200).json({
        data: history,
        total: total.length ? total[0].value : 0,
      });
    } catch (error) {
      console.log("🚀 ~ history: ~ error:", error);
      res
        .status(500)
        .json({ message: error.message || `Internal Server Error` });
    }
  },
  historyDetail: async (req, res) => {
    try {
      const { _id } = req.params;
      const history = await Transaction.findOne({ _id });
      if (!history)
        return res.status(404).json({ message: "History Not Found!" });
      res.status(200).json({ data: history });
    } catch (error) {
      console.log("🚀 ~ historyDetail: ~ error:", error);
      res
        .status(500)
        .json({ message: error.message || `Internal Server Error` });
    }
  },
};
