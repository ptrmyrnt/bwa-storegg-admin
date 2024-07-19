const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const HASH_ROUND = 10;

let playerSchema = mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      require: [true, "Email harus diisi!"],
    },
    username: {
      type: String,
      unique: true,
      require: [true, "Username harus diisi!"],
      minLength: [3, "Panjang username harus antara 3 - 25 karakter."],
      maxLength: [225, "Panjang username harus antara 3 - 25 karakter."],
    },
    name: {
      type: String,
      require: [true, "Nama harus diisi!"],
      minLength: [3, "Panjang nama harus antara 3 - 25 karakter."],
      maxLength: [225, "Panjang nama harus antara 3 - 25 karakter."],
    },
    password: {
      type: String,
      require: [true, "Kata sandi harus diisi!"],
      minLength: [8, "Panjang password minimal 8 karakter."],
    },
    phoneNumber: {
      type: String,
      require: [true, "Nomor telepon harus diisi!"],
      minLength: [9, "Panjang harus antara 9 - 13 karakter."],
      maxLength: [13, "Panjang harus antara 9 - 13 karakter."],
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
    favorite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

playerSchema.path("email").validate(
  async function (value) {
    try {
      const count = await this.model("Player").countDocuments({ email: value });

      return !count;
    } catch (error) {
      throw error;
    }
  },
  (attr) => `${attr.value} telah terdaftar`
);

playerSchema.pre("save", function (next) {
  this.password = bcryptjs.hashSync(this.password, HASH_ROUND);
  next();
});

module.exports = mongoose.model("Player", playerSchema);
