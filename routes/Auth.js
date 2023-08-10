const AuthController = require("../controller/Auth.controller");
const multerMiddleware = require("../middlewares/multerMiddleware");
const authOnly = require("../middlewares/auth");
const Router = require("express").Router();

Router.post("/regist", multerMiddleware, AuthController.createUser);
Router.post("/login", AuthController.login);

module.exports = Router;