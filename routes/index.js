const router = require("express").Router()
const UsersRouter = require("./Users")
const GameRouter = require("./Games")
const auth = require("./Auth")

router.use("/players", UsersRouter)
router.use("/game", GameRouter)

//login handler
router.use("/auth", auth)

module.exports = router