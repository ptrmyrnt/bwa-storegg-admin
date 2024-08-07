const Voucher = require("./model");
const Category = require("../category/model");
const Nominal = require("../nominal/model");
const path = require("path");
const fs = require("fs");
const config = require("../../config");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };

      const voucher = await Voucher.find({ name: { $not: { $regex: /_/ } } })
        .populate("category")
        .populate("nominals");

      res.render("admin/voucher/view_voucher", {
        voucher,
        alert,
        username: req.session.user.username,
        title: "Halaman Voucher",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);
      res.redirect("/voucher");
      console.log("🚀 ~ index: ~ error:", error);
    }
  },
  viewCreate: async (req, res) => {
    try {
      const category = await Category.find({ name: { $not: { $regex: /_/ } } });
      const nominal = await Nominal.find({
        coinName: { $not: { $regex: /_/ } },
      });

      res.render("admin/voucher/create", {
        category,
        nominal,
        username: req.session.user.username,
        title: "Halaman Tambah Voucher",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);
      res.redirect("/voucher");
      console.log("🚀 ~ index: ~ error:", error);
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { _id } = req.params;

      const category = await Category.find({ name: { $not: { $regex: /_/ } } });
      const nominal = await Nominal.find({
        coinName: { $not: { $regex: /_/ } },
      });
      const voucher = await Voucher.findOne({ _id })
        .populate("category")
        .populate("nominals");

      res.render("admin/voucher/edit", {
        category,
        nominal,
        voucher,
        username: req.session.user.username,
        title: "Halaman Ubah Voucher",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);
      res.redirect("/voucher");
      console.log("🚀 ~ index: ~ error:", error);
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { name, category, nominals } = req.body;

      if (req.file) {
        let tmp_path = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = req.file.filename + "." + originalExt;
        let target_path = path.resolve(
          config.rootPath,
          `public/uploads/${filename}`
        );

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);

        src.pipe(dest);

        src.on("end", async () => {
          try {
            const voucher = new Voucher({
              name,
              category,
              nominals,
              thumbnail: filename,
            });

            await voucher.save();

            req.flash("alertMessage", "Berhasil tambah voucher!");
            req.flash("alertStatus", "success");

            res.redirect("/voucher");
          } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", `danger`);
            res.redirect("/voucher");
            console.log("🚀 ~ index: ~ error:", error);
          }
        });
      } else {
        const voucher = new Voucher({
          name,
          category,
          nominals,
        });

        await voucher.save();

        req.flash("alertMessage", "Berhasil tambah voucher!");
        req.flash("alertStatus", "success");

        res.redirect("/voucher");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);
      res.redirect("/voucher");
      console.log("🚀 ~ index: ~ error:", error);
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { _id } = req.params;
      const { name, category, nominals } = req.body;

      if (req.file) {
        let tmp_path = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = req.file.filename + "." + originalExt;
        let target_path = path.resolve(
          config.rootPath,
          `public/uploads/${filename}`
        );

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);

        src.pipe(dest);

        src.on("end", async () => {
          try {
            const voucher = await Voucher.findOne({ _id });

            let currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;
            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage);
            }

            await Voucher.findOneAndUpdate(
              { _id },
              {
                name,
                category,
                nominals,
                thumbnail: filename,
              }
            );
            req.flash("alertMessage", "Berhasil ubah voucher!");
            req.flash("alertStatus", "success");

            res.redirect("/voucher");
          } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", `danger`);
            res.redirect("/voucher");
            console.log("🚀 ~ index: ~ error:", error);
          }
        });
      } else {
        await Voucher.findOneAndUpdate(
          { _id },
          {
            name,
            category,
            nominals,
          }
        );
        req.flash("alertMessage", "Berhasil ubah voucher!");
        req.flash("alertStatus", "success");

        res.redirect("/voucher");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);
      res.redirect("/voucher");
      console.log("🚀 ~ index: ~ error:", error);
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { _id } = req.params;

      const voucher = await Voucher.findOneAndDelete({ _id });

      let currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;
      if (fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage);
      }

      req.flash("alertMessage", "Berhasil hapus voucher!");
      req.flash("alertStatus", "success");

      res.redirect("/voucher");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);
      res.redirect("/voucher");
      console.log("🚀 ~ index: ~ error:", error);
    }
  },
  actionStatus: async (req, res) => {
    try {
      const { _id } = req.params;

      const voucher = await Voucher.findOne({ _id });

      const status = voucher.status === "Y" ? "N" : "Y";

      await Voucher.findOneAndUpdate(
        { _id },
        {
          status,
        }
      );

      req.flash("alertMessage", "Berhasil ubah status voucher!");
      req.flash("alertStatus", "success");

      res.redirect("/voucher");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);
      res.redirect("/voucher");
      console.log("🚀 ~ index: ~ error:", error);
    }
  },
};
