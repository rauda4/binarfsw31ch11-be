const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const cloudinary = require('../utils/cloudinary')
const fs = require("fs");


class UserController {
  static async getUsers(req, res) {
    try {
      const users = await prisma.user.findMany();

      if (!users) {
        return res.status(400).json({
          result: "Failed",
          message: "Tidak ada data",
        });
      }
      res.status(200).json({
        result: "Success get users",
        payload: users,
      });
    } catch (error) {
      res.status(500).json({msg:error.message});
    }
  }

  // auda
  static async getUserById(req, res) {
    try {
      const {id} = req.params;
      const players = await prisma.user.findUnique({where:{id}})
      
      if(!players) return res.status(400).json({
        result:"user not found"
      })
      res.status(200).json({message:`succes get player by id ${id}`, data: players})
    } catch (error) {
      res.status(500).json({msg:error.message});
    }
  }

  //micho
  static async updateUser(req, res) {
    const { id } = req.params; // Mendapatkan ID user dari parameter URL
    const { username, password, email, total_score, biodata, city } = req.body;

    try {
      // Cek apakah user dengan ID yang diberikan ada di database
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        return res.status(404).json({
          result: "Failed",
          message: "User tidak ditemukan",
        });
      }

      // Proses unggah gambar baru ke Cloudinary (jika ada)
      let imageUrl = user.image;
      if (req.file) {
       
        const result = await cloudinary.uploadImage(req.file.path);
        await fs.unlinkSync(req.file.path);
        imageUrl = result.secure_url;
      }

      // Update data user dengan nilai baru termasuk URL gambar baru dari Cloudinary
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          username: username || user.username,
          password: password ? await bcrypt.hash(password, 12) : user.password,
          email: email || user.email,
          total_score: total_score ? parseInt(total_score) : user.total_score,
          biodata: biodata || user.biodata,
          city: city || user.city,
          image: imageUrl, // Gunakan URL gambar baru dari Cloudinary (atau gunakan nilai asli jika tidak ada unggahan gambar baru)
        },
      });

      res.status(200).json({
        message: `Berhasil memperbarui pengguna dengan ID ${id}`,
        data: updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        result: "Failed",
        message: "Ada kesalahan saat memperbarui data",
      });
    }
  }

  // delete
  static async deleteUser(req, res) {
    const { id } = req.params;

    try {
      // delete data user
      const deleteUser = await prisma.user.delete({
        where: { id },
      });

      res.status(200).json({
        message: " User deleted",
        data: deleteUser,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = UserController;
