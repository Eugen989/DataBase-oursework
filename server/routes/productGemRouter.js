const Router = require("express");
const router = new Router();
const authMiddleware = require("../middleware/authMiddleware");

const ProductGemController = require("../controller/productGemController");

router.post("/", ProductGemController.create);
router.get("/", ProductGemController.getAll);
router.get("/:id", ProductGemController.getOne);
router.delete("/del/:id", ProductGemController.deleteById);

module.exports = router