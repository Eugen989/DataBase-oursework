const Router = require("express");
const router = new Router();
const authMiddleware = require("../middleware/authMiddleware");

const AuthorizationController = require("../controller/authorizationController");

router.post("/", AuthorizationController.create);
router.get("/", AuthorizationController.getAll);
router.delete("/del/:id", AuthorizationController.deleteUser);

router.post("/reg", AuthorizationController.registration);
router.post("/log", AuthorizationController.login);
router.get("/auth", authMiddleware, AuthorizationController.check);
router.post("/info", authMiddleware, AuthorizationController.AuthorizationInfo);
// router.post("/setImg", authMiddleware, userController.setImg);

module.exports = router