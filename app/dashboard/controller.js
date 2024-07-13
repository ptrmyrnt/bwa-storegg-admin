module.exports = {
  index: async (req, res) => {
    try {
      res.render("index", {
        username: req.session.user.username,
        title: "Halaman Dashboard",
      });
    } catch (err) {
      console.log("🚀 ~ index: ~ err:", err);
    }
  },
};
