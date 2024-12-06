const Router = require("express");
const router = new Router();
const authMiddleware = require("../middleware/authMiddleware");

const GemController = require("../controller/gemController");

router.post("/", GemController.create);
router.get("/", GemController.getAll);
router.get("/:id", GemController.getOne);
router.delete("/del/:id", GemController.deleteById);

module.exports = router