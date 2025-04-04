const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel"); //

require("dotenv").config();

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cek apakah user ada di database
    const user = await User.findByUsername(username); //
    if (!user) {
      return res.status(401).json({
        status: "error",
        code: 401,
        errors: [{ field: "auth" }],
        message: "Username tidak terdaftar",
      });
    }

    // Cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        code: 401,
        errors: [{ field: "auth" }],
        message: "Username atau password salah",
      });
    }

    // Buat token JWT
    const tokenExpiration = new Date();
    tokenExpiration.setHours(tokenExpiration.getHours() + 1); // Token berlaku 1 jam

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET, // Pakai variabel dari .env
      { expiresIn: "1h" }
    );

    // Response sukses
    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          department: user.department,
        },
        token: token,
        tokenExpiration: tokenExpiration.toISOString(),
      },
      message: "Login berhasil",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
