const Router = require("express");
const router = new Router();
const authMiddleware = require("../middleware/authMiddleware");

const MaterialController = require("../controller/materialController");

router.post("/", MaterialController.create);
router.get("/", MaterialController.getAll);
router.get("/:id", MaterialController.getOne);
router.delete("/del/:id", MaterialController.deleteById);

module.exports = router