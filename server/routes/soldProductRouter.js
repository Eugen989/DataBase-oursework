const Router = require("express");
const router = new Router();
const authMiddleware = require("../middleware/authMiddleware");

const SoldProductController = require("../controller/soldProductController");

router.post("/", SoldProductController.create);
router.get("/", SoldProductController.getAll);
router.get("/:id", SoldProductController.getOne);
router.delete("/del/:id", SoldProductController.deleteById);

module.exports = router