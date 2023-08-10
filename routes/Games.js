const GameController = require("../controller/Game.controller");
const Router = require("express").Router()

Router.post("/rooms", GameController.createRoom)
Router.get("/rooms", GameController.getRooms)
Router.get("/rooms/:id", GameController.getRoomsById)
Router.post("/rooms/:id/plays", GameController.updateScore)

module.exports = Router;