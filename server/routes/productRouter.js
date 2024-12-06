const Router = require("express");
const router = new Router();
const authMiddleware = require("../middleware/authMiddleware");

const ProductController = require("../controller/productController");

router.post("/", ProductController.create);
router.get("/", ProductController.getAll);
router.get("/:id", ProductController.getOne);
router.delete("/del/:id", ProductController.deleteById);

module.exports = router