const Router = require("express");
const router = new Router();
const authMiddleware = require("../middleware/authMiddleware");

const employeeController = require("../controller/employeeController.js");

router.post("/", employeeController.create);
router.get("/", employeeController.getAll);
router.get("/:id", employeeController.getOne);
router.delete("/del/:id", employeeController.deleteById);

module.exports = router