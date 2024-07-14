const mongoose = require("mongoose");

let playerSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: [true, "Email harus diisi!"],
    },
    username: {
      type: String,
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
  { timestamp: true }
);

module.exports = mongoose.model("Player", playerSchema);
