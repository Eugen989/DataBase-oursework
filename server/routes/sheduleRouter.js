const Router = require("express");
const router = new Router();
const authMiddleware = require("../middleware/authMiddleware");

const SheduleController = require("../controller/sheduleController");

router.post("/", SheduleController.create);
router.get("/", SheduleController.getAll);
router.get("/:id", SheduleController.getOne);
router.delete("/del/:id", SheduleController.deleteById);

module.exports = router