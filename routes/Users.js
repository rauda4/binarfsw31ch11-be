const multerMiddleware = require("../middlewares/multerMiddleware")
const UserController = require("../controller/User.controller");
const authOnly = require("../middlewares/auth");
const Router = require("express").Router();

// Router.use("/", UserController.getUser);
Router.get("/", UserController.getUsers);
Router.get("/:id", UserController.getUserById);
Router.put("/update/:id",multerMiddleware, UserController.updateUser);
Router.delete("/:id", UserController.deleteUser);

module.exports = Router;
