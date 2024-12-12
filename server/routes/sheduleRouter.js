const Router = require("express");
const router = new Router();
const authMiddleware = require("../middleware/authMiddleware");

const SheduleController = require("../controller/sheduleController");

router.post("/", SheduleController.create);
router.get("/", SheduleController.getAll);
router.get("/byId", SheduleController.getAllById);
router.get("/:id", SheduleController.getOne);
router.post("/update", SheduleController.updateById);
router.post("/del", SheduleController.deleteById);

module.exports = router