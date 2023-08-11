const { PrismaClient } = require('@prisma/client');
const { uploadImage } = require('../utils/cloudinary');
const fs = require('fs');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
  static async createUser(req, res) {
    if (!req.file) {
      const err = new Error('image harus di upload');
      err.errorStatus = 422;
      throw err;
    }

    try {
      const { username, password, email, total_score, biodata, city } =
        req.body;
      const upload = await uploadImage(req.file.path);
      await fs.unlinkSync(req.file.path);
      const imageUrl = upload.url;
      const hashPw = await bcrypt.hash(password, 12);
      const parsedTotalScore = parseInt(total_score);
      const player = await prisma.user.create({
        data: {
          username,
          password: hashPw,
          email,
          total_score: 0,
          biodata,
          city,
          image: imageUrl,
        },
      });

      //jika body tidak di isi
      if (!email || !username) {
        return res.status(404).json({
          result: 'Failed',
          messege: 'username atau password harus di isi',
        });
      }
      if (!password) {
        return res.status(404).json({
          result: 'Failed',
          messege: 'Password harus di isi',
        });
      }

      res.status(200).json({
        message: 'berhasil membuat data user',
        data: player,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: error.message });
    }
  }

  static async login(req, res) {
    try {
      // validation body
      const { username, password } = req.body;
      if (!username)
        return res.status(401).json({ msg: 'username cannot be empty!' });
      if (!password)
        return res.status(401).json({ msg: 'password cannot be empty!' });

      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) return res.status(401).json({ msg: 'user not found' });
      // validation password with jwt
      const compare = await bcrypt.compare(password, user.password);
      if (!compare)
        return res
          .status(401)
          .json({ auth: false, msg: "password doesn't match" });
      // handling login with jwt based id and username
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.TOKEN,
        (err, token) => {
          res.status(200).json({ auth: true, status: 'authorized', token });
        }
      );
    } catch (error) {
      res.send(error.message);
    }
  }
}

module.exports = AuthController;
