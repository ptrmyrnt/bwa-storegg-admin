const Player = require("../player/model");
const path = require("path");
const fs = require("fs");
const config = require("../../config");

module.exports = {
  register: async (req, res, next) => {
    try {
      const payload = req.body;

      if (req.file) {
        let tmp_path = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = req.file.filename + "." + originalExt;
        let target_path = path.resolve(
          config.rootPath,
          `public/uploads/avatars/${filename}`
        );

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);

        src.on("end", async () => {
          try {
            const player = new Player({ ...payload, avatar: filename });

            await player.save();
            delete player._doc.password;
            res.status(201).json({ data: player });
          } catch (error) {
            if (error) {
              // dest.destroy(); // Hentikan writeStream jika terjadi error

              // Hapus file yang sudah tertulis jika terjadi error
              fs.unlink(target_path, (err) => {
                if (err) {
                  console.error("Error deleting the file:", err);
                }
              });

              if (error.name === "ValidationError") {
                return res.status(422).json({
                  error: 1,
                  message: error.message,
                  fields: error.errors,
                });
              }
            }

            next(error);
          }
        });

        // src.on("error", (err) => {
        //   console.error("Error reading the file:", err);
        //   dest.destroy(); // Hentikan writeStream jika terjadi error saat membaca
        //   next(err);
        // });

        // dest.on("error", (err) => {
        //   console.error("Error writing the file:", err);
        //   next(err);
        // });

        src.pipe(dest);
      } else {
        let player = new Player(payload);
        await player.save();
        delete player._doc.password;
        res.status(201).json({ data: player });
      }
    } catch (error) {
      if (error && error.name === "ValidationError") {
        return res.status(422).json({
          error: 1,
          message: error.message,
          fields: error.errors,
        });
      }

      next(error);
    }
  },
};
